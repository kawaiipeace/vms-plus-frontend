import * as Popover from '@radix-ui/react-popover';
import { DayPicker, DateRange } from 'react-day-picker';
import { HTMLAttributes, useState } from 'react';
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

    const ThaiCaption = ({ children, ...props }: HTMLAttributes<HTMLSpanElement>) => {
        const dateParts = typeof children === 'string' ? children.split(' ') : [];
        const thaiYear = dateParts[1] ? parseInt(dateParts[1]) + 543 : '';

        return (
            <span {...props} className="ml-4 mt-1 text-gray-700 font-semibold">
                {isTH ? `${dateParts[0]} ${thaiYear}` : children}
            </span>
        );
    };

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
                    className="bg-white border p-2 m-2 shadow-lg rounded-lg !z-[9999]"
                >
                    <DayPicker
                        mode="range"
                        captionLayout="dropdown"
                        locale={language}
                        selected={range}
                        numberOfMonths={2}
                        showOutsideDays
                        onSelect={handleSelectDate}
                        components={{ CaptionLabel: ThaiCaption }}
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
