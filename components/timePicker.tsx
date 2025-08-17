import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.css";
import React, { useEffect, useRef } from "react";

interface TimePickerProps {
  placeholder?: string;
  defaultValue?: string;
  minTime?: string;
  value?: string;
  onChange?: (selectedTime: string) => void;
}

const TimePicker: React.FC<TimePickerProps> = ({ placeholder = "HH:MM",minTime, defaultValue, value, onChange }) => {
  const timeInputRef = useRef<HTMLInputElement>(null);
  const flatpickrRef = useRef<flatpickr.Instance | null>(null);

  useEffect(() => {


    if (!timeInputRef.current) return;

    if (flatpickrRef.current) {
      flatpickrRef.current.destroy();
    }

    // Initialize flatpickr
    flatpickrRef.current = flatpickr(timeInputRef.current!, {
      enableTime: true,
      noCalendar: true,
      static: true,
      disableMobile: true,
      minTime: minTime,
      defaultDate: defaultValue || "",
      dateFormat: "H:i",
      position: "below center",
      minuteIncrement: 1,
      time_24hr: true,
      onChange: (selectedDates, dateStr) => {
        if (onChange) {
          onChange(dateStr);
        }
      },
      onOpen: (_dates, _dateStr, instance) => {
        document.querySelectorAll(".flatpickr-calendar").forEach(el => {
          el.classList.remove("flatpickr-center-mobile");
        });
      },
    });

    // Cleanup flatpickr instance on unmount
    return () => {
      if (flatpickrRef.current) {
        flatpickrRef.current.destroy();
        flatpickrRef.current = null;
      }
    };
  }, [minTime]); // Empty dependency array - only initialize once

  // Handle updates to defaultValue
  useEffect(() => {
    if (flatpickrRef.current && defaultValue) {
      flatpickrRef.current.setDate(defaultValue, false);
    }
  }, [defaultValue]);

  return (
    <div className="!relative"> {/* Added wrapper div */}
      <input
        className="form-control"
        placeholder={placeholder}
        defaultValue={defaultValue}
        ref={timeInputRef}
        type="text"
      />
    </div>
  );
};

export default TimePicker;
