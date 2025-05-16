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

interface PaginationType {
  limit: number;
  page: number;
  total: number;
  totalPages: number;
}

interface Props {
  defaultData: any[];
  pagination: PaginationType;
}

export default function CarpoolApproverTable({
  defaultData,
  pagination,
}: Props) {
  const [isLoading, setIsLoading] = useState(true);
  const [sorting, setSorting] = useState<SortingState>([]);

  const [paginationState, setPagination] = useState<PaginationState>({
    pageIndex: pagination.page - 1,
    pageSize: pagination.limit,
  });

  const columns: ColumnDef<any>[] = [
    {
      accessorKey: "carpool_name",
      header: () => <div className="text-center">ชื่อ - นามสกุล</div>,
      enableSorting: true,
      cell: ({ row }) => (
        <div className="text-left font-semibold" data-name="ชื่อ - นามสกุล">
          {row.original.carpool_name}
        </div>
      ),
    },
    {
      accessorKey: "carpool_dept_sap",
      header: () => <div className="text-center">ตำแหน่ง / สังกัด</div>,
      enableSorting: false,
      // cell: ({ row }) => (
      //   <div className="text-left" data-name="สถานที่จอดรถ">
      //     <div className="flex flex-col">
      //       {" "}
      //       <div className="text-left">{row.original.parking_place}</div>
      //     </div>
      //   </div>
      // ),
    },
    {
      accessorKey: "carpool_contact_place",
      header: () => <div className="text-left">เบอร์ภายใน</div>,
      enableSorting: false,
      // cell: ({ row }) => (
      //   <div className="text-left" data-name="ผู้ใช้ยานพาหนะ">
      //     <div className="flex flex-col">
      //       <div>{row.original.vehicle_user_emp_name}</div>
      //       <div className="text-color-secondary text-xs">
      //         {row.original.vehicle_user_dept_sap_short}
      //       </div>
      //     </div>
      //   </div>
      // ),
    },
    {
      accessorKey: "carpool_contact_number",
      header: () => (
        <div className="relative flex items-center justify-center text-center">
          <div className="text-center">เบอร์โทรศัพท์</div>
        </div>
      ),
      enableSorting: false,
      // cell: ({ row }) => (
      //   <div className="text-left" data-name="เลขที่คำขอ">
      //     <div className="flex flex-col">
      //       <div>{row.original.request_no}</div>
      //       <div className="text-left">
      //         {row.original.is_have_sub_request === "1" &&
      //           "ปฏิบัติงานต่อเนื่อง"}
      //       </div>
      //     </div>
      //   </div>
      // ),
    },
    {
      accessorKey: "number_of_vehicles",
      header: () => <div className="text-center">ประเภทผู้อนุมัติ</div>,
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
      accessorKey: "action",
      header: () => <div className="text-center"></div>,
      enableSorting: false,
      cell: ({ row }) => {
        return (
          <div className="text-left dataTable-action">
            <button
              className="btn btn-icon btn-tertiary bg-transparent shadow-none border-none tooltip tooltip-left"
              data-tip="ดูรายละเอียด"
              //   onClick={() => router.push("/carpool-management")}
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
