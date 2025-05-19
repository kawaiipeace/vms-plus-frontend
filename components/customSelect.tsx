import React, { useEffect, useRef, useState } from "react";

export interface CustomSelectOption {
  value: string;
  label: React.ReactNode | string;
}

interface SelectProps {
  options: CustomSelectOption[];
  w: string;
  iconName?: string;
  value?: CustomSelectOption | null;
  onChange: (selected: CustomSelectOption) => void;
  disabled?: boolean;
}

export default function CustomSelect({
  w,
  options,
  iconName,
  value,
  onChange,
  disabled = false,
}: SelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLDivElement>(null);

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

  return (
    <div ref={dropdownRef} className={`relative custom-select`}>
      {/* Button that shows selected option */}
      <div
        ref={buttonRef}
        tabIndex={0}
        className={`border ${w} max-${w} border-gray-300 rounded-lg px-2 h-[40px] flex items-center text-primary-grayText cursor-pointer focus:border-primary-default focus:shadow-customPurple ${
          isOpen ? "shadow-customPurple border-primary-default" : ""
        } overflow-hidden`}
        onClick={() => (disabled ? null : setIsOpen(!isOpen))}
      >
        {iconName && (
          <div className="input-group-prepend mr-1">
            <span className="input-group-text">
              <i className="material-symbols-outlined"> {iconName} </i>
            </span>
          </div>
        )}

        <div className="flex-1 overflow-hidden whitespace-nowrap">
          {value?.label || "กรุณาเลือก"}
        </div>

        <div className="flex-shrink-0 w-8 text-right">
          <i className="material-symbols-outlined">keyboard_arrow_down</i>
        </div>
      </div>

      {/* Dropdown List */}
      {isOpen && (
        <ul className="max-h-[16rem] overflow-y-auto absolute flex drop-list-custom flex-col left-0 p-2 gap-2 z-10 mt-1 w-full border border-gray-300 rounded-lg shadow-lg">
          {options.length > 0 ? (
            options.map((option) => (
              <li
                key={option.value}
                className={`px-4 py-2 cursor-pointer flex gap-2 items-center rounded-lg ${
                  value?.value === option.value
                    ? "text-brand-900 active"
                    : "text-gray-700"
                } hover:bg-gray-100`}
                onClick={() => {
                  onChange(option);
                  setIsOpen(false);
                  buttonRef.current?.focus(); // Keep focus on the div
                }}
              >
                {option.label}
                {value?.value === option.value && (
                  <span className="material-symbols-outlined">check</span>
                )}
              </li>
            ))
          ) : (
            <li className="px-4 py-2 text-gray-500">ไม่พบข้อมูล</li>
          )}
        </ul>
      )}
    </div>
  );
}
