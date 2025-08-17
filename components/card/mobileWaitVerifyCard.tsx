import Image from "next/image";
import { useRouter } from "next/navigation";
import { useRef } from "react";
import ReviewCarDriveModal from "../modal/reviewCarDriveModal";

interface MobileWaitForKeyCardProps {
  id?: string;
  title?: string;
  licensePlate: string;
  location: string;
  dateRange: string;
  can_score?: boolean;
}

export default function MobileWaitVerifyCard({
  id,
  title = "รอตรวจสอบ",
  licensePlate,
  location,
  dateRange,
  can_score = true
}: MobileWaitForKeyCardProps) {
  const router = useRouter();

  const reviewCarDriveModalRef = useRef<{
    openModal: () => void;
    closeModal: () => void;
  } | null>(null);

  const goToDetail = () => {
    router.push(`/vehicle-in-use/user/${id}?activeTab=รายละเอียดคำขอ`);
  };

  return (
    <div>
      <div className="card cursor-pointer" onClick={goToDetail}>
        <div className="card-body">
          <div className="card-body-inline">
            <div className="img img-square img-avatar flex-grow-1 align-self-start">
              <Image
                src="/assets/img/graphic/status_vehicle_inspection.png"
                width={100}
                height={100}
                alt="status key pickup"
              />
            </div>
            <div className="card-content">
              <div className="card-content-top">
                <div className="card-title">
                  {title} <i className="material-symbols-outlined icon-settings-400-20">keyboard_arrow_right</i>
                </div>
                <div className="card-subtitle">{licensePlate}</div>
                <div className="supporting-text-group supporting-text-column">
                  <div className="supporting-text text-truncate w-full">{location}</div>
                  <div className="supporting-text text-truncate">{dateRange}</div>
                </div>
              </div>
            </div>
          </div>

          <div className="card-item-group d-flex flex-column">
            <div className="card-item ">
              <i className="material-symbols-outlined">info</i>
              <span className="card-item-text">{"รอผู้ดูแลยานพาหนะตรวจสอบ"}</span>
            </div>
          </div>

          {can_score && 
          <div className="card-actions flex w-full">
            <button
              className="btn btn-secondary flex-1"
              onClick={(e) => {
                e.stopPropagation();
                // router.push(`/vehicle-in-use/user/${id}?activeTab=การนัดหมายเดินทาง`);
                reviewCarDriveModalRef.current?.openModal();
              }}
            >
              ให้คะแนนผู้ขับขี่
            </button>
          </div>
          }
        </div>
      </div>
      <ReviewCarDriveModal ref={reviewCarDriveModalRef} id={id} />
    </div>
  );
}
