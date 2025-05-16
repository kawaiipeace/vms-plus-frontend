import React, { forwardRef, useImperativeHandle, useRef } from "react";

const DriverEditLicenseModal = forwardRef<{ openModal: () => void; closeModal: () => void }>((_, ref) => {
  const modalRef = useRef<HTMLDialogElement>(null);

  useImperativeHandle(ref, () => ({
    openModal: () => modalRef.current?.showModal(),
    closeModal: () => modalRef.current?.close(),
  }));

  return (
    <dialog ref={modalRef} className={`modal modal-middle`}>
      <div className="modal-box max-w-[500px] p-0 relative overflow-hidden flex flex-col bg-white">
        <div className="modal-header bg-white sticky top-0 flex justify-between z-10">
          <div className="modal-title">แก้ไขเอกสารเพิ่มเติม</div>
          <form method="dialog">
            <button className="close btn btn-icon border-none bg-transparent shadow-none btn-tertiary">
              <i className="material-symbols-outlined">close</i>
            </button>
          </form>
        </div>
        <div className="modal-body overflow-y-auto text-center border-b-[1px] border-[#E5E5E5]">
          <div className="form-section">
            <div className="form-section-body"></div>
          </div>
        </div>
        <div className="modal-footer mt-5 flex gap-3 justify-end px-4 pb-4">
          <div>
            <button className="btn btn-secondary w-full" onClick={() => modalRef.current?.close()}>
              ยกเลิก
            </button>
          </div>
          <button type="button" className="btn btn-primary">
            บันทึก
          </button>
        </div>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>
  );
});

DriverEditLicenseModal.displayName = "DriverEditLicenseModal";

export default DriverEditLicenseModal;
