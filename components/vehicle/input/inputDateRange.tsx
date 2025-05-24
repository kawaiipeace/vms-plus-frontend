import * as Popover from '@radix-ui/react-popover';
import { format } from 'date-fns';
import { DayPicker, DateRange } from 'react-day-picker';
import { useEffect, useState } from 'react';
import 'react-day-picker/dist/style.css';

type Props = {
    value?: DateRange;
    onChange?: (range: DateRange | undefined) => void;
};

const DateRangePopover = ({ value, onChange }: Props) => {
    const [isSelectingTo, setIsSelectingTo] = useState(false);
    const [selectedRange, setSelectedRange] = useState<DateRange | undefined>({
        from: value?.from,
        to: value?.to,
    });
    const [isOpen, setIsOpen] = useState(false);

    const formattedRange = selectedRange?.from && selectedRange?.to
        ? `${format(selectedRange.from, 'yyyy-MM-dd')} - ${format(selectedRange.to, 'yyyy-MM-dd')}`
        : 'เลือกช่วงวันที่';

    useEffect(() => {
        setSelectedRange(value);
    }, [value]);

    const handleDateSelect = (range: DateRange | undefined) => {
        if (!range) return;

        if (!isSelectingTo) {
            setSelectedRange({ from: range.from, to: undefined });
            setIsSelectingTo(true);
        } else {
            setSelectedRange({ from: range.from, to: range.to });

            if (range.from && range.to) {
                onChange?.(range);
            }
        }
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
                    className="bg-white shadow-lg rounded-lg p-4 z-50"
                    onInteractOutside={(event) => {
                        if ((event.target as HTMLElement).closest('.rdp')) {
                            event.preventDefault();
                        }
                    }}
                >
                    <DayPicker
                        mode="range"
                        selected={selectedRange}
                        numberOfMonths={2}
                        showOutsideDays
                        onSelect={handleDateSelect}
                    />
                </Popover.Content>
            </Popover.Portal>
        </Popover.Root>
    );
}

export default DateRangePopover;