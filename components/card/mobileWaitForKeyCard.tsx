import Image from "next/image";
import { useRouter } from "next/navigation";
import { useMemo } from "react";

interface MobileWaitForKeyCardProps {
  id?: string;
  title?: string;
  licensePlate: string;
  location: string;
  dateRange: string;
  pickupLocation: string;
  pickupDate: string; // expected in format 'YYYY-MM-DD' or similar
  pickupTime: string;
  is_pea_employee_driver?: string;
}

export default function MobileWaitForKeyCard({
  id,
  title = "รอรับกุญแจ",
  licensePlate,
  location,
  dateRange,
  pickupLocation,
  pickupDate,
  pickupTime,
  is_pea_employee_driver,
}: MobileWaitForKeyCardProps) {
  const router = useRouter();

  const goToDetail = () => {
    router.push(`/vehicle-in-use/user/${id}?activeTab=รายละเอียดคำขอ`);
  };

  // Compare today's date with pickupDate
  const isPickupDatePassed = useMemo(() => {
    const today = new Date();
    const pickup = new Date(pickupDate);
    // zero out time for accurate day comparison
    today.setHours(0, 0, 0, 0);
    pickup.setHours(0, 0, 0, 0);
    return today > pickup;
  }, [pickupDate]);
  const pea = is_pea_employee_driver !== "1";
  return (
    <div className="card cursor-pointer" onClick={goToDetail}>
      <div className="card-body">
        <div className="card-body-inline">
          <div className="img img-square img-avatar flex-grow-1 align-self-start">
            <Image src="/assets/img/graphic/status_key_pickup.png" width={100} height={100} alt="status key pickup" />
          </div>
          <div className="card-content">
            <div className="card-content-top">
              <div className="card-title">
                {title} <i className="material-symbols-outlined icon-settings-400-20">keyboard_arrow_right</i>
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
          <div className="card-item"></div>
          <div className="card-item">
            <i className="material-symbols-outlined">calendar_month</i>
            <span className="card-item-text">{pickupDate}</span>
          </div>
          <div className="card-item">
            <i className="material-symbols-outlined">schedule</i>
            <span className="card-item-text">{pickupTime}</span>
          </div>
        </div>

        <div className="card-actions flex w-full">
          {!pea && !isPickupDatePassed && (
            <button
              className="btn btn-secondary flex-1"
              onClick={(e) => {
                e.stopPropagation();
                router.push(`/vehicle-in-use/user/${id}?activeTab=การนัดหมายเดินทาง`);
              }}
            >
              ดูนัดหมาย
            </button>
          )}
          <button
            className="btn btn-secondary flex-1"
            onClick={(e) => {
              e.stopPropagation();
              router.push(`/vehicle-in-use/user/${id}?activeTab=การรับกุญแจ`);
            }}
          >
            การรับกุญแจ
            {isPickupDatePassed && (
              <i className="material-symbols-outlined icon-settings-fill-300-24 text-error">error</i>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
