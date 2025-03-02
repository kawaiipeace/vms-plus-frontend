export type RequestHistoryLog = {
    dateTime: string;
    operator: string;
    position: string;
    detail: string;
    remark: string;
  };
  
  export const requestHistoryLog: RequestHistoryLog[] = [
    {
      dateTime: "01/12/2566 14:03",
      operator: "พิมพ์ลักษ์ บุญชูกุศล",
      position: "นรค.6 กอพ.1 ฝพจ.",
      detail: "ยกเลิกคำขอ",
      remark: "ต้องการเปลี่ยนวันที่เดินทาง"
    },
    {
      dateTime: "01/12/2566 14:03",
      operator: "พิมพ์ลักษ์ บุญชูกุศล",
      position: "นรค.6 กอพ.1 ฝพจ.",
      detail: "ยกเลิกคำขอ",
      remark: "ต้องการเปลี่ยนวันที่เดินทาง"
    }
  ];
  
  export const requestHistoryLogColumns = [
    { accessorKey: "dateTime", header: "วันที่ / เวลา", width: "1%" },
    { accessorKey: "operator", header: "ผู้ดำเนินการ", width: "1%" },
    { accessorKey: "position", header: "ตำแหน่ง / สังกัด", width: "1%" },
    { accessorKey: "detail", header: "รายละเอียด", width: "1%", className: "text-nowrap" },
    { accessorKey: "remark", header: "หมายเหตุ" }
  ];
  