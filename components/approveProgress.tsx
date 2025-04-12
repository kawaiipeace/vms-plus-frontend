import { ApproverUserType } from "@/app/types/approve-user-type";
import { fetchUserApproverUsers } from "@/services/masterService";
import { useEffect, useState } from "react";

interface Props {
  approverId?: string;
  statusCode?: string;
}

export default function ApproveProgress({
  approverId,
  statusCode,
}: Props) {
  const [processActive, setProcessActive] = useState(1); // Initialize with default value

  useEffect(() => {
    // Set processActive based on statusCode
    if (statusCode === "20" || statusCode === "21") {
      setProcessActive(1);
    } else if (statusCode === "30" || statusCode === "31") {
      setProcessActive(2);
    } else if (statusCode === "40" || statusCode === "41") {
      setProcessActive(3);
    }

    const fetchApprover = async () => {
      try {
        const response = await fetchUserApproverUsers(approverId);
        console.log(response);
        setApproverData(response.data[0]);
      } catch (error) {
        console.error("Error fetching requests:", error);
      }
    };

    fetchApprover();
  }, [approverId, statusCode]); // Add statusCode to the dependency array

  const getStepClass = (stepIndex: number) => {
    if (stepIndex < processActive) return "done";
    if (stepIndex === processActive) return "active";
    return "";
  };

  const [approverData, setApproverData] = useState<ApproverUserType>();

  return (
    <div className="card card-approvalprogress">
      <div className="card-header">
        <div className="card-title">สถานะคำขอใช้</div>
      </div>
      <div className="card-body">
        <div className="md:hidden">
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
                    strokeDashoffset: `${100 - (processActive / 3) * 100}px`,
                  }}
                />
              </svg>
              <div className="circular-progressbar-text">
                {processActive}
                <span className="circular-progressbar-slash">/</span>3
              </div>
            </div>
            <div className="progress-steps-btn-content">
              <div className="progress-steps-btn-title">
                {processActive === 1 && "รออนุมัติจากต้นสังกัด"}
                {processActive === 2 && "รอผู้ดูแลยานพาหนะตรวจสอบ"}
                {processActive === 3 && "รออนุมัติใช้ยานพาหนะ"}
              </div>
              <div className="progress-steps-btn-text">
                {processActive < 3 && (
                  <>
                    ถัดไป:{" "}
                    <span className="progress-steps-btn-label">
                      {processActive === 1
                        ? "รอผู้ดูแลยานพาหนะตรวจสอบ"
                        : "รออนุมัติใช้ยานพาหนะ"}
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Desktop view */}
        <div className="progress-steps-column d-none d-md-flex">
          <div className={`progress-step ${getStepClass(1)}`}>
            <span className="progress-step-no">
              {processActive > 1 && (
                <i className="material-symbols-outlined">check</i>
              )}
            </span>
            <div className="progress-step-content">
              <div className="progress-step-title">รออนุมัติจากต้นสังกัด</div>
            </div>
          </div>
          <div className={`progress-step ${getStepClass(2)}`}>
            <span className="progress-step-no">
              {processActive > 2 && (
                <i className="material-symbols-outlined">check</i>
              )}
            </span>
            <div className="progress-step-content">
              <div className="progress-step-title">
                รอผู้ดูแลยานพาหนะตรวจสอบ
              </div>
            </div>
          </div>
          <div className={`progress-step ${getStepClass(3)}`}>
            <span className="progress-step-no">
              {processActive > 3 && (
                <i className="material-symbols-outlined">check</i>
              )}
            </span>
            <div className="progress-step-content">
              <div className="progress-step-title">รออนุมัติใช้ยานพาหนะ</div>
            </div>
          </div>
        </div>

        {approverId === "" && (
          <div className="form-section">
            <div className="form-section-header">
              <div className="form-section-header-title d-none d-md-block">
                ผู้อนุมัติต้นสังกัด
              </div>
              <button
                className="btn btn-tertiary hidden p-0 h-auto w-100"
                type="button"
                data-toggle="collapse"
                data-target="#collapseApproverDetail"
                aria-expanded="false"
                aria-controls="collapseApproverDetail"
              >
                ผู้อนุมัติต้นสังกัด
                <i className="material-symbols-outlined ml-auto">
                  keyboard_arrow_down
                </i>
              </button>
            </div>

            <div
              className="form-card d-md-block collapse"
              id="collapseApproverDetail"
            >
              <div className="form-card-body form-card-inline">
                <div className="form-group form-plaintext form-users">
                  <div className="form-plaintext-group align-self-center">
                    <div className="form-label">{approverData?.full_name}</div>
                    <div className="supporting-text-group">
                      <div className="supporting-text">
                        {approverData?.dept_sap_short}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="form-card-right align-self-center">
                  <div className="flex gap-3 flex-wrap">
                    {approverData?.tel_mobile && (
                      <div className="col-span-12 md:col-span-6">
                        <div className="form-group form-plaintext">
                          <i className="material-symbols-outlined">
                            smartphone
                          </i>
                          <div className="form-plaintext-group">
                            <div className="form-text text-nowrap">
                              {approverData?.tel_mobile}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                    {approverData?.tel_internal && (
                      <div className="col-span-12 md:col-span-6">
                        <div className="form-group form-plaintext">
                          <i className="material-symbols-outlined">call</i>
                          <div className="form-plaintext-group">
                            <div className="form-text text-nowra">
                              {approverData?.tel_internal}
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
