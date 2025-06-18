import { useRef } from "react";
import Image from "next/image";
import VehiclePickModel from "@/components/modal/vehiclePickModal";

export default function AutoCarCard({
  imgSrc,
  title,
  desc,
  onSelect,
  masCarpoolUid,
  isSelected = false, // Add this prop
}: {
  imgSrc: string;
  title: string;
  desc: string;
  masCarpoolUid?: string;
  onSelect: (vehicleTitle: string) => void; // Define the type of onSelect
  isSelected?: boolean; // Add this prop type
}) {
  const vehiclePickModalRef = useRef<{
    openModal: () => void;
    closeModal: () => void;
  } | null>(null);


  return (
    <div className={`card relative ${isSelected ? "!border-2 !border-brand-900" : ""}`}>
       {isSelected && (
        <div className="absolute top-2 right-2">
        <span className="badge badge-pill-outline badge-active bg-brand-100 whitespace-nowrap !rounded-md text-brand-800">
        <i className="material-symbols-outlined">check</i>
         เลือกอยู่</span> 
       </div>
      )}
      <div className="card-body">
        <div className="card-img-top h-[27vh]">
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
            <div className="card-supporting-text-group">
              <div className="card-supporting-text">{desc}</div>
            </div>
          </div>
        </div>
        <div className="card-actions">
          <button
            className="btn btn-primary"
            onClick={() => vehiclePickModalRef.current?.openModal()}
          >
            เลือกประเภท
          </button>
        </div>
      </div>
      <VehiclePickModel process="add" selectType={title} masCarpoolUid={masCarpoolUid} desc={desc} ref={vehiclePickModalRef} onSelect={() => onSelect(title)} />
    </div>
  );
}
