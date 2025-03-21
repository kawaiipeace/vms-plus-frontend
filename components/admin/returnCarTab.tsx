import React, { useRef } from "react";
import UserInfoCard from "@/components/card/userInfoCard";
import ReturnCarAddModal from "@/components/modal/returnCarAddModal";
import ReturnCarAddStep2Modal from "@/components/modal/returnCarAddStep2Modal";
import AlertCustom from "@/components/alertCustom";
import { ReturnCarInfoCard } from "@/components/card/returnCarInfoCard";
import ImagesCarCard from "@/components/card/ImagesCarCard";
import CarDetailCard from "@/components/card/carDetailCard";
import ReviewCarDriveModal from "../modal/reviewCarDriveModal";

interface ReturnCarTabProps {
  status?: string;
  displayOn?: string;
}

const ReturnCarTab = ({ status, displayOn }: ReturnCarTabProps) => {
  const returnCarAddModalRef = useRef<{
    openModal: () => void;
    closeModal: () => void;
  } | null>(null);

  const returnCarAddStep2ModalRef = useRef<{
    openModal: () => void;
    closeModal: () => void;
  } | null>(null);

  const reviewCarDriveModalRef = useRef<{
    openModal: () => void;
    closeModal: () => void;
  } | null>(null);

  return (
    <>
      {status == "returnFail" && <AlertCustom title="ถูกตีกลับโดยผู้ดูแลยานพาหนะ" desc="เหตุผล: ยานพาหนะไม่สะอาด" />}
      <div className="grid md:grid-cols-2 gird-cols-1 gap-4">
        <div className="w-full row-start-2 md:col-start-1">
          <div className="form-section">
            <div className="form-section-header">
              <div className="form-section-header-title">
                <p>ข้อมูลการคืนยานพาหนะ</p>
              </div>
              {(status === "returnFail" || displayOn === "adminTab") && (
                <div className="form-section-header-actions">
                  <button className="btn bg-transparent border-none shadow-none hover:bg-transparent text-[#A80689]" onClick={() => returnCarAddModalRef.current?.openModal()}>
                    แก้ไข
                  </button>
                </div>
              )}
            </div>

            <ReturnCarInfoCard />
          </div>

          <div className="form-section">
            <div className="form-section-header">
              <div className="form-section-header-title">
                <p>รูปยานพาหนะหลังเดินทาง</p>
              </div>
              {(status === "returnFail" || displayOn === "adminTab") && (
                <div className="form-section-header-actions">
                  <button className="btn bg-transparent border-none shadow-none hover:bg-transparent text-[#A80689]" onClick={() => returnCarAddStep2ModalRef.current?.openModal()}>
                    แก้ไข
                  </button>
                </div>
              )}
            </div>

            <ImagesCarCard />
          </div>
        </div>
        <div className="w-full row-start-2 md:col-start-2">
          <CarDetailCard />
          <UserInfoCard UserType="outsource" reviewDriver={() => reviewCarDriveModalRef.current?.openModal()} displayOn="admin" />
        </div>
        <ReviewCarDriveModal displayOn="admin" ref={reviewCarDriveModalRef} />
        <ReturnCarAddModal useBy="admin" ref={returnCarAddModalRef} />
        <ReturnCarAddStep2Modal useBy="admin" openStep1={() => () => {}} ref={returnCarAddStep2ModalRef} />
      </div>
    </>
  );
};

export default ReturnCarTab;
