import { useState, useCallback } from "react";

export default function LocationInput({ onValidLocation }) {
  const [value, setValue] = useState("");
  const [error, setError] = useState("");

  const validate = useCallback(
    (input) => {
      const trimmed = input;

      if (!trimmed) {
        setError("");
        return false;
      }

      setError("");
      onValidLocation?.(trimmed);
      return true;
    },
    [onValidLocation]
  );

  const handleChange = useCallback(
    (event) => {
      const nextValue = event.target.value;
      setValue(nextValue);
      validate(nextValue);
    },
    [validate]
  );

  return (
    <div className="flex flex-col gap-2 items-center">
      <label htmlFor="location-input" className="text-left w-full max-w-md">
        <span className="block text-sm font-semibold text-slate-700">
          Location
        </span>
        <input
          id="location-input"
          type="text"
          inputMode="text"
          placeholder="Enter ZIP code, city, or address"
          value={value}
          onChange={handleChange}
          className="mt-1 w-full max-w-md rounded-md border border-slate-300 px-4 py-2 text-base shadow-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200"
          aria-invalid={Boolean(error)}
          aria-describedby={error ? "location-input-error" : undefined}
        />
      </label>
      {error && (
        <p id="location-input-error" className="text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}

