import { RequestDetailType } from "@/app/types/request-detail-type";
import VehicleDetailModel from "@/components/modal/vehicleDetailModal";
import stationImageMap from "@/utils/stationImageMap";
import Image from "next/image";
import { useRef } from "react";
import CarCardItem from "../carCardItem";

interface Props {
  requestData?: RequestDetailType;
}

export default function VehicleDetailCard({ requestData }: Props) {
  const vehicleDetailModalRef = useRef<{
    openModal: () => void;
    closeModal: () => void;
  } | null>(null);

  if (!requestData) {
    return null;
  }
  const stationNames =
    requestData?.vehicle?.vehicle_department?.fleet_card_oil_stations
      ?.split(",")
      .map((s) => s.trim().toLowerCase()) || [];

  const stationImages = stationNames
    .map((name) => stationImageMap[name])
    .filter(Boolean);

  return (
    <div className="card card-section-inline gap-4 flex-col">
      <div className="card-body">
        <div className="card-body-inline">
          <div className="img img-square w-full md:h-[239px] md:aspect-auto !aspect-square h-auto rounded-md overflow-hidden self-start">
            <Image
              src={
                (requestData?.vehicle?.vehicle_imgs &&
                  requestData?.vehicle?.vehicle_imgs[0]) ||
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
                {requestData?.vehicle?.vehicle_brand_name ||
                requestData?.vehicle?.vehicle_model_name
                  ? requestData?.vehicle?.vehicle_brand_name +
                    " " +
                    requestData?.vehicle?.vehicle_model_name
                  : "-"}
              </div>
              <div className="card-subtitle">
                {requestData?.vehicle?.vehicle_license_plate || "-"}{" "}
                {requestData?.vehicle?.vehicle_license_plate_province_short ||
                  "-"}
              </div>
              <div className="supporting-text-group">
                <div className="supporting-text">
                  {requestData?.vehicle?.CarType || "-"}
                </div>
                <div className="supporting-text">
                  {requestData?.vehicle?.vehicle_department
                    ?.vehicle_owner_dept_short || "-"}
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
              {requestData?.vehicle?.vehicle_department?.fleet_card_no && (
                <div className="card-item col-span-2">
                  {/* <i className="material-symbols-outlined">credit_card</i>
                  <span className="card-item-text">บัตรเติมน้ำมัน</span> */}
                  <div className="flex gap-2 items-center flex-wrap">
                    {requestData?.vehicle?.vehicle_department
                      ?.fleet_card_no && (
                      <CarCardItem
                        icon="credit_card"
                        title="บัตรเติมน้ำมัน"
                        images={stationImages.length > 0 ? stationImages : []}
                        value=""
                      />
                    )}
                  </div>
                </div>
              )}
              {requestData?.vehicle?.ref_fuel_type?.ref_fuel_type_name_th && (
                <div className="card-item col-span-2">
                  <i className="material-symbols-outlined icon-settings-fill-300-20">
                    local_gas_station
                  </i>
                  <span className="card-item-text">
                    {requestData?.vehicle?.ref_fuel_type.ref_fuel_type_name_th}
                  </span>
                </div>
              )}
              {requestData?.vehicle?.vehicle_gear && (
                <div className="card-item col-span-2">
                  <i className="material-symbols-outlined icon-settings-fill-300-20">
                    airport_shuttle
                  </i>
                  <span className="card-item-text">
                    {requestData?.vehicle?.vehicle_department.owner_dept_name}
                  </span>
                </div>
              )}
              <div className="card-item col-span-2">
                <i className="material-symbols-outlined icon-settings-fill-300-2">
                  local_parking
                </i>
                <span className="card-item-text">
                  {requestData?.parking_place}
                </span>
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
        vehicleId={requestData?.vehicle?.mas_vehicle_uid || ""}
        status="detail"
      />
    </div>
  );
}
