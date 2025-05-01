import { convertToBuddhistDateTime } from "@/utils/converToBuddhistDateTime";

export type RequestData = {
  request_no: string;
  vehicle_user_emp_name: string;
  vehicle_user_dept_sap: string;
  vehicle_user_emp_id: string;
  car_user_mobile_contact_number: string;
  vehicle_license_plate: string;
  approved_request_emp_id: string;
  approved_request_emp_name: string;
  approved_request_dept_sap: string;
  ref_request_status_name: string;
  start_datetime: string;
  end_datetime: string;
  date_range: string;
  trip_type: number;
  work_place: string;
  objective: string;
  remark: string;
  number_of_passengers: number;
  pickup_place: string;
  pickup_datetime: string;
  reference_number: string;
  attached_document: string;
  is_pea_employee_driver: string;
  is_admin_choose_driver: string;
  is_admin_choose_vehicle: string;
  ref_cost_type_code: string;
  cost_no: string;
  mas_carpool_driver_uid: string;
  driver: {
    mas_driver_uid: string;
    driver_name: string;
    driver_image: string;
    driver_nickname: string;
    driver_dept_sap: string;
    driver_identification_no: string;
    driver_contact_number: string;
    driver_average_satisfaction_score: number;
    driver_birthdate: string;
    age: string;
  };
  mas_vehicle_uid: string;
  vehicle: {
    mas_vehicle_uid: string;
    vehicle_brand_name: string;
    vehicle_model_name: string;
    vehicle_license_plate: string;
    vehicle_img: string;
    CarType: string;
    vehicle_owner_dept_sap: string;
    is_has_fleet_card: number;
    vehicle_gear: string;
    ref_vehicle_subtype_code: number;
    vehicle_user_emp_id: string;
    ref_fuel_type_id: number;
    seat: number;
    ref_fuel_type: {
      ref_fuel_type_id: number;
      ref_fuel_type_name_th: string;
      ref_fuel_type_name_en: string;
    };
  };
  received_key_place: string;
  received_key_start_datetime: string;
  received_key_end_datetime: string;
};

export type RecordTravelTabProps = {
  trn_trip_detail_uid: string;
  trn_request_uid: string;
  trip_start_datetime: string;
  trip_end_datetime: string;
  trip_departure_place: string;
  trip_destination_place: string;
  trip_start_miles: number;
  trip_end_miles: number;
  trip_detail: string;
};

export type RecordFuelTabProps = {
  dateReceipt: string;
  receiptNo: string;
  staionType: string;
  fuelType: string;
  mileNum: string;
  literNum: string;
  pricePerLiter: string;
  vat: string;
  priceTotal: string;
  paymentType: string;
};

export const requestData_1: RequestData[] = [
  {
    request_no: "0001",
    vehicle_user_emp_name: "นาย สมชาย ใจดี",
    vehicle_user_dept_sap: "กฟฟ. ในสังกัด กระทรวงมหาดไทย",
    vehicle_user_emp_id: "0001",
    car_user_mobile_contact_number: "0001",
    vehicle_license_plate: "กข-0001",
    approved_request_emp_id: "0001",
    approved_request_emp_name: "นาย สมชาย ใจดี",
    approved_request_dept_sap: "กฟฟ. ในสังกัด กระทรวงมหาดไทย",
    start_datetime: "24/06/67 08:00",
    end_datetime: "27/06/67 17:00",
    date_range: "24/06/67 - 27/06/67",
    trip_type: 1,
    work_place: "การไฟฟ้าเขต ฉ.1 และ กฟฟ. ในสังกัด กระทรวงมหาดไทย",
    objective: "การไฟฟ้าเขต ฉ.1 และ กฟฟ. ในสังกัด กระทรวงมหาดไทย",
    remark: "การไฟฟ้าเขต ฉ.1 และ กฟฟ. ในสังกัด กระทรวงมหาดไทย",
    number_of_passengers: 1,
    pickup_place: "การไฟฟ้าเขต ฉ.1 และ กฟฟ. ในสังกัด กระทรวงมหาดไทย",
    pickup_datetime: "24/06/67 08:00",
    reference_number: "0001",
    attached_document: "0001",
    is_pea_employee_driver: "0001",
    is_admin_choose_driver: "0001",
    is_admin_choose_vehicle: "0001",
    ref_cost_type_code: "0001",
    cost_no: "0001",
    mas_carpool_driver_uid: "0001",
    driver: {
      mas_driver_uid: "0001",
      driver_name: "นาย สมชาย ใจดี",
      driver_image: "0001",
      driver_nickname: "0001",
      driver_dept_sap: "0001",
      driver_identification_no: "0001",
      driver_contact_number: "0001",
      driver_average_satisfaction_score: 1,
      driver_birthdate: "24/06/67",
      age: "0001",
    },
    mas_vehicle_uid: "0001",
    vehicle: {
      mas_vehicle_uid: "0001",
      vehicle_brand_name: "0001",
      vehicle_model_name: "0001",
      vehicle_license_plate: "0001",
      vehicle_img: "0001",
      CarType: "0001",
      vehicle_owner_dept_sap: "0001",
      is_has_fleet_card: 1,
      vehicle_gear: "0001",
      ref_vehicle_subtype_code: 1,
      vehicle_user_emp_id: "0001",
      ref_fuel_type_id: 1,
      seat: 1,
      ref_fuel_type: {
        ref_fuel_type_id: 1,
        ref_fuel_type_name_th: "0001",
        ref_fuel_type_name_en: "0001",
      },
    },
    received_key_place: "0001",
    received_key_start_datetime: "0001",
    received_key_end_datetime: "0001",
    ref_request_status_name: "รออนุมัติ",
  },
];

