import { LogType } from "@/app/types/log-type";
import { DataTable } from "@/components/table/dataTable";
import { convertToBuddhistDateTime } from "@/utils/converToBuddhistDateTime";
import {
  ColumnDef,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  PaginationState,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";
import { useRouter } from "next/navigation";
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
  const [sorting, setSorting] = useState<SortingState>([]);
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [reqData, setReqData] = useState<LogType[]>(defaultData);

  // Set pagination from props
  const [paginationState, setPagination] = useState<PaginationState>({
    pageIndex: pagination.page - 1, // Adjusting page index as React Table uses 0-based indexing
    pageSize: pagination.limit,
  });

  useEffect(() => {
    setReqData(defaultData);
    console.log("defaultdata", defaultData);
  }, [defaultData]);

  useEffect(() => {
    setPagination({
      pageIndex: pagination.page - 1,
      pageSize: pagination.limit,
    });
  }, [pagination.page, pagination.limit]);

  const requestListColumns: ColumnDef<LogType>[] = [
    {
      accessorKey: "created_at",
      header: () => (
        <div className="relative flex items-center justify-center text-center">
          <div className="text-center">วันที่ / เวลา</div>
        </div>
      ),
      enableSorting: true,
      cell: ({ row }) => {
        const startDateTime = convertToBuddhistDateTime(row.original.created_at);
        return <div className="text-left">{startDateTime.date + " " + startDateTime.time}</div>;
      },
    },
    {
      accessorKey: "created_by_emp",
      header: () => <div className="text-left">ผู้ดำเนินการ</div>,
      enableSorting: false,
      cell: ({ row }) => <div className="text-left">{row.original.created_by_emp.emp_name}</div>,
    },
    {
      accessorKey: "debt_sap",
      header: () => <div className="text-center">ตำแหน่่ง/สังกัด</div>,
      enableSorting: false,
      cell: ({ row }) => <div className="text-left">{row.original.created_by_emp.dept_sap}</div>,
    },
    {
      accessorKey: "status",
      header: () => <div className="text-center">รายละเอียด</div>,
      enableSorting: false,
      cell: ({ row }) => <div className="text-left">{row.original.status.ref_request_status_desc}</div>,
    },
    {
      accessorKey: "log_remark",
      header: () => <div className="text-center">หมายเหตุ</div>,
      enableSorting: false,
      cell: ({ getValue }) => <div className="text-left">{getValue() as string}</div>,
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
