import { useEffect, useRef, useState } from "react";
import PaginationControls from "../table/pagination-control";
import { fetchVehicles } from "@/services/vehicleService";
import VehicleNoData from "../vehicle/noData";
import FilterModal, { FilterModalRef } from "../vehicle/filterModal";
import ReportModal, { ReportModalRef } from "../vehicle/vehicleReportModal";
import VehicleTable from "../table/vehicle-table";
import { PaginationType, VehicleInputParams, VehicleManagementApiResponse } from "@/app/types/vehicle-management/vehicle-list-type";

export default function VehicleFlow() {
    const [dataRequest, setDataRequest] = useState<VehicleManagementApiResponse[]>([]);
    const [selectedRows, setSelectedRows] = useState<string[]>([]);
    const [pagination, setPagination] = useState<PaginationType>({
        limit: 10,
        page: 1,
        total: 0,
        totalPages: 0,
    });
    const [params, setParams] = useState({
        search: "",
        vehicle_owner_dept_sap: "",
        ref_vehicle_category_code: "",
        ref_vehicle_status_code: "",
        ref_fuel_type_id: "",
        order_by: "",
        order_dir: "",
        page: pagination.page,
        limit: pagination.limit,
    });

    // Handle Filter Modal
    const filterModalRef = useRef<FilterModalRef>(null);
    const handleOpenFilterModal = () => {
        filterModalRef.current?.open();
    };

    //Handle Report Modal
    const reportModalRef = useRef<ReportModalRef>(null);
    const handleOpenReportModal = () => {
        reportModalRef.current?.open();
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetchVehicles(params);
                const { total, totalPages } = response.pagination;

                setDataRequest(response.vehicles);
                setPagination({
                    limit: params.limit,
                    page: params.page,
                    total,
                    totalPages,
                });
            } catch (error) {
                console.error("Error fetching vehicles:", error);
            }
        };

        fetchData();
    }, [params]);

    const handlePageChange = (newPage: number) => {
        setParams((prevParams) => ({ ...prevParams, page: newPage }));
    };

    const handlePageSizeChange = (newLimit: string | number) => {
        const limit = typeof newLimit === "string" ? parseInt(newLimit, 10) : newLimit;
        setParams((prevParams) => ({ ...prevParams, limit, page: 1 }));
    };

    const handleClearAllFilters = () => {
        setParams({
            search: "",
            vehicle_owner_dept_sap: "",
            ref_vehicle_category_code: "",
            ref_vehicle_status_code: "",
            ref_fuel_type_id: "",
            order_by: "",
            order_dir: "",
            page: 1,
            limit: pagination.limit,
        });
    };

    const handleSelectItem = (ids: string[]) => {
        setSelectedRows(ids);
    }

    const handleFilterSubmit = (params: VehicleInputParams) => {
        setParams((prevParams) => ({
            ...prevParams,
            ref_fuel_type_id: params.fuelType,
            ref_vehicle_category_code: params.vehicleType,
            vehicle_owner_dept_sap: params.vehicleDepartment,
            is_tax_credit: params.taxVehicle.join(","),
            ref_vehicle_status_code: params.vehicleStatus.map(item => item).join(","),
        }));
    };

    const renderHeader = () => (
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

    const renderActions = () => (
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mt-5">
            <div className="block">
                <div className="input-group input-group-search hidden">
                    <div className="input-group-prepend">
                        <span className="input-group-text search-ico-info">
                            <i className="material-symbols-outlined">search</i>
                        </span>
                    </div>
                    <input
                        type="text"
                        id="search1"
                        className="form-control dt-search-input"
                        placeholder="เลขทะเบียน, ยี่ห้อ, รุ่น"
                        value={params.search}
                        onChange={(e) => setParams({ ...params, search: e.target.value })}
                    />
                </div>
            </div>

            <div className="flex gap-4">
                <button
                    onClick={handleOpenFilterModal}
                    className="flex items-center gap-1 px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-700 shadow-sm hover:bg-gray-100 transition"
                >
                    <i className="material-symbols-outlined">filter_list</i>
                    <span className="text-sm font-bold">ตัวกรอง</span>
                </button>
                <button
                    className="flex items-center gap-1 px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-700 shadow-sm hover:bg-gray-100 transition disabled:bg-gray-100"
                    onClick={handleOpenReportModal}
                    disabled={!selectedRows.length}>
                    <i className="material-symbols-outlined">download</i>
                    <span className="text-sm font-bold">รายงาน</span>
                    <span className="border border-gray-300 w-6 h-6 rounded-full">{selectedRows.length}</span>
                </button>
                <button className="flex items-center gap-1 px-4 py-2 rounded-lg border border-gray-300 bg-primary-default text-gray-700 shadow-sm transition">
                    <i className="material-symbols-outlined text-white">add</i>
                    <span className="text-sm font-bold text-white">สร้างข้อมูล</span>
                </button>
            </div>
        </div>
    );

    const renderTableOrNoData = () => {
        if (dataRequest.length > 0) {
            return (
                <>
                    <VehicleTable data={dataRequest} useModal={handleSelectItem} />
                    <PaginationControls
                        pagination={pagination}
                        onPageChange={handlePageChange}
                        onPageSizeChange={handlePageSizeChange}
                    />
                </>
            );
        }

        if (dataRequest.length === 0) {
            return (
                <VehicleNoData
                    imgSrc={"/assets/img/empty/search_not_found.png"}
                    title={"ไม่พบข้อมูล"}
                    desc={"เปลี่ยนคำค้นหรือเงื่อนไขแล้วลองใหม่อีกครั้ง"}
                    button={"ล้างตัวกรอง"}
                    useModal={handleClearAllFilters}
                />
            );
        }

        // <VehicleNoData
        //     imgSrc={"/assets/img/empty/add_vehicle.svg"}
        //     title={"เพิ่มยานพาหนะ"}
        //     desc={"เริ่มต้นด้วยการสร้างข้อมูลยานพาหนะคันแรก"}
        //     button={"สร้างข้อมูล"}
        //     icon={"add"}
        //     btnType={"primary"}
        //     link={"/vehicle/create"}
        //     displayBtn={true}
        // />
        return null;
    };

    return (
        <div>
            {renderHeader()}
            {renderActions()}
            {renderTableOrNoData()}

            <FilterModal ref={filterModalRef} onSubmitFilter={handleFilterSubmit} flag="TABLE_LIST" />
            <ReportModal ref={reportModalRef} selected={selectedRows} />
        </div>
    );
}