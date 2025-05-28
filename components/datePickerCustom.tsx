"use client";

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
      reset: () => flatpickrInstance.current?.clear(),
      setValue: (value: string) => {
        const gDate = parseDate(convertToGregorian(value));
        if (flatpickrInstance.current && gDate) {
          flatpickrInstance.current.setDate(gDate, true);
        }
      },
    }));

    useEffect(() => {
      if (!inputRef.current) return;

      const instance = flatpickr(inputRef.current, {
        monthSelectorType: "static",
        locale: Thai,
        allowInput: true,

        // ✅ Show Buddhist year in input
        altInput: true,
        altFormat: "d/m/Y",

        // ✅ Save ISO (Gregorian)
        dateFormat: "Y-m-d",

        // ✅ Support Thai year input
        parseDate: (datestr) => {
          const [d, m, y] = datestr.split("/").map(Number);
          const gYear = y > 2500 ? y - 543 : y;
          return new Date(gYear, m - 1, d);
        },

        // ✅ Force altInput to always show พ.ศ.
        formatDate: (date, format, locale) => {
          const d = String(date.getDate()).padStart(2, "0");
          const m = String(date.getMonth() + 1).padStart(2, "0");
          const y = date.getFullYear() + 543;
          return `${d}/${m}/${y}`;
        },

        defaultDate: defaultValue ? parseDate(convertToGregorian(defaultValue)) : undefined,
        minDate: minDate ? parseDate(convertToGregorian(minDate)) : undefined,
        maxDate: maxDate ? parseDate(convertToGregorian(maxDate)) : undefined,

        onChange: (selectedDates, _dateStr, instance) => {
          const selected = selectedDates?.[0];
          if (!selected) return;
          const iso = selected.toISOString().split("T")[0];
          onChange?.(iso);
          updateCalendarYear(instance);
        },

        onReady: (_, __, instance) => updateCalendarYear(instance),
        onMonthChange: (_, __, instance) => updateCalendarYear(instance),
        onYearChange: (_, __, instance) => updateCalendarYear(instance),
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
      return () => instance.destroy();
    }, [defaultValue, minDate, maxDate]);

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

    const updateCalendarYear = (instance: FlatpickrInstance) => {
      const container = instance.calendarContainer;
      if (!container) return;
      const yearEls = container.querySelectorAll<HTMLElement>(".cur-year, .numInput.cur-year");
      yearEls.forEach((el) => {
        const y = parseInt((el as HTMLInputElement).value || el.textContent || "0", 10);
        const b = y > 3000 ? y - 543 : y + 543;
        if (el instanceof HTMLInputElement) el.value = b.toString();
        else el.textContent = b.toString();
      });
    };

    return <input ref={inputRef} type="text" className="form-control" placeholder={placeholder} />;
  }
);

DatePicker.displayName = "DatePicker";
export default DatePicker;
