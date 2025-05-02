import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.css";
import React, { useEffect, useRef } from "react";

interface TimePickerProps {
  placeholder?: string;
  defaultValue?: string;
  value?: string;
  onChange?: (selectedTime: string) => void;
}

const TimePicker: React.FC<TimePickerProps> = ({ placeholder = "HH:MM", defaultValue, onChange, value }) => {
  const timeInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fp = flatpickr(timeInputRef.current!, {
      enableTime: true,
      noCalendar: true,
      static: true,
      defaultDate: defaultValue,
      dateFormat: "H:i",
      position: "below center",
      time_24hr: true,
      onChange: (selectedDates, dateStr) => {
        if (onChange) {
          onChange(dateStr);
        }
      },
    });

    return () => {
      fp.destroy(); // Cleanup flatpickr instance on unmount
    };
  }, [onChange]);

  return (
    <input
      className="form-control"
      placeholder={placeholder}
      defaultValue={defaultValue}
      ref={timeInputRef}
      value={value}
      type="text"
    />
  );
};

export default TimePicker;
