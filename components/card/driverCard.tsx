"use client";
import React, { useRef } from "react";
import Image from "next/image";
import DriverAppointmentModal from "@/components/modal/driverAppointmentModal";
import DriverInfoModal from "../modal/driverInfoModal";

export default function DriverCard({
  id,
  imgSrc,
  name,
  rating,
  age,
  company,
  seeDetail,
  onVehicleSelect,
  nickname,
  adminDriverPickModalRef,
  isSelected, // added
}: {
  id: string;
  imgSrc: string;
  name: string;
  rating: number;
  age: string;
  company: string;
  seeDetail?: boolean;
  onVehicleSelect: (id: string) => void;
  nickname: string;
  adminDriverPickModalRef?: React.RefObject<{
    openModal: () => void;
    closeModal: () => void;
  }>;
  isSelected?: boolean; // added
}) {
  const driverAppointmentRef = useRef<{
    openModal: () => void;
    closeModal: () => void;
  } | null>(null);

  const driverInfoModalRef = useRef<{
    openModal: () => void;
    closeModal: () => void;
  } | null>(null);

  const handleAppointmentSubmit = () => {
    onVehicleSelect(id);
  };

  return (
    <div
      className={`card relative ${
        isSelected ? "!border-2 !border-brand-900" : "border border-gray-200"
      }`}
    >
      {/* Badge */}
      {isSelected && (
        <div className="absolute top-2 right-2">
          <span className="badge badge-pill-outline badge-active bg-brand-100 whitespace-nowrap !rounded-md text-brand-800">
            <i className="material-symbols-outlined">check</i>
            เลือกอยู่
          </span>
        </div>
      )}
      <div className="card-body">
        <div className="card-img-top img-sm max-h-[180px] h-full w-full">
          <Image src={imgSrc} width={400} height={180} alt="..." />
        </div>
        <div className="card-content">
          <div className="card-content-top">
            <div className="card-title">{name} {nickname ? "("+nickname+")" : ""}</div>
            <div className="card-supporting-text-group">
              <div className="card-supporting-text">{company}</div>
            </div>
          </div>

          <div className="card-item-group grid !grid-cols-2">
            <div className="card-item">
              <i className="material-symbols-outlined">star</i>
              <span className="card-item-text">{rating}</span>
            </div>
            <div className="card-item">
              <i className="material-symbols-outlined">person</i>
              <span className="card-item-text">{age}</span>
            </div>
          </div>
        </div>

        <div className="flex w-full gap-3">
          {seeDetail && (
            <button
              className="btn btn-secondary w-50"
              onClick={() => {
                if (adminDriverPickModalRef) {
                  adminDriverPickModalRef.current?.closeModal();
                }

                driverInfoModalRef.current?.openModal();
              }}
            >
              ดูรายละเอียด
            </button>
          )}
          <button
            className={`btn btn-primary ${
              seeDetail === true ? "w-[50%]" : "w-full"
            }`}
            onClick={() => driverAppointmentRef.current?.openModal()}
          >
            เลือก
          </button>
        </div>
      </div>

      <DriverAppointmentModal
        ref={driverAppointmentRef}
        id={id}
        onSubmit={handleAppointmentSubmit}
      />
      <DriverInfoModal ref={driverInfoModalRef} id={id} pickable={true} />
    </div>
  );
}
