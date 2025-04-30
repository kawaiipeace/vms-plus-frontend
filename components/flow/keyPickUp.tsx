import { RequestDetailType } from "@/app/types/request-detail-type";
import AlertCustom from "@/components/alertCustom";
import CarDetailCard2 from "@/components/card/carDetailCard2";
import ApproverModal from "@/components/modal/approverModal";
import DriverAppointmentModal from "@/components/modal/driverAppointmentModal";
import KeyPickupDetailModal from "@/components/modal/keyPickUpDetailModal";
import { fetchRequestKeyDetail } from "@/services/masterService";
import { useEffect, useRef, useState } from "react";
import DriverPassengerInfoCard from "../card/driverPassengerInfoCard";
import DriverPassengerPeaInfoCard from "../card/driverPassengerPeaInfoCard";
import PickupKeyDetailCard from "../card/pickupKeyDetailCard";
import KeyPickUpEditModal from "../modal/keyPickUpEditModal";

interface RequestDetailFormProps {
  editable?: boolean;
  requestId?: string;
}
export default function KeyPickUp({
  editable,
  requestId,
}: RequestDetailFormProps) {
  const driverAppointmentModalRef = useRef<{
    openModal: () => void;
    closeModal: () => void;
  } | null>(null);
  const keyPickupDetailModalRef = useRef<{
    openModal: () => void;
    closeModal: () => void;
  } | null>(null);
  const approverModalRef = useRef<{
    openModal: () => void;
    closeModal: () => void;
  } | null>(null);
  const keyPickUpEditModalRef = useRef<{
    openModal: () => void;
    closeModal: () => void;
  }>(null);

  const [requestData, setRequestData] = useState<RequestDetailType>();
  const [pickupDatePassed, setPickupDatePassed] = useState(false);

  const fetchRequestDetailfunc = async () => {
    try {
      // Ensure parsedData is an object before accessing vehicleSelect
      const response = await fetchRequestKeyDetail(requestId || "");
      console.log("data---", response.data);
      const today = new Date();
      const pickup = new Date(response?.data?.received_key_start_datetime);
      // zero out time for accurate day comparison
      today.setHours(0, 0, 0, 0);
      pickup.setHours(0, 0, 0, 0);
      setPickupDatePassed(today > pickup ? true : false);
      setRequestData(response.data);
    } catch (error) {
      console.error("Error fetching vehicle details:", error);
    }
  };

  useEffect(() => {
    console.log("re-", requestId);
    fetchRequestDetailfunc();
  }, [requestId]);

  const handleModalUpdate = () => {
    fetchRequestDetailfunc();
  };

  console.log("requestData---", requestData);

  return (
    <>
      {pickupDatePassed && (
        <AlertCustom
          icon="cancel"
          title="เกินวันที่นัดหมายรับกุญแจแล้ว"
          desc="กรุณาติดต่อผู้ดูแลยานพาหนะหากต้องการนัดหมายเดินทางใหม่"
        />
      )}
      <div className="grid md:grid-cols-2 gird-cols-1 gap-4 w-full">
        <div className="w-full row-start-2 md:col-start-1">
          <div className="form-section">
            <div className="form-section-header">
              <div className="form-section-header-title">
                <p>การนัดหมายรับกุญแจ</p>
                <p className="text-sm text-gray-500 font-normal">
                  กรุณาไปรับกุญแจตามวัน เวลา และสถานที่ที่กำหนด
                  หรือติดต่อผู้ดูแลยานพาหนะหากต้องการแก้ไขนัดหมาย
                </p>
              </div>

              {editable && (
                <button
                  className="btn btn-tertiary-brand bg-transparent shadow-none border-none"
                  onClick={() => driverAppointmentModalRef.current?.openModal()}
                >
                  แก้ไข
                </button>
              )}
            </div>

            <PickupKeyDetailCard
              receiveKeyPlace={requestData?.received_key_place}
              receiveKeyStart={requestData?.received_key_start_datetime}
              receiveKeyEnd={requestData?.received_key_end_datetime}
            />
          </div>
          
          <div className="form-section">
            <div className="form-section-header">
              <div className="form-section-header-title">ผู้ดูแลยานพาหนะ</div>
            </div>
            {requestData?.is_pea_employee_driver === "1" ? (
              <DriverPassengerPeaInfoCard
                id={requestData?.vehicle_user_emp_id || ""}
                requestData={requestData}
              />
            ) : (
              <DriverPassengerInfoCard
                id={requestData?.mas_carpool_driver_uid || ""}
                requestData={requestData}
              />
            )}
          </div>
        </div>

        <div className="col-span-1 row-start-1 md:row-start-2">
          <div className="form-section">
            <div className="form-section-header">
              <div className="form-section-header-title">ยานพาหนะ</div>
            </div>

            <CarDetailCard2
              reqId={requestData?.trn_request_uid}
              vehicle={requestData?.vehicle}
            />
          </div>
        </div>
      </div>
      <button
        className="btn btn-primary w-full mt-5"
        onClick={() => keyPickupDetailModalRef.current?.openModal()}
      >
        รับกุญแจ
      </button>
      <DriverAppointmentModal
        ref={driverAppointmentModalRef}
        id={requestData?.driver.mas_driver_uid || ""}
      />
      <KeyPickupDetailModal
        reqId={requestData?.trn_request_uid || ""}
        imgSrc={requestData?.received_key_image_url || "/assets/img/avatar.svg"}
        ref={keyPickupDetailModalRef}
        id={requestData?.received_key_emp_id || ""}
        name={requestData?.received_key_emp_name || "-"}
        deptSap={requestData?.received_key_dept_sap || "-"}
        phone={requestData?.received_key_mobile_contact_number || "-"}
        vehicle={requestData?.vehicle}
        onEdit={() => {
          keyPickUpEditModalRef.current?.openModal();
        }}
      />
      <KeyPickUpEditModal
        ref={keyPickUpEditModalRef}
        onBack={() => {
          keyPickupDetailModalRef.current?.openModal();
        }}
        onSubmit={() => {
          handleModalUpdate();
          keyPickupDetailModalRef.current?.openModal();
        }}
        requestData={requestData}
      />

      <ApproverModal ref={approverModalRef} />
    </>
  );
}
