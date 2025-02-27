import React, { useEffect, useRef } from 'react';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.css';

interface TimePickerProps {
  placeholder?: string;
  onChange?: (selectedTime: string) => void;
}

const TimePicker: React.FC<TimePickerProps> = ({
  placeholder = 'HH:MM',
  onChange,
}) => {
  const timeInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fp = flatpickr(timeInputRef.current!, {
      enableTime: true,
      noCalendar: true,
      static : true,
      dateFormat: 'H:i',
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
      ref={timeInputRef}
      type="text"
    />
  
  );
};

export default TimePicker;
