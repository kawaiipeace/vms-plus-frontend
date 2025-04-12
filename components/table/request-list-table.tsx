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

export default function RequestListTable({ defaultData, pagination }: Props) {
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
      cell: ({ getValue }) => (
        <div className="text-center">{getValue() as string}</div>
      ),
    },
    {
      accessorKey: "vehicle_user_emp_name",
      header: () => <div className="text-left">ผู้ใช้ยานพาหนะ</div>,
      enableSorting: false,
      cell: ({ row }) => (
        <div className="text-left">
          {row.original.vehicle_user_emp_name} <br />
          <span>{row.original.vehicle_user_dept_sap ?? ""}</span>
        </div>
      ),
    },
    {
      accessorKey: "vehicle_license_plate",
      header: () => <div className="text-center">ยานพาหนะ</div>,
      enableSorting: false,
      cell: ({ getValue }) => (
        <div className="text-center">{getValue() as string}</div>
      ),
    },
    {
      accessorKey: "work_place",
      header: () => <div className="text-center">สถานที่ปฏิบัติงาน</div>,
      enableSorting: false,
      cell: ({ getValue }) => (
        <div className="text-center">{getValue() as string}</div>
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
          <div className="text-left">
            {startDateTime.date + " " + startDateTime.time} -{" "}
            {endDateTime.date + " " + endDateTime.time}
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
          <div className="w-[80px] text-center">
            {value === "เกินวันที่นัดหมาย" || value === "ถูกตีกลับ" ? (
              <span className="badge badge-pill-outline badge-error whitespace-nowrap">
                {value as React.ReactNode}
              </span>
            ) : value === "ตีกลับคำขอ" ? (
              <span className="badge badge-pill-outline badge-warning whitespace-nowrap">
                {value as React.ReactNode}
              </span>
            ) : value === "ยกเลิกคำขอ" ? (
              <span className="badge badge-pill-outline badge-gray !border-gray-200 !bg-gray-50 whitespace-nowrap">
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
          <div className="text-left">
            {statusValue == "รออนุมัติ" && (
              <button
                className="btn btn-icon btn-tertiary bg-transparent shadow-none border-none tooltip tooltip-left"
                data-tip="ดูรายละเอียดคำขอ"
                onClick={() =>
                  router.push(
                    "/vehicle-booking/request-list/" +
                      row.original.trn_request_uid
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
                    "/vehicle-booking/request-list/" +
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
