"use client";
import { RequestAnnualDriver } from "@/app/types/driver-lic-list-type";
import { UploadFileType } from "@/app/types/upload-type";
import {
  DriverLicenseCardType,
  VehicleUserType,
} from "@/app/types/vehicle-user-type";
import { useToast } from "@/contexts/toast-context";
import { createAnnualLic, resendLicenseAnnual } from "@/services/driver";
import {
  fetchUserApprovalLic,
  fetchUserConfirmerLic,
} from "@/services/masterService";
import { convertToISO } from "@/utils/convertToISO";
import useSwipeDown from "@/utils/swipeDown";
import dayjs from "dayjs";
import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import ApproverInfoCard from "./ApproverInfoCard";
import EditApproverModal from "./editApproverModal";
import EditFinalApproverModal from "./editFinalApproverModal";
import { useProfile } from "@/contexts/profileContext";

interface ValueFormStep1 {
  driverLicenseType: { value: string; label: string; desc?: string } | null;
  year: string;
  licenseNumber: string;
  licenseExpiryDate: string;
  licenseImages: UploadFileType[];
  courseName?: string;
  certificateNumber?: string;
  vehicleType?: { value: string; label: string; desc?: string } | null;
  trainingDate?: string;
  trainingEndDate?: string;
  certificateImages?: UploadFileType[];
}

interface ReturnCarAddStep2ModalProps {
  openStep1: () => void;
  status?: string;
  editable?: boolean;
  valueFormStep1?: ValueFormStep1;
  requestData?: RequestAnnualDriver;
  driverData?: DriverLicenseCardType;
  clearForm?: () => void;
  onSubmit?: () => void;
  onBack?: () => void;
  edit?: boolean;
  onTrackStatus?: (id: string) => void;
}

const RequestDrivingStepTwoModal = forwardRef<
  { openModal: () => void; closeModal: () => void },
  ReturnCarAddStep2ModalProps
