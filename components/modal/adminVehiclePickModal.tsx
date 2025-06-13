"use client";
import React, {
  forwardRef,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  fetchSearchVehicleCarpools,
  fetchVehicleCarTypes,
} from "@/services/masterService";
import useSwipeDown from "@/utils/swipeDown";
import SelectCarCard from "@/components/admin/cards/selectCarCard";
import VehicleDetailModel from "@/components/modal/admin/vehicleDetailModal";
import CustomSelectBadge from "@/components/customSelectBadge";
import { adminUpdateVehicle } from "@/services/bookingAdmin";
import ZeroRecord from "@/components/zeroRecord";
import {
  RequestDetailType,
  RequestVehicleType,
} from "@/app/types/request-detail-type";

interface Vehicle {
  mas_vehicle_uid: string;
  vehicle_license_plate: string;
  vehicle_brand_name: string;
  vehicle_model_name: string;
  car_type: string;
  vehicle_owner_dept_sap: string;
  vehicle_img: string;
  seat: number;
  vehicle_pea_id?: string;
  is_admin_choose_vehicle?: boolean;
  vehicle_owner_dept_short?: string;
  vehicle_license_plate_province_full?: string;
  last_month_mileage?: number;
  vehicle_mileage?: number;
}

interface Props {
  reqId?: string;
  selectType?: string;
  desc?: string;
  vehicleType?: RequestVehicleType;
  typeName?: string;
  requestData?: RequestDetailType;
  onClickDetail?: (id: string) => void;
  onSelect?: (vehicle: string) => void;
  onUpdate?: (data: any) => void;
}

const AdminVehiclePickModal = forwardRef<
  { openModal: () => void; closeModal: () => void },
  Props
