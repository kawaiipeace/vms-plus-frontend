import React, { useEffect, useMemo, useRef, useState } from "react";
import FilterModal, { FilterModalRef } from "../vehicle-management/filterModal";
import { getVehicleTimeline } from "@/services/vehicleService";
import "flatpickr/dist/themes/material_blue.css";
import dayjs from "dayjs";
import VehicleStatus from "../vehicle-management/vehicle-status-with-icon";
import PaginationControls from "../table/pagination-control";
import VehicleNoData from "../vehicle-management/noData";
import { DateRange } from "react-day-picker";
import { PaginationType } from "@/app/types/vehicle-management/vehicle-list-type";
import DateRangePicker from "../vehicle-management/input/dateRangeInput";
import RequestListTable from "../table/vehicle-timeline/request-list-table";
import SearchInput from "../vehicle-management/input/search";
import { TripStatus } from "@/utils/vehicle-constant";
import { debounce } from "lodash";
import { VehicleTimelineSearchParams } from "@/app/types/vehicle-management/vehicle-timeline-type";

export default function VehicleTimeLine() {
    // Setting Initial
    const statusOptions = [
        { value: '1', status: TripStatus['Pending'] },
        { value: '2', status: TripStatus['RoundTrip'] },
        { value: '3', status: TripStatus['Overnight'] },
        { value: '4', status: TripStatus['Completed'] },
    ];

    // Function

    // Manage Filter Params
    const [filterParams, setFilterParams] = useState<string[]>(['1', '2', '3', '4']);

    useEffect(() => {
        setParams((prev) => ({
            ...prev,
            ref_timeline_status_id: filterParams.join(','),
        }));
    }, [filterParams]);

    const toggleFilter = (value: string) => {
        setFilterParams((prev) =>
            prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
        );
    };

    const [dataRequest, setDataRequest] = useState<any[]>([]);
    const [lastMonth, setLastMonth] = useState<string>('');
    const [showDropdown, setShowDropdown] = useState(false);
    const [selectedOption, setSelectedOption] = useState<'all' | 'first'>('all');
    const [selectedRange, setSelectedRange] = useState<DateRange | undefined>({
        from: dayjs().startOf("month").toDate(),
        to: dayjs().endOf("month").toDate(),
    });
    const [pagination, setPagination] = useState<PaginationType>({
        limit: 10,
        page: 1,
        total: 0,
        totalPages: 0,
    });

    const initialParams = {
        search: "",
        start_date: dayjs().startOf("month").format("YYYY-MM-DD"),
        end_date: dayjs().endOf("month").format("YYYY-MM-DD"),
        vehicle_owner_dept_sap: "",
        vehicle_car_type_detail: "",
        ref_timeline_status_id: "",
        page: pagination.page,
        limit: pagination.limit,
    };

    const [params, setParams] = useState<VehicleTimelineSearchParams>(initialParams);
    const [filterCount, setFilterCount] = useState(0);

    // Filter Modal Ref
    const filterModalRef = useRef<FilterModalRef>(null);

    useEffect(() => {
        let countFilters = 0;
        const fetchData = async () => {
            console.log('params', params)
            try {
                const response = await getVehicleTimeline(params);
                setDataRequest(response.vehicles);
                setLastMonth(response.last_month);

                const { total, totalPages } = response.pagination;
                setPagination({
                    limit: params.limit ?? pagination.limit,
                    page: params.page ?? pagination.page,
                    total,
                    totalPages,
                });
            } catch (error) {
                console.error("Error fetching vehicle timeline data:", error);
            }

            Object.keys(params).forEach((key) => {
                if (
                    key === "ref_timeline_status_id"
                ) {
                    const value = params[key];
                    if(value && value.trim() !== "") {
                        countFilters += value.split(",").length;
                    }
                }
              });
            setFilterCount(countFilters);
        };

        fetchData();
    }, [params]);

    const handleOpenFilterModal = () => filterModalRef.current?.open();
    const toggleDropdown = () => setShowDropdown((prev) => !prev);
    const handleSelect = (option: 'all' | 'first') => {
        setSelectedOption(option);
        setShowDropdown(false);
    };

    const handlePageChange = (newPage: number) => {
        setParams((prevParams) => ({ ...prevParams, page: newPage }));
    };

    const handlePageSizeChange = (newLimit: string | number) => {
        const limit = typeof newLimit === "string" ? parseInt(newLimit, 10) : newLimit;
        setParams((prevParams) => ({ ...prevParams, limit, page: 1 }));
    };

    const handleFilterSubmit = (filterParams: any) => {
        setFilterParams(() => [...filterParams.vehicleBookingStatus]);
    };

    const handleClearAllFilters = () => {
        setParams(initialParams);
    };

    const Header = () => (
        <div className="page-section-header border-0 mt-5">
            <div className="page-header-left">
                <div className="page-title">
                    <span className="page-title-label">ยานพาหนะ</span>
                    <span className="font-bold text-gray-500 border border-gray-300 px-2 py-1 rounded-lg text-sm">
                        {pagination.total ?? 0} คัน
                    </span>
                </div>
            </div>
        </div>
    );

    const Actions = () => (
        <div className="flex gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex gap-4 md:flex-row md:items-center">
                <div className="flex flex-wrap items-center gap-2">
                    <div className="flex flex-wrap items-center gap-2">
                        {statusOptions.map(({ value, status }) => (
                            <button key={value} onClick={() => toggleFilter(value)}>
                                <VehicleStatus status={status} isActive={filterParams.includes(value)} />
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <div className="flex flex-wrap gap-2 justify-start md:justify-end">
                <DateRangePicker
                    date={selectedRange}
                    onChange={(range) => {
                        setParams((prev) => ({
                            ...prev,
                            start_date: range?.from ? dayjs(range?.from).format("YYYY-MM-DD") : "",
                            end_date: range?.to ? dayjs(range?.to).format("YYYY-MM-DD") : "",
                        }));

                        setSelectedRange(range || undefined);
                    }}
                />
                <button
                    onClick={handleOpenFilterModal}
                    className="btn btn-secondary btn-filtermodal h-[40px] min-h-[40px]"
                >
                    <i className="material-symbols-outlined">filter_list</i>
                    <span className="text-base font-bold">ตัวกรอง</span>
                    <span className="badge badge-brand badge-outline rounded-[50%]">{filterCount}</span>
                </button>

                <button
                    onClick={toggleDropdown}
                    className="btn btn-secondary h-[40px] min-h-[40px] flex items-center justify-center relative"
                >
                    <i className="material-symbols-outlined text-lg">view_column</i>
                </button>
            </div>
        </div>
    );

    const RenderTableOrNoData = () => {
        const dropdownRef = useRef(null);

        useEffect(() => {
            const handleClickOutside = (event: MouseEvent) => {
                if (dropdownRef.current && !(dropdownRef.current as any).contains(event.target)) {
                    setShowDropdown(false);
                }
            };
            document.addEventListener("mousedown", handleClickOutside);
            return () => document.removeEventListener("mousedown", handleClickOutside);
        }, []);

        return (
            <div className="relative">
                {showDropdown && (
                    <DropdownMenu
                        dropdownRef={dropdownRef}
                        selectedOption={selectedOption}
                        handleSelect={handleSelect}
                    />
                )}

                {dataRequest.length !== 0 ? (
                    <div className="overflow-x-auto mt-4">
                        <RequestListTable
                            dataRequest={dataRequest}
                            params={params}
                            selectedOption={selectedOption}
                            lastMonth={lastMonth}
                        />
                        <PaginationControls
                            pagination={pagination}
                            onPageChange={handlePageChange}
                            onPageSizeChange={handlePageSizeChange}
                        />
                    </div>
                ) : (
                    <VehicleNoData
                        imgSrc={"/assets/img/empty/search_not_found.png"}
                        title={"ไม่พบข้อมูล"}
                        desc={"เปลี่ยนคำค้นหรือเงื่อนไขแล้วลองใหม่อีกครั้ง"}
                        button={"ล้างตัวกรอง"}
                        useModal={handleClearAllFilters}
                    />
                )}
            </div>
        );
    };

    const debouncedSetParams = useMemo(
        () =>
            debounce((value: string) => {
                if (value.length > 2 || value.length === 0) {
                    setParams((prev) => ({ ...prev, search: value }));
                }
            }, 500),
        []
    );

    return (
        <div className="px-4 sm:px6 lg:px8 py6">
            <Header />
            <div className="flex justify-between items-center mb-4">
                <SearchInput
                    defaultValue={params.search}
                    placeholder="เลขทะเบียน, ยี่ห้อ, รุ่น"
                    onSearch={(value) => debouncedSetParams(value)}
                />
                <Actions />
            </div>
            <RenderTableOrNoData />
            <FilterModal
                ref={filterModalRef}
                onSubmitFilter={handleFilterSubmit}
                defaultVehicleBookingStatus={filterParams}
                flag="TIMELINE" />
        </div>
    );
}

const DropdownMenu = ({ dropdownRef, selectedOption, handleSelect }: any) => (
    <div
        ref={dropdownRef}
        className="absolute right-0 mt-2 w-64 bg-white border border-gray-300 rounded-xl shadow z-50"
    >
        {["all", "first"].map((option) => (
            <button
                key={option}
                onClick={() => handleSelect(option)}
                className="flex items-center px-4 py-2 text-sm hover:bg-gray-100"
                role="menuitem"
            >
                {selectedOption === option ? (
                    <i className="material-symbols-outlined text-blue-600 mr-2">check</i>
                ) : (
                    <span className="w-4 mr-2" />
                )}
                {option === "all" ? "แสดงทุกคอลัมน์" : "แสดงเฉพาะคอลัมน์แรก"}
            </button>
        ))}
    </div>
);
