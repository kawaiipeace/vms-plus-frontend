import Image from "next/image";
import { useRouter } from "next/navigation";
import { useMemo } from "react";

interface MobileWaitForKeyCardProps {
  id?: string;
  title?: string;
  licensePlate: string;
  location: string;
  dateRange: string;
  startDate: string;
  endDate: string;
  pickupLocation: string;
  pickupDate: string; // expected in format 'YYYY-MM-DD' or similar
  pickupTime: string;
  parkingLocation?: string;
}

export default function MobileTravelLogCard({
  id,
  title = "บันทึกการเดินทาง",
  licensePlate,
  location,
  dateRange,
  startDate,
  endDate,
  pickupLocation,
  pickupDate,
  pickupTime,
  parkingLocation = "ล็อคที่ 5A ชั้น 2B อาคาร LED",
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

  const isDriverPEA = false;
  const shouldShowRatingButton = useMemo(() => {
    const today = new Date();
    const nowHour = today.getHours();
    const stDate = new Date(startDate);
    const enDate = new Date(endDate);

    const dayIsHaftMorning =
      stDate.getDate() === enDate.getDate() &&
      stDate.getMonth() === enDate.getMonth() &&
      stDate.getFullYear() === enDate.getFullYear() &&
      enDate.getHours() < 12;

    const dayIsHalfAfternoon =
      stDate.getDate() === enDate.getDate() &&
      stDate.getMonth() === enDate.getMonth() &&
      stDate.getFullYear() === enDate.getFullYear() &&
      stDate.getHours() > 12 &&
      enDate.getHours() < 16;

    const dayIsFull =
      stDate.getDate() === enDate.getDate() &&
      stDate.getMonth() === enDate.getMonth() &&
      stDate.getFullYear() === enDate.getFullYear() &&
      stDate.getHours() < 12 &&
      enDate.getHours() >= 12;

    const isAfterTravel =
      today.getDate() > enDate.getDate() || (today.getDate() === enDate.getDate() && today.getHours() >= 12);

    if (!isDriverPEA) {
      return (
        (dayIsHaftMorning && nowHour >= 12) || (dayIsHalfAfternoon && nowHour >= 16) || (dayIsFull && isAfterTravel)
      );
    }

    return false;
  }, [endDate, isDriverPEA, startDate]);

  return (
    <div className="card cursor-pointer" onClick={goToDetail}>
      <div className="card-body">
        <div className="card-body-inline">
          <div className="img img-square img-avatar flex-grow-1 align-self-start">
            <Image
              src="/assets/img/graphic/status_vehicle_inuse.png"
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

        {isPickupDatePassed && (
          <div className="card-item-group d-flex flex-column">
            <div className="card-item ">
              <i className="material-symbols-outlined">info</i>
              <span className="card-item-text">{"กรุณาคืนยานพาหนะ"}</span>
            </div>
          </div>
        )}

        <div className="card-actions flex w-full">
          <button
            className="btn btn-secondary flex-1"
            onClick={(e) => {
              e.stopPropagation();
              router.push(`/vehicle-in-use/user/${id}?activeTab=การนัดหมายเดินทาง`);
            }}
          >
            บันทึกเดินทาง
          </button>
          <button
            className="btn btn-secondary flex-1"
            onClick={(e) => {
              e.stopPropagation();
              router.push(`/vehicle-in-use/user/${id}?activeTab=บันทึกการเดินทาง`);
            }}
          >
            เติมเชื้อเพลิง
            {isPickupDatePassed && (
              <i className="material-symbols-outlined icon-settings-fill-300-24 text-error">error</i>
            )}
          </button>
          {isDriverPEA ? (
            <button
              className="btn btn-secondary flex-1"
              onClick={(e) => {
                e.stopPropagation();
                router.push(`/vehicle-in-use/user/${id}?activeTab=บัตรเดินทาง`);
              }}
            >
              บัตรเดินทาง
            </button>
          ) : !shouldShowRatingButton && !isPickupDatePassed ? (
            <button
              className="btn btn-secondary flex-1"
              onClick={(e) => {
                e.stopPropagation();
                router.push(`/vehicle-in-use/user/${id}?activeTab=การนัดหมายเดินทาง`);
              }}
            >
              ดูนัดหมาย
            </button>
          ) : (
            <button
              className="btn btn-secondary flex-1"
              onClick={(e) => {
                e.stopPropagation();
                router.push(`/vehicle-in-use/user/${id}?activeTab=การนัดหมายเดินทาง`);
              }}
            >
              ให้คะแนนผู้ขับขี่
            </button>
          )}
          <button
            className="btn btn-secondary flex-1"
            onClick={(e) => {
              e.stopPropagation();
              router.push(`/vehicle-in-use/user/${id}?activeTab=บันทึกการเดินทาง`);
            }}
          >
            คืนยานพาหนะ
            {isPickupDatePassed && (
              <i className="material-symbols-outlined icon-settings-fill-300-24 text-error">error</i>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
