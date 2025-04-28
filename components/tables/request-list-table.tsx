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
import { RequestListType } from "@/app/types/request-list-type";
import { convertToBuddhistDateTime } from "@/utils/converToBuddhistDateTime";
import { useRouter } from "next/navigation";
import { scheduler } from "timers/promises";

export default function RequestListTable() {
  const [sorting, setSorting] = useState<SortingState>([]);
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  // ✅ Mock Data
  const mockData: any = [
    {
      vehicle_no_brand_model: "1กก 1236 กทม.",
      day_1: [
        { schedule_title: 'การไฟฟ้าเขต น.1 และ กฟฟ. ในสังกัด', schedule_time: '08:00', schedule_from: '', schedule_to: '', schedule_range: '3' },
        { schedule_title: 'โรงแรมมิราเคิล แกรนด์', schedule_time: '08:30', schedule_from: '', schedule_to: '', schedule_range: '2' },
      ],
      day_2: "",
      day_3: "",
      vehicle_license_plate: "1กข-1234",
      vehicle_type: "รถแวนตรวจการ",
      distance: "890"
      // work_place: "สำนักงานใหญ่",
      // start_datetime: "2025-04-25T08:00:00Z",
      // end_datetime: "2025-04-25T12:00:00Z",
      // ref_request_status_name: "รออนุมัติ",
      // trn_request_uid: "uid-001",
    },
    {
      vehicle_no_brand_model: "1กก 2345 กทม.",
      day_1: "",
      day_2: "",
      day_3: "",
      vehicle_license_plate: "2ขบ-5678",
      vehicle_type: "รถตู้นั่ง",
      distance: "1890"
      // work_place: "สาขาบางนา",
      // start_datetime: "2025-04-26T09:00:00Z",
      // end_datetime: "2025-04-26T15:00:00Z",
      // ref_request_status_name: "ยกเลิกคำขอ",
      // trn_request_uid: "uid-002",
    }
  ];

  const paginationState = {
    pageIndex: 0,
    pageSize: 10,
  };

  const requestListColumns: ColumnDef<RequestListType>[] = [
    {
      accessorKey: "vehicle_no_brand_model",
      header: () => (
        <div className="relative flex items-center justify-center text-center">
          <div className="text-center">เลขทะเบียน / ยี่ห้อ / รุ่น</div>
        </div>
      ),
      enableSorting: true,
      meta: {
        className: '!align-top sticky left-0 z-10 min-w-[208px] max-w-[208px]',
      },
      cell: ({ getValue }) => (
        // <div className="text-center" data-name="เลขที่คำขอ">{getValue() as string}</div>
        <div className="">
          <div className="font-semibold">{getValue() as string}</div>
          <div className="text-xs text-[var(--color-text-secondary)]">BYD Seal</div>
        </div>
      ),
    },
    {
      accessorKey: "vehicle_type",
      header: () => (
        <div className="relative flex items-center justify-center text-center">
          <div className="text-center">ประเภทยานพาหนะ</div>
        </div>
      ),
      enableSorting: true,
      meta: {
        className: '!align-top sticky left-[208px] z-10 min-w-[170px] max-w-[170px]',
      },
      cell: ({ getValue }) => (
        // <div className="text-center" data-name="เลขที่คำขอ">{getValue() as string}</div>
        <div>
          {getValue() as string}
        </div>
      ),
    },
    {
      accessorKey: "distance",
      header: () => (
        <div className="relative flex items-center justify-center text-center">
          <div className="text-center">ระยะทาง ธ.ค. 67</div>
        </div>
      ),
      enableSorting: true,
      meta: {
        className: '!align-top sticky left-[378px] z-10 min-w-[180px] max-w-[180px] fixed-column-line',
      },
      cell: ({ getValue }) => (
        // <div className="text-center" data-name="เลขที่คำขอ">{getValue() as string}</div>
        <div>
          {getValue() as string}
        </div>
      ),
    },
    {
      accessorKey: "day_1",
      header: () => <div className="w-full flex flex-col"><span className="font-semibold text-xs datatable-date">1</span><span className="font-normal text-xs">มค</span></div>,
      enableSorting: false,
      meta: {
        className: 'day min-w-[148px] max-w-[148px] holiday !border-l-0',
      },
      cell: ({ row }) => (
        <div className="text-left min-h-[140px] gap-1 flex flex-col px-1" data-name="ผู้ใช้ยานพาหนะ">
            
        </div>
      ),
    },
    {
      accessorKey: "day_2",
      header: () => <div className="w-full flex flex-col"><span className="font-semibold text-xs datatable-date">2</span><span className="font-normal text-xs">มค</span></div>,
      enableSorting: false,
      meta: {
        className: 'day min-w-[148px] max-w-[148px] today',
      },
      cell: ({ row }) => (
        <div className="text-left min-h-[140px] gap-1 flex flex-col px-1" data-name="ผู้ใช้ยานพาหนะ">
            <div className={`badge badge-info badge-outline !h-auto !rounded-lg justify-start !cursor-pointer w-[calc((100%*3)+(8px*2)+(1px*2))]`}>
              <div className="rounded-[4px] bg-[var(--color-surface-primary)] h-full flex flex-col justify-center py-[2px]">
                <i className="material-symbols-outlined !text-base !leading-4">directions_car</i>
                <i className="material-symbols-outlined !text-base !leading-4">person</i>
              </div>
              <div className="overflow-hidden">
                <div className="text-xs font-semibold leading-[18px] truncate">การไฟฟ้าเขต น.1 และ กฟฟ. ในสังกัด</div>
                <div className="text-xs font-normal leading-[18px] text-default">07:00</div>
              </div>
            </div>

            <div className={`badge badge-warning badge-outline !h-auto !rounded-lg justify-start !cursor-pointer w-[calc((100%*1)+(8px*0)+(1px*1))]`}>
              <div className="rounded-[4px]  bg-[var(--color-surface-primary)] h-full flex flex-col justify-center py-[2px]">
                <i className="material-symbols-outlined !text-base">directions_car</i>
              </div>
              <div className="overflow-hidden">
                <div className="text-xs font-semibold leading-[18px] truncate">โรงแรมมิราเคิล แกรนด์</div>
                <div className="text-xs font-normal leading-[18px] text-default">18:00</div>
              </div>
            </div>

            <div className={`badge badge-gray badge-outline !h-auto !rounded-lg justify-start !cursor-pointer w-[calc((100%*1)+(8px*0))]`}>
              <div className="leading-[18px]">+1 เพิ่มเติม</div>
            </div>
        </div>
      ),
    },
    {
      accessorKey: "day_3",
      header: () => <div className="w-full flex flex-col"><span className="font-semibold text-xs datatable-date">3</span><span className="font-normal text-xs">มค</span></div>,
      enableSorting: false,
      meta: {
        className: 'day min-w-[148px] max-w-[148px] !border-l-0',
      },
      cell: ({ row }) => (
        <div className="text-left min-h-[140px] gap-1 flex flex-col px-1" data-name="ผู้ใช้ยานพาหนะ">
            <div className={`badge badge-success badge-outline !h-auto !rounded-lg justify-start !cursor-pointer w-[calc((100%*2)+(8px*1)+(1px*1))] mt-[50px]`}>
              <div className="rounded-[4px]  bg-[var(--color-surface-primary)] h-full flex flex-col justify-center py-[2px]">
                <i className="material-symbols-outlined !text-base">directions_car</i>
              </div>
              <div className="overflow-hidden">
                <div className="text-xs font-semibold leading-[18px] truncate">สนามบินดอนเมือง</div>
                <div className="text-xs font-normal leading-[18px] text-default">18:00</div>
              </div>
            </div>
        </div>
      ),
    },
    {
      accessorKey: "day_4",
      header: () => <div className="w-full flex flex-col"><span className="font-semibold text-xs datatable-date">4</span><span className="font-normal text-xs">มค</span></div>,
      enableSorting: false,
      meta: {
        className: 'day min-w-[148px] max-w-[148px] !border-l-0',
      },
      cell: ({ row }) => (
        <div className="text-left min-h-[140px] gap-1 flex flex-col px-1" data-name="ผู้ใช้ยานพาหนะ">
            
        </div>
      ),
    },
    {
      accessorKey: "day_5",
      header: () => <div className="w-full flex flex-col"><span className="font-semibold text-xs datatable-date">5</span><span className="font-normal text-xs">มค</span></div>,
      enableSorting: false,
      meta: {
        className: 'day min-w-[148px] max-w-[148px] !border-l-0',
      },
      cell: ({ row }) => (
        <div className="text-left min-h-[140px] gap-1 flex flex-col px-1" data-name="ผู้ใช้ยานพาหนะ">
            <div className={`badge badge-brand badge-outline !h-auto !rounded-lg justify-start !cursor-pointer w-[calc((100%*1)+(8px*0))]`}>
              <div className="rounded-[4px]  bg-[var(--color-surface-primary)] h-full flex flex-col justify-center py-[2px]">
                <i className="material-symbols-outlined !text-base">directions_car</i>
              </div>
              <div className="overflow-hidden">
                <div className="text-xs font-semibold leading-[18px] truncate">สนามบินดอนเมือง</div>
                <div className="text-xs font-normal leading-[18px] text-default">18:00</div>
              </div>
            </div>
        </div>
      ),
    },
    {
      accessorKey: "day_6",
      header: () => <div className="w-full flex flex-col"><span className="font-semibold text-xs datatable-date">6</span><span className="font-normal text-xs">มค</span></div>,
      enableSorting: false,
      meta: {
        className: 'day min-w-[148px] max-w-[148px] !border-l-0',
      },
      cell: ({ row }) => (
        <div className="text-left min-h-[140px] gap-1 flex flex-col px-1" data-name="ผู้ใช้ยานพาหนะ">
            
        </div>
      ),
    },
    {
      accessorKey: "day_7",
      header: () => <div className="w-full flex flex-col"><span className="font-semibold text-xs datatable-date">7</span><span className="font-normal text-xs">มค</span></div>,
      enableSorting: false,
      meta: {
        className: 'day min-w-[148px] max-w-[148px] !border-l-0 holiday',
      },
      cell: ({ row }) => (
        <div className="text-left min-h-[140px] gap-1 flex flex-col px-1" data-name="ผู้ใช้ยานพาหนะ">
            
        </div>
      ),
    },
    {
      accessorKey: "day_8",
      header: () => <div className="w-full flex flex-col"><span className="font-semibold text-xs datatable-date">8</span><span className="font-normal text-xs">มค</span></div>,
      enableSorting: false,
      meta: {
        className: 'day min-w-[148px] max-w-[148px] !border-l-0 holiday',
      },
      cell: ({ row }) => (
        <div className="text-left min-h-[140px] gap-1 flex flex-col px-1" data-name="ผู้ใช้ยานพาหนะ">
            
        </div>
      ),
    },
    {
      accessorKey: "day_9",
      header: () => <div className="w-full flex flex-col"><span className="font-semibold text-xs datatable-date">9</span><span className="font-normal text-xs">มค</span></div>,
      enableSorting: false,
      meta: {
        className: 'day min-w-[148px] max-w-[148px] !border-l-0',
      },
      cell: ({ row }) => (
        <div className="text-left min-h-[140px] gap-1 flex flex-col px-1" data-name="ผู้ใช้ยานพาหนะ">
            
        </div>
      ),
    },
    {
      accessorKey: "day_10",
      header: () => <div className="w-full flex flex-col"><span className="font-semibold text-xs datatable-date">10</span><span className="font-normal text-xs">มค</span></div>,
      enableSorting: false,
      meta: {
        className: 'day min-w-[148px] max-w-[148px] !border-l-0',
      },
      cell: ({ row }) => (
        <div className="text-left min-h-[140px] gap-1 flex flex-col px-1" data-name="ผู้ใช้ยานพาหนะ">
            <div className={`badge badge-gray badge-outline !h-auto !rounded-lg justify-start !cursor-pointer w-[calc((100%*1)+(8px*0))]`}>
              <div className="rounded-[4px]  bg-[var(--color-surface-primary)] h-full flex flex-col justify-center py-[2px]">
                <i className="material-symbols-outlined !text-base">local_car_wash</i>
              </div>
              <div className="overflow-hidden">
                <div className="text-xs font-semibold leading-[18px] truncate">ล้างรถ</div>
                {/* <div className="text-xs font-normal leading-[18px] text-default">18:00</div> */}
              </div>
            </div>
        </div>
      ),
    },
    {
      accessorKey: "day_11",
      header: () => <div className="w-full flex flex-col"><span className="font-semibold text-xs datatable-date">11</span><span className="font-normal text-xs">มค</span></div>,
      enableSorting: false,
      meta: {
        className: 'day min-w-[148px] max-w-[148px] !border-l-0',
      },
      cell: ({ row }) => (
        <div className="text-left min-h-[140px] gap-1 flex flex-col px-1" data-name="ผู้ใช้ยานพาหนะ">
            
        </div>
      ),
    },
    {
      accessorKey: "day_12",
      header: () => <div className="w-full flex flex-col"><span className="font-semibold text-xs datatable-date">12</span><span className="font-normal text-xs">มค</span></div>,
      enableSorting: false,
      meta: {
        className: 'day min-w-[148px] max-w-[148px] !border-l-0',
      },
      cell: ({ row }) => (
        <div className="text-left min-h-[140px] gap-1 flex flex-col px-1" data-name="ผู้ใช้ยานพาหนะ">
            
        </div>
      ),
    },
    {
      accessorKey: "day_13",
      header: () => <div className="w-full flex flex-col"><span className="font-semibold text-xs datatable-date">13</span><span className="font-normal text-xs">มค</span></div>,
      enableSorting: false,
      meta: {
        className: 'day min-w-[148px] max-w-[148px] !border-l-0',
      },
      cell: ({ row }) => (
        <div className="text-left min-h-[140px] gap-1 flex flex-col px-1" data-name="ผู้ใช้ยานพาหนะ">
            
        </div>
      ),
    },
    {
      accessorKey: "day_14",
      header: () => <div className="w-full flex flex-col"><span className="font-semibold text-xs datatable-date">14</span><span className="font-normal text-xs">มค</span></div>,
      enableSorting: false,
      meta: {
        className: 'day min-w-[148px] max-w-[148px] !border-l-0 holiday',
      },
      cell: ({ row }) => (
        <div className="text-left min-h-[140px] gap-1 flex flex-col px-1" data-name="ผู้ใช้ยานพาหนะ">
            
        </div>
      ),
    },
    {
      accessorKey: "day_15",
      header: () => <div className="w-full flex flex-col"><span className="font-semibold text-xs datatable-date">15</span><span className="font-normal text-xs">มค</span></div>,
      enableSorting: false,
      meta: {
        className: 'day min-w-[148px] max-w-[148px] !border-l-0 holiday',
      },
      cell: ({ row }) => (
        <div className="text-left min-h-[140px] gap-1 flex flex-col px-1" data-name="ผู้ใช้ยานพาหนะ">
            
        </div>
      ),
    },
    {
      accessorKey: "day_16",
      header: () => <div className="w-full flex flex-col"><span className="font-semibold text-xs datatable-date">16</span><span className="font-normal text-xs">มค</span></div>,
      enableSorting: false,
      meta: {
        className: 'day min-w-[148px] max-w-[148px] !border-l-0',
      },
      cell: ({ row }) => (
        <div className="text-left min-h-[140px] gap-1 flex flex-col px-1" data-name="ผู้ใช้ยานพาหนะ">
            
        </div>
      ),
    },
    {
      accessorKey: "day_17",
      header: () => <div className="w-full flex flex-col"><span className="font-semibold text-xs datatable-date">17</span><span className="font-normal text-xs">มค</span></div>,
      enableSorting: false,
      meta: {
        className: 'day min-w-[148px] max-w-[148px] !border-l-0',
      },
      cell: ({ row }) => (
        <div className="text-left min-h-[140px] gap-1 flex flex-col px-1" data-name="ผู้ใช้ยานพาหนะ">
            <div className={`badge badge-gray badge-outline !h-auto !rounded-lg justify-start !cursor-pointer w-[calc((100%*1)+(8px*0))]`}>
              <div className="rounded-[4px]  bg-[var(--color-surface-primary)] h-full flex flex-col justify-center py-[2px]">
                <i className="material-symbols-outlined !text-base">build</i>
              </div>
              <div className="overflow-hidden">
                <div className="text-xs font-semibold leading-[18px] truncate">บำรุงรักษา</div>
                {/* <div className="text-xs font-normal leading-[18px] text-default">18:00</div> */}
              </div>
            </div>
        </div>
      ),
    },
    {
      accessorKey: "day_18",
      header: () => <div className="w-full flex flex-col"><span className="font-semibold text-xs datatable-date">18</span><span className="font-normal text-xs">มค</span></div>,
      enableSorting: false,
      meta: {
        className: 'day min-w-[148px] max-w-[148px] !border-l-0',
      },
      cell: ({ row }) => (
        <div className="text-left min-h-[140px] gap-1 flex flex-col px-1" data-name="ผู้ใช้ยานพาหนะ">
            
        </div>
      ),
    },
    {
      accessorKey: "day_19",
      header: () => <div className="w-full flex flex-col"><span className="font-semibold text-xs datatable-date">19</span><span className="font-normal text-xs">มค</span></div>,
      enableSorting: false,
      meta: {
        className: 'day min-w-[148px] max-w-[148px] !border-l-0',
      },
      cell: ({ row }) => (
        <div className="text-left min-h-[140px] gap-1 flex flex-col px-1" data-name="ผู้ใช้ยานพาหนะ">
            
        </div>
      ),
    },
    {
      accessorKey: "day_20",
      header: () => <div className="w-full flex flex-col"><span className="font-semibold text-xs datatable-date">20</span><span className="font-normal text-xs">มค</span></div>,
      enableSorting: false,
      meta: {
        className: 'day min-w-[148px] max-w-[148px] !border-l-0',
      },
      cell: ({ row }) => (
        <div className="text-left min-h-[140px] gap-1 flex flex-col px-1" data-name="ผู้ใช้ยานพาหนะ">
            
        </div>
      ),
    },
    {
      accessorKey: "day_21",
      header: () => <div className="w-full flex flex-col"><span className="font-semibold text-xs datatable-date">21</span><span className="font-normal text-xs">มค</span></div>,
      enableSorting: false,
      meta: {
        className: 'day min-w-[148px] max-w-[148px] !border-l-0 holiday',
      },
      cell: ({ row }) => (
        <div className="text-left min-h-[140px] gap-1 flex flex-col px-1" data-name="ผู้ใช้ยานพาหนะ">
            
        </div>
      ),
    },
    {
      accessorKey: "day_22",
      header: () => <div className="w-full flex flex-col"><span className="font-semibold text-xs datatable-date">22</span><span className="font-normal text-xs">มค</span></div>,
      enableSorting: false,
      meta: {
        className: 'day min-w-[148px] max-w-[148px] !border-l-0 holiday',
      },
      cell: ({ row }) => (
        <div className="text-left min-h-[140px] gap-1 flex flex-col px-1" data-name="ผู้ใช้ยานพาหนะ">
            
        </div>
      ),
    },
    {
      accessorKey: "day_23",
      header: () => <div className="w-full flex flex-col"><span className="font-semibold text-xs datatable-date">23</span><span className="font-normal text-xs">มค</span></div>,
      enableSorting: false,
      meta: {
        className: 'day min-w-[148px] max-w-[148px] !border-l-0',
      },
      cell: ({ row }) => (
        <div className="text-left min-h-[140px] gap-1 flex flex-col px-1" data-name="ผู้ใช้ยานพาหนะ">
            
        </div>
      ),
    },
    {
      accessorKey: "day_24",
      header: () => <div className="w-full flex flex-col"><span className="font-semibold text-xs datatable-date">24</span><span className="font-normal text-xs">มค</span></div>,
      enableSorting: false,
      meta: {
        className: 'day min-w-[148px] max-w-[148px] !border-l-0',
      },
      cell: ({ row }) => (
        <div className="text-left min-h-[140px] gap-1 flex flex-col px-1" data-name="ผู้ใช้ยานพาหนะ">
            
        </div>
      ),
    },
    {
      accessorKey: "day_25",
      header: () => <div className="w-full flex flex-col"><span className="font-semibold text-xs datatable-date">25</span><span className="font-normal text-xs">มค</span></div>,
      enableSorting: false,
      meta: {
        className: 'day min-w-[148px] max-w-[148px] !border-l-0',
      },
      cell: ({ row }) => (
        <div className="text-left min-h-[140px] gap-1 flex flex-col px-1" data-name="ผู้ใช้ยานพาหนะ">
            
        </div>
      ),
    },
    {
      accessorKey: "day_26",
      header: () => <div className="w-full flex flex-col"><span className="font-semibold text-xs datatable-date">26</span><span className="font-normal text-xs">มค</span></div>,
      enableSorting: false,
      meta: {
        className: 'day min-w-[148px] max-w-[148px] !border-l-0',
      },
      cell: ({ row }) => (
        <div className="text-left min-h-[140px] gap-1 flex flex-col px-1" data-name="ผู้ใช้ยานพาหนะ">
            
        </div>
      ),
    },
    {
      accessorKey: "day_27",
      header: () => <div className="w-full flex flex-col"><span className="font-semibold text-xs datatable-date">27</span><span className="font-normal text-xs">มค</span></div>,
      enableSorting: false,
      meta: {
        className: 'day min-w-[148px] max-w-[148px] !border-l-0',
      },
      cell: ({ row }) => (
        <div className="text-left min-h-[140px] gap-1 flex flex-col px-1" data-name="ผู้ใช้ยานพาหนะ">
            
        </div>
      ),
    },
    {
      accessorKey: "day_28",
      header: () => <div className="w-full flex flex-col"><span className="font-semibold text-xs datatable-date">28</span><span className="font-normal text-xs">มค</span></div>,
      enableSorting: false,
      meta: {
        className: 'day min-w-[148px] max-w-[148px] !border-l-0 holiday',
      },
      cell: ({ row }) => (
        <div className="text-left min-h-[140px] gap-1 flex flex-col px-1" data-name="ผู้ใช้ยานพาหนะ">
            
        </div>
      ),
    },
    {
      accessorKey: "day_29",
      header: () => <div className="w-full flex flex-col"><span className="font-semibold text-xs datatable-date">29</span><span className="font-normal text-xs">มค</span></div>,
      enableSorting: false,
      meta: {
        className: 'day min-w-[148px] max-w-[148px] !border-l-0 holiday',
      },
      cell: ({ row }) => (
        <div className="text-left min-h-[140px] gap-1 flex flex-col px-1" data-name="ผู้ใช้ยานพาหนะ">
            
        </div>
      ),
    },
    {
      accessorKey: "day_30",
      header: () => <div className="w-full flex flex-col"><span className="font-semibold text-xs datatable-date">30</span><span className="font-normal text-xs">มค</span></div>,
      enableSorting: false,
      meta: {
        className: 'day min-w-[148px] max-w-[148px] !border-l-0',
      },
      cell: ({ row }) => (
        <div className="text-left min-h-[140px] gap-1 flex flex-col px-1" data-name="ผู้ใช้ยานพาหนะ">
            
        </div>
      ),
    },
    {
      accessorKey: "day_31",
      header: () => <div className="w-full flex flex-col"><span className="font-semibold text-xs datatable-date">31</span><span className="font-normal text-xs">มค</span></div>,
      enableSorting: false,
      meta: {
        className: 'day min-w-[148px] max-w-[148px] !border-l-0',
      },
      cell: ({ row }) => (
        <div className="text-left min-h-[140px] gap-1 flex flex-col px-1" data-name="ผู้ใช้ยานพาหนะ">
            
        </div>
      ),
    },
  ];

  const table = useReactTable({
    data: mockData,
    columns: requestListColumns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    onPaginationChange: () => {},
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
    <div className="w-full py-4 pt-0 dataTable-bookingcalendar">
      {!isLoading && <DataTable table={table} />}
    </div>
  );
}