>(
  (
    {
      desc,
      onSelect,
      onUpdate,
      vehicleType,
      reqId,
      onClickDetail,
      selectType,
      typeName,
      requestData,
    },
    ref
  ) => {
    const modalRef = useRef<HTMLDialogElement>(null);
    const hasReset = useRef(false);
    const [loading, setLoading] = useState(false);

    const vehicleDetailModalRef = useRef<{
      openModal: () => void;
      closeModal: () => void;
    } | null>(null);

    useImperativeHandle(ref, () => ({
      openModal: () => {
        hasReset.current = false;
        setLoading(true);
        fetchVehicleData();
        fetchVehicleCarTypesData();
        modalRef.current?.showModal();
      },
      closeModal: () => modalRef.current?.close(),
    }));

    const [params, setParams] = useState({
      search: "",
      emp_id: "",
      start_date: "",
      end_date: "",
      mas_carpool_uid: "",
      car_type: "",
    });

    const [vehicles, setVehicles] = useState<Vehicle[]>([]);
    const [filteredVehicles, setFilteredVehicles] = useState<Vehicle[]>([]);
    const [selectedVehicleId, setSelectedVehicleId] = useState<string | null>(
      null
    );
    const [fetchFinished, setFetchFinished] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentSlide, setCurrentSlide] = useState(0);
    const [selectedVehicleIdForDetail, setSelectedVehicleIdForDetail] =
      useState<string>("");
    const [vehicleCatOptions, setVehicleCatOptions] = useState<
      { value: string; label: string }[]
    >([]);

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setSearchTerm(value);

      const filtered = vehicles.filter(
        (vehicle: Vehicle) =>
          vehicle.vehicle_license_plate
            ?.toLowerCase()
            .includes(value.toLowerCase()) ||
          vehicle.vehicle_brand_name
            ?.toLowerCase()
            .includes(value.toLowerCase()) ||
          vehicle.vehicle_model_name
            ?.toLowerCase()
            .includes(value.toLowerCase()) ||
          vehicle.vehicle_pea_id?.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredVehicles(filtered);
    };

    const handleSeeDetail = (vehicleId: string) => {
      setSelectedVehicleIdForDetail(vehicleId);
      vehicleDetailModalRef.current?.openModal();
      modalRef.current?.close();
    };

    const groupedVehicles = useMemo(() => {
      const chunkSize = 3;
      const result = [];
      for (let i = 0; i < filteredVehicles.length; i += chunkSize) {
        result.push(filteredVehicles.slice(i, i + chunkSize));
      }
      return result;
    }, [filteredVehicles, params]);

    const [selectedVehicleOption, setSelectedVehicleOption] = useState<{
      value: string;
      label: string;
    }>({ value: "", label: "ทุกประเภทยานพาหนะ" });

    const handleVehicleSelect = async (id: string) => {
      setSelectedVehicleId(id);
      const payload = {
        mas_vehicle_uid: id,
        trn_request_uid: reqId || "",
      };

      try {
        const response = await adminUpdateVehicle(payload);

        if (response) {
          console.log("test====>");
          if (onUpdate) {
            console.log("test====>");
            onUpdate(response.data);
          }

          modalRef.current?.close();
        }
      } catch (error) {
        console.error("Network error:", error);
      }
    };

    const handleVehicleTypeChange = async (selectedOption: {
      value: string;
      label: string;
    }) => {
      setSelectedVehicleOption(selectedOption);
      const newParams = { ...params, car_type: selectedOption.value };
      setParams(newParams);

      setLoading(true);
      setFetchFinished(false);
      try {
        const response = await fetchSearchVehicleCarpools(newParams);
        if (response.status === 200) {
          setVehicles(response.data.vehicles);
          setFilteredVehicles(response.data.vehicles);
          setCurrentSlide(0);
        } else {
          setVehicles([]);
          setFilteredVehicles([]);
        }
      } catch (error) {
        setVehicles([]);
        setFilteredVehicles([]);
        console.error("Search failed:", error);
      } finally {
        setLoading(false);
        setFetchFinished(true);
      }
    };

    const handleClearAllFilters = () => {
      setParams({
        search: "",
        emp_id: "",
        start_date: "",
        end_date: "",
        mas_carpool_uid: "",
        car_type: "",
      });
    };

    const fetchVehicleData = async () => {
      setLoading(true);
      setFetchFinished(false);

      // Build params locally
      const newParams = {
        search: "",
        emp_id: requestData?.vehicle_user_emp_id || "",
        start_date: requestData?.start_datetime || "",
        end_date: requestData?.end_datetime || "",
        mas_carpool_uid: requestData?.mas_carpool_uid || "",
        car_type: requestData?.requested_vehicle_type || "",
      };
      setParams(newParams);

      try {
        const response = await fetchSearchVehicleCarpools(newParams); // use newParams directly
        if (response.status === 200) {
          setVehicles(response.data.vehicles);

          setFilteredVehicles(response.data.vehicles);
          console.log("vehicle", response.data.vehicles);
          hasReset.current = true;
        }
      } catch (error) {
        console.error("Error fetching requests:", error);
      } finally {
        setLoading(false);
        setFetchFinished(true);
      }
    };

    const fetchVehicleCarTypesData = async () => {
      const vehicleParams = {
        emp_id: requestData?.vehicle_user_emp_id,
        start_date: requestData?.start_datetime,
        end_date: requestData?.end_datetime,
        mas_carpool_uid: requestData?.mas_carpool_uid,
      };
      console.log("vehicle", vehicleParams);
      try {
        const response = await fetchVehicleCarTypes(vehicleParams);

        if (response.status === 200) {
          const vehicleCatData = response.data;

          const vehicleCatArr = [
            { value: "", label: "ทุกประเภทยานพาหนะ" },
            ...vehicleCatData.map((cat: { ref_vehicle_type_name: string }) => ({
              value: cat.ref_vehicle_type_name,
              label: cat.ref_vehicle_type_name,
            })),
          ];

          setVehicleCatOptions(vehicleCatArr);
          setSelectedVehicleOption((prev) =>
            prev.value ? prev : vehicleCatArr[0]
          );
        }
      } catch (error) {
        console.error("Error fetching requests:", error);
      }
    };

    const swipeDownHandlers = useSwipeDown(() => modalRef.current?.close());

    return (
      <dialog ref={modalRef} className="modal">
        <div className="modal-box max-w-[1140px] p-0 relative modal-vehicle-pick overflow-hidden flex flex-col max-h-[90vh]">
          <div className="bottom-sheet" {...swipeDownHandlers}>
            <div className="bottom-sheet-icon"></div>
          </div>
          <div className="modal-header bg-white sticky top-0 flex justify-between z-10">
            <div className="modal-title">เลือกยานพาหนะ</div>
            <form method="dialog">
              <button className="close btn btn-icon border-none bg-transparent shadow-none btn-tertiary">
                <i className="material-symbols-outlined">close</i>
              </button>
            </form>
          </div>

          <div className="modal-body overflow-y-auto">
            {loading ? (
              <div className="flex justify-center items-center h-64"></div>
            ) : (
              <>
                <div className="page-section-header border-0">
                  <div className="page-header-left">
                    <div className="page-title">
                      <span className="page-title-label">เลือกยานพาหนะ</span>
                      <span className="badge badge-outline badge-gray page-title-status">
                        ว่าง {filteredVehicles.length} คัน
                      </span>
                    </div>
                  </div>
                </div>
                <div className="form-group">
                  <div className="flex justify-between items-top w-full">
                    <div className="input-group input-group-search hidden mb-5 w-[20em]">
                      <div className="input-group-prepend">
                        <span className="input-group-text search-ico-info">
                          <i className="material-symbols-outlined">search</i>
                        </span>
                      </div>

                      <input
                        type="text"
                        id="myInputTextField"
                        value={searchTerm}
                        onChange={handleSearch}
                        className="form-control dt-search-input"
                        placeholder="ค้นหาเลขทะเบียน, ยี่ห้อ, รหัสข้างรถ"
                      />
                    </div>
                    <CustomSelectBadge
                      w="md:w-[17rem]"
                      vehicleType={typeName}
                      options={vehicleCatOptions}
                      value={selectedVehicleOption}
                      onChange={handleVehicleTypeChange}
                    />
                  </div>

                  {filteredVehicles.length > 0 && (
                    <div className="relative w-full">
                      <div className="relative">
                        {/* Left Arrow */}
                        <button
                          className="absolute left-2 top-1/2 -translate-y-1/2 z-20 bg-white border border-gray-300 rounded-full p-1 shadow-sm transition disabled:opacity-50 disabled:bg-surface-disabled select-none"
                          style={{ width: "40px", height: "40px" }}
                          onClick={() =>
                            setCurrentSlide((prev) => Math.max(prev - 1, 0))
                          }
                          disabled={currentSlide === 0}
                        >
                          <i className="material-symbols-outlined text-lg">
                            keyboard_arrow_left
                          </i>
                        </button>

                        {/* Right Arrow */}
                        <button
                          className="absolute right-2 top-1/2 -translate-y-1/2 z-20 bg-white border border-gray-300 rounded-full p-1 shadow-sm transition disabled:opacity-50 disabled:bg-surface-disabled select-none"
                          style={{ width: "40px", height: "40px" }}
                          onClick={() =>
                            setCurrentSlide((prev) =>
                              Math.min(prev + 1, groupedVehicles.length - 1)
                            )
                          }
                          disabled={currentSlide === groupedVehicles.length - 1}
                        >
                          <i className="material-symbols-outlined text-lg">
                            keyboard_arrow_right
                          </i>
                        </button>

                        <div className="px-20">
                          <div className="grid grid-cols-3 gap-4">
                            {groupedVehicles[currentSlide]?.map(
                              (vehicle, index) => (
                                <div key={index} className="h-full">
                                  <SelectCarCard
                                    key={vehicle.mas_vehicle_uid}
                                    vehicleId={vehicle.mas_vehicle_uid}
                                    imgSrc={
                                      vehicle.vehicle_img ||
                                      "/assets/img/sample-car.jpeg"
                                    }
                                    title={
                                      vehicle.vehicle_brand_name +
                                      vehicle.vehicle_model_name
                                    }
                                    subTitle={
                                      vehicle.vehicle_license_plate +
                                      " " +
                                      vehicle.vehicle_license_plate_province_full
                                    }
                                    carType={vehicle.car_type}
                                    deptSap={vehicle.vehicle_owner_dept_short}
                                    seat={vehicle.seat}
                                    lastMonthMile={vehicle.last_month_mileage}
                                    monthMile={vehicle.vehicle_mileage}
                                    isSelected={
                                      selectedVehicleId ===
                                      vehicle.mas_vehicle_uid
                                    }
                                    onSelect={() =>
                                      handleVehicleSelect(
                                        vehicle.mas_vehicle_uid
                                      )
                                    }
                                    onClickSeeDetail={() =>
                                      handleSeeDetail(vehicle.mas_vehicle_uid)
                                    }
                                  />
                                </div>
                              )
                            )}
                          </div>
                        </div>
                      </div>

                      <VehicleDetailModel
                        reqId={reqId}
                        ref={vehicleDetailModalRef}
                        vehicleId={selectedVehicleIdForDetail}
                        onBack={() => modalRef.current?.showModal()}
                      />

                      <div className="indicator-daisy flex justify-center mt-4 gap-2">
                        {groupedVehicles.map((_, idx) => (
                          <button
                            key={idx}
                            className={`btn btn-xs !rounded-full focus:outline-none border-0 !min-h-2 !min-w-2 p-0 size-2 overflow-hidden ${
                              idx === currentSlide ? "active" : ""
                            }`}
                            onClick={() => setCurrentSlide(idx)}
                          ></button>
                        ))}
                      </div>
                    </div>
                  )}

                  {!loading &&
                    fetchFinished &&
                    filteredVehicles.length === 0 && (
                      <ZeroRecord
                        imgSrc="/assets/img/empty/search_not_found.png"
                        title="ไม่พบข้อมูล"
                        desc={<>เปลี่ยนคำค้นหรือเงื่อนไขแล้วลองใหม่อีกครั้ง</>}
                        button="ล้างตัวกรอง"
                        displayBtn={true}
                        btnType="secondary"
                        useModal={handleClearAllFilters}
                      />
                    )}
                </div>
              </>
            )}
          </div>
        </div>

        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    );
  }
);

AdminVehiclePickModal.displayName = "AdminVehiclePickModal";
export default AdminVehiclePickModal;
