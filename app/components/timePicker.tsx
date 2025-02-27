// TimePicker.tsx
import React, { useEffect, useRef } from 'react';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.css';

export default function TimePicker () {
  const timeInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (timeInputRef.current) {
      flatpickr(timeInputRef.current, {
        enableTime: true,
        noCalendar: true,
        // dateFormat: 'H:i',
        altFormat: 'H:i',
      });
    }
  }, []);

  return (<input className="form-control date-picker-timepickers " placeholder="HH:MM" ref={timeInputRef} type="text" />);
};

