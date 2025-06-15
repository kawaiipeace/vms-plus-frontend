import { useEffect, useMemo, useRef, useState } from "react";
import RequestListTable from "@/components/drivers-management/table/timeline-list-table";
import FilterModal, { FilterModalRef } from "@/components/drivers-management/modal/filterTimelineModal";
import { getDriverTimeline } from "@/services/driversManagement";
import dayjs from "dayjs";
import SearchInput from "@/components/vehicle-management/input/search";
import PaginationControls from "@/components/table/pagination-control";
import VehicleNoData from "@/components/vehicle-management/noData";
import { DateRange } from "react-day-picker";
import { PaginationType } from "@/app/types/vehicle-management/vehicle-list-type";
import { debounce } from "lodash";
import DateRangePicker from "@/components/vehicle-management/input/dateRangeInput";
import VehicleStatus from "../vehicle-management/vehicle-status-without-icon";

export default function VehicleTimeLine() {
  const [dataRequest, setDataRequest] = useState<any[]>([]);
  const [lastMonth, setLastMonth] = useState<string>("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedOption, setSelectedOption] = useState<"all" | "first">("all");
  const [selectedRange, setSelectedRange] = useState<DateRange | undefined>({
    from: dayjs().startOf("month").toDate(),
    to: dayjs().endOf("month").toDate(),
  });
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
    ref_timeline_status_id: "",
    is_active: "",
    page: pagination.page,
    limit: pagination.limit,
  });

  const filterModalRef = useRef<FilterModalRef>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // console.log("Fetching vehicle timeline data with params:", params);
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
    const isActive = filterParams.taxVehicle.map((item: any) => item).join(",");
    const workType = filterParams.driverWorkType.map((item: any) => item).join(",");
    const driverStatus = filterParams.vehicleStatus.map((item: any) => item).join(",");
    const timelineStatus = filterParams.timelineStatus.map((item: any) => item).join(",");
    setParams((prev) => ({
      ...prev,
      // vehicel_car_type_detail: filterParams.vehicleType,
      // vehicle_owner_dept_sap: filterParams.vehicleDepartment,
      is_active: isActive,
      work_type: workType,
      ref_driver_status_code: driverStatus,
      ref_timeline_status_id: timelineStatus,
    }));
  };

  const handleClearAllFilters = () => {
    setParams({
      search: "",
      start_date: dayjs().startOf("month").format("YYYY-MM-DD"),
      end_date: dayjs().endOf("month").format("YYYY-MM-DD"),
      work_type: "",
      ref_driver_status_code: "",
      ref_timeline_status_id: "",
      is_active: "",
      page: 1,
      limit: 10,
    });
  };

  const Header = () => (
    <div className="page-section-header border-0 mt-5">
      <div className="page-header-left">
        <div className="page-title">
          <span className="page-title-label">พนักงานขับรถ</span>
          <span className="font-bold text-gray-500 border border-gray-300 px-2 py-1 rounded-lg text-sm">
            {pagination.total ?? 0} คน
          </span>
        </div>
      </div>
    </div>
  );

  const debouncedSetParams = useMemo(
    () =>
      debounce((value: string) => {
        if (value.length > 2 || value.length === 0) {
          setParams((prev) => ({ ...prev, search: value }));
        }
      }, 500),
    []
  );

  // const Actions = () => (
  //   <div className="mt-5 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
  //     <div className="flex flex-col gap-4 md:flex-row md:items-center">
  //       <SearchInput
  //         ref={searchInputRef}
  //         defaultValue={params.search}
  //         placeholder="ชื่อ-นามสกุล, ชื่อเล่น, สังกัด"
  //         onSearch={(value) => debouncedSetParams(value)}
  //       />

  //       <div className="flex flex-wrap items-center gap-2">
  //         <VehicleStatus status="รออนุมัติ" />
  //         <VehicleStatus status="ไป - กลับ" />
  //         <VehicleStatus status="ค้างแรม" />
  //         <VehicleStatus status="เสร็จสิ้น" />
  //       </div>
  //     </div>

  //     <div className="flex flex-wrap gap-2 justify-start md:justify-end">
  //       <DateRangePicker
  //         date={selectedRange}
  //         onChange={(range) => {
  //           setParams((prev) => ({
  //             ...prev,
  //             start_date: range?.from ? dayjs(range?.from).format("YYYY-MM-DD") : "",
  //             end_date: range?.to ? dayjs(range?.to).format("YYYY-MM-DD") : "",
  //           }));

  //           if (range?.from && range?.to) {
  //             setSelectedRange({ from: range.from, to: range.to });
  //           } else {
  //             setSelectedRange(undefined);
  //           }
  //         }}
  //       />
  //       <button
  //         onClick={handleOpenFilterModal}
  //         className="flex items-center gap-1 px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-700 shadow-sm hover:bg-gray-100 transition"
  //       >
  //         <i className="material-symbols-outlined text-lg">filter_list</i>
  //         <span className="text-base font-semibold">ตัวกรอง</span>
  //       </button>

  //       <button
  //         onClick={toggleDropdown}
  //         className="flex items-center gap-1 px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-700 shadow-sm hover:bg-gray-100 transition"
  //       >
  //         <i className="material-symbols-outlined text-lg">view_column</i>
  //       </button>
  //     </div>
  //   </div>
  // );

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
      <div className="relative">
        {showDropdown && (
          <div className="absolute right-0 mt-2 w-64 bg-white border border-gray-300 rounded-xl shadow z-50">
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
          <div className="overflow-x-auto mt-4">
            <RequestListTable
              dataRequest={dataRequest}
              params={params}
              selectedOption={selectedOption}
              lastMonth={lastMonth}
            />
            <PaginationControls
              pagination={pagination}
              onPageChange={handlePageChange}
              onPageSizeChange={handlePageSizeChange}
            />
          </div>
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
    <div className="px-4 sm:px6 lg:px8 py6">
      <Header />
      <div className="mt-5 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-col gap-4 md:flex-row md:items-center">
          <SearchInput
            defaultValue={params.search}
            placeholder="ชื่อ-นามสกุล, ชื่อเล่น, สังกัด"
            onSearch={(value) => debouncedSetParams(value)}
          />

          <div className="flex flex-wrap items-center gap-2">
            <VehicleStatus status="รออนุมัติ" />
            <VehicleStatus status="ไป - กลับ" />
            <VehicleStatus status="ค้างแรม" />
            <VehicleStatus status="เสร็จสิ้น" />
          </div>
        </div>

        <div className="flex flex-wrap gap-2 justify-start md:justify-end">
          <DateRangePicker
            date={selectedRange}
            onChange={(range) => {
              setParams((prev) => ({
                ...prev,
                start_date: range?.from ? dayjs(range?.from).format("YYYY-MM-DD") : "",
                end_date: range?.to ? dayjs(range?.to).format("YYYY-MM-DD") : "",
              }));

              if (range?.from && range?.to) {
                setSelectedRange({ from: range.from, to: range.to });
              } else {
                setSelectedRange(undefined);
              }
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
      {/* <Actions /> */}
      <RenderTableOrNoData />
      <FilterModal ref={filterModalRef} onSubmitFilter={handleFilterSubmit} flag="TIMELINE" />
    </div>
  );
}
