import { useEffect, useRef, useState } from "react";
import RequestListTable from "../table/timeline-list-table";
import FilterModal, { FilterModalRef } from "../vehicle/filterModal";
import { getVehicleTimeline } from "@/services/vehicleService";
import "flatpickr/dist/themes/material_blue.css";
import DateRangePicker from "../vehicle/input/dateRangeInput";
import dayjs from "dayjs";
import VehicleStatus from "../vehicle/status";
import SearchInput from "../vehicle/input/search";
import VehicleTimeLineDetailModal, { VehicleTimelineRef } from "../vehicle/vehicle-timeline-detail-modal";
import { PaginationType } from "@/app/types/vehicle-management/vehicle-list-type";
import PaginationControls from "../table/pagination-control";
import VehicleNoData from "../vehicle/noData";

export default function VehicleTimeLine() {
    const [dataRequest, setDataRequest] = useState<any[]>([]);
    const [pagination, setPagination] = useState<PaginationType>({
        limit: 10,
        page: 1,
        total: 0,
        totalPages: 0,
    });
    const [params, setParams] = useState({
        search: "",
        start_date: dayjs().startOf("month").format("YYYY-MM-DD"),
        end_date: dayjs().endOf("month").format("YYYY-MM-DD"),
        page: pagination.page,
        limit: pagination.limit,
    });
    const [showDropdown, setShowDropdown] = useState(false);
    const [selectedOption, setSelectedOption] = useState<'all' | 'first'>('all');

    const filterModalRef = useRef<FilterModalRef>(null);
    const vehicleTimelineDetailRef = useRef<VehicleTimelineRef>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await getVehicleTimeline(params);
                setDataRequest(response.vehicles);

                const { total, totalPages } = response.pagination;
                setPagination({
                    limit: params.limit,
                    page: params.page,
                    total,
                    totalPages,
                });
            } catch (error) {
                console.error("Error fetching vehicle timeline data:", error);
            }
        };

        fetchData();
    }, [params]);

    const handleOpenFilterModal = () => filterModalRef.current?.open();
    const handleOpenDetailModal = () => vehicleTimelineDetailRef.current?.open();
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
        setParams((prev) => ({
            ...prev,
            vehicel_car_type_detail: filterParams.vehicleType,
            vehicle_owner_dept_sap: filterParams.vehicleDepartment,
        }));
    };

    const handleClearAllFilters = () => {
        setParams({
            search: "",
            start_date: dayjs().startOf("month").format("YYYY-MM-DD"),
            end_date: dayjs().endOf("month").format("YYYY-MM-DD"),
            page: 1,
            limit: 10,
        });
    };

    const Header = () => (
        <div className="flex gap-4 border-l-8 border-brand-900 p-4 rounded-none">
            <span className="text-xl font-bold">ยานพาหนะ</span>
            <span className="font-bold text-gray-500 border border-gray-300 px-2 py-1 rounded-lg text-sm">
                {pagination.total} คัน
            </span>
        </div>
    );

    const Actions = () => (
        <div className="flex flex-col md:flex-row md:justify-between gap-4 mt-5">
            <SearchInput
                defaultValue={params.search}
                placeholder="เลขทะเบียน, ยี่ห้อ, รุ่น"
                onChange={(value: string) => setParams((prev) => ({ ...prev, search: value }))}
            />
            <div className="flex gap-4">
                <div className="flex flex-wrap items-center gap-2">
                    <VehicleStatus status="รออนุมัติ" />
                    <VehicleStatus status="ไป - กลับ" />
                    <VehicleStatus status="ค้างแรม" />
                    <VehicleStatus status="เสร็จสิ้น" />
                </div>
                <DateRangePicker
                    defaultValue={{
                        startDate: dayjs(params.start_date).toDate(),
                        endDate: dayjs(params.end_date).toDate(),
                    }}
                    onChange={(startDate, endDate) =>
                        setParams((prev) => ({
                            ...prev,
                            start_date: startDate ? dayjs(startDate).format("YYYY-MM-DD") : "",
                            end_date: endDate ? dayjs(endDate).format("YYYY-MM-DD") : "",
                        }))
                    }
                /> 
                <button
                    onClick={handleOpenFilterModal}
                    className="flex items-center gap-1 px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-700 shadow-sm hover:bg-gray-100 transition"
                >
                    <i className="material-symbols-outlined text-lg">filter_list</i>
                    <span className="text-base font-semibold">ตัวกรอง</span>
                </button>
                <button
                    onClick={toggleDropdown}
                    className="flex items-center gap-1 px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-700 shadow-sm hover:bg-gray-100 transition"
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
            <div>
                {showDropdown && (
                    <div className="absolute right-0 mt-2 w-64 bg-white border border-gray-300 rounded-xl shadow z-50">
                        <button
                            onClick={() => handleSelect("all")}
                            className="flex items-center px-4 py-2 text-sm hover:bg-gray-100"
                            role="menuitem"
                        >
                            {selectedOption === "all" ? (
                                <i className="material-symbols-outlined text-blue-600 mr-2">check</i>
                            ) : (
                                <span className="w-4 mr-2" />
                            )}
                            แสดงทุกคอลัมน์
                        </button>
                        <button
                            onClick={() => handleSelect("first")}
                            className="flex items-center px-4 py-2 text-sm hover:bg-gray-100"
                            role="menuitem"
                        >
                            {selectedOption === "first" ? (
                                <i className="material-symbols-outlined text-blue-600 mr-2">check</i>
                            ) : (
                                <span className="w-4 mr-2" />
                            )}
                            แสดงเฉพาะคอลัมน์แรก
                        </button>
                    </div>
                )}

                {dataRequest.length !== 0 ? (
                    <>
                        <RequestListTable dataRequest={dataRequest} params={params} selectedOption={selectedOption}/>
                        <PaginationControls
                            pagination={pagination}
                            onPageChange={handlePageChange}
                            onPageSizeChange={handlePageSizeChange}
                        />
                    </>
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

    return (
        <div>
            <Header />
            <Actions />
            <RenderTableOrNoData />
            <FilterModal ref={filterModalRef} onSubmitFilter={handleFilterSubmit} flag="TIMELINE" />
            <VehicleTimeLineDetailModal ref={vehicleTimelineDetailRef} />
        </div>
    );
}
