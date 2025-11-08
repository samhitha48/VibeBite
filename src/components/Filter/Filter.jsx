import { useState } from "react";
import { Checkbox } from "../Checkbox/Checkbox";

const Filter = ({
  filters = { location: "", categories: [], radius: 1600, price: 2 },
  onLocationChange = () => {},
  onCuisineSelect = () => {},
  onRadiusChange = () => {},
  onPriceChange = () => {},
}) => {
  const [moods, setMoods] = useState([]);

  const handleMood = (mood) => {
    setMoods((prev) =>
      prev.includes(mood) ? prev.filter((m) => m !== mood) : [...prev, mood]
    );
  };
  const moodList = [
    {
      name: "Celebration",
      description: "Big wins, birthdays, or nights worth toasting.",
      emoji: "🎉",
    },
    {
      name: "Treat Yourself",
      description: "Decadent desserts, cocktails, or fine dining indulgence.",
      emoji: "🍰",
    },
    {
      name: "Spicy",
      description: "Turn up the heat - bold flavors and fiery dishes.",
      emoji: "️🌶",
    },
    {
      name: "Fall Feels",
      description: "Warm flavors, comfort dishes, pumpkin everything.",
      emoji: "🍂",
    },
    {
      name: "Light 'n' Fresh",
      description: "Salads, wraps, smoothies. Something crisp and clean.",
      emoji: "🥗",
    },
    {
      name: "Date Night",
      description: "Romantic ambiance, good wine, and shared plates.",
      emoji: "💕",
    },
    {
      name: "Greasy Goodness",
      description: "Burgers, fries, and all the cheat-day eats.",
      emoji: "🍔",
    },
    {
      name: "Quick & Easy",
      description: "Fast, easy, and satisfying when you’re on the go.",
      emoji: "⚡",
    },
    {
      name: "Cozy",
      description: "Warm soups, comfort food, and chill café vibes.",
      emoji: "☕",
    },
  ];

  const radiusValue =
    typeof filters.radius === "number" && Number.isFinite(filters.radius)
      ? filters.radius
      : 1600;

  const priceValue =
    typeof filters.price === "number" && Number.isFinite(filters.price)
      ? filters.price
      : 2;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mx-4 p-6 shadow-[0_0_15px_rgba(0,0,0,0.3)] rounded-lg">
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
        return (
          <Checkbox
            key={item.name}
            name={item.name}
            description={item.description}
            emoji={item.emoji}
            callback={handleMood}
          />
        );
      })}
    </div>
  );
};

export { Filter };
