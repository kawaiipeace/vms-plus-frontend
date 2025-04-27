"use client";

import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";
import { Thai } from "flatpickr/dist/l10n/th.js";
import { Instance as FlatpickrInstance } from "flatpickr/dist/types/instance";
import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";

interface DatePickerProps {
  placeholder?: string;
  onChange?: (dateStr: string) => void;
}

export interface DatePickerRef {
  reset: () => void;
}

const DatePicker = forwardRef<DatePickerRef, DatePickerProps>(({ placeholder, onChange }, ref) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const flatpickrInstance = useRef<FlatpickrInstance | null>(null);

  useImperativeHandle(ref, () => ({
    reset: () => {
      if (flatpickrInstance.current) {
        flatpickrInstance.current.clear(); // Clear the selected date
      }
    },
  }));

  useEffect(() => {
    if (inputRef.current) {
      flatpickrInstance.current = flatpickr(inputRef.current, {
        dateFormat: "d/m/Y",
        locale: Thai,
        static: true,
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

          updateCalendarYear(instance);
        },

        onChange: function (selectedDates, dateStr, instance) {
          instance.input.value = dateStr;

          if (onChange) {
            onChange(dateStr);
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
  }, []);

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

  return <input ref={inputRef} type="text" className="form-control" placeholder={placeholder} />;
});

DatePicker.displayName = "DatePicker";

export default DatePicker;
