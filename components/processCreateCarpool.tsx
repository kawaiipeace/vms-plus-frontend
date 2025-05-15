import { useRouter } from "next/navigation";
import { useState } from "react";

export default function ProcessCreateCarpool({ step }: { step: number }) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const router = useRouter();

  const toggleCollapse = () => {
    setIsCollapsed((prev) => !prev);
  };

  return (
    <div className="progress-steps-container">
      <div className="block md:hidden">
        <button
          className="btn btn-secondary h-[104px] flex items-center"
          type="button"
          onClick={toggleCollapse}
          aria-expanded="true"
          aria-controls="collapseExample"
        >
          <div className="circular-progressbar flex md:none">
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
                ></circle>
                <circle
                  cx="16"
                  cy="16"
                  r="15.9155"
                  className={`circular-progressbar-progress js-circular-progressbar`}
                  style={{
                    strokeDashoffset:
                      step === 1
                        ? "75"
                        : step === 2
                        ? "50"
                        : step === 3
                        ? "25"
                        : "0",
                  }}
                ></circle>
              </svg>

              <div className="circular-progressbar-text">
                {step} <span className="circular-progressbar-slash">/</span>4
              </div>
            </div>
            <div className="progress-steps-btn-content">
              <div className="progress-steps-btn-title">
                รออนุมัติจากต้นสังกัด
              </div>
              <div className="progress-steps-btn-text">
                ถัดไป:{" "}
                <span className="progress-steps-btn-label">
                  รอผู้ดูแลยานพาหนะตรวจสอบ
                </span>
              </div>
            </div>
          </div>
          <i className="material-symbols-outlined">keyboard_arrow_down</i>
        </button>
      </div>
      <div className={`${isCollapsed ? "hidden" : "block"}`}>
        <div
          className="progress-steps-group collapse d-md-flex"
          id="collapseSteps"
        >
          <div
            className={`progress-step cursor-pointer ${
              step == 1 ? "active" : step > 1 ? "done" : ""
            }`}
            // onClick={() =>
            //   router.push("/carpool-management/create/process-one")
            // }
          >
            <span className="progress-step-no">
              {step > 1 ? (
                <i className="material-symbols-outlined">check</i>
              ) : (
                1
              )}
            </span>
            <div className="progress-step-content">
              <div className="progress-step-title">ระบุข้อมูล</div>
              {/* <!-- <div className="progress-step-text">Supporting text</div> --> */}
            </div>
          </div>
          <div
            className={`progress-step cursor-pointer ${
              step == 2 ? "active" : step > 2 ? "done" : ""
            }`}
            // onClick={() => {
            //   if (localStorage.getItem("processOne") === "Done") {
            //     router.push("/carpool-management/create/process-two");
            //   }
            // }}
          >
            <span className="progress-step-no">
              {step > 2 ? (
                <i className="material-symbols-outlined">check</i>
              ) : (
                2
              )}
            </span>
            <div className="progress-step-content">
              <div className="progress-step-title">เพิ่มผู้ดูแลยานพาหนะ</div>
              {/* <!-- <div className="progress-step-text">Supporting text</div> --> */}
            </div>
          </div>
          <div
            className={`progress-step cursor-pointer ${
              step == 3 ? "active" : step > 3 ? "done" : ""
            }`}
            // onClick={() => {
            //   if (localStorage.getItem("processTwo") === "Done") {
            //     router.push("/carpool-management/create/process-three");
            //   }
            // }}
          >
            <span className="progress-step-no">
              {step > 3 ? (
                <i className="material-symbols-outlined">check</i>
              ) : (
                3
              )}
            </span>
            <div className="progress-step-content">
              <div className="progress-step-title">เพิ่มผู้อนุมัติ</div>
              {/* <!-- <div className="progress-step-text">Supporting text</div> --> */}
            </div>
          </div>
          <div
            className={`progress-step cursor-pointer ${
              step == 4 ? "active" : step > 4 ? "done" : ""
            }`}
            // onClick={() => {
            //   if (localStorage.getItem("processThree") === "Done") {
            //     router.push("/carpool-management/create/process-four");
            //   }
            // }}
          >
            <span className="progress-step-no">
              {step > 4 ? (
                <i className="material-symbols-outlined">check</i>
              ) : (
                4
              )}
            </span>
            <div className="progress-step-content">
              <div className="progress-step-title">เพิ่มยานพาหนะ</div>
              {/* <!-- <div className="progress-step-text">Supporting text</div> --> */}
            </div>
          </div>
          <div
            className={`progress-step ${
              step == 5 ? "active" : step > 5 ? "done" : ""
            }`}
          >
            <span className="progress-step-no">05</span>
            <div className="progress-step-content">
              <div className="progress-step-title">เพิ่มพนักงานขับรถ</div>
              {/* <!-- <div className="progress-step-text">Supporting text</div> --> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
