import { CarUserDetail, DriverDetail, VehicleTimelineTransformData } from "@/app/types/vehicle-management/vehicle-timeline-type";
import { getHoliday } from "@/services/vehicleService";
import dayjs from "dayjs";
import 'dayjs/locale/th';

dayjs.locale('th');

export function transformApiToTableData(rawData: any, dates: any[]): VehicleTimelineTransformData[] {

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
        let status = '';
        let carUserDetail: Record<string, string> = {};
        let driverDetail: Record<string, string> = {};

        vehicle.vehicle_trn_requests?.forEach((req: any) => {
            if (req.trip_details.length === 0) return;

            status = req.time_line_status;

            carUserDetail.userName = req.vehicle_user_emp_name || 'นายไข่ สนาม';
            carUserDetail.userContactNumber = req.car_user_mobile_contact_number || '0912345678';
            carUserDetail.userContactInternalNumber = req.car_user_internal_contact_number || '1234';

            driverDetail.driverName = req.driver.driver_name;
            driverDetail.licensePlate = vehicle.vehicle_license_plate

            req.trip_details?.forEach((trip: any) => {
                const start = dayjs(trip.trip_start_datetime);
                const end = dayjs(trip.trip_end_datetime);
                const dayStart = start.date();
                const dayEnd = end.date();
                const duration = Math.max(dayEnd - dayStart + 1, 1);
                const destinationPlace = trip.trip_destination_place

                timeline[`day_${dayStart}`]?.push({
                    tripDetailId: trip.trn_trip_detail_uid,
                    destinationPlace: destinationPlace,
                    startTime: start.format("HH:mm"),
                    duration: duration.toString(),
                    status: status,
                    carUserDetail: carUserDetail,
                    driverDetail: driverDetail
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
            vehicleStatus: status,
            timeline: timeline
        };
        
        return result;
    });
}

export async function generateDateObjects(startDate: string, endDate: string) {
  try {
    const response = await getHoliday({ start_date: startDate, end_date: endDate });

    const holidayMap = new Map(
      response.map((item: any) => [
        dayjs(item.mas_holidays_date).format("YYYY-MM-DD"),
        item.mas_holidays_detail,
      ])
    );

    const start = dayjs(startDate);
    const end = dayjs(endDate);

    const dates = [];
    let current = start;

    while (current.isBefore(end) || current.isSame(end)) {
      const formattedDate = current.format("YYYY-MM-DD");

      dates.push({
        key: `day_${current.date()}`,
        date: formattedDate,
        day: current.date(),
        month: current.format("MMM"),
        fullMonth: current.format("MMMM"),
        fullYear: (current.year() + 543).toString(),
        weekday: current.format("ddd"),
        holiday: holidayMap.get(formattedDate) ?? null,
      });

      current = current.add(1, "day");
    }

    return dates;
  } catch (e) {
    console.error("Error in generateDateObjects:", e);
    return [];
  }
}
