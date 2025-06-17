import useSwipeDown from "@/utils/swipeDown";
import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";

interface Props {
  onCloseModal: () => void;
  message?: React.ReactNode;
}

const ErrorLoginModal = forwardRef<
  { openModal: () => void; closeModal: () => void }, // Ref type
  Props // Props type
>(({ onCloseModal, message = (
  <>
    คุณไม่มีสิทธิเข้าใช้งานระบบ<br />
    กรุณาติดต่อผู้ดูแลหากต้องการเข้าใช้งาน
  </>
) }, ref) => {
  const modalRef = useRef<HTMLDialogElement>(null);

  useImperativeHandle(ref, () => ({
    openModal: () => modalRef.current?.showModal(),
    closeModal: () => {
      modalRef.current?.close();
    },
  }));

  useEffect(() => {
    const dialog = modalRef.current;
    if (!dialog) return;

    const handleClose = () => {
      console.log("Modal has closed");
      onCloseModal();
      // TODO: รีเซ็ต state อื่น ๆ หรือตั้งค่าใหม่ตรงนี้
    };

    dialog.addEventListener("close", handleClose);
    return () => {
      dialog.removeEventListener("close", handleClose);
    };
  }, [onCloseModal]);

  const swipeDownHandlers = useSwipeDown(() => {
    modalRef.current?.close();
  });

  return (
    <dialog ref={modalRef} id="my_modal_3" className="modal">
      <div className="modal-box">
        <div className="bottom-sheet" {...swipeDownHandlers}>
          <div className="bottom-sheet-icon"></div>
        </div>
        <form method="dialog">
          {/* if there is a button in form, it will close the modal */}
          <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
        </form>
        <div className="p-8">
          <h3 className="font-bold text-lg">{message}</h3>
        </div>
      </div>
    </dialog>
  );
});

ErrorLoginModal.displayName = "ErrorLoginModal";

export default ErrorLoginModal;
