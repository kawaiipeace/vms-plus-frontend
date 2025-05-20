"use client";

import React, { useState, useEffect, HTMLProps } from "react";
import { DataTable } from "@/components/table/dataTable";
import {
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  PaginationState,
  SortingState,
  useReactTable,
  ColumnDef,
} from "@tanstack/react-table";
import { RequestListType } from "@/app/types/request-list-type";
import Image from "next/image";
import dayjs from "dayjs";
import ToggleSwitch from "@/components/toggleSwitch";
import { useRouter } from "next/navigation";

interface DriverListTableProps {
  approved_job_driver_end_date?: string;
  driver_average_satisfaction_score?: number;
  driver_contact_number?: string;
  driver_dept_sap_short_name_work?: string;
  driver_dept_sap_work?: string;
  driver_id?: string;
  driver_image?: string;
  driver_license_end_date?: string;
  driver_name?: string;
  driver_nickname?: string;
  driver_uid?: string;
  driver_status?: {
    ref_driver_status_code?: number;
    ref_driver_status_desc?: string;
  };
  driver_total_satisfaction_review?: number;
  is_active?: number;
  mas_driver_uid?: string;
  work_type?: number;
}

interface PaginationType {
  limit: number;
  page: number;
  total: number;
  totalPages: number;
}

interface Props {
  defaultData: DriverListTableProps[];
  pagination: PaginationType;
  driverActiveModalRef?: React.RefObject<{
    openModal: () => void;
    closeModal: () => void;
  }>;
  handleToggleChange?: (driverId: string) => void;
  onUpdateStatusDriver?: (driverId: string, isActive: string) => void;
  handleDeleteDriver?: (driverName: string, driverUid: string) => void;
  handleUpdateSelectedRow?: (selectedRow: Record<string, string | undefined>) => void;
}

function IndeterminateCheckbox({
  indeterminate,
  className = "",
  ...rest
}: { indeterminate?: boolean } & HTMLProps<HTMLInputElement>) {
  const ref = React.useRef<HTMLInputElement>(null!);

  React.useEffect(() => {
    if (typeof indeterminate === "boolean") {
      ref.current.indeterminate = !rest.checked && indeterminate;
    }
  }, [ref, indeterminate, rest.checked]);

  return (
    <div className="flex items-center justify-center">
      <input type="checkbox" ref={ref} className={className + " cursor-pointer"} {...rest} />
    </div>
  );
}

