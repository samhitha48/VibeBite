import { useCallback, useMemo } from "react";
import Button from "../Button/Button";
import LocationInput from "../Input/LocationInput";
import Slider from "../Slider/Slider";
import { mergeMoodWithFilters } from "../../utils/moodHelpers";

export default function RandomSelection({
  randomSelection,
  onRadiusChange,
  onLocationChange,
  onSearch,
  filters = {
    location: "",
    categories: [],
    attributes: [],
    radius: 5,
    price: 2,
  },
  isSearching = false,
}) {
  const derivedFilters = useMemo(() => {
    if (!randomSelection) {
      return filters;
    }

    return mergeMoodWithFilters(randomSelection, {
      ...filters,
      moods: [randomSelection],
    });
  }, [filters, randomSelection]);

  const radiusValue =
    typeof filters.radius === "number" && Number.isFinite(filters.radius)
      ? filters.radius
      : 5;

  const handleSearchClick = useCallback(() => {
    if (!randomSelection) {
      return;
    }
    onSearch?.(derivedFilters);
  }, [derivedFilters, onSearch, randomSelection]);

  return (
    <div className="flex flex-col gap-12 mx-4 p-6 shadow-[0_0_15px_rgba(0,0,0,0.3)] rounded-lg">
      <h3 className="block text-xl w-full text-left">
        Absolutely! Share your spot and I’ll match you with the perfect vibes.
      </h3>
      <h3 className="block text-sm w-full text-left">
        We're feeling you'd like: <span>{randomSelection}</span>
      </h3>
      <div className="flex gap-16">
        <LocationInput
          value={filters.location ?? ""}
          onValidLocation={onLocationChange}
        />
        <Slider
          label="Distance"
          measurement="miles"
          min={5}
          max={100}
          step={1}
          value={radiusValue}
          valueSetter={onRadiusChange}
        />
      </div>
      <div className="max-w-s">
        <Button
          text={isSearching ? "Searching..." : "Search"}
          size="small"
          onClick={handleSearchClick}
        />
      </div>
    </div>
  );
}
