"use client";

import React, { useState, useRef, useEffect, Suspense } from "react";
import FilterModal from "@/components/drivers-management/filterModal";
import ZeroRecord from "@/components/zeroRecord";
import DriverListTable from "@/components/drivers-management/table/driverListTable";
import PaginationControls from "@/components/table/pagination-control";
import CreateDriverManagementModal from "@/components/modal/createDriverManagementModal";
import UploadCSVModal from "@/components/modal/uploadCSVModal";
import DriverActiveModal from "@/components/drivers-management/modal/driverActiveModal";
import DriverExportReportModal from "@/components/drivers-management/modal/driverExportReportModal";
import ToastCustom from "@/components/toastCustom";

// import dayjs from "dayjs";

import { driversMamagement, updateDriverStatus, driverDelete } from "@/services/driversManagement";
import { RequestListType } from "@/app/types/request-list-type";

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

function ToastCustomComponent({ type }: { type: { text: string; value?: string }; driverName?: string }) {
  return (
    <>
      {type.text === "import" && (
        <ToastCustom
          title="สร้างข้อมูลพนักงานขับรถสำเร็จ"
          desc={<span>นำเข้าข้อมูลพนักงานขับรถ {type.value} คน เรียบร้อยแล้ว</span>}
          status="success"
        />
      )}
    </>
  );
}

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
  const [data, setData] = useState<RequestListType[]>([]);
  const [pagination, setPagination] = useState<PaginationType>(paginationDefault);
  const [driverUid, setDriverUid] = useState<string>("");
  const [driverUpdated, setDriverUpdated] = useState<boolean>(false); // [updated]
  // const [pagination, setPagination] = useState<PaginationType>(pagenation);
  const [selectedRow, setSelectedRow] = useState({});
  const [updateType, setUpdateType] = useState<{ text: string; value: string }>({ text: "", value: "" });
  // const [resultNonFound, setResultNonFound] = useState(false);
  const filterModalRef = useRef<{
    openModal: () => void;
    closeModal: () => void;
  } | null>(null);

  const createDriverManagementModalRef = useRef<{
    openModal: () => void;
    closeModal: () => void;
  } | null>(null);

  const uploadCSVModalRef = useRef<{
    openModal: () => void;
    closeModal: () => void;
  } | null>(null);

  const driverActiveModalRef = useRef<{
    openModal: () => void;
    closeModal: () => void;
  } | null>(null);

  const driverExportReportModalRef = useRef<{
    openModal: () => void;
    closeModal: () => void;
  } | null>(null);

  useEffect(() => {
    const fetchDriversListFunc = async () => {
      try {
        const response = await driversMamagement(params);
        const result = response.data;
        const { total, totalPages } = result.pagination;
        // console.log(params.limit);
        setData(result.drivers ?? []);
        setPagination({
          limit: params.limit,
          page: params.page,
          total,
          totalPages,
        });
        setDriverUid("");
        setDriverUpdated(false);
      } catch (error) {
        console.error("Error fetching drivers list:", error);
      }
    };

    fetchDriversListFunc();
  }, [params, driverUpdated, updateType]);

  // const handleFilterSubmit = ({
  //   selectedStatuses,
  //   selectedStartDate,
  //   selectedEndDate,
  // }: {
  //   selectedStatuses: string[];
  //   selectedStartDate: string;
  //   selectedEndDate: string;
  // }) => {
  //   const mappedNames = selectedStatuses.map(
  //     (code) => summary.find((item) => item.ref_request_status_code === code)?.ref_request_status_name || code
  //   );

  //   const date = selectedStartDate + " - " + selectedEndDate;

  //   setFilterNames(mappedNames);
  //   if (selectedStartDate && selectedEndDate) {
  //     setFilterDate(date);
  //   }

  //   setFilterNum(selectedStatuses.length);
  //   setParams((prevParams) => ({
  //     ...prevParams,
  //     ref_request_status_code: selectedStatuses.join(","),
  //     startdate: selectedStartDate && dayjs(selectedStartDate).subtract(543, "year").format("YYYY-MM-DD"),
  //     enddate: selectedEndDate && dayjs(selectedEndDate).subtract(543, "year").format("YYYY-MM-DD"),
  //   }));
  // };

  const handleFilter = (filter: {
    selectedStatuses: string[];
    selectedDriverStatus: string[];
    selectedWorkType: string[];
    selectedStartDate: string;
    selectedEndDate: string;
    driverDepartmentOptions: { value: string; label: string | React.ReactNode };
  }) => {
    console.log("Filter applied", filter);
    setParams((prevParams) => ({
      ...prevParams,
      driver_dept_sap_work: filter.driverDepartmentOptions.value,
      work_type: filter.selectedWorkType.join(","),
      ref_driver_status_code: filter.selectedStatuses.join(","),
      is_active: filter.selectedDriverStatus.join(","),
      driver_license_end_date: filter.selectedStartDate,
      approved_job_driver_end_date: filter.selectedEndDate,
    }));
    filterModalRef.current?.closeModal();
  };

  const handleSearch = (search: string) => {
    setParams((prevParams) => ({
      ...prevParams,
      search,
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

  const handleToggleChange = (driverId: string) => {
    setDriverUid(driverId);
  };

  const handleUpdateStatusDriver = (driverUid: string, isActive: string) => {
    // console.log(driverUid);
    try {
      if (driverUid) {
        updateDriverStatus(driverUid, isActive)
          .then((response) => {
            console.log("Driver status updated successfully:", response.data);
            setDriverUpdated(true);
          })
          .catch((error) => {
            console.error("Error updating driver status:", error);
          });
      }
    } catch (error) {
      console.error("Error updating driver status:", error);
    }
  };

  const handleDeleteDriver = async (driverName: string, driverUid: string) => {
    const params = {
      driver_name: driverName,
      mas_driver_uid: driverUid,
    };
    try {
      const response = await driverDelete(params);
      if (response.status === 200) {
        // Handle successful deletion
        console.log("Driver deleted successfully");
        setDriverUpdated(true);
      }
    } catch (error) {
      console.error("Error deleting driver:", error);
    }
  };

  const handleUpdateSelectedRow = (row: Record<string, string | undefined>) => {
    // console.log("Selected row:", row);
    setSelectedRow(row);
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
              onChange={(e) => handleSearch(e.target.value)}
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
            className="btn btn-secondary btn-filtersmodal h-[40px] min-h-[40px] flex gap-2 justify-center items-center"
            onClick={() => driverExportReportModalRef.current?.openModal()}
            disabled={Object.keys(selectedRow).length > 0 ? false : true}
          >
            <i className="material-symbols-outlined">download</i>
            รายงาน
            {Object.keys(selectedRow).length > 0 && (
              <span className="badge badge-brand badge-outline rounded-[50%]">{Object.keys(selectedRow).length}</span>
            )}
          </button>
          <button
            className="btn btn-primary h-[40px] min-h-[40px] hidden md:block"
            onClick={() => createDriverManagementModalRef.current?.openModal()}
          >
            <i className="material-symbols-outlined">add</i>
            สร้างข้อมูล
          </button>
        </div>
      </div>
      {data.length !== 0 ? (
        <>
          <div>
            {/* {data.map((item, index) => {
              return <div key={index}>{item.driver_name}</div>;
            })} */}
            <DriverListTable
              defaultData={data}
              pagination={pagination}
              driverActiveModalRef={
                driverActiveModalRef as React.RefObject<{ openModal: () => void; closeModal: () => void }>
              }
              handleToggleChange={handleToggleChange}
              onUpdateStatusDriver={handleUpdateStatusDriver}
              handleDeleteDriver={handleDeleteDriver}
              handleUpdateSelectedRow={handleUpdateSelectedRow}
            />
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

      <DriverActiveModal
        ref={driverActiveModalRef}
        title="ยืนยันปิดใช้งานพนักงานขับรถ"
        desc="คำขอที่สร้างไว้ก่อนหน้านี้ยังสามารถดำเนินการต่อได้จนสิ้นสุดการใช้งาน คุณต้องการปิดให้บริการจองพนักงานขับรถ ชั่วคราวใช่หรือไม่?"
        confirmText="ปิดใช้งานพนักงานชั่วคราว"
        onUpdateDriver={handleUpdateStatusDriver}
        driverUid={driverUid}
      />
      <UploadCSVModal
        ref={uploadCSVModalRef}
        onUpdateType={(text: string, value?: string) => setUpdateType({ text, value: value ?? "" })}
      />
      <CreateDriverManagementModal
        ref={createDriverManagementModalRef}
        csvModalRef={uploadCSVModalRef as React.RefObject<{ openModal: () => void; closeModal: () => void }>}
      />
      <DriverExportReportModal ref={driverExportReportModalRef} selectedRow={selectedRow} />
      <FilterModal ref={filterModalRef} onSubmitFilter={handleFilter} />
      <Suspense fallback={<div></div>}>
        <ToastCustomComponent type={updateType} />
      </Suspense>
    </>
  );
};

export default DriversListTab;
