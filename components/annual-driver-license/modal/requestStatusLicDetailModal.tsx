"use client";
import { RequestAnnualDriver } from "@/app/types/driver-lic-list-type";
import { convertToBuddhistDateTime } from "@/utils/converToBuddhistDateTime";
import useSwipeDown from "@/utils/swipeDown";
import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";

interface Props {
  requestData?: RequestAnnualDriver;
}

  const RequestStatusLicDetailModal = forwardRef<
    { openModal: () => void; closeModal: () => void }, // Ref type
    Props
  >(({ requestData }, ref) => {
  const modalRef = useRef<HTMLDialogElement>(null);

  useImperativeHandle(ref, () => ({
    openModal: () => modalRef.current?.showModal(),
    closeModal: () => modalRef.current?.close(),
  }));

    const [currentStep, setCurrentStep] = useState("");
    const [nextPendingStep, setNextPendingStep] = useState("");
    const progressSteps = requestData?.progress_request_history;
    const confirmedRequest = requestData;
    const doneSteps =
      progressSteps?.filter((step) => step.progress_icon === "3").length || 0;
    useEffect(() => {
      if (progressSteps) {
        const currentStep = progressSteps?.find(
          (step) => step.progress_icon === "1" || step.progress_icon === "2"
        );
        const nextPendingStep = progressSteps?.find(
          (step) => step.progress_icon === "0"
        );
        setCurrentStep(currentStep?.progress_name || "");
        setNextPendingStep(nextPendingStep?.progress_name || "");
      }
    }, [progressSteps]);

  const swipeDownHandlers = useSwipeDown(() => modalRef.current?.close());

  return (
    <dialog ref={modalRef} id="my_modal_1" className="modal">
      <div  className="modal-box max-w-[500px] p-0 relative modal-vehicle-pick overflow-hidden flex flex-col max-h-[90vh]">
        <div className="bottom-sheet" {...swipeDownHandlers} >
          <div className="bottom-sheet-icon"></div>
        </div>

        <div className="modal-body overflow-y-auto !p-0">
           <div className="card card-approvalprogress !border-0">
             <div className="card-header title-progress-header">
               <div className="card-title title-progress">สถานะการขออนุมัติ</div>
             </div>
             <div className="card-body">
               {/* Mobile View */}
               {progressSteps && (
                 <>
                   <div className="md:hidden block">
                     <div className="circular-progressbar d-flex">
                       <div className="circular-progressbar-container">
                         <svg
                           xmlns="http://www.w3.org/2000/svg"
                           viewBox="-1.5 -1.5 34 34"
                           className="circular-progressbar"
                         >
                           <circle
                             cx="16"
                             cy="16"
                             r="15.9155"
                             className="circular-progressbar-background"
                           />
                           <circle
                             cx="16"
                             cy="16"
                             r="15.9155"
                             className="circular-progressbar-progress js-circular-progressbar"
                             style={{
                               strokeDashoffset: `${
                                 100 - (doneSteps / progressSteps?.length) * 100
                               }px`,
                             }}
                           />
                         </svg>
                         <div className="circular-progressbar-text">
                           {doneSteps}
                           <span className="circular-progressbar-slash">/</span>
                           {progressSteps?.length}
                         </div>
                       </div>
                       <div className="progress-steps-btn-content">
                         <div className="progress-steps-btn-title">{currentStep}</div>
                         <div className="progress-steps-btn-text">
                           <>
                             ถัดไป:{" "}
                             <span className="progress-steps-btn-label">
                               {nextPendingStep}
                             </span>
                           </>
                         </div>
                       </div>
                     </div>
                   </div>
       
                   {/* Desktop View */}
       
                   <div className="md:block hidden">
                     <div className="progress-steps-column">
                       {progressSteps.map((step, index) => {
                         const { progress_icon, progress_name, progress_datetime } =
                           step;
                         const getStepIcon = () => {
                           if (progress_icon === "3")
                             return <i className="material-symbols-outlined">check</i>;
                           if (progress_icon === "2")
                             return (
                               <i className="material-symbols-outlined text-icon-error">
                                 exclamation
                               </i>
                             );
                           return null;
                         };
       
                         const getStepClass = () => {
                           if (progress_icon === "3") return "done";
                           if (progress_icon === "2") return "warning";
                           if (progress_icon === "1") return "active";
                           return "";
                         };
       
                         return (
                           <div
                             key={index}
                             className={`progress-step ${getStepClass()}`}
                           >
                             <span className={`progress-step-no ${getStepClass()}`}>
                               {getStepIcon()}
                             </span>
                             <div className="progress-step-content">
                               <div className="progress-step-title">
                                 {progress_name}
                               </div>
                               <div className="progress-step-text">
                                 {" "}
                                 {convertToBuddhistDateTime(
                                   progress_datetime|| ""
                                 ).date + " " +
                                   convertToBuddhistDateTime(
                                     progress_datetime|| ""
                                   ).time}{" "}
                               </div>
                             </div>
                           </div>
                         );
                       })}
                     </div>
                   </div>
                 </>
               )}
       
               {confirmedRequest && (
                 <div className="form-section mt-4">
                   <div className="form-section-header">
                     <div className="form-section-header-title">ผู้อนุมัติต้นสังกัด</div>
                   </div>
                   <div className="form-card">
                     <div className="form-card-body form-card-inline">
                       <div className="form-group form-plaintext form-users">
                         <div className="form-plaintext-group align-self-center">
                           <div className="form-label">
                             {confirmedRequest.confirmed_request_emp_name}
                           </div>
                           <div className="supporting-text-group">
                             <div className="supporting-text">
                               {confirmedRequest.confirmed_request_dept_sap_short}
                             </div>
                           </div>
                         </div>
                       </div>
                       <div className="form-card-right align-self-center">
                         <div className="flex gap-3 flex-wrap">
                           {confirmedRequest.confirmed_request_mobile_number && (
                             <div className="col-span-12 md:col-span-6">
                               <div className="form-group form-plaintext">
                                 <i className="material-symbols-outlined">
                                   smartphone
                                 </i>
                                 <div className="form-plaintext-group">
                                   <div className="form-text text-nowrap">
                                     {confirmedRequest.confirmed_request_mobile_number}
                                   </div>
                                 </div>
                               </div>
                             </div>
                           )}
                           {confirmedRequest.confirmed_request_phone_number && (
                             <div className="col-span-12 md:col-span-6">
                               <div className="form-group form-plaintext">
                                 <i className="material-symbols-outlined">call</i>
                                 <div className="form-plaintext-group">
                                   <div className="form-text text-nowrap">
                                     {confirmedRequest.confirmed_request_phone_number}
                                   </div>
                                 </div>
                               </div>
                             </div>
                           )}
                         </div>
                       </div>
                     </div>
                   </div>
                 </div>
               )}
             </div>
           </div>
          </div>
        <div className="modal-action sticky bottom-0 gap-3 mt-0">
          <form method="dialog">
            <button className="btn btn-secondary">ยกเลิก</button>
            </form>
          <form method="dialog">
          <button className="btn btn-primary">
            ยืนยัน
          </button>
          </form>
        </div>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>
  );
});

RequestStatusLicDetailModal.displayName = "RequestStatusLicDetailModal";

export default RequestStatusLicDetailModal;
