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
  
  export const requestData: RequestData[] = [
    {
      "reqNo": "REQ001",
      "vehicleUser": "John Doe",
      "vehicle": "Toyota",
      "location": "Bangkok Office",
      "startDate": "2025-03-10T00:00:00Z",
      "detail": "Business trip to Bangkok.",
      "status": "Approved",
      "action": "Completed"
    },
    {
      "reqNo": "REQ002",
      "vehicleUser": "Jane Smith",
       "vehicle": "Toyota",
      "location": "Chiang Mai Office",
      "startDate": "2025-03-10T00:00:00Z",
      "detail": "Attending a conference.",
      "status": "Pending",
      "action": "Awaiting Approval"
    },
    {
      "reqNo": "REQ003",
      "vehicleUser": "Michael Brown",
      "vehicle": "Toyota",
      "location": "Phuket Office",
      "startDate": "2025-03-10T00:00:00Z",
      "detail": "Site visit to construction project.",
      "status": "Rejected",
      "action": "Cancelled"
    },
    {
      "reqNo": "REQ004",
      "vehicleUser": "Emily White",
      "vehicle": "Toyota",
      "location": "Pattaya Office",
      "startDate": "2025-03-10T00:00:00Z",
      "detail": "Business trip for client meeting.",
      "status": "Approved",
      "action": "Completed"
    },
    {
      "reqNo": "REQ005",
      "vehicleUser": "David Lee",
      "vehicle": "Toyota",
      "location": "Hat Yai Office",
      "startDate": "2025-03-10T00:00:00Z",
      "detail": "Attending a workshop.",
      "status": "Pending",
      "action": "Awaiting Approval"
    },
    {
      "reqNo": "REQ006",
      "vehicleUser": "Sophia Green",
      "vehicle": "Toyota",
      "location": "Bangkok Office",
      "startDate": "2025-03-10T00:00:00Z",
      "detail": "Training session at HQ.",
      "status": "Approved",
      "action": "Completed"
    },
    {
      "reqNo": "REQ007",
      "vehicleUser": "Chris Black",
      "vehicle": "Toyota",
      "location": "Khon Kaen Office",
      "startDate": "2025-03-10T00:00:00Z",
      "detail": "Meeting with investors.",
      "status": "Rejected",
      "action": "Cancelled"
    },
    {
      "reqNo": "REQ008",
      "vehicleUser": "Olivia Martin",
      "vehicle": "Toyota",
      "location": "Samui Office",
      "startDate": "2025-03-10T00:00:00Z",
      "detail": "Product launch event.",
      "status": "Pending",
      "action": "Awaiting Approval"
    },
    {
      "reqNo": "REQ009",
      "vehicleUser": "Lucas Harris",
      "vehicle": "Toyota",
      "location": "Surat Thani Office",
      "startDate": "2025-03-10T00:00:00Z",
      "detail": "Client meeting and presentation.",
      "status": "Approved",
      "action": "Completed"
    },
    {
      "reqNo": "REQ010",
      "vehicleUser": "Isabella Clark",
      "vehicle": "Toyota",
      "location": "Hua Hin Office",
      "startDate": "2025-03-10T00:00:00Z",
      "detail": "Company team-building trip.",
      "status": "Pending",
      "action": "Awaiting Approval"
    },
    {
      "reqNo": "REQ011",
      "vehicleUser": "Isabella Clark",
      "vehicle": "Toyota",
      "location": "Hua Hin Office",
      "startDate": "2025-03-10T00:00:00Z",
      "detail": "Company team-building trip.",
      "status": "Pending",
      "action": "Awaiting Approval"
    }
  ];
  
  export const requestDataColumns = [
    { "accessorKey": "reqNo", "header": "เลขที่คำขอ" },
    { "accessorKey": "vehicleUser", "header": "ผู้ใช้ยานพาหนะ" },
    { "accessorKey": "vehicle", "header": "ยานพาหนะ" },
    { "accessorKey": "location", "header": "สถานที่ปฏิบัติงาน" },
    { "accessorKey": "startDate", "header": "วันที่เดินทาง" },
    { "accessorKey": "detail", "header": "รายละเอียด" },
    { "accessorKey": "status", "header": "สถานะคำขอ" },
    { "accessorKey": "action", "header": "" }
    
  ];
  