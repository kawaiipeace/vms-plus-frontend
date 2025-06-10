import Image from "next/image";
import AdminVehiclePickModal from "../modal/adminVehiclePickModal";
import { useRef } from "react";
import { RequestVehicleType } from "@/app/types/request-detail-type";

interface Props {
  chooseVehicle?: boolean;
  chooseType?: boolean;
  typeName?: string;
  reqId?: string;
  vehicleType?: RequestVehicleType;
  carpoolName?: string;
}

export default function ChooseVehicleCard({
  reqId,
  chooseType,
  carpoolName,
  chooseVehicle,
  typeName,
  vehicleType
}: Props) {
  const adminVehiclePickModalRef = useRef<{
    openModal: () => void;
    closeModal: () => void;
  } | null>(null);

  return (
    <div className="card card-section-inline mt-5">
      <div className="card-body card-body-inline">
        <div className="img img-square img-avatar flex-grow-1 align-self-start">
          <Image
            src="/assets/img/graphic/admin_select_small.png"
            className="rounded-md"
            width={100}
            height={100}
            alt=""
          />
        </div>
        <div className="card-content">
          <div className="card-content-top card-content-top-inline">
            <div className="card-content-top-left">
              <div className="card-title">ผู้ดูแลเลือกยานพาหนะให้</div>
              <div className="supporting-text-group">
                <div className="supporting-text">{carpoolName}</div>
              </div>
            </div>
          </div>

          <div className="card-item-group d-flex">
            <div className="card-item col-span-2">
              <i className="material-symbols-outlined">directions_car</i>
              <span className="card-item-text">{typeName}</span>
            </div>
          </div>
        </div>
      </div>
      <div className="px-4 pb-4">
        {chooseVehicle && (
          <div className="card-actions">
            <button
              className="btn btn-primary w-full"
              onClick={() => adminVehiclePickModalRef.current?.openModal()}
            >
              เลือกยานพาหนะ
            </button>
          </div>
        )}
      </div>
      <AdminVehiclePickModal reqId={reqId} vehicleType={vehicleType} typeName={typeName} ref={adminVehiclePickModalRef} />
    </div>
  );
}
