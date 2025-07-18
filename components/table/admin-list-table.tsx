"use client";
import React, { useEffect, useState } from "react";
import { DataTable } from "@/components/table/dataTable";
import Image from "next/image";
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
            <div>{row.original.vehicle_user_emp_name} ({row.original.vehicle_user_emp_id})</div>
             <div className="text-color-secondary text-xs">
              {row.original.vehicle_user_position + " " + row.original.vehicle_user_dept_name_short}
            </div>
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
          {row.original.can_choose_vehicle === true ? (
            <div className="border rounded-md px-2 py-1 text-sm flex gap-2 items-center w-auto bg-white">
              <div className="rounded-full w-[6px] h-[6px] bg-red-500"></div>
              <span className="text-color-secondary">รอเลือก</span>
            </div>
          ) : (
            <div className="flex flex-col">
              {" "}
              <div className="text-left">
              {row.original.vehicle_license_plate + " " +row.original.vehicle_license_plate_province_short}
              </div>
              <div className="text-color-secondary text-xs">
                {row.original.ref_vehicle_type_name}
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
              {row.original.vehicle_dept_name}
            </div>
            <div className="text-color-secondary text-xs">
              {row.original.vehicle_carpool_name}
            </div>
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
        {row.original.can_choose_driver === true ? (
          <div className="border rounded-md px-2 py-1 text-sm flex gap-2 items-center w-[5rem] bg-white">
            <div className="rounded-full w-[6px] h-[6px] bg-red-500"></div>
            <span className="text-color-secondary">รอเลือก</span>
          </div>
        ) : (
          <div className="flex items-center gap-2 flex-nowrap overflow-hidden">
            <div className="w-[36px] h-[36px] flex-shrink-0">
              {row.original.is_pea_employee_driver === 1 ? (
                <Image
                  src="/assets/img/avatar.svg"
                  width={36}
                  height={36}
                  alt="User Avatar"
                />
              ) : (
                <Image
                  src="/assets/img/graphic/admin_select_driver_small.png"
                  width={36}
                  height={36}
                  alt="User Avatar"
                  className="rounded-full"
                />
              )}
            </div>
            <div className="min-w-0 flex flex-col overflow-hidden">
              <div className="text-left text-ellipsis whitespace-nowrap overflow-hidden">
                {row.original.driver_name}
              </div>
              <div className="text-color-secondary text-xs text-ellipsis whitespace-nowrap overflow-hidden">
                {row.original.driver_dept_name}
              </div>
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
      header: () => <div className="text-center">วันที่/เวลาเดินทาง</div>,
      enableSorting: true,
      cell: ({ row }) => {
        const startDateTime = convertToBuddhistDateTime(
          row.original.start_datetime || ""
        );
        const endDateTime = convertToBuddhistDateTime(
          row.original.end_datetime || ""
        );
        const isSameDate = startDateTime.date === endDateTime.date;
        return (
          <div className="text-left" data-name="วันที่/เวลาเดินทาง">
            <div className="flex flex-col">
            <div>
                {isSameDate ? (
                  <>
                    {startDateTime.date} 
                  </>
                ) : (
                  <>
                    {startDateTime.date} - {" "}
                    {endDateTime.date} 
                  </>
                )}
              </div>
              <div className="text-color-secondary text-xs">
                {" "}
                {startDateTime.time + " - " + endDateTime.time} (
                {row.original.trip_type_name})
              </div>
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
              <span className="badge badge-pill-outline badge-gray whitespace-nowrap">
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
          
              <button
                className="btn btn-icon btn-tertiary bg-transparent shadow-none border-none tooltip tooltip-left"
                data-tip="ดูรายละเอียดคำขอ"
                onClick={() =>
                  router.push(
                    "/administrator/request-list/" +
                      row.original.trn_request_uid +
                      "/edit"
                  )
                }
              >
                <i className="material-symbols-outlined">quick_reference_all</i>
              </button>
  

            {statusValue == "ยกเลิกคำขอ" && (
              <button
                className="btn btn-icon btn-tertiary bg-transparent shadow-none border-none tooltip tooltip-left"
                data-tip="ดูรายละเอียดคำขอ"
                onClick={() =>
                  router.push(
                    "/administrator/request-list/" +
                      row.original.trn_request_uid
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
  
  }, [pagination]);

  useEffect(() => {
    setIsLoading(false);
  }, []);

  return (
    <div className="w-full py-4 pt-0">
      {!isLoading && (
        <>
          <DataTable
            table={table}
            onRowClick={(row) => {

              const status = row.ref_request_status_name;
              const uid = row.trn_request_uid;
              if (status === "รออนุมัติ") {
                router.push(`/administrator/request-list/${uid}`);
              } else {
                router.push(`/administrator/request-list/${uid}`);
              }
            }}
          />
        </>
      )}
    </div>
  );
}
