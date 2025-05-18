import Flatpickr from 'react-flatpickr';
import flatpickr from 'flatpickr';
import React, { useState } from "react";
import { Thai } from 'flatpickr/dist/l10n/th';

interface DateRangePickerProps {
    defaultValue?: { startDate: Date, endDate: Date };
    onChange?: (startDate: Date | null, endDate: Date | null) => void;
};

// local thai
flatpickr.localize(Thai);

const DateRangePicker: React.FC<DateRangePickerProps> = ({defaultValue, onChange}) => {
    const [dateRange, setDateRange] = useState<Date[]>([
        defaultValue?.startDate || new Date(),
        defaultValue?.endDate || new Date(),    
    ]);

    const handleDatePicker = (selectedDates: Date[]) => {
        const startDate = selectedDates[0] || null;
        const endDate = selectedDates[1] || null;

        setDateRange(selectedDates);
        onChange?.(startDate, endDate);
    }

    return (
        <div>
            <i className="material-symbols-outlined absolute text-gray-400 left-3 top-2">calendar_today</i>
            <Flatpickr
                options={{
                    mode: 'range',
                    dateFormat: 'Y-m-d',
                    locale: {
                        ...Thai,
                        rangeSeparator: ' - ',
                    },
                }}
                placeholder='เลือกวันที่'
                value={dateRange}
                onClose={handleDatePicker}
                className="form-control min-w-[250px] max-w-[250px]"
            />
        </div>
    );
};

export default DateRangePicker;