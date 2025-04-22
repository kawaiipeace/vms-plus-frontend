import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import DriverAppointmentModal from "@/components/modal/driverAppointmentModal";
import ApproverModal from "@/components/modal/approverModal";
import AlertCustom from "@/components/alertCustom";
import CarDetailCard2 from "@/components/card/carDetailCard2";
import AppointmentDriverCard from "@/components/card/appointmentDriverCard";
import KeyPickupDetailModal from "@/components/modal/keyPickUpDetailModal";
import DriverPeaInfoCard from "../card/driverPeaInfoCard";
import { RequestDetailType } from "@/app/types/request-detail-type";
import { fetchRequestKeyDetail } from "@/services/masterService";
import VehicleUserInfoCard from "../card/vehicleUserInfoCard";
import PickupKeyCard from "../card/pickupKeyCard";
import PickupKeyDetailCard from "../card/pickupKeyDetailCard";

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
    fetchRequestDetailfunc();
  }, [requestId]);
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

          {/* <div className="form-section">
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
                    <Image src="/assets/img/sample-avatar.png" className="avatar avatar-md" width={100} height={100} alt="" />
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
          </div> */}

          <div className="form-section">
            <div className="form-section-header">
              <div className="form-section-header-title">ผู้ดูแลยานพาหนะ</div>
            </div>

            <VehicleUserInfoCard
              id={requestData?.vehicle_user_emp_id || ""}
              requestData={requestData}
              callable={true}
            />
          </div>
        </div>

        <div className="col-span-1 row-start-1 md:row-start-2">
          <div className="form-section">
            <div className="form-section-header">
              <div className="form-section-header-title">ยานพาหนะ</div>
            </div>

            <CarDetailCard2 />
          </div>
        </div>
      </div>
      <button className="btn btn-primary w-full mt-5" onClick={() => keyPickupDetailModalRef.current?.openModal()}>รับกุญแจ</button>
      <DriverAppointmentModal ref={driverAppointmentModalRef} id="2" />
      <KeyPickupDetailModal userPickUpType="บุคคลภายนอก" ref={keyPickupDetailModalRef} />
      <ApproverModal ref={approverModalRef} />
      {/* <ApproveRequestModal ref={approveRequestModalRef} title={"ยืนยันการส่งคำขออีกครั้ง"} desc={"ระบบจะทำการส่งคำขอนี้ ไปให้ต้นสังกัดอนุมัติอีกครั้ง"} confirmText="ส่งคำขอ" /> */}
    </>
  );
}
