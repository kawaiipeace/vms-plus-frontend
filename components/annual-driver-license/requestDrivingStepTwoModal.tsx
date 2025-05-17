"use client";
import useSwipeDown from "@/utils/swipeDown";
import { forwardRef, useImperativeHandle, useRef } from "react";
import { ValueFormStep1 } from "./requestDrivingStepOneModal";
import VehicleUserInfoCard from "../card/vehicleUserInfoCard";
import Link from "next/link";
import EditApproverModal from "./editApproverModal";
import { DriverLicenseCardType } from "@/app/types/vehicle-user-type";
import EditFinalApproverModal from "./editFinalApproverModal";
import { createAnnualLic } from "@/services/driver";
import { useToast } from "@/contexts/toast-context";

interface ReturnCarAddStep2ModalProps {
  openStep1: () => void;
  status?: string;
  valueFormStep1?: ValueFormStep1;
  requestData?: DriverLicenseCardType;
  clearForm?: () => void;
  onSubmit?: () => void;
  onBack?: () => void;
  edit?: boolean;
}

const RequestDrivingStepTwoModal = forwardRef<
  { openModal: () => void; closeModal: () => void },
  ReturnCarAddStep2ModalProps
>(({ valueFormStep1, requestData, clearForm, onSubmit, onBack }, ref) => {
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
  const { showToast } = useToast();

  useImperativeHandle(ref, () => ({
    openModal: () => modalRef.current?.showModal(),
    closeModal: () => modalRef.current?.close(),
  }));

  const handleSubmit = async () => {
    try {
      const payload = {
        annual_yyyy: 2568,
        approved_request_emp_id: "990001",
        confirmed_request_emp_id: "990002",
        driver_certificate_expire_date: "2024-12-31T00:00:00Z",
        driver_certificate_img: "http://pntdev.ddns.net:28089/VMS_PLUS/PIX/cert.png",
        driver_certificate_issue_date: "2023-01-01T00:00:00Z",
        driver_certificate_name: "Safety Certificate",
        driver_certificate_no: "CERT12345",
        driver_certificate_type_code: 1,
        driver_license_expire_date: "2025-12-31T00:00:00Z",
        driver_license_img: "http://pntdev.ddns.net:28089/VMS_PLUS/PIX/license.png",
        driver_license_no: "DL12345678",
        ref_driver_license_type_code: "1",
        request_expire_date: "2023-12-31T00:00:00Z",
        request_issue_date: "2023-01-01T00:00:00Z"
      };
  
      const response = await createAnnualLic(payload);
      
      if (response) {
        showToast({
          title: "อนุมัติคำขอสำเร็จ",
          desc: (
            <>
              คำขอใช้ยานพาหนะเลขที่ {response?.data?.result?.request_annual_driver_no}
              <br />
              ผ่านการอนุมัติเรียบร้อยแล้ว
            </>
          ),
          status: "success"
        });
  
        // Close modal first
        modalRef.current?.close();
        
        // Wait 2 seconds to ensure toast is visible before refresh
        // setTimeout(() => {
        //   window.location.reload();
        // }, 2000);
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
                    modalRef.current?.close();
                    if (onBack) {
                      onBack();
                    }
                  }}
                >
                  keyboard_arrow_left
                </i>{" "}
                ขออนุมัติทำหน้าที่ขับรถยนต์ประจำปี
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
                      editApproverModalRef.current?.openModal();
                    }}
                  >
                    แก้ไข
                  </button>
                </div>
                <VehicleUserInfoCard
                  id={requestData?.vehicle_user_emp_id || ""}
                  requestData={requestData}
                />
              </div>

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
                      editFinalApproverModalRef.current?.openModal();
                    }}
                  >
                    แก้ไข
                  </button>
                </div>
                <VehicleUserInfoCard
                  id={requestData?.vehicle_user_emp_id || ""}
                  requestData={requestData}
                />
              </div>
              <div className="text-left mt-5">
                การกดปุ่ม “ขออนุมัติ” จะถือว่าท่านรับรองว่ามีคุณสมบัติถูกต้อง{" "}
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
      />

      <EditFinalApproverModal
        ref={editFinalApproverModalRef}
        requestData={requestData}
        title={"แก้ไขผู้อนุมัติให้ทำหน้าที่ขับรถยนต์"}
      />
    </>
  );
});

RequestDrivingStepTwoModal.displayName = "RequestDrivingStepTwoModal";

export default RequestDrivingStepTwoModal;
