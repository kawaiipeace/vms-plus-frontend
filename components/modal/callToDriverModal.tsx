import { formatPhoneNumber } from "@/utils/formatPhoneNumber";
import useSwipeDown from "@/utils/swipeDown";
import Image from "next/image";
import { forwardRef, useImperativeHandle, useRef } from "react";

interface Props {
  imgSrc: string;
  name: string;
  phone: string;
  title?: string;
  subTitle?: string;
}

const CallToDriverModal = forwardRef<
  { openModal: () => void; closeModal: () => void }, // Ref type
  Props // Props type
>(
  (
    { imgSrc, name, phone, title = "ติดต่อผู้ดูแลยานพาหนะ", subTitle = "คุณต้องการโทรหาผู้ดูแลยานพาหนะหรือไม่?" },
    ref
  ) => {
    const modalRef = useRef<HTMLDialogElement>(null);

    useImperativeHandle(ref, () => ({
      openModal: () => modalRef.current?.showModal(),
      closeModal: () => modalRef.current?.close(),
    }));

    const swipeDownHandlers = useSwipeDown(() => modalRef.current?.close());

    return (
      <dialog ref={modalRef} id="my_modal_1" className="modal">
        <div className="modal-box max-w-[500px] p-0 pb-4 relative modal-vehicle-pick overflow-hidden flex flex-col max-h-[90vh]">
          <div className="bottom-sheet" {...swipeDownHandlers}>
            <div className="bottom-sheet-icon"></div>
          </div>
          <div className="modal-header bg-white sticky top-0 flex justify-between z-10">
            <div className="modal-title text-center flex flex-col justify-center">
              <p>{title}</p>
              <p className="font-normal">{subTitle}</p>
            </div>
           
        
            <form method="dialog">
              <button className="close btn btn-icon border-none bg-transparent shadow-none btn-tertiary">
                <i className="material-symbols-outlined">close</i>
              </button>
            </form>
          </div>
          <div className="modal-body overflow-y-auto px-4 mt-4">
            <div className="card card-body p-0">
              <div className="flex items-center gap-3 p-3 rounded-xl">
                <div className="w-[80px] h-[80px] overflow-hidden rounded-full relative">
                  <Image className="object-cover object-center" src={imgSrc} alt={name} layout="fill" />
                </div>
                <div>
                  <h6 className="font-bold text-xl">{name || "-"}</h6>
                  <p className="text-xl">{ formatPhoneNumber(phone) || "-"}</p>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 mt-4">
              <form method="dialog">
                <button className="btn btn-secondary w-full">ไม่ใช่ตอนนี้</button>
              </form>
              <form
                method="dialog"
                onSubmit={(e) => {
                  e.preventDefault();
                  window.location.href = `tel:${phone}`;
                }}
              >
                <button className="btn btn-primary w-full">โทรออก</button>
              </form>
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

CallToDriverModal.displayName = "CallToDriverModal";

export default CallToDriverModal;
