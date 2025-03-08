import React, { forwardRef, useImperativeHandle, useRef } from "react";
import Image from "next/image";

interface Props {
  title: string;
  desc: string;
  link?: string;
  confirmText: string;
  placeholder?: string;
  cancleFor?: string;
}

const CancelRequestModal = forwardRef<
  { openModal: () => void; closeModal: () => void }, // Ref type
  Props
>(({ title, desc, confirmText, placeholder, cancleFor }, ref) => {
  // Destructure `process` from props
  const modalRef = useRef<HTMLDialogElement>(null);

  useImperativeHandle(ref, () => ({
    openModal: () => modalRef.current?.showModal(),
    closeModal: () => modalRef.current?.close(),
  }));

  return (
    <>
      <dialog ref={modalRef} className={`modal modal-middle`}>
        <div className="modal-box max-w-[500px] p-0 relative overflow-hidden flex flex-col !bg-white">
          <div className="bottom-sheet">
            <div className="bottom-sheet-icon"></div>
          </div>

          <div className="modal-body text-center overflow-y-auto">
            <Image src="/assets/img/graphic/confirm_delete.svg" className="w-full confirm-img" width={100} height={100} alt="" />
            <div className="confirm-title text-xl font-medium">{title}</div>
            <div className="confirm-text text-base">{desc}</div>
            {cancleFor !== "recordTravel" && (
              <div className="confirm-form mt-4">
                <div className="form-group">
                  <div className="input-group">
                    <input type="text" className="form-control" placeholder={placeholder} />
                  </div>
                </div>
              </div>
            )}
            <div className="modal-footer mt-5 grid grid-cols-2 gap-3">
              <form method="dialog col-span-1">
                <button className="btn btn-secondary w-full">ไม่ใช่ตอนนี้</button>
              </form>
              <button type="button" className="btn btn-primary-danger col-span-1">
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

CancelRequestModal.displayName = "CancelRequestModal";

export default CancelRequestModal;
