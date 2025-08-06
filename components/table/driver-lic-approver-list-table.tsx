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
import { DriverLicListType } from "@/app/types/driver-lic-list-type";

interface PaginationType {
  limit: number;
  page: number;
  total: number;
  totalPages: number;
}

interface Props {
  defaultData: DriverLicListType[];
  pagination: PaginationType;
}

export default function DriverLicApproverListTable({
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


  useEffect(() => {

  }, [defaultData]);

  useEffect(() => {
    setPagination({
      pageIndex: pagination.page - 1,
      pageSize: pagination.limit,
    });
  }, [pagination.page, pagination.limit]);


  const requestListColumns: ColumnDef<DriverLicListType>[] = [
    {
      accessorKey: "request_annual_driver_no",
      header: () => (
        <div className="relative flex items-center justify-center text-center">
          <div className="text-center">เลขที่คำขอ</div>
        </div>
      ),
      enableSorting: true,
      cell: ({ row }) => (
        <div className="text-left" data-name="เลขที่คำขอ">
          <div className="flex flex-col">
            <div>{row.original.request_annual_driver_no}</div>
          </div>
        </div>
      ),
    },
    {
      accessorKey: "created_request_emp_name",
      header: () => <div className="text-left">ผู้ขออนุมัติ</div>,
      enableSorting: false,
      cell: ({ row }) => (
        <div className="text-left" data-name="ผู้ขออนุมัติ">
          <div className="flex flex-col">
            <div>{row.original.created_request_emp_name}</div>
            <div className="text-color-secondary text-xs">
              {row.original.created_request_emp_position + " " + row.original.created_request_dept_sap_name_short}
            </div>
          </div>
        </div>
      ),
    },
    {
      accessorKey: "ref_driver_license_type_name",
      header: () => <div className="text-center">ประเภทการขับขี่</div>,
      enableSorting: false,
      cell: ({ getValue }) => (
        <div className="text-left" data-name="ประเภทการขับขี่">
          {getValue() as string}
        </div>
      ),
    },
    {
      accessorKey: "annual_yyyy",
      header: () => <div className="text-center">ประจำปี</div>,
      enableSorting: false,
      cell: ({ getValue }) => (
        <div className="text-left" data-name="ประจำปี">
          {getValue() as string}
        </div>
      ),
    },
    {
      accessorKey: "created_request_datetime",
      header: () => <div className="text-center">วันที่สร้างคำขอ</div>,
      enableSorting: true,
      cell: ({ row }) => {
        const startDateTime = convertToBuddhistDateTime(
          row.original.created_request_datetime || ""
        ).date;
        return (
          <div className="text-left" data-name="วันที่สร้างคำขอ">
            {startDateTime}
          </div>
        );
      },
    },
    {
      accessorKey: "driver_license_expire_date",
      header: () => (
        <div className="text-center">วันที่สิ้นอายุใบอนุญาตขับขี่</div>
      ),
      enableSorting: true,
      cell: ({ row }) => {
        const startDateTime = convertToBuddhistDateTime(
          row.original.driver_license_expire_date || ""
        );
        return (
          <div className="text-left" data-name="วันที่สิ้นอายุใบอนุญาตขับขี่">
            {startDateTime.date}
          </div>
        );
      },
    },
    {
      accessorKey: "ref_request_annual_driver_status_name",
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
            ) : value === "ตีกลับคำขอ" ? (
              <span className="badge badge-pill-outline badge-warning whitespace-nowrap">
                  {value as React.ReactNode}
              </span>
            ) : value === "ยกเลิกคำขอ" ? (
              <span className="badge badge-pill-outline badge-gray whitespace-nowrap">
                {value as React.ReactNode}
              </span>
            ) : value === "อนุมัติ" ? (
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
        const statusValue = row.original.ref_driver_license_type_name;
        return (
          <div className="text-left dataTable-action">
            {statusValue == "รออนุมัติ" ? (
              <button
                className="btn btn-icon btn-tertiary bg-transparent shadow-none border-none tooltip tooltip-left"
                data-tip="รออนุมัติ"
                onClick={() =>
                  router.push(
                    "/administrator/driver-license-confirmer/" +
                      row.original.trn_request_annual_driver_uid
                  )
                }
              >
                <i className="material-symbols-outlined">stylus</i>
              </button>
            ) : (
              <button
                className="btn btn-icon btn-tertiary bg-transparent shadow-none border-none tooltip tooltip-left"
                data-tip="ดูรายละเอียดคำขอ"
                onClick={() =>
                  router.push("/administrator/driver-license-approver/" + row.original.trn_request_annual_driver_uid)
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
          <DataTable table={table} />
        </>
      )}
    </div>
  );
}
