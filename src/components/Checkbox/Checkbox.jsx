const Checkbox = ({
  name,
  description,
  emoji,
  callback,
  checked = false,
}) => {
  return (
    <div className="relative group">
      <input
        type="checkbox"
        name={name}
        id={name}
        className="peer sr-only"
        onChange={() => callback(name)}
        checked={checked}
      />
      <label
        htmlFor={name}
        className="flex items-center justify-center gap-2 px-4 py-3 border-2 border-primary-500 bg-primary-500 rounded-lg cursor-pointer transition-all hover:bg-primary-600 hover:bg-primary-800 peer-checked:bg-primary-800 peer-checked:border-primary-800 peer-checked:text-white"
      >
        <span>{emoji}</span>
        <span>{name}</span>
      </label>

      {/* Tooltip for desktop */}
      <div className="hidden md:group-hover:block absolute z-10 px-3 py-2 text-sm text-white bg-gray-900 rounded-lg shadow-lg -top-2 left-1/2 -translate-x-1/2 -translate-y-full w-64 pointer-events-none">
        {description}
        <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-gray-900"></div>
      </div>

      {/* Description for mobile (shown when checked) */}
      <p className="text-sm text-center md:hidden md:peer-checked:block">
        {description}
      </p>
    </div>
  );
};

export { Checkbox };
