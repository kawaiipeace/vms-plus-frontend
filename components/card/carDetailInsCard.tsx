import Image from "next/image";
import { RequestDetailType } from "@/app/types/request-detail-type";

interface CarDetailCardProps {
  requestData?: RequestDetailType;
}

export default function CarDetailInsCard({ requestData }: CarDetailCardProps) {


  return (
    <div className="card card-section-inline gap-4 flex-col">
      <div className="card-body">
        <div className="card-body-inline">
          <div className="img img-square w-full h-[239px] rounded-md overflow-hidden">
            <Image
              src={(requestData?.vehicle?.vehicle_imgs && requestData?.vehicle?.vehicle_imgs[0]) || "/assets/img/sample-car.jpeg"}
              width={100}
              height={100}
              className="object-cover w-full h-full"
              alt="vehicle image"
            />
          </div>
          <div className="card-content">
            <div className="card-content-top">
              <div className="card-title">
                {requestData?.vehicle?.vehicle_brand_name} {requestData?.vehicle?.vehicle_model_name}
              </div>
              <div className="card-subtitle">{requestData?.vehicle?.vehicle_license_plate}</div>
              <div className="supporting-text-group">
                <div className="supporting-text">{requestData?.vehicle?.CarType}</div>
                <div className="supporting-text">{requestData?.vehicle?.vehicle_department?.vehicle_owner_dept_short}</div>
              </div>
            </div>

            <div className="card-item-group grid">
              {/* Mileage before trip */}
              <div className="card-item col-span-2">
                <i className="material-symbols-outlined">swap_driving_apps_wheel</i>
                <div className="card-item-text w-full !flex justify-between">เลขไมล์ก่อนเดินทาง <span className="text-color-secondary">{requestData?.mile_start || 'N/A'} </span> </div>
              </div>
              
              {/* Trip distance */}
              <div className="card-item col-span-2">
                <i className="material-symbols-outlined">road</i>
                <div className="card-item-text w-full !flex justify-between">ระยะทางครั้งนี้ <span className="text-color-secondary">  {requestData?.mile_used} km</span></div>
              </div>
              
              {/* Fuel refill */}
              <div className="card-item col-span-2">
                <i className="material-symbols-outlined">local_gas_station</i>
                <div className="card-item-text w-full !flex justify-between">เติมเชื้อเพลิงง <span className="text-color-secondary"> {requestData?.add_fuels_count} ครั้ง</span></div>
              </div>
              
              {/* Trip log */}
              <div className="card-item col-span-2">
                <i className="material-symbols-outlined">edit_location_alt</i>
                <div className="card-item-text w-full !flex justify-between">บันทึกเดินทาง <span className="text-color-secondary"> {requestData?.trip_details_count} รายการ </span></div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}