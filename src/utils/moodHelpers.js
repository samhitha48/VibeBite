import moodData from "../data/moods.json";

const moodEntries = Array.isArray(moodData?.mood_map) ? moodData.mood_map : [];

const moodLookup = moodEntries.reduce((accumulator, entry) => {
  if (!entry) {
    return accumulator;
  }

  const { mood, emoji } = entry;
  const labeledMood = emoji ? `${emoji} ${mood}` : mood;

  if (labeledMood) {
    accumulator.set(labeledMood, entry);
  }

  if (mood) {
    accumulator.set(mood, entry);
  }

  return accumulator;
}, new Map());

const normalizeList = (list) =>
  Array.isArray(list)
    ? list
        .map((value) => `${value || ""}`.trim())
        .filter(Boolean)
    : [];

const splitCategories = (categories) =>
  normalizeList(categories).flatMap((category) =>
    category
      .split(",")
      .map((value) => value.trim())
      .filter(Boolean)
  );

export const getMoodFilters = (moodLabel) => {
  if (!moodLabel || typeof moodLabel !== "string") {
    return { categories: [], attributes: [] };
  }

  const normalizedLabel = moodLabel.trim();
  const matchedEntry = moodLookup.get(normalizedLabel);

  if (!matchedEntry) {
    return { categories: [], attributes: [] };
  }

  return {
    categories: normalizeList(matchedEntry.categories),
    attributes: normalizeList(matchedEntry.attributes),
  };
};

export const mergeMoodWithFilters = (moodLabel, existingFilters = {}) => {
  const { categories: moodCategories, attributes: moodAttributes } =
    getMoodFilters(moodLabel);

  if (!moodCategories.length && !moodAttributes.length) {
    return { ...existingFilters };
  }

  const currentCategories = splitCategories(existingFilters.categories);
  const currentAttributes = normalizeList(existingFilters.attributes);

  const mergedCategories = Array.from(
    new Set([...currentCategories, ...moodCategories])
  );

  const mergedAttributes = Array.from(
    new Set([...currentAttributes, ...moodAttributes])
  );

  return {
    ...existingFilters,
    categories: mergedCategories,
    attributes: mergedAttributes,
  };
};

