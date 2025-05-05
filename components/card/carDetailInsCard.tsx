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
                <div className="supporting-text">{requestData?.vehicle?.vehicle_owner_dept_sap}</div>
              </div>
            </div>

            <div className="card-item-group grid">
              {/* Mileage before trip */}
              <div className="card-item col-span-2">
                <i className="material-symbols-outlined">swap_driving_apps_wheel</i>
                <span className="card-item-text">เลขไมล์ก่อนเดินทาง: {requestData?.mile_start || 'N/A'} กม.</span>
              </div>
              
              {/* Trip distance */}
              <div className="card-item col-span-2">
                <i className="material-symbols-outlined">road</i>
                <span className="card-item-text">ระยะทางครั้งนี้: N/A กม.</span>
              </div>
              
              {/* Fuel refill */}
              <div className="card-item col-span-2">
                <i className="material-symbols-outlined">local_gas_station</i>
                <span className="card-item-text">เติมเชื้อเพลิง: N/A ลิตร</span>
              </div>
              
              {/* Trip log */}
              <div className="card-item col-span-2">
                <i className="material-symbols-outlined">edit_location_alt</i>
                <span className="card-item-text">บันทึกเดินทาง</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}