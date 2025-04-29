import { RequestDetailType } from "@/app/types/request-detail-type";
import AlertCustom from "@/components/alertCustom";
import CarDetailCard2 from "@/components/card/carDetailCard2";
import ApproverModal from "@/components/modal/approverModal";
import DriverAppointmentModal from "@/components/modal/driverAppointmentModal";
import KeyPickupDetailModal from "@/components/modal/keyPickUpDetailModal";
import { fetchRequestKeyDetail } from "@/services/masterService";
import { useEffect, useRef, useState } from "react";
import DriverPassengerInfoCard from "@/components/card/driverPassengerInfoCard";
import DriverPassengerPeaInfoCard from "@/components/card/driverPassengerPeaInfoCard";
import PickupKeyDetailCard from "@/components/card/pickupKeyDetailCard";
import KeyPickUpEditModal from "@/components/modal/keyPickUpEditModal";

interface RequestDetailFormProps {
  editable?: boolean;
  requestId?: string;
}
export default function KeyHandoverDetail({ editable, requestId }: RequestDetailFormProps) {
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
              <div className="form-section-header-title">ผู้ไปรับกุญแจ</div>
              {editable && (
                <button className="btn btn-tertiary-brand bg-transparent shadow-none border-none" onClick={() => keyPickupDetailModalRef.current?.openModal()}>
                  แก้ไข
                </button>
              )}
            </div>

            <div className="form-card">
              <div className="form-card-body form-card-inline flex-wrap">
                <div className="w-full flex flex-wrap gap-4">
                  <div className="form-group form-plaintext form-users">
        
                    <div className="form-plaintext-group align-self-center">
                      <div className="form-label">ศรัญยู บริรัตน์ฤทธิ์</div>
                      <div className="supporting-text-group">
                        <div className="supporting-text">505291</div>
                        <div className="supporting-text">นรค.6 กอพ.1 ฝพจ.</div>
                      </div>
                    </div>
                  </div>
                  <div className="form-card-right align-self-center">
                    <div className="flex flex-wrap gap-4">
                      <div className="col-span-12 md:col-span-6">
                        <div className="form-group form-plaintext">
                          <i className="material-symbols-outlined">smartphone</i>
                          <div className="form-plaintext-group">
                            <div className="form-text text-nowrap">091-234-5678</div>
                          </div>
                        </div>
                      </div>

                      <div className="col-span-12 md:col-span-6">
                        <div className="form-group form-plaintext">
                          <i className="material-symbols-outlined">call</i>
                          <div className="form-plaintext-group">
                            <div className="form-text text-nowra">6032</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-1 w-full pt-3">
                  <div className="col-span-12">
                    <div className="form-group form-plaintext">
                      <i className="material-symbols-outlined">sms</i>
                      <div className="form-plaintext-group">
                        <div className="form-label">หมายเหตุ</div>
                        <div className="form-text text-nowra">จะไปรับกุญแจช่วงบ่ายครับ</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div> 


        </div>

        <div className="col-span-1 row-start-1 md:row-start-2">
          <div className="form-section">
            <div className="form-section-header">
              <div className="form-section-header-title">ยานพาหนะ</div>
            </div>

            <CarDetailCard2 reqId={requestData?.trn_request_uid} vehicle={requestData?.vehicle} />
          </div>
        </div>
      </div>

      <DriverAppointmentModal ref={driverAppointmentModalRef} id={requestData?.driver.mas_driver_uid || ""} />
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
