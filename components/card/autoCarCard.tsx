import { useRef } from "react";
import Image from "next/image";
import VehiclePickModel from "@/components/modal/vehiclePickModal";

export default function AutoCarCard({
  imgSrc,
  title,
  desc,
  onSelect,
}: {
  imgSrc: string;
  title: string;
  desc: string;
  onSelect: (vehicleTitle: string) => void; // Define the type of onSelect
}) {
  const vehiclePickModalRef = useRef<{
    openModal: () => void;
    closeModal: () => void;
  } | null>(null);


  return (
    <div className="card">
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
      <VehiclePickModel process="add" ref={vehiclePickModalRef} onSelect={() => onSelect(title)} />
    </div>
  );
}
