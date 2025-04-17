import React, { useEffect, useState } from "react";
import { DataTable } from "@/components/table/dataTable";
import {
  ColumnDef,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  PaginationState,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";
import { RequestListType } from "@/app/types/request-list-type";
import { convertToBuddhistDateTime } from "@/utils/converToBuddhistDateTime";
import { useRouter } from "next/navigation";

interface PaginationType {
  limit: number;
  page: number;
  total: number;
  totalPages: number;
}

interface Props {
  defaultData: RequestListType[];
  pagination: PaginationType;
}

export default function AdminListTable({ defaultData, pagination }: Props) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  // Set pagination from props
  const [paginationState, setPagination] = useState<PaginationState>({
    pageIndex: pagination.page - 1, // Adjusting page index as React Table uses 0-based indexing
    pageSize: pagination.limit,
  });

  const requestListColumns: ColumnDef<RequestListType>[] = [
    {
      accessorKey: "request_no",
      header: () => (
        <div className="relative flex items-center justify-center text-center">
          <div className="text-center">เลขที่คำขอ</div>
        </div>
      ),
      enableSorting: true,
      cell: ({ row }) => (
        <div className="text-left" data-name="เลขที่คำขอ">
          <div className="flex flex-col">
            <div>{row.original.request_no}</div>
            <div className="text-left">
              {row.original.is_have_sub_request === "1" &&
                "ปฏิบัติงานต่อเนื่อง"}
            </div>
          </div>
        </div>
      ),
    },
    {
      accessorKey: "vehicle_user_emp_name",
      header: () => <div className="text-left">ผู้ใช้ยานพาหนะ</div>,
      enableSorting: false,
      cell: ({ row }) => (
        <div className="text-left" data-name="ผู้ใช้ยานพาหนะ">
          <div className="flex flex-col">
            <div>{row.original.vehicle_user_emp_name}</div>
            <div>{row.original.vehicle_user_dept_sap_short}</div>
          </div>
        </div>
      ),
    },
    {
      accessorKey: "vehicle_license_plate",
      header: () => <div className="text-center">ยานพาหนะ</div>,
      enableSorting: false,
      cell: ({ row }) => (
        <div className="text-left" data-name="ยานพาหนะ">
          {row.original.vehicle_license_plate === "" &&
          row.original.vehicle_department_dept_sap_short === "" ? (
            <div className="border rounded-md px-2 py-1 text-sm flex gap-2 items-center w-auto bg-white">
                <div className="rounded-full w-[6px] h-[6px] bg-red-500"></div>
                <span className="text-color-secondary">รอเลือก</span> 
              </div>
          ) : (
            <div className="flex flex-col">
              {" "}
              <div className="text-left">
                {row.original.vehicle_license_plate}
              </div>
              <div className="">
                {row.original.vehicle_department_dept_sap_short}
              </div>
            </div>
          )}
        </div>
      ),
    },
    {
      accessorKey: "vehicle_department_dept_sap_short",
      header: () => <div className="text-center">สังกัดยานพาหนะ</div>,
      enableSorting: false,
      cell: ({ row }) => (
        <div className="text-left" data-name="สังกัดยานพาหนะ">
   
            <div className="flex flex-col">
              {" "}
              <div className="text-left">
                {row.original.vehicle_department_dept_sap_short}
              </div>
              {/* <div className="">
                {row.original.vehicle_department_dept_sap_short}
              </div> */}
            </div>
        
        </div>
      ),
    },
    {
      accessorKey: "driver",
      header: () => <div className="text-center">ผู้ขับขี่</div>,
      enableSorting: false,
      cell: ({ row }) => (
        <div className="text-left" data-name="ผู้ขับขี่">
          {row.original.vehicle_license_plate === "" &&
          row.original.vehicle_department_dept_sap_short === "" ? (
            <div className="border rounded-md px-2 py-1 text-sm flex gap-2 items-center w-auto bg-white">
                <div className="rounded-full w-[6px] h-[6px] bg-red-500"></div>
                <span className="text-color-secondary">รอเลือก</span> 
              </div>
          ) : (
            <div className="flex flex-col">
              {" "}
              <div className="text-left">
                {row.original.vehicle_license_plate}
              </div>
              <div className="">
                {row.original.vehicle_department_dept_sap_short}
              </div>
            </div>
          )}
        </div>
      ),
    },
    {
      accessorKey: "work_place",
      header: () => <div className="text-center">สถานที่ปฏิบัติงาน</div>,
      enableSorting: false,
      cell: ({ getValue }) => (
        <div className="text-left" data-name="สถานที่ปฏิบัติงาน">
          {getValue() as string}
        </div>
      ),
    },
    {
      accessorKey: "start_datetime",
      header: () => <div className="text-center">วันที่เดินทาง</div>,
      enableSorting: true,
      cell: ({ row }) => {
        const startDateTime = convertToBuddhistDateTime(
          row.original.start_datetime
        );
        const endDateTime = convertToBuddhistDateTime(
          row.original.end_datetime
        );
        return (
          <div className="text-left" data-name="วันที่เดินทาง">
            <div className="flex flex-col">
                  <div>
                  {startDateTime.date + " - " + endDateTime.date}
                  </div>
                  <div>    {endDateTime.time + " - " + startDateTime.time}</div>
            </div>

          </div>
        );
      },
    },
    {
      accessorKey: "ref_request_status_name",
      header: () => <div className="text-center">สถานะคำขอ</div>,
      enableSorting: true,
      cell: ({ getValue }) => {
        const value = getValue() as string;
        return (
          <div className="w-[80px] text-center" data-name="สถานะคำขอ">
            {value === "เกินวันที่นัดหมาย" || value === "ถูกตีกลับ" ? (
              <span className="badge badge-pill-outline badge-error whitespace-nowrap">
                {value as React.ReactNode}
              </span>
            ) : value === "ตีกลับ" ? (
              <span className="badge badge-pill-outline badge-warning whitespace-nowrap">
                ตีกลับคำขอ
              </span>
            ) : value === "ยกเลิกคำขอ" ? (
              <span className="badge badge-pill-outline badge-gray !border-gray-200 !bg-gray-50 whitespace-nowrap">
                {value as React.ReactNode}
              </span>
            ) : value === "อนุมัติแล้ว" ? (
              <span className="badge badge-pill-outline badge-success whitespace-nowrap">
                {value as React.ReactNode}
              </span>
            ) : (
              <span className="badge badge-pill-outline badge-info whitespace-nowrap">
                {value as React.ReactNode}
              </span>
            )}
          </div>
        );
      },
    },

    {
      accessorKey: "action",
      header: () => <div className="text-center"></div>,
      enableSorting: false,
      cell: ({ row }) => {
        const statusValue = row.original.ref_request_status_name;
        return (
          <div className="text-left dataTable-action">
            {statusValue == "รออนุมัติ" && (
              <button
                className="btn btn-icon btn-tertiary bg-transparent shadow-none border-none tooltip tooltip-left"
                data-tip="ดูรายละเอียดคำขอ"
                onClick={() =>
                  router.push(
                    "/administrator/request-list/" +
                      row.original.trn_request_uid + "/edit"
                  )
                }
              >
                <i className="material-symbols-outlined">quick_reference_all</i>
              </button>
            )}

            {(statusValue == "ตีกลับ" || statusValue == "อนุมัติแล้ว") && (
              <button
                className="btn btn-icon btn-tertiary bg-transparent shadow-none border-none tooltip tooltip-left"
                data-tip="ดูรายละเอียดคำขอ"
                onClick={() =>
                  router.push(
                    "/administrator/request-list/" +
                      row.original.trn_request_uid +
                      "?status=" +
                      statusValue
                  )
                }
              >
                <i className="material-symbols-outlined">quick_reference_all</i>
              </button>
            )}

            {statusValue == "ยกเลิกคำขอ" && (
              <button
                className="btn btn-icon btn-tertiary bg-transparent shadow-none border-none tooltip tooltip-left"
                data-tip="ดูรายละเอียดคำขอ"
                onClick={() =>
                  router.push(
                    "/administrator/request-list/" +
                      row.original.trn_request_uid +
                      "?status=" +
                      statusValue
                  )
                }
              >
                <i className="material-symbols-outlined">quick_reference_all</i>
              </button>
            )}
          </div>
        );
      },
    },
  ];

  const table = useReactTable({
    data: defaultData,
    columns: requestListColumns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    state: {
      sorting,
      pagination: paginationState,
    },
    defaultColumn: {
      enableSorting: false,
    },
  });

  useEffect(() => {
    console.log("page", pagination);
  }, [pagination]);

  useEffect(() => {
    setIsLoading(false);
  }, []);

  return (
    <div className="w-full py-4 pt-0">
      {!isLoading && (
        <>
          <DataTable table={table} />
        </>
      )}
    </div>
  );
}
