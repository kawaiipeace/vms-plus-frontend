import { ProgressRequestType } from "@/app/types/progress-request-status";
import { useEffect, useState } from "react";

interface ApproverInfo {
  confirmed_request_desk_phone: string;
  confirmed_request_dept_name_full: string;
  confirmed_request_dept_name_short: string;
  confirmed_request_dept_sap: string;
  confirmed_request_emp_id: string;
  confirmed_request_emp_name: string;
  confirmed_request_mobile_phone: string;
  confirmed_request_position: string;
}


interface Props {
  approverInfo?: ApproverInfo;
  progressSteps?: ProgressRequestType[];
}

export default function ApproveProgress({ approverInfo, progressSteps }: Props) {
  const [approverData, setApproverData] = useState<ApproverInfo>();
  const [currentStep, setCurrentStep] = useState("");
  const [nextPendingStep, setNextPendingStep] = useState("");
  const doneSteps =
    progressSteps?.filter((step) => step.progress_icon === "3").length || 0;
  const [isApproverOpen, setIsApproverOpen] = useState(false);
  useEffect(() => {
    console.log('approveinfo',approverInfo);
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
    if (approverInfo) {
      setApproverData(approverInfo);
    }

  }, [approverInfo, progressSteps]);

  return (
    <div className="card card-approvalprogress">
      <div className="card-header title-progress-header">
        <div className="card-title title-progress">สถานะคำขอใช้</div>
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
                  const { progress_icon, progress_name } = step;
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
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        )}

        {/* Approver Info */}
        {approverInfo && (
          <div className="form-section">
            <div className="form-section-header">
              <div className="form-section-header-title hidden md:block">
                ผู้อนุมัติต้นสังกัด
              </div>
         
              <div className="block md:hidden w-full">
                <button
                  className="flex w-full p-0 h-auto w-100"
                  type="button"
                  onClick={() => setIsApproverOpen((prev) => !prev)}
                >
                  ผู้อนุมัติต้นสังกัด
                  <i className="material-symbols-outlined ml-auto">
                    {isApproverOpen
                      ? "keyboard_arrow_up"
                      : "keyboard_arrow_down"}
                  </i>
                </button>
              </div>
            </div>
            {approverInfo && (
          <div className="form-section mt-4 md:block hidden">

            <div className="form-card">
              <div className="form-card-body form-card-inline">
                <div className="form-group form-plaintext form-users">
                  <div className="form-plaintext-group align-self-center">
                    <div className="form-label">
                      {approverInfo?.confirmed_request_emp_name}
                    </div>
                    <div className="supporting-text-group">
                      <div className="supporting-text">
                        {approverInfo?.confirmed_request_dept_name_short}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="form-card-right align-self-center">
                  <div className="flex gap-3 flex-wrap">
                    <div className="col-span-12 md:col-span-6">
                      <div className="form-group form-plaintext">
                        <i className="material-symbols-outlined">smartphone</i>
                        <div className="form-plaintext-group">
                          <div className="form-text text-nowrap">
                            {approverInfo?.confirmed_request_mobile_phone ||
                              "-"}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="col-span-12 md:col-span-6">
                      <div className="form-group form-plaintext">
                        <i className="material-symbols-outlined">call</i>
                        <div className="form-plaintext-group">
                          <div className="form-text text-nowrap">
                            {approverInfo?.confirmed_request_desk_phone ||
                              "-"}
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
            <div
              className={`w-full form-card md:block transition-all duration-500 ease-in-out overflow-hidden ${
                isApproverOpen
                  ? "max-h-[1000px] opacity-100"
                  : "max-h-0 opacity-0"
              }`}
              id="collapseApproverDetail"
            >
              <div className="form-card-body form-card-inline">
                <div className="form-group form-plaintext form-users">
                  <div className="form-plaintext-group align-self-center">
                    <div className="form-label">{approverInfo?.confirmed_request_emp_name}</div>
                    <div className="supporting-text-group">
                      <div className="supporting-text">
                        {approverInfo?.confirmed_request_dept_name_short}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="form-card-right align-self-center">
                  <div className="flex gap-3 flex-wrap">
                  
                      <div className="col-span-12 md:col-span-6">
                        <div className="form-group form-plaintext">
                          <i className="material-symbols-outlined">
                            smartphone
                          </i>
                          <div className="form-plaintext-group">
                            <div className="form-text text-nowrap">
                              {approverInfo?.confirmed_request_mobile_phone ?? "-"}
                            </div>
                          </div>
                        </div>
                      </div>
               
                    {approverInfo?.confirmed_request_desk_phone && (
                      <div className="col-span-12 md:col-span-6">
                        <div className="form-group form-plaintext">
                          <i className="material-symbols-outlined">call</i>
                          <div className="form-plaintext-group">
                            <div className="form-text text-nowra">
                              {approverInfo?.confirmed_request_desk_phone}
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
  );
}
