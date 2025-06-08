import { useToast } from "@/contexts/toast-context";
import {
  adminDeleteFuelDetail,
  adminDeleteTravelDetail,
} from "@/services/adminService";
import { adminCancelRequest } from "@/services/bookingAdmin";
import { firstApprovercancelRequest } from "@/services/bookingApprover";
import { finalCancelRequest } from "@/services/bookingFinal";
import { cancelRequest } from "@/services/bookingUser";
import {
  updateApproverLicAnnualCancel,
  updateFinalApproverLicAnnualCancel,
  updateUserLicAnnualCancel,
} from "@/services/driver";
import { keyCancelRequest } from "@/services/keyAdmin";
import { cancelKeyPickup } from "@/services/masterService";
import {
  driverDeleteAddFuelDetail,
  driverDeleteTravelDetail,
} from "@/services/vehicleInUseDriver";
import {
  UserDeleteAddFuelDetail,
  UserDeleteTravelDetail,
} from "@/services/vehicleInUseUser";
import useSwipeDown from "@/utils/swipeDown";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import * as yup from "yup";

interface Props {
  id?: string;
  tripId?: string;
  fuelId?: string;
  title: string;
  desc: string;
  link?: string;
  confirmText: string;
  placeholder?: string;
  cancleFor?: string;
  role?: string;
  datetime?: string;
  tax_invoice_no?: string;
  onBack?: () => void;
  onSuccess?: () => void;
}

const CancelRequestModal = forwardRef<
  { openModal: () => void; closeModal: () => void },
  Props
