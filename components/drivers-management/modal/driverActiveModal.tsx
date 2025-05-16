import React, { forwardRef, useImperativeHandle, useRef, Suspense } from "react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";

interface Props {
  title: string;
  desc: string | React.ReactNode;
  confirmText?: string;
  onUpdateDriver?: (driverId: string, isActive: string) => void;
  driverUid?: string;
  useInView?: boolean;
}

function ActiveButton({
  driverUid,
  onUpdateDriver,
  useInView,
  confirmText,
  modalRef,
}: {
  driverUid?: string;
  onUpdateDriver?: (driverId: string, isActive: string) => void;
  useInView?: boolean;
  confirmText?: string;
  modalRef: React.RefObject<HTMLDialogElement | null>;
}) {
  const searchParams = useSearchParams();
  const acive = useInView ? (searchParams.get("active") === "1" ? "0" : "1") : "0";
  return (
    <button
      type="button"
      className="btn bg-[#D92D20] hover:bg-[#D92D20] text-white border-[#D92D20] hover:border-[#D92D20] col-span-1"
      onClick={() => {
        if (driverUid) {
          onUpdateDriver?.(driverUid, acive);
          modalRef.current?.close();
        }
      }}
    >
      {confirmText}
    </button>
  );
}

const DriverActiveModal = forwardRef<{ openModal: () => void; closeModal: () => void }, Props>(
  ({ title, desc, confirmText, onUpdateDriver, driverUid, useInView }, ref) => {
    const modalRef = useRef<HTMLDialogElement>(null);
    useImperativeHandle(ref, () => ({
      openModal: () => modalRef.current?.showModal(),
      closeModal: () => modalRef.current?.close(),
    }));

    return (
      <dialog ref={modalRef} className={`modal modal-middle`}>
        <div className="modal-box max-w-[500px] p-0 relative overflow-hidden flex flex-col bg-white">
          <div className="modal-body overflow-y-auto text-center">
            <Image
              src="/assets/img/graphic/deactive.svg"
              className="w-full confirm-img mb-5"
              width={100}
              height={100}
              alt=""
            />
            <div className="confirm-title text-xl font-medium">{title}</div>
            <div className="confirm-text">{desc}</div>
            <div className="modal-footer mt-5 grid grid-cols-2 gap-3">
              <form method="dialog" className="col-span-1">
                <button className="btn btn-secondary w-full">ไม่ใช่ตอนนี้</button>
              </form>
              <Suspense fallback={<div>Loading...</div>}>
                <ActiveButton
                  driverUid={driverUid}
                  onUpdateDriver={onUpdateDriver}
                  useInView={useInView}
                  confirmText={confirmText}
                  modalRef={modalRef}
                />
              </Suspense>
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

DriverActiveModal.displayName = "DriverActiveModal";

export default DriverActiveModal;
