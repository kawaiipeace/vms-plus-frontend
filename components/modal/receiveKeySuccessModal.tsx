import useSwipeDown from "@/utils/swipeDown";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, {
  forwardRef,
  useImperativeHandle,
  useRef,
} from "react";

interface Props {
  id: string;
  title: string;
  role?: string;
  desc: React.ReactNode;
  confirmText: string;
}

const ReceiveKeySuccessModal = forwardRef<
  { openModal: () => void; closeModal: () => void }, // Ref type
  Props
>(({ id, title, desc, confirmText }, ref) => {
  // Destructure `process` from props
  const modalRef = useRef<HTMLDialogElement>(null);

  useImperativeHandle(ref, () => ({
    openModal: () => modalRef.current?.showModal(),
    closeModal: () => modalRef.current?.close(),
  }));

  const router = useRouter();
  const swipeDownHandlers = useSwipeDown(() => modalRef.current?.close());

  return (
    <>
      <dialog ref={modalRef} className={`modal modal-middle`}>
        <div  className="modal-box max-w-[500px] p-0 relative overflow-hidden flex flex-col">
          <div className="bottom-sheet" {...swipeDownHandlers} >
            <div className="bottom-sheet-icon"></div>
          </div>

          <div className="modal-body overflow-y-auto text-center">
            <Image
              src="/assets/img/graphic/confirm_key.svg"
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
                  กลับหน้าหลัก
                </button>
              </form>
              <button
                type="button"
                className="btn btn-primary col-span-1"
                onClick={() => router.push(`/administrator/request-list/${id}?activeTab="รับกุญแจ"`)}
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

ReceiveKeySuccessModal.displayName = "ReceiveKeySuccessModal";

export default ReceiveKeySuccessModal;
