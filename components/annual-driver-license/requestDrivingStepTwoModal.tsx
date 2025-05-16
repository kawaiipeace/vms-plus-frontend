import { RequestDetailType } from "@/app/types/request-detail-type";
import { AdminReturnedVehicle } from "@/services/adminService";
import {
  DriverReturnedVehicle,
  updateReceiveVehicleImages,
} from "@/services/vehicleInUseDriver";
import { UserReturnedVehicle } from "@/services/vehicleInUseUser";
import { convertToBuddhistDateTime } from "@/utils/converToBuddhistDateTime";
import { convertToISO } from "@/utils/convertToISO";
import useSwipeDown from "@/utils/swipeDown";
import { usePathname, useRouter } from "next/navigation";
import { forwardRef, useImperativeHandle, useRef } from "react";
import { ValueFormStep1 } from "./requestDrivingStepOneModal";
import VehicleUserInfoCard from "../card/vehicleUserInfoCard";
import Link from "next/link";
import EditApproverModal from "./editApproverModal";

interface ReturnCarAddStep2ModalProps {
  openStep1: () => void;
  status?: string;
  useBy?: string;
  valueFormStep1?: ValueFormStep1;
  id?: string;
  requestData?: RequestDetailType;
  clearForm?: () => void;
  onSubmit?: () => void;
  onBack?: () => void;
  progress?: string;
  edit?: boolean;
}

const RequestDrivingStepTwoModal = forwardRef<
  { openModal: () => void; closeModal: () => void },
  ReturnCarAddStep2ModalProps
>(
  (
    {
      useBy,
      valueFormStep1,
      requestData,
      clearForm,
      onSubmit,
      onBack,
      progress,
    },
    ref
  ) => {
    const router = useRouter();
    const pathName = usePathname();
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

    useImperativeHandle(ref, () => ({
      openModal: () => modalRef.current?.showModal(),
      closeModal: () => modalRef.current?.close(),
    }));

    const handleSubmit = async () => {
      try {
        const returned_vehicle_datetime =
          valueFormStep1?.selectedDate && valueFormStep1?.selectedTime
            ? convertToISO(
                convertToBuddhistDateTime(valueFormStep1?.selectedDate).date,
                convertToBuddhistDateTime(valueFormStep1?.selectedTime).time
              )
            : "";

        const formData = {
          fuel_end: valueFormStep1?.fuelQuantity,
          mile_end: Number(valueFormStep1?.miles || "0"),
          returned_cleanliness_level: valueFormStep1?.cleanType
            ? Number(valueFormStep1?.cleanType)
            : 0,
          returned_vehicle_datetime: returned_vehicle_datetime,
          returned_vehicle_emp_id: requestData?.returned_vehicle_emp_id,
          returned_vehicle_remark: valueFormStep1?.remark,
          trn_request_uid: requestData?.trn_request_uid,
        };
        console.log("formData", formData);
        let response;
        if (useBy === "user" || useBy === "userTabs") {
          response = await UserReturnedVehicle(formData);
        } else if (useBy === "admin") {
          response = await AdminReturnedVehicle(formData);
        } else {
          if (progress === "รับยานพาหนะ" || progress === "การรับยานพาหนะ") {
            response = await updateReceiveVehicleImages(formData);
          } else {
            response = await DriverReturnedVehicle(formData);
          }
        }
        if (onSubmit) {
          onSubmit();
        } else {
          if (response.status === 200) {
            clearForm?.();
            if (useBy === "user") {
              modalRef.current?.close();
              router.push(
                `/vehicle-booking/request-list?returned=success&request-no=${response.data.result.request_no}`
              );
            } else if (useBy === "admin") {
              modalRef.current?.close();
              router.push(
                `/administrator/request-list?activeTab=ตรวจสอบยานพาหนะ&returned=success&request-no=${response.data.result.request_no}`
              );
            }
            if (useBy === "userTabs") {
              modalRef.current?.close();
              router.push(
                `${pathName}?activeTab=การคืนยานพาหนะ&returned-tabs=success&request-no=${response.data.result.request_no}`
              );
            }
            if (useBy === "driver") {
              modalRef.current?.close();
              router.push(
                `${pathName}?progressType=${progress}&returned=success&request-no=${response.data.result.request_no}`
              );
            }
          }
        }
      } catch (error) {
        console.error("Error submitting form:", error);
      }
    }; // Properly closed handleSubmit function

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
                      onClick={(e) => { e.stopPropagation(); e.preventDefault(); editApproverModalRef.current?.openModal()}}
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
                      onClick={() =>
                        editFinalApproverModalRef.current?.openModal()
                      }
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
          title={"แก้ไขผู้อนุมัติต้นสังกัด"}
        />

        <EditApproverModal
          ref={editFinalApproverModalRef}
          title={"แก้ไขผู้อนุมัติให้ทำหน้าที่ขับรถยนต์"}
        />
      </>
    );
  }
);

RequestDrivingStepTwoModal.displayName = "RequestDrivingStepTwoModal";

export default RequestDrivingStepTwoModal;
