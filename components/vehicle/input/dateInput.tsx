import { useState } from "react";
import { DayPicker } from "react-day-picker";

interface DateInputProps {
    value?: Date;
    onChange: (date: Date) => void;
}

const DateInput = ({ value, onChange }: DateInputProps) => {
    const [showCalendar, setShowCalendar] = useState(false);
    const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);

    const formatDate = (date?: Date) => date ? date.toLocaleDateString("th-TH") : "เลือกวันที่";

    return (
        <div>
            <button
                type="button"
                onClick={() => setShowCalendar(!showCalendar)}
                className="bg-white px-3 py-2 border border-gray-300 rounded-lg shadow-sm flex items-center gap-2 hover:bg-gray-100 transition">
                <i className="material-symbols-outlined text-lg text-gray-500">calendar_month</i>
                {formatDate(selectedDate ?? value)}
            </button>

            {showCalendar && (
                <div className="absolute z-100 bg-white shadow-lg mt-2">
                    <DayPicker
                        mode="single"
                        onDayClick={() => setShowCalendar(false)}
                        selected={selectedDate}
                        onSelect={(date) => {
                            setSelectedDate(date);
                            onChange(date ?? new Date());
                        }}
                    />
                </div>
            )}
        </div>
    );
};

export default DateInput;