"use client";
import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react";
import { fetchVehicleCarTypes, fetchVehicles } from "@/services/masterService";
import useSwipeDown from "@/utils/swipeDown";
import SelectCarCard from "@/components/admin/cards/selectCarCard";
import VehicleDetailModel from "@/components/modal/admin/vehicleDetailModal";
import CustomSelectBadge from "@/components/customSelectBadge";
import { adminUpdateVehicle } from "@/services/bookingAdmin";
import ZeroRecord from "@/components/zeroRecord";
import { RequestVehicleType } from "@/app/types/request-detail-type";

interface Vehicle {
  mas_vehicle_uid: string;
  vehicle_license_plate: string;
  vehicle_brand_name: string;
  vehicle_model_name: string;
  car_type: string;
  vehicle_owner_dept_sap: string;
  vehicle_img: string;
  seat: number;
  is_admin_choose_vehicle?: boolean;
}

interface Props {
  reqId?: string;
  vehicleType?: RequestVehicleType;
  onClickDetail?: (id: string) => void;
  onSelect?: (vehicle: string) => void;
  onUpdate?: (data: any) => void;
}

const AdminVehiclePickModal = forwardRef<
  { openModal: () => void; closeModal: () => void },
  Props
>(({ onSelect, onUpdate,vehicleType, reqId, onClickDetail }, ref) => {
  const modalRef = useRef<HTMLDialogElement>(null);
  const hasReset = useRef(false);

  const vehicleDetailModalRef = useRef<{
    openModal: () => void;
    closeModal: () => void;
  } | null>(null);

  useImperativeHandle(ref, () => ({
    openModal: () => {
      hasReset.current = false;
      modalRef.current?.showModal();
    },
    closeModal: () => modalRef.current?.close(),
  }));

  const [params, setParams] = useState({
    search: "",
  });

  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [filteredVehicles, setFilteredVehicles] = useState<Vehicle[]>([]);
  const [selectedVehicleId, setSelectedVehicleId] = useState<string | null>(
    null
  );
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
    const filtered = vehicles.filter((vehicle: Vehicle) =>
      vehicle.vehicle_model_name.includes(value)
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
    setParams((prev) => ({ ...prev, category_code: selectedOption.value }));
  };

  const handleClearAllFilters = () => {
    setParams({
      search: "",
    });

  };


  useEffect(() => {
    const fetchVehicleData = async () => {
      try {
        const response = await fetchVehicles(params);
        if (response.status === 200) {
          setVehicles(response.data.vehicles);
          setFilteredVehicles(response.data.vehicles);

          hasReset.current = true;
        }
      } catch (error) {
        console.error("Error fetching requests:", error);
      }
    };
    fetchVehicleData();
  }, [params]);

  useEffect(() => {
    const fetchVehicleCarTypesData = async () => {
      try {
        const response = await fetchVehicleCarTypes();

        if (response.status === 200) {
          const vehicleCatData = response.data;

          const vehicleCatArr = [
            { value: "", label: "ทุกประเภทยานพาหนะ" },
            ...vehicleCatData.map(
              (cat: {
                ref_vehicle_type_code: string;
                ref_vehicle_type_name: string;
              }) => ({
                value: cat.ref_vehicle_type_code,
                label: cat.ref_vehicle_type_name,
              })
            ),
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

    fetchVehicleCarTypesData();
  }, [params]);

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
                vehicleType={vehicleType ? vehicleType?.ref_vehicle_type_name || "" : ""}
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
                      {groupedVehicles[currentSlide]?.map((vehicle, index) => (
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
                            subTitle={vehicle.vehicle_license_plate}
                            carType={vehicle.car_type}
                            deptSap={vehicle.vehicle_owner_dept_sap}
                            seat={vehicle.seat}
                            isSelected={
                              selectedVehicleId === vehicle.mas_vehicle_uid
                            }
                            onSelect={() =>
                              handleVehicleSelect(vehicle.mas_vehicle_uid)
                            }
                            onClickSeeDetail={() =>
                              handleSeeDetail(vehicle.mas_vehicle_uid)
                            }
                          />
                        </div>
                      ))}
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

            {filteredVehicles.length <= 0 && vehicles.length > 0 && (
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
        </div>
      </div>

      <form method="dialog" className="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>
  );
});

AdminVehiclePickModal.displayName = "AdminVehiclePickModal";
export default AdminVehiclePickModal;
