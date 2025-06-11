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
  lastMonthMile,
  monthMile,
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
  lastMonthMile?: number;
  monthMile?: number;
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
        <div className="card-img-top h-[165px]">
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
            </div>
          </div>

          <div className="card-item-group !flex justify-around">
            <div className="card-item">
              <i className="material-symbols-outlined">road</i>
              <span className="card-item-text">{lastMonthMile}</span>
            </div>
            <div className="card-item">
              <i className="material-symbols-outlined">
                swap_driving_apps_wheel
              </i>
              <span className="card-item-text">{monthMile}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            className="btn btn-secondary flex-1"
            onClick={() => {
              onClickSeeDetail?.(vehicleId);
            }}
          >
            ดูรายละเอียด
          </button>
          <button
            className={`btn btn-primary flex-1 ${isSelected ? 'hidden': 'block'}`}
            onClick={() => onSelect(vehicleId)}
          >
            เลือก
          </button>
        </div>
      </div>
    </div>
  );
}