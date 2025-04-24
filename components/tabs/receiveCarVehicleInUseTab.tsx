import React, { useRef, useState } from "react";
import CarDetailCard2 from "@/components/card/carDetailCard2";
import UserInfoCard from "@/components/card/userInfoCard";
import ReceiveCarVehicleModal from "@/components/modal/receiveCarVehicleModal";
import ImagesCarCard from "@/components/card/ImagesCarCard";
import ReturnCarAddStep2Modal from "@/components/modal/returnCarAddStep2Modal";

interface ReceiveCarVehicleInUseTabProps {
  edit?: string;
  displayOn?: string;
  requestId?: string;
}

const ReceiveCarVehicleInUseTab = ({ requestId, edit, displayOn }: ReceiveCarVehicleInUseTabProps) => {
  const receiveCarVehicleModalRef = useRef<{
    openModal: () => void;
    closeModal: () => void;
  } | null>(null);
  const returnCarAddStep2ModalRef = useRef<{
    openModal: () => void;
    closeModal: () => void;
  } | null>(null);
  const [receiveSuccess, setReceiveSuccess] = useState(true);
  return (
    <div className="grid md:grid-cols-2 gird-cols-1 gap-4">
      <div className="w-full row-start-2 md:col-start-1">
        {receiveSuccess && (
          <>
            <div className="form-section">
              <div className="form-section-header">
                <div className="form-section-header-title">
                  <p>ข้อมูลการรับยานพาหนะ</p>
                </div>
                {edit === "edit" && (
                  <div className="form-section-header-actions">
                    <button className="btn bg-transparent border-none shadow-none hover:bg-transparent text-[#A80689]" onClick={() => receiveCarVehicleModalRef.current?.openModal()}>
                      แก้ไข
                    </button>
                  </div>
                )}
              </div>

              <div className="form-card">
                <div className="form-card-body">
                  <div className="grid grid-cols-2">
                    <div>
                      <div className="form-group form-plaintext">
                        <i className="material-symbols-outlined">calendar_month</i>
                        <div className="form-plaintext-group">
                          <div className="form-label">วันที่</div>
                          <div className="form-text">01/01/2567</div>
                        </div>
                      </div>
                    </div>
                    <div>
                      <div className="form-group form-plaintext">
                        <i className="material-symbols-outlined">schedule</i>
                        <div className="form-plaintext-group">
                          <div className="form-label">เวลา</div>
                          <div className="form-text">08:30</div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2">
                    <div>
                      <div className="form-group form-plaintext">
                        <i className="material-symbols-outlined">search_activity</i>
                        <div className="form-plaintext-group">
                          <div className="form-label">เลขไมล์</div>
                          <div className="form-text">19845</div>
                        </div>
                      </div>
                    </div>
                    <div>
                      <div className="form-group form-plaintext">
                        <i className="material-symbols-outlined">local_gas_station</i>
                        <div className="form-plaintext-group">
                          <div className="form-label">ปริมาณเชื้อเพลิง</div>
                          <div className="form-text">100%</div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-1">
                    <div>
                      <div className="form-group form-plaintext">
                        <i className="material-symbols-outlined">news</i>
                        <div className="form-plaintext-group">
                          <div className="form-label">หมายเหตุ</div>
                          <div className="form-text">มีรอยบุบนิดหน่อย</div>
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
                  <p>รูปยานพาหนะก่อนเดินทาง</p>
                </div>
                {edit === "edit" && (
                  <div className="form-section-header-actions">
                    <button className="btn bg-transparent border-none shadow-none hover:bg-transparent text-[#A80689]" onClick={() => returnCarAddStep2ModalRef.current?.openModal()}>
                      แก้ไข
                    </button>
                  </div>
                )}
              </div>

              <ImagesCarCard />
            </div>
          </>
        )}
        {displayOn !== "admin" && (
          <>
            <div className="form-section">
              <div className="form-section-header">
                <div className="form-section-header-title">
                  <p>สถานที่จอดรถ</p>
                </div>
              </div>

              <div className="form-card">
                <div className="form-card-body">
                  <div className="grid grid-cols-12">
                    <div className="col-span-12 md:col-span-6">
                      <div className="form-group form-plaintext">
                        <i className="material-symbols-outlined">calendar_month</i>
                        <div className="form-plaintext-group">
                          <div className="form-label">วันที่และเวลา</div>
                          <div className="form-text">01/01/2567 08:30</div>
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
          </>
        )}

    
          <button className="btn btn-primary w-full" onClick={() => receiveCarVehicleModalRef.current?.openModal()}>
            รับยานพาหนะ
          </button>
      
      </div>

      <div className="col-span-1 row-start-1 md:row-start-2">
        <div className="form-section">
          <div className="form-section-header">
            <div className="form-section-header-title">ข้อมูลยานพาหนะ</div>
          </div>

          <CarDetailCard2 />
        </div>
      </div>
      
      <ReceiveCarVehicleModal status={edit} ref={receiveCarVehicleModalRef} />
      <ReturnCarAddStep2Modal openStep1={() => {}} ref={returnCarAddStep2ModalRef} />
    </div>
  );
};

export default ReceiveCarVehicleInUseTab;
