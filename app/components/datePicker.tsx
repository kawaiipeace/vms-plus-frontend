"use client";

import { useEffect, useRef } from "react";
import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";
import { Thai } from "flatpickr/dist/l10n/th.js";

interface DatePickerProps {
  placeholder?: string;
  onChange?: (selectedDates: Date) => void;
}

const DatePicker: React.FC<DatePickerProps> = ({ placeholder, onChange }) => {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      flatpickr(inputRef.current, {
        dateFormat: "d/m/Y",
        locale: Thai,
        monthSelectorType: 'static',
        onChange: (selectedDates) => {
          if (onChange) {
            onChange(selectedDates[0]); // Call onChange with the adjusted date
          }
        },
      });
    }
  }, [onChange]);

  return (
    <input
      ref={inputRef}
      type="text"
      className="form-control"
      placeholder={placeholder}
    />
  );
};

export default DatePicker;
