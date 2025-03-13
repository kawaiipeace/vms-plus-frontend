import React, { useRef } from "react";
import UserInfoCard from "@/app/components/card/userInfoCard";
import Image from "next/image";
import ReturnCarAddModal from "@/app/components/modal/returnCarAddModal";
import ReturnCarAddStep2Modal from "@/app/components/modal/returnCarAddStep2Modal";
import AlertCustom from "@/app/components/alertCustom";
import { ReturnCarInfoCard } from "@/app/components/card/returnCarInfoCard";
import ImagesCarCard from "@/app/components/card/ImagesCarCard";
import CarDetailCard from "@/app/components/card/carDetailCard";

interface ReturnCarTabProps {
  status: string;
}

const ReturnCarTab = ({ status }: ReturnCarTabProps) => {
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
      {status == "returnFail" && <AlertCustom title="ถูกตีกลับโดยผู้ดูแลยานพาหนะ" desc="เหตุผล: ยานพาหนะไม่สะอาด" />}
      <div className="grid md:grid-cols-2 gird-cols-1 gap-4">
        <div className="w-full row-start-2 md:col-start-1">
          <div className="form-section">
            <div className="form-section-header">
              <div className="form-section-header-title">
                <p>ข้อมูลการคืนยานพาหนะ</p>
              </div>
              {status === "returnFail" && (
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
              {status === "returnFail" && (
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
          <UserInfoCard displayOn="admin" />
        </div>
        <ReturnCarAddModal ref={returnCarAddModalRef} />
        <ReturnCarAddStep2Modal openStep1={() => () => {}} ref={returnCarAddStep2ModalRef} />
      </div>
    </>
  );
};

export default ReturnCarTab;
