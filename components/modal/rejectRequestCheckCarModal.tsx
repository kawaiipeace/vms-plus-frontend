import useSwipeDown from "@/utils/swipeDown";
import Image from "next/image";
import React, { forwardRef, useImperativeHandle, useRef } from "react";

interface Props {
  title: string;
  desc: string;
  confirmText: string;
}

const RejectRequestCheckCarModal = forwardRef<
  { openModal: () => void; closeModal: () => void }, // Ref type
  Props
>(({ title, desc, confirmText }, ref) => {
  // Destructure `process` from props
  const modalRef = useRef<HTMLDialogElement>(null);

  useImperativeHandle(ref, () => ({
    openModal: () => modalRef.current?.showModal(),
    closeModal: () => modalRef.current?.close(),
  }));
  const swipeDownHandlers = useSwipeDown(() => modalRef.current?.close());

  return (
    <>
      <dialog ref={modalRef} className={`modal modal-middle`}>
        <div  className="modal-box max-w-[500px] p-0 relative overflow-hidden flex flex-col">
          <div className="bottom-sheet" {...swipeDownHandlers} >
            <div className="bottom-sheet-icon"></div>
          </div>

          <div className="modal-body overflow-y-auto text-center">
            <Image src="/assets/img/graphic/confirm_fileback.svg" className="w-full confirm-img" width={100} height={100} alt="" />
            <div className="confirm-title text-xl font-medium mt-4">{title}</div>
            <div className="confirm-text">{desc}</div>
            <div>
              <h4 className="font-bold text-left mt-4">วันที่ / เวลายืนยันการคืนยานพาหนะ</h4>
              <div className="confirm-form mt-4">
                <div className="form-group">
                  <div className="input-group">
                    <input type="text" className="form-control" placeholder="โปรดระบุเหตุผลที่ตีกลับ" />
                  </div>
                </div>
              </div>
            </div>
            <div className="modal-footer mt-5 grid grid-cols-2 gap-3">
              <form method="dialog col-span-1">
                <button className="btn btn-secondary w-full">ไม่ใช่ตอนนี้</button>
              </form>
              <button type="button" className="btn btn-primary col-span-1">
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

RejectRequestCheckCarModal.displayName = "RejectRequestCheckCarModal";

export default RejectRequestCheckCarModal;
