"use client";

import { useEffect, useRef } from "react";
import flatpickr from "flatpickr";
import { Instance as FlatpickrInstance } from "flatpickr/dist/types/instance";
import "flatpickr/dist/flatpickr.min.css";
import { Thai } from "flatpickr/dist/l10n/th.js";

interface DateTimePickerProps {
  placeholder?: string;
}

const DatePicker: React.FC<DateTimePickerProps> = ({ placeholder }) => {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      flatpickr(inputRef.current, {
        dateFormat: "d/m/Y H:i", // Ensure time is included
        locale: Thai,
        enableTime: true, // Enable time selection
        noCalendar: false, // Ensure calendar is shown along with time
        time_24hr: true, // Display time in 24-hour format
        static: true,
        monthSelectorType: "static",
        prevArrow: '<i class="material-symbols-outlined">chevron_left</i>',
        nextArrow: '<i class="material-symbols-outlined">chevron_right</i>',
        onReady: function (selectedDates, dateStr, instance) {
          const prevMonthButton = instance.calendarContainer.querySelector(
            ".flatpickr-prev-month"
          );
          const nextMonthButton = instance.calendarContainer.querySelector(
            ".flatpickr-next-month"
          );
      
          prevMonthButton?.classList.add(
            "btn",
            "btn-tertiary",
            "bg-transparent",
            "shadow-none",
            "border-none"
          );
          nextMonthButton?.classList.add(
            "btn",
            "btn-tertiary",
            "bg-transparent",
            "shadow-none",
            "border-none"
          );
      
          const origFormatDate = instance.formatDate;
          instance.formatDate = function (dateObj, formatStr) {
            const gregorianYear = origFormatDate.call(instance, dateObj, "Y");
            const buddhistYear = (parseInt(gregorianYear) + 543).toString();
            return origFormatDate.call(instance, dateObj, formatStr.replace("Y", buddhistYear));
          };
      
          updateCalendarYear(instance);
        },
        onChange: function (selectedDates, dateStr, instance) {
          instance.input.value = dateStr;
          updateCalendarYear(instance);
        },
        onMonthChange: function (selectedDates, dateStr, instance) {
          updateCalendarYear(instance);
        },
        onYearChange: function (selectedDates, dateStr, instance) {
          updateCalendarYear(instance);
        },
      });
      
    }
  }, []);

  const updateCalendarYear = (instance: FlatpickrInstance) => {
    const calendarContainer = instance.calendarContainer;
    const yearElements = calendarContainer.querySelectorAll<HTMLElement>(
      ".cur-year, .numInput.cur-year"
    );

    yearElements.forEach((element) => {
      const gregorianYear = parseInt(
        (element as HTMLInputElement).value || element.textContent || "0",
        10
      );
      const buddhistYear = gregorianYear + 543;

      if (element instanceof HTMLInputElement) {
        element.value = buddhistYear.toString();
      } else {
        element.textContent = buddhistYear.toString();
      }
    });
  };

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
