"use client";
import { RequestDetailType } from "@/app/types/request-detail-type";
import CarDetailCard2 from "@/components/card/carDetailCard2";
import ImagesCarCard from "@/components/card/ImagesCarCard";
import UserInfoCard from "@/components/card/userInfoCard";
import ReceiveCarVehicleModal from "@/components/modal/receiveCarVehicleModal";
import { fetchRequestKeyDetail } from "@/services/masterService";
import { useEffect, useRef, useState } from "react";
import DriverPassengerPeaInfoCard from "../card/driverPassengerPeaInfoCard";
import { fetchRequestDetail } from "@/services/keyAdmin";
import { convertToBuddhistDateTime } from "@/utils/converToBuddhistDateTime";
import ToastCustom from "../toastCustom";
import ReturnEditCarModal from "@/components/admin/modals/returnEditCarModal";

interface ReceiveCarVehicleInUseTabProps {
  edit?: string;
  displayOn?: string;
  requestId?: string;
  role?: string;
}

const ReceiveCarVehicleInUseTab = ({
  requestId,
  edit,
  displayOn,
  role,
}: ReceiveCarVehicleInUseTabProps) => {
  const receiveCarVehicleModalRef = useRef<{
    openModal: () => void;
    closeModal: () => void;
  } | null>(null);
  const returnCarAddStep2ModalRef = useRef<{
    openModal: () => void;
    closeModal: () => void;
  } | null>(null);
  const [receiveSuccess, setReceiveSuccess] = useState(true);
  const [requestData, setRequestData] = useState<RequestDetailType>();
  const [showToast, setShowToast] = useState(false);

  const fetchRequestDetailfunc = async () => {
    if (requestId) {
      try {
        let response;
        if (role === "admin") {
          response = await fetchRequestDetail(requestId);
        } else {
          response = await fetchRequestKeyDetail(requestId);
        }

        console.log("data---", response.data);
        setRequestData(response.data);
      } catch (error) {
        console.error("Error fetching vehicle details:", error);
      }
    }
  };

  const handleSubmit = async () => {
    receiveCarVehicleModalRef.current?.closeModal();
    returnCarAddStep2ModalRef.current?.closeModal();
    fetchRequestDetailfunc();
    setShowToast(true);
  }

  useEffect(() => {
    fetchRequestDetailfunc();
  }, [requestId]);

  return (
    <div className="grid md:grid-cols-2 gird-cols-1 gap-4">
      {showToast && (
  <ToastCustom
    title="แก้ไขข้อมูลสำเร็จ"
    desc={
      <>
        แก้ไขข้อมูลการรับยานพาหนะคำขอเลขที่ 
        <br />
        {requestData?.request_no} เรียบร้อยแล้ว
      </>
    }
    status="success"
  />
)}
      <div className="w-full row-start-2 md:col-start-1 flex flex-col gap-4">
        {receiveSuccess && displayOn !== "vehicle-in-use" && (
          <>
            <div className="form-section">
              <div className="form-section-header">
                <div className="form-section-header-title">
                  <p>ข้อมูลการรับยานพาหนะ</p>
                </div>
                {edit === "edit" && (
                  <div className="form-section-header-actions">
                    <button
                      className="btn bg-transparent border-none shadow-none hover:bg-transparent text-[#A80689]"
                      onClick={() =>
                        returnCarAddStep2ModalRef.current?.openModal()
                      }
                    >
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
                        <i className="material-symbols-outlined">
                          calendar_month
                        </i>
                        <div className="form-plaintext-group">
                          <div className="form-label">วันที่</div>
                          <div className="form-text">
                            {
                              convertToBuddhistDateTime(
                                requestData?.pickup_datetime || ""
                              ).date
                            }
                          </div>
                        </div>
                      </div>
                    </div>
                    <div>
                      <div className="form-group form-plaintext">
                        <i className="material-symbols-outlined">schedule</i>
                        <div className="form-plaintext-group">
                          <div className="form-label">เวลา</div>
                          <div className="form-text">
                            {
                              convertToBuddhistDateTime(
                                requestData?.pickup_datetime || ""
                              ).time
                            }
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2">
                    <div>
                      <div className="form-group form-plaintext">
                        <i className="material-symbols-outlined">
                          search_activity
                        </i>
                        <div className="form-plaintext-group">
                          <div className="form-label">เลขไมล์</div>
                          <div className="form-text">
                            {requestData?.mile_start}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div>
                      <div className="form-group form-plaintext">
                        <i className="material-symbols-outlined">
                          local_gas_station
                        </i>
                        <div className="form-plaintext-group">
                          <div className="form-label">ปริมาณเชื้อเพลิง</div>
                          <div className="form-text">
                            {requestData?.fuel_start}
                          </div>
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
                          <div className="form-text">
                            {requestData?.received_vehicle_remark}
                          </div>
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
                    <button
                      className="btn bg-transparent border-none shadow-none hover:bg-transparent text-[#A80689]"
                      onClick={() =>
                        returnCarAddStep2ModalRef.current?.openModal()
                      }
                    >
                      แก้ไข
                    </button>
                  </div>
                )}
              </div>

              <ImagesCarCard
                  images={
                    requestData?.vehicle_images_received?.map(
                      (image) => image.vehicle_img_file || ""
                    ) || []
                  }
                />
            </div>
          </>
        )}
        {displayOn !== "admin" && (
          <div className="">
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
                      {displayOn === "vehicle-in-use" ? (
                        <div className="form-group form-plaintext">
                          <i className="material-symbols-outlined">
                            local_parking
                          </i>
                          <div className="form-text">
                            {requestData?.pickup_place}
                          </div>
                        </div>
                      ) : (
                        <div className="form-group form-plaintext">
                          <i className="material-symbols-outlined">
                            calendar_month
                          </i>
                          <div className="form-plaintext-group">
                            <div className="form-label">วันที่และเวลา</div>
                            <div className="form-text">01/01/2567 08:30</div>
                          </div>
                        </div>
                      )}
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

              {displayOn === "vehicle-in-use" ? (
                <DriverPassengerPeaInfoCard
                  id={requestData?.vehicle_user_emp_id || ""}
                  requestData={requestData}
                />
              ) : (
                <UserInfoCard UserType="outsource" displayBtnMore={true} />
              )}
            </div>
          </div>
        )}
        {displayOn !== "admin" && (
          <button
            className="btn btn-primary w-full"
            onClick={() => receiveCarVehicleModalRef.current?.openModal()}
          >
            รับยานพาหนะ
          </button>
        )}
      </div>

      <div className="col-span-1 row-start-1 md:row-start-2">
        <div className="form-section">
          <div className="form-section-header">
            <div className="form-section-header-title">ข้อมูลยานพาหนะ</div>
          </div>

          <CarDetailCard2
            reqId={requestData?.trn_request_uid}
            vehicle={requestData?.vehicle}
          />
        </div>
      </div>

      <ReceiveCarVehicleModal
       onSubmit={handleSubmit}
        status={edit}
        ref={receiveCarVehicleModalRef}
        requestData={requestData}
        role={role}
      />
      <ReturnEditCarModal
        previewImages={requestData?.vehicle_images_received}
        requestData={requestData}
        status="edit"
        useBy="admin"
        reqId={requestData?.trn_request_uid}
        onSubmit={handleSubmit}
        ref={returnCarAddStep2ModalRef}
      />
    </div>
  );
};

export default ReceiveCarVehicleInUseTab;
