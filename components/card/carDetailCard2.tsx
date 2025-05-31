import { VehicleDetailType } from "@/app/types/vehicle-detail-type";
import VehicleDetailModel from "@/components/modal/vehicleDetailModal";
import Image from "next/image";
import { useRef } from "react";

interface Props {
  vehicle?: VehicleDetailType;
  reqId?: string;
}

export default function CarDetailCard2({ vehicle, reqId }: Props) {
  const vehicleDetailModalRef = useRef<{
    openModal: () => void;
    closeModal: () => void;
  } | null>(null);

  if (!vehicle) {
    return null;
  }

  return (
    <div className="card card-section-inline gap-4 flex-col">
      <div className="card-body">
        <div className="card-body-inline">
          <div className="img img-square w-full md:h-[239px] md:aspect-auto !aspect-square h-auto rounded-md overflow-hidden self-start">
            <Image
              src={
                (vehicle?.vehicle_imgs && vehicle?.vehicle_imgs[0]) ||
                "/assets/img/sample-car.jpeg"
              }
              width={100}
              height={100}
              className="object-cover w-full h-full"
              alt=""
            />
          </div>
          <div className="card-content">
            <div className="card-content-top pr-2">
              <div className="card-title">
                {vehicle?.vehicle_brand_name || vehicle?.vehicle_model_name
                  ? vehicle?.vehicle_brand_name +
                    " " +
                    vehicle?.vehicle_model_name
                  : "-"}
              </div>
              <div className="card-subtitle">
                {vehicle?.vehicle_license_plate || "-"} {vehicle?.vehicle_license_plate_province_full}
              </div>
              <div className="supporting-text-group">
                <div className="supporting-text">{vehicle?.CarType || "-"}</div>
                <div className="supporting-text">
                  {vehicle?.vehicle_owner_dept_sap || "-"}
                </div>
              </div>
              <div className="md:hidden flex">
                <button
                  className="btn bg-transparent text-[#A80689] outline-none border-none shadow-none p-0 ml-auto"
                  onClick={() => vehicleDetailModalRef.current?.openModal()}
                >
                  ดูรายละเอียด &#62;
                </button>
              </div>
            </div>

            <div className="card-item-group md:!grid !hidden">
              {vehicle?.is_has_fleet_card === 1 && (
                <div className="card-item col-span-2">
                  <i className="material-symbols-outlined">credit_card</i>
                  <span className="card-item-text">บัตรเติมน้ำมัน</span>
                </div>
              )}
              {vehicle?.ref_fuel_type?.ref_fuel_type_name_th && (
                <div className="card-item col-span-2">
                  <i className="material-symbols-outlined">local_gas_station</i>
                  <span className="card-item-text">
                    {vehicle?.ref_fuel_type.ref_fuel_type_name_th}
                  </span>
                </div>
              )}
              {vehicle?.vehicle_gear && (
                <div className="card-item col-span-2">
                  <i className="material-symbols-outlined">auto_transmission</i>
                  <span className="card-item-text">
                    {vehicle?.vehicle_gear === "NORMAL"
                      ? "เกียร์ธรรมดา"
                      : "เกียร์อัตโนมัติ"}
                  </span>
                </div>
              )}
              <div className="card-item col-span-2">
                <i className="material-symbols-outlined">
                  airline_seat_recline_extra
                </i>
                <span className="card-item-text">{vehicle?.seat} ที่นั่ง</span>
              </div>
            </div>
          </div>
        </div>
        <div className="card-actioins w-full md:block hidden">
          <button
            className="btn btn-secondary w-full"
            onClick={() => vehicleDetailModalRef.current?.openModal()}
          >
            ดูรายละเอียด
          </button>
        </div>
      </div>
      <VehicleDetailModel
        ref={vehicleDetailModalRef}
        vehicleId={vehicle?.mas_vehicle_uid || ""}
        status="detail"
      />
    </div>
  );
}
