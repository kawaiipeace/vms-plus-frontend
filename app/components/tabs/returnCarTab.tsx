import React, { useRef } from "react";
import UserInfoCard from "@/app/components/card/userInfoCard";
import Image from "next/image";
import ReturnCarAddModal from "@/app/components/modal/returnCarAddModal";
import ReturnCarAddStep2Modal from "@/app/components/modal/returnCarAddStep2Modal";
import AlertCustom from "@/app/components/alertCustom";
import { ReturnCarInfoCard } from "@/app/components/card/returnCarInfoCard";

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

            <div className="form-card">
              <div className="form-card-body">
                <div className="w-[320px] mx-auto overflow-x-auto">
                  <div className="w-[560px] flex justify-center gap-4">
                    <div className="w-[280px] aspect-square overflow-hidden">
                      <Image className="object-cover object-center" src="/assets/img/sample-car.jpeg" width={900} height={900} alt="" />
                    </div>
                    <div className="w-[280px] grid grid-cols-2 gap-4">
                      <div className="w-[140px] aspect-square overflow-hidden">
                        <Image className="object-cover object-center" src="/assets/img/sample-car.jpeg" width={900} height={900} alt="" />
                      </div>
                      <div className="w-[140px] aspect-square overflow-hidden">
                        <Image className="object-cover object-center" src="/assets/img/sample-car.jpeg" width={900} height={900} alt="" />
                      </div>
                      <div className="w-[140px] aspect-square overflow-hidden">
                        <Image className="object-cover object-center" src="/assets/img/sample-car.jpeg" width={900} height={900} alt="" />
                      </div>
                      <div className="w-[140px] aspect-square overflow-hidden">
                        <Image className="object-cover object-center" src="/assets/img/sample-car.jpeg" width={900} height={900} alt="" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="form-section">
            <div className="form-section-header">
              <div className="form-section-header-title">
                <p>ผู้ดูแลยานพาหนะ</p>
              </div>
            </div>

            <UserInfoCard UserType="outsource" displayBtnMore={true} />
          </div>
        </div>
        <ReturnCarAddModal ref={returnCarAddModalRef} />
        <ReturnCarAddStep2Modal openStep1={() => () => {}} ref={returnCarAddStep2ModalRef} />
      </div>
    </>
  );
};

export default ReturnCarTab;
