import { useState, useRef, useEffect } from "react";

interface Option {
  label: string;
  deptSap: string;
  deptSapShort: string;
  value: string;
  telInternal: string;
  telMobile: string;
}

interface SelectProps {
  options: Option[];
  w: string;
  iconName?: string;
  onChange?: (selectedOption: Option) => void;
}

export default function VehicleUserSelect({
  w,
  options,
  iconName,
  onChange,
}: SelectProps) {
  const [selected, setSelected] = useState<Option | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLDivElement>(null);

  // Set default value when options change
  useEffect(() => {
    if (options.length > 0 && !selected) {
      setSelected(options[0]); // Set the first option as the default if no selected value
    }
  }, [options, selected]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  const handleSelect = (option: Option) => {
    setSelected(option);
    if (onChange) {
      onChange(option); // Notify parent of the selected option
    }
    setIsOpen(false);
    buttonRef.current?.focus(); // Keep focus on the button
  };

  return (
    <div ref={dropdownRef} className={`relative custom-select`}>
      <div
        ref={buttonRef}
        tabIndex={0}
        className={`border ${w} max-${w} border-gray-300 rounded-lg px-2 h-[40px] flex items-center text-primary-grayText cursor-pointer focus:border-primary-default focus:shadow-customPurple ${
          isOpen ? "shadow-customPurple border-primary-default" : ""
        } overflow-hidden`}
        onClick={() => setIsOpen(!isOpen)}
      >
        {iconName && (
          <div className="input-group-prepend mr-1">
            <span className="input-group-text">
              <i className="material-symbols-outlined">{iconName}</i>
            </span>
          </div>
        )}

        <div className="flex-1 overflow-hidden whitespace-nowrap">
          {selected?.label || "Select an option"}
        </div>

        <div className="flex-shrink-0 w-8 text-right">
          <i className="material-symbols-outlined">keyboard_arrow_down</i>
        </div>
      </div>

      {isOpen && (
        <ul className="absolute flex flex-col left-0 p-2 gap-2 z-10 mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg">
          {options.map((option) => (
            <li
              key={option.value}
              className={`px-4 py-2 cursor-pointer flex gap-2 items-center rounded-lg ${
                selected?.value === option.value ? "text-brand-900 active" : "text-gray-700"
              } hover:bg-gray-100`}
              onClick={() => handleSelect(option)}
            >
              {option.label}
              {selected?.value === option.value && (
                <span className="material-symbols-outlined">check</span>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
