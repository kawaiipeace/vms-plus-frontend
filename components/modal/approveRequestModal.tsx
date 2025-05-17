import { firstApproverApproveRequest } from "@/services/bookingApprover";
import { finalApproveRequest } from "@/services/bookingFinal";
import { approveAnnualFinalLic, approveAnnualLic } from "@/services/driver";
import useSwipeDown from "@/utils/swipeDown";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { forwardRef, useImperativeHandle, useRef } from "react";

interface Props {
  id?: string;
  title: string;
  role?: string;
  desc: React.ReactNode;
  confirmText: string;
}

const ApproveRequestModal = forwardRef<
  { openModal: () => void; closeModal: () => void }, // Ref type
  Props
>(({ id, title, role, desc, confirmText }, ref) => {
  const modalRef = useRef<HTMLDialogElement>(null);

  useImperativeHandle(ref, () => ({
    openModal: () => modalRef.current?.showModal(),
    closeModal: () => modalRef.current?.close(),
  }));

  const router = useRouter();

  const handleConfirm = () => {
    const sendApproveRequest = async () => {
      try {
        let res;

        if (role === "licAdmin" || role === "licFinalAdmin") {
          const payload = {
            trn_request_annual_driver_uid: id,
          };
          if(role === "licAdmin"){
            res = await approveAnnualLic(payload);
          }else{
            res = await approveAnnualFinalLic(payload);
          }
       
        } else {
          const payload = {
            trn_request_uid: id || "",
          };
          res =
            role === "firstApprover"
              ? await firstApproverApproveRequest(payload)
              : await finalApproveRequest(payload);
        }

        if (res) {
          modalRef.current?.close();
          let requestId;
          if(role==="licAdmin" || role==="licFinalAdmin"){
            requestId = res.data?.result?.request_annual_driver_no;
          }else{
            requestId = res.data?.result?.request_no;
          }
    
          if (!requestId) return; // optional: handle missing request ID

          let basePath;
          switch (role) {
            case "firstApprover":
              basePath = "/administrator/booking-approver";
              break;
            case "licAdmin":
              basePath = "/administrator/booking-approver"; // Adjust this path as needed
              break;
            case "licFinalAdmin":
              basePath = "/administrator/booking-approver"; // Adjust this path as needed
              break;

            default:
              basePath = "/administrator/booking-final";
          }
          if (role === "licAdmin") {
            
            router.push(
              `${basePath}?approvelic-req=success&request-id=${requestId}`
            );
          }else  if (role === "licFinalAdmin") {
            router.push(
              `${basePath}?approvelicfinal-req=success&request-id=${requestId}`
            );
          }else {
            router.push(
              `${basePath}?approve-req=success&request-id=${requestId}`
            );
          }
        }
      } catch (error) {
        console.error("error:", error);
      }
    };

    sendApproveRequest();
  };

  const swipeDownHandlers = useSwipeDown(() => modalRef.current?.close());

  return (
    <>
      <dialog ref={modalRef} className={`modal modal-middle`}>
        <div className="modal-box max-w-[500px] p-0 relative overflow-hidden flex flex-col">
          <div className="bottom-sheet" {...swipeDownHandlers}>
            <div className="bottom-sheet-icon"></div>
          </div>

          <div className="modal-body overflow-y-auto text-center">
            <Image
              src="/assets/img/graphic/confirm_request.svg"
              className="w-full confirm-img"
              width={100}
              height={100}
              alt=""
            />
            <div className="confirm-title text-xl font-medium">{title}</div>
            <div className="confirm-text">{desc}</div>
            <div className="modal-footer mt-5 grid grid-cols-2 gap-3">
              <form method="dialog" className="col-span-1">
                <button className="btn btn-secondary w-full">
                  ไม่ใช่ตอนนี้
                </button>
              </form>
              <button
                type="button"
                className="btn btn-primary col-span-1"
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

ApproveRequestModal.displayName = "ApproveRequestModal";

export default ApproveRequestModal;
