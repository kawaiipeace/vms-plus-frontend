import { useEffect, useMemo, useRef, useState } from "react";
import "flatpickr/dist/themes/material_blue.css";
import dayjs from "dayjs";
import VehicleStatus from "../vehicle-management/vehicle-status-with-icon";
import SearchInput from "../vehicle-management/input/search";
import { PaginationType } from "@/app/types/vehicle-management/vehicle-list-type";
import PaginationControls from "../table/pagination-control";
import VehicleNoData from "../vehicle-management/noData";
import {
  getCarpoolDriverTimeline,
  getCarpoolVehicleTimeline,
} from "@/services/carpoolManagement";
import { useSearchParams } from "next/navigation";
import CarpoolVehicleListTable from "../table/carpool-timeline/timeline-carpool-vehicle-list-table";
import CarpoolDriverListTable from "../table/carpool-timeline/timeline-carpool-driver-list-table";
import { debounce } from "lodash";
import VehicleFilterModal, {
  VehicleFilterModalRef,
} from "../carpool-management/modal/vehicleFilterModal";
import DriverFilterModal, {
  DriverFilterModalRef,
} from "../carpool-management/modal/driverFilterModal";
import DateRangePicker from "../vehicle-management/input/dateRangeInput";
import { TripStatus } from "@/utils/vehicle-constant";
import { DateRange } from "react-day-picker";

const statusOptions = [
  { value: "1", status: TripStatus["Pending"] },
  { value: "2", status: TripStatus["RoundTrip"] },
  { value: "3", status: TripStatus["Overnight"] },
  { value: "4", status: TripStatus["Completed"] },
];

