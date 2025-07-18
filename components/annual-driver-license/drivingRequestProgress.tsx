import { ProgressRequestType } from "@/app/types/progress-request-status";
import { convertToBuddhistDateTime } from "@/utils/converToBuddhistDateTime";
import { useEffect, useState } from "react";

interface ConfirmedRequestType {
  confirmed_request_datetime: string;
  confirmed_request_dept_sap: string;
  confirmed_request_dept_sap_full: string;
  confirmed_request_dept_sap_short: string;
  confirmed_request_emp_id: string;
  confirmed_request_emp_name: string;
  confirmed_request_emp_position: string;
  confirmed_request_image_url: string;
  confirmed_request_mobile_number: string;
  confirmed_request_phone_number: string;
}

interface Props {
  progressSteps?: ProgressRequestType[];
  title?: string;
  confirmedRequest?: ConfirmedRequestType;
}

export default function DrivingRequestProgress({
  progressSteps,
  title,
  confirmedRequest,
}: Props) {
  const [currentStep, setCurrentStep] = useState("");
  const [nextPendingStep, setNextPendingStep] = useState("");
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

  return (
    <div className="card card-approvalprogress">
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
                          {progress_datetime !== "0001-01-01T00:00:00Z" && (
                            <>
                              {convertToBuddhistDateTime(
                                progress_datetime || ""
                              ).date +
                                " " +
                                convertToBuddhistDateTime(
                                  progress_datetime || ""
                                ).time}
                            </>
                          )}
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
              <div className="form-section-header-title">{title}</div>
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
                        {confirmedRequest.confirmed_request_emp_position} {confirmedRequest.confirmed_request_dept_sap_short}
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
                            {confirmedRequest.confirmed_request_mobile_number ||
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
                            {confirmedRequest.confirmed_request_phone_number ||
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
      </div>
    </div>
  );
}
