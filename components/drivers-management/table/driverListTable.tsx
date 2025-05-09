"use client";

import React, { useState, useEffect } from "react";
import { DataTable } from "@/components/table/dataTable";
import {
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  PaginationState,
  SortingState,
  useReactTable,
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
}
const DriverListTable = ({
  defaultData,
  pagination,
  driverActiveModalRef,
  handleToggleChange,
  onUpdateStatusDriver,
}: Props) => {
  const router = useRouter();
  const [sorting, setSorting] = useState<SortingState>([]);
  const [paginationState, setPagination] = useState<PaginationState>({
    pageIndex: pagination.page - 1, // Adjusting page index as React Table uses 0-based indexing
    pageSize: pagination.limit,
  });
  const [reqData, setReqData] = useState<RequestListType[]>(defaultData);
  const tables = useReactTable({
    data: reqData,
    columns: [
      {
        accessorKey: "driver_name",
        header: () => (
          <div className="relative flex items-center justify-center text-center w-full">
            <div className="text-center">ชื่อ - นามสกุล</div>
          </div>
        ),
        enableSorting: true,
        cell: ({ getValue }) => <div className="text-left">{getValue() as string}</div>,
      },
      {
        accessorKey: "driver_dept_sap_short_name_work",
        header: "หน่วยงานสังกัด",
        cell: ({ getValue }) => <div className="text-center">{getValue() as string}</div>,
      },
      {
        accessorKey: "driver_contact_number",
        header: "เบอร์โทรศัพท์",
      },
      {
        accessorKey: "work_type",
        header: "ค้างคืน",
        cell: ({ getValue }) => {
          const workType = getValue() as number;
          return (
            <div className="flex items-center justify-center">
              {workType === 1 ? (
                <Image src="/assets/img/graphic/right_icon.svg" alt="right" width={20} height={20} />
              ) : (
                <Image src="/assets/img/graphic/close_icon_red.svg" alt="close" width={20} height={20} />
              )}
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
          return <div className="text-center">{formattedDate}</div>;
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
          return <div className="text-center">{formattedDate}</div>;
        },
        enableSorting: true,
      },
      {
        accessorKey: "driver_average_satisfaction_score",
        header: "คะแนน",
        cell: ({ getValue }) => <div className="text-center">{getValue() as string}</div>,
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
            <div className="w-[80px] text-center">
              {status === "ปฏิบัติงานปกติ" ? (
                <div className="badge badge-pill-outline badge-success whitespace-nowrap">{status}</div>
              ) : status === "ลาป่วย/ลากิจ" ? (
                <div className="badge badge-pill-outline badge-warning whitespace-nowrap">{status}</div>
              ) : status === "สิ้นสุดสัญญา" ? (
                <div className="badge badge-pill-outline badge-gray whitespace-nowrap">{status}</div>
              ) : status === "ลาออก" ? (
                <div className="badge badge-pill-outline badge-error whitespace-nowrap">{status}</div>
              ) : status === "สำรอง" ? (
                <div className="badge badge-pill-outline badge-info whitespace-nowrap">{status}</div>
              ) : status === "ให้ออก" ? (
                <div className="badge badge-pill-outline badge-gray whitespace-nowrap">{status}</div>
              ) : (
                <div className="badge badge-pill-outline badge-success whitespace-nowrap">{status}</div>
              )}
            </div>
          );
        },
      },
      {
        accessorKey: "is_active",
        header: "เปิด/ปิดใช้งาน",
        cell: ({ row }) => {
          return (
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
              <button
                className="btn btn-icon btn-tertiary bg-transparent shadow-none border-none tooltip tooltip-top"
                data-tip="ดูรายละเอียด"
                onClick={() => {
                  router.push(`/drivers-management/view/${(row.original as DriverListTableProps).mas_driver_uid}`);
                }}
              >
                <i className="material-symbols-outlined">quick_reference_all</i>
              </button>
              <button
                className="btn btn-icon btn-tertiary bg-transparent shadow-none border-none tooltip tooltip-top"
                data-tip="ลบ"
              >
                <i className="material-symbols-outlined">delete</i>
              </button>
            </>
          );
        },
      },
    ],
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
    setReqData(defaultData);
  }, [defaultData]);

  useEffect(() => {
    setPagination({
      pageIndex: pagination.page - 1,
      pageSize: pagination.limit,
    });
  }, [pagination.page, pagination.limit]);

  return (
    <>
      <DataTable table={tables} style={`w-[1600px]`} />
    </>
  );
};

export default DriverListTable;
