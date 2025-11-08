import { useState, useMemo, useCallback } from "react";
import cuisines from "../../data/cuisines.json";

const PLACEHOLDER_OPTION = {
  value: "",
  label: "Pick a type of cuisine",
};

export default function CuisineDropdown({ onSelect }) {
  const [selectedAlias, setSelectedAlias] = useState("");

  const options = useMemo(() => {
    if (!cuisines?.core?.length) {
      return [];
    }

    return cuisines.core.map(({ alias, label, emoji }) => ({
      value: alias,
      label: `${emoji} ${label}`,
    }));
  }, []);

  const handleChange = useCallback(
    (event) => {
      const { value } = event.target;
      setSelectedAlias(value);
      onSelect?.(value);
    },
    [onSelect]
  );

  return (
    <div className="flex flex-col gap-2 items-center">
      <label htmlFor="cuisine-dropdown" className="text-left w-full max-w-md">
        <span className="block text-sm font-semibold text-slate-700">
          Want a certain type of cuisine?
        </span>
        <select
          id="cuisine-dropdown"
          value={selectedAlias}
          onChange={handleChange}
          className="mt-1 w-full max-w-md rounded-md border border-slate-300 px-4 py-2 text-base shadow-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200 bg-white"
        >
          <option value={PLACEHOLDER_OPTION.value} disabled>
            {PLACEHOLDER_OPTION.label}
          </option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
}

