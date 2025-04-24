"use client";
import React, { useEffect, useRef } from "react";
import Image from "next/image";
import DriverAppointmentModal from "@/components/modal/driverAppointmentModal";
import DriverInfoModal from "../modal/driverInfoModal";
import { adminUpdateDriver } from "@/services/bookingAdmin";
import { UpdateDriverType } from "@/app/types/form-data-type";

export default function PickDriverCard({
  id,
  reqId,
  imgSrc,
  name,
  rating,
  age,
  company,
  nickName,
  seeDetail,
  driverStatus,
  workTypeName,
  workDays,
  workCount,
  onVehicleSelect,
  onClickSeeDetail,
  isSelected // <- new prop
}: {
  id: string;
  reqId: string;
  imgSrc: string;
  name: string;
  rating: number;
  age: string;
  company: string;
  nickName?: string;
  driverStatus?: string;
  workTypeName?: string;
  workDays?: number;
  workCount?: number;
  seeDetail?: boolean;
  isSelected?: boolean;
  onVehicleSelect: (id: string) => void;
  onClickSeeDetail: (id: string) => void;
}) {

  const driverInfoModalRef = useRef<{
    openModal: () => void;
    closeModal: () => void;
  } | null>(null);

  useEffect(() => {

  },[isSelected])


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
         <i className="material-symbols-outlined">check</i>
          เลือกอยู่</span> 
        </div>
      )}

      <div className="card-body">
        <div className="card-img-top img-sm">
          <Image
            src={imgSrc}
            width={100}
            height={100}
            className=""
            alt="..."
          />
        </div>
        <div className="card-content">
          <div className="card-content-top">
            <div className="card-title">
              {name} {nickName && `(${nickName})`}
            </div>
            <div className="card-supporting-text-group">
              <div className="card-supporting-text">{driverStatus}</div>
              <div className="card-supporting-text">{workTypeName}</div>
            </div>
          </div>

          <div className="card-item-group grid !grid-cols-2">
            <div className="card-item">
              <i className="material-symbols-outlined">work</i>
              <span className="card-item-text">
                {workCount} งาน / {workDays} วัน
              </span>
            </div>
            <div className="card-item justify-end">
              <span className="card-item-text">งานเดือนนี้</span>
            </div>
          </div>
        </div>
        <div className="flex w-full gap-3">
          {seeDetail && (
            <button
              className="btn btn-secondary flex-1"
              onClick={() => {
                onClickSeeDetail?.(id);
              }}
            >
              ดูรายละเอียด
            </button>
          )}
          <button
            className={`btn btn-primary flex-1 ${isSelected ? 'hidden': 'block'}`}
            onClick={() => {
              onVehicleSelect(id)
            }}
          >
            เลือก
          </button>
        </div>
      </div>
      <DriverInfoModal ref={driverInfoModalRef} id={id} pickable={true} />
    </div>
  );
}
