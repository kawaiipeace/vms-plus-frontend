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
import ReceiveCarVehicleModal from "@/components/modal/receiveCarVehicleModal";
import Link from "next/link";
import ReturnCarAddModal from "../modal/returnCarAddModal";

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

export default function AdminVehiclePickupTable({
  defaultData,
  pagination,
}: Props) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  const receiveCarVehicleModalRef = useRef<{
    openModal: () => void;
    closeModal: () => void;
  } | null>(null);

  const returnVehicleModalRef = useRef<{
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
      accessorKey: "vehicle_user_emp_name",
      header: () => <div className="text-left">ผู้ใช้ยานพาหนะ</div>,
      enableSorting: false,
      cell: ({ row }) => (
        <div className="text-left" data-name="ผู้ใช้ยานพาหนะ">
            <div className="flex flex-col">
            <div>{row.original.vehicle_user_emp_name} ({row.original.vehicle_user_emp_id})</div>
             <div className="text-color-secondary text-xs">
              {row.original.vehicle_user_position + " " + row.original.vehicle_user_dept_name_short}
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
            {" "}
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
      accessorKey: "work_place",
      header: () => <div className="text-center">สถานที่ปฏิบัติงาน</div>,
      enableSorting: false,
      cell: ({ getValue }) => (
        <div className="text-left" data-name="สถานที่ปฏิบัติงาน">
          {getValue() as string}
        </div>
      ),
    },
    {
      accessorKey: "start_datetime",
      header: () => <div className="text-center">วันที่เดินทาง</div>,
      enableSorting: true,
      cell: ({ row }) => {
        const startDateTime = convertToBuddhistDateTime(
          row.original.start_datetime || ""
        );
        const endDateTime = convertToBuddhistDateTime(
          row.original.end_datetime || ""
        );
        const isSameDate = startDateTime.date === endDateTime.date;
        return (
          <div className="text-left" data-name="วันที่เดินทาง">
            <div className="flex flex-col">
            <div>
                {isSameDate ? (
                  <>
                    {startDateTime.date} 
                  </>
                ) : (
                  <>
                    {startDateTime.date} - {" "}
                    {endDateTime.date} 
                  </>
                )}
              </div>
              <div className="text-color-secondary text-xs">
                {" "}
                {endDateTime.time + " - " + startDateTime.time} (
                {row.original.trip_type_name})
              </div>
            </div>
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
          <div className="w-[80px] text-center" data-name="สถานะคำขอ">
            {value === "รับยานพาหนะล่าช้า" ? (
              <span className="badge badge-pill-outline badge-error whitespace-nowrap">
                {value as React.ReactNode}
              </span>
            ) : value === "รับยานพาหนะ" ? (
              <span className="badge badge-pill-outline badge-warning whitespace-nowrap">
                {value as React.ReactNode}
              </span>
            ) : value === "ยกเลิกคำขอ" ? (
              <span className="badge badge-pill-outline badge-gray whitespace-nowrap">
                {value as React.ReactNode}
              </span>
            ) : value === "อนุมัติแล้ว" ? (
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
        const statusValue = row.original.ref_request_status_name;
        return (
          <div className="text-left dataTable-action flex items-center">
            <button
              className="btn btn-icon btn-tertiary bg-transparent shadow-none border-none tooltip tooltip-left"
              data-tip="ดูรายละเอียดคำขอ"
              onClick={() =>
                router.push(
                  "/administrator/vehicle-in-use/" +
                    row.original.trn_request_uid
                )
              }
            >
              <i className="material-symbols-outlined">quick_reference_all</i>
            </button>

            {(row.original.ref_request_status_code === "60" ||
              row.original.ref_request_status_code === "60e") && (
              <div className="dropdown dropdown-left dropdown-end">
                <div
                  className="btn btn-icon btn-tertiary bg-transparent shadow-none border-none"
                  tabIndex={0}
                  role="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                >
                  <i className="material-symbols-outlined icon-settings-fill-300-24">
                    more_vert
                  </i>
                </div>

                <ul
                  className="dropdown-menu dropdown-content absolute top-auto bottom-full z-[9999] max-w-[200px] w-[200px]"
                  tabIndex={0}
                >
                  <Link
                    className="dropdown-item"
                    href={`/administrator/vehicle-in-use/${row.original.trn_request_uid}?active-tab=ข้อมูลการเดินทาง`}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      router.push(
                        `/administrator/vehicle-in-use/${row.original.trn_request_uid}?active-tab=ข้อมูลการเดินทาง`
                      );
                    }}
                  >
                    <i className="material-symbols-outlined">
                      add_location_alt
                    </i>
                    ข้อมูลการเดินทาง
                  </Link>

                  <Link
                    className="dropdown-item"
                    href={`/administrator/vehicle-in-use/${row.original.trn_request_uid}?active-tab=การเติมเชื้อเพลิง`}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      router.push(
                        `/administrator/vehicle-in-use/${row.original.trn_request_uid}?active-tab=การเติมเชื้อเพลิง`
                      );
                    }}
                  >
                    <i className="material-symbols-outlined">
                      local_gas_station
                    </i>
                    การเติมเชื้อเพลิง
                  </Link>
                  {/* <Link className="dropdown-item" href="#">
                      <i className="material-symbols-outlined">id_card</i>
                      แสดงบัตรเดินทาง
                    </Link> */}
                  <hr />
                  <Link
                    className="dropdown-item"
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      returnVehicleModalRef.current?.openModal();
                    }}
                  >
                    <i className="material-symbols-outlined">reply</i>
                    คืนยานพาหนะ
                  </Link>
                </ul>
              </div>
            )}

            {statusValue == "รับยานพาหนะ" && (
              <button
                className="btn btn-icon btn-tertiary bg-transparent shadow-none border-none tooltip tooltip-left"
                data-tip="รับยานพาหนะ"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  receiveCarVehicleModalRef.current?.openModal();
                }}
              >
                <i className="material-symbols-outlined">directions_car</i>
              </button>
            )}
            <ReceiveCarVehicleModal
              requestData={{ trn_request_uid: row.original.trn_request_uid }}
              ref={receiveCarVehicleModalRef}
              role="admin"
            />
            <ReturnCarAddModal
              useBy={"admin"}
              ref={returnVehicleModalRef}
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
