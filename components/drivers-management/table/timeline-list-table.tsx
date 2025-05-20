import React, { useEffect, useMemo, useState } from "react";
import { ColumnDef, createColumnHelper, getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { DataTable } from "@/components/table/time-table";
import { generateDateObjects, transformApiToTableData } from "@/utils/driver-management";
import { VehicleTimelineListTableData } from "@/app/types/vehicle-management/vehicle-timeline-type";
import { convertToBuddhistDateTime } from "@/utils/converToBuddhistDateTime";
import { useRouter } from "next/navigation";
import { scheduler } from "timers/promises";
import { RequestListType } from "@/app/types/request-list-type";
import dayjs from "dayjs";

export default function RequestListTable({
  dataRequest,
  params,
  selectedOption,
  lastMonth,
  onClickDetail,
}: {
  dataRequest: any[];
  params: any;
  selectedOption: string;
  lastMonth: string;
  onClickDetail: (data: any) => void;
}) {
  const [isLoading, setIsLoading] = useState(true);
  const [dates, setDates] = useState<any[]>([]);
  // const prevMonth = dayjs(params.start_date).subtract(1, "month");
  // const thaiMonthsShort = ["ม.ค", "ก.พ", "มี.ค", "เม.ษ", "พ.ค", "มิ.ย", "ก.ค", "ส.ค", "ก.ย", "ต.ค", "พ.ย", "ธ.ค"];
  // const prevMonthText = `${thaiMonthsShort[prevMonth.month()]} ${(prevMonth.year() + 543).toString().slice(-2)}`;

  const responseApi: any[] = [
    {
      mas_vehicle_uid: "21d2ea5a-4ad6-4a95-a64d-73b72d43bd55",
      trn_request_uid: "0b07440c-ab04-49d0-8730-d62ce0a9bab9",
      request_no: "VZ68RA000002",
      start_datetime: "2025-01-01T08:00:00Z",
      end_datetime: "2025-01-01T10:00:00Z",
      ref_request_status_code: "80",
      ref_request_status_name: "เสร็จสิ้น",
      vehicle_user_emp_id: "990001",
      vehicle_user_emp_name: "ปัณณธร อ",
      vehicle_user_dept_sap: "9121",
      car_user_internal_contact_number: "",
      car_user_mobile_contact_number: "",
      is_pea_employee_driver: "0",
      mas_carpool_driver_uid: "58c25e5b-fdd8-42c5-a6ac-06ca310508aa",
      driver_emp_id: "700001",
      driver_emp_name: "",
      driver_emp_dept_sap: "",
      driver_internal_contact_number: "",
      driver_mobile_contact_number: "",
      driver: {
        mas_driver_uid: "58c25e5b-fdd8-42c5-a6ac-06ca310508aa",
        driver_id: "DA000157",
        driver_name: "นายเจษฎาพร สุขสวัสดิ์",
        driver_image: "",
        driver_nickname: "",
      },
      trip_details: [
        {
          trn_trip_detail_uid: "04c1d610-5edc-490b-a047-9d04d2778ea8",
          trn_request_uid: "0b07440c-ab04-49d0-8730-d62ce0a9bab9",
          trip_start_datetime: "2025-03-26T08:00:00Z",
          trip_end_datetime: "2025-03-26T10:00:00Z",
          trip_departure_place: "Changi Airport",
          trip_destination_place: "Marina Bay Sands",
          trip_start_miles: 5000,
          trip_end_miles: 5050,
          trip_detail: "Routine transport between airport and hotel.",
          mas_vehicle_uid: "21d2ea5a-4ad6-4a95-a64d-73b72d43bd55",
          vehicle_license_plate: "8กษ 8445",
          vehicle_license_plate_province_short: "",
          vehicle_license_plate_province_full: "กรุงเทพมหานคร",
          mas_vehicle_department_uid: "00000000-0000-0000-0000-000000000000",
          mas_carpool_uid: "389b0f63-4195-4ece-bf35-0011c2f5f28c",
          employee_or_driver_id: "700001",
        },
        {
          trn_trip_detail_uid: "2b7a3430-ac2f-4248-99c2-ac9d3c395562",
          trn_request_uid: "0b07440c-ab04-49d0-8730-d62ce0a9bab9",
          trip_start_datetime: "2025-03-26T08:00:00Z",
          trip_end_datetime: "2025-03-26T10:00:00Z",
          trip_departure_place: "Changi Airport",
          trip_destination_place: "Marina Bay Sands",
          trip_start_miles: 5000,
          trip_end_miles: 5050,
          trip_detail: "Routine transport between airport and hotel.",
          mas_vehicle_uid: "21d2ea5a-4ad6-4a95-a64d-73b72d43bd55",
          vehicle_license_plate: "8กษ 8445",
          vehicle_license_plate_province_short: "",
          vehicle_license_plate_province_full: "กรุงเทพมหานคร",
          mas_vehicle_department_uid: "00000000-0000-0000-0000-000000000000",
          mas_carpool_uid: "389b0f63-4195-4ece-bf35-0011c2f5f28c",
          employee_or_driver_id: "700001",
        },
        {
          trn_trip_detail_uid: "50cb2060-8a49-4339-a01a-5100a0fdea82",
          trn_request_uid: "0b07440c-ab04-49d0-8730-d62ce0a9bab9",
          trip_start_datetime: "2025-03-26T08:00:00Z",
          trip_end_datetime: "2025-03-26T10:00:00Z",
          trip_departure_place: "Changi Airport",
          trip_destination_place: "Marina Bay Sands",
          trip_start_miles: 5001,
          trip_end_miles: 5050,
          trip_detail: "Routine transport between airport and hotel.",
          mas_vehicle_uid: "21d2ea5a-4ad6-4a95-a64d-73b72d43bd55",
          vehicle_license_plate: "8กษ 8445",
          vehicle_license_plate_province_short: "",
          vehicle_license_plate_province_full: "กรุงเทพมหานคร",
          mas_vehicle_department_uid: "00000000-0000-0000-0000-000000000000",
          mas_carpool_uid: "389b0f63-4195-4ece-bf35-0011c2f5f28c",
          employee_or_driver_id: "700001",
        },
        {
          trn_trip_detail_uid: "60c4a354-6d99-453c-ace2-1332263dad43",
          trn_request_uid: "0b07440c-ab04-49d0-8730-d62ce0a9bab9",
          trip_start_datetime: "2025-03-26T08:00:00Z",
          trip_end_datetime: "2025-03-26T10:00:00Z",
          trip_departure_place: "Changi Airport",
          trip_destination_place: "Marina Bay Sands",
          trip_start_miles: 5000,
          trip_end_miles: 5050,
          trip_detail: "Routine transport between airport and hotel.",
          mas_vehicle_uid: "21d2ea5a-4ad6-4a95-a64d-73b72d43bd55",
          vehicle_license_plate: "8กษ 8445",
          vehicle_license_plate_province_short: "",
          vehicle_license_plate_province_full: "กรุงเทพมหานคร",
          mas_vehicle_department_uid: "00000000-0000-0000-0000-000000000000",
          mas_carpool_uid: "389b0f63-4195-4ece-bf35-0011c2f5f28c",
          employee_or_driver_id: "700001",
        },
        {
          trn_trip_detail_uid: "3b153f40-4a6e-4937-b991-19f3e0f2e597",
          trn_request_uid: "0b07440c-ab04-49d0-8730-d62ce0a9bab9",
          trip_start_datetime: "2025-03-26T08:00:00Z",
          trip_end_datetime: "2025-03-26T10:00:00Z",
          trip_departure_place: "Changi Airport",
          trip_destination_place: "Marina Bay Sands",
          trip_start_miles: 5000,
          trip_end_miles: 5050,
          trip_detail: "Routine transport between airport and hotel.",
          mas_vehicle_uid: "21d2ea5a-4ad6-4a95-a64d-73b72d43bd55",
          vehicle_license_plate: "8กษ 8445",
          vehicle_license_plate_province_short: "",
          vehicle_license_plate_province_full: "กรุงเทพมหานคร",
          mas_vehicle_department_uid: "00000000-0000-0000-0000-000000000000",
          mas_carpool_uid: "389b0f63-4195-4ece-bf35-0011c2f5f28c",
          employee_or_driver_id: "700001",
        },
        {
          trn_trip_detail_uid: "0eca7c37-4b3c-472f-8157-316420739638",
          trn_request_uid: "0b07440c-ab04-49d0-8730-d62ce0a9bab9",
          trip_start_datetime: "2025-03-26T08:00:00Z",
          trip_end_datetime: "2025-03-26T10:00:00Z",
          trip_departure_place: "Changi Airport",
          trip_destination_place: "Marina Bay Sands",
          trip_start_miles: 5000,
          trip_end_miles: 5050,
          trip_detail: "Routine transport between airport and hotel.",
          mas_vehicle_uid: "21d2ea5a-4ad6-4a95-a64d-73b72d43bd55",
          vehicle_license_plate: "8กษ 8445",
          vehicle_license_plate_province_short: "",
          vehicle_license_plate_province_full: "กรุงเทพมหานคร",
          mas_vehicle_department_uid: "00000000-0000-0000-0000-000000000000",
          mas_carpool_uid: "389b0f63-4195-4ece-bf35-0011c2f5f28c",
          employee_or_driver_id: "700001",
        },
      ],
    },
    {
      mas_vehicle_uid: "21d2ea5a-4ad6-4a95-a64d-73b72d43bd55",
      trn_request_uid: "0b07440c-ab04-49d0-8730-d62ce0a9bab9",
      request_no: "VZ68RA000002",
      start_datetime: "2025-01-01T08:00:00Z",
      end_datetime: "2025-01-01T10:00:00Z",
      ref_request_status_code: "80",
      ref_request_status_name: "เสร็จสิ้น",
      vehicle_user_emp_id: "990001",
      vehicle_user_emp_name: "ปัณณธร อ",
      vehicle_user_dept_sap: "9121",
      car_user_internal_contact_number: "",
      car_user_mobile_contact_number: "",
      is_pea_employee_driver: "0",
      mas_carpool_driver_uid: "58c25e5b-fdd8-42c5-a6ac-06ca310508aa",
      driver_emp_id: "700001",
      driver_emp_name: "",
      driver_emp_dept_sap: "",
      driver_internal_contact_number: "",
      driver_mobile_contact_number: "",
      driver: {
        mas_driver_uid: "58c25e5b-fdd8-42c5-a6ac-06ca310508aa",
        driver_id: "DA000157",
        driver_name: "นายเจษฎาพร สุขสวัสดิ์",
        driver_image: "",
        driver_nickname: "",
      },
      trip_details: [
        {
          trn_trip_detail_uid: "04c1d610-5edc-490b-a047-9d04d2778ea8",
          trn_request_uid: "0b07440c-ab04-49d0-8730-d62ce0a9bab9",
          trip_start_datetime: "2025-03-26T08:00:00Z",
          trip_end_datetime: "2025-03-26T10:00:00Z",
          trip_departure_place: "Changi Airport",
          trip_destination_place: "Marina Bay Sands",
          trip_start_miles: 5000,
          trip_end_miles: 5050,
          trip_detail: "Routine transport between airport and hotel.",
          mas_vehicle_uid: "21d2ea5a-4ad6-4a95-a64d-73b72d43bd55",
          vehicle_license_plate: "8กษ 8445",
          vehicle_license_plate_province_short: "",
          vehicle_license_plate_province_full: "กรุงเทพมหานคร",
          mas_vehicle_department_uid: "00000000-0000-0000-0000-000000000000",
          mas_carpool_uid: "389b0f63-4195-4ece-bf35-0011c2f5f28c",
          employee_or_driver_id: "700001",
        },
        {
          trn_trip_detail_uid: "2b7a3430-ac2f-4248-99c2-ac9d3c395562",
          trn_request_uid: "0b07440c-ab04-49d0-8730-d62ce0a9bab9",
          trip_start_datetime: "2025-03-26T08:00:00Z",
          trip_end_datetime: "2025-03-26T10:00:00Z",
          trip_departure_place: "Changi Airport",
          trip_destination_place: "Marina Bay Sands",
          trip_start_miles: 5000,
          trip_end_miles: 5050,
          trip_detail: "Routine transport between airport and hotel.",
          mas_vehicle_uid: "21d2ea5a-4ad6-4a95-a64d-73b72d43bd55",
          vehicle_license_plate: "8กษ 8445",
          vehicle_license_plate_province_short: "",
          vehicle_license_plate_province_full: "กรุงเทพมหานคร",
          mas_vehicle_department_uid: "00000000-0000-0000-0000-000000000000",
          mas_carpool_uid: "389b0f63-4195-4ece-bf35-0011c2f5f28c",
          employee_or_driver_id: "700001",
        },
        {
          trn_trip_detail_uid: "50cb2060-8a49-4339-a01a-5100a0fdea82",
          trn_request_uid: "0b07440c-ab04-49d0-8730-d62ce0a9bab9",
          trip_start_datetime: "2025-03-26T08:00:00Z",
          trip_end_datetime: "2025-03-26T10:00:00Z",
          trip_departure_place: "Changi Airport",
          trip_destination_place: "Marina Bay Sands",
          trip_start_miles: 5001,
          trip_end_miles: 5050,
          trip_detail: "Routine transport between airport and hotel.",
          mas_vehicle_uid: "21d2ea5a-4ad6-4a95-a64d-73b72d43bd55",
          vehicle_license_plate: "8กษ 8445",
          vehicle_license_plate_province_short: "",
          vehicle_license_plate_province_full: "กรุงเทพมหานคร",
          mas_vehicle_department_uid: "00000000-0000-0000-0000-000000000000",
          mas_carpool_uid: "389b0f63-4195-4ece-bf35-0011c2f5f28c",
          employee_or_driver_id: "700001",
        },
        {
          trn_trip_detail_uid: "60c4a354-6d99-453c-ace2-1332263dad43",
          trn_request_uid: "0b07440c-ab04-49d0-8730-d62ce0a9bab9",
          trip_start_datetime: "2025-03-26T08:00:00Z",
          trip_end_datetime: "2025-03-26T10:00:00Z",
          trip_departure_place: "Changi Airport",
          trip_destination_place: "Marina Bay Sands",
          trip_start_miles: 5000,
          trip_end_miles: 5050,
          trip_detail: "Routine transport between airport and hotel.",
          mas_vehicle_uid: "21d2ea5a-4ad6-4a95-a64d-73b72d43bd55",
          vehicle_license_plate: "8กษ 8445",
          vehicle_license_plate_province_short: "",
          vehicle_license_plate_province_full: "กรุงเทพมหานคร",
          mas_vehicle_department_uid: "00000000-0000-0000-0000-000000000000",
          mas_carpool_uid: "389b0f63-4195-4ece-bf35-0011c2f5f28c",
          employee_or_driver_id: "700001",
        },
        {
          trn_trip_detail_uid: "3b153f40-4a6e-4937-b991-19f3e0f2e597",
          trn_request_uid: "0b07440c-ab04-49d0-8730-d62ce0a9bab9",
          trip_start_datetime: "2025-03-26T08:00:00Z",
          trip_end_datetime: "2025-03-26T10:00:00Z",
          trip_departure_place: "Changi Airport",
          trip_destination_place: "Marina Bay Sands",
          trip_start_miles: 5000,
          trip_end_miles: 5050,
          trip_detail: "Routine transport between airport and hotel.",
          mas_vehicle_uid: "21d2ea5a-4ad6-4a95-a64d-73b72d43bd55",
          vehicle_license_plate: "8กษ 8445",
          vehicle_license_plate_province_short: "",
          vehicle_license_plate_province_full: "กรุงเทพมหานคร",
          mas_vehicle_department_uid: "00000000-0000-0000-0000-000000000000",
          mas_carpool_uid: "389b0f63-4195-4ece-bf35-0011c2f5f28c",
          employee_or_driver_id: "700001",
        },
        {
          trn_trip_detail_uid: "0eca7c37-4b3c-472f-8157-316420739638",
          trn_request_uid: "0b07440c-ab04-49d0-8730-d62ce0a9bab9",
          trip_start_datetime: "2025-03-26T08:00:00Z",
          trip_end_datetime: "2025-03-26T10:00:00Z",
          trip_departure_place: "Changi Airport",
          trip_destination_place: "Marina Bay Sands",
          trip_start_miles: 5000,
          trip_end_miles: 5050,
          trip_detail: "Routine transport between airport and hotel.",
          mas_vehicle_uid: "21d2ea5a-4ad6-4a95-a64d-73b72d43bd55",
          vehicle_license_plate: "8กษ 8445",
          vehicle_license_plate_province_short: "",
          vehicle_license_plate_province_full: "กรุงเทพมหานคร",
          mas_vehicle_department_uid: "00000000-0000-0000-0000-000000000000",
          mas_carpool_uid: "389b0f63-4195-4ece-bf35-0011c2f5f28c",
          employee_or_driver_id: "700001",
        },
      ],
    },
  ];

  // Define a type for driver_trn_requests and responseApi2
  type DriverTrnRequest = {
    trn_request_uid: string;
    mas_carpool_driver_uid: string;
    request_no: string;
    start_datetime: string;
    end_datetime: string;
    ref_request_status_code: string;
    ref_request_status_name: string;
    ref_trip_type_code: number;
    vehicle_user_emp_id: string;
    vehicle_user_emp_name: string;
    vehicle_user_dept_sap: string;
    car_user_internal_contact_number: string;
    car_user_mobile_contact_number: string;
    trip_details: Array<{
      trn_trip_detail_uid: string;
      trn_request_uid: string;
      trip_start_datetime: string;
      trip_end_datetime: string;
      trip_departure_place: string;
      trip_destination_place: string;
      trip_start_miles: number;
      trip_end_miles: number;
      trip_detail: string;
      mas_vehicle_uid: string;
      vehicle_license_plate: string;
      vehicle_license_plate_province_short: string;
      vehicle_license_plate_province_full: string;
      mas_vehicle_department_uid: string;
      mas_carpool_uid: string;
      employee_or_driver_id: string;
    }>;
    time_line_status: string;
  };

  type ResponseApi2Type = {
    mas_driver_uid: string;
    driver_name: string;
    driver_nickname: string;
    driver_contact_number: string;
    driver_dept_sap_short_name_work: string;
    work_last_month: string;
    work_this_month: string;
    driver_trn_requests: DriverTrnRequest[];
  }[];

  // Memoize responseApi2 to avoid recreating it on every render
  const responseApi2: ResponseApi2Type = useMemo(
    () => [
      {
        mas_driver_uid: "1c39ea77-9d8b-46c7-8f12-7987fbbd3be3",
        driver_name: "นายเอกชัย ฉิมวัย",
        driver_nickname: "NULL",
        driver_contact_number: "",
        driver_dept_sap_short_name_work: "",
        work_last_month: "22 วัน/3 งาน",
        work_this_month: "16 วัน/2 งาน",
        driver_trn_requests: [
          {
            trn_request_uid: "120a0b26-d0db-4691-8d46-580034d44f07",
            mas_carpool_driver_uid: "1c39ea77-9d8b-46c7-8f12-7987fbbd3be3",
            request_no: "VZ68RA000046",
            start_datetime: "2025-05-20T12:00:00Z",
            end_datetime: "2025-05-20T12:00:00Z",
            ref_request_status_code: "20",
            ref_request_status_name: "ไป - กลับ",
            ref_trip_type_code: 1,
            vehicle_user_emp_id: "700001",
            vehicle_user_emp_name: "Talonnet ",
            vehicle_user_dept_sap: "9121",
            car_user_internal_contact_number: "",
            car_user_mobile_contact_number: "",
            trip_details: [
              {
                trn_trip_detail_uid: "04c1d610-5edc-490b-a047-9d04d2778ea8",
                trn_request_uid: "0b07440c-ab04-49d0-8730-d62ce0a9bab9",
                trip_start_datetime: "2025-03-26T08:00:00Z",
                trip_end_datetime: "2025-03-26T10:00:00Z",
                trip_departure_place: "Changi Airport",
                trip_destination_place: "Marina Bay Sands",
                trip_start_miles: 5000,
                trip_end_miles: 5050,
                trip_detail: "Routine transport between airport and hotel.",
                mas_vehicle_uid: "21d2ea5a-4ad6-4a95-a64d-73b72d43bd55",
                vehicle_license_plate: "8กษ 8445",
                vehicle_license_plate_province_short: "",
                vehicle_license_plate_province_full: "กรุงเทพมหานคร",
                mas_vehicle_department_uid: "00000000-0000-0000-0000-000000000000",
                mas_carpool_uid: "389b0f63-4195-4ece-bf35-0011c2f5f28c",
                employee_or_driver_id: "700001",
              },
            ],
            time_line_status: "ไป - กลับ",
          },
          {
            trn_request_uid: "1e18ea2c-67aa-4f54-a567-64ca941cb1cf",
            mas_carpool_driver_uid: "1c39ea77-9d8b-46c7-8f12-7987fbbd3be3",
            request_no: "VZ68RA000050",
            start_datetime: "2025-05-20T12:00:00Z",
            end_datetime: "2025-05-20T12:00:00Z",
            ref_request_status_code: "20",
            ref_request_status_name: "รออนุมัติ",
            ref_trip_type_code: 1,
            vehicle_user_emp_id: "700001",
            vehicle_user_emp_name: "Talonnet ",
            vehicle_user_dept_sap: "9121",
            car_user_internal_contact_number: "",
            car_user_mobile_contact_number: "",
            trip_details: [
              {
                trn_trip_detail_uid: "04c1d610-5edc-490b-a047-9d04d2778ea8",
                trn_request_uid: "0b07440c-ab04-49d0-8730-d62ce0a9bab9",
                trip_start_datetime: "2025-03-26T08:00:00Z",
                trip_end_datetime: "2025-03-26T10:00:00Z",
                trip_departure_place: "Changi Airport",
                trip_destination_place: "Marina Bay Sands",
                trip_start_miles: 5000,
                trip_end_miles: 5050,
                trip_detail: "Routine transport between airport and hotel.",
                mas_vehicle_uid: "21d2ea5a-4ad6-4a95-a64d-73b72d43bd55",
                vehicle_license_plate: "8กษ 8445",
                vehicle_license_plate_province_short: "",
                vehicle_license_plate_province_full: "กรุงเทพมหานคร",
                mas_vehicle_department_uid: "00000000-0000-0000-0000-000000000000",
                mas_carpool_uid: "389b0f63-4195-4ece-bf35-0011c2f5f28c",
                employee_or_driver_id: "700001",
              },
            ],
            time_line_status: "รออนุมัติ",
          },
        ],
      },
      {
        mas_driver_uid: "1c39ea77-9d8b-46c7-8f12-7987fbbd3be3",
        driver_name: "นายเอกชัย ฉิมวัยดี",
        driver_nickname: "NULL",
        driver_contact_number: "",
        driver_dept_sap_short_name_work: "",
        work_last_month: "22 วัน/3 งาน",
        work_this_month: "16 วัน/2 งาน",
        driver_trn_requests: [
          {
            trn_request_uid: "120a0b26-d0db-4691-8d46-580034d44f07",
            mas_carpool_driver_uid: "1c39ea77-9d8b-46c7-8f12-7987fbbd3be3",
            request_no: "VZ68RA000046",
            start_datetime: "2025-05-20T12:00:00Z",
            end_datetime: "2025-05-20T12:00:00Z",
            ref_request_status_code: "20",
            ref_request_status_name: "เสร็จสิ้น",
            ref_trip_type_code: 1,
            vehicle_user_emp_id: "700001",
            vehicle_user_emp_name: "Talonnet ",
            vehicle_user_dept_sap: "9121",
            car_user_internal_contact_number: "",
            car_user_mobile_contact_number: "",
            trip_details: [
              {
                trn_trip_detail_uid: "04c1d610-5edc-490b-a047-9d04d2778ea8",
                trn_request_uid: "0b07440c-ab04-49d0-8730-d62ce0a9bab9",
                trip_start_datetime: "2025-05-26T08:00:00Z",
                trip_end_datetime: "2025-05-28T10:00:00Z",
                trip_departure_place: "Changi Airport",
                trip_destination_place: "Marina Bay Sands",
                trip_start_miles: 5000,
                trip_end_miles: 5050,
                trip_detail: "Routine transport between airport and hotel.",
                mas_vehicle_uid: "21d2ea5a-4ad6-4a95-a64d-73b72d43bd55",
                vehicle_license_plate: "8กษ 8445",
                vehicle_license_plate_province_short: "",
                vehicle_license_plate_province_full: "กรุงเทพมหานคร",
                mas_vehicle_department_uid: "00000000-0000-0000-0000-000000000000",
                mas_carpool_uid: "389b0f63-4195-4ece-bf35-0011c2f5f28c",
                employee_or_driver_id: "700001",
              },
            ],
            time_line_status: "เสร็จสิ้น",
          },
          {
            trn_request_uid: "1e18ea2c-67aa-4f54-a567-64ca941cb1cf",
            mas_carpool_driver_uid: "1c39ea77-9d8b-46c7-8f12-7987fbbd3be3",
            request_no: "VZ68RA000050",
            start_datetime: "2025-05-20T12:00:00Z",
            end_datetime: "2025-05-20T12:00:00Z",
            ref_request_status_code: "20",
            ref_request_status_name: "รออนุมัติ",
            ref_trip_type_code: 1,
            vehicle_user_emp_id: "700001",
            vehicle_user_emp_name: "Talonnet ",
            vehicle_user_dept_sap: "9121",
            car_user_internal_contact_number: "",
            car_user_mobile_contact_number: "",
            trip_details: [
              {
                trn_trip_detail_uid: "04c1d610-5edc-490b-a047-9d04d2778ea8",
                trn_request_uid: "0b07440c-ab04-49d0-8730-d62ce0a9bab9",
                trip_start_datetime: "2025-03-26T08:00:00Z",
                trip_end_datetime: "2025-03-26T10:00:00Z",
                trip_departure_place: "Changi Airport",
                trip_destination_place: "Marina Bay Sands",
                trip_start_miles: 5000,
                trip_end_miles: 5050,
                trip_detail: "Routine transport between airport and hotel.",
                mas_vehicle_uid: "21d2ea5a-4ad6-4a95-a64d-73b72d43bd55",
                vehicle_license_plate: "8กษ 8445",
                vehicle_license_plate_province_short: "",
                vehicle_license_plate_province_full: "กรุงเทพมหานคร",
                mas_vehicle_department_uid: "00000000-0000-0000-0000-000000000000",
                mas_carpool_uid: "389b0f63-4195-4ece-bf35-0011c2f5f28c",
                employee_or_driver_id: "700001",
              },
            ],
            time_line_status: "รออนุมัติ",
          },
          {
            trn_request_uid: "1e18ea2c-67aa-4f54-a567-64ca941cb1cf",
            mas_carpool_driver_uid: "1c39ea77-9d8b-46c7-8f12-7987fbbd3be3",
            request_no: "VZ68RA000050",
            start_datetime: "2025-05-20T12:00:00Z",
            end_datetime: "2025-05-20T12:00:00Z",
            ref_request_status_code: "20",
            ref_request_status_name: "รออนุมัติ",
            ref_trip_type_code: 1,
            vehicle_user_emp_id: "700001",
            vehicle_user_emp_name: "Talonnet ",
            vehicle_user_dept_sap: "9121",
            car_user_internal_contact_number: "",
            car_user_mobile_contact_number: "",
            trip_details: [
              {
                trn_trip_detail_uid: "04c1d610-5edc-490b-a047-9d04d2778ea8",
                trn_request_uid: "0b07440c-ab04-49d0-8730-d62ce0a9bab9",
                trip_start_datetime: "2025-03-26T08:00:00Z",
                trip_end_datetime: "2025-03-26T10:00:00Z",
                trip_departure_place: "Changi Airport",
                trip_destination_place: "Marina Bay Sands",
                trip_start_miles: 5000,
                trip_end_miles: 5050,
                trip_detail: "Routine transport between airport and hotel.",
                mas_vehicle_uid: "21d2ea5a-4ad6-4a95-a64d-73b72d43bd55",
                vehicle_license_plate: "8กษ 8445",
                vehicle_license_plate_province_short: "",
                vehicle_license_plate_province_full: "กรุงเทพมหานคร",
                mas_vehicle_department_uid: "00000000-0000-0000-0000-000000000000",
                mas_carpool_uid: "389b0f63-4195-4ece-bf35-0011c2f5f28c",
                employee_or_driver_id: "700001",
              },
            ],
            time_line_status: "รออนุมัติ",
          },
          {
            trn_request_uid: "1e18ea2c-67aa-4f54-a567-64ca941cb1cf",
            mas_carpool_driver_uid: "1c39ea77-9d8b-46c7-8f12-7987fbbd3be3",
            request_no: "VZ68RA000050",
            start_datetime: "2025-05-20T12:00:00Z",
            end_datetime: "2025-05-20T12:00:00Z",
            ref_request_status_code: "20",
            ref_request_status_name: "ค้างแรม",
            ref_trip_type_code: 1,
            vehicle_user_emp_id: "700001",
            vehicle_user_emp_name: "Talonnet ",
            vehicle_user_dept_sap: "9121",
            car_user_internal_contact_number: "",
            car_user_mobile_contact_number: "",
            trip_details: [
              {
                trn_trip_detail_uid: "04c1d610-5edc-490b-a047-9d04d2778ea8",
                trn_request_uid: "0b07440c-ab04-49d0-8730-d62ce0a9bab9",
                trip_start_datetime: "2025-03-26T08:00:00Z",
                trip_end_datetime: "2025-03-26T10:00:00Z",
                trip_departure_place: "Changi Airport",
                trip_destination_place: "Marina Bay Sands",
                trip_start_miles: 5000,
                trip_end_miles: 5050,
                trip_detail: "Routine transport between airport and hotel.",
                mas_vehicle_uid: "21d2ea5a-4ad6-4a95-a64d-73b72d43bd55",
                vehicle_license_plate: "8กษ 8445",
                vehicle_license_plate_province_short: "",
                vehicle_license_plate_province_full: "กรุงเทพมหานคร",
                mas_vehicle_department_uid: "00000000-0000-0000-0000-000000000000",
                mas_carpool_uid: "389b0f63-4195-4ece-bf35-0011c2f5f28c",
                employee_or_driver_id: "700001",
              },
            ],
            time_line_status: "รออนุมัติ",
          },
        ],
      },
    ],
    []
  );

  useEffect(() => {
    const generateDates = async () => {
      const date = await generateDateObjects(params.start_date, params.end_date);
      setDates(date);
    };

    generateDates();
  }, [params]);

  // console.log("1 >>>", dates);
  const dataTransform = useMemo(() => transformApiToTableData(dataRequest, dates), [dataRequest, dates]);
  // console.log("dataTransform >>", dataTransform);

  const columnHelper = createColumnHelper<VehicleTimelineListTableData>();

  const columns = useMemo(
    () => [
      columnHelper.accessor(
        (row) => ({
          license: row.vehicleLicensePlate,
          brandModel: row.vehicleBrandModel,
        }),
        {
          id: "licensePlate",
          header: "ชื่อ - นามสกุล / สังกัด",
          cell: (info) => (
            <div className="flex flex-col items-start">
              <span className="text-base font-semibold">{info.getValue().license}</span>
              <span className="text-base text-gray-600">{info.getValue().brandModel}</span>
            </div>
          ),
          enableSorting: false,
          meta: {
            className: "sticky left-0 z-0 bg-white min-w-[180px] max-w-[180px]",
          },
        }
      ),
      ...(selectedOption === "all"
        ? [
            columnHelper.accessor("vehicleType", {
              header: `งาน ${lastMonth}`,
              cell: (info) => (
                <div className="flex flex-col">
                  <span className="text-base">{info.getValue()}</span>
                </div>
              ),
              enableSorting: false,
              meta: {
                className: "sticky left-[180px] z-0 bg-white min-w-[155px] max-w-[155px]",
              },
            }),
            columnHelper.accessor("vehicleDepartment", {
              header: "งานเดือนนี้",
              cell: (info) => (
                <div className="flex flex-col">
                  <span className="text-base">{info.getValue()}</span>
                </div>
              ),
              enableSorting: false,
              meta: {
                className: "sticky left-[335px] z-0 bg-white min-w-[170px] max-w-[170px]",
              },
            }),
          ]
        : []),
      ...dates.map(({ key, date, day, month, holiday }) =>
        columnHelper.accessor("timeLine", {
          id: key,
          header: () => {
            const className =
              dayjs().format("YYYY-MM-DD") === date.toString() ? "text-white bg-brand-900 rounded-full p-1" : "";
            return (
              <div className={`w-20 flex flex-col items-center text-xs`}>
                <span className={`font-semibold ${className}`}>{day}</span>
                <span className="font-normal">{month}</span>
              </div>
            );
          },
          cell: (info) => {
            const values = info.getValue();
            const mock = values[`day_${day}`];
            const className = holiday != null ? "text-white bg-gray-100" : "";

            return (
              <div className={`flex flex-col text-left min-h-[140px] gap-1 px-1 ${className}`}>
                {mock?.length > 0 &&
                  mock.map((item: any, index: number) => (
                    <div
                      key={index}
                      className={`badge ${
                        item.schedule_status_name === "ค้างแรม"
                          ? "badge-info"
                          : item.schedule_status_name === "รออนุมัติ"
                          ? "badge-warning"
                          : item.schedule_status_name === "ไป - กลับ"
                          ? "badge-error"
                          : "badge-success"
                      } badge-outline !h-auto !rounded-lg justify-start !cursor-pointer w-[calc((100%*${
                        item.schedule_range
                      })+(8px*2)+(1px*2))]`}
                      onClick={() => onClickDetail(item.modal)}
                    >
                      <div className="rounded-[4px] bg-[var(--color-surface-primary)] h-full flex flex-col justify-center py-[2px]">
                        <i className="material-symbols-outlined !text-base !leading-4">directions_car</i>
                        <i className="material-symbols-outlined !text-base !leading-4">person</i>
                      </div>
                      <div className="overflow-hidden">
                        <div className="text-xs font-semibold leading-[18px] truncate">{item.schedule_title}</div>
                        <div className="text-xs font-normal leading-[18px] text-default">{item.schedule_time}</div>
                      </div>
                    </div>
                  ))}
              </div>
            );
          },
          meta: {
            className: "day min-w-[148px] max-w-[148px] !border-t-0 today",
          },
        })
      ),
    ],
    [columnHelper, dates, selectedOption]
  );

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

  return <div className="w-full py-4 pt-0 dataTable-bookingtimeline">{!isLoading && <DataTable table={table} />}</div>;
}
