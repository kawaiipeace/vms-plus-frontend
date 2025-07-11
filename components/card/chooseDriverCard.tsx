import Image from "next/image";
import AdminDriverPickModal from "../modal/adminDriverPickModal";
import { useEffect, useRef, useState } from "react";
import DriverInfoModal from "../modal/driverInfoModal";
import { RequestDetailType } from "@/app/types/request-detail-type";

interface Props {
  chooseDriver?: boolean;
  number?: number;
  requestData?: RequestDetailType;
  reqId?: string;
  onChooseDriver?: () => void;
}

export default function ChooseDriverCard({ chooseDriver, number, reqId, requestData , onChooseDriver }: Props) {
  const adminDriverPickModalRef = useRef<{
    openModal: () => void;
    closeModal: () => void;
  } | null>(null);

  const driverInfoModalRef = useRef<{
    openModal: () => void;
    closeModal: () => void;
  } | null>(null);

  const [driverId, setDriverId] = useState<string>("");



  const seeDriverDetail = (id: string) => {
    setDriverId(id);
    // adminDriverPickModalRef.current?.closeModal();
    driverInfoModalRef.current?.openModal();
  };



  useEffect(() => {

  }, [requestData]);

    if (!requestData) return null; 


  return (
    <div className="card card-section-inline mt-5">
      <div className="card-body card-body-inline">
        <div className="img img-square img-avatar flex-grow-1 align-self-start">
          <Image
            src="/assets/img/graphic/admin_select_driver_small.png"
            className="rounded-md"
            width={100}
            height={100}
            alt=""
          />
        </div>
        <div className="card-content">
          <div className="card-content-top">
            <div className="card-title">ผู้ดูแลเลือกพนักงานขับรถให้</div>
            <div className="supporting-text-group">
                 <div className="supporting-text">{requestData?.carpool_name}</div>
            </div>
          </div>

          <div className="card-item-group d-flex">
            <div className="card-item">
              <i className="material-symbols-outlined">group</i>
              <span className="card-item-text">ว่าง {number} คน</span>
            </div>
          </div>
        </div>
      </div>
      <div className="px-4 pb-4">
        {chooseDriver && (
          <div className="card-actions">
            <button
              className="btn btn-primary w-full"
              onClick={() => adminDriverPickModalRef.current?.openModal()}
            >
              เลือกพนักงานขับรถ
            </button>
          </div>
        )}
      </div>

      <AdminDriverPickModal
        ref={adminDriverPickModalRef}
        requestData={requestData}
        reqId={reqId}
        onClickDetail={seeDriverDetail}
        onUpdate={onChooseDriver}
      />

      <DriverInfoModal
        ref={driverInfoModalRef}
        id={driverId}
        pickable={true}
        onBack={() => adminDriverPickModalRef.current?.openModal()}
      />
    </div>
  );
}