>(
  (
    {
      id,
      title,
      desc,
      confirmText,
      placeholder,
      cancleFor,
      role,
      tripId,
      fuelId,
      datetime,
      tax_invoice_no,
      onBack,
      onSuccess,
    },
    ref
  ) => {
    const searchParams = useSearchParams();
    const progressType = searchParams.get("progressType");
    const modalRef = useRef<HTMLDialogElement>(null);
    const [inputValue, setInputValue] = useState("");
    const [isValid, setIsValid] = useState(false);
    const { showToast } = useToast();

    const schema = yup.object().shape({
      input: yup.string().required("This field is required"),
    });

    useImperativeHandle(ref, () => ({
      openModal: () => modalRef.current?.showModal(),
      closeModal: () => modalRef.current?.close(),
    }));

    useEffect(() => {
      schema
        .validate({ input: inputValue })
        .then(() => setIsValid(true))
        .catch(() => setIsValid(false));
    }, [inputValue]);
    const router = useRouter();

    const handleConfirm = () => {
      const sendCancelRequest = async () => {
        try {
          const payload = {
            canceled_request_reason: inputValue,
            trn_request_uid: id || "",
          };

          const payloadLic = {
            canceled_request_reason: inputValue,
            trn_request_annual_driver_uid: id || "",
          };
          const res =
            role === "firstApprover"
              ? await firstApprovercancelRequest(payload)
              : role === "admin"
              ? await adminCancelRequest(payload)
              : role === "final"
              ? await finalCancelRequest(payload)
              : role === "key"
              ? await cancelKeyPickup(payload)
              : role === "adminKey"
              ? await keyCancelRequest(payload)
              : role === "userRecordTravel"
              ? await UserDeleteTravelDetail(tripId || "")
              : role === "adminRecordTravel"
              ? await adminDeleteTravelDetail(tripId || "")
              : role === "adminFuel"
              ? await adminDeleteFuelDetail(fuelId || "")
              : role === "userLic"
              ? await updateUserLicAnnualCancel(payloadLic || "")
              : role === "licAdmin"
              ? await updateApproverLicAnnualCancel(payloadLic || "")
              : role === "licFinalAdmin"
              ? await updateFinalApproverLicAnnualCancel(payloadLic || "")
              : role === "recordFuel"
              ? await UserDeleteAddFuelDetail(fuelId || "")
              : role === "driver"
              ? cancleFor === "recordTravel"
                ? await driverDeleteTravelDetail(tripId || "")
                : await driverDeleteAddFuelDetail(fuelId || "")
              : await cancelRequest(payload);
          const data = res.data;
          if (data) {
            modalRef.current?.close();

            if (role === "firstApprover") {
              router.push(
                "/administrator/booking-approver?cancel-req=success&activeTab=คำขอใช้ยานพาหนะ&request-id=" +
                  data.result?.request_no
              );
            } else if (role === "admin") {
              router.push(
                "/administrator/request-list?cancel-req=success&request-id=" +
                  data.result?.request_no
              );
            } else if (role === "final") {
              router.push(
                "/administrator/booking-final?cancel-req=success&request-id=" +
                  data.result?.request_no
              );
            } else if (role === "key") {
              router.push(
                "/vehicle-in-use/user?cancel-req=success&request-id=" +
                  data.result?.request_no
              );
            } else if (role === "adminKey") {
              router.push(
                "/administrator/request-list?cancel-req=success&request-id=" +
                  data.result?.request_no
              );
            } else if (role === "licAdmin" || role === "licFinalAdmin") {
              if (onSuccess) {
                onSuccess;
              }
              router.push(
                "/administrator/booking-approver?cancel-req=success&request-id=" +
                  data.result?.request_no
              );
            } else if (role === "userRecordTravel") {
              router.push(
                `/vehicle-in-use/user/${id}?activeTab=ข้อมูลการเดินทาง&delete-travel-req=success&date-time=${datetime}`
              );
            } else if (role === "recordFuel") {
              router.push(
                `/vehicle-in-use/user/${id}?activeTab=การเติมเชื้อเพลิง&delete-fuel-req=success&tax_invoice_no=${tax_invoice_no}`
              );
            } else if (role === "adminFuel") {
              router.push(
                `/administrator/vehicle-in-use/${id}?activeTab=การเติมเชื้อเพลิง&delete-fuel-req=success&tax_invoice_no=${tax_invoice_no}`
              );
            } else if (role === "userLic") {
              showToast({
                title: "ยกเลิกคำขอสำเร็จ",
                desc: (
                  <>
                    คำขออนุมัติทำหน้าที่ขับรถยนต์ประจำปี
                    <br />
                    เลขที่ {data?.result?.request_annual_driver_no}{" "}
                    ถูกยกเลิกเรียบร้อยแล้ว
                  </>
                ),
                status: "success",
              });
              if (onBack) {
                onBack();
              }
            } else if (role === "adminRecordTravel") {
              router.push(
                `/administrator/vehicle-in-use/${id}?activeTab=เดินทาง&delete-travel-req=success&date-time=${datetime}`
              );
            } else if (role === "driver") {
              router.push(
                "/vehicle-in-use/driver/" +
                  id +
                  "?progressType=" +
                  progressType +
                  (cancleFor === "recordTravel"
                    ? "&delete-travel-req=success"
                    : "&delete-fuel-req=success")
              );
            } else {
              router.push(
                "/vehicle-booking/request-list?cancel-req=success&request-id=" +
                  data.result?.request_no
              );
            }
          }
        } catch (error) {
          console.error("Cancel error:", error);
        }
      };

      sendCancelRequest();
    };

    const swipeDownHandlers = useSwipeDown(() => modalRef.current?.close());

    return (
      <dialog ref={modalRef} className={`modal modal-middle`}>
        <div
          className="modal-box max-w-[500px] p-0 relative overflow-hidden flex flex-col !bg-white"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="bottom-sheet" {...swipeDownHandlers}>
            <div className="bottom-sheet-icon"></div>
          </div>

          <div className="modal-body text-center overflow-y-auto">
            <Image
              src="/assets/img/graphic/confirm_delete.svg"
              className="w-full confirm-img"
              width={100}
              height={100}
              alt=""
            />
            <div className="confirm-title text-xl font-medium">{title}</div>
            <div className="confirm-text text-base">{desc}</div>

            {cancleFor !== "userRecordTravel" &&
              cancleFor !== "adminRecordTravel" &&
              cancleFor !== "recordFuel" && (
                <div className="confirm-form mt-4">
                  <div className="form-group">
                    <div className="input-group">
                      <input
                        type="text"
                        className="form-control"
                        placeholder={placeholder}
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              )}

            <div className="modal-actions mt-5 flex justify-between gap-3">
              <button
                className="btn btn-secondary flex-1"
                onClick={() => modalRef.current?.close()}
              >
                ไม่ใช่ตอนนี้
              </button>

              <button
                type="button"
                className="btn btn-primary-danger flex-1"
                disabled={
                  cancleFor !== "userRecordTravel" &&
                  cancleFor !== "adminRecordTravel" &&
                  cancleFor !== "recordFuel" &&
                  !isValid
                }
                onClick={handleConfirm}
              >
                {confirmText}
              </button>
            </div>
          </div>
        </div>

        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    );
  }
);

CancelRequestModal.displayName = "CancelRequestModal";

export default CancelRequestModal;
