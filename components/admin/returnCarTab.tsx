import { RequestDetailType } from "@/app/types/request-detail-type";
import AlertCustom from "@/components/alertCustom";
import ImagesCarCard from "@/components/card/ImagesCarCard";
import CarDetailCard from "@/components/card/carDetailCard";
import { ReturnCarInfoCard } from "@/components/card/returnCarInfoCard";
import ReturnCarAddModal from "@/components/modal/returnCarAddModal";
import ReturnCarAddStep2Modal from "@/components/modal/returnCarAddStep2Modal";
import { useEffect, useRef, useState } from "react";
import DriverPassengerPeaInfoCard from "../card/driverPassengerPeaInfoCard";
import ReviewCarDriveModal from "../modal/reviewCarDriveModal";
import ReturnEditCarModal from "@/components/admin/modals/returnEditCarModal";
import ToastCustom from "../toastCustom";
import ReturnCarInfoEditModal from "../modal/returnCarInfoEditModal";
import Link from "next/link";
import ReviewCarDriveDetailModal from "./modals/reviewCarDriverDetailModal";
import DriverWithRatingCard from "@/components/card/driverWithRatingCard";
import Image from "next/image";
import { convertToBuddhistDateTime } from "@/utils/converToBuddhistDateTime";

interface ReturnCarTabProps {
  status?: string;
  useBy?: string;
  displayOn?: string;
  requestData?: RequestDetailType;
}

