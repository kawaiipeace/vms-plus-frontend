"use client";
import { RequestListType, summaryType } from "@/app/types/request-list-type";
import FilterModal from "@/components/modal/filterModal";
import RequestListTable from "@/components/table/request-list-table";
import { downloadExports, requests } from "@/services/bookingUser";
import { convertToBuddhistDateTime } from "@/utils/converToBuddhistDateTime";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useFormContext } from "@/contexts/requestFormContext";
import ListFlow from "./flow/listFlow";
import RequestStatusBox from "./requestStatusBox";
import PaginationControls from "./table/pagination-control";
import ZeroRecord from "./zeroRecord";

interface PaginationType {
  limit: number;
  page: number;
  total: number;
  totalPages: number;
}

export default function ArpproveFlow() {
  const [params, setParams] = useState({
    search: "",
    vehicle_owner_dept: "",
    ref_request_status_code: "",
    order_by: "request_no",
    order_dir: "desc",
    startdate: "",
    enddate: "",
    car_type: "",
    category_code: "",
    page: 1,
    limit: 10,
  });

  const [pagination, setPagination] = useState<PaginationType>({
    limit: 10,
    page: 1,
    total: 0,
    totalPages: 0,
  });

  const [dataRequest, setDataRequest] = useState<RequestListType[]>([]);
  const [summary, setSummary] = useState<summaryType[]>([]);
  const [filterNum, setFilterNum] = useState(0);
  const [filterNames, setFilterNames] = useState<string[]>([]);
  const [filterDate, setFilterDate] = useState<string>("");
  const { resetFormData } = useFormContext();
  const [datePickerKey, setDatePickerKey] = useState(0); // Add this for date picker reset
  const router = useRouter();
  const filterModalRef = useRef<{
    openModal: () => void;
    closeModal: () => void;
  } | null>(null);

  const addNewRequest = () => {
    localStorage.removeItem("formData");
    resetFormData();
    router.push("/vehicle-booking/process-one");
    router.refresh();
  };

  const statusConfig: { [key: string]: { iconName: string; status: string } } =
    {
      "20": { iconName: "schedule", status: "info" },
      "21": { iconName: "reply", status: "warning" },
      "30": { iconName: "schedule", status: "warning" },
      "31": { iconName: "schedule", status: "info" },
      "40": { iconName: "schedule", status: "warning" },
      "41": { iconName: "schedule", status: "info" },
      "50": { iconName: "key", status: "info" },
      "51": { iconName: "directions_car", status: "info" },
      "60": { iconName: "directions_car", status: "info" },
      "70": { iconName: "key", status: "info" },
      "71": { iconName: "key", status: "error" },
      "80": { iconName: "check", status: "success" },
    };

  const handlePageChange = (newPage: number) => {
    setParams((prevParams) => ({
      ...prevParams,
      page: newPage,
    }));
  };

  const handlePageSizeChange = (newLimit: string | number) => {
    const limit =
      typeof newLimit === "string" ? parseInt(newLimit, 10) : newLimit;
    setParams((prevParams) => ({
      ...prevParams,
      limit,
      page: 1,
    }));
  };

  const handleFilterSubmit = ({
    selectedStatuses,
    selectedStartDate,
    selectedEndDate,
  }: {
    selectedStatuses: string[];
    selectedStartDate: string;
    selectedEndDate: string;
  }) => {
    // Filter out status codes that don't exist in summary data
    const validStatuses = selectedStatuses.filter((code) =>
      summary.some((item) => item.ref_request_status_code === code)
    );

    const mappedNames = validStatuses.map((code) => {
      const statusItem = summary.find(
        (item) => item.ref_request_status_code === code
      );
      return statusItem?.ref_request_status_name || code; // Fallback to code if name not found
    });

    const date =
      selectedStartDate && selectedEndDate
        ? convertToBuddhistDateTime(selectedStartDate).date +
          " - " +
          convertToBuddhistDateTime(selectedEndDate).date
        : "";

    setFilterNames(mappedNames);
    setFilterDate(date);
    setFilterNum(validStatuses.length + (date ? 1 : 0));

    setParams((prevParams) => ({
      ...prevParams,
      ref_request_status_code: validStatuses.join(","),
      startdate: selectedStartDate,
      enddate: selectedEndDate,
      page: 1,
    }));
  };
  const removeFilter = (filterType: string, filterValue: string) => {
    if (filterType === "status") {
      // Find the actual status code for this name
      const statusCode = summary.find(
        (item) => item.ref_request_status_name === filterValue
      )?.ref_request_status_code;

      if (!statusCode) return; // Skip if no matching code found

      setFilterNames((prevFilterNames) =>
        prevFilterNames.filter((name) => name !== filterValue)
      );

      setParams((prevParams) => {
        const updatedStatuses = prevParams.ref_request_status_code
          .split(",")
          .filter((code) => code !== statusCode);

        setFilterNum(updatedStatuses.length + (filterDate ? 1 : 0));

        return {
          ...prevParams,
          ref_request_status_code: updatedStatuses.join(","),
          page: 1,
        };
      });
    } else if (filterType === "date") {
      setFilterDate("");
      setParams((prevParams) => ({
        ...prevParams,
        startdate: "",
        enddate: "",
        page: 1,
      }));
      setFilterNum(filterNames.length);
      setDatePickerKey((prev) => prev + 1);
    }
  };

  const downloadReport = async () => {
    try {
      const response = await downloadExports(); // axios call with responseType: 'blob'
  
      if (response.status === 200) {
        const blob = new Blob([response.data], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });
  
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "Request_Reports.xlsx";
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);
      } else {
        console.error("Failed to download report. Status:", response.status);
      }
    } catch (error) {
      console.error("Download failed:", error);
    }
  };
  
  const handleClearAllFilters = () => {
    setParams({
      search: "",
      vehicle_owner_dept: "",
      ref_request_status_code: "",
      startdate: "",
      enddate: "",
      order_by: "request_no",
      order_dir: "desc",
      car_type: "",
      category_code: "",
      page: 1,
      limit: 10,
    });

    setFilterNum(0);
    setFilterNames([]);
    setFilterDate("");
    setDatePickerKey((prev) => prev + 1); // Force reset date picker
    window.scrollTo({ top: 0, behavior: "smooth" });

    // Close modal if open
    filterModalRef.current?.closeModal();
  };

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await requests(params);
        if (response.status === 200) {
          const requestList = response.data.requests;
          const { total, totalPages } = response.data.pagination;
          const summary = response.data.summary;
          setDataRequest(requestList);
          setSummary(summary);
          setPagination({
            limit: params.limit,
            page: params.page,
            total,
            totalPages,
          });
        }
      } catch (error) {
        console.error("Error fetching requests:", error);
      }
    };

    fetchRequests();
  }, [params]);

  useEffect(() => {}, [dataRequest, params]);

  return (
    <>
      {/* <div className="hidden md:block">
        <div className="grid grid-cols-4 gap-4 mb-4">
          {summary !== null && (
            <>
              {summary.map((item) => {
                const config = statusConfig[item.ref_request_status_code];

                // If not in your list, skip
                if (!config) return null;

                return (
                  <RequestStatusBox
                    key={item.ref_request_status_code}
                    iconName={config.iconName}
                    status={
                      config.status as
                        | "info"
                        | "warning"
                        | "success"
                        | "default"
                        | "error"
                    }
                    title={item.ref_request_status_name}
                    number={item.count}
                  />
                );
              })}
            </>
          )}
        </div>
      </div> */}

      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mt-5">
        <div className="block md:w-[25%] w-full">
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
              placeholder="เลขที่คำขอ, ผู้ใช้, ยานพาหนะ, สถานที่"
              value={params.search}
              onChange={(e) =>
                setParams((prevParams) => ({
                  ...prevParams,
                  search: e.target.value,
                  page: 1, // Reset to page 1 on search
                }))
              }
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
              <span className="badge badge-brand badge-outline rounded-[50%]">
                {filterNum}
              </span>
            </div>
          </button>
          <button
            onClick={downloadReport}
            className="btn btn-secondary h-[40px] min-h-[40px] md:block hidden"
          >
            <div className="flex items-center">
              <i className="material-symbols-outlined">download</i>
              รายงาน
            </div>
          </button>
          <button
            onClick={addNewRequest}
            className="btn btn-primary h-[40px] min-h-[40px]"
          >
            <div className="flex items-center">
              <i className="material-symbols-outlined">add</i>
              สร้างคำขอใช้
            </div>
          </button>
        </div>
      </div>

      <div className="mt-3">
        {filterNames.map((name, index) => (
          <span
            key={index}
            className="badge badge-brand badge-outline rounded-sm mr-2"
          >
            {name}
            <i
              className="material-symbols-outlined cursor-pointer"
              onClick={() => removeFilter("status", name)}
            >
              close_small
            </i>
          </span>
        ))}
        {filterDate && (
          <span className="badge badge-brand badge-outline rounded-sm mr-2">
            {filterDate}
            <i
              className="material-symbols-outlined cursor-pointer"
              onClick={() => removeFilter("date", filterDate)}
            >
              close_small
            </i>
          </span>
        )}
      </div>

      {dataRequest?.length > 0 && dataRequest !== null && (
        <>
          <div className="flex flex-col gap-3 md:gap-0 md:hidden">
            <ListFlow requestData={dataRequest} />
          </div>
          <div className="hidden md:block">
            <div className="mt-2">
              <RequestListTable
                defaultData={dataRequest}
                pagination={pagination}
              />
            </div>
          </div>
          <PaginationControls
            pagination={pagination}
            onPageChange={handlePageChange}
            onPageSizeChange={handlePageSizeChange}
          />
        </>
      )}

      {pagination.total > 0 ? (
        dataRequest.length <= 0 && (
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
          imgSrc="/assets/img/empty/add_carpool.svg"
          title="สร้างคำขอใช้ยานพาหนะ"
          desc={<>ระบุข้อมูลการเดินทาง ค้นหายานพาหนะ และผู้ขับขี่</>}
          button="สร้างคำขอใช้"
          displayBtn={true}
          icon="add"
          link="process-one"
        />
      )}

      <FilterModal
        ref={filterModalRef}
        statusData={summary}
        selectedStatuses={params.ref_request_status_code
          .split(",")
          .filter(Boolean)}
        selectedDates={{
          start: params.startdate,
          end: params.enddate,
        }}
        onSubmitFilter={handleFilterSubmit}
      />
    </>
  );
}
