import { RequestDetailType } from "@/app/types/request-detail-type";
import CarDetailCard2 from "@/components/card/carDetailCard2";
import { fetchRequestKeyDetail } from "@/services/masterService";
import { useEffect, useRef, useState } from "react";
import AppointmentDriverUserCard from "../card/appointmentDriverUserCard";
import DriverPassengerPeaInfoCard from "../card/driverPassengerPeaInfoCard";
import DriverUserAppointmentCard from "../card/driverUserAppointmentCard";
import CallToDriverModal from "../modal/callToDriverModal";

interface Props {
  requestId: string;
}
const KeyPickUpAppointment = ({ requestId }: Props) => {
  const callToDriverModalRef = useRef<{
    openModal: () => void;
    closeModal: () => void;
  } | null>(null);
  const [requestData, setRequestData] = useState<RequestDetailType>();

  useEffect(() => {
    const fetchRequestDetailfunc = async () => {
      try {
        // Ensure parsedData is an object before accessing vehicleSelect
        const response = await fetchRequestKeyDetail(requestId);

        setRequestData(response.data);
      } catch (error) {
        console.error("Error fetching vehicle details:", error);
      }
    };

    if (requestId) {
      fetchRequestDetailfunc();
    }
  }, [requestId]);

  console.log("requestData---", requestData);

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

            <CarDetailCard2 reqId={requestData?.trn_request_uid} vehicle={requestData?.vehicle} />
          </div>
        </div>

        <div className="col-span-1 row-start-2 md:row-start-1">
          <div className="form-section">
            <div className="form-section-header">
              <div className="form-section-header-title">พนักงานขับรถ</div>
            </div>
            <DriverUserAppointmentCard id={requestData?.driver.mas_driver_uid || ""} requestData={requestData} />
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
