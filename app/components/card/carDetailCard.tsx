import { useRef } from "react";
import Image from "next/image";
import VehicleDetailModel from "@/app/components/modal/vehicleDetailModal";
export default function CarDetailCard() {
      const vehicleDetailModalRef = useRef<{
        openModal: () => void;
        closeModal: () => void;
      } | null>(null);
    
      
  return (
    <div className="card card-section-inline gap-4 flex-col">
      <div className="card-body">
        <div className="card-body-inline">
        <div className="img img-square w-full h-[239px] rounded-md overflow-hidden">
          <Image
            src="/assets/img/sample-car.jpeg"
            width={100}
            height={100}    
            className="object-cover w-full h-full"
            alt=""
          />
        </div>
        <div className="card-content">
          <div className="card-content-top">
            <div className="card-title">Toyota Yaris</div>
            <div className="card-subtitle">ก78ยบ กรุงเทพ</div>
            <div className="supporting-text-group">
              <div className="supporting-text">รถแวนตรวจการ</div>
              <div className="supporting-text">สายงานดิจิทัล</div>
            </div>
          </div>

          <div className="card-item-group grid">
            <div className="card-item col-span-2">
              <i className="material-symbols-outlined">credit_card</i>
              <span className="card-item-text">บัตรเติมน้ำมัน</span>
            </div>
            <div className="card-item col-span-2">
              <i className="material-symbols-outlined">local_gas_station</i>
              <span className="card-item-text">แก๊สโซฮอล์ พรีเมียม 97</span>
            </div>
            <div className="card-item col-span-2">
              <i className="material-symbols-outlined">auto_transmission</i>
              <span className="card-item-text">เกียร์อัตโนมัติ</span>
            </div>
            <div className="card-item col-span-2">
              <i className="material-symbols-outlined">
                airline_seat_recline_extra
              </i>
              <span className="card-item-text">6 ที่นั่ง</span>
            </div>
          </div>
        </div>
        </div>
        <div className="card-actioins w-full">
        <button className="btn btn-default w-full" onClick={() => vehicleDetailModalRef.current?.openModal()}>ดูรายละเอียด</button>
        </div>
      </div>
      <VehicleDetailModel ref={vehicleDetailModalRef} vehicleId="" status="detail"/>
    </div>
  );
}
