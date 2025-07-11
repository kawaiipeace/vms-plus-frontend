import React, { useEffect, useRef, useState } from "react";

export interface CustomSelectOption {
  value: string;
  label: React.ReactNode | string;
  subLabel?: string;
}

interface SelectProps {
  options: CustomSelectOption[];
  w: string;
  iconName?: string;
  value?: CustomSelectOption[];
  onChange: (selected: CustomSelectOption[]) => void;
  setSearch?: (value: string) => void;
  enableSearchApi?: boolean;
  placeholder?: string;
}

export default function CustomMultiSelect({
  w,
  options,
  iconName,
  value = [],
  onChange,
  setSearch,
  enableSearchApi = false,
  placeholder = "กรุณาเลือก",
}: SelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [length, setLength] = useState(value.length || 0);
  const [action, setAction] = useState("add");
  const [searchValue, setSearchValue] = useState("");

  // Close dropdown when clicking outside
  const handleClickOutside = (event: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node)
    ) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    if (searchValue.trim() !== "" && searchValue.trim().length >= 3) {
      setSearch?.(searchValue);
    } else {
      setSearch?.("");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchValue]);

  return (
    <div ref={dropdownRef} className={`relative custom-select`}>
      {/* Button that shows selected option */}
      <div
        ref={buttonRef}
        tabIndex={0}
        className={`border ${w} max-${w} border-gray-300 rounded-lg py-2 px-2 min-h-[40px] flex items-center text-primary-grayText cursor-pointer focus:border-primary-default focus:shadow-customPurple ${
          isOpen ? "shadow-customPurple border-primary-default" : ""
        }`}
        onClick={() => {
          if (!(length < value.length) || action !== "remove") {
            setIsOpen(!isOpen);
          } else {
            if (length - 1 < 0) {
              setLength(0);
            } else {
              setLength(length - 1);
            }
            setAction("add");
          }
        }}
      >
        {iconName && (
          <div className="input-group-prepend mr-1">
            <span className="input-group-text">
              <i className="material-symbols-outlined"> {iconName} </i>
            </span>
          </div>
        )}

        <div className="flex-1 flex flex-wrap gap-2 overflow-hidden whitespace-nowrap">
          {value?.length
            ? value.map((item) => (
                <div
                  key={item.value}
                  className="border-primary-grayBorder border rounded-lg px-1 flex"
                >
                  {item.label}
                  <div
                    onClick={() => {
                      onChange(value.filter((e) => e.value !== item.value));
                      setLength(length - 1);
                      setAction("remove");
                    }}
                  >
                    <i className="material-symbols-outlined">close</i>
                  </div>
                </div>
              ))
            : ""}
          {isOpen && enableSearchApi ? (
            <input
              ref={inputRef}
              type="text"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              className="border-none focus-visible:outline-none bg-transparent"
            />
          ) : value?.length ? (
            ""
          ) : (
            placeholder
          )}
        </div>

        <div className="flex-shrink-0 w-8 text-right">
          {/* <i className="material-symbols-outlined">keyboard_arrow_down</i> */}
        </div>
      </div>

      {/* Dropdown List */}
      {(enableSearchApi
        ? searchValue.trim().length >= 3
          ? isOpen
          : false
        : isOpen) && (
        <ul className="max-h-[16rem] overflow-y-auto absolute flex drop-list-custom flex-col left-0 p-2 gap-2 z-10 mt-1 w-full border border-gray-300 rounded-lg shadow-lg">
          {options.length > 0 ? (
            options.map((option) => (
              <li
                key={option.value}
                className={`px-4 cursor-pointer flex gap-2 items-center rounded-lg ${
                  value?.some((e) => e.value === option.value)
                    ? "text-brand-900 active"
                    : "text-gray-700"
                } hover:bg-gray-100`}
                onClick={() => {
                  const dup = value?.some((e) => e.value === option.value);
                  if (dup) {
                    onChange(value.filter((e) => e.value !== option.value));
                  } else {
                    onChange([...value, option]);
                  }
                  setLength(value.length);
                  setAction("add");
                  setSearchValue("");
                  if (enableSearchApi) setIsOpen(false);
                  buttonRef.current?.focus(); // Keep focus on the div
                  inputRef.current?.focus(); // Keep focus on the input
                }}
              >
                {option.subLabel ? (
                  <div className="flex flex-col">
                    <div className="text-base text-secondary-border">
                      {option.label}
                    </div>
                    <div className="text-xs text-primary-grayText">
                      {option.subLabel}
                    </div>
                  </div>
                ) : (
                  option.label
                )}
                {value?.some((e) => e.value === option.value) && (
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
