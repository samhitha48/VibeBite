import { useState } from "react";
import { Checkbox } from "../Checkbox/Checkbox";

const Filter = () => {
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

  console.log(moodList);
  console.log("mood", moods);
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mx-4">
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
