import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import PaginationControls from "../table/pagination-control";
import { fetchVehicles } from "@/services/vehicleService";
import VehicleNoData from "../vehicle-management/noData";
import FilterModal, { FilterModalRef } from "../vehicle-management/filterModal";
import ReportModal, { ReportModalRef } from "../vehicle-management/vehicleReportModal";
import VehicleTable from "../table/vehicle-table";
import { PaginationType, VehicleInputParams, VehicleListParams, VehicleManagementApiResponse } from "@/app/types/vehicle-management/vehicle-list-type";
import SearchInput from "../vehicle-management/input/search";
import { debounce } from "lodash";

export default function VehicleFlow() {
    const [pagination, setPagination] = useState<PaginationType>({
        limit: 10,
        page: 1,
        total: 0,
        totalPages: 0,
    });

    const paramsInitial = {
        search: "",
        vehicle_owner_dept_sap: "",
        ref_vehicle_category_code: "",
        ref_vehicle_status_code: "",
        ref_fuel_type_id: "",
        is_tax_credit: "",
        order_by: "",
        order_dir: "",
        page: pagination.page,
        limit: pagination.limit,
    };

    const [dataRequest, setDataRequest] = useState<VehicleManagementApiResponse[]>([]);
    const [selectedRows, setSelectedRows] = useState<string[]>([]);
    const [params, setParams] = useState<VehicleListParams>(paramsInitial);
    const [filterCount, setFilterCount] = useState(0);

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
        let countFilters = 0;
        const fetchData = async () => {
            try {
                const response = await fetchVehicles(params);
                const { total, totalPages } = response.pagination;

                setDataRequest(response.vehicles);
                setPagination({
                    limit: params.limit ?? pagination.limit,
                    page: params.page ?? pagination.page,
                    total,
                    totalPages,
                });
            } catch (error) {
                console.error("Error fetching vehicles:", error);
            }

            Object.keys(params).forEach((key) => {
                if (
                    key === "is_tax_credit" ||
                    key === "ref_vehicle_status_code"
                ) {
                    const value = params[key];
                    if (value && value.trim() !== "") {
                        countFilters += value.split(",").length;
                    }
                }
            });
            setFilterCount(countFilters);
        };

        fetchData();
    }, [params]);

    const handlePageChange = (newPage: number) => {
        setParams((prevParams: any) => ({ ...prevParams, page: newPage }));
    };

    const handlePageSizeChange = (newLimit: string | number) => {
        const limit = typeof newLimit === "string" ? parseInt(newLimit, 10) : newLimit;
        setParams((prevParams) => ({ ...prevParams, limit, page: 1 }));
    };

    const handleClearAllFilters = () => {
        setParams(paramsInitial);
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
            ref_vehicle_status_code: params.vehicleStatus.join(","),
        }));
    };

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

    const debouncedSetParams = useMemo(
        () =>
            debounce((value: string) => {
                if (value.length > 2 || value.length === 0) {
                    setParams((prev) => ({
                        ...prev,
                        search: value,
                        page: 1
                    }));
                }
            }, 500),
        []
    );

    return (
        <div>
            {/* ----- Header ----- */}
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

            {/* ----- Search and Filter Section ----- */}
            <div className="flex justify-between items-center mb-4">
                <SearchInput
                    defaultValue={params.search}
                    placeholder="เลขทะเบียน, ยี่ห้อ, รุ่น"
                    onSearch={(value) => debouncedSetParams(value)}
                />

                <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mt-5">
                    <div className="flex gap-4">
                        <button
                            onClick={handleOpenFilterModal}
                            className="btn btn-secondary btn-filtermodal h-[40px] min-h-[40px]"
                        >
                            <i className="material-symbols-outlined">filter_list</i>
                            <span className="text-sm font-bold">ตัวกรอง</span>
                            <span className="badge badge-brand badge-outline rounded-[50%]">{filterCount}</span>
                        </button>
                        <button
                            className="btn btn-secondary btn-filtersmodal h-[40px] min-h-[40px] flex justify-center items-center"
                            onClick={handleOpenReportModal}
                            disabled={!selectedRows.length}>
                            <i className="material-symbols-outlined">download</i>
                            <span className="text-sm font-bold">รายงาน</span>
                            <span className="badge badge-brand badge-outline rounded-[50%]">{selectedRows.length}</span>
                        </button>
                        <button
                            disabled={true}
                            className="btn btn-primary h-[40px] min-h-[40px] text-white hidden md:block">
                            <i className="material-symbols-outlined">add</i>
                            <span className="text-sm font-bold">สร้างข้อมูล</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* ----- Vehicle Table or No Data ----- */}
            {renderTableOrNoData()}

            <FilterModal ref={filterModalRef} onSubmitFilter={handleFilterSubmit} flag="TABLE_LIST" />
            <ReportModal ref={reportModalRef} selected={selectedRows} />
        </div>
    );
}