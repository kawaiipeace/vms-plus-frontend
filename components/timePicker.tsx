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
  const flatpickrRef = useRef<flatpickr.Instance | null>(null);

  useEffect(() => {
    console.log('defaultvalue', defaultValue);
    console.log('value', value);
    
    // Initialize flatpickr
    flatpickrRef.current = flatpickr(timeInputRef.current!, {
      enableTime: true,
      noCalendar: true,
      static: true,
      defaultDate: defaultValue || undefined,
      dateFormat: "H:i",
      position: "below center",
      time_24hr: true,
      onChange: (selectedDates, dateStr) => {
        if (onChange) {
          onChange(dateStr);
        }
      },
    });

    // Cleanup flatpickr instance on unmount
    return () => {
      if (flatpickrRef.current) {
        flatpickrRef.current.destroy();
        flatpickrRef.current = null;
      }
    };
  }, []); // Empty dependency array - only initialize once

  // Handle updates to defaultValue
  useEffect(() => {
    if (flatpickrRef.current && defaultValue) {
      flatpickrRef.current.setDate(defaultValue, false);
    }
  }, [defaultValue]);

  return (
    <input
      className="form-control"
      placeholder={placeholder}
      defaultValue={defaultValue}
      ref={timeInputRef}
      type="text"
    />
  );
};

export default TimePicker;