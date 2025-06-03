import { DriverTimelineTransformData } from "@/app/types/carpool-management-type";
import { VehicleTimelineTransformData } from "@/app/types/vehicle-management/vehicle-timeline-type";
import { getHoliday } from "@/services/vehicleService";
import dayjs from "dayjs";
import "dayjs/locale/th";

dayjs.locale("th");

export function transformVehicleApiToTableData(rawData: any, dates: any[]): VehicleTimelineTransformData[] {
  const createEmptyTimeline = () => {
    const timeline: Record<string, any[]> = {};
    for (let i = 1; i <= dates.length; i++) {
      timeline[dates[i - 1].key] = [];
    }
    return timeline;
  };

  const vehicles: any[] = rawData ?? [];

  return vehicles.map((vehicle) => {
    const timeline = createEmptyTimeline();
    let status = "";
    let carUserDetail: Record<string, string> = {};
    let driverDetail: Record<string, string> = {};

    vehicle.vehicle_trn_requests?.forEach((req: any) => {
      if (req.trip_details.length === 0) return;

      status = req.time_line_status;

      carUserDetail.userName = req.vehicle_user_emp_name || "นายไข่ สนาม";
      carUserDetail.userContactNumber = req.car_user_mobile_contact_number || "0912345678";
      carUserDetail.userContactInternalNumber = req.car_user_internal_contact_number || "1234";

      driverDetail.driverName = req.driver.driver_name;
      driverDetail.licensePlate = vehicle.vehicle_license_plate;

      req.trip_details?.forEach((trip: any) => {
        const start = dayjs(trip.trip_start_datetime);
        const end = dayjs(trip.trip_end_datetime);
        const dayStart = start.date();
        const dayEnd = end.date();
        const duration = Math.max(dayEnd - dayStart + 1, 1);
        const destinationPlace = trip.trip_destination_place;

        timeline[`day_${start.format("D_M_YYYY")}`]?.push({
          tripDetailId: trip.trn_trip_detail_uid,
          destinationPlace: destinationPlace,
          startTime: start.format("HH:mm"),
          duration: duration.toString(),
          status: status,
          carUserDetail: carUserDetail,
          driverDetail: driverDetail,
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
      timeline: timeline,
    };

    return result;
  });
}

export async function generateDateObjects(startDate: string, endDate: string) {
  try {
    // Handle Holiday API call
    const response = await getHoliday({ start_date: startDate, end_date: endDate });
    const holidayMap = new Map(
      response.map((item: any) => [dayjs(item.mas_holidays_date).format("YYYY/MM/DD"), item.mas_holidays_detail])
    );

    const dates = [];
    let start = dayjs(startDate);
    const end = dayjs(endDate);

    while (start.isBefore(end) || start.isSame(end)) {
      const formattedDate = start.format("YYYY/MM/DD");
      const date = {
        key: `day_${start.date()}_${start.month() + 1}_${start.year()}`,
        date: formattedDate,
        day: start.date(),
        fullMonth: start.format("MMMM"),
        month: start.format("MMM"),
        fullYear: (start.year() + 543).toString(),
        weekday: start.format("ddd"),
        holiday: holidayMap.get(formattedDate) ?? null,
      };
      dates.push(date);

      start = start.add(1, "day");
    }

    return dates;
  } catch (e) {
    console.error("Error in generateDateObjects:", e);
    return [];
  }
}

export function transformDriverApiToTableData(rawData: any, dates: any[]): DriverTimelineTransformData[] {
  const createEmptyTimeline = () => {
    const timeline: Record<string, any[]> = {};
    for (let i = 1; i <= dates.length; i++) {
      timeline[dates[i - 1].key] = [];
    }
    return timeline;
  };

  const drivers: any[] = rawData ?? [];

  return drivers.map((driver) => {
    const timeline = createEmptyTimeline();
    let latestStatus = "";
    let carUserDetail: Record<string, string> = {};
    let driverDetail: Record<string, string> = {};

    driver.driver_trn_requests?.forEach((req: any) => {
      if (req.trip_details.length === 0) return;

      latestStatus = req.time_line_status;

      carUserDetail.userName = req.vehicle_user_emp_name || "นายไข่ สนาม";
      carUserDetail.userContactNumber = req.car_user_mobile_contact_number || "0912345678";
      carUserDetail.userContactInternalNumber = req.car_user_internal_contact_number || "1234";

      driverDetail.driverName = driver.driver_name;
      driverDetail.licensePlate = "";

      req.trip_details?.forEach((trip: any) => {
        const start = dayjs(trip.trip_start_datetime);
        const end = dayjs(trip.trip_end_datetime);
        const duration = Math.max(end.diff(start, "day") + 1, 1);

        for (let i = 0; i < duration; i++) {
          const currentDateKey = `${start.add(i, "day").date()}_${start.month() + 1}_${start.year()}`;
          if (!timeline[`day_${currentDateKey}`]) continue;

          timeline[`day_${currentDateKey}`].push({
            tripDetailId: trip.trn_trip_detail_uid,
            startDate: start,
            endDate: end,
            destinationPlace: trip.trip_destination_place,
            startTime: start.format("HH:mm"),
            endTime: end.format("HH:mm"),
            duration: duration.toString(),
            status: latestStatus,
            carUserDetail,
            driverDetail,
          });
        }
        // const start = dayjs(trip.trip_start_datetime);
        // const end = dayjs(trip.trip_end_datetime);
        // const dayStart = start.date();
        // const dayEnd = end.date();
        // const duration = Math.max(dayEnd - dayStart + 1, 1);
        // const destinationPlace = trip.trip_destination_place;

        // timeline[`day_${start.format("D_M_YYYY")}`]?.push({
        //   tripDetailId: trip.trn_trip_detail_uid,
        //   destinationPlace: destinationPlace,
        //   startTime: start.format("HH:mm"),
        //   duration: duration.toString(),
        //   status: status,
        //   carUserDetail: carUserDetail,
        //   driverDetail: driverDetail,
        // });
      });
    });

    const result = {
      driverContactNumber: driver.driver_mobile_contact_number,
      driverDeptSapShortNameWork: driver.driver_dept_sap_short_name_work,
      driverName: driver.driver_name,
      driverNickname: driver.driver_nickname,
      masDriverUid: driver.mas_driver_uid,
      workLastMonth: driver.work_last_month,
      workThisMonth: driver.work_this_month,
      timeline: timeline,
      status: latestStatus,
    };

    return result;
  });
}

export const DateLongTH = (date: Date) => {
  const thDate = dayjs(date).locale("th");
  const day = thDate.format("DD");
  const month = thDate.format("MM");
  const year = thDate.year() + 543;

  return `${day}/${month}/${year}`;
};
