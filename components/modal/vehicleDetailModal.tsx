import { VehicleDetailType } from "@/app/types/vehicle-detail-type";
import CarCardItem from "@/components/carCardItem";
import ImgSlider from "@/components/imgSlider";
import { fetchVehicleDetail } from "@/services/masterService";
import useSwipeDown from "@/utils/swipeDown";
import Image from "next/image";
import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
interface VehicleDetailModelProps {
  onSelect?: (vehicle: string) => void;
  vehicleId: string;
  status?: string;
}

interface VehicleDetailModelRef {
  openModal: () => void;
  closeModal: () => void;
}

const VehicleDetailModel = forwardRef<
  VehicleDetailModelRef,
  VehicleDetailModelProps
>(({ onSelect, status, vehicleId }, ref) => {
  const modalRef = useRef<HTMLDialogElement>(null);
  const [vehicleDetail, setVehicleDetail] = useState<VehicleDetailType | null>(
    null
  );

  // Fetch vehicle details when component mounts

  const fetchVehicleDetailData = async () => {
    try {
      const response = await fetchVehicleDetail(vehicleId);
      console.log("vehicledetai", response);

      if (response.status === 200) {
        setVehicleDetail(response.data ?? {});
      }
    } catch (error) {
      console.error("Error fetching vehicle details:", error);
    }
  };

  // Image Handling
  const imageUrls = vehicleDetail?.vehicle_imgs;

  useImperativeHandle(ref, () => ({
    openModal: () => {
      if (vehicleId) {
        fetchVehicleDetailData();
      }
      modalRef.current?.showModal();
    },
    closeModal: () => modalRef.current?.close(),
  }));

  const stationImageMap: Record<string, string> = {
    ptt: "/assets/img/gas/1.png",
    bcp: "/assets/img/gas/2.png",
    shell: "/assets/img/gas/3.png",
    pt: "/assets/img/gas/5.png",
    caltex: "/assets/img/gas/4.png",
  };

  const stationNames =
    vehicleDetail?.vehicle_department?.fleet_card_oil_stations
      ?.split(",")
      .map((s) => s.trim().toLowerCase()) || [];

  const stationImages = stationNames
    .map((name) => stationImageMap[name])
    .filter(Boolean); // Remove undefined if a station name isn't mapped

  const swipeDownHandlers = useSwipeDown(() => modalRef.current?.close());

  return (
    <dialog ref={modalRef} className="modal">
      <div className="modal-box max-w-[1200px] p-0 relative bg-white">
        <div className="bottom-sheet" {...swipeDownHandlers}>
          <div className="bottom-sheet-icon"></div>
        </div>
        <div className="modal-header flex justify-between">
          <h2 className="text-lg font-bold">รายละเอียด</h2>
          <button
            className="btn btn-icon"
            onClick={() => modalRef.current?.close()}
          >
            <i className="material-symbols-outlined">close</i>
          </button>
        </div>

        <div className="modal-body flex flex-col md:flex-row gap-5">
          {/* Image Slider */}
          <div className="w-full md:w-6/12">
            <ImgSlider id="1" images={imageUrls ?? []} />
          </div>

          <div className="modal-inner-scrollable md:w-6/12 w-full">
            <div className="modal-section">
              <div className="modal-section-inner">
                <div className="modal-inner-title">
                  {vehicleDetail?.vehicle_brand_name?.trim()}{" "}
                  {vehicleDetail?.vehicle_model_name?.trim()}
                </div>
                <div className="modal-inner-subtitle">
                  {vehicleDetail?.vehicle_license_plate?.trim()}{" "}
                  {vehicleDetail?.vehicle_license_plate_province_short}
                </div>
                <div className="supporting-text-group">
                  <div className="supporting-text">
                    {vehicleDetail?.CarType?.trim()}
                  </div>
                  <div className="supporting-text">
                    {vehicleDetail?.vehicle_department?.vehicle_owner_dept_short.trim()}
                  </div>
                </div>
              </div>

              <div className="card-item-group">
                <CarCardItem
                  icon="calendar_clock"
                  title="อายุการใช้งาน"
                  value={(vehicleDetail?.age || "-") + " ปี"}
                />
                <CarCardItem
                  icon="swap_driving_apps_wheel"
                  title="เลขไมล์"
                  value={` ${
                    vehicleDetail?.vehicle_department?.vehicle_mileage || "-"
                  }`}
                />
                <CarCardItem
                  icon="credit_card"
                  title="บัตรเติมน้ำมัน"
                  images={stationImages.length > 0 ? stationImages : []}
                  value={`${
                    vehicleDetail?.vehicle_department?.fleet_card_no ?? "-"
                  }`}
                />
                <CarCardItem
                  icon="local_gas_station"
                  title="ประเภทเชื้อเพลิง"
                  value={
                    vehicleDetail?.ref_fuel_type?.ref_fuel_type_name_th || "-"
                  }
                />
                <CarCardItem
                  icon="airline_seat_recline_extra"
                  title="จำนวนที่นั่ง"
                  value={
                    vehicleDetail?.seat ? `${vehicleDetail?.seat} ที่นั่ง` : "-"
                  }
                />
                <CarCardItem
                  icon="auto_transmission"
                  title="ประเภทเกียร์"
                  value={
                    vehicleDetail?.vehicle_gear === "NORMAL"
                      ? "เกียร์ธรรมดา"
                      : "เกียร์อัตโนมัติ"
                  }
                />
                <CarCardItem
                  icon="airport_shuttle"
                  title="รหัสข้างรถ"
                  value={`${
                    vehicleDetail?.vehicle_department?.vehicle_pea_id || "-"
                  }`}
                />
                <CarCardItem
                  icon="local_parking"
                  title="สถานที่จอดรถ"
                  value={`${
                    vehicleDetail?.vehicle_department?.parking_place || "-"
                  }`}
                />
              </div>
            </div>

            {vehicleDetail?.vehicle_department?.vehicle_user && (
              <div className="modal-section">
                <div className="modal-section-label">ผู้ดูแลยานพาหนะ</div>
                <div className="form-card">
                  <div className="form-card-body form-card-inline items-center">
                    <div className="form-group form-plaintext form-users items-center">
                      <Image
                        src={
                          vehicleDetail?.vehicle_department?.vehicle_user
                            ?.image_url || "/assets/img/avatar.svg"
                        }
                        className="avatar avatar-md"
                        width={100}
                        height={100}
                        alt=""
                      />
                      <div className="form-plaintext-group align-self-center">
                        <div className="form-label">
                          {
                            vehicleDetail?.vehicle_department?.vehicle_user
                              ?.full_name
                          }
                        </div>
                        <div className="supporting-text-group">
                          <div className="supporting-text">
                            {
                              vehicleDetail?.vehicle_department?.vehicle_user
                                ?.dept_sap_short
                            }
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="form-card-right align-self-center">
                      <div className="flex flex-wrap gap-4">
                        <div className="col-span-12 md:col-span-6">
                          <div className="form-group form-plaintext">
                            <i className="material-symbols-outlined">
                              smartphone
                            </i>
                            <div className="form-plaintext-group">
                              <div className="form-text text-nowrap">
                                {
                                  vehicleDetail?.vehicle_department
                                    ?.vehicle_user?.tel_mobile
                                }
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="col-span-12 md:col-span-6">
                          <div className="form-group form-plaintext">
                            <i className="material-symbols-outlined">call</i>
                            <div className="form-plaintext-group">
                              <div className="form-text text-nowra">
                                {
                                  vehicleDetail?.vehicle_department
                                    ?.vehicle_user?.tel_internal
                                }
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div className="form-card mt-5">
              <div className="form-card-body form-card-inline items-center !bg-transparent text-left !p-0">
                <div className="form-group form-plaintext form-users items-center">
                  <div className="col-span-12">
                    <div className="form-group form-plaintext">
                      <div className="form-plaintext-group">
                        <div className="form-label">หมายเหตุ</div>
                        <div className="form-text">
                          {vehicleDetail?.vehicle_department?.remark}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Modal Actions */}
        <div className="modal-action">
          <button
            className="btn btn-secondary"
            onClick={() => modalRef.current?.close()}
          >
            ปิด
          </button>
          {status !== "detail" && (
            <button
              className="btn btn-primary"
              onClick={() => {
                if (onSelect)
                  onSelect(
                    vehicleDetail?.vehicle_brand_name?.trim() || "Unknown"
                  );
                modalRef.current?.close();
              }}
            >
              เลือก
            </button>
          )}
        </div>
      </div>
    </dialog>
  );
});

VehicleDetailModel.displayName = "VehicleDetailModel";
export default VehicleDetailModel;
