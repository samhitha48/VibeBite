import { useState, useCallback } from "react";
import { Filter } from "./components/Filter/Filter";
import Button from "./components/Button/Button";
import Randomizer from "./components/Randomizer/Randomizer";
import Card from "./components/Card/Card";

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
  const [results, setResults] = useState([]);

  const [manualFilters, setManualFilters] = useState({
    location: "",
    categories: [],
    radius: 5,
    price: 2,
  });
  const date = new Date();
  const currentYear = date.getFullYear();

  const toggleFilter = () => {
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

  return (
    <div className="h-screen flex flex-col bg-white">
      <main className="grid grid-cols-12 grid-rows-[auto_auto_1fr] mx-auto max-w-[1440px] w-full rounded-lg shadow-md flex-1">
        <header className="col-span-full flex justify-between items-center px-6 py-6 bg-primary-500 border-solid border-b-[8px] border-accent-brown">
          <p>Logo here</p>
        </header>
        <div className="col-span-full flex gap-4 justify-center py-6">
          <Button onClick={toggleFilter} text="I'll pick what I want" />
          <Randomizer />
        </div>

        <div
          className={`col-span-full md:col-start-3 md:col-span-8 overflow-hidden transition-all duration-500 ease-in-out ${
            showFilter ? "max-h-[2000px] opacity-100 py-3" : "max-h-0 opacity-0"
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
        {/* Results */}
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
