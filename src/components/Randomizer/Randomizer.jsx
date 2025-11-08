import { useCallback } from "react";
import Button from "../Button/Button";

const OPTIONS = [
  "🎉 Celebration",
  "🍰 Treat Yourself",
  "🌶️ Spicy",
  "🍂 Fall Feels",
  "🥗 Light ‘n’ Fresh",
  "💕 Date Night",
  "🍔 Greasy Goodness",
  "⚡️ Quick & Easy",
  "☕️ Cozy",
];

export default function Randomizer({
  setShowFilter,
  showFilter,
  randomSelection,
  setRandomSelection,
}) {
  const handleRandomize = useCallback(() => {
    if (randomSelection) {
      setRandomSelection(null);
      return;
    }
    const randomIndex = Math.floor(Math.random() * OPTIONS.length);
    const selected = OPTIONS[randomIndex];

    if (showFilter) {
      setShowFilter(false);
    }
    setRandomSelection(selected);
  }, [randomSelection, showFilter]);

  return <Button text="Pick for me" onClick={handleRandomize} />;
}
