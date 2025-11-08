import Button from "../Button/Button";
import LocationInput from "../Input/LocationInput";
import Slider from "../Slider/Slider";

export default function RandomSelection({
  randomSelection,
  onRadiusChange,
  onLocationChange,
  handleSubmit,
  filters = {
    location: "",
    categories: [],
    attributes: [],
    radius: 1600,
    price: 2,
  },
}) {
  const radiusValue =
    typeof filters.radius === "number" && Number.isFinite(filters.radius)
      ? filters.radius
      : 1600;
  return (
    <div className="flex flex-col gap-12 mx-4 p-6 shadow-[0_0_15px_rgba(0,0,0,0.3)] rounded-lg">
      <h3 className="block text-xl w-full text-left">
        Absolutely! Share your spot and I’ll match you with the perfect vibes.
      </h3>
      <h3 className="block text-sm w-full text-left">
        We're feeling you'd like: <span>{randomSelection}</span>
      </h3>
      <div className="flex gap-16">
        <LocationInput onValidLocation={onLocationChange} />
        <Slider
          label="Location (zip code)"
          measurement="meters"
          min={400}
          max={40000}
          step={400}
          value={radiusValue}
          valueSetter={onRadiusChange}
        />
      </div>
      <div className="max-w-s">
        <Button text="Search" size="small" />
      </div>
    </div>
  );
}
