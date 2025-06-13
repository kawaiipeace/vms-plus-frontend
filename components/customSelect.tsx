import React, { useEffect, useRef, useState } from "react";

export interface CustomSelectOption {
  value: string;
  label: React.ReactNode | string;
  desc?: string;
  imageUrl?: string; // Optional image URL for the option
}

interface SelectProps {
  options: CustomSelectOption[];
  w: string;
  iconName?: string;
  value?: CustomSelectOption | null;
  onChange: (selected: CustomSelectOption) => void;
  showDescriptions?: boolean;
  isInputOil?: boolean;
  disabled?: boolean;
  placeholder?: string;
  position?: "bottom" | "top"; // New position prop
}

export default function CustomSelect({
  w,
  options,
  iconName,
  value,
  onChange,
  showDescriptions = false,
  isInputOil = false,
  disabled = false,
  placeholder = "กรุณาเลือก",
  position = "bottom", // Default to bottom
}: SelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const filteredOptions = options;

  const shouldShowDropdown = isOpen;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setHighlightedIndex(-1);
      }
    };
    if (isOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (!isOpen && (e.key === "ArrowDown" || e.key === "Enter")) {
      setIsOpen(true);
      setHighlightedIndex(0);
    } else if (isOpen) {
      if (e.key === "ArrowDown") {
        setHighlightedIndex((prev) => (prev < filteredOptions.length - 1 ? prev + 1 : 0));
      } else if (e.key === "ArrowUp") {
        setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : filteredOptions.length - 1));
      } else if (e.key === "Enter" && highlightedIndex >= 0) {
        const selected = filteredOptions[highlightedIndex];
        onChange(selected);
        setIsOpen(false);
      } else if (e.key === "Escape") {
        setIsOpen(false);
      }
    }
  };

  const renderDropdownOption = (option: CustomSelectOption) => {
    if (!!option?.imageUrl && isInputOil) {
      return (
        <div className="flex items-center gap-1">
          <img src={option.imageUrl} alt={"oil-image-" + option.imageUrl} width={24} height={24} />
          <span>{option.label}</span>
        </div>
      );
    }
    if (!showDescriptions || !option.desc) return <div>{option.label}</div>;
    return (
      <div className="flex flex-col">
        <div className="font-medium">{option.label}</div>
        <div className="text-xs text-gray-500 mt-1">{option.desc}</div>
      </div>
    );
  };

  // Calculate dropdown position class
  const dropdownPositionClass = position === "top" ? "bottom-full mb-1" : "top-full mt-1";

  return (
    <div ref={dropdownRef} className="relative custom-select" onKeyDown={handleKeyDown} tabIndex={0}>
      <div
        className={`border ${w} max-${w} border-gray-300 rounded-lg px-2 h-[40px] flex items-center text-primary-grayText overflow-hidden focus-within:border-primary-default focus-within:shadow-customPurple ${
          isOpen ? "shadow-customPurple border-primary-default" : ""
        }`}
        onClick={() => !disabled && setIsOpen((prev) => !prev)}
      >
        {iconName && (
          <div className="input-group-prepend mr-1">
            <span className="input-group-text">
              <i className="material-symbols-outlined">{iconName}</i>
            </span>
          </div>
        )}
        {isInputOil ? (
          !value?.value ? (
            <div className="flex items-center gap-1 flex-1 text-md">{placeholder}</div>
          ) : (
            <div className="flex items-center gap-1 flex-1 text-md">
              <img src={value?.imageUrl} alt={"oil-image-" + value?.imageUrl} width={24} height={24} />
              <span>{value?.label}</span>
            </div>
          )
        ) : (
          <div className="flex-1 text-md truncate text-object-search text-black">{value?.label || placeholder}</div>
        )}
        <div className="flex-shrink-0 w-8 text-right cursor-pointer">
          <i className="material-symbols-outlined">keyboard_arrow_down</i>
        </div>
      </div>

      {shouldShowDropdown && (
        <ul
          className={`max-h-[16rem] overflow-y-auto absolute flex drop-list-custom flex-col left-0 p-2 gap-2 z-10 ${dropdownPositionClass} w-full border border-gray-300 rounded-lg shadow-lg bg-white`}
        >
          {filteredOptions.length > 0 ? (
            filteredOptions.map((option, idx) => (
              <li
                key={option.value}
                className={`px-4 py-2 cursor-pointer flex gap-2 items-start rounded-lg ${
                  idx === highlightedIndex
                    ? "text-brand-900"
                    : value?.value === option.value
                    ? "text-brand-900"
                    : "text-gray-700"
                }`}
                onMouseEnter={() => setHighlightedIndex(idx)}
                onClick={() => {
                  onChange(option);
                  setIsOpen(false);
                }}
              >
                {renderDropdownOption(option)}
                {value?.value === option.value && <span className="material-symbols-outlined ml-auto">check</span>}
              </li>
            ))
          ) : (
            <div className="px-4 py-2 text-gray-500">ไม่พบข้อมูล</div>
          )}
        </ul>
      )}
    </div>
  );
}
