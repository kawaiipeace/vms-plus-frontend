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
import PaginationControls from "../table/pagination-control";
import DriverLicConfirmerListTable from "../table/driver-lic-confirmer-list-table";

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

export default function DriverLicConfirmerFlow() {
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
  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  
  const initialLoadRef = useRef(true);

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
    setParams((prev) => ({ ...prev, page: Number(newPage) }));
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
      setIsLoading(true);
      try {
        const apiParams = {
          ...params,
          annual_yyyy: params.annual_yyyy
            ? (parseInt(params.annual_yyyy) - 543).toString()
            : "",
        };

   
        const response = await fetchDriverLicRequests(apiParams);
        console.log("API Response:", response.data); // Debug log

        if (response.status === 200) {
          console.log("Params sent:", apiParams);
          console.log("API response:", response.data);
          console.log("Requests:", response.data.requests);
          console.log("Pagination:", response.data.pagination);
  
          setDataRequest(response.data.requests || []);
          setSummary(response.data.summary || []);

          const newPagination = {
            limit: Number(response.data.pagination?.limit) || 10,
            page: Number(response.data.pagination?.page) || 1,
            total: Number(response.data.pagination?.total) || 0,
            totalPages: Number(response.data.pagination?.totalPages) || 0,
          };

          setPagination(newPagination);
          setTotalCount(newPagination.total);
        }
      } catch (error) {
        console.error("Error fetching requests:", error);
        setDataRequest([]);
        setPagination({
          limit: 10,
          page: 1,
          total: 0,
          totalPages: 0,
        });
        setTotalCount(0);
      } finally {
        setIsLoading(false);
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

    selectedStatuses.forEach((code) => {
      const status = summary.find(
        (s) => s.ref_request_annual_driver_status_code === code
      );
      if (status) {
        newFilters.push({
          type: "status",
          value: code,
          displayName: status.ref_request_annual_driver_status_name,
        });
      }
    });

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

    if (selectedStartDate && selectedEndDate) {
      newFilters.push({
        type: "date",
        value: `${selectedStartDate}|${selectedEndDate}`,
        displayName: `${dayjs(selectedStartDate).format(
          "DD/MM/BBBB"
        )} - ${dayjs(selectedEndDate).format("DD/MM/BBBB")}`,
      });
    }

    if (year) {
      newFilters.push({
        type: "year",
        value: year,
        displayName: `ปี ${year}`,
      });
    }

    setActiveFilters(newFilters);

    setParams((prev) => ({
      ...prev,
      ref_request_annual_driver_status_code: selectedStatuses.join(","),
      ref_driver_license_type_code: licenseTypes.join(","),
      start_created_request_datetime: selectedStartDate
        ? convertToISO(selectedStartDate, "00:00")
        : "",
      end_driver_license_expire_date: selectedEndDate
        ? convertToISO(selectedEndDate, "00:00")
        : "",
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
            const config =
              statusConfig[item.ref_request_annual_driver_status_code];
            if (!config) return null;
            return (
              <div
                key={item.ref_request_annual_driver_status_code}
                className="min-w-[38%] flex-shrink-0"
              >
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
            const config =
              statusConfig[item.ref_request_annual_driver_status_code];
            if (!config) return null;
            return (
              <div
                key={item.ref_request_annual_driver_status_code}
                className="min-w-[38%] flex-shrink-0"
              >
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
              onChange={(e) =>
                setParams((prev) => ({
                  ...prev,
                  search: e.target.value,
                  page: 1,
                }))
              }
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
                <span className="badge badge-brand badge-outline rounded-[50%]">
                  {activeFilters.length}
                </span>
              )}
            </div>
          </button>
        </div>
      </div>

      {/* Active filters */}
      {activeFilters.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {activeFilters.map((filter, index) => (
            <span
              key={index}
              className="badge badge-brand badge-outline rounded-sm flex items-center"
            >
              {filter.displayName}
              <button
                onClick={() => removeFilter(index)}
                className="ml-1 focus:outline-none m-0 p-0 flex"
              >
                <i className="material-symbols-outlined text-sm">close</i>
              </button>
            </span>
          ))}
        </div>
      )}

      {/* Main content */}
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : totalCount > 0 ? (
        dataRequest.length > 0 ? (
          <>
            <div className="mt-2">
              <DriverLicConfirmerListTable
                defaultData={dataRequest}
                pagination={pagination}
              />
            </div>
            <PaginationControls
              pagination={pagination}
              onPageChange={handlePageChange}
              onPageSizeChange={handlePageSizeChange}
            />
          </>
        ) : (
          <ZeroRecord
            imgSrc="/assets/img/empty/search_not_found.png"
            title="ไม่พบข้อมูล"
            desc={<>เปลี่ยนคำค้นหรือเงื่อนไขแล้วลองใหม่อีกครั้ง</>}
            button="ล้างตัวกรอง"
            displayBtn={true}
            btnType="secondary"
            useModal={handleClearAllFilters}
          />
        )
      ) : (
        <ZeroRecord
          imgSrc="/assets/img/graphic/empty.svg"
          title="ไม่มีคำขออนุมัติ"
          desc={
            <>
              เมื่อพนักงานในสังกัดขออนุมัติทำหน้าที่ขับรถยนต์ <br></br>{" "}
              รายการคำขอที่รออนุมัติจะแสดงที่นี่{" "}
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