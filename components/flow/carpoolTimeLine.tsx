import { useEffect, useMemo, useRef, useState } from "react";
import "flatpickr/dist/themes/material_blue.css";
import dayjs from "dayjs";
import VehicleStatus from "../vehicle/status";
import SearchInput from "../vehicle/input/search";
import { PaginationType } from "@/app/types/vehicle-management/vehicle-list-type";
import PaginationControls from "../table/pagination-control";
import VehicleNoData from "../vehicle/noData";
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
import DateRangePicker from "../vehicle/input/dateRangeInput";

export default function CarpoolTimeLine() {
  const id = useSearchParams().get("id");

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
  const [selectedOption, setSelectedOption] = useState<"all" | "first">("all");

  const filterVehicleModalRef = useRef<VehicleFilterModalRef>(null);
  const filterDriverModalRef = useRef<DriverFilterModalRef>(null);

  useEffect(() => {
    if (id) {
      const fetchDataVehicle = async () => {
        try {
          const response: any = await getCarpoolVehicleTimeline(
            id,
            vehicleParams
          );
          console.log("vehicle: ", response);
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
          console.log("driver: ", response);
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
    <div className="flex gap-4 border-l-8 border-brand-900 p-4 rounded-none">
      <span className="text-xl font-bold">ยานพาหนะ</span>
      <span className="font-bold text-gray-500 border border-gray-300 px-2 py-1 rounded-lg text-sm">
        {vehiclePagination.total} คัน
      </span>
    </div>
  );

  const DriverHeader = () => (
    <div className="flex gap-4 border-l-8 border-brand-900 p-4 rounded-none">
      <span className="text-xl font-bold">พนักงานขับรถ</span>
      <span className="font-bold text-gray-500 border border-gray-300 px-2 py-1 rounded-lg text-sm">
        {driverPagination.total} คน
      </span>
    </div>
  );

  const debouncedSetVehicleParams = useMemo(
    () =>
      debounce((value: string) => {
        setVehicleParams((prev) => ({
          ...prev,
          search: value,
        }));
      }, 500),
    []
  );

  const VehicleActions = () => (
    <div className="flex flex-col md:flex-row md:justify-between gap-4 mt-5">
      <SearchInput
        defaultValue={vehicleParams.search}
        placeholder="เลขทะเบียน, ยี่ห้อ, รุ่น"
        onSearch={debouncedSetVehicleParams}
      />
      <div className="flex gap-4">
        <div className="flex flex-wrap items-center gap-2">
          <VehicleStatus status="รออนุมัติ" />
          <VehicleStatus status="ไป - กลับ" />
          <VehicleStatus status="ค้างแรม" />
          <VehicleStatus status="เสร็จสิ้น" />
        </div>
        <DateRangePicker
          date={{
            from: dayjs(vehicleParams.start_date).toDate(),
            to: dayjs(vehicleParams.end_date).toDate(),
          }}
          onChange={(range) => {
            setVehicleParams((prev) => ({
              ...prev,
              start_date: range?.from
                ? dayjs(range?.from).format("YYYY-MM-DD")
                : "",
              end_date: range?.to ? dayjs(range?.to).format("YYYY-MM-DD") : "",
            }));

            setDriverParams((prev) => ({
              ...prev,
              start_date: range?.from
                ? dayjs(range?.from).format("YYYY-MM-DD")
                : "",
              end_date: range?.to ? dayjs(range?.to).format("YYYY-MM-DD") : "",
            }));
          }}
        />
        <button
          onClick={handleOpenVehicleFilterModal}
          className="btn btn-secondary btn-filtersmodal h-[40px] min-h-[40px] flex items-center gap-1 px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-700 shadow-sm hover:bg-gray-100 transition"
        >
          <i className="material-symbols-outlined text-lg">filter_list</i>
          <span className="text-base font-semibold">
            ตัวกรอง{" "}
            {/* <span className="badge badge-brand badge-outline rounded-[50%]">
              {vehicleParams.is_active?.split(",").filter((e) => e !== "")
                .length +
                vehicleParams.ref_vehicle_status_code
                  ?.split(",")
                  .filter((e) => e !== "").length || 0}
            </span> */}
          </span>
        </button>
        <button
          onClick={toggleDropdown}
          className="btn btn-secondary btn-filtersmodal h-[40px] min-h-[40px] flex items-center gap-1 px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-700 shadow-sm hover:bg-gray-100 transition"
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
          search: value,
        }));
      }, 500),
    []
  );

  const DriverActions = () => (
    <div className="flex flex-col md:flex-row md:justify-between gap-4 mt-5">
      <SearchInput
        defaultValue={driverParams.search}
        placeholder="ชื่อ-นามสกุล, ชื่อเล่น, สังกัด"
        onSearch={debouncedSetDriverParams}
      />
      <div className="flex gap-4">
        <button
          onClick={handleOpenDriverFilterModal}
          className="btn btn-secondary btn-filtersmodal h-[40px] min-h-[40px] flex items-center gap-1 px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-700 shadow-sm hover:bg-gray-100 transition"
        >
          <i className="material-symbols-outlined text-lg">filter_list</i>
          <span className="text-base font-semibold">
            ตัวกรอง{" "}
            {/* <span className="badge badge-brand badge-outline rounded-[50%]">
              {driverParams.is_active?.split(",").filter((e) => e !== "")
                .length +
                driverParams.work_type?.split(",").filter((e) => e !== "")
                  .length +
                driverParams.ref_driver_status_code
                  ?.split(",")
                  .filter((e) => e !== "").length || 0}
            </span> */}
          </span>
        </button>
      </div>
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

        {dataVehicle.length !== 0 ? (
          <>
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
          </>
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
      <VehicleActions />
      <RenderVehicleTableOrNoData />
      <DriverHeader />
      <DriverActions />
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
