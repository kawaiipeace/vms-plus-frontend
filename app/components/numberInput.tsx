import { useState } from "react";

export default function NumberInput() {
  const [value, setValue] = useState(0);

  const decrease = () => setValue((prev) => Math.max(0, prev - 1));
  const increase = () => setValue((prev) => Math.min(100, prev + 1));

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let newValue = Number(e.target.value);
    if (isNaN(newValue)) return;
    newValue = Math.min(100, Math.max(0, newValue)); // Ensure it stays between 0 and 100
    setValue(newValue);
  };

  return (
    <div className="input-group input-group-number">
      <button>
        {" "}
        <div className="input-group-prepend cursor-pointer" onClick={decrease}>
          <span className="input-group-text">
            <i className="material-symbols-outlined icon-settings-400-20">
              remove
            </i>
          </span>
        </div>
      </button>

      <input
        type="number"
        className="input border-0 w-20 text-center form-control form-control-text-input"
        value={value}
        onChange={handleChange}
      />
      <button>
        {" "}
        <div
          className="input-group-append cursor-pointer focus:bg-transparent"
          onClick={increase}
        >
          <span className="input-group-text">
            <i className="material-symbols-outlined icon-settings-400-20">
              add
            </i>
          </span>
        </div>
      </button>
    </div>
  );
}
