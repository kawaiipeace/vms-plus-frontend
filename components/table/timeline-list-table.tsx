import React, { useEffect, useMemo, useState } from "react";
import {
  ColumnDef,
  createColumnHelper,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { DataTable } from "./time-table";
import { generateDateObjects, transformApiToTableData } from "@/utils/vehicle-management";
import { VehicleTimelineListTableData } from "@/app/types/vehicle-management/vehicle-timeline-type";
import { convertToBuddhistDateTime } from "@/utils/converToBuddhistDateTime";
import { useRouter } from "next/navigation";
import { scheduler } from "timers/promises";
import { RequestListType } from "@/app/types/request-list-type";
import dayjs from "dayjs";

export default function RequestListTable({ dataRequest, params }: { dataRequest: any[], params: any }) {
  const [isLoading, setIsLoading] = useState(true);
  const [dates, setDates] = useState<any[]>([]);
  const responseApi: any[] = [
    {
      "mas_vehicle_uid": "21d2ea5a-4ad6-4a95-a64d-73b72d43bd55",
      "trn_request_uid": "0b07440c-ab04-49d0-8730-d62ce0a9bab9",
      "request_no": "VZ68RA000002",
      "start_datetime": "2025-01-01T08:00:00Z",
      "end_datetime": "2025-01-01T10:00:00Z",
      "ref_request_status_code": "80",
      "ref_request_status_name": "เสร็จสิ้น",
      "vehicle_user_emp_id": "990001",
      "vehicle_user_emp_name": "ปัณณธร อ",
      "vehicle_user_dept_sap": "9121",
      "car_user_internal_contact_number": "",
      "car_user_mobile_contact_number": "",
      "is_pea_employee_driver": "0",
      "mas_carpool_driver_uid": "58c25e5b-fdd8-42c5-a6ac-06ca310508aa",
      "driver_emp_id": "700001",
      "driver_emp_name": "",
      "driver_emp_dept_sap": "",
      "driver_internal_contact_number": "",
      "driver_mobile_contact_number": "",
      "driver": {
        "mas_driver_uid": "58c25e5b-fdd8-42c5-a6ac-06ca310508aa",
        "driver_id": "DA000157",
        "driver_name": "นายเจษฎาพร สุขสวัสดิ์",
        "driver_image": "",
        "driver_nickname": ""
      },
      "trip_details": [
        {
          "trn_trip_detail_uid": "04c1d610-5edc-490b-a047-9d04d2778ea8",
          "trn_request_uid": "0b07440c-ab04-49d0-8730-d62ce0a9bab9",
          "trip_start_datetime": "2025-03-26T08:00:00Z",
          "trip_end_datetime": "2025-03-26T10:00:00Z",
          "trip_departure_place": "Changi Airport",
          "trip_destination_place": "Marina Bay Sands",
          "trip_start_miles": 5000,
          "trip_end_miles": 5050,
          "trip_detail": "Routine transport between airport and hotel.",
          "mas_vehicle_uid": "21d2ea5a-4ad6-4a95-a64d-73b72d43bd55",
          "vehicle_license_plate": "8กษ 8445",
          "vehicle_license_plate_province_short": "",
          "vehicle_license_plate_province_full": "กรุงเทพมหานคร",
          "mas_vehicle_department_uid": "00000000-0000-0000-0000-000000000000",
          "mas_carpool_uid": "389b0f63-4195-4ece-bf35-0011c2f5f28c",
          "employee_or_driver_id": "700001"
        },
        {
          "trn_trip_detail_uid": "2b7a3430-ac2f-4248-99c2-ac9d3c395562",
          "trn_request_uid": "0b07440c-ab04-49d0-8730-d62ce0a9bab9",
          "trip_start_datetime": "2025-03-26T08:00:00Z",
          "trip_end_datetime": "2025-03-26T10:00:00Z",
          "trip_departure_place": "Changi Airport",
          "trip_destination_place": "Marina Bay Sands",
          "trip_start_miles": 5000,
          "trip_end_miles": 5050,
          "trip_detail": "Routine transport between airport and hotel.",
          "mas_vehicle_uid": "21d2ea5a-4ad6-4a95-a64d-73b72d43bd55",
          "vehicle_license_plate": "8กษ 8445",
          "vehicle_license_plate_province_short": "",
          "vehicle_license_plate_province_full": "กรุงเทพมหานคร",
          "mas_vehicle_department_uid": "00000000-0000-0000-0000-000000000000",
          "mas_carpool_uid": "389b0f63-4195-4ece-bf35-0011c2f5f28c",
          "employee_or_driver_id": "700001"
        },
        {
          "trn_trip_detail_uid": "50cb2060-8a49-4339-a01a-5100a0fdea82",
          "trn_request_uid": "0b07440c-ab04-49d0-8730-d62ce0a9bab9",
          "trip_start_datetime": "2025-03-26T08:00:00Z",
          "trip_end_datetime": "2025-03-26T10:00:00Z",
          "trip_departure_place": "Changi Airport",
          "trip_destination_place": "Marina Bay Sands",
          "trip_start_miles": 5001,
          "trip_end_miles": 5050,
          "trip_detail": "Routine transport between airport and hotel.",
          "mas_vehicle_uid": "21d2ea5a-4ad6-4a95-a64d-73b72d43bd55",
          "vehicle_license_plate": "8กษ 8445",
          "vehicle_license_plate_province_short": "",
          "vehicle_license_plate_province_full": "กรุงเทพมหานคร",
          "mas_vehicle_department_uid": "00000000-0000-0000-0000-000000000000",
          "mas_carpool_uid": "389b0f63-4195-4ece-bf35-0011c2f5f28c",
          "employee_or_driver_id": "700001"
        },
        {
          "trn_trip_detail_uid": "60c4a354-6d99-453c-ace2-1332263dad43",
          "trn_request_uid": "0b07440c-ab04-49d0-8730-d62ce0a9bab9",
          "trip_start_datetime": "2025-03-26T08:00:00Z",
          "trip_end_datetime": "2025-03-26T10:00:00Z",
          "trip_departure_place": "Changi Airport",
          "trip_destination_place": "Marina Bay Sands",
          "trip_start_miles": 5000,
          "trip_end_miles": 5050,
          "trip_detail": "Routine transport between airport and hotel.",
          "mas_vehicle_uid": "21d2ea5a-4ad6-4a95-a64d-73b72d43bd55",
          "vehicle_license_plate": "8กษ 8445",
          "vehicle_license_plate_province_short": "",
          "vehicle_license_plate_province_full": "กรุงเทพมหานคร",
          "mas_vehicle_department_uid": "00000000-0000-0000-0000-000000000000",
          "mas_carpool_uid": "389b0f63-4195-4ece-bf35-0011c2f5f28c",
          "employee_or_driver_id": "700001"
        },
        {
          "trn_trip_detail_uid": "3b153f40-4a6e-4937-b991-19f3e0f2e597",
          "trn_request_uid": "0b07440c-ab04-49d0-8730-d62ce0a9bab9",
          "trip_start_datetime": "2025-03-26T08:00:00Z",
          "trip_end_datetime": "2025-03-26T10:00:00Z",
          "trip_departure_place": "Changi Airport",
          "trip_destination_place": "Marina Bay Sands",
          "trip_start_miles": 5000,
          "trip_end_miles": 5050,
          "trip_detail": "Routine transport between airport and hotel.",
          "mas_vehicle_uid": "21d2ea5a-4ad6-4a95-a64d-73b72d43bd55",
          "vehicle_license_plate": "8กษ 8445",
          "vehicle_license_plate_province_short": "",
          "vehicle_license_plate_province_full": "กรุงเทพมหานคร",
          "mas_vehicle_department_uid": "00000000-0000-0000-0000-000000000000",
          "mas_carpool_uid": "389b0f63-4195-4ece-bf35-0011c2f5f28c",
          "employee_or_driver_id": "700001"
        },
        {
          "trn_trip_detail_uid": "0eca7c37-4b3c-472f-8157-316420739638",
          "trn_request_uid": "0b07440c-ab04-49d0-8730-d62ce0a9bab9",
          "trip_start_datetime": "2025-03-26T08:00:00Z",
          "trip_end_datetime": "2025-03-26T10:00:00Z",
          "trip_departure_place": "Changi Airport",
          "trip_destination_place": "Marina Bay Sands",
          "trip_start_miles": 5000,
          "trip_end_miles": 5050,
          "trip_detail": "Routine transport between airport and hotel.",
          "mas_vehicle_uid": "21d2ea5a-4ad6-4a95-a64d-73b72d43bd55",
          "vehicle_license_plate": "8กษ 8445",
          "vehicle_license_plate_province_short": "",
          "vehicle_license_plate_province_full": "กรุงเทพมหานคร",
          "mas_vehicle_department_uid": "00000000-0000-0000-0000-000000000000",
          "mas_carpool_uid": "389b0f63-4195-4ece-bf35-0011c2f5f28c",
          "employee_or_driver_id": "700001"
        }
      ]
    },
    {
      "mas_vehicle_uid": "21d2ea5a-4ad6-4a95-a64d-73b72d43bd55",
      "trn_request_uid": "0b07440c-ab04-49d0-8730-d62ce0a9bab9",
      "request_no": "VZ68RA000002",
      "start_datetime": "2025-01-01T08:00:00Z",
      "end_datetime": "2025-01-01T10:00:00Z",
      "ref_request_status_code": "80",
      "ref_request_status_name": "เสร็จสิ้น",
      "vehicle_user_emp_id": "990001",
      "vehicle_user_emp_name": "ปัณณธร อ",
      "vehicle_user_dept_sap": "9121",
      "car_user_internal_contact_number": "",
      "car_user_mobile_contact_number": "",
      "is_pea_employee_driver": "0",
      "mas_carpool_driver_uid": "58c25e5b-fdd8-42c5-a6ac-06ca310508aa",
      "driver_emp_id": "700001",
      "driver_emp_name": "",
      "driver_emp_dept_sap": "",
      "driver_internal_contact_number": "",
      "driver_mobile_contact_number": "",
      "driver": {
        "mas_driver_uid": "58c25e5b-fdd8-42c5-a6ac-06ca310508aa",
        "driver_id": "DA000157",
        "driver_name": "นายเจษฎาพร สุขสวัสดิ์",
        "driver_image": "",
        "driver_nickname": ""
      },
      "trip_details": [
        {
          "trn_trip_detail_uid": "04c1d610-5edc-490b-a047-9d04d2778ea8",
          "trn_request_uid": "0b07440c-ab04-49d0-8730-d62ce0a9bab9",
          "trip_start_datetime": "2025-03-26T08:00:00Z",
          "trip_end_datetime": "2025-03-26T10:00:00Z",
          "trip_departure_place": "Changi Airport",
          "trip_destination_place": "Marina Bay Sands",
          "trip_start_miles": 5000,
          "trip_end_miles": 5050,
          "trip_detail": "Routine transport between airport and hotel.",
          "mas_vehicle_uid": "21d2ea5a-4ad6-4a95-a64d-73b72d43bd55",
          "vehicle_license_plate": "8กษ 8445",
          "vehicle_license_plate_province_short": "",
          "vehicle_license_plate_province_full": "กรุงเทพมหานคร",
          "mas_vehicle_department_uid": "00000000-0000-0000-0000-000000000000",
          "mas_carpool_uid": "389b0f63-4195-4ece-bf35-0011c2f5f28c",
          "employee_or_driver_id": "700001"
        },
        {
          "trn_trip_detail_uid": "2b7a3430-ac2f-4248-99c2-ac9d3c395562",
          "trn_request_uid": "0b07440c-ab04-49d0-8730-d62ce0a9bab9",
          "trip_start_datetime": "2025-03-26T08:00:00Z",
          "trip_end_datetime": "2025-03-26T10:00:00Z",
          "trip_departure_place": "Changi Airport",
          "trip_destination_place": "Marina Bay Sands",
          "trip_start_miles": 5000,
          "trip_end_miles": 5050,
          "trip_detail": "Routine transport between airport and hotel.",
          "mas_vehicle_uid": "21d2ea5a-4ad6-4a95-a64d-73b72d43bd55",
          "vehicle_license_plate": "8กษ 8445",
          "vehicle_license_plate_province_short": "",
          "vehicle_license_plate_province_full": "กรุงเทพมหานคร",
          "mas_vehicle_department_uid": "00000000-0000-0000-0000-000000000000",
          "mas_carpool_uid": "389b0f63-4195-4ece-bf35-0011c2f5f28c",
          "employee_or_driver_id": "700001"
        },
        {
          "trn_trip_detail_uid": "50cb2060-8a49-4339-a01a-5100a0fdea82",
          "trn_request_uid": "0b07440c-ab04-49d0-8730-d62ce0a9bab9",
          "trip_start_datetime": "2025-03-26T08:00:00Z",
          "trip_end_datetime": "2025-03-26T10:00:00Z",
          "trip_departure_place": "Changi Airport",
          "trip_destination_place": "Marina Bay Sands",
          "trip_start_miles": 5001,
          "trip_end_miles": 5050,
          "trip_detail": "Routine transport between airport and hotel.",
          "mas_vehicle_uid": "21d2ea5a-4ad6-4a95-a64d-73b72d43bd55",
          "vehicle_license_plate": "8กษ 8445",
          "vehicle_license_plate_province_short": "",
          "vehicle_license_plate_province_full": "กรุงเทพมหานคร",
          "mas_vehicle_department_uid": "00000000-0000-0000-0000-000000000000",
          "mas_carpool_uid": "389b0f63-4195-4ece-bf35-0011c2f5f28c",
          "employee_or_driver_id": "700001"
        },
        {
          "trn_trip_detail_uid": "60c4a354-6d99-453c-ace2-1332263dad43",
          "trn_request_uid": "0b07440c-ab04-49d0-8730-d62ce0a9bab9",
          "trip_start_datetime": "2025-03-26T08:00:00Z",
          "trip_end_datetime": "2025-03-26T10:00:00Z",
          "trip_departure_place": "Changi Airport",
          "trip_destination_place": "Marina Bay Sands",
          "trip_start_miles": 5000,
          "trip_end_miles": 5050,
          "trip_detail": "Routine transport between airport and hotel.",
          "mas_vehicle_uid": "21d2ea5a-4ad6-4a95-a64d-73b72d43bd55",
          "vehicle_license_plate": "8กษ 8445",
          "vehicle_license_plate_province_short": "",
          "vehicle_license_plate_province_full": "กรุงเทพมหานคร",
          "mas_vehicle_department_uid": "00000000-0000-0000-0000-000000000000",
          "mas_carpool_uid": "389b0f63-4195-4ece-bf35-0011c2f5f28c",
          "employee_or_driver_id": "700001"
        },
        {
          "trn_trip_detail_uid": "3b153f40-4a6e-4937-b991-19f3e0f2e597",
          "trn_request_uid": "0b07440c-ab04-49d0-8730-d62ce0a9bab9",
          "trip_start_datetime": "2025-03-26T08:00:00Z",
          "trip_end_datetime": "2025-03-26T10:00:00Z",
          "trip_departure_place": "Changi Airport",
          "trip_destination_place": "Marina Bay Sands",
          "trip_start_miles": 5000,
          "trip_end_miles": 5050,
          "trip_detail": "Routine transport between airport and hotel.",
          "mas_vehicle_uid": "21d2ea5a-4ad6-4a95-a64d-73b72d43bd55",
          "vehicle_license_plate": "8กษ 8445",
          "vehicle_license_plate_province_short": "",
          "vehicle_license_plate_province_full": "กรุงเทพมหานคร",
          "mas_vehicle_department_uid": "00000000-0000-0000-0000-000000000000",
          "mas_carpool_uid": "389b0f63-4195-4ece-bf35-0011c2f5f28c",
          "employee_or_driver_id": "700001"
        },
        {
          "trn_trip_detail_uid": "0eca7c37-4b3c-472f-8157-316420739638",
          "trn_request_uid": "0b07440c-ab04-49d0-8730-d62ce0a9bab9",
          "trip_start_datetime": "2025-03-26T08:00:00Z",
          "trip_end_datetime": "2025-03-26T10:00:00Z",
          "trip_departure_place": "Changi Airport",
          "trip_destination_place": "Marina Bay Sands",
          "trip_start_miles": 5000,
          "trip_end_miles": 5050,
          "trip_detail": "Routine transport between airport and hotel.",
          "mas_vehicle_uid": "21d2ea5a-4ad6-4a95-a64d-73b72d43bd55",
          "vehicle_license_plate": "8กษ 8445",
          "vehicle_license_plate_province_short": "",
          "vehicle_license_plate_province_full": "กรุงเทพมหานคร",
          "mas_vehicle_department_uid": "00000000-0000-0000-0000-000000000000",
          "mas_carpool_uid": "389b0f63-4195-4ece-bf35-0011c2f5f28c",
          "employee_or_driver_id": "700001"
        }
      ]
    }
  ];

  useEffect(()=>{
    const generateDates = async () => {
      const date = await generateDateObjects(params.start_date, params.end_date);
      console.log("date >>>> ", date);
      setDates(date);
    }

    generateDates();
  }, [params]);
  
  const dataTransform = useMemo(() => transformApiToTableData(dataRequest, dates), [dataRequest]);
  const columnHelper = createColumnHelper<VehicleTimelineListTableData>();

  const columns = useMemo(() => [
    columnHelper.accessor(row => ({
      license: row.vehicleLicensePlate,
      brandModel: row.vehicleBrandModel,
    }), {
      id: 'licensePlate',
      header: 'เลขทะเบียน / ยี่ห้อ / รุ่น',
      cell: info => (
        <div className="flex flex-col">
          <span className="text-base font-semibold">{info.getValue().license}</span>
          <span className="text-base">{info.getValue().brandModel}</span>
        </div>
      ),
      enableSorting: true,
      meta: {
        className: '!align-top sticky left-0 z-10 min-w-[180px] max-w-[180px]',
      },
    }),
    columnHelper.accessor('vehicleType', {
      header: 'ประเภทยานพาหนะ',
      cell: info => (
        <div className="flex flex-col">
          <span className="text-base">{info.getValue()}</span>
        </div>
      ),
      enableSorting: true,
      meta: {
        className: '!align-top sticky left-[180px] z-10 bg-white min-w-[155px] max-w-[155px]',
      },
    }),
    columnHelper.accessor('vehicleDepartment', {
      header: 'สังกัดยานพาหนะ',
      cell: info => (
        <div className="flex flex-col">
          <span className="text-base">{info.getValue()}</span>
        </div>
      ),
      enableSorting: true,
      meta: {
        className: '!align-top sticky left-[335px] z-10 bg-white min-w-[170px] max-w-[170px]',
      },
    }),
    columnHelper.accessor('distance', {
      header: 'ระยะทาง',
      cell: info => (
        <div className="flex flex-col">
          <span className="text-base">{info.getValue()}</span>
        </div>
      ),
      enableSorting: true,
      meta: {
        className: '!align-top sticky left-[505px] z-10 bg-white min-w-[130px] max-w-[130px] fixed-column-line',
      },
    }),
    ...dates.map(({ key, date, day, month }) =>
      columnHelper.accessor(
        row => row.timeLine?.[`day_${day}`] ?? [],
        {
          id: key,
          header: () => {
              const className = dayjs().format('YYYY-MM-DD') === date.toString() ? 'text-white bg-brand-900 rounded-full p-1' : '';
            return (
              <div className={`w-20 flex flex-col items-center text-xs`}>
                <span className={`font-semibold ${className}`}>{day}</span>
                <span className="font-normal">{month}</span>
              </div>
            );
          },
          cell: ({ row }) => (
            <div
              className="text-left min-h-[140px] gap-1 flex flex-col px-1"
              data-name="ผู้ใช้ยานพาหนะ"
            >
              <div className="badge badge-info badge-outline !h-auto !rounded-lg justify-start !cursor-pointer w-[calc((100%*3)+(8px*2)+(1px*2))]">
                <div className="rounded-[4px] bg-[var(--color-surface-primary)] h-full flex flex-col justify-center py-[2px]">
                  <i className="material-symbols-outlined !text-base !leading-4">directions_car</i>
                  <i className="material-symbols-outlined !text-base !leading-4">person</i>
                </div> 
                <div className="overflow-hidden">
                  <div className="text-xs font-semibold leading-[18px] truncate">
                    การไฟฟ้าเขต น.1 และ กฟฟ. ในสังกัด
                  </div>
                  <div className="text-xs font-normal leading-[18px] text-default">07:00</div>
                </div>
              </div>

              <div className="badge badge-warning badge-outline !h-auto !rounded-lg justify-start !cursor-pointer w-[calc((100%*1)+(8px*0)+(1px*1))]">
                <div className="rounded-[4px] bg-[var(--color-surface-primary)] h-full flex flex-col justify-center py-[2px]">
                  <i className="material-symbols-outlined !text-base">directions_car</i>
                </div>
                <div className="overflow-hidden">
                  <div className="text-xs font-semibold leading-[18px] truncate">โรงแรมมิราเคิล แกรนด์</div>
                  <div className="text-xs font-normal leading-[18px] text-default">18:00</div>
                </div>
              </div>

              <div className="badge badge-gray badge-outline !h-auto !rounded-lg justify-start !cursor-pointer w-[calc((100%*1)+(8px*0))]">
                <div className="leading-[18px]">+1 เพิ่มเติม</div>
              </div>
            </div>
          ),
          meta: {
            className: 'day min-w-[148px] max-w-[148px] !border-t-0 today',
          }
        }))
  ], [columnHelper, dates]);

  const table = useReactTable({
    data: dataTransform,
    columns,
    getCoreRowModel: getCoreRowModel(),
    defaultColumn: {
      enableSorting: false,
    },
  });

  useEffect(() => {
    setIsLoading(false);
  }, []);

  return (
    <div className="w-full py-4 pt-0 dataTable-bookingtimeline">
      {!isLoading && <DataTable table={table} />}
    </div>
  );
}