const ReturnCarTab = ({
  status,
  displayOn,
  requestData,
  useBy,
}: ReturnCarTabProps) => {
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

  const returnCarEditDataModalRef = useRef<{
    openModal: () => void;
    closeModal: () => void;
  } | null>(null);

  const returnEditCarModalRef = useRef<{
    openModal: () => void;
    closeModal: () => void;
  } | null>(null);

  const returnCarInfoEditModalRef = useRef<{
    openModal: () => void;
    closeModal: () => void;
  } | null>(null);

  const reviewCarDriveDetailModalRef = useRef<{
    openModal: () => void;
    closeModal: () => void;
  } | null>(null);

  const isReturnFail = ["เดินทาง", "ตีกลับยานพาหนะ"].includes(
    requestData?.ref_request_status_name || ""
  );
  const [showToast, setShowToast] = useState(false);
  const [showInfoToast, setShowInfoToast] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate data loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  const handleSubmit = async () => {
    returnEditCarModalRef.current?.closeModal();
    setShowToast(true);
  };

  const handleInfoSubmit = async () => {
    returnCarInfoEditModalRef.current?.closeModal();
    setShowInfoToast(true);
  };

  const InfoCarddiv = () => (
    <div className="skeleton space-y-4 p-4 rounded-lg shadow">
      <div className="h-6 w-3/4" />
      <div className="h-4 w-full" />
      <div className="h-4 w-2/3" />
      <div className="h-4 w-1/2" />
    </div>
  );

  const Imagesdiv = () => (
    <div className="skeleton grid grid-cols-2 gap-4 p-4 rounded-lg shadow">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="h-32 w-full rounded-lg" />
      ))}
    </div>
  );

  const UserCarddiv = () => (
    <div className="skeleton space-y-4 p-4 rounded-lg shadow">
      <div className="flex items-center space-x-4">
        <div className="h-12 w-12 rounded-full" />
        <div className="space-y-2">
          <div className="h-4 w-[200px]" />
          <div className="h-4 w-[150px]" />
        </div>
      </div>
      <div className="space-y-2">
        <div className="h-4 w-full" />
        <div className="h-4 w-3/4" />
      </div>
    </div>
  );

  const CarDetaildiv = () => (
    <div className="skeleton space-y-4 p-4 rounded-lg shadow">
      <div className="h-6 w-1/2 mb-4" />
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <div className="h-4 w-3/4" />
          <div className="h-4 w-1/2" />
          <div className="h-4 w-3/4" />
        </div>
        <div className="space-y-2">
          <div className="h-4 w-3/4" />
          <div className="h-4 w-1/2" />
          <div className="h-4 w-3/4" />
        </div>
      </div>
      <div className="h-4 w-full mt-4" />
    </div>
  );

  const Buttondiv = () => <div className="skeleton h-10 w-full rounded-lg" />;

  return (
    <>
      {(status == "returnFail" &&
        requestData?.ref_request_status_code === "71") ||
        (requestData?.ref_request_status_name === "ตีกลับยานพาหนะ" && (
          <AlertCustom
            title="ถูกตีกลับโดยผู้ดูแลยานพาหนะ"
            desc="เหตุผล: ยานพาหนะไม่สะอาด"
          />
        ))}
      {showToast && (
        <ToastCustom
          title="แก้ไขรูปภาพสำเร็จ"
          desc={
            <>
              แก้ไขรูปยานพาหนะหลังเดินทางคำขอเลขที่
              <br />
              {requestData?.request_no} เรียบร้อยแล้ว
            </>
          }
          status="success"
        />
      )}

      {showInfoToast && (
        <ToastCustom
          title="แก้ไขข้อมูลสำเร็จ"
          desc={
            <>
              แก้ไขข้อมูลการคืนยานพาหนะคำขอเลขที่
              <br />
              {requestData?.request_no} เรียบร้อยแล้ว
            </>
          }
          status="success"
        />
      )}

      <div className="grid md:grid-cols-2 gird-cols-1 gap-4 relative">
        <div className="row-start-1 md:col-start-1">
          <div className="form-section">
            <div className="form-section-header">
              <div className="form-section-header-title">
                <p>ข้อมูลการคืนยานพาหนะ</p>
              </div>
              {(status === "returnFail" ||
                displayOn === "adminTab" ||
                (displayOn === "userTabs" && isReturnFail)) && (
                <div className="form-section-header-actions">
                  {isLoading ? (
                    <div className="h-6 w-16" />
                  ) : (
                    <button
                      className="btn bg-transparent border-none shadow-none hover:bg-transparent text-[#A80689]"
                      onClick={() =>
                        useBy === "admin"
                          ? returnCarInfoEditModalRef.current?.openModal()
                          : returnCarEditDataModalRef.current?.openModal()
                      }
                    >
                      แก้ไข
                    </button>
                  )}
                </div>
              )}
            </div>

            {isLoading ? (
              <InfoCarddiv />
            ) : (
              <ReturnCarInfoCard data={requestData} />
            )}
          </div>

          <div className="form-section mt-4">
            <div className="form-section-header">
              <div className="form-section-header-title">
                <p>รูปยานพาหนะหลังเดินทาง</p>
              </div>
              {(status === "returnFail" ||
                displayOn === "adminTab" ||
                (displayOn === "userTabs" && isReturnFail)) && (
                <div className="form-section-header-actions">
                  {isLoading ? (
                    <div className="h-6 w-16" />
                  ) : (
                    <button
                      className="btn bg-transparent border-none shadow-none hover:bg-transparent text-[#A80689]"
                      onClick={() =>
                        useBy === "admin"
                          ? returnEditCarModalRef.current?.openModal()
                          : returnCarEditDataModalRef.current?.openModal()
                      }
                    >
                      แก้ไข
                    </button>
                  )}
                </div>
              )}
            </div>

            {isLoading ? (
              <Imagesdiv />
            ) : (
              <ImagesCarCard
                images={
                  requestData?.vehicle_images_returned
                    ? requestData?.vehicle_images_returned?.map(
                        (e) => e.vehicle_img_file || ""
                      )
                    : []
                }
              />
            )}
          </div>
        </div>

        {displayOn === "userTabs" ? (
          <div className="form-section">
            <div className="form-section-header">
              <div className="form-section-header-title">
                <p>ผู้ดูแลยานพาหนะ</p>
              </div>
            </div>

            {isLoading ? (
              <UserCarddiv />
            ) : (
              <DriverPassengerPeaInfoCard
                id={requestData?.vehicle_user_emp_id || ""}
                requestData={requestData}
              />
            )}
          </div>
        ) : (
          <div className="row-start-2 md:row-start-1 md:col-start-2 flex flex-col gap-4">
            {isLoading ? (
              <CarDetaildiv />
            ) : (
              <CarDetailCard vehicle={requestData?.vehicle} />
            )}

            {isLoading ? (
              <UserCarddiv />
            ) : (
              <div className="form-section">
                {isLoading ? (
                  <UserCarddiv />
                ) : requestData?.is_pea_employee_driver === "1" ? (
                  <DriverPassengerPeaInfoCard
                    id={requestData?.vehicle_user_emp_id || ""}
                    requestData={requestData}
                  />
                ) : (
                  <>
                    {" "}
                    <div className="form-section-header items-center">
                      <div className="form-section-header-title">
                        <p>คะแนนการให้บริการ</p>
                      </div>
                      <Link
                        href="#"
                        onClick={() =>
                          reviewCarDriveDetailModalRef.current?.openModal()
                        }
                        className="text-brand-900 text-sm font-semibold"
                      >
                        ดูคะแนนการให้บริการ
                      </Link>
                    </div>
                    <DriverWithRatingCard requestData={requestData} />
                  </>
                )}
              </div>
            )}
              {isLoading ? <div className="skeleton h-40"></div> : 
            <div className="form-section !mt-0">
              <div className="form-section-header items-center">
                <div className="form-section-header-title">
                  <p>การเดินทางถัดไป</p>
                </div>
                <Link
                  href={'/administrator/vehicle-in-use/'+requestData?.next_request?.trn_request_uid}
                  className="text-brand-900 text-sm font-semibold"
                >
                  ดูรายละเอียด
                </Link>
              </div>
              <div className="card">
                <div className="card-body">
                  <div className="card-body-inline">
                    <div className="img img-square img-avatar flex-grow-1 align-self-start">
                      <Image
                        src="/assets/img/graphic/status_key_pickup.png"
                        className="rounded-md"
                        width={100}
                        height={100}
                        alt="status"
                      />
                    </div>
                    <div className="space-y-1">
                      <p className="text-base font-semibold mb-0">
                        {requestData?.next_request?.ref_request_status_name ||
                          "สถานะไม่ระบุ"}
                      </p>
                      <p className="text-sm font-semibold text-color-secondary">
                        {requestData?.next_request?.vehicle_user_dept_sap ||
                          "-"}
                      </p>
                      <div className="text-xs text-color-secondary">
                        <p className="mb-1">
                          {convertToBuddhistDateTime(
                            requestData?.next_request?.start_datetime || ""
                          ).date +
                            " - " +
                            convertToBuddhistDateTime(
                              requestData?.next_request?.end_datetime || ""
                            ).date}{" "}
                          |{" "}
                          {convertToBuddhistDateTime(
                            requestData?.next_request?.start_datetime || ""
                          ).time +
                            " - " +
                            convertToBuddhistDateTime(
                              requestData?.next_request?.end_datetime || ""
                            ).time}
                        </p>
                        <div className="flex items-center gap-2">
                          <div className="flex items-center gap-1">
                            <i className="material-symbols-outlined">
                              directions_car
                            </i>
                            <span>
                              {requestData?.next_request
                                ?.vehicle_license_plate || "-"}
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <i className="material-symbols-outlined">person</i>
                            <span>
                              {requestData?.next_request
                                ?.vehicle_user_emp_name || "-"}
                              {requestData?.next_request?.vehicle_user_position
                                ? ` (${requestData.next_request.vehicle_user_position})`
                                : ""}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="form-card-body form-card-inline">
                    <div className="form-card-title text-sm font-semibold mb-3">
                      ผู้ใช้ยานพาหนะ
                    </div>
                    <div className="card !bg-surface-secondary-subtle mb-3 !border-0 shadow-none outline-none">
                      <div className="card-body border-0 shadow-none outline-none">
                        <div className="flex items-center gap-5 justify-between">
                          <div className="card-content">
                            <div className="card-content-top">
                              <div className="card-title !text-sm">
                                {requestData?.next_request
                                  ?.vehicle_user_emp_name || "-"}
                              </div>
                              <div className="supporting-text-group">
                                <div className="supporting-text !text-xs">
                                  {requestData?.next_request
                                    ?.vehicle_user_dept_name_full || "-"}
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="card-content">
                            <div className="flex gap-3">
                              <div className="flex items-center gap-4">
                                <i className="material-symbols-outlined text-brand-900 w-[13px]">
                                  smartphone
                                </i>
                                <span className="card-item-text text-xs">
                                  {requestData?.next_request
                                    ?.car_user_mobile_contact_number || "-"}
                                </span>
                              </div>
                              <div className="flex items-center gap-4">
                                <i className="material-symbols-outlined text-brand-900 w-[13px]">
                                  call
                                </i>
                                <span className="card-item-text text-xs">
                                  {requestData?.next_request
                                    ?.car_user_internal_contact_number || "-"}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
            </div>
}
            
          </div>
        )}

        {isReturnFail && (
          <div className="w-full md:col-span-2">
            {isLoading ? (
              <Buttondiv />
            ) : (
              <button
                className="btn btn-primary w-full"
                onClick={() => {
                  returnCarAddModalRef.current?.openModal();
                }}
              >
                คืนยานพาหนะอีกครั้ง
              </button>
            )}
          </div>
        )}
      </div>

      {/* Modals */}
      <ReviewCarDriveModal
        displayOn={displayOn}
        ref={reviewCarDriveModalRef}
        id={requestData?.trn_request_uid}
      />
      <ReviewCarDriveDetailModal
        ref={reviewCarDriveDetailModalRef}
        id={requestData?.trn_request_uid}
      />
      <ReturnCarAddModal
        useBy={useBy}
        ref={returnCarAddModalRef}
        requestData={requestData}
      />
      <ReturnCarAddModal
        useBy={useBy}
        ref={returnCarEditDataModalRef}
        requestData={requestData}
        edit
      />
      <ReturnCarInfoEditModal
        ref={returnCarInfoEditModalRef}
        requestData={requestData}
        onSubmit={handleInfoSubmit}
      />
      <ReturnEditCarModal
        title="แก้ไขรูปยานพาหนะหลังเดินทาง"
        useBy={useBy}
        ref={returnEditCarModalRef}
        previewImages={requestData?.vehicle_images_returned}
        requestData={requestData}
        onSubmit={handleSubmit}
        status="edit"
      />
      <ReturnCarAddStep2Modal
        useBy={useBy}
        openStep1={() => () => {}}
        ref={returnCarAddStep2ModalRef}
        requestData={requestData}
        edit
        status="edit"
      />
    </>
  );
};

export default ReturnCarTab;
