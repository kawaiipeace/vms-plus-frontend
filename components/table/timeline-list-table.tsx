import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  createColumnHelper,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { DataTable } from "./time-table";
import {
  generateDateObjects,
  transformApiToTableData,
} from "@/utils/vehicle-management";
import { VehicleTimelineListTableData } from "@/app/types/vehicle-management/vehicle-timeline-type";
import dayjs from "dayjs";
import VehicleTimeLineDetailModal, { VehicleTimelineRef } from "../vehicle-management/vehicle-timeline-detail-modal";

interface RequestListTableProps {
  readonly dataRequest: any[];
  readonly params: {
    start_date: string;
    end_date: string;
  };
  readonly selectedOption: string;
  readonly lastMonth: string;
}

const statusColorMap = {
  "รออนุมัติ": { bg: "bg-[#FEDF89] border border-[#B54708]", text: "text-[#B54708]" },
  "ไป - กลับ": { bg: "bg-[#FED8F6] border border-[#A80689]", text: "text-[#A80689]" },
  "ค้างแรม": { bg: "bg-[#C7D7FE] border border-[#3538CD]", text: "text-[#3538CD]" },
  "เสร็จสิ้น": { bg: "bg-[#ABEFC6] border border-[#067647]", text: "text-[#067647]" },
} as const;

const useGenerateDates = (params: { start_date: string; end_date: string }) => {
  const [dates, setDates] = useState<any[]>([]);

  useEffect(() => {
    const fetchDates = async () => {
      const date = await generateDateObjects(params.start_date, params.end_date);
      setDates(date);
    };

    fetchDates();
  }, [params]);

  return dates;
};

const TripTimelineItem = ({
  item,
  onClick,
  durationDays,
}: {
  item: any;
  onClick: () => void;
  durationDays: number;
}) => {
  const statusColors = statusColorMap[item.status as keyof typeof statusColorMap] || {};

  return (
    <button
      key={item.tripDetailId}
      onClick={onClick}
      className={`${statusColors.bg} !h-auto !rounded-lg justify-start !cursor-pointer`}
      style={{ width: `${200 * durationDays}px` }}
    >
      <div className={`flex items-center gap-1 text-sm font-semibold ${statusColors.text} py-[2px] px-[4px]`}>
        <div className={`${statusColors.text} flex flex-col`}>
          <i className="material-symbols-outlined !text-base !leading-4">directions_car</i>
          <i className="material-symbols-outlined !text-base !leading-4">person</i>
        </div>
        <div className="flex flex-col justify-start items-start">
          <span className="text-sm font-semibold">{item.destinationPlace}</span>
          <span className="text-black font-normal text-sm">{item.startTime}</span>
        </div>
      </div>
    </button>
  );
};

