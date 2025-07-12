import { RequestListType, summaryType } from "@/app/types/request-list-type";
import FilterModal from "@/components/modal/filterModal";
// import FilterSortModal from "@/components/modal/filterSortModal";
import RequestStatusBox from "@/components/requestStatusBox";
import AdminListTable from "@/components/table/admin-list-table";
import PaginationControls from "@/components/table/pagination-control";
import ZeroRecord from "@/components/zeroRecord";
import { fetchRequests } from "@/services/bookingAdmin";
import { convertToBuddhistDateTime } from "@/utils/converToBuddhistDateTime";
import dayjs from "dayjs";
import { useEffect, useRef, useState } from "react";

interface PaginationType {
  limit: number;
  page: number;
  total: number;
  totalPages: number;
}

export default function AdminApproveFlow() {
  const [params, setParams] = useState({
    search: "",
    vehicle_owner_dept_sap: "",
    ref_request_status_code: "30,31,40",
    startdate: "",
    enddate: "",
    car_type: "",
    category_code: "",
    order_by: "request_no",
    order_dir: "desc",
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
  const [loading, setLoading] = useState(true);
  const [datePickerKey, setDatePickerKey] = useState(0);
  // Add this state to track the selected department
  const [selectedDepartment, setSelectedDepartment] = useState<{
    value: string;
    label: string;
  }>({
    value: "",
    label: "",
  });

  const filterModalRef = useRef<{
    openModal: () => void;
    closeModal: () => void;
  } | null>(null);

  const handlePageChange = (newPage: number) => {
    setParams((prevParams) => ({
      ...prevParams,
      page: newPage,
    }));
  };
  const [departmentLabel, setDepartmentLabel] = useState<string>("");
  const [totalCount, setTotalCount] = useState(0);
  const initialLoadRef = useRef(true);
  const statusConfig: { [key: string]: { iconName: string; status: string } } =
    {
      "30": { iconName: "schedule", status: "info" },
      "31": { iconName: "reply", status: "warning" },
      "40": { iconName: "check", status: "success" },
      "41": { iconName: "check", status: "success" },
      "50": { iconName: "vpn_key", status: "info" },
      "51": { iconName: "vpn_key", status: "info" },
      "60": { iconName: "directions_car", status: "info" },
      "70": { iconName: "build", status: "warning" },
      "71": { iconName: "build", status: "warning" },
      "80": { iconName: "done_all", status: "success" },
      "90": { iconName: "delete", status: "default" },
    };

  useEffect(() => {
    if (summary && summary.length < 0) {
      setFilterNames([]);
    }
  }, [summary]);

  const handlePageSizeChange = (newLimit: string | number) => {
    const limit =
      typeof newLimit === "string" ? parseInt(newLimit, 10) : newLimit; // Convert to number if it's a string
    setParams((prevParams) => ({
      ...prevParams,
      limit,
      page: 1, // Reset to the first page when page size changes
    }));
  };

  // Update the handleFilterSubmit function
  const handleFilterSubmit = ({
    selectedStatuses,
    selectedStartDate,
    selectedEndDate,
    department,
  }: {
    selectedStatuses: string[];
    selectedStartDate: string;
    selectedEndDate: string;
    department?: { value: string; label: string };
  }) => {
    const dept = department || { value: "", label: "" };
    setDepartmentLabel(dept.label);
    setSelectedDepartment(dept);

    const mappedNames = selectedStatuses.map(
      (code) =>
        summary.find((item) => item.ref_request_status_code === code)
          ?.ref_request_status_name || code
    );

    const date =
      selectedStartDate && selectedEndDate
        ? convertToBuddhistDateTime(selectedStartDate).date +
          " - " +
          convertToBuddhistDateTime(selectedEndDate).date
        : "";

    setFilterNames(mappedNames);
    setFilterDate(date);

    let num = selectedStatuses.length;
    if (selectedStartDate && selectedEndDate) num += 1;
    if (dept.value) num += 1;
    setFilterNum(num);

    setParams((prevParams) => ({
      ...prevParams,
      ref_request_status_code:
        selectedStatuses && selectedStatuses.length > 0
          ? selectedStatuses.join(",")
          : "30,31,40",
      vehicle_owner_dept_sap: dept.value,
      startdate:
        selectedStartDate &&
        dayjs(selectedStartDate).subtract(543, "year").format("YYYY-MM-DD"),
      enddate:
        selectedEndDate &&
        dayjs(selectedEndDate).subtract(543, "year").format("YYYY-MM-DD"),
      page: 1, // Reset to first page when filters change
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

  // Update the handleClearAllFilters function
  const handleClearAllFilters = () => {
    setParams({
      search: "",
      vehicle_owner_dept_sap: "",
      ref_request_status_code: "30,31,40",
      startdate: "",
      enddate: "",
      car_type: "",
      category_code: "",
      order_by: "request_no",
      order_dir: "desc",
      page: 1,
      limit: 10,
    });

    setFilterNum(0);
    setFilterNames([]);
    setFilterDate("");
    setSelectedDepartment({ value: "", label: "" });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // const handleFilterSortSubmit = (filters: { selectedSortType: string }) => {
  //   if (filters.selectedSortType === "วันที่เริ่มต้นเดินทางใหม่ที่สุด") {
  //     setParams((prevParams) => ({
  //       ...prevParams,
  //       order_by: "start_datetime",
  //       order_dir: "desc",
  //     }));
  //   } else {
  //     setParams((prevParams) => ({
  //       ...prevParams,
  //       order_by: "request_no",
  //       order_dir: "desc",
  //     }));
  //   }
  // };

  useEffect(() => {
    const fetchRequestsData = async () => {
      try {
        const response = await fetchRequests(params);

        if (response.status === 200) {
          const requestList = response.data.requests;

          const { total, totalPages } = response.data.pagination;
          const summary = response.data.summary;

          setDataRequest(requestList);
          setSummary(summary);
          if (initialLoadRef.current) {
            setTotalCount(response.data.pagination.total);
            initialLoadRef.current = false;
          }
          setPagination({
            limit: params.limit,
            page: params.page,
            total,
            totalPages,
          });
        }
      } catch (error) {
        console.error("Error fetching requests:", error);
      } finally {
        setLoading(false); // <-- End loading after fetch
      }
    };

    fetchRequestsData();
  }, [params]);

  useEffect(() => {}, [dataRequest]); // This will log whenever dataRequest changes

  if (loading) {
    return <div className="mt-0 pt-0"></div>;
  }

  return (
    <>
      <div className="md:hidden block">
        <div className="flex overflow-x-auto gap-4 mb-4 no-scrollbar w-[100vw]">
          {summary.map((item) => {
            const config = statusConfig[item.ref_request_status_code];

            if (!config) return null;

            return (
              <div
                key={item.ref_request_status_code}
                className="min-w-[38%] flex-shrink-0"
              >
                <RequestStatusBox
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
              </div>
            );
          })}
        </div>
      </div>

      <div className="hidden md:block">
        <div className="grid grid-cols-4 gap-4 mb-4">
          {summary.map((item) => {
            const config = statusConfig[item.ref_request_status_code];

            if (!config) return null;

            return (
              <div
                key={item.ref_request_status_code}
                className="min-w-[38%] flex-shrink-0"
              >
                <RequestStatusBox
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
                  onClick={() => {
                    setParams((prevParams) => ({
                      ...prevParams,
                      ref_request_status_code: item.ref_request_status_code,
                      page: 1,
                    }));

                    const statusName = item.ref_request_status_name;
                    if (!filterNames.includes(statusName)) {
                      setFilterNames((prevFilterNames) => [
                        ...prevFilterNames,
                        statusName,
                      ]);
                    }

                    setFilterNum((prevFilterNum) => prevFilterNum + 1);
                  }}
                />
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex justify-between items-center mt-5 md:flex-row flex-col w-full gap-3">
        {/* Left side: Search */}
        <div className="w-full md:w-auto">
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
                  page: 1,
                }))
              }
            />
          </div>
        </div>

        {/* Right side on desktop, stacked below on mobile */}
        <div className="flex gap-4 w-full md:w-auto md:ml-auto">
          <button
            className="btn btn-secondary btn-filtersmodal h-[40px] min-h-[40px]"
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

        {/* Department badge */}
        {params.vehicle_owner_dept_sap && (
          <span className="badge badge-brand badge-outline rounded-sm mr-2">
            {departmentLabel}
            <i
              className="material-symbols-outlined cursor-pointer"
              onClick={() =>
                removeFilter("department", params.vehicle_owner_dept_sap)
              }
            >
              close_small
            </i>
          </span>
        )}

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

      {dataRequest?.length > 0 && (
        <>
          <div className="mt-2">
            <AdminListTable defaultData={dataRequest} pagination={pagination} />
          </div>

          <PaginationControls
            pagination={pagination}
            onPageChange={handlePageChange}
            onPageSizeChange={handlePageSizeChange}
          />
        </>
      )}

      {totalCount === 0 ? (
        <ZeroRecord
          imgSrc="/assets/img/graphic/empty.svg"
          title="ไม่มีคำขอใช้ยานพาหนะ"
          desc={
            <>
              เมื่อมีพนักงานขอใช้ยานพาหนะที่ท่านเป็นผู้ดูแล
              <br />
              รายการคำขอจะแสดงที่นี่
            </>
          }
          displayBtn={false}
          button=""
        />
      ) : dataRequest?.length === 0 ? (
        <ZeroRecord
          imgSrc="/assets/img/empty/search_not_found.png"
          title="ไม่พบข้อมูล"
          desc={<>เปลี่ยนคำค้นหรือเงื่อนไขแล้วลองใหม่อีกครั้ง</>}
          button="ล้างตัวกรอง"
          displayBtn={true}
          btnType="secondary"
          useModal={handleClearAllFilters}
        />
      ) : null}

      <FilterModal
        ref={filterModalRef}
        statusData={summary}
        department={true}
        selectedStatuses={params.ref_request_status_code
          .split(",")
          .filter(Boolean)}
        selectedDates={{
          start: params.startdate
            ? dayjs(params.startdate).add(543, "year").format("YYYY-MM-DD")
            : "",
          end: params.enddate
            ? dayjs(params.enddate).add(543, "year").format("YYYY-MM-DD")
            : "",
        }}
        selectedDepartment={selectedDepartment}
        setSelectedDepartment={setSelectedDepartment}
        onSubmitFilter={handleFilterSubmit}
      />
    </>
  );
}
