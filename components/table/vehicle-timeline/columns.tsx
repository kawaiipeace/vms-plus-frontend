import { useMemo } from "react";
import dayjs from "dayjs";
import { VehicleTimelineListTableData } from "@/app/types/vehicle-management/vehicle-timeline-type";
import { createColumnHelper } from "@tanstack/react-table";
import TripTimelineItem from "./trip-timeline-item";

export const useColumns = (
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
                        className: `sticky left-0 z-0 bg-white min-w-[180px] max-w-[180px] border-b border-gray-500 ${selectedOption !== "all" && "border-r"}`,
                    },
                }
            ),
        ];

        const additionalColumns = selectedOption === "all"
            ? [
                columnHelper.accessor("vehicleType", {
                    header: () => <span>ประเภทยานพาหนะ</span>,
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
                        className: `sm:table-cell hidden sticky left-[505px] z-0 bg-white min-w-[150px] max-w-[150px] fixed-column-line border-b border-gray-500 ${selectedOption === "all" && "border-r"}`,
                    },
                }),
            ]
            : [];

        const dateColumns = dates.map(({ key, date, day, month, holiday, fullMonth, fullYear }) =>
            columnHelper.accessor((row) => ({ timeline: row.timeline }), {
                id: key,
                header: () => {
                    const isToday = dayjs().format("YYYY-MM-DD") === date.toString();
                    return (
                        <div className="flex flex-col items-center text-sm">
                            <span className={`font-semibold ${isToday ? "text-white bg-brand-900 rounded-full p-1" : ""}`}>{day}</span>
                            <span className="font-normal">{month}</span>
                        </div>
                    );
                },
                cell: (info) => {
                    const { timeline } = info.getValue();
                    const trips = timeline[key] || [];
                    const todayTrips = trips.filter((item: any) => dayjs(item.startDate).format("YYYY/MM/DD") === date);
                    const visibleTrips = todayTrips.slice(0, 2);
                    const hiddenCount = todayTrips.length - visibleTrips.length;

                    if (!todayTrips.length) return null;

                    const handleClickOpenDetailModal = (items: any[]) => {
                        setTripDetails(items);
                        setDateSelected(`${day} ${fullMonth} ${fullYear}`);
                        handleOpenDetailModal();
                    };

                    return (
                        <div className={`flex flex-col min-h-[140px] gap-1 px-1 ${holiday ? "text-white bg-gray-100" : ""}`}>
                            {visibleTrips.map((item: any) => (
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
            })
        );

        return [...baseColumns, ...additionalColumns, ...dateColumns];
    }, [columnHelper, dates, selectedOption, lastMonth]);
