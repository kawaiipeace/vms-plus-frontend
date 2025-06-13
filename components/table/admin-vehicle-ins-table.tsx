"use client";
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
import { convertToBuddhistDateTime } from "@/utils/converToBuddhistDateTime";
import { useRouter } from "next/navigation";
import { VehicleInsType } from "@/data/vehicleInsData";

interface PaginationType {
  limit: number;
  page: number;
  total: number;
  totalPages: number;
}

interface Props {
  defaultData: VehicleInsType[];
  pagination: PaginationType;
}

export default function AdminVehicleInsTable({
  defaultData,
  pagination,
}: Props) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  // Set pagination from props
  const [paginationState, setPagination] = useState<PaginationState>({
    pageIndex: pagination.page - 1, // Adjusting page index as React Table uses 0-based indexing
    pageSize: pagination.limit,
  });

  const requestListColumns: ColumnDef<VehicleInsType>[] = [
    {
      accessorKey: "start_datetime",
      header: () => (
        <div className="relative flex items-center justify-center text-center">
          <div className="text-center">วันที่ผู้ใช้คืนยานพาหนะ</div>
        </div>
      ),
      enableSorting: true,
      cell: ({ row }) => {
        const date = convertToBuddhistDateTime(
          row.original.returned_vehicle_datetime
        ).date;
        const time = convertToBuddhistDateTime(
          row.original.returned_vehicle_datetime
        ).time;
        return (
          <div className="text-left" data-name="การเดินทางถัดไป">
            <div className="flex flex-col">
              <div>{date}</div>
              <div className="text-color-secondary text-xs">
               {time}
              </div>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "vehicle_license_plate",
      header: () => <div className="text-center">ยานพาหนะ</div>,
      enableSorting: false,
      cell: ({ row }) => (
        <div className="text-left" data-name="ยานพาหนะ">
          <div className="flex flex-col">
            {" "}
            <div className="text-left">
            {row.original.vehicle_license_plate + " " +row.original.vehicle_license_plate_province_short}
            </div>
            <div className="text-color-secondary text-xs">
              {row.original.ref_vehicle_type_name}
            </div>
          </div>
        </div>
      ),
    },
    {
      accessorKey: "vehicle_dept_name",
      header: () => <div className="text-center">สังกัดยานพาหนะ</div>,
      enableSorting: false,
      cell: ({ row }) => (
        <div className="text-left" data-name="สังกัดยานพาหนะ">
          <div className="flex flex-col">
            {" "}
            <div className="text-left">{row.original.vehicle_dept_name}</div>
            <div className="text-color-secondary text-xs">
              {row.original.vehicle_carpool_name}
            </div>
          </div>
        </div>
      ),
    },
    {
      accessorKey: "parking_place",
      header: () => <div className="text-center">สถานที่จอดรถ</div>,
      enableSorting: false,
      cell: ({ row }) => (
        <div className="text-left" data-name="สถานที่จอดรถ">
          <div className="flex flex-col">
            {" "}
            <div className="text-left">{row.original.parking_place}</div>
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
      accessorKey: "next_start_datetime",
      header: () => <div className="text-center">การเดินทางถัดไป</div>,
      enableSorting: true,
      cell: ({ row }) => {
        const date = convertToBuddhistDateTime(
          row.original.next_start_datetime
        ).date;
        const time = convertToBuddhistDateTime(
          row.original.next_start_datetime
        ).time;
        return (
          <div className="text-left" data-name="การเดินทางถัดไป">
            <div className="flex flex-col">
              <div>{date}</div>
              <div className="text-color-secondary text-xs">
               {time}
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
            {value === "ตีกลับยานพาหนะ" ? (
              <span className="badge badge-pill-outline badge-error whitespace-nowrap">
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
        return (
          <div className="text-left dataTable-action">
            <button
              className="btn btn-icon btn-tertiary bg-transparent shadow-none border-none tooltip tooltip-left"
              data-tip="ดูรายละเอียดคำขอ"
              onClick={() =>
                router.push(
                  "/administrator/vehicle-in-use/" +
                    row.original.trn_request_uid +
                    "/edit"
                )
              }
            >
              <i className="material-symbols-outlined">quick_reference_all</i>
            </button>

            {row.original.ref_request_status_code === "71" && (
              <button
                className="btn btn-icon btn-tertiary bg-transparent shadow-none border-none tooltip tooltip-left"
                data-tip="ดูรายละเอียดการตีกลับ"
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  router.push(
                    "/administrator/vehicle-in-use/" +
                      row.original.trn_request_uid+ "?active-tab=การคืนยานพาหนะ"
                  )
                }
                }
              >
                <i className="material-symbols-outlined">source_notes</i>
              </button>
            )}

            {row.original.ref_request_status_code === "70" && (
              <button
                className="btn btn-icon btn-tertiary bg-transparent shadow-none border-none tooltip tooltip-left"
                data-tip="ตรวจสอบการคืนยานพาหนะ"
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  router.push(
                    "/administrator/vehicle-in-use/" +
                      row.original.trn_request_uid + "?active-tab=การคืนยานพาหนะ"
                  )
                }
                 
                }
              >
                <i className="material-symbols-outlined">overview</i>
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
          <DataTable
            table={table}
            onRowClick={(row) => {
              const uid = row.trn_request_uid;
              router.push(`/administrator/vehicle-in-use/${uid}`);
            }}
          />
        </>
      )}
    </div>
  );
}
