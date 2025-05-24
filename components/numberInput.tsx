interface NumberInputProps {
  value: number;
  onChange: (newValue: number) => void;
}

export default function NumberInput({ value, onChange }: NumberInputProps) {
  const decrease = () => onChange(Math.max(1, value - 1)); // prevent going below 1
  const increase = () => onChange(Math.min(100, value + 1));

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let newValue = Number(e.target.value);
    if (isNaN(newValue)) return;
    newValue = Math.min(100, Math.max(1, newValue)); // min 1, max 100
    onChange(newValue);
  };

  return (
    <div className="input-group input-group-number">
      <button type="button" className="cursor-pointer" onClick={decrease} disabled={value <= 1}>
        <span className="input-group-text">
          <i className="material-symbols-outlined icon-settings-400-20">remove</i>
        </span>
      </button>

      <input
        type="number"
        className="input border-0 w-20 text-center form-control form-control-text-input"
        value={value}
        min={1} // this helps too
        max={100}
        onChange={handleChange}
      />

      <button type="button" className="cursor-pointer" onClick={increase}>
        <span className="input-group-text">
          <i className="material-symbols-outlined icon-settings-400-20">add</i>
        </span>
      </button>
    </div>
  );
}
