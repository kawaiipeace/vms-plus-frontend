import FilterModal, { FilterModalRef } from "@/components/drivers-management/modal/filterTimelineModal";
import RequestListTable from "@/components/drivers-management/table/timeline-list-table";
import { useEffect, useMemo, useRef, useState } from "react";
// import { getVehicleTimeline } from "@/services/vehicleService";
import { PaginationType } from "@/app/types/vehicle-management/vehicle-list-type";
import PaginationControls from "@/components/table/pagination-control";
import SearchInput from "@/components/vehicle-management/input/search";
import VehicleNoData from "@/components/vehicle-management/noData";
import VehicleStatus from "@/components/vehicle-management/vehicle-status-with-icon";
import dayjs from "dayjs";

import { getDriverTimeline } from "@/services/driversManagement";
import { debounce } from "lodash";
import DateRangePicker from "../vehicle-management/input/dateRangeInput";

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
    work_type: "",
    ref_driver_status_code: "",
    is_active: "",
    page: pagination.page,
    limit: pagination.limit,
  });
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedOption, setSelectedOption] = useState<"all" | "first">("all");
  const [lastMonth, setLastMonth] = useState<string>("");
  // const [modalData, setModalData] = useState<any>({});

  const filterModalRef = useRef<FilterModalRef>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getDriverTimeline(params);
        setDataRequest(response.data.drivers);
        setLastMonth(response.data.last_month);

        const { total, totalPages } = response.data.pagination;
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
  // const handleOpenDetailModal = () => vehicleTimelineDetailRef.current?.open();
  const toggleDropdown = () => setShowDropdown((prev) => !prev);
  const handleSelect = (option: "all" | "first") => {
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
    const workType = filterParams.driverWorkType.map((item: any) => item).join(",");
    const driverStatus = filterParams.vehicleStatus.map((item: any) => item).join(",");
    const isActive = filterParams.taxVehicle.map((item: any) => item).join(",");
    setParams((prev) => ({
      ...prev,
      work_type: workType,
      ref_driver_status_code: driverStatus,
      is_active: isActive,
    }));
  };

  const handleClearAllFilters = () => {
    setParams({
      search: "",
      start_date: dayjs().startOf("month").format("YYYY-MM-DD"),
      end_date: dayjs().endOf("month").format("YYYY-MM-DD"),
      work_type: "",
      ref_driver_status_code: "",
      is_active: "",
      page: 1,
      limit: 10,
    });
  };

  const Header = () => (
    <div className="flex gap-4 border-l-8 border-brand-900 p-4 rounded-none">
      <span className="text-xl font-bold">พนักงานขับรถ</span>
      <span className="font-bold text-gray-500 border border-gray-300 px-2 py-1 rounded-lg text-sm">
        {pagination.total} คน
      </span>
    </div>
  );

  const debouncedSetParams = useMemo(
    () =>
      debounce((value: string) => {
        setParams((prev) => ({
          ...prev,
          search: value,
        }));
      }, 500),
    []
  );

  const Actions = () => (
    <div className="flex flex-col md:flex-row md:justify-between gap-4 mt-5">
      <div className="flex gap-4">
        <div className="flex flex-wrap items-center gap-2">
          <VehicleStatus status="รออนุมัติ" />
          <VehicleStatus status="ไป - กลับ" />
          <VehicleStatus status="ค้างแรม" />
          <VehicleStatus status="เสร็จสิ้น" />
        </div>
        <DateRangePicker
          date={{
            from: dayjs(params.start_date).toDate(),
            to: dayjs(params.end_date).toDate(),
          }}
          onChange={(range) => {
            setParams((prev) => ({
              ...prev,
              start_date: range?.from ? dayjs(range?.from).format("YYYY-MM-DD") : "",
              end_date: range?.to ? dayjs(range?.to).format("YYYY-MM-DD") : "",
            }));
          }}
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
          <div className="absolute right-0 mt-2 w-64 bg-white border border-gray-300 rounded-xl shadow z-50 ">
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
            <RequestListTable
              dataRequest={dataRequest}
              params={params}
              selectedOption={selectedOption}
              lastMonth={lastMonth}
              // onClickDetail={(data: any) => {
              //   setModalData(data);
              //   vehicleTimelineDetailRef.current?.open();
              // }}
            />
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
      <div className="flex justify-between items-center mb-4">
        <SearchInput
          defaultValue={params.search}
          placeholder="ชื่อ-นามสกุล, ชื่อเล่น, สังกัด"
          onSearch={debouncedSetParams}
        />
        <Actions />
      </div>
      <RenderTableOrNoData />
      <FilterModal ref={filterModalRef} onSubmitFilter={handleFilterSubmit} flag="TIMELINE" />
    </div>
  );
}
