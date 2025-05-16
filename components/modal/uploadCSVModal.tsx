import React, { forwardRef, useImperativeHandle, useRef } from "react";
import UploadFileCSV from "@/components/uploadFileCSV";

const UploadCSVModal = forwardRef<{ openModal: () => void; closeModal: () => void }>((_, ref) => {
  const modalRef = useRef<HTMLDialogElement>(null);
  useImperativeHandle(ref, () => ({
    openModal: () => modalRef.current?.showModal(),
    closeModal: () => modalRef.current?.close(),
  }));
  return (
    <dialog ref={modalRef} className="modal">
      <div className="modal-box max-w-[600px] p-0 relative overflow-hidden flex flex-col">
        <div className="modal-header bg-white sticky top-0 flex justify-between z-10">
          <div className="modal-title">สร้างข้อมูลพนักงานขับรถจำนวนมาก</div>
          <form method="dialog">
            <button className="close btn btn-icon border-none bg-transparent shadow-none btn-tertiary">
              <i className="material-symbols-outlined">close</i>
            </button>
          </form>
        </div>
        <div className="modal-body overflow-y-auto text-center bg-white">
          <div className="flex mb-3">
            <div className="text-left">
              <h6 className="font-semibold">อัปโหลดไฟล์ .CSV</h6>
              <p className="text-sm">สร้างข้อมูลพนักงานขับรถจำนวนมากด้วยการนำเข้าไฟล์ .CSV</p>
            </div>
            <div className="ml-auto">
              <button>
                <i className="material-symbols-outlined text-[#A80689]">download</i>
                <span className="text-[#A80689] font-bold">ตัวอย่างไฟล์ .csv</span>
              </button>
            </div>
          </div>
          <div>
            <UploadFileCSV onImageChange={() => modalRef.current?.close()} />
          </div>
        </div>
        <div className="modal-footer bg-white pb-5">
          <div className="flex justify-end bg-white px-[1.5rem]">
            <button
              className="btn btn-secondary h-[40px] min-h-[40px] mr-3"
              onClick={() => {
                modalRef.current?.close();
              }}
            >
              ย้อนกลับ
            </button>
            <button
              className="btn h-[40px] min-h-[40px] btn-secondary"
              onClick={() => {
                modalRef.current?.close();
              }}
              disabled
            >
              นำเข้า
            </button>
          </div>
        </div>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>
  );
});

UploadCSVModal.displayName = "UploadCSVModal";

export default UploadCSVModal;
