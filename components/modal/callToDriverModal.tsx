import React, { forwardRef, useImperativeHandle, useRef } from "react";
import Image from "next/image";
import useSwipeDown from "@/utils/swipeDown";

interface Props {
  imgSrc: string;
  name: string;
  phone: string;
}

const CallToDriverModal = forwardRef<
  { openModal: () => void; closeModal: () => void }, // Ref type
  Props // Props type
>(({ imgSrc, name, phone }, ref) => {
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
          <div className="modal-title text-center">
            ติดต่อผู้ดูแลยานพาหนะ
            <p className="font-normal">
              คุณต้องการโทรหาผู้ดูแลยานพาหนะหรือไม่?
            </p>
          </div>
          <form method="dialog">
            <button className="close btn btn-icon border-none bg-transparent shadow-none btn-tertiary">
              <i className="material-symbols-outlined">close</i>
            </button>
          </form>
        </div>
        <div className="modal-body overflow-y-auto px-4 mt-4">
          <div className="flex items-center gap-3 bg-[#F9FAFB] p-3 rounded-xl">
            <div className="w-[80px] h-[80px] overflow-hidden rounded-full relative">
              <Image
                className="object-cover object-center"
                src={imgSrc}
                alt={name}
                layout="fill"
              />
            </div>
            <div>
              <h6 className="font-bold text-xl">{name}</h6>
              <p className="text-xl">{phone}</p>
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
});

CallToDriverModal.displayName = "CallToDriverModal";

export default CallToDriverModal;
