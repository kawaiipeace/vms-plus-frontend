import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  createColumnHelper,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { DataTable } from "./time-table";
import { generateDateObjects } from "@/utils/vehicle-management";
import { VehicleTimelineListTableData } from "@/app/types/vehicle-management/vehicle-timeline-type";
import dayjs from "dayjs";
import { useRouter } from "next/navigation";
import VehicleTimeLineDetailModal, {
  VehicleTimelineRef,
} from "../vehicle/vehicle-timeline-detail-modal";
// import { transformApiToTableData } from "@/utils/driver-management";

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

const useColumns = (
  columnHelper: ReturnType<
    typeof createColumnHelper<VehicleTimelineListTableData>
  >,
  dates: any[],
  selectedOption: string,
  lastMonth: string,
  setDetailRequest: React.Dispatch<React.SetStateAction<any>>,
  handleOpenDetailModal: () => void
) => {
  return useMemo(() => {
    const baseColumns = [
      columnHelper.accessor(
        (row) => ({
          license: row.vehicleLicensePlate,
          brandModel: row.vehicleBrandModel,
          brandName: row.vehicleBrandName,
        }),
        {
          id: "licensePlate",
          header: "ชื่อ - นามสกุล / สังกัด",
          cell: (info) => (
            <div className="flex flex-col items-start">
              <span className="text-base font-semibold">
                {info.getValue().license}
              </span>
              <span className="text-base text-gray-600">
                {info.getValue().brandModel} {info.getValue().brandName}
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
            columnHelper.accessor("vehicleType", {
              header: "งาน ธ.ค. 67",
              cell: (info) => (
                <div className="text-base">{info.getValue()}</div>
              ),
              enableSorting: false,
              meta: {
                className:
                  "sticky left-[180px] z-0 bg-white min-w-[155px] max-w-[155px]",
              },
            }),
            columnHelper.accessor("vehicleDepartment", {
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

    const dateColumns = dates.map(({ key, date, day, month, holiday }) =>
      columnHelper.accessor(
        (row) => ({
          timeline: row.timeline,
          status: row.vehicleStatus,
        }),
        {
          id: key,
          header: () => {
            const isToday = dayjs().format("YYYY-MM-DD") === date.toString();
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
            const dayTimeline = timeline?.[`day_${day}`];
            const holidayClass = holiday ? "text-white bg-gray-100" : "";

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
            const statusColors =
              statusColorMap[status as keyof typeof statusColorMap] || {};

            return (
              <div
                className={`flex flex-col text-left min-h-[140px] gap-1 px-1 ${holidayClass}`}
              >
                {dayTimeline?.map((item: any, index: number) => (
                  <div
                    key={index}
                    className={`${statusColors.bg} !h-auto !rounded-lg justify-start !cursor-pointer w-[calc((100%*${item.schedule_range})+(8px*2)+(1px*2))]`}
                    onClick={() => {
                      setDetailRequest(item);
                      handleOpenDetailModal();
                    }}
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
                      <div className="flex flex-col">
                        <span className="text-sm font-semibold">
                          {item.schedule_title}
                        </span>
                        <span className="text-black font-normal text-sm">
                          {item.schedule_time}
                        </span>
                      </div>
                    </div>
                  </div>
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
  }, [
    columnHelper,
    dates,
    selectedOption,
    setDetailRequest,
    handleOpenDetailModal,
  ]);
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
  const [detailRequest, setDetailRequest] = useState({});
  const vehicleTimelineDetailRef = useRef<VehicleTimelineRef>(null);

  console.log("dataRequest: ", dataRequest);

  const dates = useGenerateDates(params);
  const dataTransform = useMemo(
    () => transformApiToTableData(dataRequest, dates),
    [dataRequest, dates]
  );
  const columnHelper = createColumnHelper<VehicleTimelineListTableData>();

  const handleOpenDetailModal = () => vehicleTimelineDetailRef.current?.open();

  const columns = useColumns(
    columnHelper,
    dates,
    selectedOption,
    lastMonth,
    setDetailRequest,
    handleOpenDetailModal
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
      />
    </div>
  );
}

export function transformApiToTableData(rawData: any, dates: any[]): any[] {
  const createEmptyTimeline = () => {
    const timeline: Record<string, any[]> = {};
    for (let i = 1; i <= dates.length; i++) {
      timeline[`day_${i}`] = [];
    }
    return timeline;
  };

  const drivers: any[] = rawData ?? [];
  return drivers.map((driver) => {
    const timeline = createEmptyTimeline();

    driver.driver_trn_requests?.forEach((req: any) => {
      if (req.trip_details.length === 0) return;

      req.trip_details?.forEach((trip: any) => {
        const start = dayjs(trip.trip_start_datetime);
        const end = dayjs(trip.trip_end_datetime);
        const dayStart = start.date();
        const dayEnd = end.date();
        const duration = Math.max(dayEnd - dayStart + 1, 1);
        const destinationPlace = trip.trip_destination_place;

        timeline[`day_${dayStart}`]?.push({
          schedule_title: destinationPlace,
          schedule_time: start.format("HH:mm"),
          schedule_range: duration.toString(),
          schedule_status_code: req.ref_request_status_code,
          schedule_status_name: req.ref_request_status_name,
          modal: {
            statusModal: req.ref_request_status_name,
            carPlate:
              trip.vehicle_license_plate +
              " " +
              trip.vehicle_license_plate_province_short +
              ".",
            driverName: driver.driver_name + "(" + driver.driver_nickname + ")",
            destinationPlace: trip.trip_destination_place,
            startDate: start.format("DD/MM/YYYY"),
            vehicleName: req.vehicle_user_emp_name,
            vehicleDept: req.vehicle_user_dept_sap,
            carContactNumber: req.car_user_internal_contact_number,
            carContactNumberMobile: req.car_user_mobile_contact_number,
          },
        });
      });
    });

    const result = {
      vehicleLicensePlate:
        driver.driver_name + " (" + driver.driver_nickname + ")",
      vehicleBrandModel: driver.driver_dept_sap_short_name_work,
      vehicleBrandName: "-",
      vehicleType: driver.work_last_month,
      vehicleDepartment: driver.work_this_month,
      distance: driver.driver_name,
      timeLine: timeline,
    };

    return result;
  });
}
