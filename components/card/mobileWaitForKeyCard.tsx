import Image from "next/image";
import { useRouter } from "next/navigation";

interface MobileWaitForKeyCardProps {
  id?: string;
  title?: string;
  licensePlate: string;
  location: string;
  dateRange: string;
  pickupLocation: string;
  pickupDate: string;
}

export default function MobileWaitForKeyCard({
  id,
  title = "รอรับกุญแจ",
  licensePlate,
  location,
  dateRange,
  pickupLocation,
  pickupDate,
}: MobileWaitForKeyCardProps) {
  const router = useRouter();

  const goToDetail = () => {
    router.push(`/request/${id}`);
  };

  return (
    <div className="card cursor-pointer" onClick={goToDetail}>
      <div className="card-body">
        <div className="card-body-inline">
          <div className="img img-square img-avatar flex-grow-1 align-self-start">
            <Image
              src="/assets/img/graphic/status_key_pickup.png"
              width={100}
              height={100}
              alt="status key pickup"
            />
          </div>
          <div className="card-content">
            <div className="card-content-top">
              <div className="card-title">
                {title}{" "}
                <i className="material-symbols-outlined icon-settings-400-20">
                  keyboard_arrow_right
                </i>
              </div>
              <div className="card-subtitle">{licensePlate}</div>
              <div className="supporting-text-group supporting-text-column">
                <div className="supporting-text text-truncate">{location}</div>
                <div className="supporting-text text-truncate">{dateRange}</div>
              </div>
            </div>
          </div>
        </div>

        <div className="card-item-group d-flex flex-column">
          <div className="card-item">
            <i className="material-symbols-outlined">location_on</i>
            <span className="card-item-text">{pickupLocation}</span>
          </div>
          <div className="card-item">
            <i className="material-symbols-outlined">calendar_month</i>
            <span className="card-item-text">{pickupDate}</span>
          </div>
        </div>

        <div className="card-actions card-actions-column">
          <button className="btn btn-secondary" onClick={() => router.push(`/request/${id}/travel-log`)}>
            บันทึกเดินทาง
          </button>
          <button className="btn btn-secondary" onClick={() => router.push(`/request/${id}/fuel`)}>
            เติมเชื้อเพลิง
          </button>
          <button className="btn btn-secondary" onClick={() => router.push(`/request/${id}/travel-card`)}>
            บัตรเดินทาง
          </button>
          <button className="btn btn-secondary" onClick={() => router.push(`/request/${id}/return`)}>
            คืนยานพาหนะ{" "}
            <i className="material-symbols-outlined icon-settings-fill-300-24 text-error">
              error
            </i>
          </button>
        </div>
      </div>
    </div>
  );
}
