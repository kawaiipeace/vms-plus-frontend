import DatePicker from "@/components/dateTimePicker";
import useSwipeDown from "@/utils/swipeDown";
import Image from "next/image";
import { forwardRef, useImperativeHandle, useRef, useState } from "react";

interface Props {
  title: string;
  desc: string;
  confirmText: string;
}

const ApproveRequestCheckCarModal = forwardRef<
  { openModal: () => void; closeModal: () => void }, // Ref type
  Props
>(({ title, desc, confirmText }, ref) => {
  // Destructure `process` from props
  const modalRef = useRef<HTMLDialogElement>(null);
  const [openModal, setOpenModal] = useState(false);

  useImperativeHandle(ref, () => ({
    openModal: () => {
      modalRef.current?.showModal();
      setOpenModal(true);
    },
    closeModal: () => {
      modalRef.current?.close();
      setOpenModal(false);
    },
  }));

  const handleCloseModal = () => {
    modalRef.current?.close();
    setOpenModal(false); // Update state to reflect modal is closed
  };

  const swipeDownHandlers = useSwipeDown(handleCloseModal);

  return (
    <>
      {openModal && (
        <div className={`modal modal-middle modal-open`}>
          <div className="modal-box max-w-[500px] p-0 relative overflow-hidden flex flex-col">
            <div className="bottom-sheet" {...swipeDownHandlers}>
              <div className="bottom-sheet-icon"></div>
            </div>
            <div className="modal-scroll-wrapper overflow-y-auto">
              <div className="modal-body  text-center">
                <Image
                  src="/assets/img/graphic/check_car_complete.svg"
                  className="w-full confirm-img"
                  width={100}
                  height={100}
                  alt=""
                />
                <div className="confirm-title text-xl font-medium mt-4">{title}</div>
                <div className="confirm-text">{desc}</div>
                <div>
                  <h4 className="font-bold text-left mt-4">วันที่ / เวลายืนยันการคืนยานพาหนะ</h4>
                  <div className="confirm-form mt-4">
                    <div className="form-group">
                      <div className="input-group">
                        <DatePicker id="approveCheckCarDate" placeholder="วันที่ / เวลา" />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="modal-action mt-5 grid grid-cols-2 gap-3">
                  <form method="dialog col-span-1" onClick={handleCloseModal}>
                    <button className="btn btn-secondary w-full">ไม่ใช่ตอนนี้</button>
                  </form>
                  <button type="button" className="btn btn-primary col-span-1">
                    {confirmText}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
});

ApproveRequestCheckCarModal.displayName = "ApproveRequestCheckCarModal";

export default ApproveRequestCheckCarModal;
