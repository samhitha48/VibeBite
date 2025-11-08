import { useEffect, useRef } from "react";

export default function Slider({
  label,
  min = 0,
  max = 10,
  step = 1,
  value = 0,
  measurement,
  valueSetter,
}) {
  const rangeRef = useRef(null);

  const getBackgroundSize = () => ((value - min) * 100) / (max - min);

  useEffect(() => {
    if (rangeRef.current) {
      const percentage = getBackgroundSize();
      rangeRef.current.style.background = `linear-gradient(to right, #e67ca7 0%, #e67ca7 ${percentage}%, #cfe2f3 ${percentage}%, #cfe2f3 100%)`;
    }
  }, [value, min, max]);

  return (
    <div className="w-full max-w-md flex flex-col gap-2">
      <label className="text-lg">
        {label}: <span className="text-black">{value}</span> {measurement}
      </label>

      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => valueSetter(Number(e.target.value))}
        ref={rangeRef}
        className="w-full h-2 rounded-lg appearance-none cursor-pointer bg-transparent"
        style={{ WebkitAppearance: "none", appearance: "none" }}
      />

      <style jsx>{`
        input[type="range"] {
          outline: none;
        }

        input[type="range"]::-webkit-slider-runnable-track {
          height: 8px;
          border-radius: 9999px;
          background: transparent;
          margin-top: 0;
        }

        input[type="range"]::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          background-color: #e67ca7;
          border-radius: 50%;
          height: 20px;
          width: 20px;
          cursor: pointer;
          border: none;
          position: relative;
          z-index: 1;
          margin: 0;
          transform: translateY(-50%);
        }

        input[type="range"]::-moz-range-track {
          height: 8px;
          border-radius: 9999px;
          background: transparent;
        }

        input[type="range"]::-moz-range-thumb {
          background-color: #e67ca7;
          border-radius: 50%;
          height: 20px;
          width: 20px;
          cursor: pointer;
          border: none;
          position: relative;
          z-index: 1;
          transform: translateY(0));
        }
      `}</style>
    </div>
  );
}
