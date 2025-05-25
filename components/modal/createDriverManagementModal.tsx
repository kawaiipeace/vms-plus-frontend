import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { forwardRef, useImperativeHandle, useRef } from "react";

interface CreateDriverManagementModalProps {
  csvModalRef: React.RefObject<{
    openModal: () => void;
    closeModal: () => void;
  }>;
}

const CreateDriverManagementModal = forwardRef<
  { openModal: () => void; closeModal: () => void },
  CreateDriverManagementModalProps
>(({ csvModalRef }, ref) => {
  const modalRef = useRef<HTMLDialogElement>(null);
  const router = useRouter();
  useImperativeHandle(ref, () => ({
    openModal: () => modalRef.current?.showModal(),
    closeModal: () => modalRef.current?.close(),
  }));
  return (
    <dialog ref={modalRef} className="modal">
      <div className="modal-box max-w-[600px] p-0 relative overflow-hidden flex flex-col">
        <div className="modal-header bg-white sticky top-0 flex justify-between z-10">
          <div className="modal-title">เพิ่มข้อมูลนัดหมายพนักงานขับรถ</div>
          <form method="dialog">
            <button className="close btn btn-icon border-none bg-transparent shadow-none btn-tertiary">
              <i className="material-symbols-outlined">close</i>
            </button>
          </form>
        </div>
        <div className="modal-body overflow-y-auto text-center bg-white">
          <button
            className="flex border-slate-300 border-[1px] rounded-2xl shadow-none w-full p-3 mb-3"
            onClick={() => router.push("/drivers-management/create")}
          >
            <div>
              <Image src="/assets/img/empty/add_driver.svg" width={120} height={120} alt="driver" />
            </div>
            <div className="text-left px-5">
              <h6 className="font-bold text-lg">สร้างรายบุคคล</h6>
              <p>กรอกรายละเอียดข้อมูลเพิ่มเติม</p>
            </div>
            <div className="ml-auto">
              <i className="material-symbols-outlined text-brand-900">arrow_forward_ios</i>
            </div>
          </button>
          <button
            className="flex border-slate-300 border-[1px] rounded-2xl shadow-none w-full p-3"
            onClick={() => {
              csvModalRef.current?.openModal();
              modalRef.current?.close();
            }}
          >
            <div>
              <Image src="/assets/img/graphic/csv_import.svg" width={120} height={120} alt="csv" />
            </div>
            <div className="text-left px-5">
              <h6 className="font-bold text-lg">สร้างข้อมูลพนักงานขับรถ</h6>
              <p>อัปโหลดไฟล์ .CSV</p>
            </div>
            <div className="ml-auto">
              <i className="material-symbols-outlined text-brand-900">arrow_forward_ios</i>
            </div>
          </button>
        </div>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>
  );
});

CreateDriverManagementModal.displayName = "CreateDriverManagementModal";

export default CreateDriverManagementModal;
