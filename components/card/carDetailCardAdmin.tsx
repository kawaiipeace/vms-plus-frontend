import { VehicleDetailType } from "@/app/types/vehicle-detail-type";
import VehicleDetailModel from "@/components/modal/vehicleDetailModal";
import Image from "next/image";
import { useRef } from "react";
import AdminVehiclePickModal from "../modal/adminVehiclePickModal";
import { RequestDetailType } from "@/app/types/request-detail-type";
import stationImageMap from "@/utils/stationImageMap";
import CarCardItem from "../carCardItem";

interface CarDetailCardProps {
  vehicle?: VehicleDetailType;
  requestData?: RequestDetailType;
  seeDetail?: boolean;
  selectVehicle?: boolean;
  reqId?: string;
  onUpdate?: () => void;
}

export default function CarDetailCardAdmin({
  vehicle,
  seeDetail,
  selectVehicle,
  requestData,
  reqId,
  onUpdate,
}: CarDetailCardProps) {
  const vehicleDetailModalRef = useRef<{
    openModal: () => void;
    closeModal: () => void;
  } | null>(null);
  const adminVehiclePickModalRef = useRef<{
    openModal: () => void;
    closeModal: () => void;
  } | null>(null);

  if (!vehicle) {
    return null;
  }

  console.log('vehicle',vehicle);
  const stationNames =
    vehicle?.vehicle_department?.fleet_card_oil_stations
      ?.split(",")
      .map((s) => s.trim().toLowerCase()) || [];

  const stationImages = stationNames
    .map((name) => stationImageMap[name])
    .filter(Boolean);

  return (
    <div className="card card-section-inline gap-4 flex-col">
      <div className="card-body">
        <div className="card-body-inline">
          <div className="img img-square w-full md:h-[239px] h-[120px] rounded-md overflow-hidden">
            <Image
              src={
                (vehicle?.vehicle_imgs && vehicle?.vehicle_imgs[0]) ||
                "/assets/img/sample-car.jpeg"
              }
              width={400}
              height={200}
              className="object-cover w-full h-full"
              alt="vehicle image"
            />
          </div>
          <div className="card-content">
            <div className="card-content-top">
              <div className="card-title">
                {vehicle?.vehicle_brand_name} {vehicle?.vehicle_model_name}
              </div>
              <div className="card-subtitle">
                {vehicle?.vehicle_license_plate}{" "}
                {vehicle?.vehicle_license_plate_province_full}
              </div>
              <div className="supporting-text-group">
                <div className="supporting-text">{vehicle?.CarType}</div>
                <div className="supporting-text">
                  {vehicle?.vehicle_department?.vehicle_owner_dept_short}
                </div>
              </div>
            </div>

            <div className="card-item-group grid grid-cols-1">
              <div className="card-item col-span-2">
                <i className="material-symbols-outlined">credit_card</i>
                <div className="card-item-text w-full !flex justify-between">
                  บัตรเติมน้ำมัน{" "}
                  <span className="text-color-secondary">
                    <div className="flex gap-2 items-center flex-wrap">
                      {stationImages.map((image, index) => (
                        <Image
                          key={index}
                          src={image}
                          alt={`image-${index}`}
                          width={16}
                          height={16}
                          className="rounded-full"
                        />
                      ))}
                    </div>
                  </span>
                </div>
              </div>

              <div className="card-item col-span-2">
                <i className="material-symbols-outlined">
                  airline_seat_recline_extra
                </i>
                <div className="card-item-text w-full !flex justify-between">
                  จำนวนที่นั่ง
                  <span className="text-color-secondary">
                    {" "}
                    {vehicle?.seat} ที่นั่ง
                  </span>
                </div>
              </div>

              <div className="card-item col-span-2">
                <i className="material-symbols-outlined">road</i>
                <div className="card-item-text w-full !flex justify-between">
                  ระยะทางเดือนก่อน{" "}
                  <span className="text-color-secondary">
                    {" "}
                    {vehicle?.vehicle_department?.vehicle_mileage_last_month} km
                  </span>
                </div>
              </div>

              <div className="card-item col-span-2">
                <i className="material-symbols-outlined">
                  swap_driving_apps_wheel
                </i>
                <div className="card-item-text w-full !flex justify-between">
                  เลขไมล์ล่าสุด{" "}
                  <span className="text-color-secondary"> {vehicle?.vehicle_department?.vehicle_mileage}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {seeDetail && (
          <div className="card-actioins w-full">
            <div className="flex gap-3">
              <button
                className={`btn ${
                  selectVehicle ? "btn-secondary" : "btn-secondary"
                } flex-1`}
                onClick={() => vehicleDetailModalRef.current?.openModal()}
              >
                ดูรายละเอียด
              </button>
              {selectVehicle && (
                <button
                  className="btn btn-secondary flex-1"
                  onClick={() => adminVehiclePickModalRef.current?.openModal()}
                >
                  เลือกยานพาหนะ
                </button>
              )}
            </div>
          </div>
        )}
      </div>
      <AdminVehiclePickModal
        reqId={reqId}
        requestData={requestData}
        typeName={requestData?.requested_vehicle_type}
        ref={adminVehiclePickModalRef}
        onUpdate={onUpdate}
      />
      <VehicleDetailModel
        ref={vehicleDetailModalRef}
        vehicleId={vehicle?.mas_vehicle_uid || ""}
        status="detail"
      />
    </div>
  );
}
