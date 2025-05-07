"use client";

import React, { useState, useRef, useEffect } from "react";
import FilterModal from "@/components/modal/filterModal";
import ZeroRecord from "@/components/zeroRecord";
import DriverListTable from "@/components/drivers-management/table/driverListTable";
import PaginationControls from "@/components/table/pagination-control";
import CreateDriverManagementModal from "@/components/modal/createDriverManagementModal";

import dayjs from "dayjs";

import { driversMamagement } from "@/services/driversManagement";
import { RequestListType, summaryType } from "@/app/types/request-list-type";

interface PaginationType {
  limit: number;
  page: number;
  total: number;
  totalPages: number;
}

const paginationDefault: PaginationType = {
  limit: 10,
  page: 1,
  total: 0,
  totalPages: 0,
};

const DriversListTab = () => {
  const [params, setParams] = useState({
    search: "",
    driver_dept_sap_work: "",
    work_type: "",
    ref_driver_status_code: "",
    is_active: "",
    driver_license_end_date: "",
    approved_job_driver_end_date: "",
    order_by: "",
    order_dir: "",
    page: 1,
    limit: 10,
  });
  const [summary, setSummary] = useState<summaryType[]>([]);
  const [filterNum, setFilterNum] = useState(0);
  const [filterNames, setFilterNames] = useState<string[]>([]);
  const [filterDate, setFilterDate] = useState<string>("");
  const [data, setData] = useState<RequestListType[]>([]);
  const [pagination, setPagination] = useState<PaginationType>(paginationDefault);
  // const [pagination, setPagination] = useState<PaginationType>(pagenation);
  const filterModalRef = useRef<{
    openModal: () => void;
    closeModal: () => void;
  } | null>(null);

  const createDriverManagementModalRef = useRef<{
    openModal: () => void;
    closeModal: () => void;
  } | null>(null);

  useEffect(() => {
    const fetchDriversListFunc = async () => {
      try {
        const response = await driversMamagement(params);
        const result = response.data;
        const { total, totalPages } = result.pagination;
        console.log(params.limit);
        setData(result.drivers ?? []);
        setPagination({
          limit: params.limit,
          page: params.page,
          total,
          totalPages,
        });
      } catch (error) {
        console.error("Error fetching drivers list:", error);
      }
    };

    fetchDriversListFunc();
  }, [params]);

  const handleFilterSubmit = ({
    selectedStatuses,
    selectedStartDate,
    selectedEndDate,
  }: {
    selectedStatuses: string[];
    selectedStartDate: string;
    selectedEndDate: string;
  }) => {
    const mappedNames = selectedStatuses.map(
      (code) => summary.find((item) => item.ref_request_status_code === code)?.ref_request_status_name || code
    );

    const date = selectedStartDate + " - " + selectedEndDate;

    setFilterNames(mappedNames);
    if (selectedStartDate && selectedEndDate) {
      setFilterDate(date);
    }

    setFilterNum(selectedStatuses.length);
    setParams((prevParams) => ({
      ...prevParams,
      ref_request_status_code: selectedStatuses.join(","),
      startdate: selectedStartDate && dayjs(selectedStartDate).subtract(543, "year").format("YYYY-MM-DD"),
      enddate: selectedEndDate && dayjs(selectedEndDate).subtract(543, "year").format("YYYY-MM-DD"),
    }));
  };

  const handlePageChange = (newPage: number) => {
    setParams((prevParams) => ({
      ...prevParams,
      page: newPage,
    }));
  };

  const handlePageSizeChange = (newLimit: string | number) => {
    const limit = typeof newLimit === "string" ? parseInt(newLimit, 10) : newLimit; // Convert to number if it's a string
    setParams((prevParams) => ({
      ...prevParams,
      limit,
      page: 1, // Reset to the first page when page size changes
    }));
  };

  return (
    <>
      <div className="page-section-header border-0 mt-5">
        <div className="page-header-left">
          <div className="page-title">
            <span className="page-title-label">พนักงานขับรถ</span>
          </div>
        </div>
      </div>
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div className="block">
          <div className="input-group input-group-search hidden">
            <div className="input-group-prepend">
              <span className="input-group-text search-ico-info">
                <i className="material-symbols-outlined">search</i>
              </span>
            </div>
            <input
              type="text"
              id="myInputTextField"
              className="form-control dt-search-input"
              placeholder="ชื่อ-นามสกุล, ชื่อเล่น, สังกัด"
            />
          </div>
        </div>

        <div className="flex gap-4">
          <button
            className="btn btn-secondary btn-filtersmodal h-[40px] min-h-[40px] block"
            onClick={() => filterModalRef.current?.openModal()}
          >
            <div className="flex items-center gap-1">
              <i className="material-symbols-outlined">filter_list</i>
              ตัวกรอง
            </div>
          </button>
          <button
            className="btn btn-primary h-[40px] min-h-[40px] hidden md:block"
            onClick={() => createDriverManagementModalRef.current?.openModal()}
          >
            <i className="material-symbols-outlined">add</i>
            สร้างคำขอใช้
          </button>
        </div>
      </div>
      {data.length !== 0 ? (
        <>
          <div className="hidden md:block">
            {/* {data.map((item, index) => {
              return <div key={index}>{item.driver_name}</div>;
            })} */}
            <DriverListTable defaultData={data} pagination={pagination} />
          </div>
          <PaginationControls
            pagination={pagination}
            onPageChange={handlePageChange}
            onPageSizeChange={handlePageSizeChange}
          />
        </>
      ) : (
        <>
          <ZeroRecord
            imgSrc="/assets/img/empty/add_driver.svg"
            title="เพิ่มพนักงานขับรถ"
            desc={<>เริ่มต้นด้วยการสร้างข้อมูลพนักงานขับรถคนแรก</>}
            button="สร้างข้อมูล"
            displayBtn={true}
            icon="add"
            link=""
          />
        </>
      )}

      <CreateDriverManagementModal ref={createDriverManagementModalRef} />
      <FilterModal ref={filterModalRef} statusData={summary} onSubmitFilter={handleFilterSubmit} />
    </>
  );
};

export default DriversListTab;
