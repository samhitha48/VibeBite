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

export default function Randomizer() {
  const handleRandomize = useCallback(() => {
    const randomIndex = Math.floor(Math.random() * OPTIONS.length);
    const selected = OPTIONS[randomIndex];
    console.log("Randomizer picked:", selected);
  }, []);

  return <Button text="Pick for me" onClick={handleRandomize} />;
}

