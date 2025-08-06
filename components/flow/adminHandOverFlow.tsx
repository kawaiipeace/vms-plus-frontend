import { KeyHandOverListType } from "@/app/types/key-handover-list-type";
import { summaryType } from "@/app/types/request-list-type";
import FilterModal from "@/components/modal/filterModal";
import RequestStatusBox from "@/components/requestStatusBox";
import AdminKeyHandOverListTable from "@/components/table/admin-key-handover-list-table";
import PaginationControls from "@/components/table/pagination-control";
import ZeroRecord from "@/components/zeroRecord";
import { fetchKeyRequests } from "@/services/keyAdmin";
import dayjs from "dayjs";
import { useEffect, useRef, useState } from "react";

interface PaginationType {
  limit: number;
  page: number;
  total: number;
  totalPages: number;
}

export default function AdminKeyHandOverFlow() {
  const [params, setParams] = useState({
    search: "",
    vehicle_owner_dept_sap: "",
    ref_request_status_code: "",
    startdate: "",
    enddate: "",
    car_type: "",
    category_code: "",
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

  const [dataRequest, setDataRequest] = useState<KeyHandOverListType[]>([]);
  const [summary, setSummary] = useState<summaryType[]>([]);
  const [filterNum, setFilterNum] = useState(0);
  const [filterNames, setFilterNames] = useState<string[]>([]);
  const [filterDate, setFilterDate] = useState<string>("");
  const [loading, setLoading] = useState(true);

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

  const statusConfig: { [key: string]: { iconName: string; status: string } } =
    {
      "50": { iconName: "schedule", status: "info" },
      "50e": { iconName: "priority_high", status: "error" },
    };

  const handlePageSizeChange = (newLimit: string | number) => {
    const limit =
      typeof newLimit === "string" ? parseInt(newLimit, 10) : newLimit; // Convert to number if it's a string
    setParams((prevParams) => ({
      ...prevParams,
      limit,
      page: 1, // Reset to the first page when page size changes
    }));

  };

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

    const mappedNames = selectedStatuses.map(
      (code) =>
        summary.find((item) => item.ref_request_status_code === code)
          ?.ref_request_status_name || code
    );

    const date = selectedStartDate + " - " + selectedEndDate;

    setFilterNames(mappedNames);

    if (selectedStartDate && selectedEndDate) {
      setFilterDate(date);
    }

    setParams((prevParams) => ({
      ...prevParams,
      ref_request_status_code:
        selectedStatuses && selectedStatuses.length > 0
          ? selectedStatuses.join(",")
          : "30,31,40", // always fallback to default
      vehicle_owner_dept_sap: department?.value || "",
      startdate:
        selectedStartDate &&
        dayjs(selectedStartDate).subtract(543, "year").format("YYYY-MM-DD"),
      enddate:
        selectedEndDate &&
        dayjs(selectedEndDate).subtract(543, "year").format("YYYY-MM-DD"),
    }));
  };

  const removeFilter = (filterType: string, filterValue: string) => {
    if (filterType === "status") {
      setFilterNames((prevFilterNames) =>
        prevFilterNames.filter((name) => name !== filterValue)
      );

      setParams((prevParams) => {
        const updatedStatuses = prevParams.ref_request_status_code
          .split(",")
          .filter((code) => {
            const name = summary.find(
              (item) => item.ref_request_status_code === code
            )?.ref_request_status_name;
            return name !== filterValue;
          });

        setFilterNum(updatedStatuses.length);

        return {
          ...prevParams,
          ref_request_status_code: updatedStatuses.join(","),
        };
      });
    } else if (filterType === "date") {
      setFilterDate(""); // Clear the `filterDate`
      setParams((prevParams) => ({
        ...prevParams,
        startdate: "",
        enddate: "",
      }));
    }
  };

  const handleClearAllFilters = () => {
    setParams({
      search: "",
      vehicle_owner_dept_sap: "",
      ref_request_status_code: "",
      startdate: "",
      enddate: "",
      car_type: "",
      category_code: "",
      order_by: "",
      order_dir: "",
      page: 1,
      limit: 10,
    });

    setFilterNum(0);
    setFilterNames([]);
    setFilterDate("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    const fetchRequestsData = async () => {
      try {
        const response = await fetchKeyRequests(params);

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
      } finally {
        setLoading(false); // <-- End loading after fetch
      }
    };

    fetchRequestsData();
  }, [params]);

  const onUpdate = () => {
    setParams((prevParams) => ({
      ...prevParams,
      page: 1,
    }));
  };

  useEffect(() => {}, [dataRequest, params]);

  if (loading) {
    return <div className="mt-0 pt-0"></div>;
  }

  return (
    <>
      <div className="md:hidden block transition-opacity duration-500">
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

      <div className="hidden md:block transition-opacity duration-500">
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
              placeholder="ยานพาหนะ, ผู้มารับกุญแจ, เลขที่คำขอ"
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
          imgSrc="/assets/img/graphic/empty.svg"
          title="ไม่มีคำขอใช้ยานพาหนะ"
          desc={
            <>
              เมื่อคำขอใช้ยานพาหนะได้รับการอนุมัติ<br></br>
              รายการคำขอที่รอให้กุญแจจะแสดงที่นี่
            </>
          }
          displayBtn={false}
          button={""}
        />
      )}

      <>
        {dataRequest?.length > 0 && (
          <>
            <div className="mt-2">
              <AdminKeyHandOverListTable
                defaultData={dataRequest}
                pagination={pagination}
                onUpdate={onUpdate}
              />
            </div>

            <PaginationControls
              pagination={pagination}
              onPageChange={handlePageChange}
              onPageSizeChange={handlePageSizeChange}
            />
          </>
        )}
      </>

      <FilterModal
        ref={filterModalRef}
        statusData={summary}
        selectedStatuses={params.ref_request_status_code
          .split(",")
          .filter(Boolean)}
        selectedDates={{
          start: params.startdate,
          end: params.enddate,
        }}department={true}
        onSubmitFilter={handleFilterSubmit}
      />
    </>
  );
}
