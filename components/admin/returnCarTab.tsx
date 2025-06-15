import { RequestDetailType } from "@/app/types/request-detail-type";
import ReturnEditCarModal from "@/components/admin/modals/returnEditCarModal";
import ReturnInsCarModal from "@/components/admin/modals/returnInsCarModal";
import ReviewCarDriveDetailModal from "@/components/admin/modals/reviewCarDriverDetailModal";
import AlertCustom from "@/components/alertCustom";
import CarDetailInsCard from "@/components/card/carDetailInsCard";
import DriverPassengerPeaInfoCard from "@/components/card/driverPassengerPeaInfoCard";
import DriverWithRatingCard from "@/components/card/driverWithRatingCard";
import ImagesCarCard from "@/components/card/ImagesCarCard";
import { ReturnCarInfoCard } from "@/components/card/returnCarInfoCard";
import ReturnCarAddModal from "@/components/modal/returnCarAddModal";
import ReturnCarAddStep2Modal from "@/components/modal/returnCarAddStep2Modal";
import ReturnCarInfoEditModal from "@/components/modal/returnCarInfoEditModal";
import ReviewCarDriveModal from "@/components/modal/reviewCarDriveModal";
import ToastCustom from "@/components/toastCustom";
import { convertToBuddhistDateTime } from "@/utils/converToBuddhistDateTime";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

interface ReturnCarTabProps {
  status?: string;
  useBy?: string;
  displayOn?: string;
  requestData?: RequestDetailType;
  reloadRequestData?: () => void; // <-- add this
}

const ReturnCarTab = ({
  status,
  displayOn,
  requestData,
  useBy,
  reloadRequestData,
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

  const returnInsCarModalRef = useRef<{
    openModal: () => void;
    closeModal: () => void;
  } | null>(null);

  const isReturnFail = [
    "เดินทาง",
    "ตีกลับยานพาหนะ",
    "คืนยานพาหนะไม่สำเร็จ",
  ].includes(requestData?.ref_request_status_name || "");
  const [showToast, setShowToast] = useState(false);
  const [showInfoToast, setShowInfoToast] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  const handleSubmit = async () => {
    returnEditCarModalRef.current?.closeModal();
    setShowToast(true);
    if (reloadRequestData) {
      await reloadRequestData(); // <-- reload data
    }
  };

  const handleInfoSubmit = async () => {
    returnCarInfoEditModalRef.current?.closeModal();
    setShowInfoToast(true);
  };

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

      {isLoading ? (
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
      ) : (
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
                  </div>
                )}
              </div>

              <ReturnCarInfoCard data={requestData} />
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
                    <button
                      className="btn bg-transparent border-none shadow-none hover:bg-transparent text-[#A80689]"
                      onClick={() =>
                        useBy === "admin"
                          ? returnEditCarModalRef.current?.openModal()
                          : returnCarAddStep2ModalRef.current?.openModal()
                      }
                    >
                      แก้ไข
                    </button>
                  </div>
                )}
              </div>

              <ImagesCarCard
                images={
                  requestData?.vehicle_images_returned
                    ? requestData?.vehicle_images_returned?.map(
                        (e) => e.vehicle_img_file || ""
                      )
                    : []
                }
              />
            </div>

            {displayOn === "adminTab" && (
              <div className="form-section">
                <div className="page-section-header border-0">
                  <div className="page-header-left">
                    <div className="page-title">
                      <span className="page-title-label">
                        การตรวจสอบสภาพยานพาหนะหลังส่งคืน
                      </span>
                    </div>
                    <div className="page-desc">
                      กรณีตรวจสอบพบสิ่งผิดปกติ รอยเสียหาย
                      หรือยานพาหนะไม่พร้อมสำหรับการเดินทางถัดไป เช่น
                      ห้องโดยสารไม่สะอาด ไม่ได้เติมน้ำมันก่อนส่งคืน
                      คุณสามารถเพิ่มรูปภาพเพื่อเป็นหลักฐานได้ที่นี่
                    </div>
                  </div>
                  <div className="page-header-right">
                    <button
                      className="btn bg-transparent border-none shadow-none hover:bg-transparent text-[#A80689] whitespace-nowrap"
                      onClick={() => returnInsCarModalRef.current?.openModal()}
                    >
                      {(requestData?.vehicle_image_inspect?.length ?? 0) > 0
                        ? "แก้ไข"
                        : "เพิ่มรูปภาพ"}
                    </button>
                  </div>
                </div>

                <ImagesCarCard
                  images={
                    requestData?.vehicle_image_inspect
                      ? requestData?.vehicle_image_inspect?.map(
                          (e) => e.vehicle_img_file || ""
                        )
                      : []
                  }
                />
              </div>
            )}
          </div>

          {displayOn === "userTabs" ? (
            <div className="form-section">
              <div className="form-section-header">
                <div className="form-section-header-title">
                  <p>ผู้ดูแลยานพาหนะ</p>
                </div>
              </div>

              <DriverPassengerPeaInfoCard
                id={requestData?.vehicle_user_emp_id || ""}
                requestData={requestData}
              />
            </div>
          ) : (
            <div className="row-start-2 md:row-start-1 md:col-start-2 flex flex-col gap-4">
              <div className="form-section">
                <div className="form-section-header-title mb-3 font-semibold">
                  ภาพรวมการใช้งาน
                </div>
                <CarDetailInsCard requestData={requestData} />
              </div>

              <div className="form-section">
                {requestData?.is_pea_employee_driver === "1" ? (
                  <DriverPassengerPeaInfoCard
                    id={requestData?.vehicle_user_emp_id || ""}
                    requestData={requestData}
                  />
                ) : (
                  <>
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

              <div className="form-section !mt-0">
                <div className="form-section-header items-center">
                  <div className="form-section-header-title">
                    <p>การเดินทางถัดไป</p>
                  </div>
                  <Link
                    href={
                      "/administrator/vehicle-in-use/" +
                      requestData?.next_request?.trn_request_uid
                    }
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
                              <i className="material-symbols-outlined">
                                person
                              </i>
                              <span>
                                {requestData?.next_request
                                  ?.vehicle_user_emp_name || "-"}
                                {requestData?.next_request
                                  ?.vehicle_user_position
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
            </div>
          )}

          {isReturnFail && (
            <div className="w-full md:col-span-2">
              <button
                className="btn btn-primary w-full"
                onClick={() => {
                  returnCarAddModalRef.current?.openModal();
                }}
              >
                คืนยานพาหนะอีกครั้ง
              </button>
            </div>
          )}
        </div>
      )}

      {/* Modals */}
      <ReviewCarDriveModal
        displayOn={displayOn}
        ref={reviewCarDriveModalRef}
        id={requestData?.trn_request_uid}
      />
      <ReviewCarDriveDetailModal
        ref={reviewCarDriveDetailModalRef}
        id={requestData?.trn_request_uid}
        role={"user"}
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
      <ReturnInsCarModal
        title="การตรวจสอบสภาพยานพาหนะหลังส่งคืน"
        useBy={useBy}
        ref={returnInsCarModalRef}
        previewImages={requestData?.vehicle_image_inspect}
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
