export type RequestData = {
  trn_request_uid: string;
  vehicle_user_emp_name: string;
  vehicle_user_dept_sap: string;
  vehicle_user_emp_id: string;
  car_user_mobile_contact_number: string;
  vehicle_license_plate: string;
  approved_request_emp_id: string;
  approved_request_emp_name: string;
  approved_request_dept_sap: string;
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
  date1: string;
  date2: string;
  place: string;
  place2: string;
  num1: string;
  num2: string;
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


export const requestDataColumns = [
  { accessorKey: "trn_request_uid", header: "เลขที่คำขอ" },
  { accessorKey: "vehicle_user_emp_name", header: "ผู้ใช้ยานพาหนะ" },
  { accessorKey: "vehicle_license_plate", header: "ยานพาหนะ" },
  { accessorKey: "vehicle_user_dept_sap", header: "สังกัดยานพาหนะ" },
  { accessorKey: "work_place", header: "สถานที่ปฏิบัติงาน" },
  { accessorKey: "start_datetime", header: "วันที่เดินทาง" },
  { accessorKey: "objective", header: "สถานะคำขอ" },
  { accessorKey: "action", header: "", disableSortBy: true },
];

export const recordData: RecordTravelTabProps[] = [
  {
    date1: "24/06/67",
    date2: "27/06/67",
    place: "กรุงเทพมหานคร",
    place2: "การไฟฟ้าเขต ฉ.1 และ กฟฟ. ในสังกัด กระทรวงมหาดไทย",
    num1: "2,000",
    num2: "2,000",
  },
  {
    date1: "24/06/67",
    date2: "27/06/67",
    place: "กรุงเทพมหานคร",
    place2: "การไฟฟ้าเขต ฉ.1 และ กฟฟ. ในสังกัด กระทรวงมหาดไทย",
    num1: "2,000",
    num2: "2,000",
  },
];

export const recordDataColumns = [
  { accessorKey: "date1", header: "วันที่ / เวลาจากต้นทาง" },
  { accessorKey: "date2", header: "วันที่ / เวลาถึงปลายทาง" },
  { accessorKey: "place", header: "สถานที่ต้นทาง" },
  { accessorKey: "place2", header: "สถานที่ปลายทาง" },
  { accessorKey: "num1", header: "เลขไมล์ต้นทาง" },
  { accessorKey: "num2", header: "เลขไมล์ปลายทาง" },
  { accessorKey: "action", header: "" },
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
