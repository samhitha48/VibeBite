import { useState, useCallback } from "react";
import { Filter } from "./components/Filter/Filter";
import Button from "./components/Button/Button";
import Randomizer from "./components/Randomizer/Randomizer";
import RandomSelection from "./components/RandomSelection/RandomSelection";
import Card from "./components/Card/Card";
import { getMoodFilters, mergeMoodWithFilters } from "./utils/moodHelpers";

const buildSearchParams = (filters) => {
  const params = new URLSearchParams();
  if (filters.location) {
    params.set("location", filters.location);
  }
  if (Array.isArray(filters.categories) && filters.categories.length) {
    params.set("categories", filters.categories.join(","));
  }
  if (Array.isArray(filters.attributes) && filters.attributes.length) {
    params.set("attributes", filters.attributes.join(","));
  }
  if (Array.isArray(filters.moods) && filters.moods.length) {
    params.set("moods", filters.moods.join(","));
  }
  if (filters.radius) {
    params.set("radius", `${filters.radius}`);
  }
  if (filters.price) {
    params.set("price", `${filters.price}`);
  }
  return params;
};

export default function App() {
  const [showFilter, setShowFilter] = useState(false);
  const [results, setResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState("");

  const [manualFilters, setManualFilters] = useState({
    location: "",
    categories: [],
    attributes: [],
    radius: 5,
    price: 2,
    moods: [],
  });
  const [randomSelection, setRandomSelection] = useState(null);
  const date = new Date();
  const currentYear = date.getFullYear();

  const toggleFilter = () => {
    if (randomSelection) setRandomSelection(null);
    setShowFilter((prev) => !prev);
  };

  const handleLocationChange = useCallback((nextLocation) => {
    setManualFilters((prev) => ({
      ...prev,
      location: nextLocation,
    }));
  }, []);

  const handleCuisineSelect = useCallback((selectedAlias) => {
    const normalizedCategories = selectedAlias
      ? selectedAlias
          .split(",")
          .map((alias) => alias.trim())
          .filter(Boolean)
      : [];

    setManualFilters((prev) => ({
      ...prev,
      categories: normalizedCategories,
    }));
  }, []);

  const handleRadiusChange = useCallback((nextRadius) => {
    setManualFilters((prev) => ({
      ...prev,
      radius: nextRadius,
    }));
  }, []);

  const handlePriceChange = useCallback((nextPrice) => {
    setManualFilters((prev) => ({
      ...prev,
      price: nextPrice,
    }));
  }, []);

  const handleMoodToggle = useCallback((moodName) => {
    setManualFilters((prev) => {
      const currentMoods = Array.isArray(prev.moods) ? prev.moods : [];
      const hasMood = currentMoods.includes(moodName);
      const nextMoods = hasMood
        ? currentMoods.filter((existing) => existing !== moodName)
        : [...currentMoods, moodName];

      const aggregatedAttributes = Array.from(
        new Set(nextMoods.flatMap((mood) => getMoodFilters(mood).attributes))
      );

      return {
        ...prev,
        moods: nextMoods,
        attributes: aggregatedAttributes,
      };
    });
  }, []);

  const handleRandomMoodSelect = useCallback((nextMood, previousMood) => {
    if (!nextMood) {
      setManualFilters((prev) => {
        const currentMoods = Array.isArray(prev.moods) ? prev.moods : [];
        const filteredMoods = currentMoods.filter(
          (mood) => mood !== previousMood
        );
        return {
          ...prev,
          moods: filteredMoods,
        };
      });
      return;
    }

    setManualFilters((prev) => {
      const merged = mergeMoodWithFilters(nextMood, prev);
      const currentMoods = Array.isArray(prev.moods) ? prev.moods : [];
      const sanitizedMoods = currentMoods.filter(
        (mood) => mood !== previousMood
      );
      return {
        ...merged,
        moods: Array.from(new Set([...sanitizedMoods, nextMood])),
      };
    });
  }, []);

  const handleSearch = useCallback(
    async (overrideFilters) => {
      const candidateFilters =
        overrideFilters &&
        typeof overrideFilters === "object" &&
        typeof overrideFilters.preventDefault !== "function"
          ? overrideFilters
          : undefined;
      const activeFilters = candidateFilters ?? manualFilters;
      const searchParams = buildSearchParams(activeFilters);
    setIsSearching(true);
    setSearchError("");
    try {
      const response = await fetch(
        `https://vibebite-tddq.onrender.com/yelp/search?${searchParams.toString()}`
      );
      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
      }
      const data = await response.json();

      console.log(data);
      const businesses = Array.isArray(data?.businesses)
        ? data.businesses
        : Array.isArray(data?.vibes)
        ? data.vibes
        : Array.isArray(data)
        ? data
        : [];

      const PLACEHOLDER_IMAGE =
        "https://via.placeholder.com/400x300.png?text=VibeBite";

      const mappedResults = businesses
        .map((entry, index) => {
          if (!entry) {
            return null;
          }

          if (typeof entry === "string") {
            return {
              id: `vibe-${index}`,
              image: PLACEHOLDER_IMAGE,
              name: entry,
              expense: "",
              distance: "",
              vibes: [entry],
              starRating: 0,
              siteLink: "#",
            };
          }

          const {
            id,
            alias,
            name,
            image_url,
            price,
            distance,
            rating,
            url,
            categories,
          } = entry;

          const distanceInMiles =
            typeof distance === "number" && Number.isFinite(distance)
              ? Number((distance / 1609.34).toFixed(1))
              : "";

          const vibeLabels = Array.isArray(categories)
            ? categories
                .map((category) => category?.title)
                .filter(Boolean)
                .slice(0, 3)
            : [];

          return {
            id: id ?? alias ?? `business-${index}`,
            image: image_url ?? PLACEHOLDER_IMAGE,
            name: name ?? "Unknown",
            expense: price ?? "",
            distance: distanceInMiles,
            vibes: vibeLabels,
            starRating: rating ?? 0,
            siteLink: url ?? "#",
          };
        })
        .filter(Boolean);

      setResults(mappedResults);
    } catch (error) {
      setSearchError(
        error instanceof Error ? error.message : "Something went wrong"
      );
      setResults([]);
    } finally {
      setIsSearching(false);
    }
    },
    [manualFilters]
  );

  const handleRandomSelectionSearch = useCallback(
    (enhancedFilters) => {
      if (!enhancedFilters) {
        return;
      }
      handleSearch(enhancedFilters);
    },
    [handleSearch]
  );

  return (
    <div className="h-screen flex flex-col bg-white">
      <main className="grid grid-cols-12 grid-rows-[auto_auto_1fr] mx-auto max-w-[1440px] w-full rounded-lg shadow-md flex-1">
        <header className="col-span-full flex justify-between items-center px-6 py-6 bg-primary-500 border-solid border-b-[8px] border-accent-brown">
          <p>Logo here</p>
        </header>
        <div className="col-span-full flex gap-4 justify-center py-6">
          <Button onClick={toggleFilter} text="I'll pick what I want" />
          <Randomizer
            setShowFilter={setShowFilter}
            showFilter={showFilter}
            randomSelection={randomSelection}
            setRandomSelection={setRandomSelection}
            onMoodSelect={handleRandomMoodSelect}
          />
        </div>
        <div
          className={`col-span-full md:col-start-2 md:col-span-10 lg:col-start-3 lg:col-span-8 overflow-hidden transition-all duration-500 ease-in-out ${
            showFilter ? "max-h-[2000px] opacity-100 py-3" : "max-h-0 opacity-0"
          }`}
        >
          <Filter
            filters={manualFilters}
            onLocationChange={handleLocationChange}
            onCuisineSelect={handleCuisineSelect}
            onRadiusChange={handleRadiusChange}
            onPriceChange={handlePriceChange}
            onMoodToggle={handleMoodToggle}
            onSearch={handleSearch}
            isSearching={isSearching}
          />
        </div>

        <div
          className={`col-span-full md:col-start-3 md:col-span-8 overflow-hidden transition-all duration-500 ease-in-out ${
            randomSelection
              ? "max-h-[2000px] opacity-100 py-3"
              : "max-h-0 opacity-0"
          }`}
        >
          <RandomSelection
            showFilter={showFilter}
            randomSelection={randomSelection}
            onRadiusChange={handleRadiusChange}
            onLocationChange={handleLocationChange}
            filters={manualFilters}
            onSearch={handleRandomSelectionSearch}
            isSearching={isSearching}
          />
        </div>
        {/* Results */}
        {searchError && (
          <p className="col-span-full text-center text-red-600 font-semibold">
            {searchError}
          </p>
        )}
        {results.length > 0 && (
          <>
            <h2 className="col-span-full text-2xl font-bold px-6 mt-6">
              Results
            </h2>
            <div className="col-span-full grid grid-cols-1 md:grid-cols-3 gap-4 px-6 pb-6">
              {results.map((result) => (
                <Card key={result.id} {...result} />
              ))}
            </div>
          </>
        )}
      </main>
      <footer className="flex justify-center py-4">
        &copy; {currentYear} VibeBite
      </footer>
    </div>
  );
}
