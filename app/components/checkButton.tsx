interface CheckButtonProps {
    name: string;
    label: string;
    value: string;
    selectedValues: string[]; // Update to allow multiple selected values
    setSelectedValues: (values: string[]) => void;
  }
  
  export default function CheckButton({ name, label, value, selectedValues, setSelectedValues }: CheckButtonProps) {
    const isChecked = selectedValues.includes(value);
  
    const handleChange = () => {
      if (isChecked) {
        setSelectedValues(selectedValues.filter((v) => v !== value)); // Remove the value if it's already selected
      } else {
        setSelectedValues([...selectedValues, value]); // Add the value if it's not selected
      }
    };
  
    return (
      <label className="flex items-center gap-2 h-[40px] cursor-pointer new-checkButton-custom">
        <div>
          <input
            type="checkButton"
            className="hidden"
            name={name}
            value={value}
            checked={isChecked}
            onChange={handleChange}
          />
          <div
            className={`os-checkButton w-5 h-5 rounded ${isChecked ? "active border-brand-900 bg-brand-900" : "border-gray-300"} flex items-center justify-center`}
          >
            {isChecked && <div className="checkmark w-2 h-2 bg-white rounded"></div>}
          </div>
        </div>
        <span className="custom-control-label">{label}</span>
      </label>
    );
  }
  