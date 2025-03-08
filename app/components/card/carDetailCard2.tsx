import { useRef } from "react";
import Image from "next/image";
import VehicleDetailModel from "@/app/components/modal/vehicleDetailModal";
export default function CarDetailCard2() {
  const vehicleDetailModalRef = useRef<{
    openModal: () => void;
    closeModal: () => void;
  } | null>(null);

  return (
    <div className="card card-section-inline gap-4 flex-col">
      <div className="card-body">
        <div className="card-body-inline">
          <div className="img img-square w-full md:h-[239px] md:aspect-auto !aspect-square h-auto rounded-md overflow-hidden self-start">
            <Image src="/assets/img/sample-car.jpeg" width={100} height={100} className="object-cover w-full h-full" alt="" />
          </div>
          <div className="card-content">
            <div className="card-content-top">
              <div className="card-title">Toyota Yaris</div>
              <div className="card-subtitle">ก78ยบ กรุงเทพ</div>
              <div className="supporting-text-group">
                <div className="supporting-text">รถแวนตรวจการ</div>
                <div className="supporting-text">สายงานดิจิทัล</div>
              </div>
              <div className="md:hidden flex">
                <button className="btn bg-transparent text-[#A80689] outline-none border-none shadow-none p-0 ml-auto" onClick={() => vehicleDetailModalRef.current?.openModal()}>
                  ดูรายละเอียด &#62;
                </button>
              </div>
            </div>

            <div className="card-item-group md:!grid !hidden">
              <div className="card-item col-span-2">
                <i className="material-symbols-outlined">credit_card</i>
                <span className="card-item-text">บัตรเติมน้ำมัน</span>
              </div>
              <div className="card-item col-span-2">
                <i className="material-symbols-outlined">local_gas_station</i>
                <span className="card-item-text">แก๊สโซฮอล์ พรีเมียม 97</span>
              </div>
              <div className="card-item col-span-2">
                <i className="material-symbols-outlined">airport_shuttle</i>
                <span className="card-item-text">กจพ.2-ช(รช)-003/2564</span>
              </div>
              <div className="card-item col-span-2">
                <i className="material-symbols-outlined">local_parking</i>
                <span className="card-item-text">ล็อคที่ 5A ชั้น 2B อาคาร LED</span>
              </div>
            </div>
          </div>
        </div>
        <div className="card-actioins w-full md:block hidden">
          <button className="btn btn-default w-full" onClick={() => vehicleDetailModalRef.current?.openModal()}>
            ดูรายละเอียด
          </button>
        </div>
      </div>
      <VehicleDetailModel ref={vehicleDetailModalRef} status="detail" />
    </div>
  );
}
