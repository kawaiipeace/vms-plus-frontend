import { RequestDetailType } from "@/app/types/request-detail-type";
import AlertCustom from "@/components/alertCustom";
import ImagesCarCard from "@/components/card/ImagesCarCard";
import CarDetailCard from "@/components/card/carDetailCard";
import { ReturnCarInfoCard } from "@/components/card/returnCarInfoCard";
import UserInfoCard from "@/components/card/userInfoCard";
import ReturnCarAddModal from "@/components/modal/returnCarAddModal";
import ReturnCarAddStep2Modal from "@/components/modal/returnCarAddStep2Modal";
import { useRef } from "react";
import DriverPassengerPeaInfoCard from "../card/driverPassengerPeaInfoCard";
import ReviewCarDriveModal from "../modal/reviewCarDriveModal";

interface ReturnCarTabProps {
  status?: string;
  useBy?: string;
  displayOn?: string;
  requestData?: RequestDetailType;
}

const ReturnCarTab = ({ status, displayOn, requestData, useBy }: ReturnCarTabProps) => {
  const returnCarAddModalRef = useRef<{
    openModal: () => void;
    closeModal: () => void;
  } | null>(null);

  const returnCarAddStep2ModalRef = useRef<{
    openModal: () => void;
    closeModal: () => void;
  } | null>(null);

  const reviewCarDriveModalRef = useRef<{
    openModal: () => void;
    closeModal: () => void;
  } | null>(null);

  const returnCarEditDataModalRef = useRef<{
    openModal: () => void;
    closeModal: () => void;
  } | null>(null);

  const isReturnFail = requestData?.ref_request_status_code === "60" || requestData?.ref_request_status_code === "60e";
  return (
    <>
      {status == "returnFail" ||
        (requestData?.ref_request_status_name === "ตีกลับยานพาหนะ" && (
          <AlertCustom title="ถูกตีกลับโดยผู้ดูแลยานพาหนะ" desc="เหตุผล: ยานพาหนะไม่สะอาด" />
        ))}
      <div className="grid md:grid-cols-2 gird-cols-1 gap-4">
        <div className=" row-start-1 md:col-start-1">
          <div className="form-section">
            <div className="form-section-header">
              <div className="form-section-header-title">
                <p>ข้อมูลการคืนยานพาหนะ</p>
              </div>
              {(status === "returnFail" || displayOn === "adminTab" || displayOn === "userTabs") && (
                <div className="form-section-header-actions">
                  <button
                    className="btn bg-transparent border-none shadow-none hover:bg-transparent text-[#A80689]"
                    onClick={() => returnCarEditDataModalRef.current?.openModal()}
                  >
                    แก้ไข
                  </button>
                </div>
              )}
            </div>

            <ReturnCarInfoCard data={requestData} />
          </div>

          <div className="form-section">
            <div className="form-section-header">
              <div className="form-section-header-title">
                <p>รูปยานพาหนะหลังเดินทาง</p>
              </div>
              {(status === "returnFail" || displayOn === "adminTab" || displayOn === "userTabs") && (
                <div className="form-section-header-actions">
                  <button
                    className="btn bg-transparent border-none shadow-none hover:bg-transparent text-[#A80689]"
                    onClick={() => returnCarAddStep2ModalRef.current?.openModal()}
                  >
                    แก้ไข
                  </button>
                </div>
              )}
            </div>

            <ImagesCarCard
              images={
                requestData?.vehicle_images_returned
                  ? requestData?.vehicle_images_returned?.map((e) => e.vehicle_img_file || "")
                  : []
              }
            />
          </div>
        </div>
        {displayOn === "userTabs" && (
          <div className="form-section">
            <div className="form-section-header">
              <div className="form-section-header-title">
                <p>ผู้ดูแลยานพาหนะ</p>
              </div>
            </div>

            <DriverPassengerPeaInfoCard id={requestData?.vehicle_user_emp_id || ""} requestData={requestData} />
          </div>
        )}
        {displayOn !== "userTabs" && (
          <div className=" row-start-2 md:row-start-1 md:col-start-2 flex flex-col gap-4">
            <CarDetailCard vehicle={requestData?.vehicle} />
            <UserInfoCard
              UserType="outsource"
              reviewDriver={() => reviewCarDriveModalRef.current?.openModal()}
              displayOn={displayOn}
              vehicleUserData={requestData?.vehicle?.vehicle_department.vehicle_user}
            />
          </div>
        )}
        {isReturnFail && (
          <div className="w-full">
            <button
              className="btn btn-primary w-full"
              onClick={() => {
                returnCarAddModalRef.current?.openModal();
              }}
            >
              คืนยานพาหนะอีกครั้ง
            </button>
          </div>
        )}
        <ReviewCarDriveModal displayOn={displayOn} ref={reviewCarDriveModalRef} id={requestData?.trn_request_uid} />
        <ReturnCarAddModal useBy={useBy} ref={returnCarAddModalRef} requestData={requestData} />
        <ReturnCarAddModal useBy={useBy} ref={returnCarEditDataModalRef} requestData={requestData} edit />
        <ReturnCarAddStep2Modal useBy={useBy} openStep1={() => () => {}} ref={returnCarAddStep2ModalRef} />
      </div>
    </>
  );
};

export default ReturnCarTab;
