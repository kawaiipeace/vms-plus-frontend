import { RequestDetailType } from "@/app/types/request-detail-type";
import AlertCustom from "@/components/alertCustom";
import CarDetailCard2 from "@/components/card/carDetailCard2";
import { fetchRequestKeyDetail } from "@/services/masterService";
import { useCallback, useEffect, useRef, useState } from "react";
import PickupKeyDetailCard from "@/components/card/pickupKeyDetailCard";
import { isEqual } from "lodash";
import KeyUserPickupCard from "./key-user-pickup-card";
import KeyPickUpEditModal from "@/components/modal/keyPickUpEditModal";
import EditKeyAppointmentModal from "@/components/modal/editKeyAppointmentModal";
import ReceiveKeySuccessModal from "@/components/modal/receiveKeySuccessModal";
import KeyPickupDetailCard from "../cards/keyPickupDetailCard";
import TravelCardModal from "@/components/modal/travelCardModal";
import EditKeyPickupDetailModal from "@/components/modal/admin/editKeyPickupDetailModal";
import ToastCustom from "@/components/toastCustom";
import VehicleDetailCard from "@/components/card/vehicleDetailCard";

interface RequestDetailFormProps {
  editable?: boolean;
  requestId?: string;
}

export default function KeyHandoverDetail({
  editable,
  requestId,
}: RequestDetailFormProps) {
  const keyPickupEditModalRef = useRef<{
    openModal: () => void;
    closeModal: () => void;
  } | null>(null);

  const editKeyAppointmentModalRef = useRef<{
    openModal: () => void;
    closeModal: () => void;
  } | null>(null);

  const receiveKeySuccessModalRef = useRef<{
    openModal: () => void;
    closeModal: () => void;
  } | null>(null);

  const editKeyPickupDetailModalRef = useRef<{
    openModal: () => void;
    closeModal: () => void;
  } | null>(null);

  const [requestData, setRequestData] = useState<RequestDetailType>();
  const [pickupDatePassed, setPickupDatePassed] = useState(false);
  const [editKeySuccess, setEditKeySuccess] = useState(false);

  const fetchData = useCallback(async () => {
    if (requestId) {
      try {
        const response = await fetchRequestKeyDetail(requestId);
        console.log("data---", response.data);

        if (!isEqual(response.data, requestData)) {
          setRequestData(response.data);
          const today = new Date();
          const pickup = new Date(response?.data?.received_key_start_datetime);
          today.setHours(0, 0, 0, 0);
          pickup.setHours(0, 0, 0, 0);
          setPickupDatePassed(today > pickup);
        }
      } catch (error) {
        console.error("Error fetching vehicle details:", error);
      }
    }
  }, [requestId, requestData]);

  useEffect(() => {
    let isMounted = true;

    if (isMounted) {
      fetchData();
    }

    return () => {
      isMounted = false;
    };
  }, [fetchData]);

  useEffect(() => {
    console.log(requestData?.ref_request_status_code);
    if (requestData?.ref_request_status_code === "51") {
      receiveKeySuccessModalRef.current?.openModal();
    }
  }, [requestData]);

  const handleModalUpdate = () => {
    fetchData();
  };

  const handleKeyEdit = () => {
    editKeyPickupDetailModalRef.current?.closeModal();
    setEditKeySuccess(true);
  };

  return (
    <>
      {editKeySuccess && (
        <ToastCustom
          title="แก้ไขรายละเอียดการรับกุญแจสำเร็จ"
          desc={
            <>
              แก้ไขรายละเอียดการรับกุญแจคำขอใช้ยานพหานะ
              <br />
              เลขที่ {requestData?.request_no} เรียบร้อยแล้ว
            </>
          }
          status="success"
        />
      )}

      {pickupDatePassed && (
        <AlertCustom
          icon="cancel"
          title="เกินวันที่นัดหมายรับกุญแจแล้ว"
          desc="กรุณาติดต่อผู้ดูแลยานพาหนะหากต้องการนัดหมายเดินทางใหม่"
        />
      )}
      <div className="grid md:grid-cols-2 grid-cols-1 gap-4 w-full">
        <div className="w-full row-start-2 md:col-start-1">
          <div className="form-section">
            <div className="form-section-header">
              <div className="form-section-header-title">
                {" "}
                การนัดหมายรับกุญแจ
              </div>
              {editable && (
                <button
                  className="btn btn-tertiary-brand bg-transparent shadow-none border-none"
                  onClick={() =>
                    editKeyAppointmentModalRef.current?.openModal()
                  }
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
              <div className="form-section-header-title">ผู้ไปรับกุญแจ</div>
              {editable && (
                <button
                  className="btn btn-tertiary-brand bg-transparent shadow-none border-none"
                  onClick={() => keyPickupEditModalRef.current?.openModal()}
                >
                  แก้ไข
                </button>
              )}
            </div>

            <KeyUserPickupCard requestData={requestData} />
          </div>
          {requestData?.ref_request_status_code !== "50" && (
            <div className="form-section">
              <div className="form-section-header">
                <div className="form-section-header-title">
                  รายละเอียดการรับกุญแจ{" "}
                </div>
                {editable && (
                  <button
                    className="btn btn-tertiary-brand bg-transparent shadow-none border-none"
                    onClick={() =>
                      editKeyPickupDetailModalRef.current?.openModal()
                    }
                  >
                    แก้ไข
                  </button>
                )}
              </div>

              <KeyPickupDetailCard requestData={requestData} />
            </div>
          )}
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

      <TravelCardModal />

      <EditKeyAppointmentModal
        req_id={requestData?.trn_request_uid}
        place={requestData?.received_key_place}
        date={requestData?.received_key_start_datetime}
        start_time={requestData?.received_key_start_datetime}
        end_time={requestData?.received_key_end_datetime}
        ref={editKeyAppointmentModalRef}
        onUpdate={handleModalUpdate}
      />

      <EditKeyPickupDetailModal
        requestData={requestData}
        ref={editKeyPickupDetailModalRef}
        onSubmit={handleModalUpdate}
      />

      <KeyPickUpEditModal
        ref={keyPickupEditModalRef}
        requestData={requestData}
        role="keyAdmin"
        onUpdate={handleModalUpdate}
      />

      <ReceiveKeySuccessModal
        id={requestData?.trn_request_uid || ""}
        ref={receiveKeySuccessModalRef}
        title={"ผู้ใช้ได้รับกุญแจเรียบร้อยแล้ว"}
        role="final"
        desc={
          <>
            ผู้ใช้ได้รับกุญแจยานพาหนะเรียบร้อยแล้ว <br></br>{" "}
            คุณสามารถแก้ไขประเภทกุญแจ (หลัก/สำรอง) ได้ในภายหลัง
          </>
        }
        confirmText="ดูรายละเอียด"
      />
    </>
  );
}
