import React, { useEffect, useRef, useState } from "react";

export interface CustomSelectOption {
  value: string;
  label: React.ReactNode | string;
  desc?: string;
}

interface SelectProps {
  options: CustomSelectOption[];
  w: string;
  iconName?: string;
  value?: CustomSelectOption | null;
  onChange: (selected: CustomSelectOption) => void;
  showDescriptions?: boolean;
  disabled?: boolean;
  placeholder?: string;
  enableSearch?: boolean;
  classNamePlaceholder?: string;
}

export default function CustomSearchSelect({
  w,
  options,
  iconName,
  value,
  onChange,
  showDescriptions = false,
  disabled = false,
  placeholder = "กรุณาเลือก",
  enableSearch = false,
  classNamePlaceholder,
}: SelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [inputText, setInputText] = useState(value?.label?.toString() || "");
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const userTypingRef = useRef(false);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  // Filter options based on input text
  const filteredOptions =
    enableSearch && value?.label === inputText
      ? options
      : enableSearch && value?.label !== inputText
      ? options.filter((option) => {
          const text =
            (typeof option.label === "string" ? option.label : option.value) + (option.desc ? ` ${option.desc}` : "");
          return text.toLowerCase().includes(inputText.toLowerCase());
        })
      : options; // Show all options when search text is less than 3 chars if not API search

  // Determine if dropdown should be shown
  const shouldShowDropdown =
    isOpen &&
    ((!enableSearch && options.length > 0) ||
      (enableSearch && inputText.trim().length >= 3) ||
      (enableSearch && !value));

  // Handle outside click to close dropdown
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

  // Sync inputText when value prop changes
  useEffect(() => {
    if (!isOpen) {
      setInputText(value?.label?.toString() || "");
      userTypingRef.current = false;
    }
  }, [value, isOpen]);

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
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
        setInputText(selected.label ? selected.label.toString() : "");
        setIsOpen(false);
        userTypingRef.current = false;
      } else if (e.key === "Escape") {
        setIsOpen(false);
      }
    }
  };

  // Render dropdown option
  const renderDropdownOption = (option: CustomSelectOption) => {
    if (!showDescriptions || !option.desc) return <div>{option.label}</div>;
    return (
      <div className="flex flex-col items-start">
        <div className="font-medium">{option.label}</div>
        <div className="text-xs text-gray-500 mt-1">{option.desc}</div>
      </div>
    );
  };

  return (
    <div ref={dropdownRef} className="relative custom-select">
      <div
        className={`border ${w} max-${w} border-gray-300 rounded-lg px-2 h-[40px] flex items-center text-primary-grayText overflow-hidden focus-within:border-primary-default focus-within:shadow-customPurple ${
          isOpen ? "shadow-customPurple border-primary-default" : ""
        }`}
        onClick={() => !disabled && setIsOpen(true)}
      >
        {iconName && (
          <div className="input-group-prepend mr-1">
            <span className="input-group-text">
              <i className="material-symbols-outlined">{iconName}</i>
            </span>
          </div>
        )}
        {enableSearch ? (
          <input
            ref={inputRef}
            className="flex-1 bg-transparent outline-none border-0 px-0 py-0 h-full text-md"
            value={inputText}
            placeholder={placeholder}
            disabled={disabled}
            onFocus={() => !disabled && setIsOpen(true)}
            onChange={(e) => {
              setInputText(e.target.value);
              setIsOpen(true);
              setHighlightedIndex(0);
              userTypingRef.current = true;
            }}
            onKeyDown={handleKeyDown}
          />
        ) : (
          <div className={classNamePlaceholder ? classNamePlaceholder : "flex-1"}>
            {inputText ? inputText : placeholder}
          </div>
        )}
        <div className="flex-shrink-0 w-8 text-right cursor-pointer" onClick={() => setIsOpen((open) => !open)}>
          <i className="material-symbols-outlined">keyboard_arrow_down</i>
        </div>
      </div>

      {shouldShowDropdown && (
        <ul className="max-h-[16rem] overflow-y-auto absolute flex drop-list-custom flex-col left-0 p-2 gap-2 z-10 mt-1 w-full border border-gray-300 rounded-lg shadow-lg bg-white">
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
                  setInputText(option.label ? option.label.toString() : "");
                  setIsOpen(false);
                  userTypingRef.current = false;
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
