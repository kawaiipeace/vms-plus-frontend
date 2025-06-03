"use client";
import { RequestDetailType } from "@/app/types/request-detail-type";
import { VehicleKeyType } from "@/app/types/vehicle-user-type";
import AlertCustom from "@/components/alertCustom";
import ApproverModal from "@/components/modal/approverModal";
import DriverAppointmentModal from "@/components/modal/driverAppointmentModal";
import KeyPickupDetailModal from "@/components/modal/keyPickUpDetailModal";
import { fetchRequestKeyDetail, fetchVehicleKeyType } from "@/services/masterService";
import { useEffect, useMemo, useRef, useState } from "react";
import DriverPassengerPeaInfoCard from "../card/driverPassengerPeaInfoCard";
import PickupKeyDetailCard from "../card/pickupKeyDetailCard";
import VehicleDetailCard from "../card/vehicleDetailCard";
import KeyPickUpEditModal from "../modal/keyPickUpEditModal";

interface RequestDetailFormProps {
  editable?: boolean;
  requestId?: string;
}
export default function KeyPickUp({ editable, requestId }: RequestDetailFormProps) {
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

  const [loading, setLoading] = useState(true);
  const [requestData, setRequestData] = useState<RequestDetailType>();
  const [pickupDatePassed, setPickupDatePassed] = useState(false);
  const [vehicleKeyTypeData, setVehicleKeyTypeData] = useState<VehicleKeyType[]>();

  const fetchRequestDetailfunc = async () => {
    try {
      setLoading(true);
      const response = await fetchRequestKeyDetail(requestId || "");
      const responseKeyType = await fetchVehicleKeyType();
      const today = new Date();
      const pickup = new Date(response?.data?.received_key_start_datetime);
      today.setHours(0, 0, 0, 0);
      pickup.setHours(0, 0, 0, 0);
      setPickupDatePassed(today > pickup);
      setRequestData(response.data);
      setVehicleKeyTypeData(responseKeyType.data);
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

  useEffect(() => {
    fetchRequestDetailfunc();
  }, [requestId]);

  const handleModalUpdate = () => {
    fetchRequestDetailfunc();
  };

  const findVehicleKeyType: VehicleKeyType | undefined = useMemo(() => {
    return vehicleKeyTypeData?.find(
      (e) => e.ref_vehicle_key_type_code === requestData?.ref_vehicle_key_type_code?.toString()
    );
  }, [vehicleKeyTypeData, requestData]);

  if (!requestData || loading)
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
                  กรุณาไปรับกุญแจตามวัน เวลา และสถานที่ที่กำหนด หรือติดต่อผู้ดูแลยานพาหนะหากต้องการแก้ไขนัดหมาย
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

            <DriverPassengerPeaInfoCard id={requestData?.vehicle_user_emp_id || ""} requestData={requestData} />
          </div>
        </div>

        <div className="col-span-1 row-start-1 md:row-start-2">
          <div className="form-section">
            <div className="form-section-header">
              <div className="form-section-header-title">ยานพาหนะ</div>
            </div>

            <VehicleDetailCard requestData={requestData} />
          </div>
        </div>
      </div>
      {requestData?.ref_request_status_name === "รอรับกุญแจ" && (
        <button className="btn btn-primary w-full mt-5" onClick={() => keyPickupDetailModalRef.current?.openModal()}>
          รับกุญแจ
        </button>
      )}
      <DriverAppointmentModal ref={driverAppointmentModalRef} id={requestData?.driver?.mas_driver_uid || ""} />
      <KeyPickupDetailModal
        ref={keyPickupDetailModalRef}
        id={requestData?.received_key_emp_id || "-"}
        name={requestData?.received_key_emp_name || "-"}
        deptSap={requestData?.received_key_emp_id + "/" + requestData?.received_key_dept_sap_short || "-"}
        phone={requestData?.received_key_mobile_contact_number || "-"}
        keyStartTime={requestData?.received_key_start_datetime}
        vehicle={requestData?.vehicle}
        onEdit={() => {
          keyPickUpEditModalRef.current?.openModal();
        }}
        reqId={requestData?.trn_request_uid || ""}
        imgSrc={""}
        deptSapShort={""}
      />
      <KeyPickUpEditModal
        ref={keyPickUpEditModalRef}
        onBack={() => keyPickupDetailModalRef.current?.openModal()}
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
