import { getHoliday } from "@/services/vehicleService";
import dayjs from "dayjs";

export function transformApiToTableData(rawData: any, r: any[]): any[] {
    const vehicles: any[] = rawData;

    const row: Record<string, any> = {};
    for (let i = 1; i <= r.length; i++) {
        row[`day_${i}`] = [];
    };

    let rows: any[] = [];
    vehicles?.forEach(item => {
        const vehicleRequests = item.vehicle_t_requests;

        rows.push({
            vehicleLicensePlate: item.vehicle_license_plate,
            vehicleBrandModel: 'BYD Seal',
            vehicleType: item.vehicle_car_type_detail,
            vehicleDepartment: item.vehicle_dept_name,
            distance: item.vehicle_mileage,
            timeLine: { ...row }
        });

        vehicleRequests?.forEach((item2: any) => {
            item2.trip_details?.forEach((item3: any) => {
                const start = dayjs(item3.trip_start_datetime);
                const end = dayjs(item3.trip_end_datetime);
                const dayStart = start.date();
                const dayEnd = end.date();
                const duration = Math.max(dayEnd - dayStart + 1, 1);

                row[`day_${dayStart}`]?.push({
                    schedule_title: item3.trip_destination_place,
                    schedule_time: start.format("HH:mm"),
                    schedule_range: duration.toString(),
                });
            });
        });
    });

    return rows;
}

export async function generateDateObjects(startDate: string, endDate: string) {
    try {
        const response = await getHoliday({
            start_date: startDate,
            end_date: endDate
        });

        const holidays = response.map((item: any) => ({
            date: dayjs(item.mas_holidays_date).format("YYYY-MM-DD"),
            detail: item.mas_holidays_detail,
        }));

        const holidayMap = new Map(holidays.map((h:any) => [h.date, h.detail]));

        const start = dayjs(startDate);
        const end = dayjs(endDate);
        const dates: {
            key: string;
            date: string;
            day: number;
            month: string;
            weekday: string;
            holiday: string | null;
        }[] = [];

        let current = start;
        while (current.isBefore(end) || current.isSame(end)) {
            const formattedDate = current.format("YYYY-MM-DD");
            dates.push({
                key: `day_${current.date()}`,
                date: formattedDate,
                day: current.date(),
                month: current.format("MMM"),
                weekday: current.format("ddd"),
                holiday: typeof holidayMap.get(formattedDate) === 'string' ? holidayMap.get(formattedDate) as string : null,
            });
            current = current.add(1, "day");
        }

        return dates;
    } catch (e) {
        console.error("Error in generateDateObjects:", e);
        return [];
    }
}
