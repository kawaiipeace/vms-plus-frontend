import React, { forwardRef, useImperativeHandle, useRef } from "react";
import CustomSelect from "./customSelect";

const DisbursementModal = forwardRef((_, ref) => {
  const modalRef = useRef<HTMLDialogElement>(null);

  useImperativeHandle(ref, () => ({
    openModal: () => modalRef.current?.showModal(),
    closeModal: () => modalRef.current?.close(),
  }));

  const options = [
    "งบทำการ หน่วยงานต้นสังกัด",
    "หน่วยงานต้นสังกัด",
    "งบทำการ หน่วยงานต้นสังกั",
  ];

  return (
    <dialog ref={modalRef} id="my_modal_1" className="modal">
      <div className="modal-box max-w-[500px] p-0 relative modal-vehicle-pick overflow-hidden flex flex-col max-h-[90vh]">
        <div className="bottom-sheet">
          <div className="bottom-sheet-icon"></div>
        </div>
        <div className="modal-header bg-white sticky top-0 flex justify-between z-10">
          <div className="modal-title">แก้ไขการเบิกค่าใช้จ่าย</div>
          <form method="dialog">
            <button className="close btn btn-icon border-none bg-transparent shadow-none btn-tertiary">
              <i className="material-symbols-outlined">close</i>
            </button>
          </form>
        </div>
        <div className="modal-body overflow-y-auto">
          <div className="grid grid-cols-12 gap-4">
            <div className="col-span-12">
                <CustomSelect iconName="paid" w="w-full" options={options} />
            </div>

            <div className="col-span-12">
              <div className="form-group">
                <label className="form-label">ศูนย์ต้นทุน</label>
                <div className="input-group is-readonly">
                  <div className="input-group-prepend">
                    <span className="input-group-text">
                      <i className="material-symbols-outlined">
                        account_balance
                      </i>
                    </span>
                  </div>
                  <input
                    type="text"
                    className="form-control"
                    placeholder=""
                    defaultValue="ZA04020200 : กบห.กอพ.1-บห."
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="modal-action sticky bottom-0 gap-3 mt-0">
          <form method="dialog">
            <button className="btn btn-secondary">ยกเลิก</button>
          </form>
          <form method="dialog">
            <button className="btn btn-primary">ยืนยัน</button>
          </form>
        </div>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>
  );
});

DisbursementModal.displayName = "DisbursementModal";

export default DisbursementModal;
