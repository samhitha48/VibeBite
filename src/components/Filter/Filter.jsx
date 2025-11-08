import moodData from "../../data/moods.json";
import { Checkbox } from "../Checkbox/Checkbox";
import CuisineDropdown from "../Input/CuisineDropdown";
import LocationInput from "../Input/LocationInput";
import Slider from "../Slider/Slider";
import Button from "../Button/Button";

const Filter = ({
  filters = {
    location: "",
    categories: [],
    attributes: [],
    radius: 5,
    price: 2,
    moods: [],
  },
  onLocationChange = () => {},
  onCuisineSelect = () => {},
  onRadiusChange = () => {},
  onPriceChange = () => {},
  onMoodToggle = () => {},
  onSearch = () => {},
  isSearching = false,
}) => {
  const selectedMoods = Array.isArray(filters.moods) ? filters.moods : [];
  const moodList = Array.isArray(moodData?.mood_map) ? moodData.mood_map : [];

  const radiusValue =
    typeof filters.radius === "number" && Number.isFinite(filters.radius)
      ? filters.radius
      : 5;

  const priceValue =
    typeof filters.price === "number" && Number.isFinite(filters.price)
      ? filters.price
      : 2;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mx-4 p-6 mb-6 shadow-[0_0_15px_rgba(0,0,0,0.3)] rounded-lg">
      <div className="col-span-full">
        <h3 className="block text-2xl w-full text-left">
          Pick a mood that fits your craving — you’ll get a quick description to
          guide your choice.
        </h3>
        <p className="block w-full text-left">
          Drop your location (and any extras if you want), and I’ll handle the
          rest. Drop your location (and any extras if you want), and I’ll handle
          the rest. Then add your location and any filters to fine-tune your
          food match.
        </p>
      </div>
      {moodList.map((item) => {
        const moodName = item.mood;
        return (
          <Checkbox
            key={moodName}
            name={moodName}
            description={item.description}
            emoji={item.emoji}
            callback={onMoodToggle}
            checked={selectedMoods.includes(moodName)}
          />
        );
      })}
      <div className="col-span-full mt-6">
        <h3 className="block text-2xl w-full text-left mb-4">
          Filter Options - Drop your location (and any extras if you want), and
          I’ll handle the rest.
        </h3>
        <div className="col-span-full grid grid-cols-1 md:grid-cols-2 gap-4">
          <LocationInput
            value={filters.location ?? ""}
            onValidLocation={onLocationChange}
          />
          <CuisineDropdown
            value={Array.isArray(filters.categories) ? filters.categories[0] ?? "" : ""}
            onSelect={onCuisineSelect}
          />
        </div>
        <div className="col-span-full grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <Slider
            label="Distance"
            measurement="miles"
            min={5}
            max={100}
            step={1}
            value={radiusValue}
            valueSetter={onRadiusChange}
          />
          <Slider
            label="Price"
            measurement="$"
            min={1}
            max={4}
            step={1}
            value={priceValue}
            valueSetter={onPriceChange}
          />
          {/* <Slider
            label="Rating"
            measurement="stars"
            value={rating}
            valueSetter={onRatingChange}
          /> */}
        </div>
      </div>
      <div className="col-span-full flex items-center w-full mt-8 justify-center">
        <Button
          text={isSearching ? "Searching..." : "Search My Vibes"}
          onClick={onSearch}
        ></Button>
      </div>
    </div>
  );
};

export { Filter };
