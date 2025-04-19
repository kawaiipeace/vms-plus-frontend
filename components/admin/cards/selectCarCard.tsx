"use client";
import Image from "next/image";
import { useEffect } from "react";

export default function SelectCarCard({
  imgSrc,
  title,
  subTitle,
  carType,
  deptSap,
  seat,
  vehicleId,
  onSelect,
  onClickSeeDetail,
  isSelected, 
}: {
  imgSrc: string;
  title: string;
  subTitle: string;
  carType?: string;
  deptSap?: string;
  seat?: number;
  vehicleId: string;
  onSelect: (vehicleTitle: string) => void;
  onClickSeeDetail?: (id: string) => void;
  isSelected?: boolean; 
}) {
  useEffect(() => {
    // Effect can be used if needed when `isSelected` changes
  }, [isSelected]);

  return (
    <div
      className={`relative card transition-all duration-200 ${
        isSelected ? "!border-2 !border-brand-900" : "border border-gray-200"
      }`}
    >
      {/* Badge */}
      {isSelected && (
        <div className="absolute top-2 right-2">
          <span className="badge badge-pill-outline badge-active bg-brand-100 whitespace-nowrap !rounded-md text-brand-800">
            <i className="material-symbols-outlined">check</i> เลือกอยู่
          </span>
        </div>
      )}

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
              <div className="card-supporting-text">{carType}</div>
              <div className="card-supporting-text">{deptSap}</div>
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
              <span className="card-item-text">{seat} ที่นั่ง</span>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-4 gap-3">
          <button
            className="btn btn-secondary col-span-2"
            onClick={() => {
              onClickSeeDetail?.(vehicleId);
            }}
          >
            ดูรายละเอียด
          </button>
          <button
            className="btn btn-primary col-span-2"
            onClick={() => onSelect(vehicleId)}
          >
            เลือก
          </button>
        </div>
      </div>
    </div>
  );
}