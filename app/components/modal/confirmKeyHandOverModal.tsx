import React, { forwardRef, useImperativeHandle, useRef } from "react";
import Image from "next/image";
import KeyPickupDetailModal from "./keyPickUpDetailModal";

interface Props {
  id?: string;
}

const ConfirmKeyHandOverModal = forwardRef<
  { openModal: () => void; closeModal: () => void }, // Ref type
  Props
>(({ id }, ref) => {
  // Destructure `process` from props
  const modalRef = useRef<HTMLDialogElement>(null);

  const keyPickUpDetailModalRef = useRef<{
    openModal: () => void;
    closeModal: () => void;
  } | null>(null);

  useImperativeHandle(ref, () => ({
    openModal: () => modalRef.current?.showModal(),
    closeModal: () => modalRef.current?.close(),
  }));

  return (
    <>
      <dialog ref={modalRef} className={`modal modal-middle`}>
        <div className="modal-box max-w-[500px] p-0 relative overflow-hidden flex flex-col">
          <div className="bottom-sheet">
            <div className="bottom-sheet-icon"></div>
          </div>

          <div className="modal-body text-center overflow-y-auto">
            <Image
              src="/assets/img/graphic/confirm_key.svg"
              className="w-full confirm-img"
              width={100}
              height={100}
              alt=""
            />
            <div className="confirm-title text-xl font-medium">
              ยืนยันให้กุญแจ
            </div>
            <div className="confirm-text text-base">
              ข้อมูลผู้มารับกุญแจ วันที่ เวลา และสิ่งที่ส่งมอบ <br></br>
              จะไม่สามารถกลับมาแก้ไขได้อีก
            </div>

            <div className="modal-footer mt-5 grid grid-cols-2 gap-3">
              <form method="dialog col-span-1">
                <button
                  className="btn btn-secondary w-full"
                  onClick={() => {
                    keyPickUpDetailModalRef.current?.openModal();
                    modalRef.current?.close()
                  }}
                >
                  ย้อนกลับ
                </button>
              </form>
              <button type="button" className="btn btn-primary col-span-1">
                ให้กุญแจ
              </button>
            </div>
          </div>
        </div>

        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
        <KeyPickupDetailModal ref={keyPickUpDetailModalRef} />
      </dialog>
    </>
  );
});

ConfirmKeyHandOverModal.displayName = "ConfirmKeyHandOverModal";

export default ConfirmKeyHandOverModal;
