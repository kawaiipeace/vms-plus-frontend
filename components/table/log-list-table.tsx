import React, { useEffect, useState } from "react";
import { LogType } from "@/app/types/log-type";
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

interface PaginationType {
  limit: number;
  page: number;
  total: number;
  totalPages: number;
}

interface Props {
  defaultData: LogType[];
  pagination: PaginationType;
}

export default function FirstApproverListTable({
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

  const requestListColumns: ColumnDef<LogType>[] = [
    {
      accessorKey: "log_request_action_datetime",
      header: () => (
        <div className="relative flex items-center justify-center text-center">
          <div className="text-center">วันที่ / เวลา</div>
        </div>
      ),
      enableSorting: true,
      cell: ({ row }) => {
        const startDateTime = convertToBuddhistDateTime(
          row.original.log_request_action_datetime
        );
        return (
          <div className="text-left" data-name="วันที่ / เวลา">
          <div className="flex flex-col">
            <div className="text-left">
            {startDateTime.date + " " + startDateTime.time}
            </div>
              {/* <div className="text-color-secondary text-xs">
              {row.original.vehicle_department_dept_sap_short}
            </div> */}
          </div>
        </div>
        );
      },
    },
    {
      accessorKey: "action_by_fullname",
      header: () => <div className="text-left">ผู้ดำเนินการ</div>,
      enableSorting: false,
      cell: ({ row }) => (
        <div className="text-left" data-name="ผู้ดำเนินการ">
        <div className="flex flex-col">
          <div className="text-left">
          {row.original.action_by_fullname}
          </div>
        </div>
      </div>
      ),
    },
    {
      accessorKey: "debt_sap",
      header: () => <div className="text-center">ตำแหน่ง/สังกัด</div>,
      enableSorting: false,
      cell: ({ row }) => (
        <div className="text-left" data-name="ตำแหน่ง/สังกัด">
        <div className="flex flex-col">
          <div className="text-left">
          {row.original.action_by_position +
            " " +
            row.original.action_by_department}
          </div>
        </div>
      </div>
      ),
    },
    {
      accessorKey: "action_detail",
      header: () => <div className="text-center">รายละเอียด</div>,
      enableSorting: false,
      cell: ({ row }) => (
        <div className="text-left" data-name="รายละเอียด">
        <div className="flex flex-col">
        <div className="text-left">{row.original.action_detail}</div>
      </div>
      </div>
      ),
    },
    {
      accessorKey: "remark",
      header: () => <div className="text-center">หมายเหตุ</div>,
      enableSorting: false,
      cell: ({ getValue }) => (
        <div className="text-left" data-name="หมายเหตุ">
          {getValue() as string}
        </div>
      ),
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
          <DataTable table={table} />
        </>
      )}
    </div>
  );
}
