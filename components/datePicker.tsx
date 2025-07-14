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
        position: "auto left",
        disableMobile: true,
        static: window.innerWidth <= 768,
        positionElement: inputRef.current,
        parseDate: (datestr: string, _format: string) => {
          if (!datestr || datestr.includes("-")) {
            return new Date(datestr);
          }
          const parsed = parseDate(datestr);
          return parsed ?? new Date(NaN);
        },
        formatDate: (date, _format, _locale) => {
          const d = String(date.getDate()).padStart(2, "0");
          const m = String(date.getMonth() + 1).padStart(2, "0");
          const y = date.getFullYear() + 543;
          return `${d}/${m}/${y}`;
        },
        defaultDate: defaultValue ? parseDate(convertToGregorian(defaultValue)) : undefined,
        minDate,
        maxDate,

        onChange: (selectedDates, _dateStr, instance) => {
          const selected = selectedDates?.[0];
          if (!selected) {
            // When date is cleared, call onChange with empty string
            onChange?.("");
            return;
          }
          const localDate = dayjs(selected).format("YYYY-MM-DD");
          onChange?.(localDate);
          requestAnimationFrame(() => updateCalendarYear(instance));
        },

        onReady: (_dates, dateStr, instance) => {
          patchBuddhistInput(instance, dateStr);
          requestAnimationFrame(() => updateCalendarYear(instance));
        },

        onMonthChange: (_dates, _dateStr, instance) => {
          requestAnimationFrame(() => updateCalendarYear(instance));
        },

        onYearChange: (_dates, _dateStr, instance) => {
          requestAnimationFrame(() => updateCalendarYear(instance));
        },

        onValueUpdate: (_dates, dateStr, instance) => {
          validateAndClearIfInvalid(instance);
          if (dateStr) {
            patchBuddhistInput(instance, dateStr);
          }
          requestAnimationFrame(() => updateCalendarYear(instance));
        },
    

        onOpen: (_dates, _dateStr, instance) => {
          document.querySelectorAll(".flatpickr-calendar").forEach(el => {
            el.classList.add("flatpickr-center-mobile");
          });
          const wrapper = document.querySelector(".modal-scroll-wrapper") as HTMLElement;
          if (wrapper) wrapper.style.overflow = "hidden";
          requestAnimationFrame(() => updateCalendarYear(instance));
        },

        onClose: (_dates, _dateStr, instance) => {
          const wrapper = document.querySelector(".modal-scroll-wrapper") as HTMLElement;
          if (wrapper) wrapper.style.overflow = "";
          validateAndClearIfInvalid(instance);
          // Ensure onChange is called if the input is empty after validation
          if (!instance.input?.value) {
            onChange?.("");
          }
        },
      });

      flatpickrInstance.current = instance;

      return () => {
        flatpickrInstance.current?.destroy();
        instance.destroy();
      };
    }, [defaultValue, minDate, maxDate]);

    const validateAndClearIfInvalid = (instance: FlatpickrInstance) => {
      const input = instance.input;
      const value = input?.value ?? "";
      const parts = value.split("/").map(s => s.trim());
      
      if (parts.length !== 3) {
        instance.clear();
        if (input) input.value = "";
        onChange?.("");
        return;
      }

      const [d, m, y] = parts;
      const day = parseInt(d, 10);
      const month = parseInt(m, 10);
      const year = parseInt(y, 10);

      // Validate day (1-31)
      if (isNaN(day) || day < 1 || day > 31) {
        instance.clear();
        if (input) input.value = "";
        onChange?.("");
        return;
      }

      // Validate month (1-12)
      if (isNaN(month) || month < 1 || month > 12) {
        instance.clear();
        if (input) input.value = "";
        onChange?.("");
        return;
      }

      // Validate year (must be at least 1000 in Buddhist or Gregorian)
      if (isNaN(year) || (year < 1000 && (year + 543) < 1000)) {
        instance.clear();
        if (input) input.value = "";
        onChange?.("");
        return;
      }
    };

    const updateCalendarYear = (instance: FlatpickrInstance) => {
      const container = instance.calendarContainer;
      if (!container) return;
      const yearEls = container.querySelectorAll<HTMLElement>(".cur-year, .numInput.cur-year");
      yearEls.forEach(el => {
        let y: number;
        if (el instanceof HTMLInputElement) {
          y = parseInt(el.value, 10);
          if (y && y < 2500) el.value = (y + 543).toString();
        } else {
          y = parseInt(el.textContent || "0", 10);
          if (y && y < 2500) el.textContent = (y + 543).toString();
        }
      });
    };

    const patchBuddhistInput = (instance: FlatpickrInstance, dateStr: string) => {
      if (!instance.input || !dateStr) return;
      const [d, m, y] = dateStr.split("/");
      let buddhistYear = y;
      if (y && parseInt(y, 10)) {
        const yearNum = parseInt(y, 10);
        buddhistYear = yearNum < 2500 ? (yearNum + 543).toString() : y;
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
      const parts = dmy.split("/").map(part => part.trim());
      if (parts.length !== 3) return undefined;

      const [d, m, y] = parts;
      if (!d || !m || !y || y.length < 4 || isNaN(Number(y))) return undefined;

      let year = Number(y);
      if (year > 2500) year -= 543;

      const day = Number(d);
      const month = Number(m);
      const date = new Date(year, month - 1, day);
      return isNaN(date.getTime()) ? undefined : date;
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