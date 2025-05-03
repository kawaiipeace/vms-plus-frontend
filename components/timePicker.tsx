import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.css";
import React, { useEffect, useRef } from "react";

interface TimePickerProps {
  placeholder?: string;
  defaultValue?: string;
  value?: string;
  onChange?: (selectedTime: string) => void;
}

const TimePicker: React.FC<TimePickerProps> = ({
  placeholder = "HH:MM",
  defaultValue,
  value,
  onChange,
}) => {
  const timeInputRef = useRef<HTMLInputElement>(null);
  const fpInstance = useRef<flatpickr.Instance | null>(null);

  useEffect(() => {
    if (!timeInputRef.current) return;

    fpInstance.current = flatpickr(timeInputRef.current, {
      enableTime: true,
      noCalendar: true,
      static: true,
      dateFormat: "H:i",
      time_24hr: true,
      defaultDate: defaultValue,
      onChange: (selectedDates, dateStr) => {
        if (onChange) {
          onChange(dateStr);
        }
      },
    });

    return () => {
      fpInstance.current?.destroy();
    };
  }, [onChange, defaultValue]);

  // Update Flatpickr when `value` changes from outside
  useEffect(() => {
    if (fpInstance.current && value) {
      fpInstance.current.setDate(value, false);
    }
  }, [value]);

  return (
    <input
      className="form-control"
      placeholder={placeholder}
      ref={timeInputRef}
      type="text"
    />
  );
};

export default TimePicker;
