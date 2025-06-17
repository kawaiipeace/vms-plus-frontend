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
          const [d, m, y] = datestr.split("/").map(s => s.trim());
          let yearNum = Number(y);
          if (yearNum > 2500) yearNum -= 543;
          return new Date(yearNum, Number(m) - 1, Number(d));
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
        onValueUpdate: (_dates, _dateStr, instance) => {
          requestAnimationFrame(() => updateCalendarYear(instance));
        },
        onOpen: (_dates, _dateStr, instance) => {
           document.querySelectorAll(".flatpickr-calendar").forEach((el) => {
      el.classList.add("flatpickr-center-mobile");
    });
          const wrapper = document.querySelector(".modal-scroll-wrapper") as HTMLElement;
          if (wrapper) wrapper.style.overflow = "hidden";
          requestAnimationFrame(() => updateCalendarYear(instance));
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
          if (y && y < 2500) el.value = (y + 543).toString();
        } else {
          y = parseInt(el.textContent || "0", 10);
          if (y && y < 2500) el.textContent = (y + 543).toString();
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

    // Smoother, forgiving parseDate function
    const parseDate = (dmy: string): Date | undefined => {
      if (!dmy) return undefined;
      const parts = dmy.split("/").map(part => part.trim());
      if (parts.length !== 3) return undefined;
      let [d, m, y] = parts;
      d = d.padStart(2, "0");
      m = m.padStart(2, "0");
      let year = Number(y);
      // Handle Buddhist year
      if (year < 1000) year += 543;
      // Handle 2-digit years (optional: adjust logic as needed)
      if (y.length === 2) {
        year = Number(y) > 50 ? 1900 + Number(y) : 2000 + Number(y);
      }
      const day = Number(d);
      const month = Number(m);
      if (!day || !month || !year) return undefined;
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