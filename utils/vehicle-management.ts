import { VehicleTimelineTransformData } from "@/app/types/vehicle-management/vehicle-timeline-type";
import { getHoliday } from "@/services/vehicleService";
import dayjs from "dayjs";
import 'dayjs/locale/th';
import 'dayjs/locale/en-gb';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(utc);
dayjs.extend(timezone);

export const BASE_STATUS_COLORS = {
  green: { border: '#ABEFC6', bg: '#ECFDF3', text: '#067647' },
  orange: { border: '#FEDF89', bg: '#FFFAEB', text: '#B54708' },
  blue: { border: '#C7D7FE', bg: '#EEF4FF', text: '#3538CD' },
  red: { border: '#FED8F6', bg: '#FFF5FD', text: '#A80689' },
  gray: { border: 'gray-300', bg: 'gray-100', text: 'gray-700' },
} as const;

export const STATUS_COLOR_GROUPS: Record<keyof typeof BASE_STATUS_COLORS, string[]> = {
  green: ['ปกติ', 'เสร็จสิ้น'],
  orange: ['บำรุงรักษา', 'รออนุมัติ'],
  blue: ['ใช้ชั่วคราว', 'ระหว่างโอน', 'ค้างแรม'],
  red: ['ส่งซ่อม', 'ไป-กลับ'],
  gray: ['สิ้นสุดสัญญา'],
};

const buildStatusMap = <T>(
  colorGroups: Record<string, string[]>,
  colorValues: Record<string, T>,
  buildValue: (color: string, value: T) => any
) => Object.entries(colorGroups).reduce((acc, [color, statuses]) => {
  const value = colorValues[color];
  statuses.forEach(status => {
    acc[status] = buildValue(color, value);
  });
  return acc;
}, {} as Record<string, any>);

export const STATUS_CLASS_MAP: Record<string, string> = buildStatusMap(
  STATUS_COLOR_GROUPS,
  BASE_STATUS_COLORS,
  (color, colorSet) => `border-[${colorSet.border}] bg-[${colorSet.bg}] text-[${colorSet.text}]`
);

export const STATUS_DETAIL_MAP: Record<string, typeof BASE_STATUS_COLORS[keyof typeof BASE_STATUS_COLORS]> = buildStatusMap(
  STATUS_COLOR_GROUPS,
  BASE_STATUS_COLORS,
  (_, colorSet) => colorSet
);

export const imgPath = new Map<string, string>([
  ["รออนุมัติ", "/assets/img/vehicle/pending_approval.svg"],
  ["ไป - กลับ", "/assets/img/vehicle/completed.svg"],
  ["ค้างแรม", "/assets/img/vehicle/with_overnight_stay.svg"],
  ["เสร็จสิ้น", "/assets/img/vehicle/completed.svg"],
]);

const createEmptyTimeline = (dates: any[]) =>
  dates.reduce((timeline: Record<string, any[]>, date: any) => {
    timeline[date.key] = [];
    return timeline;
  }, {});

