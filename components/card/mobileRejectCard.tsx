import { RequestDetailType } from "@/app/types/request-detail-type";
import { fetchRequestKeyDetail } from "@/services/masterService";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import ReviewCarDriveModal from "../modal/reviewCarDriveModal";

interface MobileWaitForKeyCardProps {
  id?: string;
  title?: string;
  licensePlate: string;
  location: string;
  dateRange: string;
  rating?: number;
}

export default function MobileRejectCard({
  id,
  title = "คืนยานพาหนะไม่สำเร็จ",
  licensePlate,
  location,
  dateRange,
  rating,
}: MobileWaitForKeyCardProps) {
  const router = useRouter();
  const [requestData, setRequestData] = useState<RequestDetailType>();

  const reviewCarViewDriveModalRef = useRef<{
    openModal: () => void;
    closeModal: () => void;
  } | null>(null);

  const reviewCarDriveModalRef = useRef<{
    openModal: () => void;
    closeModal: () => void;
  } | null>(null);

  const fetchRequestDetailfunc = useCallback(async () => {
    try {
      // Ensure parsedData is an object before accessing vehicleSelect
      const response = await fetchRequestKeyDetail(id || "");
      setRequestData(response.data);
    } catch (error) {
      console.error("Error fetching vehicle details:", error);
    }
  }, [id]);

  useEffect(() => {
    fetchRequestDetailfunc();
  }, [fetchRequestDetailfunc]);

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
                src={
                  title === "คืนยานพาหนะไม่สำเร็จ"
                    ? "/assets/img/graphic/status_vehicle_reject.png"
                    : "/assets/img/graphic/status_vehicle_inspection.png"
                }
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
            {rating || (requestData?.satisfaction_survey_answers?.length || 0) > 0 ? (
              <button
                className="btn btn-secondary flex-1"
                onClick={(e) => {
                  e.stopPropagation();
                  reviewCarViewDriveModalRef.current?.openModal();
                }}
              >
                ดูคะแนนผู้ขับขี่
              </button>
            ) : (
              <button
                className="btn btn-secondary flex-1"
                onClick={(e) => {
                  e.stopPropagation();
                  reviewCarDriveModalRef.current?.openModal();
                }}
              >
                ให้คะแนนผู้ขับขี่
              </button>
            )}
          </div>
        </div>
      </div>
      <ReviewCarDriveModal ref={reviewCarViewDriveModalRef} id={id} displayOn={"view"} />
      <ReviewCarDriveModal ref={reviewCarDriveModalRef} id={id} />
    </div>
  );
}
