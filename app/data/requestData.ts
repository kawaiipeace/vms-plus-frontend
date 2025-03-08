export type RequestData = {
  reqNo: string;
  vehicleUser: string;
  vehicle: string;
  location: string;
  startDate: string;
  detail: string;
  status: string;
  action: string;
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

export const requestData: RequestData[] = [
  {
    reqNo: "REQ001",
    vehicleUser: "John Doe",
    vehicle: "Toyota",
    location: "Bangkok Office",
    startDate: "2025-03-10T00:00:00Z",
    detail: "Business trip to Bangkok.",
    status: "รออนุมัติ",
    action: "Completed",
  },
  {
    reqNo: "REQ002",
    vehicleUser: "Jane Smith",
    vehicle: "Toyota",
    location: "Chiang Mai Office",
    startDate: "2025-03-10T00:00:00Z",
    detail: "Attending a conference.",
    status: "รอตรวจสอบ",
    action: "Awaiting Approval",
  },
  {
    reqNo: "REQ003",
    vehicleUser: "Michael Brown",
    vehicle: "Toyota",
    location: "Phuket Office",
    startDate: "2025-03-10T00:00:00Z",
    detail: "Site visit to construction project.",
    status: "ถูกตีกลับ",
    action: "Cancelled",
  },
  {
    reqNo: "REQ004",
    vehicleUser: "Emily White",
    vehicle: "Toyota",
    location: "Pattaya Office",
    startDate: "2025-03-10T00:00:00Z",
    detail: "Business trip for client meeting.",
    status: "รออนุมัติ",
    action: "Completed",
  },
  {
    reqNo: "REQ005",
    vehicleUser: "David Lee",
    vehicle: "Toyota",
    location: "Hat Yai Office",
    startDate: "2025-03-10T00:00:00Z",
    detail: "Attending a workshop.",
    status: "รอตรวจสอบ",
    action: "Awaiting Approval",
  },
  {
    reqNo: "REQ006",
    vehicleUser: "Sophia Green",
    vehicle: "Toyota",
    location: "Bangkok Office",
    startDate: "2025-03-10T00:00:00Z",
    detail: "Training session at HQ.",
    status: "รออนุมัติ",
    action: "Completed",
  },
  {
    reqNo: "REQ007",
    vehicleUser: "Chris Black",
    vehicle: "Toyota",
    location: "Khon Kaen Office",
    startDate: "2025-03-10T00:00:00Z",
    detail: "Meeting with investors.",
    status: "ถูกตีกลับ",
    action: "Cancelled",
  },
  {
    reqNo: "REQ008",
    vehicleUser: "Olivia Martin",
    vehicle: "Toyota",
    location: "Samui Office",
    startDate: "2025-03-10T00:00:00Z",
    detail: "Product launch event.",
    status: "รอตรวจสอบ",
    action: "Awaiting Approval",
  },
  {
    reqNo: "REQ009",
    vehicleUser: "Lucas Harris",
    vehicle: "Toyota",
    location: "Surat Thani Office",
    startDate: "2025-03-10T00:00:00Z",
    detail: "Client meeting and presentation.",
    status: "รออนุมัติ",
    action: "Completed",
  },
  {
    reqNo: "REQ010",
    vehicleUser: "Isabella Clark",
    vehicle: "Toyota",
    location: "Hua Hin Office",
    startDate: "2025-03-10T00:00:00Z",
    detail: "Company team-building trip.",
    status: "รอตรวจสอบ",
    action: "Awaiting Approval",
  },
  {
    reqNo: "REQ011",
    vehicleUser: "Isabella Clark",
    vehicle: "Toyota",
    location: "Hua Hin Office",
    startDate: "2025-03-10T00:00:00Z",
    detail: "Company team-building trip.",
    status: "รอตรวจสอบ",
    action: "Awaiting Approval",
  },
];

export const requestDataColumns = [
  { accessorKey: "reqNo", header: "เลขที่คำขอ" },
  { accessorKey: "vehicleUser", header: "ผู้ใช้ยานพาหนะ" },
  { accessorKey: "vehicle", header: "ยานพาหนะ" },
  { accessorKey: "location", header: "สถานที่ปฏิบัติงาน" },
  { accessorKey: "startDate", header: "วันที่เดินทาง" },
  { accessorKey: "detail", header: "รายละเอียด" },
  { accessorKey: "status", header: "สถานะคำขอ" },
  { accessorKey: "action", header: "" },
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
