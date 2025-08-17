'use client'

import dayjs from 'dayjs'
import flatpickr from 'flatpickr'
import 'flatpickr/dist/flatpickr.min.css'
import { Thai } from 'flatpickr/dist/l10n/th'
import { Instance as FlatpickrInstance } from 'flatpickr/dist/types/instance'
import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'

dayjs.extend(utc)
dayjs.extend(timezone)

interface DatePickerProps {
  placeholder?: string
  defaultValue?: string // Format: "dd/mm/พ.ศ."
  minDate?: string
  maxDate?: string
  onChange?: (isoDate: string) => void // Format: "YYYY-MM-DD"
}

export interface DatePickerRef {
  reset: () => void
  setValue: (value: string) => void
}

const DatePicker = forwardRef<DatePickerRef, DatePickerProps>(({ placeholder, defaultValue, minDate, maxDate, onChange }, ref) => {
  const inputRef = useRef<HTMLInputElement>(null)
  const flatpickrInstance = useRef<FlatpickrInstance | null>(null)

  // Expose reset and setValue methods
  useImperativeHandle(ref, () => ({
    reset: () => {
      if (flatpickrInstance.current) {
        flatpickrInstance.current.clear()
      }
    },
    setValue: (value: string) => {
      if (flatpickrInstance.current && value) {
        // value expected in "dd/mm/yyyy" Buddhist or Gregorian format
        flatpickrInstance.current.setDate(convertToGregorian(value), true)
      }
    },
  }))

  // Initialize flatpickr
  useEffect(() => {
    if (!inputRef.current) return

    if (flatpickrInstance.current) {
      flatpickrInstance.current.destroy()
    }

    const instance = flatpickr(inputRef.current, {
      mode: 'single',
      monthSelectorType: 'static',
      locale: Thai,
      allowInput: true,
      altFormat: 'd/m/Y',
      dateFormat: 'Y-m-d', // always Gregorian internally
      position: 'auto left',
      disableMobile: true,
      static: window.innerWidth <= 768,
      positionElement: inputRef.current,

      // Parsing: accept "dd/mm/yyyy" Buddhist or Gregorian
      parseDate: (datestr: string, _format: string) => {
        if (!datestr || datestr.includes('-')) {
          return new Date(datestr)
        }
        const parsed = parseDate(datestr)
        return parsed ?? new Date(NaN)
      },

      // Format date to show in input: Buddhist year
      formatDate: (date, _format, _locale) => {
        const d = String(date.getDate()).padStart(2, '0')
        const m = String(date.getMonth() + 1).padStart(2, '0')
        const y = date.getFullYear() + 543
        return `${d}/${m}/${y}`
      },

      defaultDate: defaultValue ? parseDate(convertToGregorian(defaultValue)) : undefined,
      minDate,
      maxDate,

      // When user changes date selection
      onChange: (selectedDates, _dateStr, instance) => {
        const selected = selectedDates?.[0]
        if (!selected) {
          // Cleared
          onChange?.('')
          return
        }
        const localDate = dayjs(selected).format('YYYY-MM-DD')
        onChange?.(localDate)

        // Update calendar UI year display
        requestAnimationFrame(() => updateCalendarYear(instance))
      },

      onReady: (_dates, dateStr, instance) => {
        patchBuddhistInput(instance, dateStr)
        requestAnimationFrame(() => updateCalendarYear(instance))
      },

      onMonthChange: (_dates, _dateStr, instance) => {
        requestAnimationFrame(() => updateCalendarYear(instance))
      },

      onYearChange: (_dates, _dateStr, instance) => {
        requestAnimationFrame(() => updateCalendarYear(instance))
      },

      onValueUpdate: (_dates, dateStr, instance) => {
        validateAndClearIfInvalid(instance)
        if (dateStr) {
          patchBuddhistInput(instance, dateStr)
        }
        requestAnimationFrame(() => updateCalendarYear(instance))
      },

      onOpen: (_dates, _dateStr, instance) => {
        document.querySelectorAll('.flatpickr-calendar').forEach((el) => {
          el.classList.add('flatpickr-center-mobile')
        })
        const wrapper = document.querySelector('.modal-scroll-wrapper') as HTMLElement
        if (wrapper) wrapper.style.overflow = 'hidden'
        requestAnimationFrame(() => updateCalendarYear(instance))

        // Set up a periodic check to ensure year display stays updated
        const intervalId = setInterval(() => {
          if (instance.calendarContainer && instance.calendarContainer.style.display !== 'none') {
            updateCalendarYear(instance)
          } else {
            clearInterval(intervalId)
          }
        }, 500) // Check every 500ms while calendar is open

        // Store interval ID for cleanup
        instance.calendarContainer?.setAttribute('data-interval-id', intervalId.toString())

        // Add click event listener to catch any user interactions
        if (instance.calendarContainer) {
          const clickHandler = () => {
            requestAnimationFrame(() => updateCalendarYear(instance))
          }
          instance.calendarContainer.addEventListener('click', clickHandler)
          // Store the handler function reference for cleanup
          ;(instance.calendarContainer as any)._clickHandler = clickHandler
        }
      },

      onClose: (_dates, _dateStr, instance) => {
        const wrapper = document.querySelector('.modal-scroll-wrapper') as HTMLElement
        if (wrapper) wrapper.style.overflow = ''
        validateAndClearIfInvalid(instance)
        if (!instance.input?.value) {
          onChange?.('')
        }

        // Clean up interval if it exists
        if (instance.calendarContainer) {
          const intervalId = instance.calendarContainer.getAttribute('data-interval-id')
          if (intervalId) {
            clearInterval(parseInt(intervalId, 10))
            instance.calendarContainer.removeAttribute('data-interval-id')
          }

          // Clean up click handler if it exists
          if ((instance.calendarContainer as any)._clickHandler) {
            instance.calendarContainer.removeEventListener('click', (instance.calendarContainer as any)._clickHandler)
            delete (instance.calendarContainer as any)._clickHandler
          }
        }
      },
    })

    flatpickrInstance.current = instance

    return () => {
      flatpickrInstance.current?.destroy()
      instance.destroy()
    }
  }, [defaultValue, minDate, maxDate])

  // Validate user input, clear if invalid
  const validateAndClearIfInvalid = (instance: FlatpickrInstance) => {
    const input = instance.input
    const value = input?.value ?? ''
    const parts = value.split('/').map((s) => s.trim())

    if (parts.length !== 3) {
      instance.clear()
      if (input) input.value = ''
      onChange?.('')
      return
    }

    const [d, m, y] = parts
    const day = parseInt(d, 10)
    const month = parseInt(m, 10)
    const year = parseInt(y, 10)

    if (isNaN(day) || day < 1 || day > 31) {
      instance.clear()
      if (input) input.value = ''
      onChange?.('')
      return
    }

    if (isNaN(month) || month < 1 || month > 12) {
      instance.clear()
      if (input) input.value = ''
      onChange?.('')
      return
    }

    if (isNaN(year) || (year < 1000 && year + 543 < 1000)) {
      instance.clear()
      if (input) input.value = ''
      onChange?.('')
      return
    }
  }

  // Update calendar year UI elements with Buddhist year, but store Gregorian year in data attribute
  const updateCalendarYear = (instance: FlatpickrInstance) => {
    const container = instance.calendarContainer
    if (!container) return

    const yearEls = container.querySelectorAll<HTMLElement>('.cur-year, .numInput.cur-year')

    yearEls.forEach((el) => {
      let gregYear: number

      if (el instanceof HTMLInputElement) {
        // Get the current value from the element (this will be the actual current year)
        const currentValue = parseInt(el.value, 10)

        // Check if this is a Buddhist year (>= 2500) and convert to Gregorian
        if (!isNaN(currentValue)) {
          if (currentValue >= 2500) {
            gregYear = currentValue - 543
          } else {
            gregYear = currentValue
          }

          // Store the Gregorian year and display Buddhist year
          el.setAttribute('data-gregorian-year', gregYear.toString())
          el.value = (gregYear + 543).toString()
        }
      } else {
        // For non-input elements (like text spans)
        const currentText = parseInt(el.textContent || '0', 10)

        if (!isNaN(currentText)) {
          // Check if this is a Buddhist year (>= 2500) and convert to Gregorian
          if (currentText >= 2500) {
            gregYear = currentText - 543
          } else {
            gregYear = currentText
          }

          // Store the Gregorian year and display Buddhist year
          el.setAttribute('data-gregorian-year', gregYear.toString())
          el.textContent = (gregYear + 543).toString()
        }
      }
    })
  }

  // Patch input value to show Buddhist year, but underlying flatpickr stores Gregorian date
  const patchBuddhistInput = (instance: FlatpickrInstance, dateStr: string) => {
    if (!instance.input || !dateStr) return

    const [d, m, y] = dateStr.split('/')

    if (!d || !m || !y) return

    const yearNum = parseInt(y, 10)

    let buddhistYear = y

    if (yearNum && yearNum < 2500) {
      buddhistYear = (yearNum + 543).toString()
    } else if (yearNum && yearNum > 3000) {
      buddhistYear = (yearNum - 543).toString()
    }

    instance.input.value = [d, m, buddhistYear].join('/')
  }

  // Convert input Thai Buddhist year date string to Gregorian date string ("dd/mm/yyyy")
  const convertToGregorian = (thaiDate: string): string => {
    const [d, m, y] = thaiDate.split('/')

    const year = parseInt(y, 10)
    const gregorian = year > 2500 ? year - 543 : year

    return `${d}/${m}/${gregorian}`
  }

  // Parse "dd/mm/yyyy" (Gregorian) string to Date object
  const parseDate = (dmy: string): Date | undefined => {
    const parts = dmy.split('/').map((part) => part.trim())
    if (parts.length !== 3) return undefined

    const [d, m, y] = parts
    if (!d || !m || !y || y.length < 4 || isNaN(Number(y))) return undefined

    let year = Number(y)
    if (year > 2500) year -= 543

    const day = Number(d)
    const month = Number(m)
    const date = new Date(year, month - 1, day)

    return isNaN(date.getTime()) ? undefined : date
  }

  return <input ref={inputRef} type="text" className="form-control" placeholder={placeholder} autoComplete="off" />
})

DatePicker.displayName = 'DatePicker'
export default DatePicker
