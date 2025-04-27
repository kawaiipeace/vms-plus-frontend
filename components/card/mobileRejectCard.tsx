import Image from "next/image";
import { useRouter } from "next/navigation";

interface MobileWaitForKeyCardProps {
  id?: string;
  title?: string;
  licensePlate: string;
  location: string;
  dateRange: string;
}

export default function MobileRejectCard({
  id,
  title = "คืนยานพาหนะไม่สำเร็จ",
  licensePlate,
  location,
  dateRange,
}: MobileWaitForKeyCardProps) {
  const router = useRouter();

  const goToDetail = () => {
    router.push(`/vehicle-in-use/user/${id}?activeTab=รายละเอียดคำขอ`);
  };

  return (
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
            <span className="card-item-text">{"ถูกตีกลับจากผู้ดูแลยานพาหนะ"}</span>
          </div>
        </div>

        <div className="card-actions flex w-full">
          <button
            className="btn btn-secondary flex-1"
            onClick={(e) => {
              e.stopPropagation();
              router.push(`/vehicle-in-use/user/${id}?activeTab=การนัดหมายเดินทาง`);
            }}
          >
            แก้ไข
          </button>
          <button
            className="btn btn-secondary flex-1"
            onClick={(e) => {
              e.stopPropagation();
              router.push(`/vehicle-in-use/user/${id}?activeTab=การนัดหมายเดินทาง`);
            }}
          >
            ดูคะแนนผู้ขับขี่
          </button>
        </div>
      </div>
    </div>
  );
}
