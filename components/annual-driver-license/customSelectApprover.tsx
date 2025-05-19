import React, { useEffect, useRef, useState } from "react";

export interface CustomSelectOption {
  value: string;
  label: React.ReactNode | string;
  desc?: string; // Optional description field
  posi_text?: string;
  dept_sap?: string;
  dept_sap_short?: string;
  full_name?: string;
  image_url?: string;
  tel_mobile?: string;
  tel_internal?: string;
}

interface SelectProps {
  options: CustomSelectOption[];
  w: string;
  iconName?: string;
  value?: CustomSelectOption | null;
  onChange: (selected: CustomSelectOption | null) => void;
  showDescriptions?: boolean;
  isLoading?: boolean;
}

export default function CustomSelectApprover({ 
  w, 
  options, 
  iconName, 
  value, 
  onChange, 
  showDescriptions = false,
  isLoading = false
}: SelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
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

  // Function to render dropdown option label with description
  const renderDropdownOption = (option: CustomSelectOption) => {
    return (
      <div className="flex flex-col w-full">
        <div className="font-medium truncate">{option.full_name || option.label}</div>

        {option.dept_sap_short && (
          <div className="text-xs text-gray-500 truncate">{option.dept_sap_short}</div>
        )}
      </div>
    );
  };

  return (
    <div ref={dropdownRef} className={`relative custom-select ${w}`}>
      {/* Button that shows selected option */}
      <div
        ref={buttonRef}
        tabIndex={0}
        className={`border w-full border-gray-300 rounded-lg px-2 h-[40px] flex items-center text-primary-grayText cursor-pointer focus:border-primary-default focus:shadow-customPurple ${
          isOpen ? "shadow-customPurple border-primary-default" : ""
        } overflow-hidden`}
        onClick={() => !isLoading && setIsOpen(!isOpen)}
      >
        {iconName && (
          <div className="input-group-prepend mr-1">
            <span className="input-group-text">
              <i className="material-symbols-outlined"> {iconName} </i>
            </span>
          </div>
        )}

        <div className="flex-1 overflow-hidden whitespace-nowrap">
          {isLoading ? (
            <span className="loading loading-spinner loading-xs"></span>
          ) : value ? (
            <div className="truncate">
              {value.full_name}
            </div>
          ) : (
            "กรุณาเลือก"
          )}
        </div>

        {!isLoading && (
          <div className="flex-shrink-0 w-8 text-right">
            <i className="material-symbols-outlined">
              {isOpen ? "keyboard_arrow_up" : "keyboard_arrow_down"}
            </i>
          </div>
        )}
      </div>

      {/* Dropdown List */}
      {isOpen && !isLoading && (
        <ul className="max-h-[16rem] overflow-y-auto absolute flex drop-list-custom flex-col left-0 p-2 gap-2 z-10 mt-1 w-full border border-gray-300 rounded-lg shadow-lg bg-white">
          {options.length > 0 ? (
            options.map((option) => (
              <li
                key={option.value}
                className={`px-4 py-2 cursor-pointer flex gap-2 items-start rounded-lg ${
                  value?.value === option.value ? "text-brand-900 bg-gray-100" : "text-gray-700"
                } hover:bg-gray-100`}
                onClick={() => {
                  onChange(option);
                  setIsOpen(false);
                  buttonRef.current?.focus();
                }}
              >
                {renderDropdownOption(option)}
                {value?.value === option.value && (
                  <span className="material-symbols-outlined ml-auto">check</span>
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