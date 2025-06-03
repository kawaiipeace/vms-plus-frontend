"use client";
import { RequestDetailType } from "@/app/types/request-detail-type";
import { fetchRequestKeyDetail } from "@/services/masterService";
import { useEffect, useRef, useState } from "react";
import AppointmentDriverUserCard from "../card/appointmentDriverUserCard";
import DriverPassengerPeaInfoCard from "../card/driverPassengerPeaInfoCard";
import DriverUserAppointmentCard from "../card/driverUserAppointmentCard";
import VehicleDetailCard from "../card/vehicleDetailCard";
import CallToDriverModal from "../modal/callToDriverModal";

interface Props {
  requestId: string;
}
const KeyPickUpAppointment = ({ requestId }: Props) => {
  const callToDriverModalRef = useRef<{
    openModal: () => void;
    closeModal: () => void;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [requestData, setRequestData] = useState<RequestDetailType>();

  useEffect(() => {
    const fetchRequestDetailfunc = async () => {
      try {
        // Ensure parsedData is an object before accessing vehicleSelect
        const response = await fetchRequestKeyDetail(requestId);

        setRequestData(response.data);
        const timer = setTimeout(() => {
          setLoading(false);
        }, 1500);
        return () => clearTimeout(timer);
      } catch (error) {
        console.error("Error fetching vehicle details:", error);
        const timer = setTimeout(() => {
          setLoading(false);
        }, 1500);
        return () => clearTimeout(timer);
      }
    };

    if (requestId) {
      setLoading(true);
      fetchRequestDetailfunc();
    }
  }, [requestId]);

  if (loading)
    return (
      <div className="flex justify-center items-center h-[calc(100vh-40vh)]">
        <svg
          aria-hidden="true"
          className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-[#A80689]"
          viewBox="0 0 100 101"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
            fill="currentColor"
          />
          <path
            d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
            fill="currentFill"
          />
        </svg>
      </div>
    );

  return (
    <>
      <div className="grid md:grid-cols-2 gird-cols-1 gap-4">
        <div className="w-full row-start-1 md:col-start-2">
          <div className="form-section">
            <div className="form-section-header">
              <div className="form-section-header-title">
                <p>ข้อมูลนัดหมายเดินทาง</p>
              </div>
            </div>
            <AppointmentDriverUserCard
              pickupPlace={requestData?.work_place}
              pickupDatetime={requestData?.start_datetime}
            />
          </div>

          <div className="form-section">
            <div className="form-section-header">
              <div className="form-section-header-title">ข้อมูลยานพาหนะ</div>
            </div>

            <VehicleDetailCard requestData={requestData} />
          </div>
        </div>

        <div className="col-span-1 row-start-2 md:row-start-1">
          <div className="form-section">
            <div className="form-section-header">
              <div className="form-section-header-title">พนักงานขับรถ</div>
            </div>
            <DriverUserAppointmentCard id={requestData?.driver?.mas_driver_uid || ""} requestData={requestData} />
          </div>
          <div className="form-section">
            <div className="form-section-header">
              <div className="form-section-header-title">ผู้ดูแลยานพาหนะ</div>
            </div>
            <DriverPassengerPeaInfoCard id={requestData?.vehicle_user_emp_id || ""} requestData={requestData} />
          </div>
        </div>
      </div>
      <CallToDriverModal
        imgSrc={requestData?.driver?.driver_image || "/assets/img/avatar.svg"}
        name={requestData?.driver?.driver_name || ""}
        phone={requestData?.driver?.driver_contact_number || ""}
        ref={callToDriverModalRef}
      />
    </>
  );
};

export default KeyPickUpAppointment;
