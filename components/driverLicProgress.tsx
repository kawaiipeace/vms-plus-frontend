import { ProgressDriver } from "@/app/types/vehicle-user-type";
import { convertToBuddhistDateTime } from "@/utils/converToBuddhistDateTime";
import { useEffect, useState } from "react";

interface Props {
  progressSteps?: ProgressDriver[];
}

export default function DriverLicProgress({ progressSteps }: Props) {
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
    <div className="card card-approvalprogress !border-0">
      <div className="card-body border-0">
        {/* Mobile View */}
        {progressSteps && (
          <>
            <div className="w-full">
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
                        {progress_datetime !== "0001-01-01T00:00:00Z" && (
                          <div className="progress-desc font-normal text-color-secondary">
                            {convertToBuddhistDateTime(progress_datetime).date +
                              " " +
                              convertToBuddhistDateTime(progress_datetime).time}
                          </div>
                        )}
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
