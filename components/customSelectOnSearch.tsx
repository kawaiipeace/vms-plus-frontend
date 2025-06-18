import React, { useEffect, useRef, useState } from "react";

export interface CustomSelectOption {
  value: string;
  label: React.ReactNode | string;
  desc?: string;
  imageUrl?: string;
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
  allowFreeInput?: boolean;
  onSearchInputChange?: (value: string) => void;
  loading?: boolean;
  enableSearchOnApi?: boolean;
}

export default function CustomSelectOnSearch({
  w,
  options,
  iconName,
  value,
  onChange,
  showDescriptions = false,
  isInputOil = false,
  disabled = false,
  placeholder = "กรุณาเลือก",
  allowFreeInput = false,
  enableSearchOnApi,
  onSearchInputChange,
  loading = false,
}: SelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [inputText, setInputText] = useState(value?.label?.toString() || "");
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [lastSearchTerm, setLastSearchTerm] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const userTypingRef = useRef(false);
  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    if (onSearchInputChange && userTypingRef.current && enableSearchOnApi) {
      const trimmedInput = inputText.trim();
      if (trimmedInput !== lastSearchTerm && trimmedInput.length >= 3) {
        if (abortControllerRef.current) {
          abortControllerRef.current.abort();
        }

        const controller = new AbortController();
        abortControllerRef.current = controller;

        const handler = setTimeout(() => {
          onSearchInputChange(trimmedInput);
          setLastSearchTerm(trimmedInput);
        }, 500);

        return () => {
          clearTimeout(handler);
          controller.abort();
        };
      }
    }
  }, [inputText, onSearchInputChange, lastSearchTerm, enableSearchOnApi]);

  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  const filteredOptions = enableSearchOnApi
    ? options
    : options.filter((option) => {
        const trimmed = inputText.trim();
        if (trimmed === "") return true;
        const text =
          (typeof option.label === "string" ? option.label : option.value) +
          (option.desc ? ` ${option.desc}` : "");
        return text.toLowerCase().includes(trimmed.toLowerCase());
      });

  const shouldShowDropdown =
    isOpen &&
    ((!enableSearchOnApi && options.length > 0) ||
      (enableSearchOnApi && inputText.trim().length >= 3));

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setHighlightedIndex(-1);
      }
    };
    if (isOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) {
      setInputText(value?.label?.toString() || "");
      userTypingRef.current = false;
    }
  }, [value, isOpen]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen && (e.key === "ArrowDown" || e.key === "Enter")) {
      setIsOpen(true);
      setHighlightedIndex(0);
    } else if (isOpen) {
      if (e.key === "ArrowDown") {
        setHighlightedIndex((prev) =>
          prev < filteredOptions.length - 1 ? prev + 1 : 0
        );
      } else if (e.key === "ArrowUp") {
        setHighlightedIndex((prev) =>
          prev > 0 ? prev - 1 : filteredOptions.length - 1
        );
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

  const renderDropdownOption = (option: CustomSelectOption) => {
    if (!!option?.imageUrl && isInputOil) {
      return (
        <div className="flex items-center gap-1">
          <img
            src={option.imageUrl}
            alt={"oil-image-" + option.imageUrl}
            width={24}
            height={24}
          />
          <span className=" text-object-search">{option.label}</span>
        </div>
      );
    }
    if (!showDescriptions) return <div>{option.label}</div>;
    return (
      <div className="flex flex-col">
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

        {isInputOil ? (
          !value?.value || value.value === "" ? (
            <div className="flex items-center gap-1 flex-1 bg-transparent border-0 px-0 py-0 h-full text-md">
              {placeholder}
            </div>
          ) : (
            <div className="flex items-center gap-1 flex-1 bg-transparent border-0 px-0 py-0 h-full text-md">
              <img
                src={value?.imageUrl}
                alt={"oil-image-" + value?.imageUrl}
                width={24}
                height={24}
              />
              <span className="text-object-search">{value?.label}</span>
            </div>
          )
        ) : enableSearchOnApi ? (
          <input
            ref={inputRef}
            className="flex-1 bg-transparent outline-none border-0 px-0 py-0 h-full text-md text-object-search"
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
          // When enableSearchOnApi is false, show a read-only input for display only
          <input
            ref={inputRef}
            className="flex-1 bg-transparent outline-none border-0 px-0 py-0 h-full text-md"
            value={value?.label?.toString() || ""}
            placeholder={placeholder}
            disabled={true}
            readOnly
            tabIndex={-1}
            style={{
              pointerEvents: "none",
              background: "transparent",
              color: "#333",
            }}
          />
        )}

        {/* Clear button */}
        {value?.value && !disabled && (
          <div
            className="flex-shrink-0 w-8 text-right cursor-pointer text-gray-400 hover:text-gray-500"
            onClick={(e) => {
              e.stopPropagation();
              setInputText("");
              onChange({ value: "", label: "" });
              userTypingRef.current = false;
            }}
          >
            <i className="material-symbols-outlined">close_small</i>
          </div>
        )}

        {/* Dropdown arrow */}
        <div
          className="flex-shrink-0 w-8 text-right cursor-pointer"
          onClick={(e) => {
            e.stopPropagation();
            setIsOpen((open) => !open);
          }}
        >
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
                {value?.value === option.value && (
                  <span className="material-symbols-outlined ml-auto">
                    check
                  </span>
                )}
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
