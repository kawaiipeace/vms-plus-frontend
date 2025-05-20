import { getHoliday } from "@/services/vehicleService";
import dayjs from "dayjs";

export function transformApiToTableData(rawData: any, dates: any[]): any[] {
    const createEmptyTimeline = () => {
        const timeline: Record<string, any[]> = {};
        for (let i = 1; i <= dates.length; i++) {
            timeline[`day_${i}`] = [];
        }
        return timeline;
    };

    const vehicles: any[] = rawData ?? [];
    return vehicles.map(vehicle => {
        const timeline = createEmptyTimeline();

        vehicle.vehicle_t_requests?.forEach((req: any) => {
            if (req.trip_details.length === 0) return;

            req.trip_details?.forEach((trip: any) => {
                const start = dayjs(trip.trip_start_datetime);
                const end = dayjs(trip.trip_end_datetime);
                const dayStart = start.date();
                const dayEnd = end.date();
                const duration = Math.max(dayEnd - dayStart + 1, 1);
                const destinationPlace = trip.trip_destination_place

                timeline[`day_${dayStart}`]?.push({
                    schedule_title: destinationPlace,
                    schedule_time: start.format("HH:mm"),
                    schedule_range: duration.toString(),
                    schedule_status_code: req.ref_request_status_code,
                    schedule_status_name: req.ref_request_status_name,
                });
            });
        });

        
        const result = {
            vehicleLicensePlate: vehicle.vehicle_license_plate,
            vehicleBrandModel: vehicle.vehicle_model_name,
            vehicleBrandName: vehicle.vehicle_brand_name,
            vehicleType: vehicle.vehicle_car_type_detail,
            vehicleDepartment: vehicle.vehicle_dept_name,
            distance: vehicle.vehicle_mileage,
            timeLine: timeline
        };
        
        return result;
    });
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

        const holidayMap = new Map(holidays.map((h: any) => [h.date, h.detail]));

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
