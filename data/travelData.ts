export type TravelData = {
  reqNo: string;
  vehicleUser: string;
  vehicle: string;
  location: string;
  startDate: string;
  appointmentDate: string;
  status: string;
  action: string;
};

export const travelData: TravelData[] = [
  {
    reqNo: "REQ001",
    vehicleUser: "John Doe",
    vehicle: "Toyota",
    location: "Bangkok Office",
    startDate: "02/01/2567",
    appointmentDate: "03/01/2567",
    status: "เกินวันที่นัดหมาย",
    action: "Completed",
  },
  {
    reqNo: "REQ002",
    vehicleUser: "Jane Smith",
    vehicle: "Toyota",
    location: "Chiang Mai Office",
    startDate: "02/01/2567",
    appointmentDate: "04/01/2567",
    status: "รอให้กุญแจ",
    action: "Awaiting Approval",
  },
  {
    reqNo: "REQ003",
    vehicleUser: "Michael Brown",
    vehicle: "Toyota",
    location: "Phuket Office",
    startDate: "02/01/2567",
    appointmentDate: "05/01/2567",
    status: "เกินวันที่นัดหมาย",
    action: "Cancelled",
  },
  {
    reqNo: "REQ004",
    vehicleUser: "Emily White",
    vehicle: "Toyota",
    location: "Pattaya Office",
    startDate: "02/01/2567",
    appointmentDate: "06/01/2567",
    status: "รอให้กุญแจ",
    action: "Awaiting Approval",
  },
];

export const travelDataColumns = [
  { accessorKey: "reqNo", header: "เลขที่คำขอ" },
  { accessorKey: "vehicle", header: "ผู้ใช้ยานพาหนะ" },
  { accessorKey: "location", header: "ยานพาหนะ" },
  { accessorKey: "startDate", header: "สังกัดยานพาหนะ" },
  { accessorKey: "vehicleUser", header: "สถานที่ปฏิบัติงาน" },
  { accessorKey: "appointmentDate", header: "วันที่เดินทาง" },
  { accessorKey: "status", header: "สถานะคำขอ" },
  { accessorKey: "action", header: "" },
];

export const travelDataColumnsAdmin = [
  { accessorKey: "reqNo", header: "วันที่ / เวลาจากต้นทาง" },
  { accessorKey: "vehicle", header: "วันที่ / เวลาถึงปลายทาง" },
  { accessorKey: "location", header: "เลขไมล์ต้นทาง" },
  { accessorKey: "startDate", header: "เลขไมล์ปลายทาง" },
  { accessorKey: "vehicleUser", header: "สถานที่ต้นทาง" },
  { accessorKey: "appointmentDate", header: "สถานที่ปลายทาง" },
  { accessorKey: "status", header: "รายละเอียด" },
  { accessorKey: "action", header: "" },
];
