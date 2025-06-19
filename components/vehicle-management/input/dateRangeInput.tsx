import * as Popover from '@radix-ui/react-popover';
import { DayPicker, DateRange, DropdownProps } from 'react-day-picker';
import { useState } from 'react';
import 'react-day-picker/dist/style.css';
import { DateLongTH } from '@/utils/vehicle-management';
import { th, enUS } from 'date-fns/locale';

type Props = {
    date: DateRange | undefined;
    onChange?: (range: DateRange | undefined) => void;
};

const DateRangePicker = ({ date, onChange }: Props) => {
    const isTH = true; 
    const language = isTH ? th : enUS;
    const [range, setRange] = useState<DateRange | undefined>(date);
    const [isOpen, setIsOpen] = useState(false);

    const formattedRange = range?.from && range?.to
        ? `${DateLongTH(range.from)} - ${DateLongTH(range.to)}`
        : 'เลือกช่วงวันที่';

    const handleSelectDate = (selectedRange: DateRange | undefined) => {
        if (selectedRange) {
            setRange(selectedRange);
        }
    };

    const ThaiYearDropdown = (props: DropdownProps) => {
        const { value, onChange, name, required } = props;

        const startYear = 2017; // ค.ศ.
        const endYear = 2032;

        const thaiYears = Array.from(
            { length: endYear - startYear + 1 },
            (_, i) => startYear + i + 543
        );

        return (
            <select
                className="selected-date border border-gray-300 rounded-lg p-2 ml-2 text-gray-400 appearance-none"
                name={name}
                required={required}
                value={value}
                onChange={onChange}
            >
                {thaiYears.map(thaiYear => (
                    <option key={thaiYear} value={thaiYear - 543}>
                        {thaiYear}
                    </option>
                ))}
            </select>
        );
    };

    const ThaiMonthDropdown = (props: DropdownProps) => {
        const { value, onChange } = props;
        const thaiMonths = [
            'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน',
            'พฤษภาคม', 'มิถุนายน', 'กรกฎาคม', 'สิงหาคม',
            'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'
        ];

        return (
            <select 
                className="selected-date border border-gray-300 rounded-lg p-2 ml-2 text-gray-400 appearance-none"
                value={value}
                onChange={onChange}>
                {thaiMonths.map((month, index) => (
                    <option key={index} value={index}>
                        {month}
                    </option>
                ))}
            </select>
        );
    }

    const handleConfirm = () => {
        if (range?.from && range?.to) {
            onChange?.(range);
        }
    };

    return (
        <Popover.Root open={isOpen} onOpenChange={setIsOpen}>
            <Popover.Trigger asChild>
                <div className="input-group">
                    <i className="material-symbols-outlined text-lg text-gray-500">calendar_month</i>
                    <button className="min-w-[210px] max-w-[210px] text-left">
                        {formattedRange}
                    </button>
                </div>
            </Popover.Trigger>

            <Popover.Portal>
                <Popover.Content
                    sideOffset={5}
                    className="dateRangePicker p-2 m-2 shadow-lg rounded-lg !z-[9999]"
                >
                    <DayPicker
                        mode="range"
                        captionLayout="dropdown"
                        locale={language}
                        selected={range}
                        numberOfMonths={2}
                        showOutsideDays
                        fromYear={2017}
                        toYear={3000}
                        onSelect={handleSelectDate}
                        components={{
                            YearsDropdown: ThaiYearDropdown,
                            MonthsDropdown: ThaiMonthDropdown,
                        }}
                        className='text-sm w-full'
                        classNames={{
                            today: 'text-brand-900 font-bold',
                            outside: 'text-gray-400',
                            day: 'text-black hover:bg-brand-900 hover:text-white',
                            selected: 'bg-brand-900 text-gray-900',
                            range_end: 'bg-brand-900 rounded-r-lg text-white',
                            range_start: 'bg-brand-900 rounded-l-lg text-white',
                            chevron: 'bg-white text-gray-300',
                        }}
                    />

                    <div className="flex mt-2 justify-end">
                        <Popover.Close asChild>
                            <button
                                className="text-white font-semibold rounded-lg bg-brand-900 px-4 py-2"
                                disabled={!range?.from || !range?.to}
                                onClick={handleConfirm}
                            >
                                เสร็จสิ้น
                            </button>
                        </Popover.Close>
                    </div>
                </Popover.Content>
            </Popover.Portal>
        </Popover.Root>
    );
};

export default DateRangePicker;
