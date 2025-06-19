import { useMemo } from "react";
import dayjs from "dayjs";
// import { VehicleTimelineListTableData } from "@/app/types/vehicle-management/vehicle-timeline-type";
import { DriverTimelineListTableData } from "@/app/types/carpool-management-type";
import { createColumnHelper } from "@tanstack/react-table";
import clsx from "clsx";
import TripTimelineItem from "@/components/table/vehicle-timeline/trip-timeline-item";
import "../vehicle-timeline/calendar-view.css";

type DateColumnData = {
  key: string;
  date: string;
  day: string;
  month: string;
  holiday: boolean;
  fullMonth: string;
  fullYear: string;
};

type UseColumnsProps = {
  columnHelper: ReturnType<typeof createColumnHelper<DriverTimelineListTableData>>;
  dates: DateColumnData[];
  selectedOption: string;
  lastMonth: string;
  handleOpenDetailModal: () => void;
  setTripDetails: (dayTimeline: any[]) => void;
  setDateSelected: (date: string) => void;
  startDate: string;
  endDate: string;
};

const formatDate = (input: string | Date) => dayjs(input).format("YYYY/MM/DD");

export const useColumns = ({
  columnHelper,
  dates,
  selectedOption,
  lastMonth,
  handleOpenDetailModal,
  setTripDetails,
  setDateSelected,
  startDate,
  endDate,
}: UseColumnsProps) =>
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
              <span className="text-base font-semibold text-left">
                {info.getValue().name} {info.getValue().nickname ? `(${info.getValue().nickname})` : ""}
              </span>
              <span className="text-base text-gray-600">{info.getValue().dept}</span>
            </div>
          ),
          enableSorting: false,
          meta: {
            className: clsx(
              "sticky left-0 z-0 bg-white min-w-[180px] max-w-[180px]",
              "darkModeBg"
            ),
          },
        }
      ),
    ];

    const additionalColumns =
      selectedOption === "all"
        ? [
            columnHelper.accessor("workLastMonth", {
              header: () => <div className="text-center w-full">งาน {lastMonth}</div>,
              cell: (info) => <div className="text-base">{info.getValue()}</div>,
              enableSorting: false,
              meta: {
                className: clsx(
                  "sticky left-[180px] z-0 bg-white min-w-[155px] max-w-[155px]",
                  "darkModeBg"
                ),
              },
            }),
            columnHelper.accessor("workThisMonth", {
              header: () => <div className="text-center w-full">งานเดือนนี้</div>,
              cell: (info) => <div className="text-base">{info.getValue()}</div>,
              enableSorting: true,
              meta: {
                className: clsx(
                  "sticky left-[335px] z-0 bg-white min-w-[130px] max-w-[130px] fixed-column-line",
                  "darkModeBg"
                ),
              },
            }),
          ]
        : [];

    const dateColumns = dates.map(({ key, date, day, month, holiday }) =>
      columnHelper.accessor((row) => ({ timeline: row.timeline }), {
        id: `day-${key}`,
        header: () => {
          const isToday = formatDate(new Date()) === date;
          return (
            <div className="flex flex-col text-sm w-full border-t-0 items-center">
              <span
                className={clsx(
                  "font-semibold flex items-center justify-center w-8 h-8",
                  isToday ? "text-white bg-brand-900 rounded-full" : ""
                )}
              >
                {day}
              </span>
              <span className="font-normal">{month}</span>
            </div>
          );
        },
        cell: (info) => {
          const { timeline } = info.getValue();
          const trips = timeline?.[key] || [];
          const todayTrips = trips.filter((item: any) => formatDate(item.startDate) === date);
          const visibleTrips = todayTrips.slice(0, 2);
          const hiddenCount = todayTrips.length - visibleTrips.length;

          if (!todayTrips.length) return null;

          const handleClickOpenDetailModal = (items: any[]) => {
            setTripDetails(items);
            setDateSelected(date);
            handleOpenDetailModal();
          };

          return (
            <div className="h-[130px]">
              {visibleTrips.map((item: any, index: number) => (
                <TripTimelineItem
                  key={item.tripDetailId}
                  item={item}
                  onClick={() => handleClickOpenDetailModal([item])}
                  startDate={new Date(item.startDate)}
                  endDate={new Date(item.endDate)}
                  timelineStartDate={startDate}
                  timelineEndDate={endDate}
                />
              ))}
              {hiddenCount > 0 && (
                <button
                  onClick={() => handleClickOpenDetailModal(todayTrips)}
                  className="rounded-lg border border-gray-300 text-sm text-gray-700 py-1 px-2 bg-white hover:bg-gray-100 text-center mt-1"
                  style={{ width: `${200}px` }}
                >
                  +{hiddenCount} เพิ่มเติม
                </button>
              )}
            </div>
          );
        },
        meta: {
          className: clsx(
            "day !border-t-0 today",
            "min-w-[150px] max-w-[150px] w-[150px]",
            holiday && "bg-gray-200 darkModeHoliday"
          ),
        },
      })
    );

    return [...baseColumns, ...additionalColumns, ...dateColumns];
  }, [columnHelper, dates, selectedOption, lastMonth]);
