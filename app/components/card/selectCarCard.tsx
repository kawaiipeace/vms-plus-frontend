"use client";
import Image from "next/image";
import { useRef } from "react";
import VehicleDetailModel from "./vehicleDetailModal";

export default function SelectCarCard({
  imgSrc,
  title,
  subTitle,
  onSelect, // Add onSelect prop
}: {
  imgSrc: string;
  title: string;
  subTitle: string;
  onSelect: (vehicleTitle: string) => void; // Define the type of onSelect
}) {
  const vehicleDetailModalRef = useRef<{
    openModal: () => void;
    closeModal: () => void;
  } | null>(null);

  

  return (
    <div className="card">
      <div className="card-body">
        <div className="card-img-top h-[15vh]">
          <Image
            src={imgSrc}
            width={100}
            height={100}
            className=""
            alt="..."
          ></Image>
        </div>
        <div className="card-content">
          <div className="card-content-top">
            <div className="card-title">{title}</div>
            <div className="card-subtitle">{subTitle}</div>
            <div className="card-supporting-text-group">
              <div className="card-supporting-text">รถแวนตรวจการ</div>
              <div className="card-supporting-text">สายงานดิจิทัล</div>
            </div>
          </div>

          <div className="card-item-group">
            <div className="card-item">
              <i className="material-symbols-outlined">credit_card</i>
              <span className="card-item-text">บัตรเติมน้ำมัน</span>
            </div>
            <div className="card-item">
              <i className="material-symbols-outlined">
                airline_seat_recline_extra
              </i>
              <span className="card-item-text">6 ที่นั่ง</span>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-6 gap-3">
          <button
            className="btn btn-secondary col-span-4"
            onClick={() => vehicleDetailModalRef.current?.openModal()}
          >
            ดูรายละเอียด
          </button>
          <button
            className="btn btn-primary col-span-2"
            onClick={() => onSelect(title)}
          >
            เลือก
          </button>
        </div>
      </div>
      <VehicleDetailModel ref={vehicleDetailModalRef} onSelect={() => onSelect(title)} />
    </div>
  );
}
