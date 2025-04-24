import React, { forwardRef, useImperativeHandle, useRef } from "react";
import Image from "next/image";
import useSwipeDown from "@/utils/swipeDown";

export const CallToDriverModal = forwardRef((_, ref) => {
  const modalRef = useRef<HTMLDialogElement>(null);

  useImperativeHandle(ref, () => ({
    openModal: () => modalRef.current?.showModal(),
    closeModal: () => modalRef.current?.close(),
  }));

  const swipeDownHandlers = useSwipeDown(() => modalRef.current?.close());

  return (
    <dialog ref={modalRef} id="my_modal_1" className="modal">
      <div  className="modal-box max-w-[500px] p-0 pb-4 relative modal-vehicle-pick overflow-hidden flex flex-col max-h-[90vh]">
        <div className="modal-header bg-white sticky top-0 flex justify-between z-10">
          <div className="modal-title text-center">
            ติดต่อผู้ดูแลยานพาหนะ<p className="font-normal">คุณต้องการโทรหาผู้ดูแลยานพาหนะหรือไม่ ?</p>
          </div>
          <form method="dialog">
            <button className="close btn btn-icon border-none bg-transparent shadow-none btn-tertiary">
              <i className="material-symbols-outlined">close</i>
            </button>
          </form>
        </div>
        <div className="modal-body overflow-y-auto">
          <div className="flex items-center gap-3 bg-[#F9FAFB] p-3 rounded-xl">
            <div className="w-[80px] overflow-hidden rounded-full">
              <Image className="object-cover object-center" src="/assets/img/sample-avatar.png" alt="phone-call" width={200} height={200} />
            </div>
            <div>
              <h6 className="font-bold text-xl">วิทยา สว่างวงษ์</h6>
              <p className="text-xl">091-234-5678</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 mt-4">
            <form method="dialog">
              <button className="btn btn-secondary w-full">ไม่ใช่ตอนนี้</button>
            </form>
            <form method="dialog">
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
