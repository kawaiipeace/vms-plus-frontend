"use client";
import { RequestDetailType } from "@/app/types/request-detail-type";
import ReturnEditCarModal from "@/components/admin/modals/returnEditCarModal";
import ImagesCarCard from "@/components/card/ImagesCarCard";
import UserInfoCard from "@/components/card/userInfoCard";
import ReceiveCarVehicleModal from "@/components/modal/receiveCarVehicleModal";
import { fetchRequestDetail } from "@/services/keyAdmin";
import { fetchRequestKeyDetail } from "@/services/masterService";
import { convertToBuddhistDateTime } from "@/utils/converToBuddhistDateTime";
import { useEffect, useRef, useState } from "react";
import DriverPassengerPeaInfoCard from "../card/driverPassengerPeaInfoCard";
import VehicleDetailCard from "../card/vehicleDetailCard";
import ToastCustom from "../toastCustom";

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
  const [receiveSuccess] = useState(true);
  const [requestData, setRequestData] = useState<RequestDetailType>();
  const [showToast, setShowToast] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchRequestDetailfunc = async () => {
    if (requestId) {
      try {
        setLoading(true);
        let response;
        if (role === "admin") {
          response = await fetchRequestDetail(requestId);
        } else {
          response = await fetchRequestKeyDetail(requestId);
        }

        setRequestData(response.data);
        const timer = setTimeout(() => {
          setLoading(false);
        }, 1500);
        return () => clearTimeout(timer);
      } catch (error) {
        console.error("Error fetching vehicle details:", error);
        const timer = setTimeout(() => {
          setLoading(false);
        }, 1500);
        return () => clearTimeout(timer);
      }
    }
  };

  const handleSubmit = async () => {
    receiveCarVehicleModalRef.current?.closeModal();
    returnCarAddStep2ModalRef.current?.closeModal();
    fetchRequestDetailfunc();
    setShowToast(true);
  };

  useEffect(() => {
    fetchRequestDetailfunc();
  }, [requestId]);

  if (loading)
    return (
      <div className="flex justify-center items-center h-[calc(100vh-40vh)]">
        <svg
          aria-hidden="true"
          className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-[#A80689]"
          viewBox="0 0 100 101"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
            fill="currentColor"
          />
          <path
            d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
            fill="currentFill"
          />
        </svg>
      </div>
    );

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
                        receiveCarVehicleModalRef.current?.openModal()
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
                            {requestData?.pickup_datetime ===
                            "0001-01-01T00:00:00Z"
                              ? "-"
                              : convertToBuddhistDateTime(
                                  requestData?.pickup_datetime || ""
                                ).date}
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
            {(requestData?.vehicle_images_received?.length || 0) > 0 && (
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
            )}
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
                            {requestData?.parking_place}
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
        {(requestData?.ref_request_status_name === "รอรับยานพาหนะ" ||
          requestData?.ref_request_status_name === "ตีกลับยานพาหนะ") &&
          displayOn !== "admin" && (
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

          <VehicleDetailCard requestData={requestData} />
        </div>
      </div>

      <ReceiveCarVehicleModal
        onSubmit={edit ? handleSubmit : undefined}
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
