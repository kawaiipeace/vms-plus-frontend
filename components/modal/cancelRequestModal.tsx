import { adminCancelRequest } from "@/services/bookingAdmin";
import { firstApprovercancelRequest } from "@/services/bookingApprover";
import { finalCancelRequest } from "@/services/bookingFinal";
import { cancelRequest } from "@/services/bookingUser";
import { keyCancelRequest } from "@/services/keyAdmin";
import { cancelKeyPickup } from "@/services/masterService";
import { UserDeleteTravelDetail } from "@/services/vehicleInUseUser";
import useSwipeDown from "@/utils/swipeDown";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import * as yup from "yup";

interface Props {
  id: string;
  tripId?: string;
  title: string;
  desc: string;
  link?: string;
  confirmText: string;
  placeholder?: string;
  cancleFor?: string;
  role?: string;
  datetime?: string;
}

const CancelRequestModal = forwardRef<{ openModal: () => void; closeModal: () => void }, Props>(
  ({ id, title, desc, confirmText, placeholder, cancleFor, role, tripId, datetime }, ref) => {
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
            canceled_request_reason: inputValue,
            trn_request_uid: id,
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
              : role === "recordTravel"
              ? await UserDeleteTravelDetail(tripId || "")
              : await cancelRequest(payload);
          const data = res.data;
          if (data) {
            modalRef.current?.close();

            // eslint-disable-next-line @typescript-eslint/no-unused-expressions
            role === "firstApprover"
              ? router.push("/administrator/booking-approver?cancel-req=success&request-id=" + data.result?.request_no)
              : role === "admin"
              ? router.push("/administrator/request-list?cancel-req=success&request-id=" + data.result?.request_no)
              : role === "final"
              ? router.push("/administrator/booking-final?cancel-req=success&request-id=" + data.result?.request_no)
              : role === "final"
              ? router.push("/vehicle-in-use/user?cancel-req=success&request-id=" + data.result?.request_no)
              : role === "adminKey"
              ? router.push("/administrator/request-list?cancel-req=success&request-id=" + data.result?.request_no)
              : role === "recordTravel"
              ? router.push(
                  `/vehicle-in-use/user/${id}?activeTab=ข้อมูลการเดินทาง&delete-travel-req=success&date-time=${datetime}`
                )
              : router.push("/vehicle-booking/request-list?cancel-req=success&request-id=" + data.result?.request_no);
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
        <div className="modal-box max-w-[500px] p-0 relative overflow-hidden flex flex-col !bg-white">
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

            {cancleFor !== "recordTravel" && (
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

            <div className="modal-footer mt-5 grid grid-cols-2 gap-3">
              <form method="dialog" className="col-span-1">
                <button className="btn btn-secondary w-full">ไม่ใช่ตอนนี้</button>
              </form>
              <button
                type="button"
                className="btn btn-primary-danger col-span-1"
                disabled={cancleFor !== "recordTravel" && !isValid}
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