export function transformApiToTableData(rawData: any, dates: any[]): VehicleTimelineTransformData[] {
  const vehicles: any[] = rawData ?? [];

  return vehicles.map(vehicle => {
    const timeline = createEmptyTimeline(dates);
    let latestStatus = '';
    let carUserDetail: Record<string, string> = {};
    let driverDetail: Record<string, string> = {};

    vehicle.vehicle_trn_requests?.forEach((request: any) => {
      if (!request.trip_details?.length) return;

      latestStatus = request.time_line_status;
      carUserDetail = {
        userName: request.vehicle_user_emp_name ?? 'นายไข่ สนาม',
        userDeptShortName: request.vehicle_user_dept_name_short ?? 'ฝ่ายขนส่ง',
        userPosition: request.vehicle_user_position ?? 'พนักงานขับรถ',
        userContactNumber: request.car_user_mobile_contact_number ?? '0912345678',
        userContactInternalNumber: request.car_user_internal_contact_number ?? '1234',
      };

      driverDetail = {
        driverName: request.driver?.driver_name ?? '',
        licensePlate: vehicle.vehicle_license_plate ?? '',
        licensePlateProvinceShort: vehicle.vehicle_license_plate_province_short ?? '',
      };

      request.trip_details.forEach((trip: any) => {
        const start = dayjs.utc(trip.trip_start_datetime);
        const end = dayjs.utc(trip.trip_end_datetime);
        const duration = Math.max(end.diff(start, 'day') + 1, 1);

        for (let i = 0; i < duration; i++) {
          const currentDateKey = `day_${start.add(i, 'day').date()}_${start.month() + 1}_${start.year()}`;
          if (!timeline[currentDateKey]) continue;

          timeline[currentDateKey].push({
            tripDetailId: trip.trn_trip_detail_uid,
            startDate: start,
            endDate: end,
            workplace: request.work_place,
            destinationPlace: trip.trip_destination_place,
            startTime: start.format('HH:mm'),
            endTime: end.format('HH:mm'),
            duration: duration.toString(),
            status: latestStatus,
            carUserDetail,
            driverDetail,
          });
        }
      });
    });

    return {
      vehicleLicensePlate: vehicle.vehicle_license_plate,
      vehicleLicensePlateProvinceShort: vehicle.vehicle_license_plate_province_short,
      vehicleBrandModel: vehicle.vehicle_model_name,
      vehicleBrandName: vehicle.vehicle_brand_name,
      vehicleType: vehicle.vehicle_car_type_detail,
      vehicleDepartment: vehicle.vehicle_dept_name,
      vehicleCarpoolName: vehicle.vehicle_carpool_name,
      distance: vehicle.vehicle_mileage,
      vehicleStatus: latestStatus,
      timeline,
    };
  });
}

export async function generateDateObjects(startDate: string, endDate: string) {
  try {
    const response = await getHoliday({ start_date: startDate, end_date: endDate });
    const holidayMap = new Map(
      response.map((item: any) => [
        dayjs(item.mas_holidays_date).format("YYYY/MM/DD"),
        item.mas_holidays_detail,
      ])
    );

    const dates = [];
    let start = dayjs(startDate);
    const end = dayjs(endDate);

    while (start.isBefore(end) || start.isSame(end)) {
      const formattedDate = start.format("YYYY/MM/DD");
      dates.push({
        key: `day_${start.date()}_${start.month() + 1}_${start.year()}`,
        date: formattedDate,
        day: start.date(),
        fullMonth: start.format("MMMM"),
        month: start.locale('th').format("MMM"),
        fullYear: (start.year() + 543).toString(),
        weekday: start.format("ddd"),
        holiday: holidayMap.get(formattedDate) ?? null,
      });
      start = start.add(1, "day");
    }

    return dates;
  } catch (e) {
    console.error("Error in generateDateObjects:", e);
    return [];
  }
}

export const DateLongTH = (date: Date) => {
  const thDate = dayjs(date).locale('th');
  return `${thDate.format("DD")}/${thDate.format("MM")}/${thDate.year() + 543}`;
};

/**
 * แปลงวันที่ให้แสดงในรูปแบบภาษาไทย พร้อมแปลงปีเป็น พ.ศ.
 * @param date วันที่ที่ต้องการแปลง
 * @param format รูปแบบที่ต้องการ: DD/MM/YYYY
 * @param locale ภาษา (default คือ 'th')
 * @returns string ที่เป็นวันที่ในรูปแบบที่แปลงแล้ว
 */
export const convertDateToLongTH = (
  date: Date,
  format?: string,
  locale: string = "th"
): string => {
  const localizedDate = dayjs(date).tz("Asia/Bangkok").locale(locale);
  const buddhistYear = localizedDate.year() + 543;

  if (format === 'full') {
    return `${localizedDate.format("D MMMM")} ${buddhistYear}`;
  }
  if (format === 'DD/MM/YYYY') {
    return `${localizedDate.format("DD/MM/")}${buddhistYear}`;
  }
  return `${localizedDate.format("D MMM")} ${buddhistYear}`;
};
