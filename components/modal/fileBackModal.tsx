import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import Image from "next/image";
import * as yup from "yup";
import { useRouter } from "next/navigation";
import { firstApproverSendbackRequest } from "@/services/bookingApprover";
import useSwipeDown from "@/utils/swipeDown";
import { adminSendbackRequest } from "@/services/bookingAdmin";
import { finalSendbackRequest } from "@/services/bookingFinal";
import { adminSendBackVehicle } from "@/services/adminService";
import { updateFinalLicAnnualReject, updateLicAnnualReject } from "@/services/driver";

interface Props {
  id?: string;
  title: string;
  desc: React.ReactNode;
  link?: string;
  confirmText: string;
  placeholder?: string;
  role?: string;
  onSuccess?: () => void;
}

const FileBackRequestModal = forwardRef<
  { openModal: () => void; closeModal: () => void }, // Ref type
  Props
>(({ id, title, desc, link, confirmText, placeholder, role, onSuccess }, ref) => {
  // Destructure `process` from props
  const modalRef = useRef<HTMLDialogElement>(null);
  const [inputValue, setInputValue] = useState("");
  const [isValid, setIsValid] = useState(false);

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
          rejected_request_reason: inputValue,
          trn_request_uid: id || "",
        };

        const payloadLic = {
          rejected_request_reason: inputValue,
          trn_request_annual_driver_uid: id || "",
        };
        const res =
          role === "firstApprover"
            ? await firstApproverSendbackRequest(payload)
            : role === "admin"
            ? await adminSendbackRequest(payload)
            : role === "vehicleAdmin"
            ? await adminSendBackVehicle(payload)
            : role === "licAdmin"
            ? await updateLicAnnualReject(payloadLic)
            : role === "licFinalAdmin"
            ? await updateFinalLicAnnualReject(payloadLic)
            : role === "final"
            ? await finalSendbackRequest(payload)
            : await firstApproverSendbackRequest(payload);
        const data = res.data;
        if (data) {
          modalRef.current?.close();

          if (role === "firstApprover") {
            router.push(
              "/administrator/booking-confirmer?sendback-req=success&activeTab=คำขอใช้ยานพาหนะ&request-id=" +
                data.result?.request_no
            );
          } else if (role === "admin") {
            router.push(
              "/administrator/request-list?sendback-req=success&request-id=" +
                data.result?.request_no
            );
          } else if (role === "vehicleAdmin") {
            router.push(
              "/administrator/request-list?sendbackvehicle-req=success&request-id=" +
                data.result?.request_no
            );
          } else if (role === "licAdmin") {
            if(onSuccess) {
              onSuccess()
            }
   
            router.push(
              "/administrator/booking-confirmer?activeTab=คำขออนุมัติทำหน้าที่ขับรถยนต์&sendbacklic-req=success&request-id=" +
                data.result?.request_annual_driver_no
            );
          } else if (role === "licFinalAdmin") {
            router.push(
              "/administrator/booking-approver?sendbackfinallic-req=success&request-id=" +
              data.result?.request_annual_driver_no
            );
          }else if (role === "final") {
            router.push(
              "/administrator/booking-final?sendback-req=success&request-id=" +
                data.result?.request_no
            );
          } else {
            router.push(
              "/vehicle-booking/request-list?sendback-req=success&request-id=" +
                data.result?.request_no
            );
          }
          
        }
      } catch (error) {
        console.error("error:", error);
      }
    };

    sendCancelRequest();
  };
  const swipeDownHandlers = useSwipeDown(() => modalRef.current?.close());

  return (
    <>
      <dialog ref={modalRef} className={`modal modal-middle`}>
        <div className="modal-box max-w-[500px] p-0 relative overflow-hidden flex flex-col">
          <div className="bottom-sheet" {...swipeDownHandlers}>
            <div className="bottom-sheet-icon"></div>
          </div>

          <div className="modal-body text-center overflow-y-auto">
            <Image
              src="/assets/img/graphic/confirm_fileback.svg"
              className="w-full confirm-img"
              width={100}
              height={100}
              alt=""
            />
            <div className="confirm-title text-xl font-medium">{title}</div>
            <div className="confirm-text text-base">{desc}</div>
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
            <div className="modal-footer mt-5 grid grid-cols-2 gap-3">
              <form method="dialog" className="col-span-1">
                <button className="btn btn-secondary w-full">
                  ไม่ใช่ตอนนี้
                </button>
              </form>
              <button
                type="button"
                className="btn btn-primary col-span-1"
                disabled={!isValid}
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
    </>
  );
});

FileBackRequestModal.displayName = "FileBackRequestModal";

export default FileBackRequestModal;