const useColumns = (
  columnHelper: ReturnType<typeof createColumnHelper<VehicleTimelineListTableData>>,
  dates: any[],
  selectedOption: string,
  lastMonth: string,
  handleOpenDetailModal: () => void,
  setTripDetails: (dayTimeline: any[]) => void,
  setDateSelected: (date: any) => void
) =>
  useMemo(() => {
    const baseColumns = [
      columnHelper.accessor(
        (row) => ({
          license: row.vehicleLicensePlate,
          brandModel: row.vehicleBrandModel,
          brandName: row.vehicleBrandName,
        }),
        {
          id: "licensePlate",
          header: "เลขทะเบียน / ยี่ห้อ / รุ่น",
          cell: (info) => (
            <div className="flex flex-col items-start">
              <span className="text-base font-semibold">{info.getValue().license}</span>
              <span className="text-base text-gray-600">
                {info.getValue().brandModel} {info.getValue().brandName}
              </span>
            </div>
          ),
          enableSorting: false,
          meta: {
            className: `sticky left-0 z-0 bg-white min-w-[180px] max-w-[180px] border-b border-gray-500 ${selectedOption !== "all" && "border-r"
              }`,
          },
        }
      ),
    ];

    const additionalColumns =
      selectedOption === "all"
        ? [
          columnHelper.accessor("vehicleType", {
            header: () => (
              <div>
                <span>ประเภทยานพาหนะ</span>
              </div>
            ),
            cell: (info) => info.getValue(),
            enableSorting: false,
            meta: {
              className: "hidden sm:table-cell sticky left-[180px] z-0 bg-white min-w-[155px] max-w-[155px] border-b border-gray-500"
            }
          }),
          columnHelper.accessor("vehicleDepartment", {
            header: "สังกัดยานพาหนะ",
            cell: (info) => <div className="text-base">{info.getValue()}</div>,
            enableSorting: false,
            meta: {
              className: "sm:table-cell hidden sticky left-[335px] z-0 bg-white min-w-[170px] max-w-[170px] border-b border-gray-500",
            },
          }),
          columnHelper.accessor("distance", {
            header: `ระยะทาง ${lastMonth}`,
            cell: (info) => <div className="text-base">{parseInt(info.getValue()).toLocaleString()}</div>,
            enableSorting: true,
            meta: {
              className: `sm:table-cell hidden sticky left-[505px] z-0 bg-white min-w-[150px] max-w-[150px] fixed-column-line border-b border-gray-500 ${selectedOption === "all" && "border-r"
                }`,
            },
          }),
        ]
        : [];

    const dateColumns = dates.map(({ key, date, day, month, holiday, fullMonth, fullYear }) =>
      columnHelper.accessor(
        (row) => ({
          timeline: row.timeline,
        }),
        {
          id: key,
          header: () => {
            const isToday = dayjs().format("YYYY-MM-DD") === date.toString();
            const className = isToday ? "text-white bg-brand-900 rounded-full p-1" : "";

            return (
              <div className="flex flex-col justify-center items-center h-full w-full text-sm">
                <span className={`font-semibold ${className}`}>{day}</span>
                <span className="font-normal">{month}</span>
              </div>
            );
          },
          cell: (info) => {
            const { timeline } = info.getValue();
            const dayTimeline = timeline[key];
            const holidayClass = holiday ? "text-white bg-gray-100" : "";

            const handleClickOpenDetailModal = (trips: any[]) => {
              setTripDetails(trips);
              setDateSelected(`${day} ${fullMonth} ${fullYear}`);
              handleOpenDetailModal();
            };

            if (!dayTimeline || dayTimeline.length === 0) return null;

            const isTripStartToday = (item: any) => dayjs(item.startDate).format("YYYY/MM/DD") === date;

            const todayTrips = dayTimeline.filter(isTripStartToday);

            const showTrips = todayTrips.slice(0, 2); // Show only the first 2 trips
            const hiddenCount = todayTrips.length - showTrips.length;

            return (
              <div className={`flex flex-col text-left min-h-[140px] gap-1 px-1 ${holidayClass}`}>
                {showTrips.map((item: any) => (
                  <TripTimelineItem
                    key={item.tripDetailId}
                    item={item}
                    onClick={() => handleClickOpenDetailModal([item])}
                    durationDays={dayjs(item.endDate).diff(dayjs(item.startDate), "day") + 1}
                  />
                ))}

                {hiddenCount > 0 && (
                  <button
                    onClick={() => handleClickOpenDetailModal(todayTrips)}
                    className="rounded-lg border border-gray-300 text-sm text-gray-700 py-1 px-2 bg-white hover:bg-gray-100"
                  >
                    +{hiddenCount} เพิ่มเติม
                  </button>
                )}
              </div>
            );
          },
          meta: {
            className: "day min-w-[200px] max-w-[200px] !border-t-0 today",
          },
        }
      )
    );

    return [...baseColumns, ...additionalColumns, ...dateColumns];
  }, [columnHelper, dates, selectedOption, handleOpenDetailModal]);

export default function RequestListTable({
  dataRequest,
  params,
  selectedOption,
  lastMonth,
}: RequestListTableProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [tripDetails, setTripDetails] = useState<any[]>([]);
  const [dateSelected, setDateSelected] = useState<string | null>(null);

  const vehicleTimelineDetailRef = useRef<VehicleTimelineRef>(null);

  // Generate dates based on the provided params
  const dates = useGenerateDates(params);

  // Transform the API data to table data format
  const dataTransform = useMemo(() => transformApiToTableData(dataRequest, dates), [dataRequest, dates]);

  const columnHelper = createColumnHelper<VehicleTimelineListTableData>();
  const handleOpenDetailModal = () => vehicleTimelineDetailRef.current?.open();

  const columns = useColumns(
    columnHelper,
    dates,
    selectedOption,
    lastMonth,
    handleOpenDetailModal,
    setTripDetails,
    setDateSelected
  );

  const table = useReactTable({
    data: dataTransform,
    columns,
    getCoreRowModel: getCoreRowModel(),
    defaultColumn: {
      enableSorting: false,
    },
  });

  useEffect(() => {
    setIsLoading(false);
  }, []);

  return (
    <div className="w-full overflow-x-auto py-4 pt-0">
      {!isLoading && <DataTable table={table} />}
      <VehicleTimeLineDetailModal
        ref={vehicleTimelineDetailRef}
        detailRequest={tripDetails}
        currentDate={dateSelected ?? ''}
      />
    </div>
  );
}
