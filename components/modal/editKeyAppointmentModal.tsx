import React, { forwardRef, useImperativeHandle, useRef } from "react";
import NumberInput from "@/components/numberInput";
import TimePicker from "@/components/timePicker";
import DatePicker from "@/components/datePicker";
import useSwipeDown from "@/utils/swipeDown";

const EditKeyAppointmentModal = forwardRef((_, ref) => {
  const modalRef = useRef<HTMLDialogElement>(null);

  useImperativeHandle(ref, () => ({
    openModal: () => modalRef.current?.showModal(),
    closeModal: () => modalRef.current?.close(),
  }));

  const swipeDownHandlers = useSwipeDown(() => modalRef.current?.close());

  return (
    <dialog ref={modalRef} id="my_modal_1" className="modal">
      <div className="modal-box max-w-[500px] p-0 relative overflow-hidden flex flex-col max-h-[90vh]">
        <div className="bottom-sheet" {...swipeDownHandlers}>
          <div className="bottom-sheet-icon"></div>
        </div>
        <div className="modal-header bg-white sticky top-0 flex justify-between z-10">
          <div className="modal-title">แก้ไขนัดหมายรับกุญแจ</div>
          {/* ปุ่ม close */}
          <button
            type="button"
            onClick={() => modalRef.current?.close()}
            className="close btn btn-icon border-none bg-transparent shadow-none btn-tertiary"
          >
            <i className="material-symbols-outlined">close</i>
          </button>
        </div>

        <div className="modal-body overflow-y-auto">
          <div className="grid grid-cols-12 gap-4">
            <div className="col-span-12 md:col-span-6">
              <div className="form-group">
                <label className="form-label">สถานที่รับกุญแจ</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder=""
                  defaultValue="การไฟฟ้าเขต ฉ.1 และ กฟฟ. ในสังกัด"
                />
              </div>
            </div>
            <div className="col-span-12 md:col-span-6">
              <div className="form-group">
                <label className="form-label">วันที่นัดรับกุญแจ</label>
                <div className="input-group">
                  <div className="input-group-prepend">
                    <span className="input-group-text">
                      <i className="material-symbols-outlined">
                        calendar_month
                      </i>
                    </span>
                  </div>
                  <DatePicker placeholder="" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ปุ่ม action ด้านล่าง */}
        <div className="modal-action sticky bottom-0 gap-3 mt-0">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => modalRef.current?.close()}
          >
            ปิด
          </button>
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => {
              // ที่นี่ใส่ save logic ได้ ถ้ามี
              modalRef.current?.close();
            }}
          >
            บันทึก
          </button>
        </div>
      </div>

      {/* BACKDROP */}
      <div
        className="modal-backdrop"
        onClick={() => modalRef.current?.close()}
      ></div>
    </dialog>
  );
});

EditKeyAppointmentModal.displayName = "EditKeyAppointmentModal";

export default EditKeyAppointmentModal;
