"use client";

import { DriverLicListType } from "@/app/types/driver-lic-list-type";
import { summaryDriverType } from "@/app/types/request-list-type";
import RequestStatusBox from "@/components/requestStatusBox";
import ZeroRecord from "@/components/zeroRecord";
import { fetchDriverLicRequests } from "@/services/driver";
import { fetchDriverLicenseType } from "@/services/masterService";
import { convertToISO } from "@/utils/convertToISO";
import dayjs from "dayjs";
import buddhistEra from "dayjs/plugin/buddhistEra";
import { useEffect, useRef, useState } from "react";
import FilterDriverModal from "../annual-driver-license/filterDriverModal";
import DriverLicApproverListTable from "../table/driver-lic-approver-list-table";
import PaginationControls from "../table/pagination-control";
import { fetchFinalApproverRequests } from "@/services/bookingApprover";

dayjs.extend(buddhistEra);

interface PaginationType {
  limit: number;
  page: number;
  total: number;
  totalPages: number;
}

interface LicenseTypeOption {
  value: string;
  label: string;
}

interface ActiveFilter {
  type: "status" | "licenseType" | "date" | "year";
  value: string;
  displayName: string;
}



export default function DriverLicApproveFlow() {
  const [params, setParams] = useState({
    search: "",
    ref_request_annual_driver_status_code: "",
    ref_driver_license_type_code: "",
    start_created_request_datetime: "",
    end_driver_license_expire_date: "",
    annual_yyyy: "",
    order_by: "",
    order_dir: "",
    page: 1,
    limit: 10,
  });

  const [pagination, setPagination] = useState<PaginationType>({
    limit: 10,
    page: 1,
    total: 0,
    totalPages: 0,
  });

  const [dataRequest, setDataRequest] = useState<DriverLicListType[]>([]);
  const [summary, setSummary] = useState<summaryDriverType[]>([]);
  const [licenseTypeOptions, setLicenseTypeOptions] = useState<LicenseTypeOption[]>([]);
  const [activeFilters, setActiveFilters] = useState<ActiveFilter[]>([]);

  const filterModalRef = useRef<{
    openModal: () => void;
    closeModal: () => void;
  } | null>(null);

  const statusConfig: { [key: string]: { iconName: string; status: string } } = {
    "10": { iconName: "schedule", status: "info" },
    "11": { iconName: "reply", status: "warning" },
    "20": { iconName: "schedule", status: "info" },
    "21": { iconName: "reply", status: "warning" },
    "30": { iconName: "check", status: "success" },
    "90": { iconName: "delete", status: "default" },
  };

  const handlePageChange = (newPage: number) => {
    setParams((prev) => ({ ...prev, page: newPage }));
  };

  const handlePageSizeChange = (newLimit: string | number) => {
    const limit = typeof newLimit === "string" ? parseInt(newLimit, 10) : newLimit;
    setParams((prev) => ({ ...prev, limit, page: 1 }));
  };

  useEffect(() => {
    const fetchLicenseTypes = async () => {
      try {
        const response = await fetchDriverLicenseType();
        if (response.status === 200) {
          setLicenseTypeOptions(
            response.data.map((type: any) => ({
              value: type.ref_driver_license_type_code,
              label: type.ref_driver_license_type_name,
            }))
          );
        }
      } catch (error) {
        console.error("Error fetching license types:", error);
      }
    };

    fetchLicenseTypes();
  }, []);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const apiParams = {
          ...params,
          annual_yyyy: params.annual_yyyy ? (parseInt(params.annual_yyyy) - 543).toString() : "",
        };

        const response = await fetchFinalApproverRequests(params);



        if (response.status === 200) {
          setDataRequest(response.data.requests);
          console.log("Fetched requests:", response.data.requests);

          setSummary(response.data.summary);
               console.log("Fetched summary:", response.data.summary);
          setPagination(response.data.pagination);
        }
      } catch (error) {
        console.error("Error fetching requests:", error);
      }
    };

    fetchRequests();
  }, [params]);

  const handleFilterSubmit = ({
    selectedStatuses,
    selectedStartDate,
    selectedEndDate,
    licenseTypes = [],
    year = "",
  }: {
    selectedStatuses: string[];
    selectedStartDate: string;
    selectedEndDate: string;
    licenseTypes?: string[];
    year?: string;
  }) => {
    const newFilters: ActiveFilter[] = [];

    // Status filters
    selectedStatuses.forEach((code) => {
      const status = summary.find((s) => s.ref_request_annual_driver_status_code === code);
      if (status) {
        newFilters.push({
          type: "status",
          value: code,
          displayName: status.ref_request_annual_driver_status_name,
        });
      }
    });

    // License type filters
    licenseTypes.forEach((code) => {
      const licenseType = licenseTypeOptions.find((t) => t.value === code);
      if (licenseType) {
        newFilters.push({
          type: "licenseType",
          value: code,
          displayName: licenseType.label,
        });
      }
    });

    // Date range filter
    if (selectedStartDate && selectedEndDate) {
      newFilters.push({
        type: "date",
        value: `${selectedStartDate}|${selectedEndDate}`,
        displayName: `${dayjs(selectedStartDate).format("DD/MM/BBBB")} - ${dayjs(selectedEndDate).format(
          "DD/MM/BBBB"
        )}`,
      });
    }

    // Year filter
    if (year) {
      newFilters.push({
        type: "year",
        value: year,
        displayName: `ปี ${year}`,
      });
    }

    setActiveFilters(newFilters);

    // Update API params
    setParams((prev) => ({
      ...prev,
      ref_request_annual_driver_status_code: selectedStatuses.join(","),
      ref_driver_license_type_code: licenseTypes.join(","),
      start_created_request_datetime: selectedStartDate ? convertToISO(selectedStartDate, "00:00") : "",
      end_driver_license_expire_date: selectedEndDate ? convertToISO(selectedEndDate, "00:00") : "",
      annual_yyyy: year,
      page: 1,
    }));
  };

  const removeFilter = (index: number) => {
    const filterToRemove = activeFilters[index];
    const newFilters = activeFilters.filter((_, i) => i !== index);
    setActiveFilters(newFilters);

    setParams((prev) => {
      const newParams = { ...prev };

      switch (filterToRemove.type) {
        case "status":
          newParams.ref_request_annual_driver_status_code = newFilters
            .filter((f) => f.type === "status")
            .map((f) => f.value)
            .join(",");
          break;

        case "licenseType":
          newParams.ref_driver_license_type_code = newFilters
            .filter((f) => f.type === "licenseType")
            .map((f) => f.value)
            .join(",");
          break;

        case "date":
          newParams.start_created_request_datetime = "";
          newParams.end_driver_license_expire_date = "";
          break;

        case "year":
          newParams.annual_yyyy = "";
          break;
      }

      return newParams;
    });
  };

  const handleClearAllFilters = () => {
    setActiveFilters([]);
    setParams({
      search: "",
      ref_request_annual_driver_status_code: "",
      ref_driver_license_type_code: "",
      start_created_request_datetime: "",
      end_driver_license_expire_date: "",
      annual_yyyy: "",
      order_by: "",
      order_dir: "",
      page: 1,
      limit: 10,
    });
  };

  return (
    <>
      {/* Mobile status boxes */}
      <div className="md:hidden block">
        <div className="flex overflow-x-auto gap-4 mb-4 no-scrollbar w-[100vw]">
          {summary.map((item) => {
            const config = statusConfig[item.ref_request_annual_driver_status_code];
            if (!config) return null;
            return (
              <div key={item.ref_request_annual_driver_status_code} className="min-w-[38%] flex-shrink-0">
                <RequestStatusBox
                  iconName={config.iconName}
                  status={config.status as any}
                  title={item.ref_request_annual_driver_status_name}
                  number={item.count}
                />
              </div>
            );
          })}
        </div>
      </div>

      {/* Desktop status boxes */}
      <div className="hidden md:block">
        <div className="grid grid-cols-4 gap-4 mb-4">
          {summary.map((item) => {
            const config = statusConfig[item.ref_request_annual_driver_status_code];
            if (!config) return null;
            return (
              <div key={item.ref_request_annual_driver_status_code} className="min-w-[38%] flex-shrink-0">
                <RequestStatusBox
                  iconName={config.iconName}
                  status={config.status as any}
                  title={item.ref_request_annual_driver_status_name}
                  number={item.count}
                />
              </div>
            );
          })}
        </div>
      </div>

      {/* Search and filter controls */}
      <div className="flex justify-between items-center mt-5 md:flex-row flex-col w-full gap-3">
        <div className="w-full md:w-auto">
          <div className="input-group input-group-search">
            <div className="input-group-prepend">
              <span className="input-group-text search-ico-info">
                <i className="material-symbols-outlined">search</i>
              </span>
            </div>
            <input
              type="text"
              className="form-control dt-search-input"
              placeholder="เลขที่คำขอ, ผู้ขออนุมัติ"
              value={params.search}
              onChange={(e) => setParams((prev) => ({ ...prev, search: e.target.value, page: 1 }))}
            />
          </div>
        </div>

        <div className="flex gap-4 w-full md:w-auto md:ml-auto">
          <button
            className="btn btn-secondary btn-filtersmodal h-[40px] min-h-[40px]"
            onClick={() => filterModalRef.current?.openModal()}
          >
            <div className="flex items-center gap-1">
              <i className="material-symbols-outlined">filter_list</i>
              ตัวกรอง
              {activeFilters.length > 0 && (
                <span className="badge badge-brand badge-outline rounded-[50%]">{activeFilters.length}</span>
              )}
            </div>
          </button>
        </div>
      </div>

      {/* Active filters */}
      {activeFilters.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {activeFilters.map((filter, index) => (
            <span key={index} className="badge badge-brand badge-outline rounded-sm flex items-center">
              {filter.displayName}
              <button onClick={() => removeFilter(index)} className="ml-1 focus:outline-none m-0 p-0 flex">
                <i className="material-symbols-outlined text-sm">close</i>
              </button>
            </span>
          ))}
        </div>
      )}

      {/* Main content */}
      {dataRequest?.length > 0 ? (
        <>
          <div className="mt-2">
            <DriverLicApproverListTable defaultData={dataRequest} pagination={pagination} />
          </div>
          <PaginationControls
            pagination={pagination}
            onPageChange={handlePageChange}
            onPageSizeChange={handlePageSizeChange}
          />
        </>
      ) : (
        <ZeroRecord
          imgSrc="/assets/img/graphic/empty.svg"
          title="ไม่มีคำขออนุมัติ"
          desc={
            <>
              เมื่อพนักงานในสังกัดขออนุมัติทำหน้าที่ขับรถยนต์ <br></br> รายการคำขอที่รออนุมัติจะแสดงที่นี่{" "}
            </>
          }
          button="ล้างตัวกรอง"
          displayBtn={activeFilters.length > 0}
          btnType="secondary"
          useModal={handleClearAllFilters}
        />
      )}

      <FilterDriverModal
        ref={filterModalRef}
        statusData={summary}
        onSubmitFilter={handleFilterSubmit}
        startDate={params.start_created_request_datetime}
        endDate={params.end_driver_license_expire_date}
      />
    </>
  );
}