const DriverListTable = ({
  defaultData,
  pagination,
  driverActiveModalRef,
  handleToggleChange,
  onUpdateStatusDriver,
  handleDeleteDriver,
  handleUpdateSelectedRow,
}: Props) => {
  const router = useRouter();
  const [sorting, setSorting] = useState<SortingState>([]);
  const [paginationState, setPagination] = useState<PaginationState>({
    pageIndex: pagination.page - 1, // Adjusting page index as React Table uses 0-based indexing
    pageSize: pagination.limit,
  });
  const [reqData, setReqData] = useState<RequestListType[]>(defaultData);
  // console.log("reqData", reqData);
  const driverListColumns: ColumnDef<DriverListTableProps>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <div className="w-full">
          <IndeterminateCheckbox
            {...{
              checked: table.getIsAllRowsSelected(),
              indeterminate: table.getIsSomeRowsSelected(),
              onChange: table.getToggleAllRowsSelectedHandler(),
            }}
          />
        </div>
      ),
      cell: ({ row }) => (
        <div className="px-1">
          <IndeterminateCheckbox
            {...{
              checked: row.getIsSelected(),
              disabled: !row.getCanSelect(),
              indeterminate: row.getIsSomeSelected(),
              onChange: row.getToggleSelectedHandler(),
            }}
          />
        </div>
      ),
    },
    {
      accessorKey: "driver_name",
      header: () => (
        <div className="relative flex items-center justify-center text-center w-full">
          <div className="text-center">ชื่อ - นามสกุล</div>
        </div>
      ),
      enableSorting: true,
      cell: ({ getValue }) => (
        <div className="text-left" data-name="ชื่อ - นามสกุล">
          <div className="text-left">{getValue() as string}</div>
        </div>
      ),
    },
    {
      accessorKey: "driver_dept_sap_short_name_work",
      header: "หน่วยงานสังกัด",
      cell: ({ getValue }) => (
        <div className="text-left" data-name="หน่วยงานสังกัด">
          <div className="text-center">{getValue() as string}</div>
        </div>
      ),
    },
    {
      accessorKey: "driver_contact_number",
      header: "เบอร์โทรศัพท์",
      cell: ({ getValue }) => (
        <div className="text-left" data-name="เบอร์โทรศัพท์">
          <div className="text-center">{getValue() as string}</div>
        </div>
      ),
    },
    {
      accessorKey: "work_type",
      header: "ค้างคืน",
      cell: ({ getValue }) => {
        const workType = getValue() as number;
        return (
          <div className="text-left" data-name="ค้างคืน">
            <div className="flex items-center justify-center">
              {workType === 1 ? (
                <Image src="/assets/img/graphic/right_icon.svg" alt="right" width={20} height={20} />
              ) : (
                <Image src="/assets/img/graphic/close_icon_red.svg" alt="close" width={20} height={20} />
              )}
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "driver_license_end_date",
      header: () => (
        <div className="relative flex items-center justify-center text-center w-full">
          <div className="text-center">วันที่ใบขับขี่หมดอายุ</div>
        </div>
      ),
      cell: ({ row }) => {
        const date = (row.original as DriverListTableProps).driver_license_end_date;
        const formattedDate = date ? dayjs(date).format("DD/MM/YYYY") : "ไม่ระบุ";
        return (
          <div className="text-left" data-name="วันที่ใบขับขี่หมดอายุ">
            <div className="text-center">{formattedDate}</div>
          </div>
        );
      },
      enableSorting: true,
    },
    {
      accessorKey: "approved_job_driver_end_date",
      header: () => (
        <div className="relative flex items-center justify-center text-center w-full">
          <div className="text-center">วันที่สิ้นสุดปฏิบัติงาน</div>
        </div>
      ),
      cell: ({ row }) => {
        const date = (row.original as DriverListTableProps).approved_job_driver_end_date;
        const formattedDate = date ? dayjs(date).format("DD/MM/YYYY") : "ไม่ระบุ";
        return (
          <div className="text-left" data-name="วันที่สิ้นสุดปฏิบัติงาน">
            <div className="text-center">{formattedDate}</div>
          </div>
        );
      },
      enableSorting: true,
    },
    {
      accessorKey: "driver_average_satisfaction_score",
      header: "คะแนน",
      cell: ({ getValue }) => (
        <div className="text-left" data-name="คะแนน">
          <div className="text-center">{getValue() as string}</div>
        </div>
      ),
      enableSorting: true,
    },
    {
      accessorKey: "driver_status.ref_driver_status_desc",
      header: () => (
        <div className="relative flex items-center justify-center text-center w-full">
          <div className="text-center">สถานะ</div>
        </div>
      ),
      cell: ({ row }) => {
        const status = (row.original as DriverListTableProps).driver_status?.ref_driver_status_desc;
        return (
          <div className="text-left" data-name="สถานะ">
            <div className="text-center">
              {status === "ปฏิบัติงานปกติ" ? (
                <div className="badge badge-pill-outline badge-success whitespace-nowrap">{status}</div>
              ) : status === "ลา (ป่วย/กิจ)" ? (
                <div className="badge badge-pill-outline badge-warning whitespace-nowrap">{status}</div>
              ) : status === "หมดสัญญาจ้าง" ? (
                <div className="badge badge-pill-outline badge-gray whitespace-nowrap">{status}</div>
              ) : status === "ลาออก" ? (
                <div className="badge badge-pill-outline badge-error whitespace-nowrap">{status}</div>
              ) : status === "สำรอง" ? (
                <div className="badge badge-pill-outline badge-info whitespace-nowrap">{status}</div>
              ) : status === "ให้ออก(BackList)" ? (
                <div className="badge badge-pill-outline badge-gray whitespace-nowrap">{status}</div>
              ) : (
                <div className="badge badge-pill-outline badge-success whitespace-nowrap">{status}</div>
              )}
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "is_active",
      header: "เปิด/ปิดใช้งาน",
      cell: ({ row }) => {
        return (
          <div className="text-left" data-name="เปิด/ปิดใช้งาน">
            <div className="flex items-center justify-center">
              <ToggleSwitch
                isActive={(row.original as DriverListTableProps).is_active ?? 0}
                driverActiveModalRef={
                  driverActiveModalRef as React.RefObject<{ openModal: () => void; closeModal: () => void }>
                }
                driverId={(row.original as DriverListTableProps).mas_driver_uid ?? ""}
                handleToggleChange={handleToggleChange}
                onUpdateStatusDriver={onUpdateStatusDriver}
              />
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "action",
      header: () => (
        <div>
          <div className="text-center">&nbsp;</div>
        </div>
      ),
      cell: ({ row }) => {
        return (
          <>
            <div className="text-left dataTable-action">
              <button
                className="btn btn-icon btn-tertiary bg-transparent shadow-none border-none tooltip tooltip-top"
                data-tip="ดูรายละเอียด"
                onClick={() => {
                  router.push(
                    `/drivers-management/view/${(row.original as DriverListTableProps).mas_driver_uid}?active=${
                      (row.original as DriverListTableProps).is_active
                    }`
                  );
                }}
              >
                <i className="material-symbols-outlined">quick_reference_all</i>
              </button>
              <button
                className="btn btn-icon btn-tertiary bg-transparent shadow-none border-none tooltip tooltip-top"
                data-tip="ลบ"
                onClick={() =>
                  handleDeleteDriver &&
                  handleDeleteDriver(
                    (row.original as DriverListTableProps).driver_name ?? "",
                    (row.original as DriverListTableProps).mas_driver_uid ?? ""
                  )
                }
              >
                <i className="material-symbols-outlined">delete</i>
              </button>
            </div>
          </>
        );
      },
    },
  ];

  const tables = useReactTable({
    data: reqData,
    columns: driverListColumns,
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
    initialState: {
      columnOrder: ["age", "firstName", "lastName"], //customize the initial column order
      columnVisibility: {
        id: false, //hide the id column by default
      },
      expanded: true, //expand all rows by default
      sorting: [
        {
          id: "age",
          desc: true, //sort by age in descending order by default
        },
      ],
    },
  });

  useEffect(() => {
    setReqData(defaultData);
  }, [defaultData]);

  useEffect(() => {
    setPagination({
      pageIndex: pagination.page - 1,
      pageSize: pagination.limit,
    });
  }, [pagination.page, pagination.limit]);

  useEffect(() => {
    if (handleUpdateSelectedRow) {
      handleUpdateSelectedRow(getSelectedRowValues());
    }
  }, [tables.getState().rowSelection]);

  const getSelectedRowValues = () => {
    const selection = tables.getState().rowSelection;
    const selected: Record<string, string | undefined> = {};
    Object.keys(selection).forEach((rowId) => {
      const row = tables.getRow(rowId);
      // สมมติว่าต้องการ mas_driver_uid
      selected[rowId] = (row.original as DriverListTableProps).mas_driver_uid;
    });
    return selected;
  };
  // console.log(JSON.stringify(getSelectedRowValues(), null, 2));

  return (
    <>
      <DataTable table={tables} style={`md:w-[1600px] w-full`} />
    </>
  );
};

export default DriverListTable;
