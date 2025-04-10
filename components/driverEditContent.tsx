import React, { useRef } from "react";
import ReceiveCarVehicleModal from "@/components/modal/receiveCarVehicleModal";
import ReturnCarAddModal from "@/components/modal/returnCarAddModal";
import ReturnCarAddStep2Modal from "@/components/modal/returnCarAddStep2Modal";
import { ReturnCarInfoCard } from "@/components/card/returnCarInfoCard";
import AlertCustom from "@/components/alertCustom";
import { DriverReceiveCarInfoCard } from "@/components/card/driverReceiveCarInfoCard";
import ImagesCarCard from "@/components/card/ImagesCarCard";

interface DriverEditContentProps {
  progressType: string;
}

export const DriverEditContent = ({ progressType }: DriverEditContentProps) => {
  const receiveCarVehicleModalRef = useRef<{
    openModal: () => void;
    closeModal: () => void;
  } | null>(null);
  const returnCarAddModalRef = useRef<{
    openModal: () => void;
    closeModal: () => void;
  } | null>(null);
  const returnCarAddStep2ModalRef = useRef<{
    openModal: () => void;
    closeModal: () => void;
  } | null>(null);
  return (
    <>
      {progressType === "คืนยานพาหนะไม่สำเร็จ" && <AlertCustom title="ถูกตีกลับโดยผู้ดูแลยานพาหนะ" desc="เหตุผล: กรุณาเติมเชื้อเพลิงและดูแลความสะอาด ก่อนคืนยานพาหนะ" />}
      <div className="grid md:grid-cols-2 gird-cols-1 gap-4">
        <div className="w-full row-start-2 md:col-start-1">
          {progressType === "รับยานพาหนะ" && (
            <>
              <div className="form-section">
                <div className="form-section-header">
                  <div className="form-section-header-title">
                    <p>ข้อมูลการรับยานพาหนะ</p>
                  </div>

                  <div className="form-section-header-actions">
                    <button className="btn bg-transparent border-none shadow-none hover:bg-transparent text-[#A80689]" onClick={() => receiveCarVehicleModalRef.current?.openModal()}>
                      แก้ไข
                    </button>
                  </div>
                </div>

                <DriverReceiveCarInfoCard />
              </div>

              <div className="form-section">
                <div className="form-section-header">
                  <div className="form-section-header-title">
                    <p>รูปยานพาหนะก่อนเดินทาง</p>
                  </div>
                  <div className="form-section-header-actions">
                    <button className="btn bg-transparent border-none shadow-none hover:bg-transparent text-[#A80689]" onClick={() => returnCarAddStep2ModalRef.current?.openModal()}>
                      แก้ไข
                    </button>
                  </div>
                </div>

                <ImagesCarCard />
              </div>
            </>
          )}

          {(progressType === "การคืนยานพาหนะ" || progressType === "คืนยานพาหนะไม่สำเร็จ") && (
            <>
              <div className="form-section">
                <div className="form-section-header">
                  <div className="form-section-header-title">
                    <p>ข้อมูลการคืนยานพาหนะ</p>
                  </div>

                  <div className="form-section-header-actions">
                    <button className="btn bg-transparent border-none shadow-none hover:bg-transparent text-[#A80689]" onClick={() => returnCarAddModalRef.current?.openModal()}>
                      แก้ไข
                    </button>
                  </div>
                </div>

                <ReturnCarInfoCard />
              </div>

              <div className="form-section">
                <div className="form-section-header">
                  <div className="form-section-header-title">
                    <p>รูปยานพาหนะก่อนเดินทาง</p>
                  </div>
                  <div className="form-section-header-actions">
                    <button className="btn bg-transparent border-none shadow-none hover:bg-transparent text-[#A80689]" onClick={() => returnCarAddStep2ModalRef.current?.openModal()}>
                      แก้ไข
                    </button>
                  </div>
                </div>

                <ImagesCarCard />
              </div>
              {progressType === "คืนยานพาหนะไม่สำเร็จ" && (
                <div className="w-full">
                  <button className="btn btn-primary w-full">คืนยานพาหนะอีกครั้ง</button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
      <ReceiveCarVehicleModal status="edit" ref={receiveCarVehicleModalRef} />
      <ReturnCarAddModal ref={returnCarAddModalRef} />
      <ReturnCarAddStep2Modal status="edit" useBy="driver" openStep1={() => () => {}} ref={returnCarAddStep2ModalRef} />
    </>
  );
};
