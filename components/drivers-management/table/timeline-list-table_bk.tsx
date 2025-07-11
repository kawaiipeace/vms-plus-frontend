import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  createColumnHelper,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import VehicleTimeLineDetailModal, {
  VehicleTimelineRef,
} from "../../vehicle-management/vehicle-timeline-detail-modal";
import dayjs from "dayjs";
import { DriverTimelineListTableData } from "@/app/types/carpool-management-type";
import { DataTable } from "@/components/table/time-table";
import {
  generateDateObjects,
  transformDriverApiToTableData,
} from "@/components/table/carpool-timeline/generate-date";

const statusColorMap = {
  รออนุมัติ: {
    bg: "bg-[#FEDF89] border border-[#B54708]",
    text: "text-[#B54708]",
  },
  "ไป - กลับ": {
    bg: "bg-[#FED8F6] border border-[#A80689]",
    text: "text-[#A80689]",
  },
  ค้างแรม: {
    bg: "bg-[#C7D7FE] border border-[#3538CD]",
    text: "text-[#3538CD]",
  },
  เสร็จสิ้น: {
    bg: "bg-[#ABEFC6] border border-[#067647]",
    text: "text-[#067647]",
  },
};

const useGenerateDates = (params: any) => {
  const [dates, setDates] = useState<any[]>([]);

  useEffect(() => {
    const fetchDates = async () => {
      const date = await generateDateObjects(
        params.start_date,
        params.end_date
      );
      setDates(date);
    };

    fetchDates();
  }, [params]);

  return dates;
};

const TripTimelineItem = ({
  item,
  statusColors,
  onClick,
}: {
  item: any;
  statusColors: { bg?: string; text?: string };
  onClick: () => void;
}) => (
  <button
    key={item.tripDetailId}
    onClick={onClick}
    className={`${statusColors.bg} !h-auto !rounded-lg justify-start !cursor-pointer w-[calc((100%*${item.schedule_range})+(8px*2)+(1px*2))]`}
  >
    <div
      className={`flex items-center gap-1 text-sm font-semibold ${statusColors.text} py-[2px] px-[4px]`}
    >
      <div className={`${statusColors.text} flex flex-col`}>
        <i className="material-symbols-outlined !text-base !leading-4">
          directions_car
        </i>
        <i className="material-symbols-outlined !text-base !leading-4">
          person
        </i>
      </div>
      <div className="flex flex-col justify-start items-start">
        <span className="text-sm font-semibold">{item.destinationPlace}</span>
        <span className="text-black font-normal text-sm">{item.startTime}</span>
      </div>
    </div>
  </button>
);

const useColumns = (
  columnHelper: ReturnType<
    typeof createColumnHelper<DriverTimelineListTableData>
  >,
  dates: any[],
  selectedOption: string,
  lastMonth: string,
  setDetailRequest: React.Dispatch<React.SetStateAction<any>>,
  handleOpenDetailModal: () => void,
  setDateSelected: React.Dispatch<React.SetStateAction<string | null>>
) => {
  return useMemo(() => {
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
                {info.getValue().name}{" "}
                {info.getValue().nickname
                  ? `(${info.getValue().nickname})`
                  : ""}
              </span>
              <span className="text-base text-gray-600">
                {info.getValue().dept}
              </span>
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
              cell: (info) => (
                <div className="text-base">{info.getValue()}</div>
              ),
              enableSorting: false,
              meta: {
                className:
                  "sticky left-[180px] z-0 bg-white min-w-[155px] max-w-[155px]",
              },
            }),
            columnHelper.accessor("workThisMonth", {
              header: "งานเดือนนี้",
              cell: (info) => (
                <div className="text-base">{info.getValue()}</div>
              ),
              enableSorting: true,
              meta: {
                className:
                  "sticky left-[335px] z-0 bg-white min-w-[130px] max-w-[130px] fixed-column-line",
              },
            }),
          ]
        : [];

    const dateColumns = dates.map(
      ({ key, date, day, month, holiday, fullMonth, fullYear }) =>
        columnHelper.accessor(
          (row) => ({
            timeline: row.timeline,
            status: row.status,
          }),
          {
            id: key,
            header: () => {
              const isToday = dayjs().format("D_M_YYYY") === date.toString();
              const className = isToday
                ? "text-white bg-brand-900 rounded-full p-1"
                : "";

              return (
                <div className="flex flex-col justify-center items-center h-full w-full text-sm">
                  <span className={`font-semibold ${className}`}>{day}</span>
                  <span className="font-normal">{month}</span>
                </div>
              );
            },
            cell: (info) => {
              const { timeline, status } = info.getValue();
              const dayTimeline = timeline?.[`day_${date}`];
              const holidayClass = holiday ? "text-white bg-gray-100" : "";
              const statusColors =
                statusColorMap[status as keyof typeof statusColorMap] || {};

              const handleClickOpenDetailModal = () => {
                setDetailRequest(dayTimeline);
                setDateSelected(`${day} ${fullMonth} ${fullYear}`);
                handleOpenDetailModal();
              };

              return (
                <div
                  className={`flex flex-col text-left min-h-[140px] gap-1 px-1 ${holidayClass}`}
                >
                  {dayTimeline?.map((item: any) => (
                    <TripTimelineItem
                      key={item.tripDetailId}
                      item={item}
                      statusColors={statusColors}
                      onClick={handleClickOpenDetailModal}
                    />
                  ))}
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [columnHelper, dates, selectedOption, handleOpenDetailModal]);
};

interface RequestListTableProps {
  dataRequest: any[];
  params: {
    start_date: string;
    end_date: string;
  };
  selectedOption: string;
  lastMonth: string;
}

export default function CarpoolDriverListTable({
  dataRequest,
  params,
  selectedOption,
  lastMonth,
}: RequestListTableProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [detailRequest, setDetailRequest] = useState<any[]>([]);
  const [dateSelected, setDateSelected] = useState<string | null>(null);

  const vehicleTimelineDetailRef = useRef<VehicleTimelineRef>(null);
  const dates = useGenerateDates(params);
  const dataTransform = useMemo(
    () => transformDriverApiToTableData(dataRequest, dates),
    [dataRequest, dates]
  );
  const columnHelper = createColumnHelper<DriverTimelineListTableData>();

  const handleOpenDetailModal = () => vehicleTimelineDetailRef.current?.open();

  const columns = useColumns(
    columnHelper,
    dates,
    selectedOption,
    lastMonth,
    setDetailRequest,
    handleOpenDetailModal,
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
    <div className="w-full py-4 pt-0 dataTable-bookingtimeline">
      {!isLoading && <DataTable table={table} />}
      <VehicleTimeLineDetailModal
        ref={vehicleTimelineDetailRef}
        detailRequest={detailRequest}
        currentDate={dateSelected ?? ""}
      />
    </div>
  );
}