export const requestDataColumns = [
  { accessorKey: "request_no", header: "เลขที่คำขอ", enableSorting: true },
  { accessorKey: "vehicle_user_emp_name", header: "ผู้ใช้ยานพาหนะ", enableSorting: false },
  { accessorKey: "vehicle_license_plate", header: "ยานพาหนะ", enableSorting: false },
  { accessorKey: "vehicle_user_dept_sap", header: "หน่วยงาน", enableSorting: false },
  { accessorKey: "work_place", header: "สถานที่ปฏิบัติงาน", enableSorting: false },
  { accessorKey: "start_datetime", header: "วันที่เดินทาง", enableSorting: true },
  // { accessorKey: "objective", header: "รายละเอียด", enableSorting: false },
  { accessorKey: "ref_request_status_name", header: "สถานะคำขอ", enableSorting: false },
  { accessorKey: "action", header: "", enableSorting: false },
];

export const recordData: RecordTravelTabProps[] = [
  // {
  //   date1: "24/06/67",
  //   date2: "27/06/67",
  //   place: "กรุงเทพมหานคร",
  //   place2: "การไฟฟ้าเขต ฉ.1 และ กฟฟ. ในสังกัด กระทรวงมหาดไทย",
  //   num1: "2,000",
  //   num2: "2,000",
  // },
  // {
  //   date1: "24/06/67",
  //   date2: "27/06/67",
  //   place: "กรุงเทพมหานคร",
  //   place2: "การไฟฟ้าเขต ฉ.1 และ กฟฟ. ในสังกัด กระทรวงมหาดไทย",
  //   num1: "2,000",
  //   num2: "2,000",
  // },
];

export const recordTravelDataColumns = [
  {
    accessorKey: "trip_start_datetime",
    header: "วันที่ / เวลาจากต้นทาง",
  },
  {
    accessorKey: "trip_end_datetime",
    header: "วันที่ / เวลาถึงปลายทาง",
    renderValue: ({ getValue }: any) =>
      convertToBuddhistDateTime(getValue).date + " " + convertToBuddhistDateTime(getValue).time,
  },
  { accessorKey: "trip_departure_place", header: "สถานที่ต้นทาง" },
  { accessorKey: "trip_destination_place", header: "สถานที่ปลายทาง" },
  { accessorKey: "trip_start_miles", header: "เลขไมล์ต้นทาง" },
  { accessorKey: "trip_end_miles", header: "เลขไมล์ปลายทาง" },
  { accessorKey: "trip_detail", header: "รายละเอียด" },
];

export const recordFuelData: RecordFuelTabProps[] = [
  {
    dateReceipt: "24/06/67",
    receiptNo: "0001",
    staionType: "PTT",
    fuelType: "Diesel",
    mileNum: "2,000",
    literNum: "2,000",
    pricePerLiter: "30",
    vat: "107",
    priceTotal: "60,000",
    paymentType: "Cash",
  },
  {
    dateReceipt: "24/06/67",
    receiptNo: "0001",
    staionType: "PTT",
    fuelType: "Diesel",
    mileNum: "2,000",
    literNum: "2,000",
    pricePerLiter: "30",
    vat: "107",
    priceTotal: "60,000",
    paymentType: "Cash",
  },
  {
    dateReceipt: "24/06/67",
    receiptNo: "0001",
    staionType: "PTT",
    fuelType: "Diesel",
    mileNum: "2,000",
    literNum: "2,000",
    pricePerLiter: "30",
    vat: "107",
    priceTotal: "60,000",
    paymentType: "Cash",
  },
];

export const recordFuelDataColumns = [
  { accessorKey: "dateReceipt", header: "วันที่ใบเสร็จ" },
  { accessorKey: "receiptNo", header: "เลขที่ใบเสร็จ" },
  { accessorKey: "staionType", header: "สถานีบริการน้ำมัน" },
  { accessorKey: "fuelType", header: "ประเภทเชื้อเพลิง" },
  { accessorKey: "mileNum", header: "เลขไมล์" },
  { accessorKey: "literNum", header: "จำนวนลิตร" },
  { accessorKey: "pricePerLiter", header: "ราคาต่อลิตร" },
  { accessorKey: "vat", header: "ภาษี" },
  { accessorKey: "priceTotal", header: "ยอดรวมชำระ" },
  { accessorKey: "paymentType", header: "วิธีชำระเงิน" },
  { accessorKey: "action", header: "" },
];