export default function CarpoolTimeLine() {
  const id = useSearchParams().get("id");
  const [filterParams, setFilterParams] = useState<string[]>([
    "1",
    "2",
    "3",
    "4",
  ]);

  const [dataVehicle, setDataVehicle] = useState<any[]>([]);
  const [dataDriver, setDataDriver] = useState<any[]>([]);

  const [vehicleLastMonth, setVehicleLastMonth] = useState<string>("");
  const [driverLastMonth, setDriverLastMonth] = useState<string>("");

  const [vehiclePagination, setVehiclePagination] = useState<PaginationType>({
    limit: 10,
    page: 1,
    total: 0,
    totalPages: 0,
  });
  const [driverPagination, setDriverPagination] = useState<PaginationType>({
    limit: 10,
    page: 1,
    total: 0,
    totalPages: 0,
  });

  const [vehicleParams, setVehicleParams] = useState({
    search: "",
    start_date: dayjs().startOf("month").format("YYYY-MM-DD"),
    end_date: dayjs().endOf("month").format("YYYY-MM-DD"),
    page: vehiclePagination.page,
    limit: vehiclePagination.limit,
    is_active: "",
    ref_vehicle_status_code: "",
    vehicel_car_type_detail: "",
  });
  const [driverParams, setDriverParams] = useState({
    search: "",
    start_date: dayjs().startOf("month").format("YYYY-MM-DD"),
    end_date: dayjs().endOf("month").format("YYYY-MM-DD"),
    page: driverPagination.page,
    limit: driverPagination.limit,
    is_active: "",
    work_type: "",
    ref_driver_status_code: "",
  });

  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedRange, setSelectedRange] = useState<DateRange | undefined>({
    from: dayjs().startOf("month").toDate(),
    to: dayjs().endOf("month").toDate(),
  });
  const [selectedOption, setSelectedOption] = useState<"all" | "first">("all");

  const filterVehicleModalRef = useRef<VehicleFilterModalRef>(null);
  const filterDriverModalRef = useRef<DriverFilterModalRef>(null);

  useEffect(() => {
    // setVehicleParams((prev) => ({
    //   ...prev,
    //   ref_vehicle_status_code: filterParams.join(","),
    // }));
    // setDriverParams((prev) => ({
    //   ...prev,
    //   ref_driver_status_code: filterParams.join(","),
    // }));
  }, [filterParams]);

  useEffect(() => {
    if (id) {
      const fetchDataVehicle = async () => {
        try {
          const response: any = await getCarpoolVehicleTimeline(
            id,
            vehicleParams
          );
          setDataVehicle(response.data.vehicles);
          setVehicleLastMonth(response.data.last_month);

          const { total, totalPages } = response.data.pagination;
          setVehiclePagination({
            limit: vehicleParams.limit,
            page: vehicleParams.page,
            total,
            totalPages,
          });
        } catch (error) {
          console.error("Error fetching vehicle timeline data:", error);
        }
      };

      fetchDataVehicle();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [vehicleParams]);

  useEffect(() => {
    if (id) {
      const fetchDataDriver = async () => {
        try {
          const response: any = await getCarpoolDriverTimeline(
            id,
            driverParams
          );
          setDataDriver(response.data.drivers);
          setDriverLastMonth(response.data.last_month);

          const { total, totalPages } = response.data.pagination;
          setDriverPagination({
            limit: driverParams.limit,
            page: driverParams.page,
            total,
            totalPages,
          });
        } catch (error) {
          console.error("Error fetching vehicle timeline data:", error);
        }
      };

      fetchDataDriver();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [driverParams]);

  const handleOpenVehicleFilterModal = () =>
    filterVehicleModalRef.current?.open();
  const handleOpenDriverFilterModal = () =>
    filterDriverModalRef.current?.open();

  const toggleDropdown = () => setShowDropdown((prev) => !prev);
  const handleSelect = (option: "all" | "first") => {
    setSelectedOption(option);
    setShowDropdown(false);
  };

  const toggleFilter = (value: string) => {
    setFilterParams((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    );
  };

  const handleVehiclePageChange = (newPage: number) => {
    setVehicleParams((prevParams) => ({ ...prevParams, page: newPage }));
  };

  const handleDriverPageChange = (newPage: number) => {
    setDriverParams((prevParams) => ({ ...prevParams, page: newPage }));
  };

  const handleVehiclePageSizeChange = (newLimit: string | number) => {
    const limit =
      typeof newLimit === "string" ? parseInt(newLimit, 10) : newLimit;
    setVehicleParams((prevParams) => ({ ...prevParams, limit, page: 1 }));
  };

  const handleDriverPageSizeChange = (newLimit: string | number) => {
    const limit =
      typeof newLimit === "string" ? parseInt(newLimit, 10) : newLimit;
    setDriverParams((prevParams) => ({ ...prevParams, limit, page: 1 }));
  };

  const handleVehicleFilterSubmit = (filterParams: any) => {
    setVehicleParams((prev) => ({
      ...prev,
      ...filterParams,
    }));
  };

  const handleDriverFilterSubmit = (filterParams: any) => {
    setDriverParams((prev) => ({
      ...prev,
      ...filterParams,
    }));
  };

  const handleClearVehicleAllFilters = () => {
    setVehicleParams({
      search: "",
      start_date: dayjs().startOf("month").format("YYYY-MM-DD"),
      end_date: dayjs().endOf("month").format("YYYY-MM-DD"),
      page: 1,
      limit: 10,
      is_active: "",
      ref_vehicle_status_code: "",
      vehicel_car_type_detail: "",
    });
  };

  const handleClearDriverAllFilters = () => {
    setDriverParams({
      search: "",
      start_date: dayjs().startOf("month").format("YYYY-MM-DD"),
      end_date: dayjs().endOf("month").format("YYYY-MM-DD"),
      page: 1,
      limit: 10,
      is_active: "",
      work_type: "",
      ref_driver_status_code: "",
    });
  };

  const VehicleHeader = () => (
    <div className="page-section-header border-0 mt-5">
      <div className="page-header-left">
        <div className="page-title">
          <span className="page-title-label">ยานพาหนะ</span>
          <span className="font-bold text-gray-500 border border-gray-300 px-2 py-1 rounded-lg text-sm">
            {vehiclePagination.total ?? 0} คัน
          </span>
        </div>
      </div>
    </div>
  );

  const DriverHeader = () => (
    <div className="page-section-header border-0 mt-5">
      <div className="page-header-left">
        <div className="page-title">
          <span className="page-title-label">พนักงานขับรถ</span>
          <span className="font-bold text-gray-500 border border-gray-300 px-2 py-1 rounded-lg text-sm">
            {driverPagination.total ?? 0} คน
          </span>
        </div>
      </div>
    </div>
  );

  const debouncedSetVehicleParams = useMemo(
    () =>
      debounce((value: string) => {
        setVehicleParams((prev) => ({
          ...prev,
          search: value.trim().length >= 3 ? value : "",
        }));
      }, 500),
    []
  );

  const VehicleActions = () => (
    <div className="flex gap-4 md:flex-row md:items-center md:justify-between">
      <div className="flex gap-4 md:flex-row md:items-center">
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex flex-wrap items-center gap-2">
            {statusOptions.map(({ value, status }) => (
              <button key={value} onClick={() => toggleFilter(value)}>
                <VehicleStatus
                  status={status}
                  isActive={filterParams.includes(value)}
                />
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 justify-start md:justify-end">
        <DateRangePicker
          date={selectedRange}
          onChange={(range) => {
            setVehicleParams((prev) => ({
              ...prev,
              start_date: range?.from
                ? dayjs(range?.from).format("YYYY-MM-DD")
                : "",
              end_date: range?.to ? dayjs(range?.to).format("YYYY-MM-DD") : "",
            }));

            setSelectedRange(range || undefined);
          }}
        />
        <button
          onClick={handleOpenVehicleFilterModal}
          className="btn btn-secondary btn-filtermodal h-[40px] min-h-[40px]"
        >
          <i className="material-symbols-outlined">filter_list</i>
          <span className="text-base font-bold">ตัวกรอง</span>
          <span className="badge badge-brand badge-outline rounded-[50%]">
            {vehicleParams.is_active?.split(",").filter((e) => e !== "")
              .length +
              vehicleParams.ref_vehicle_status_code
                ?.split(",")
                .filter((e) => e !== "").length || 0}
          </span>
        </button>

        <button
          onClick={toggleDropdown}
          className="btn btn-secondary h-[40px] min-h-[40px] flex items-center justify-center relative"
        >
          <i className="material-symbols-outlined text-lg">view_column</i>
        </button>
      </div>
    </div>
  );

  const debouncedSetDriverParams = useMemo(
    () =>
      debounce((value: string) => {
        setDriverParams((prev) => ({
          ...prev,
          search: value.trim().length >= 3 ? value : "",
        }));
      }, 500),
    []
  );

  const DriverActions = () => (
    <div className="flex gap-4 md:flex-row md:items-center md:justify-between">
      <button
        onClick={handleOpenDriverFilterModal}
        className="btn btn-secondary btn-filtermodal h-[40px] min-h-[40px]"
      >
        <i className="material-symbols-outlined">filter_list</i>
        <span className="text-base font-bold">ตัวกรอง</span>
        <span className="badge badge-brand badge-outline rounded-[50%]">
          {driverParams.is_active?.split(",").filter((e) => e !== "").length +
            driverParams.work_type?.split(",").filter((e) => e !== "").length +
            driverParams.ref_driver_status_code
              ?.split(",")
              .filter((e) => e !== "").length || 0}
        </span>
      </button>
    </div>
  );

  const RenderVehicleTableOrNoData = () => {
    const dropdownRef = useRef(null);

    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (
          dropdownRef.current &&
          !(dropdownRef.current as any).contains(event.target)
        ) {
          setShowDropdown(false);
        }
      };
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
      <div className="relative">
        {showDropdown && (
          <DropdownMenu
            dropdownRef={dropdownRef}
            selectedOption={selectedOption}
            handleSelect={handleSelect}
          />
        )}

        {dataVehicle.length !== 0 ? (
          <div className="overflow-x-auto mt-4">
            <CarpoolVehicleListTable
              dataRequest={dataVehicle}
              params={vehicleParams}
              selectedOption={selectedOption}
              lastMonth={vehicleLastMonth}
            />
            <PaginationControls
              pagination={vehiclePagination}
              onPageChange={handleVehiclePageChange}
              onPageSizeChange={handleVehiclePageSizeChange}
            />
          </div>
        ) : (
          <VehicleNoData
            imgSrc={"/assets/img/empty/search_not_found.png"}
            title={"ไม่พบข้อมูล"}
            desc={"เปลี่ยนคำค้นหรือเงื่อนไขแล้วลองใหม่อีกครั้ง"}
            button={"ล้างตัวกรอง"}
            useModal={handleClearVehicleAllFilters}
          />
        )}
      </div>
    );
  };

  const RenderDriverTableOrNoData = () => {
    const dropdownRef = useRef(null);

    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (
          dropdownRef.current &&
          !(dropdownRef.current as any).contains(event.target)
        ) {
          setShowDropdown(false);
        }
      };
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
      <div>
        {showDropdown && (
          <div className="absolute right-0 mt-2 w-64 bg-white border border-gray-300 rounded-xl shadow z-50">
            <button
              onClick={() => handleSelect("all")}
              className="flex items-center px-4 py-2 text-sm hover:bg-gray-100"
              role="menuitem"
            >
              {selectedOption === "all" ? (
                <i className="material-symbols-outlined text-blue-600 mr-2">
                  check
                </i>
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
                <i className="material-symbols-outlined text-blue-600 mr-2">
                  check
                </i>
              ) : (
                <span className="w-4 mr-2" />
              )}
              แสดงเฉพาะคอลัมน์แรก
            </button>
          </div>
        )}

        {dataDriver.length !== 0 ? (
          <>
            <CarpoolDriverListTable
              dataRequest={dataDriver}
              params={driverParams}
              selectedOption={selectedOption}
              lastMonth={driverLastMonth}
            />
            <PaginationControls
              pagination={driverPagination}
              onPageChange={handleDriverPageChange}
              onPageSizeChange={handleDriverPageSizeChange}
            />
          </>
        ) : (
          <VehicleNoData
            imgSrc={"/assets/img/empty/search_not_found.png"}
            title={"ไม่พบข้อมูล"}
            desc={"เปลี่ยนคำค้นหรือเงื่อนไขแล้วลองใหม่อีกครั้ง"}
            button={"ล้างตัวกรอง"}
            useModal={handleClearDriverAllFilters}
          />
        )}
      </div>
    );
  };

  return (
    <div>
      <VehicleHeader />
      <div className="flex justify-between items-center mb-4 gap-4">
        <SearchInput
          defaultValue={vehicleParams.search}
          placeholder="เลขทะเบียน, ยี่ห้อ, รุ่น"
          onSearch={debouncedSetVehicleParams}
        />
        <VehicleActions />
      </div>
      <RenderVehicleTableOrNoData />

      <DriverHeader />
      <div className="flex justify-between items-center mb-4 gap-4">
        <SearchInput
          defaultValue={driverParams.search}
          placeholder="ชื่อ-นามสกุล, ชื่อเล่น, สังกัด"
          onSearch={debouncedSetDriverParams}
        />
        <DriverActions />
      </div>
      <RenderDriverTableOrNoData />

      <VehicleFilterModal
        ref={filterVehicleModalRef}
        onSubmitFilter={handleVehicleFilterSubmit}
        flag="TIMELINE"
        vehicleParams={vehicleParams}
        setVehicleParams={setVehicleParams}
      />
      <DriverFilterModal
        ref={filterDriverModalRef}
        onSubmitFilter={handleDriverFilterSubmit}
        flag="TIMELINE"
        driverParams={driverParams}
        setDriverParams={setDriverParams}
      />
    </div>
  );
}

const DropdownMenu = ({ dropdownRef, selectedOption, handleSelect }: any) => (
  <div
    ref={dropdownRef}
    className="absolute right-0 mt-2 w-64 bg-white border border-gray-300 rounded-xl shadow z-50"
  >
    {["all", "first"].map((option) => (
      <button
        key={option}
        onClick={() => handleSelect(option)}
        className="flex items-center px-4 py-2 text-sm hover:bg-gray-100"
        role="menuitem"
      >
        {selectedOption === option ? (
          <i className="material-symbols-outlined text-blue-600 mr-2">check</i>
        ) : (
          <span className="w-4 mr-2" />
        )}
        {option === "all" ? "แสดงทุกคอลัมน์" : "แสดงเฉพาะคอลัมน์แรก"}
      </button>
    ))}
  </div>
);
