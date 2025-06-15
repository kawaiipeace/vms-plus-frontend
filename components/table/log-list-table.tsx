import { LogType } from "@/app/types/log-type";
import { DataTable } from "@/components/table/dataTable";
import { convertToBuddhistDateTime } from "@/utils/converToBuddhistDateTime";
import {
  ColumnDef,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";
import { useEffect, useState } from "react";

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

export default function LogListTable({ defaultData, pagination }: Props) {
  const [isLoading, setIsLoading] = useState(true);
  const [sorting, setSorting] = useState<SortingState>([]);

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
          <div className="text-left">
            {startDateTime.date + " " + startDateTime.time}
          </div>
        );
      },
    },
    {
      accessorKey: "action_by_fullname",
      header: () => <div className="text-left">ผู้ดำเนินการ</div>,
      enableSorting: false,
      cell: ({ row }) => (
        <div className="text-left">{row.original.action_by_fullname}</div>
      ),
    },
    {
      accessorKey: "debt_sap",
      header: () => <div className="text-center">ตำแหน่ง/สังกัด</div>,
      enableSorting: false,
      cell: ({ row }) => (
        <div className="text-left">
          {row.original.action_by_position +
            "/" +
            row.original.action_by_department}
        </div>
      ),
    },
    {
      accessorKey: "status",
      header: () => <div className="text-center">รายละเอียด</div>,
      enableSorting: false,
      cell: ({ row }) => (
        <div className="text-left">{row.original.action_detail}</div>
      ),
    },
    {
      accessorKey: "remark",
      header: () => <div className="text-center">หมายเหตุ</div>,
      enableSorting: false,
      cell: ({ getValue }) => (
        <div className="text-left">{getValue() as string}</div>
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
    manualPagination: true,
    state: {
      sorting,
      pagination: {
        pageIndex: pagination.page - 1,
        pageSize: pagination.limit,
      },
    },
    defaultColumn: {
      enableSorting: false,
    },
  });

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
