import React, { forwardRef, useImperativeHandle, useRef } from "react";
import DatePicker from "../datePicker";

interface Props {
  location?: string;
  date?: string;
}

const EditKeyAppointmentModal = forwardRef<
  { openModal: () => void; closeModal: () => void }, // Ref type
  Props
>(({ location, date }, ref) => {
  // Destructure `process` from props
  const modalRef = useRef<HTMLDialogElement>(null);

  useImperativeHandle(ref, () => ({
    openModal: () => modalRef.current?.showModal(),
    closeModal: () => modalRef.current?.close(),
  }));

  return (
    <>
      <dialog ref={modalRef} className={`modal modal-middle`}>
        <div className="modal-box max-w-[500px] p-0 relative overflow-hidden flex flex-col">
          <div className="bottom-sheet">
            <div className="bottom-sheet-icon"></div>
          </div>
          <div className="modal-header bg-white sticky top-0 flex justify-between z-10">
          <div className="modal-title">แก้ไขนัดหมายรับกุญแจ</div>
          <form method="dialog">
            <button className="close btn btn-icon border-none bg-transparent shadow-none btn-tertiary">
              <i className="material-symbols-outlined">close</i>
            </button>
          </form>
        </div>

          <div className="modal-body text-center overflow-y-auto">
        
            
          <div className="w-full grid grid-cols-12 gap-4">
              <div className="col-span-12 md:col-span-6">
                <div className="form-group">
									<label className="form-label">สถานที่รับกุญแจ</label>
                  <div className="input-group">
										<div className="input-group-prepend">
											<span className="input-group-text">
												<i className="material-symbols-outlined">location_on</i>
											</span>
										</div>
                    <input type="text" className="form-control" placeholder="" defaultValue="การไฟฟ้าเขต ฉ.1 และ กฟฟ. ในสังกัด" />
									
									</div>
									{/* <span className="form-helper">Helper</span> */}
								</div>
              </div>

              <div className="col-span-12 md:col-span-6">
                <div className="form-group">
									<label className="form-label">วันที่นัดรับกุญแจ</label>
                  <div className="input-group">
										<div className="input-group-prepend">
											<span className="input-group-text">
												<i className="material-symbols-outlined">calendar_month</i>
											</span>
										</div>
                  
                      <DatePicker placeholder="" />
									</div>
							
								</div>
              </div>

            
            </div>
            
           
            <div className="modal-footer mt-5 grid grid-cols-2 gap-3">
              <form method="dialog col-span-1">
                <button className="btn btn-secondary w-full">ปิด</button>
              </form>
              <button type="button" className="btn btn-primary col-span-1">
                บันทึก
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

EditKeyAppointmentModal.displayName = "EditKeyAppointmentModal";

export default EditKeyAppointmentModal;
