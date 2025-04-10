export type KeyHandOverData = {
  reqNo: string;
  vehicleUser: string;
  vehicle: string;
  location: string;
  startDate: string;
  appointmentDate: string;
  detail: string;
  status: string;
  action: string;
};

export const keyHandOverData: KeyHandOverData[] = [
  {
    reqNo: "REQ001",
    vehicleUser: "John Doe",
    vehicle: "Toyota",
    location: "Bangkok Office",
    startDate: "02/01/2567",
    appointmentDate: "03/01/2567",
    detail: "Business trip to Bangkok.",
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
    detail: "Attending a conference.",
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
    detail: "Site visit to construction project.",
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
    detail: "Business trip for client meeting.",
    status: "รอให้กุญแจ",
    action: "Awaiting Approval",
  },
];

export const keyHandOverDataColumns = [
  { accessorKey: "reqNo", header: "เลขที่คำขอ" },
  { accessorKey: "vehicle", header: "ยานพาหนะ" },
  { accessorKey: "detail", header: "สังกัดยานพาหนะ" },
  { accessorKey: "startDate", header: "วันที่เดินทาง" },
  { accessorKey: "vehicleUser", header: "ผู้มารับกุญแจ" },
  { accessorKey: "appointmentDate", header: "วันที่นัดรับกุญแจ" },
  { accessorKey: "location", header: "สถานที่นัดหมาย" },
  { accessorKey: "status", header: "สถานะคำขอ" },
  { accessorKey: "action", header: "" },
];
