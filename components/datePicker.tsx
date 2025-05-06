"use client";

import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";
import { Thai } from "flatpickr/dist/l10n/th.js";
import { Instance as FlatpickrInstance } from "flatpickr/dist/types/instance";
import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";

interface DatePickerProps {
  placeholder?: string;
  defaultValue?: string; // Add defaultValue prop
  onChange?: (dateStr: string) => void;
}

export interface DatePickerRef {
  reset: () => void;
  setValue: (value: string) => void;
}

const DatePicker = forwardRef<DatePickerRef, DatePickerProps>(({ placeholder, defaultValue, onChange }, ref) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const flatpickrInstance = useRef<FlatpickrInstance | null>(null);

  useImperativeHandle(ref, () => ({
    reset: () => {
      if (flatpickrInstance.current) {
        flatpickrInstance.current.clear(); // Clear the selected date
      }
    },
    setValue: (newValue: string) => {
      if (flatpickrInstance.current) {
        // Convert Buddhist year to Gregorian year before setting the date
        const gregorianDate = convertToGregorianYear(newValue);
        flatpickrInstance.current.setDate(gregorianDate, true); // Set the new date
      }
    },
  }));

  useEffect(() => {
    if (inputRef.current) {
      flatpickrInstance.current = flatpickr(inputRef.current, {
        dateFormat: "d/m/Y",
        locale: Thai,
        static: true,
        defaultDate: defaultValue ? convertToGregorianYear(defaultValue) : undefined, // Convert defaultValue to Gregorian
        monthSelectorType: "static",
        prevArrow: '<i class="material-symbols-outlined">chevron_left</i>',
        nextArrow: '<i class="material-symbols-outlined">chevron_right</i>',
        onReady: function (selectedDates, dateStr, instance) {
          if (!instance.calendarContainer) return;

          const prevMonthButton = instance.calendarContainer.querySelector(".flatpickr-prev-month");
          const nextMonthButton = instance.calendarContainer.querySelector(".flatpickr-next-month");

          prevMonthButton?.classList.add("btn", "btn-tertiary", "bg-transparent", "shadow-none", "border-none");
          nextMonthButton?.classList.add("btn", "btn-tertiary", "bg-transparent", "shadow-none", "border-none");

          const origFormatDate = instance.formatDate;
          instance.formatDate = function (dateObj, formatStr) {
            const gregorianYear = origFormatDate.call(instance, dateObj, "Y");
            const buddhistYear = (parseInt(gregorianYear) + 543).toString();
            return origFormatDate.call(instance, dateObj, formatStr.replace("Y", buddhistYear));
          };

          // Update the input field value with the Buddhist year
          if (instance.input) {
            const buddhistYearDateStr = formatWithBuddhistYear(dateStr);
            instance.input.value = buddhistYearDateStr;
          }

          updateCalendarYear(instance);
        },

        onChange: function (selectedDates, dateStr, instance) {
          // Convert to Buddhist year only if it's not already in Buddhist format
          const buddhistYearDateStr = formatWithBuddhistYear(dateStr);

          // Update the input field value with the Buddhist year
          if (instance.input) {
            instance.input.value = buddhistYearDateStr;
          }

          // Call the custom onChange function if it's provided
          if (onChange) {
            onChange(buddhistYearDateStr);
          }

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

    return () => {
      flatpickrInstance.current?.destroy(); // Cleanup flatpickr instance on unmount
    };
  }, [defaultValue]); // Add defaultValue to the dependency array

  const updateCalendarYear = (instance: FlatpickrInstance) => {
    const calendarContainer = instance.calendarContainer;
    if (!calendarContainer) return;

    const yearElements = calendarContainer.querySelectorAll<HTMLElement>(".cur-year, .numInput.cur-year");

    yearElements.forEach((element) => {
      const gregorianYear = parseInt((element as HTMLInputElement).value || element.textContent || "0", 10);
      const buddhistYear = gregorianYear + 543;

      if (element instanceof HTMLInputElement) {
        element.value = buddhistYear.toString();
      } else {
        element.textContent = buddhistYear.toString();
      }
    });
  };

  const formatWithBuddhistYear = (dateStr: string): string => {
    if (!dateStr) return "";

    const [day, month, year] = dateStr.split("/");
    const yearInt = parseInt(year, 10);
    const buddhistYear = yearInt > 2500 ? yearInt : yearInt + 543; // Avoid double conversion
    return `${day}/${month}/${buddhistYear}`;
  };

  const convertToGregorianYear = (dateStr: string): string => {
    if (!dateStr) return "";

    const [day, month, year] = dateStr.split("/");
    const buddhistYear = parseInt(year, 10);
    const gregorianYear = buddhistYear > 2500 ? buddhistYear - 543 : buddhistYear; // Only convert if Buddhist year is provided
    return `${day}/${month}/${gregorianYear}`;
  };

  return <input ref={inputRef} type="text" className="form-control" placeholder={placeholder} />;
});

DatePicker.displayName = "DatePicker";

export default DatePicker;