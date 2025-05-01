"use client";
import React, { useEffect, useRef, useState } from "react";
import { DataTable } from "@/components/table/dataTable";
import Image from "next/image";
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
import { TravelData } from "@/data/travelData";
import CancelRequestModal from "../modal/cancelRequestModal";
import RecordTravelAddModal from "../modal/recordTravelAddModal";

interface PaginationType {
  limit: number;
  page: number;
  total: number;
  totalPages: number;
}

interface Props {
  defaultData: TravelData[];
  pagination: PaginationType;
}

export default function TravelListTable({ defaultData, pagination }: Props) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  // Set pagination from props
  const [paginationState, setPagination] = useState<PaginationState>({
    pageIndex: pagination.page - 1, // Adjusting page index as React Table uses 0-based indexing
    pageSize: pagination.limit,
  });

  const cancelRequestModalRef = useRef<{
    openModal: () => void;
    closeModal: () => void;
  } | null>(null);
  const recordTravelAddModalRef = useRef<{
    openModal: () => void;
    closeModal: () => void;
  } | null>(null);

  const requestListColumns: ColumnDef<TravelData>[] = [
    {
      accessorKey: "trip_start_datetime",
      header: () => (
        <div className="relative flex items-center justify-center text-center">
          <div className="text-center">วันที่ / เวลาจากต้นทาง</div>
        </div>
      ),
      enableSorting: true,
      cell: ({ row }) => {
        const tripdate = row.original.trip_start_datetime;
        const convertedDate = convertToBuddhistDateTime(tripdate);
        return (
          <div className="text-left" data-name="วันที่ / เวลาถึงปลายทาง">
            <div className="flex flex-col">
              {convertedDate?.date} - {convertedDate?.time}
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "trip_end_datetime",
      header: () => <div className="text-left">วันที่ / เวลาถึงปลายทาง</div>,
      enableSorting: false,
      cell: ({ row }) => {
        const tripEnd = row.original.trip_end_datetime;
        const convertedDate = convertToBuddhistDateTime(tripEnd);
        return (
          <div className="text-left" data-name="วันที่ / เวลาถึงปลายทาง">
            <div className="flex flex-col">
              {convertedDate?.date} - {convertedDate?.time}
            </div>
          </div>
        );
      },
    },

    {
      accessorKey: "trip_start_miles",
      header: () => <div className="text-center">เลขไมล์ต้นทาง</div>,
      enableSorting: false,
      cell: ({ row }) => (
        <div className="text-left" data-name="เลขไมล์ต้นทาง">
          <div className="flex flex-col">
            {" "}
            <div className="text-left">{row.original.trip_start_miles}</div>
          </div>
        </div>
      ),
    },
    {
      accessorKey: "trip_end_miles",
      header: () => <div className="text-center">เลขไมล์ปลายทาง</div>,
      enableSorting: false,
      cell: ({ row }) => (
        <div className="text-left" data-name="เลขไมล์ปลายทาง">
          <div className="flex flex-col">
            {" "}
            <div className="text-left">{row.original.trip_end_miles}</div>
          </div>
        </div>
      ),
    },

    {
      accessorKey: "trip_departure_place",
      header: () => <div className="text-center">สถานที่ต้นทาง</div>,
      enableSorting: false,
      cell: ({ getValue }) => (
        <div className="text-left" data-name="สถานที่ต้นทาง">
          {getValue() as string}
        </div>
      ),
    },
    {
      accessorKey: "trip_destination_place",
      header: () => <div className="text-center">สถานที่ปลายทาง</div>,
      enableSorting: false,
      cell: ({ getValue }) => (
        <div className="text-left" data-name="สถานที่ปลายทาง">
          {getValue() as string}
        </div>
      ),
    },
    {
      accessorKey: "trip_detail",
      header: () => <div className="text-center">รายละเอียด</div>,
      enableSorting: false,
      cell: ({ getValue }) => (
        <div className="text-left" data-name="รายละเอียด">
          {getValue() as string}
        </div>
      ),
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
              data-tip="แก้ไขข้อมูลการเดินทาง"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                recordTravelAddModalRef.current?.openModal();
              }}
            >
              <i className="material-symbols-outlined">stylus</i>
            </button>

            <button
              className="btn btn-icon btn-tertiary bg-transparent shadow-none border-none tooltip tooltip-left"
              data-tip="ลบข้อมูลการเดินทาง"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                cancelRequestModalRef.current?.openModal();
              }}
            >
              <i className="material-symbols-outlined">delete</i>
            </button>
            <RecordTravelAddModal status={true} ref={recordTravelAddModalRef} />
            <CancelRequestModal
              id={row.original.trn_request_uid}
              tripId={row.original.trn_trip_detail_uid}
              title="ยืนยันลบข้อมูลการเดินทาง"
              desc={
                " ข้อมูลการเดินทางวันที่ " +
                convertToBuddhistDateTime(row.original.trip_start_datetime)
                  .date +
                " - " +
                convertToBuddhistDateTime(row.original.trip_start_datetime)
                  .time +
                " จะถูกลบออกจากระบบ "
              }
              confirmText="ลบข้อมูล"
              cancleFor="adminRecordTravel"
              ref={cancelRequestModalRef}
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
    console.log("page", pagination);
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
              console.log("row clicked", { uid });
              router.push(`/administrator/request-list/${uid}`);
            }}
          />
        </>
      )}
    </div>
  );
}
