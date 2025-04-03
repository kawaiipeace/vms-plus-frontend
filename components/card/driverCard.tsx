"use client";
import React, { useRef } from "react";
import Image from "next/image";
import DriverAppointmentModal from "@/components/modal/driverAppointmentModal";

export default function DriverCard({
  id,
  imgSrc,
  name,
  rating,
  age,
  company,
  onVehicleSelect,
}: {
  id: string;
  imgSrc: string;
  name: string;
  rating: number;
  age: string;
  company: string;
  onVehicleSelect: (id: string) => void;
}) {
  const driverAppointmentRef = useRef<{
    openModal: () => void;
    closeModal: () => void;
  } | null>(null);
  

  const handleAppointmentSubmit = () => {
    onVehicleSelect(id);
  };

  return (
    <div className="card">
      <div className="card-body">
        <div className="card-img-top img-sm">
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
            <div className="card-title">{name}</div>
            <div className="card-supporting-text-group">
              <div className="card-supporting-text">{ company }</div>
            </div>
          </div>

          <div className="card-item-group">
            <div className="card-item">
              <i className="material-symbols-outlined">star</i>
              <span className="card-item-text">{rating}</span>
            </div>
            <div className="card-item">
              <i className="material-symbols-outlined">
                person
              </i>
              <span className="card-item-text">{age}</span>
            </div>
          </div>
        </div>
        <div className="w-full">
          <button
            className="btn btn-primary w-full"
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
    </div>
  );
}