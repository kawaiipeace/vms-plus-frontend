"use client";

import dayjs from "dayjs";
import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";
import { Thai } from "flatpickr/dist/l10n/th";
import { Instance as FlatpickrInstance } from "flatpickr/dist/types/instance";
import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";

interface DatePickerProps {
  placeholder?: string;
  defaultValue?: string; // Format: "dd/mm/พ.ศ."
  minDate?: string;
  maxDate?: string;
  onChange?: (isoDate: string) => void; // Format: "YYYY-MM-DD"
}

export interface DatePickerRef {
  reset: () => void;
  setValue: (value: string) => void;
}

const DatePicker = forwardRef<DatePickerRef, DatePickerProps>(
  ({ placeholder, defaultValue, minDate, maxDate, onChange }, ref) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const flatpickrInstance = useRef<FlatpickrInstance | null>(null);

    useImperativeHandle(ref, () => ({
      reset: () => {
        if (flatpickrInstance.current) {
          flatpickrInstance.current.clear();
        }
      },
      setValue: (value: string) => {
        if (flatpickrInstance.current && value) {
          flatpickrInstance.current.setDate(convertToGregorian(value), true);
        }
      },
    }));

    useEffect(() => {
      if (!inputRef.current) return;

      if (flatpickrInstance.current) {
        flatpickrInstance.current.destroy();
      }

      const instance = flatpickr(inputRef.current, {
        mode: "single",
        monthSelectorType: "static",
        locale: Thai,
        allowInput: true,
        altFormat: "d/m/Y",
        dateFormat: "Y-m-d",
        disableMobile: true,
        static: window.innerWidth <= 768,
        positionElement: inputRef.current,
        parseDate: (datestr: string, format: string) => {
          if (!datestr) return new Date(NaN);
          if (datestr.includes("-")) {
            return new Date(datestr);
          }
          const [d, m, y] = datestr.split("/").map(Number);
          const gYear = y > 2500 ? y - 543 : y;
          return new Date(gYear, m - 1, d);
        },
        formatDate: (date, _format, _locale) => {
          // Always display Buddhist year
          const d = String(date.getDate()).padStart(2, "0");
          const m = String(date.getMonth() + 1).padStart(2, "0");
          const y = date.getFullYear() + 543;
          return `${d}/${m}/${y}`;
        },
        defaultDate: defaultValue ? parseDate(convertToGregorian(defaultValue)) : undefined,
        minDate: minDate,
        maxDate: maxDate,
        onChange: (selectedDates, _dateStr, instance) => {
          const selected = selectedDates?.[0];
          if (!selected) return;
          const localDate = dayjs(selected).format("YYYY-MM-DD");
          onChange?.(localDate);
          setTimeout(() => updateCalendarYear(instance), 1); // Patch the year display after change
        },
        onReady: (_dates, dateStr, instance) => {
          patchBuddhistInput(instance, dateStr);
          setTimeout(() => updateCalendarYear(instance), 1);
        },
        onMonthChange: (_dates, _dateStr, instance) => {
          setTimeout(() => updateCalendarYear(instance), 1);
        },
        onYearChange: (_dates, _dateStr, instance) => {
          setTimeout(() => updateCalendarYear(instance), 1);
        },
        onOpen: () => {
          const wrapper = document.querySelector(".modal-scroll-wrapper") as HTMLElement;
          if (wrapper) wrapper.style.overflow = "hidden";
        },
        onClose: () => {
          const wrapper = document.querySelector(".modal-scroll-wrapper") as HTMLElement;
          if (wrapper) wrapper.style.overflow = "";
        },
      });

      flatpickrInstance.current = instance;
      return () => {
        flatpickrInstance.current?.destroy();
        instance.destroy();
      };
    }, [defaultValue, minDate, maxDate]);

    // Patch the calendar year header and selector input to always display Buddhist year
    const updateCalendarYear = (instance: FlatpickrInstance) => {
      const container = instance.calendarContainer;
      if (!container) return;
      // Patch text year (header)
      const yearEls = container.querySelectorAll<HTMLElement>(".cur-year, .numInput.cur-year");
      yearEls.forEach(el => {
        let y: number;
        if (el instanceof HTMLInputElement) {
          y = parseInt(el.value, 10);
          if (y < 2500 || y < 1000) el.value = (y + 543).toString();
        } else {
          y = parseInt(el.textContent || "0", 10);
          if (y < 2500 || y < 1000) el.textContent = (y + 543).toString();
        }
      });
    };

    // Patch the input field for Buddhist year after ready
    const patchBuddhistInput = (instance: FlatpickrInstance, dateStr: string) => {
      if (!instance.input) return;
      if (!dateStr) return;
      const [d, m, y] = dateStr.split("/");
      let buddhistYear = y;
      if (y && parseInt(y, 10) < 2500) {
        buddhistYear = (parseInt(y, 10) + 543).toString();
      }
      instance.input.value = [d, m, buddhistYear].join("/");
    };

    const convertToGregorian = (thaiDate: string): string => {
      const [d, m, y] = thaiDate.split("/");
      const year = parseInt(y, 10);
      const gregorian = year > 2500 ? year - 543 : year;
      return `${d}/${m}/${gregorian}`;
    };

    const parseDate = (dmy: string): Date | undefined => {
      const [d, m, y] = dmy.split("/").map(Number);
      if (!d || !m || !y) return undefined;
      return new Date(y, m - 1, d);
    };

    return (
      <input
        ref={inputRef}
        type="text"
        className="form-control"
        placeholder={placeholder}
        autoComplete="off"
      />
    );
  }
);

DatePicker.displayName = "DatePicker";
export default DatePicker;