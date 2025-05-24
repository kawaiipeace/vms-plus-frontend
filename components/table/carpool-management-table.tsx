import { useEffect, useState } from "react";
import { DataTable } from "./dataTable";
import {
  ColumnDef,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  PaginationState,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";
import { Carpool } from "@/app/types/carpool-management-type";
import { useRouter } from "next/navigation";

interface PaginationType {
  limit: number;
  page: number;
  total: number;
  totalPages: number;
}

interface Props {
  defaultData: Carpool[];
  pagination: PaginationType;
}

export default function CarpoolManagementTable({
  defaultData,
  pagination,
}: Props) {
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(true);
  const [sorting, setSorting] = useState<SortingState>([]);

  const [paginationState, setPagination] = useState<PaginationState>({
    pageIndex: pagination.page - 1,
    pageSize: pagination.limit,
  });

  const columns: ColumnDef<Carpool>[] = [
    {
      accessorKey: "carpool_name",
      header: () => <div className="text-center">ชื่อกลุ่มยานพาหนะ</div>,
      enableSorting: true,
      cell: ({ row }) => (
        <div className="text-left font-semibold" data-name="ชื่อกลุ่มยานพาหนะ">
          {row.original.carpool_name}
        </div>
      ),
    },
    {
      accessorKey: "carpool_authorized_depts",
      header: () => <div className="text-center">หน่วยงานที่ใช้บริการ</div>,
      enableSorting: false,
    },
    {
      accessorKey: "carpool_admin_emp_name",
      header: () => <div className="text-left">ผู้รับผิดชอบหลัก</div>,
      enableSorting: false,
      cell: ({ row }) => {
        return (
          <div className="text-left" data-name="ผู้รับผิดชอบหลัก">
            <div>{row.original.carpool_admin_emp_name}</div>
            <div className="text-xs text-[#475467]">
              {row.original.carpool_admin_dept_sap}
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "carpool_contact_number",
      header: () => (
        <div className="relative flex items-center justify-center text-center">
          <div className="text-center">เบอร์ติดต่อ</div>
        </div>
      ),
      enableSorting: false,
    },
    {
      accessorKey: "number_of_vehicles",
      header: () => <div className="text-center">จำนวนยานพาหนะ</div>,
      enableSorting: true,
      cell: ({ row }) => {
        return (
          <div className="text-left" data-name="จำนวนยานพาหนะ">
            {row.original.number_of_vehicles} คัน
          </div>
        );
      },
    },
    {
      accessorKey: "number_of_drivers",
      header: () => (
        <div className="text-center" data-name="จำนวน พขร.">
          จำนวน พขร.
        </div>
      ),
      enableSorting: true,
      cell: ({ row }) => {
        return (
          <div className="text-left">{row.original.number_of_drivers} คน</div>
        );
      },
    },
    {
      accessorKey: "carpool_status",
      header: () => <div className="text-center">สถานะ</div>,
      enableSorting: false,
      cell: ({ row }) => {
        return (
          <div className="w-28" data-name="สถานะ">
            {row.original.carpool_status === "เปิด" ? (
              <div className="w-fit flex items-center gap-[6px] px-2 py-[3px] border border-primary-grayBorder rounded">
                <div className="w-[6px] h-[6px] rounded-full bg-success" />
                <span>เปิด</span>
              </div>
            ) : row.original.carpool_status === "ปิด" ? (
              <div className="w-fit flex items-center gap-[6px] px-2 py-[3px] border border-primary-grayBorder rounded">
                <div className="w-[6px] h-[6px] rounded-full bg-icon-error" />
                <span>ปิด</span>
              </div>
            ) : (
              <div className="w-fit flex items-center gap-[6px] px-2 py-[3px] border border-primary-grayBorder rounded">
                <div className="w-[6px] h-[6px] rounded-full bg-[#667085]" />
                <span>ไม่พร้อมใช้งาน</span>
              </div>
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
              data-tip="ดูรายละเอียด"
              onClick={() =>
                router.push(
                  "/carpool-management/form/process-one?id=" +
                    row.original.mas_carpool_uid +
                    "&name=" +
                    row.original.carpool_name +
                    "&active=" +
                    row.original.is_active
                )
              }
            >
              <i className="material-symbols-outlined">quick_reference_all</i>
            </button>
          </div>
        );
      },
    },
  ];

  const table = useReactTable({
    data: defaultData,
    columns: columns,
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
