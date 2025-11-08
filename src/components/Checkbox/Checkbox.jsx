const Checkbox = ({
  name,
  description,
  emoji,
  callback,
  checked = false,
}) => {
  return (
    <div className="relative">
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
      <p className="text-sm text-center md:hidden md:peer-checked:block">
        {description}
      </p>
    </div>
  );
};

export { Checkbox };
