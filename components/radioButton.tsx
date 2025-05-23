interface RadioButtonProps {
  name: string;
  label: string;
  value: string;
  selectedValue?: string;
  disabled?: boolean;
  setSelectedValue: (value: string) => void;
}

export default function RadioButton({ name, label, value, selectedValue, disabled, setSelectedValue }: RadioButtonProps) {
  return (
    <label className="flex items-center gap-2 h-[40px] cursor-pointer new-radio-custom">
      <input
        type="radio"
        className={`hidden`}
        name={name}
        value={value}
        checked={selectedValue === value}
        onChange={() => setSelectedValue(value)}
        disabled={disabled}
      />
      <div
        className={`os-radio w-5 h-5 rounded-full border-2 ${
          selectedValue === value ? " border-brand-900 bg-brand-900" : "border-gray-300"
        } ${
          disabled === true ? "disabled !bg-[#D0D5DD]" : ""
        } flex items-center justify-center `}
      >
        {selectedValue === value && <div className="circle-radio w-2 h-2 bg-white rounded-full disabled"></div>}
      </div>

      <span className="custom-control-label">{label}</span>
    </label>
  );
}
