import * as Popover from '@radix-ui/react-popover';
import { DayPicker, DateRange } from 'react-day-picker';
import { useState } from 'react';
import 'react-day-picker/dist/style.css';
import { DateLongTH } from '@/utils/vehicle-management';

type Props = {
    date: DateRange | undefined;
    onChange?: (range: DateRange | undefined) => void;
};

const DateRangePicker = ({ date, onChange }: Props) => {
    const [range, setRange] = useState<DateRange | undefined>(date);
    const [isOpen, setIsOpen] = useState(false);

    const formattedRange = range?.from && range?.to
        ? `${DateLongTH(range?.from)} - ${DateLongTH(range?.to)}`
        : 'เลือกช่วงวันที่';

    const handleSelectDate = (range: DateRange | undefined) => {
        if (!range) return;

        setRange(range);
    };

    return (
        <Popover.Root open={isOpen} onOpenChange={setIsOpen}>
            <Popover.Trigger asChild>
                <div className="input-group">
                    <i className="material-symbols-outlined text-lg text-gray-500">calendar_month</i>
                    <button className="min-w-[210px] max-w-[210px]">
                        {formattedRange}
                    </button>
                </div>
            </Popover.Trigger>

            <Popover.Portal>
                <Popover.Content
                    sideOffset={5}
                    className="bg-white shadow-lg rounded-lg z-50 p-2"
                >
                    <DayPicker
                        mode="range"
                        required
                        selected={range}
                        numberOfMonths={2}
                        showOutsideDays
                        onSelect={handleSelectDate}
                    />

                    <div className="flex mt-2 justify-end">
                        <Popover.Close asChild>
                            <button
                                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                                disabled={!range?.from || !range?.to}
                                onClick={() => {
                                    if (range?.from && range?.to) {
                                        onChange?.(range);
                                    }
                                }}
                            >
                                เสร็จสิ้น
                            </button>
                        </Popover.Close>
                    </div>
                </Popover.Content>
            </Popover.Portal>
        </Popover.Root>
    );
}

export default DateRangePicker;