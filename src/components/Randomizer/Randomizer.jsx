import { useCallback } from "react";
import Button from "../Button/Button";
import moodData from "../../data/moods.json";

const moodEntries = Array.isArray(moodData?.mood_map) ? moodData.mood_map : [];

const OPTIONS = moodEntries
  .map(({ mood, emoji }) => {
    if (!mood) {
      return null;
    }
    return emoji ? `${emoji} ${mood}` : mood;
  })
  .filter(Boolean);

export default function Randomizer({
  setShowFilter,
  showFilter,
  randomSelection,
  setRandomSelection,
  onMoodSelect,
}) {
  const handleRandomize = useCallback(() => {
    if (randomSelection) {
      setRandomSelection(null);
      onMoodSelect?.(null, randomSelection);
      return;
    }
    const randomIndex = Math.floor(Math.random() * OPTIONS.length);
    const selected = OPTIONS[randomIndex];

    if (showFilter) {
      setShowFilter(false);
    }
    setRandomSelection(selected);
    onMoodSelect?.(selected, randomSelection);
  }, [randomSelection, showFilter, onMoodSelect, setShowFilter, setRandomSelection]);

  return <Button text="Pick for me" onClick={handleRandomize} />;
}
