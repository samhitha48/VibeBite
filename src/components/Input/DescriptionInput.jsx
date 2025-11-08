import { useState, useCallback } from "react";

export default function DescriptionInput({ onChange }) {
  const [value, setValue] = useState("");

  const handleChange = useCallback(
    (event) => {
      const nextValue = event.target.value;
      setValue(nextValue);
      onChange?.(nextValue);
    },
    [onChange]
  );

  return (
    <div className="flex flex-col gap-2 items-center">
      <label htmlFor="description-input" className="text-left w-full max-w-xl">
        <span className="block text-sm font-semibold text-slate-700">
          Here's what I'm feelin'
        </span>
        <textarea
          id="description-input"
          value={value}
          onChange={handleChange}
          placeholder="What kind of vibes are you going for?"
          className="mt-1 w-full max-w-xl rounded-md border border-slate-300 px-4 py-3 text-base shadow-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200 min-h-[140px] resize-y"
        />
      </label>
    </div>
  );
}

