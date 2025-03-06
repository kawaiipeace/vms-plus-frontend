import React, { useRef } from "react";
import Image from "next/image";
import DriverAppointmentModal from "@/app/components/modal/driverAppointmentModal";
import ApproverModal from "@/app/components/modal/approverModal";
import AlertCustom from "@/app/components/alertCustom";
import ApproveRequestModal from "@/app/components/modal/approveRequestModal";
import CarDetailCard2 from "@/app/components/card/carDetailCard2";
import AppointmentDriverCard from "@/app/components/card/appointmentDriverCard";
import KeyPickUpAppointmentModal from "@/app/components/modal/keyPickupAppointmentModal";

interface RequestDetailFormProps {
  status: string;
}
const KeyPickUp = ({ status }: RequestDetailFormProps) => {
  const driverAppointmentModalRef = useRef<{
    openModal: () => void;
    closeModal: () => void;
  } | null>(null);
  const vehiclePickModalRef = useRef<{
    openModal: () => void;
    closeModal: () => void;
  } | null>(null);
  const approverModalRef = useRef<{
    openModal: () => void;
    closeModal: () => void;
  } | null>(null);

  const approveRequestModalRef = useRef<{
    openModal: () => void;
    closeModal: () => void;
  } | null>(null);
  return (
    <>
      {status == "edit" && <AlertCustom icon="cancel" title="เกินวันที่นัดหมายรับกุญแจแล้ว" desc="กรุณาติดต่อผู้ดูแลยานพาหนะหากต้องการนัดหมายเดินทางใหม่" />}
      <div className="grid md:grid-cols-2 gird-cols-1 gap-4">
        <div className="w-full row-start-2 md:col-start-1">
          <div className="form-section">
            <div className="form-section-header">
              <div className="form-section-header-title">
                <p>การนัดหมายรับกุญแจ</p>
                <p className="text-sm text-gray-500 font-normal">กรุณาไปรับกุญแจตามวัน เวลา และสถานที่ที่กำหนด หรือติดต่อผู้ดูแลยานพาหนะหากต้องการแก้ไขนัดหมาย</p>
              </div>

              {status != "detail" && (
                <button className="btn btn-tertiary-brand bg-transparent shadow-none border-none" onClick={() => driverAppointmentModalRef.current?.openModal()}>
                  แก้ไข
                </button>
              )}
            </div>

            <AppointmentDriverCard />
          </div>

          <div className="form-section">
            <div className="form-section-header">
              <div className="form-section-header-title">ผู้ไปรับกุญแจ</div>
              {status != "detail" && (
                <button className="btn btn-tertiary-brand bg-transparent shadow-none border-none" onClick={() => vehiclePickModalRef.current?.openModal()}>
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
          </div>

          <div className="form-section">
            <div className="form-section-header">
              <div className="form-section-header-title">ผู้ดูแลยานพาหนะ</div>
            </div>

            <div className="form-card">
              <div className="form-card-body form-card-inline">
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
            </div>
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
      <DriverAppointmentModal process="edit" ref={driverAppointmentModalRef} />
      <KeyPickUpAppointmentModal process="edit" ref={vehiclePickModalRef} />
      <ApproverModal ref={approverModalRef} />
      <ApproveRequestModal ref={approveRequestModalRef} title={"ยืนยันการส่งคำขออีกครั้ง"} desc={"ระบบจะทำการส่งคำขอนี้ ไปให้ต้นสังกัดอนุมัติอีกครั้ง"} confirmText="ส่งคำขอ" />
    </>
  );
};

export default KeyPickUp;