>(
  (
    {
      valueFormStep1,
      requestData,
      driverData,
      editable,
      onTrackStatus,
      clearForm,
      onSubmit,
      onBack,
    },
    ref
  ) => {
    const modalRef = useRef<HTMLDialogElement>(null);
    const editApproverModalRef = useRef<{
      openModal: () => void;
      closeModal: () => void;
    } | null>(null);
    const editFinalApproverModalRef = useRef<{
      openModal: () => void;
      closeModal: () => void;
    } | null>(null);

    const [approvers, setApprovers] = useState<VehicleUserType>();
    const [finalApprovers, setFinalApprovers] = useState<VehicleUserType>();
    const [isLoading, setIsLoading] = useState(false);
    const { profile } = useProfile();
    const currentBuddhistYear = dayjs().year() + 543;

    const { showToast } = useToast();

    useImperativeHandle(ref, () => ({
      openModal: () => {
        modalRef.current?.showModal();
        fetchApproversData(); // Fetch data when modal opens
      },
      closeModal: () => modalRef.current?.close(),
    }));

    const fetchApproversData = async () => {
      setIsLoading(true);
      try {
        const [confirmerResponse, approvalResponse] = await Promise.all([
          fetchUserConfirmerLic(profile?.emp_id || ""),
          fetchUserApprovalLic(profile?.emp_id || ""),
        ]);

        if (confirmerResponse?.data) {
          setApprovers(confirmerResponse.data[0]);
        }
        if (approvalResponse?.data) {
          setFinalApprovers(approvalResponse.data[0]);
        }
      } catch (error) {
        console.error("Error fetching approvers:", error);
      } finally {
        setIsLoading(false);
      }
    };

    useEffect(() => {
  
      if (requestData) {
        setApprovers({
          emp_id: requestData?.confirmed_request_emp_id || "",
          full_name: requestData?.confirmed_request_emp_name || "",
          image_url: requestData?.confirmed_request_image_url || "",
          dept_sap_short: requestData?.confirmed_request_dept_sap_short || "",
          tel_mobile: requestData?.confirmed_request_mobile_number || "",
          tel_internal: requestData?.confirmed_request_phone_number || "",
        });

        setFinalApprovers({
          emp_id: requestData?.approved_request_emp_id || "",
          full_name: requestData?.approved_request_emp_name || "",
          image_url: requestData?.approved_request_image_url || "",
          dept_sap_short: requestData?.approved_request_dept_sap_short || "",
          tel_mobile: requestData?.approved_request_mobile_number || "",
          tel_internal: requestData?.approved_request_phone_number || "",
        });
      }
    }, [requestData]);

    const handleApproverUpdate = (updatedApprover: VehicleUserType) => {
      setApprovers(updatedApprover);
    };

    const handleFinalApproverUpdate = (updatedApprover: VehicleUserType) => {
      setFinalApprovers(updatedApprover);
    };

    const handleSubmit = async () => {
      try {
        const basePayload: any = {
          annual_yyyy: Number(valueFormStep1?.year),
          approved_request_emp_id: finalApprovers?.emp_id,
          confirmed_request_emp_id: approvers?.emp_id,
          driver_license_expire_date: valueFormStep1?.licenseExpiryDate,
          driver_license_img: valueFormStep1?.licenseImages[0].file_url,
          driver_license_no: valueFormStep1?.licenseNumber,
          ref_driver_license_type_code:
            valueFormStep1?.driverLicenseType?.value,
        };

        if (
          valueFormStep1?.driverLicenseType?.value === "2+" ||
          valueFormStep1?.driverLicenseType?.value === "3+"
        ) {
          if (valueFormStep1?.trainingEndDate) {
            basePayload.driver_certificate_expire_date = valueFormStep1.trainingEndDate
          }

          if (valueFormStep1?.certificateImages?.length) {
            basePayload.driver_certificate_img =
              valueFormStep1.certificateImages[0].file_url;
          }

          if (valueFormStep1?.trainingDate) {
            basePayload.driver_certificate_issue_date = convertToISO(
              String(valueFormStep1.trainingDate),
              "00:00"
            );
          }

          if (valueFormStep1?.courseName) {
            basePayload.driver_certificate_name = valueFormStep1.courseName;
          }

          if (valueFormStep1?.certificateNumber) {
            basePayload.driver_certificate_no =
              valueFormStep1.certificateNumber;
          }

          if (valueFormStep1?.vehicleType?.value) {
            basePayload.driver_certificate_type_code = Number(
              valueFormStep1.vehicleType.value
            );
          }
        }

        let response;
        let responseType;
        if (editable) {
          const id =
            driverData?.license_status !== "อนุมัติแล้ว"
              ? driverData?.trn_request_annual_driver_uid
              : driverData?.next_trn_request_annual_driver_uid;

          response = await resendLicenseAnnual(id || "", basePayload);
          responseType = "resend";
        } else {
          response = await createAnnualLic(basePayload);
          responseType = "create";
        }

        if (response) {
          showToast({
            title:
              responseType === "create" ? "สร้างคำขอสำเร็จ" : "แก้ไขสำเร็จ",
            desc: (
              <>
                {responseType === "create"
                  ? "สร้างคำขออนุมัติ"
                  : "ตีกลับคำขออนุมัติ"}
                ทำหน้าที่ขับรถยนต์ประจำปี <br />
                เลขที่ {response?.data?.result?.request_annual_driver_no}{" "}
                เรียบร้อยแล้ว <br />
                {responseType === "create" && (
                  <button
                    className="text-brand-900 font-semibold"
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (onTrackStatus) {
                        onTrackStatus(
                          response?.data?.result?.trn_request_annual_driver_uid
                        );
                      }
                    }}
                  >
                    ติดตามสถานะ
                  </button>
                )}
              </>
            ),
            status: "success",
          });

          modalRef.current?.close();
        }
      } catch (error) {
        console.error("Submission error:", error);
      }
    };

    const swipeDownHandlers = useSwipeDown(() => modalRef.current?.close());

    return (
      <>
        <dialog ref={modalRef} className={`modal modal-middle`}>
          <div className="modal-box max-w-[600px] p-0 relative overflow-hidden flex flex-col">
            <form className="flex flex-col h-full">
              <div className="bottom-sheet" {...swipeDownHandlers}>
                <div className="bottom-sheet-icon"></div>
              </div>
              <div className="modal-header bg-white sticky top-0 flex justify-between z-10">
                <div className="modal-title items-center flex">
                  {onBack && (
                    <i
                      className="material-symbols-outlined cursor-pointer"
                      onClick={() => {
                        if (onBack) {
                          onBack();
                        }
                      }}
                    >
                      keyboard_arrow_left
                    </i>
                  )}
                  ขออนุมัติทำหน้าที่ขับรถยนต์ประจำปี{" "}
                     {driverData?.license_status === "อนุมัติแล้ว" &&
                  driverData &&
                  driverData.next_annual_yyyy !== currentBuddhistYear && (
                    <div className="ml-1">
                      {" "}
                      {" " + driverData?.next_annual_yyyy || ""}
                    </div>
                  )}
                  {((driverData &&
                    driverData.annual_yyyy !== currentBuddhistYear &&
                    driverData.annual_yyyy !== 0) ||
                    (!driverData &&
                      requestData?.annual_yyyy !== currentBuddhistYear &&
                      requestData?.annual_yyyy !== 0)) && (
                    <div>
                      {driverData
                        ? driverData.annual_yyyy
                        : requestData?.annual_yyyy}
                    </div>
                  )}
                </div>
                <button
                  className="close btn btn-icon border-none bg-transparent shadow-none btn-tertiary"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    modalRef.current?.close();
                  }}
                >
                  <i className="material-symbols-outlined">close</i>
                </button>
              </div>

              {/* Modal body scrollable and flex-grow */}
              <div
                className="modal-body overflow-y-auto text-left !bg-white flex-1"
                style={{ maxHeight: "65vh" }}
              >
                {isLoading ? (
                  <div className="flex justify-center items-center h-32">
                    <span className="loading loading-spinner loading-lg"></span>
                  </div>
                ) : (
                  <>
                    <p className="text-left text-base mb-2 font-semibold">
                      Step 2: ผู้อนุมัติ
                    </p>

                    {profile?.is_level_m5 === "0" && (
                      <div className="form-section">
                        <div className="form-section-header">
                          <div className="form-section-header-title">
                            ผู้อนุมัติต้นสังกัด
                          </div>

                          <button
                            className="btn btn-tertiary-brand bg-transparent shadow-none border-none"
                            onClick={(e) => {
                              e.stopPropagation();
                              e.preventDefault();
                              modalRef.current?.close();
                              editApproverModalRef.current?.openModal();
                            }}
                          >
                            แก้ไข
                          </button>
                        </div>
                        <ApproverInfoCard
                          user={{
                            image_url: approvers?.image_url || "",
                            full_name: approvers?.full_name || "",
                            emp_id: approvers?.emp_id || "",
                            dept_sap_short: approvers?.dept_sap_short || "",
                            posi_text: approvers?.posi_text || "",
                            tel_mobile: approvers?.tel_mobile || "",
                            tel_internal: approvers?.tel_internal || "",
                          }}
                        />
                      </div>
                    )}

                    <div className="form-section">
                      <div className="form-section-header">
                        <div className="form-section-header-title">
                          ผู้อนุมัติให้ทำหน้าที่ขับรถยนต์
                        </div>

                        <button
                          className="btn btn-tertiary-brand bg-transparent shadow-none border-none"
                          onClick={(e) => {
                            e.stopPropagation();
                            e.preventDefault();

                            modalRef.current?.close();
                            editFinalApproverModalRef.current?.openModal();
                          }}
                        >
                          แก้ไข
                        </button>
                      </div>
                      <ApproverInfoCard
                        user={{
                          image_url: finalApprovers?.image_url || "",
                          full_name: finalApprovers?.full_name || "",
                          emp_id: finalApprovers?.emp_id || "",
                          dept_sap_short: finalApprovers?.dept_sap_short || "",
                          posi_text: finalApprovers?.posi_text || "",
                          tel_mobile: finalApprovers?.tel_mobile || "",
                          tel_internal: finalApprovers?.tel_internal || "",
                        }}
                      />
                    </div>
                    <div className="text-left mt-5">
                      การกดปุ่ม "ขออนุมัติ"
                      จะถือว่าท่านรับรองว่ามีคุณสมบัติถูกต้อง
                      <br />
                      <a
                        href="/assets/อนุมัติให้พนักงานขับขี่รถยนต์ กฟภ. โดยใช้.pdf"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#444CE7] underline"
                      >
                        ตามอนุมัติ ผวก. ลว. 16 ก.พ. 2541 เรื่อง ให้พนักงานของ
                        กฟภ. ขับรถยนต์ที่ใช้ใบอนุญาตขับขี่ส่วนบุคคล
                      </a>
                    </div>
                  </>
                )}
              </div>

              {/* Modal actions fixed at the bottom */}
              <div className="modal-action flex w-full flex-wrap gap-5 mt-3 sticky bottom-0 bg-white z-20 pt-3">
                <div>
                  <button
                    type="button"
                    className="btn btn-secondary w-full"
                    onClick={() => modalRef.current?.close()}
                  >
                    ไม่ใช่ตอนนี้
                  </button>
                </div>
                <div>
                  <button
                    type="button"
                    className="btn bg-[#A80689] hover:bg-[#A80689] border-[#A80689] text-white w-full"
                    onClick={handleSubmit}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <span className="loading loading-spinner"></span>
                    ) : (
                      "ขออนุมัติ"
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>
          <form method="dialog" className="modal-backdrop">
            <button>close</button>
          </form>
        </dialog>

        <EditApproverModal
          ref={editApproverModalRef}
          requestData={requestData}
          approvers={approvers}
          title={"แก้ไขผู้อนุมัติต้นสังกัด"}
          onUpdate={handleApproverUpdate}
          onBack={() => {
            editApproverModalRef.current?.closeModal();
            modalRef.current?.showModal();
          }}
        />

        <EditFinalApproverModal
          ref={editFinalApproverModalRef}
          requestData={requestData}
          finalApprovers={finalApprovers}
          title={"แก้ไขผู้อนุมัติให้ทำหน้าที่ขับรถยนต์"}
          onUpdate={handleFinalApproverUpdate}
          onBack={() => {
            editFinalApproverModalRef.current?.closeModal();
            modalRef.current?.showModal();
          }}
        />
      </>
    );
  }
);

RequestDrivingStepTwoModal.displayName = "RequestDrivingStepTwoModal";

export default RequestDrivingStepTwoModal;
