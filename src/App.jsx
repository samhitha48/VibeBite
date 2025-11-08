import { useState, useCallback } from "react";
import { Filter } from "./components/Filter/Filter";
import Button from "./components/Button/Button";
import Randomizer from "./components/Randomizer/Randomizer";
import RandomSelection from "./components/RandomSelection/RandomSelection";

const features = [
  {
    title: "Curated Playlists",
    description:
      "Fuel every gathering with playlists that match the mood and keep the vibes high.",
  },
  {
    title: "Crowd-Sourced Favorites",
    description:
      "Let your crew vote, request, and remix the soundtrack in real time.",
  },
  {
    title: "Instant Ambience",
    description:
      "Pair food, lighting, and music recommendations tuned for your venue.",
  },
];

export default function App() {
  const [showFilter, setShowFilter] = useState(false);
  const [manualFilters, setManualFilters] = useState({
    location: "",
    categories: [],
    radius: 5,
    price: 2,
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
    setManualFilters((prev) => ({
      ...prev,
      categories: selectedAlias ? [selectedAlias] : [],
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

  const handleSubmit = () => {
    console.log("submitted");
    //post to api
  };

  return (
    <main className="grid grid-cols-12 gap-6 mx-auto max-w-[1440px] bg-white h-screen flex-col gap-12 rounded-lg shadow-md">
      <section className="col-span-full flex flex-col text-center h-full">
        <header className="flex justify-between items-between px-6 py-6 bg-primary-500 border-solid border-b-[8px] border-accent-brown">
          <p>Logo here</p>
        </header>
        <div className="flex-1 space-y-6 text-center py-6">
          <div id="buttons-container" className="flex gap-4 justify-center">
            <Button onClick={toggleFilter} text="I'll pick what I want" />
            <Randomizer
              setShowFilter={setShowFilter}
              showFilter={showFilter}
              randomSelection={randomSelection}
              setRandomSelection={setRandomSelection}
            />
          </div>
          <div
            className={`overflow-hidden transition-all duration-500 ease-in-out py-3 ${
              showFilter ? "max-h-[2000px] opacity-100" : "max-h-0 opacity-0"
            }`}
          >
            <Filter
              filters={manualFilters}
              onLocationChange={handleLocationChange}
              onCuisineSelect={handleCuisineSelect}
              onRadiusChange={handleRadiusChange}
              onPriceChange={handlePriceChange}
            />
          </div>
          <div
            className={`overflow-hidden transition-all duration-500 ease-in-out py-3 ${
              randomSelection
                ? "max-h-[2000px] opacity-100"
                : "max-h-0 opacity-0"
            }`}
          >
            <RandomSelection
              randomSelection={randomSelection}
              onRadiusChange={handleRadiusChange}
              onLocationChange={handleLocationChange}
              handleSubmit={handleSubmit}
            />
          </div>
        </div>
        <footer className="flex justify-center py-4">
          &copy; {currentYear} VibeBite
        </footer>
      </section>
    </main>
  );
}
