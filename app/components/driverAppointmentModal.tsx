import React, { forwardRef, useImperativeHandle, useRef } from "react";
import TimePicker from "./timePicker";
import DatePicker from "./datePicker";

interface DriverAppointmentModalProps {
  process: string;
}


const DriverAppointmentModal = forwardRef<
  { openModal: () => void; closeModal: () => void }, // Ref type
  DriverAppointmentModalProps // Props type
>(({ process }, ref) => {
  // Destructure `process` from props
  const modalRef = useRef<HTMLDialogElement>(null);

  useImperativeHandle(ref, () => ({
    openModal: () => modalRef.current?.showModal(),
    closeModal: () => modalRef.current?.close(),
  }));


  return (
    <dialog ref={modalRef} id="my_modal_1" className="modal">
      <div className="modal-box max-w-[500px] p-0 relative modal-vehicle-pick overflow-hidden flex flex-col max-h-[90vh]">
        <div className="bottom-sheet">
          <div className="bottom-sheet-icon"></div>
        </div>
        <div className="modal-header bg-white sticky top-0 flex justify-between z-10">
          <div className="modal-title"> { process == "edit" ? "แก้ไข" : "เพิ่ม" }ข้อมูลนัดหมายพนักงานขับรถ</div>
          <form method="dialog">
            <button className="close btn btn-icon border-none bg-transparent shadow-none btn-tertiary">
              <i className="material-symbols-outlined">close</i>
            </button>
          </form>
        </div>
        <div className="modal-body overflow-y-auto">
            <div className="w-full grid gap-4">
              <div className="col-span-12">
                <div className="form-group">
									<label className="form-label">สถานที่นัดหมาย</label>
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
									<label className="form-label">วันที่เริ่มต้นเดินทาง</label>
                  <div className="input-group is-readonly">
										<div className="input-group-prepend">
											<span className="input-group-text">
												<i className="material-symbols-outlined">calendar_month</i>
											</span>
										</div>
                  
                      <DatePicker placeholder="" />
									</div>
							
								</div>
              </div>

              <div className="col-span-12 md:col-span-6">
                <div className="form-group">
									<label className="form-label">เวลานัดหมาย</label>
                  <div className="input-group">
										<div className="input-group-prepend">
											<span className="input-group-text">
												<i className="material-symbols-outlined">schedule</i>
											</span>
										</div>
                     <TimePicker />
										
									</div>
							
								</div>
              </div>
            </div>
          </div>
        <div className="modal-action sticky bottom-0 gap-3 mt-0">
          <form method="dialog">
            <button className="btn btn-secondary">ยกเลิก</button>
          </form>

          <button type="button" className="btn btn-primary">
            ยืนยัน
          </button>
        </div>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>
  );
});

DriverAppointmentModal.displayName = "DriverAppointmentModal";

export default DriverAppointmentModal;
