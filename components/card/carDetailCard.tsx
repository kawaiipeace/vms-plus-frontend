import { useRef } from "react";
import Image from "next/image";
import VehicleDetailModel from "@/components/modal/vehicleDetailModal";

interface VehicleDetail {
  mas_vehicle_uid?: string;
  vehicle_brand_name?: string;
  vehicle_model_name?: string;
  vehicle_license_plate?: string;
  vehicle_img?: string;
  CarType?: string;
  vehicle_owner_dept_sap?: string;
  is_has_fleet_card?: string;
  vehicle_gear?: string;
  ref_vehicle_subtype_code?: number;
  vehicle_user_emp_id?: string;
  ref_fuel_type_id?: number;
  seat?: number;
  age?: number;
  vehicle_imgs: string[];
  ref_fuel_type?: {
    ref_fuel_type_id?: number;
    ref_fuel_type_name_th?: string;
    ref_fuel_type_name_en?: string;
  };
  vehicle_department?: {
    vehicle_mileage: string;
    vehicle_fleet_card_no: string;
    vehicle_pea_id: string;
    parking_place: string;
    vehicle_user?: {
      emp_id: string;
      full_name: string;
      dept_sap: string;
      tel_internal?: string;
      tel_mobile: string;
      dept_sap_short: string;
      image_url: string;
    };
  };
}

interface CarDetailCardProps {
  vehicle?: VehicleDetail;
  seeDetail?: boolean;
}

export default function CarDetailCard({ vehicle, seeDetail }: CarDetailCardProps) {
  const vehicleDetailModalRef = useRef<{
    openModal: () => void;
    closeModal: () => void;
  } | null>(null);

  if (!vehicle) {
    return null; // or show a loading/skeleton UI
  }

  return (
    <div className="card card-section-inline gap-4 flex-col">
      <div className="card-body">
        <div className="card-body-inline">
          <div className="img img-square w-full h-[239px] rounded-md overflow-hidden">
            <Image
              src={vehicle?.vehicle_img || "/assets/img/sample-car.jpeg"}
              width={100}
              height={100}
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
                {vehicle?.vehicle_license_plate}
              </div>
              <div className="supporting-text-group">
                <div className="supporting-text">{vehicle?.CarType}</div>
                <div className="supporting-text">
                  {vehicle?.vehicle_owner_dept_sap}
                </div>
              </div>
            </div>

            <div className="card-item-group grid">
              {vehicle?.is_has_fleet_card === "1" && (
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
                  <span className="card-item-text">{vehicle?.vehicle_gear === "NORMAL"
                      ? "เกียร์ธรรมดา"
                      : "เกียร์อัตโนมัติ"}</span>
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
        { seeDetail &&
        <div className="card-actioins w-full">
          <button
            className="btn btn-default w-full"
            onClick={() => vehicleDetailModalRef.current?.openModal()}
          >
            ดูรายละเอียด
          </button>
        </div>
         }
      </div>
      <VehicleDetailModel
        ref={vehicleDetailModalRef}
        vehicleId={vehicle?.mas_vehicle_uid || ""}
        status="detail"
      />
    </div>
  );
}
