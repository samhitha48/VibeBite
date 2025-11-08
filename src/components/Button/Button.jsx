import React from "react";
import clsx from "clsx";

export default function Button({
  text,
  type = "filled",
  size = "medium",
  variant = "green",
  onClick,
}) {
  const base =
    "inline-flex items-center gap-2 font-semibold transition-colors duration-200";

  const sizes = {
    small: "text-sm px-4 py-1.5 rounded-full",
    medium: "text-base px-6 py-2 rounded-full",
  };

  const filledVariants = {
    green: "bg-[#7ba388] text-white hover:bg-[#95b5a0]",
    darkGreen: "bg-[#56725f] text-white hover:bg-[#6f937a]",
    pink: "bg-[#da7da0] text-white hover:bg-p[#e197b3]",
    plum: "bg-[#995870] text-white hover:bg-[#c47190]",
    lightBlue: "bg-[#c1dbed] text-black hover:bg-[#cde2f1]",
    slate: "bg-[#8799a6] text-white hover:bg-[#aec5d5]",
  };

  const linkVariants = {
    green: "text-[#7ba388] hover:text-[#95b5a0]",
    dark: "text-[#8799a6] hover:text-[#aec5d5]",
    plum: "text-[#995870] hover:text-[#c47190]",
  };

  const styles =
    type === "filled"
      ? clsx(base, sizes[size], filledVariants[variant])
      : clsx(
          base,
          "bg-transparent p-0",
          linkVariants[variant],
          "hover:underline"
        );

  return (
    <button className={styles} onClick={onClick}>
      {text}
    </button>
  );
}
