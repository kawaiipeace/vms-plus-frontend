import React, { useRef } from "react";
import MobileFinishVehicleCard from "../card/mobileFinishVehicleCard";
import FilterModal from "@/app/components/modal/filterModal";
import Image from "next/image";

interface VehicleFinishTabProps {
  data: {
    carRegis: string;
    location: string;
    date: string;
  }[];
}

const VehicleFinishTab = ({ data }: VehicleFinishTabProps) => {
  const filterModalRef = useRef<{
    openModal: () => void;
    closeModal: () => void;
  } | null>(null);
  return (
    <>
      {data.length !== 0 ? (
        <>
          <div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div className="input-group input-group-search hidden">
                  <div className="input-group-prepend">
                    <span className="input-group-text search-ico-info">
                      <i className="material-symbols-outlined">search</i>
                    </span>
                  </div>
                  <input type="text" id="myInputTextField" className="form-control dt-search-input" placeholder="เลขที่คำขอ, ผู้ใช้, ยานพาหนะ, สถานที่" />
                </div>
              </div>
              <div>
                <button className="btn btn-secondary btn-filtersmodal h-[40px] min-h-[40px]" onClick={() => filterModalRef.current?.openModal()}>
                  <div className="flex items-center gap-1">
                    <i className="material-symbols-outlined">filter_list</i>
                    ตัวกรอง
                    <span className="badge badge-brand badge-outline rounded-[50%]">2</span>
                  </div>
                </button>
              </div>
            </div>
            <div className="my-4">
              <div>
                {data.map((item, index) => (
                  <MobileFinishVehicleCard key={index} carRegis={item.carRegis} location={item.location} date={item.date} />
                ))}
              </div>
            </div>
          </div>
          <FilterModal ref={filterModalRef} />
        </>
      ) : (
        <div className="grid grid-cols-1 gap-4 text-center">
          <div className="flex items-center justify-center w-[300px] h-[300px] mx-auto my-5 col-span-12">
            <Image src="/assets/img/graphic/empty.svg" width={900} height={900} alt="" />
          </div>
          <div className="col-span-12">
            <p className="font-bold text-2xl">ไม่มีคำขอใช้ยานพาหนะ</p>
            <p>รายการคำขอใช้พาหนะที่เสร็จสิ้นจะแสดงที่นี่</p>
          </div>
        </div>
      )}
    </>
  );
};

export default VehicleFinishTab;
