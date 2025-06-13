import React, { useEffect, useMemo, useRef, useState } from "react";
import { createColumnHelper, getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { DataTable } from "@/components/table/time-table";
import { generateDateObjects, transformDriverApiToTableData } from "@/components/table/carpool-timeline/generate-date";
// import { VehicleTimelineListTableData } from "@/app/types/vehicle-management/vehicle-timeline-type";
import dayjs from "dayjs";
import VehicleTimeLineDetailModal, { VehicleTimelineRef } from "@/components/vehicle-management/vehicle-timeline-detail-modal";
import { DriverTimelineListTableData } from "@/app/types/carpool-management-type";

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
  รออนุมัติ: { bg: "border-orange-300 bg-orange-100 border", text: "text-orange-700" },
  "ไป - กลับ": { bg: "border-red-300 bg-red-100 border", text: "text-red-700" },
  ค้างแรม: { bg: "border-blue-300 bg-blue-100 border", text: "text-blue-700" },
  เสร็จสิ้น: { bg: "border-green-300 bg-green-100 border", text: "text-green-700" },
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
  columnHelper: ReturnType<typeof createColumnHelper<DriverTimelineListTableData>>,
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
          name: row.driverName,
          nickname: row.driverNickname,
          dept: row.driverDeptSapShortNameWork,
        }),
        {
          id: "driverName",
          header: "ชื่อ - นามสกุล / สังกัด",
          cell: (info) => (
            <div className="flex flex-col items-start">
              <span className="text-base font-semibold">
                {info.getValue().name} {info.getValue().nickname ? `(${info.getValue().nickname})` : ""}
              </span>
              <span className="text-base text-gray-600">{info.getValue().dept}</span>
            </div>
          ),
          enableSorting: false,
          meta: {
            className: "sticky left-0 z-0 bg-white min-w-[180px] max-w-[180px]",
          },
        }
      ),
    ];

    const additionalColumns =
      selectedOption === "all"
        ? [
            columnHelper.accessor("workLastMonth", {
              header: `งาน ${lastMonth}`,
              cell: (info) => <div className="text-base">{info.getValue()}</div>,
              enableSorting: false,
              meta: {
                className: "sticky left-[180px] z-0 bg-white min-w-[155px] max-w-[155px]",
              },
            }),
            columnHelper.accessor("workThisMonth", {
              header: "งานเดือนนี้",
              cell: (info) => <div className="text-base">{info.getValue()}</div>,
              enableSorting: true,
              meta: {
                className: "sticky left-[335px] z-0 bg-white min-w-[130px] max-w-[130px] fixed-column-line",
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

export default function RequestListTable({ dataRequest, params, selectedOption, lastMonth }: RequestListTableProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [tripDetails, setTripDetails] = useState<any[]>([]);
  const [dateSelected, setDateSelected] = useState<string | null>(null);

  const vehicleTimelineDetailRef = useRef<VehicleTimelineRef>(null);

  // Generate dates based on the provided params
  const dates = useGenerateDates(params);

  // Transform the API data to table data format
  const dataTransform = useMemo(() => transformDriverApiToTableData(dataRequest, dates), [dataRequest, dates]);
  // console.log("dataTransform", dataTransform);

  const columnHelper = createColumnHelper<DriverTimelineListTableData>();
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
        currentDate={dateSelected ?? ""}
      />
    </div>
  );
}
