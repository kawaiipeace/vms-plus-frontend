import { ApproverUserType } from "@/app/types/approve-user-type";
import { ProgressRequestType } from "@/app/types/progress-request-status";
import { fetchUserApproverUsers } from "@/services/masterService";
import { useEffect, useState } from "react";

interface Props {
  approverId?: string;
  progressSteps?: ProgressRequestType[];
}

export default function DriverLicProgress({ approverId, progressSteps }: Props) {
  const [approverData, setApproverData] = useState<ApproverUserType>();
  const [currentStep, setCurrentStep] = useState("");
  const [nextPendingStep, setNextPendingStep] = useState("");
  const doneSteps =
    progressSteps?.filter((step) => step.progress_icon === "3").length || 0;
  const [isApproverOpen, setIsApproverOpen] = useState(false);
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
    const fetchApprover = async () => {
      try {
        const response = await fetchUserApproverUsers(approverId);
        setApproverData(response.data[0]);
      } catch (error) {
        console.error("Error fetching requests:", error);
      }
    };

    fetchApprover();
  }, [approverId, progressSteps]);

  return (
    <div className="card card-approvalprogress">

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

      </div>
    </div>
  );
}
