import React, { forwardRef, useImperativeHandle, useRef } from "react";

const CreateDriverManagementModal = forwardRef<{ openModal: () => void; closeModal: () => void }>((_, ref) => {
  const modalRef = useRef<HTMLDialogElement>(null);
  useImperativeHandle(ref, () => ({
    openModal: () => modalRef.current?.showModal(),
    closeModal: () => modalRef.current?.close(),
  }));
  return (
    <dialog ref={modalRef} className="modal">
      <div className="modal-box max-w-[500px] p-0 relative overflow-hidden flex flex-col">
        <div className="modal-body overflow-y-auto text-center"></div>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>
  );
});

CreateDriverManagementModal.displayName = "CreateDriverManagementModal";

export default CreateDriverManagementModal;
