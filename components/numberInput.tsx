
interface NumberInputProps {
  value: number;
  onChange: (newValue: number) => void;
}

export default function NumberInput({ value, onChange }: NumberInputProps) {
  const decrease = () => onChange(Math.max(0, value - 1));
  const increase = () => onChange(Math.min(100, value + 1));

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let newValue = Number(e.target.value);
    if (isNaN(newValue)) return;
    newValue = Math.min(100, Math.max(0, newValue)); // Ensure it stays between 0 and 100
    onChange(newValue);
  };

  return (
    <div className="input-group input-group-number">
      <button type="button" className="cursor-pointer" onClick={decrease}>
        <span className="input-group-text">
          <i className="material-symbols-outlined icon-settings-400-20">
            remove
          </i>
        </span>
      </button>

      <input
        type="number"
        className="input border-0 w-20 text-center form-control form-control-text-input"
        value={value}
        onChange={handleChange}
      />

      <button type="button" className="cursor-pointer" onClick={increase}>
        <span className="input-group-text">
          <i className="material-symbols-outlined icon-settings-400-20">
            add
          </i>
        </span>
      </button>
    </div>
  );
}
