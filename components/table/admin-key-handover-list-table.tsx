"use client";
import React, { useEffect, useRef, useState } from "react";
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
import EditKeyAppointmentModal from "@/components/modal/editKeyAppointmentModal";

interface PaginationType {
  limit: number;
  page: number;
  total: number;
  totalPages: number;
}

interface Props {
  defaultData: RequestListType[];
  pagination: PaginationType;
  onUpdate?: () => void;
}

export default function AdminKeyHandOverListTable({
  defaultData,
  pagination,
  onUpdate
}: Props) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  const editKeyAppointmentModalRef = useRef<{
    openModal: () => void;
    closeModal: () => void;
  } | null>(null);

  // Set pagination from props
  const [paginationState, setPagination] = useState<PaginationState>({
    pageIndex: pagination.page - 1, // Adjusting page index as React Table uses 0-based indexing
    pageSize: pagination.limit,
  });

  const requestListColumns: ColumnDef<RequestListType>[] = [
    {
      accessorKey: "received_key_start_datetime",
      header: () => (
        <div className="relative flex items-center justify-center text-center">
          <div className="text-center">วันที่นัดรับกุญแจ</div>
        </div>
      ),
      enableSorting: true,
      cell: ({ row }) => {
        const startDate = convertToBuddhistDateTime(
          row.original.received_key_start_datetime || ""
        ).date;
        const startTime = convertToBuddhistDateTime(
          row.original.received_key_start_datetime || ""
        ).time;
        const endTime = convertToBuddhistDateTime(
          row.original.received_key_end_datetime || ""
        ).time;

        return (
          <div className="text-left" data-name="วันที่นัดรับกุญแจ">
            <div className="flex flex-col">
              <div>{startDate}</div>
              <div className="text-color-secondary text-xs">
                {startTime} - {endTime}
              </div>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "vehicle_user_emp_name",
      header: () => <div className="text-left">สถานที่รับกุญแจ</div>,
      enableSorting: false,
      cell: ({ row }) => (
        <div className="text-left" data-name="สถานที่รับกุญแจ">
          {row.original.received_key_place}
        </div>
      ),
    },
    {
      accessorKey: "driver",
      header: () => <div className="text-center">ผู้มารับกุญแจ</div>,
      enableSorting: false,
      cell: ({ row }) => (
        <div className="text-left" data-name="ผู้มารับกุญแจ">
          <div className="flex flex-col">
            <div className="text-left">{row.original.driver_name}</div>
            <div className="text-color-secondary text-xs">
              {row.original.driver_dept_name}
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
          <div className="flex flex-col">
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
      accessorKey: "vehicle_department_dept_sap_short",
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
      accessorKey: "start_datetime",
      header: () => <div className="text-center">วันที่เริ่มต้นเดินทาง</div>,
      enableSorting: true,
      cell: ({ row }) => {
        const startDateTime = convertToBuddhistDateTime(
          row.original.start_datetime || ""
        );

        return (
          <div className="text-left" data-name="วันที่เริ่มต้นเดินทาง">
            <div className="flex flex-col">
              <div>{startDateTime.date}</div>
              <div className="text-color-secondary text-xs">
                ({row.original.trip_type_name})
              </div>
            </div>
          </div>
        );
      },
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
      accessorKey: "ref_request_status_name",
      header: () => <div className="text-center">สถานะคำขอ</div>,
      enableSorting: true,
      cell: ({ getValue }) => {
        const value = getValue() as string;
        return (
          <div className="w-[80px] text-center" data-name="สถานะคำขอ">
            {value === "เกินวันที่นัดหมาย" ? (
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
                  "/administrator/vehicle-in-use/" + row.original.trn_request_uid
                )
              }
            >
              <i className="material-symbols-outlined">quick_reference_all</i>
            </button>

            <button
              className="btn btn-icon btn-tertiary bg-transparent shadow-none border-none tooltip tooltip-left"
              data-tip="แก้ไขนัดหมายรับกุญแจ"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                editKeyAppointmentModalRef.current?.openModal();
              }}
            >
              <i className="material-symbols-outlined">edit_calendar</i>
            </button>
            <EditKeyAppointmentModal
              req_id={row.original.trn_request_uid}
              place={row.original.received_key_place}
              date={row.original.received_key_start_datetime}
              start_time={row.original.received_key_start_datetime}
              end_time={row.original.received_key_end_datetime}
              ref={editKeyAppointmentModalRef}
              onUpdate={onUpdate}
            />
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
              const uid = row.trn_request_uid;
                router.push(`/administrator/vehicle-in-use/${uid}`);
            }}
          />
        </>
      )}
    </div>
  );
}
