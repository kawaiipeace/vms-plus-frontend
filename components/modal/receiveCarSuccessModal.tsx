import { VehicleUserTravelCardType } from "@/app/types/vehicle-user-type";
import useSwipeDown from "@/utils/swipeDown";
import Image from "next/image";
import { forwardRef, useImperativeHandle, useRef } from "react";
import TravelCardModal from "./travelCardModal";

interface ReceiveCarSuccessModalProps {
  requestData?: VehicleUserTravelCardType;
}

const ReceiveCarSuccessModal = forwardRef<
  { openModal: () => void; closeModal: () => void },
  ReceiveCarSuccessModalProps
>(({ requestData }, ref) => {
  const modalRef = useRef<HTMLDialogElement>(null);

  useImperativeHandle(ref, () => ({
    openModal: () => modalRef.current?.showModal(),
    closeModal: () => modalRef.current?.close(),
  }));

  const travelCardModalRef = useRef<{
    openModal: () => void;
    closeModal: () => void;
  } | null>(null);
  const swipeDownHandlers = useSwipeDown(() => modalRef.current?.close());

  return (
    <dialog ref={modalRef} className="modal">
      <div className="modal-box max-w-[500px] p-0 relative overflow-hidden flex flex-col">
        <div className="bottom-sheet" {...swipeDownHandlers}>
          <div className="bottom-sheet-icon"></div>
        </div>

        <div className="modal-body overflow-y-auto text-center">
          <Image
            src="/assets/img/graphic/receiveCarSuccess.svg"
            className="w-full confirm-img"
            width={100}
            height={100}
            alt=""
          />
          <div className="confirm-title text-xl font-medium mt-3">รับยานพาหนะสำเร็จ</div>
          <div className="confirm-text">
            ในวันเดินทาง คุณต้องนำบัตรเดินทางไปแสดง กับเจ้าหน้าที่รักษาความปลอดภัยที่ป้อมยาม ก่อนออกจาก กฟภ.
          </div>
          <div className="modal-footer mt-5 grid grid-cols-1 gap-3">
            <button
              type="button"
              className="btn btn-primary col-span-1"
              onClick={() => {
                travelCardModalRef.current?.openModal();
                modalRef.current?.close();
              }}
            >
              แสดงบัตรเดินทาง
            </button>
          </div>
        </div>
      </div>
      <TravelCardModal ref={travelCardModalRef} requestData={requestData} />
    </dialog>
  );
});

ReceiveCarSuccessModal.displayName = "ReceiveCarSuccessModal";

export default ReceiveCarSuccessModal;
