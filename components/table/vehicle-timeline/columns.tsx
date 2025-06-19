import { useMemo } from "react";
import dayjs from "dayjs";
import { VehicleTimelineListTableData } from "@/app/types/vehicle-management/vehicle-timeline-type";
import { createColumnHelper } from "@tanstack/react-table";
import clsx from "clsx";
import TripTimelineItem from "./trip-timeline-item";
import '../vehicle-timeline/calendar-view.css';

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
    columnHelper: ReturnType<typeof createColumnHelper<VehicleTimelineListTableData>>;
    dates: DateColumnData[];
    selectedOption: string;
    lastMonth: string;
    startDate: string;
    endDate: string;
    handleOpenDetailModal: () => void;
    setTripDetails: (dayTimeline: any[]) => void;
    setDateSelected: (date: string) => void;
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
                    license: row.vehicleLicensePlate,
                    provinceShort: row.vehicleLicensePlateProvinceShort,
                    brandModel: row.vehicleBrandModel,
                    brandName: row.vehicleBrandName,
                }),
                {
                    id: "licensePlate",
                    header: () => <span className="w-full">เลขทะเบียน / ยี่ห้อ / รุ่น</span>,
                    cell: (info) => {
                        const { license, brandModel, brandName, provinceShort } = info.getValue();
                        return (
                            <div className="flex flex-col text-start px-4">
                                <span className="text-base font-semibold">{license} {provinceShort}</span>
                                <span className="text-base">
                                    {brandModel} {brandName}
                                </span>
                            </div>
                        );
                    },
                    enableSorting: false,
                    meta: {
                        className: clsx(
                            "sticky left-0 z-0 bg-white",
                            "min-w-[180px] max-w-[180px] w-[180px]",
                            selectedOption !== "all" && "border-r",
                            "darkModeBg"
                        ),
                    },
                }
            ),
        ];

        const additionalColumns = selectedOption === "all"
            ? [
                columnHelper.accessor("vehicleType", {
                    header: () => <span className="w-full">ประเภทยานพาหนะ</span>,
                    cell: (info) => <div className="text-start px-4"><span>{info.getValue()}</span></div>,
                    enableSorting: false,
                    meta: {
                        className: clsx(
                            "hidden sm:table-cell sticky left-[180px] z-0 bg-white",
                            "min-w-[155px] max-w-[155px] w-[155px]",
                            "darkModeBg"
                        ),
                    },
                }),
                columnHelper.accessor((row) => ({
                    department: row.vehicleDepartment,
                    carpoolName: row.vehicleCarpoolName,
                }), {
                    id: "vehicleDepartment",
                    header:() => <span className="w-full">สังกัดยานพาหนะ</span>,
                    cell: (info) => {
                        const { department, carpoolName } = info.getValue();
                        return (
                            <div className="flex flex-col text-start px-4">
                                <span className="truncate">{department}</span>
                                <span>{carpoolName}</span>
                            </div>
                        );
                    },
                    enableSorting: false,
                    meta: {
                        className: clsx(
                            "hidden sm:table-cell sticky left-[335px] z-0 bg-white",
                            "min-w-[170px] max-w-[170px] w-[170px]",
                            "darkModeBg"
                        ),
                    },
                }),
                columnHelper.accessor("distance", {
                    header: () => <span className="w-full">{`ระยะทาง ${lastMonth}`}</span>,
                    cell: (info) => <div className="text-start px-4"><span>{info.getValue()}</span></div>,
                    enableSorting: true,
                    meta: {
                        className: clsx(
                            "hidden sm:table-cell sticky left-[505px] z-0 bg-white",
                            "min-w-[150px] max-w-[150px] w-[150px]",
                            "darkModeBg",
                            selectedOption === "all" && "border-r"
                        ),
                    },
                }),
            ]
            : [];

        const dateColumns = dates.map(
            ({ key, date, day, month, holiday }) =>
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
                        const todayTrips = trips.filter(
                            (item: any) => formatDate(item.startDate) === date
                        );
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
                                        startDate={item.startDate}
                                        endDate={item.endDate}
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
                            holiday && "bg-gray-200 darkModeHoliday",
                        ),
                    },
                })
        );

        return [...baseColumns, ...additionalColumns, ...dateColumns];
    }, [columnHelper, dates, selectedOption, lastMonth]);
