"use client";
import useSwipeDown from "@/utils/swipeDown";
import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import Link from "next/link";
import EditApproverModal from "./editApproverModal";
import {
  DriverLicenseCardType,
  VehicleUserType,
} from "@/app/types/vehicle-user-type";
import EditFinalApproverModal from "./editFinalApproverModal";
import { createAnnualLic, resendLicenseAnnual } from "@/services/driver";
import { useToast } from "@/contexts/toast-context";
import ApproverInfoCard from "./ApproverInfoCard";
import {
  fetchUserApprovalLic,
  fetchUserConfirmerLic,
} from "@/services/masterService";
import { convertToISO } from "@/utils/convertToISO";
import { UploadFileType } from "@/app/types/upload-type";
import { RequestAnnualDriver } from "@/app/types/driver-lic-list-type";
import { useRouter } from "next/navigation";
import dayjs from "dayjs";

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
  onTrackStatus?: () => void;
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

    console.log("valueFormStep1", valueFormStep1);
    const [approvers, setApprovers] = useState<VehicleUserType>();
    const [finalApprovers, setFinalApprovers] = useState<VehicleUserType>();
    const router = useRouter();

    const { showToast } = useToast();

    useImperativeHandle(ref, () => ({
      openModal: () => modalRef.current?.showModal(),
      closeModal: () => modalRef.current?.close(),
    }));

    useEffect(() => {
      const fetchApproversData = async () => {
        try {
          const response = await fetchUserConfirmerLic();
          if (response && response.data) {
            setApprovers(response.data[0]);
          }
        } catch (error) {
          console.error("Error fetching approvers:", error);
        }
      };

      const fetchFinalApproversData = async () => {
        try {
          const response = await fetchUserApprovalLic();
          if (response && response.data) {
            setFinalApprovers(response.data[0]);
          }
        } catch (error) {
          console.error("Error fetching approvers:", error);
        }
      };
      fetchFinalApproversData();
      fetchApproversData();
    }, []);

    const handleApproverUpdate = (updatedApprover: VehicleUserType) => {
      setApprovers(updatedApprover);
    };

    const handleFinalApproverUpdate = (updatedApprover: VehicleUserType) => {
      setFinalApprovers(updatedApprover);
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

    const handleSubmit = async () => {
      console.log(valueFormStep1);
      try {
        const basePayload: any = {
          annual_yyyy: Number(valueFormStep1?.year),
          approved_request_emp_id: finalApprovers?.emp_id,
          confirmed_request_emp_id: approvers?.emp_id,
          driver_license_expire_date: convertToISO(
            String(valueFormStep1?.licenseExpiryDate),
            "00:00"
          ),
          driver_license_img: valueFormStep1?.licenseImages[0].file_url,
          driver_license_no: valueFormStep1?.licenseNumber,
          ref_driver_license_type_code:
            valueFormStep1?.driverLicenseType?.value,
        };
        console.log("payload======>", basePayload);
        if (
          valueFormStep1?.driverLicenseType?.value === "2+" ||
          valueFormStep1?.driverLicenseType?.value === "3+"
        ) {
          // Add certificate fields only if they exist
          if (valueFormStep1?.trainingEndDate) {
            basePayload.driver_certificate_expire_date = convertToISO(
              String(valueFormStep1.trainingEndDate),
              "00:00"
            );
          }

          if (
            valueFormStep1?.certificateImages &&
            valueFormStep1.certificateImages.length > 0
          ) {
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
        console.log("next", driverData?.next_trn_request_annual_driver_uid);
        let response;
        if (editable) {
          console.log("next", driverData?.next_trn_request_annual_driver_uid);
          response = await resendLicenseAnnual(
            driverData?.next_trn_request_annual_driver_uid || "",
            basePayload
          );
          console.log("res", response);
        } else {
          response = await createAnnualLic(basePayload);
        }

        if (response) {
          showToast({
            title: "สร้างคำขอสำเร็จ",
            desc: (
              <>
                สร้างคำขออนุมัติทำหน้าที่ขับรถยนต์ประจำปี <br />
                เลขที่ {response?.data?.result?.request_annual_driver_no}{" "}
                เรียบร้อยแล้ว
              </>
            ),
            seeDetail: {
              onClick: () => {
                modalRef.current?.close();
                if (onTrackStatus) {
                  onTrackStatus();
                }
              },
              text: "ติดตามสถานะ",
            },
            seeDetailText: "ติดตามสถานะ",
            status: "success",
          });

          // Close modal first
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
          <div className="modal-box max-w-[500px] p-0 relative overflow-hidden flex flex-col">
            <form>
              <div className="bottom-sheet" {...swipeDownHandlers}>
                <div className="bottom-sheet-icon"></div>
              </div>
              <div className="modal-header bg-white sticky top-0 flex justify-between z-10">
                <div className="modal-title items-center flex">
                  <i
                    className="material-symbols-outlined cursor-pointer"
                    onClick={() => {
                      if (onBack) {
                        onBack();
                      }
                    }}
                  >
                    keyboard_arrow_left
                  </i>{" "}
                  ขออนุมัติทำหน้าที่ขับรถยนต์ประจำปี{" "}
                  {requestData?.license_status === "มีผลปีถัดไป" &&
                    dayjs().year() + 543}{" "}
                  {requestData?.next_license_status !== "" &&
                    dayjs().year() + 544}
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

              <div className={`modal-body overflow-y-auto text-left !bg-white`}>
                <p className="text-left text-base mb-2 font-semibold">
                  Step 2: ผู้อนุมัติ
                </p>

                {approvers?.emp_id !== finalApprovers?.emp_id && (
                  <div className="form-section">
                    <div className="form-section-header">
                      <div className="form-section-header-title">
                        ผู้อนุมัติต้นสังกัด
                      </div>
                      {editable && (
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
                      )}
                    </div>
                    <ApproverInfoCard
                      user={{
                        image_url: approvers?.image_url || "",
                        full_name: approvers?.full_name || "",
                        emp_id: approvers?.emp_id || "",
                        dept_sap_short: approvers?.dept_sap_short || "",
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
                    {editable && (
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
                    )}
                  </div>
                  <ApproverInfoCard
                    user={{
                      image_url: finalApprovers?.image_url || "",
                      full_name: finalApprovers?.full_name || "",
                      emp_id: finalApprovers?.emp_id || "",
                      dept_sap_short: finalApprovers?.dept_sap_short || "",
                      tel_mobile: finalApprovers?.tel_mobile || "",
                      tel_internal: finalApprovers?.tel_internal || "",
                    }}
                  />
                </div>
                <div className="text-left mt-5">
                  การกดปุ่ม "ขออนุมัติ" จะถือว่าท่านรับรองว่ามีคุณสมบัติถูกต้อง
                  <br></br>
                  <Link href="#" className="text-[#444CE7] underline">
                    ตามอนุมัติ ผวก. ลว. 16 ก.พ. 2541 เรื่อง ให้พนักงานของ กฟภ.
                    ขับรถยนต์ที่ใช้ใบอนุญาตขับขี่ส่วนบุคคล
                  </Link>{" "}
                </div>
              </div>
              <div className="modal-action flex w-full flex-wrap gap-5 mt-3">
                <div className="">
                  <button
                    type="button"
                    className="btn btn-secondary w-full"
                    onClick={() => modalRef.current?.close()}
                  >
                    ไม่ใช่ตอนนี้
                  </button>
                </div>
                <div className="">
                  <button
                    type="button"
                    className="btn bg-[#A80689] hover:bg-[#A80689] border-[#A80689] text-white w-full"
                    onClick={() => {
                      handleSubmit();
                    }}
                  >
                    ขออนุมัติ
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
