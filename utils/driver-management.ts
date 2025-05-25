import { getHoliday } from "@/services/vehicleService";
import dayjs from "dayjs";

export const convertToISO8601 = (thaiDate: string): string => {
  const [year, month, day] = thaiDate.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  return date.toISOString().split(".")[0] + "Z";

  // const [day, month, buddhistYear] = thaiDate.split("/").map(Number);
  // const gregorianYear = buddhistYear - 543; // แปลงปีพุทธศักราชเป็นคริสต์ศักราช
  // const isoDate = new Date(Date.UTC(gregorianYear, month - 1, day)).toISOString();
  // return isoDate.split(".")[0] + "Z";
};

export const convertToThaiDate = (isoDate?: string): string | undefined => {
  if (!isoDate) return;
  const date = new Date(isoDate);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0"); // เดือนเริ่มจาก 0
  const buddhistYear = date.getFullYear() + 543; // แปลงปีคริสต์ศักราชเป็นพุทธศักราช
  return `${day}/${month}/${buddhistYear}`;
};

export function transformApiToTableData(rawData: any, dates: any[]): any[] {
  const createEmptyTimeline = () => {
    const timeline: Record<string, any[]> = {};
    for (let i = 1; i <= dates.length; i++) {
      timeline[`day_${i}`] = [];
    }
    return timeline;
  };

  const drivers: any[] = rawData ?? [];
  return drivers.map((driver) => {
    const timeline = createEmptyTimeline();

    driver.driver_trn_requests?.forEach((req: any) => {
      if (req.trip_details.length === 0) return;

      req.trip_details?.forEach((trip: any) => {
        const start = dayjs(trip.trip_start_datetime);
        const end = dayjs(trip.trip_end_datetime);
        const dayStart = start.date();
        const dayEnd = end.date();
        const duration = Math.max(dayEnd - dayStart + 1, 1);
        const destinationPlace = trip.trip_destination_place;

        timeline[`day_${dayStart}`]?.push({
          schedule_title: destinationPlace,
          schedule_time: start.format("HH:mm"),
          schedule_range: duration.toString(),
          schedule_status_code: req.ref_request_status_code,
          schedule_status_name: req.ref_request_status_name,
          modal: {
            statusModal: req.ref_request_status_name,
            carPlate: trip.vehicle_license_plate + " " + trip.vehicle_license_plate_province_short + ".",
            driverName: driver.driver_name + "(" + driver.driver_nickname + ")",
            destinationPlace: trip.trip_destination_place,
            startDate: start.format("DD/MM/YYYY"),
            vehicleName: req.vehicle_user_emp_name,
            vehicleDept: req.vehicle_user_dept_sap,
            carContactNumber: req.car_user_internal_contact_number,
            carContactNumberMobile: req.car_user_mobile_contact_number,
          },
        });
      });
    });

    const result = {
      vehicleLicensePlate: driver.driver_name,
      vehicleBrandModel: driver.driver_dept_sap_short_name_work,
      vehicleBrandName: driver.driver_name,
      vehicleType: driver.work_last_month,
      vehicleDepartment: driver.work_this_month,
      distance: driver.driver_name,
      timeLine: timeline,
    };

    return result;
  });
}

export async function generateDateObjects(startDate: string, endDate: string) {
  try {
    const response = await getHoliday({
      start_date: startDate,
      end_date: endDate,
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
        holiday: typeof holidayMap.get(formattedDate) === "string" ? (holidayMap.get(formattedDate) as string) : null,
      });
      current = current.add(1, "day");
    }

    return dates;
  } catch (e) {
    console.error("Error in generateDateObjects:", e);
    return [];
  }
}
