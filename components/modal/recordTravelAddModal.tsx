import React, { forwardRef, useImperativeHandle, useRef } from "react";
import DatePicker from "@/components/datePicker";

interface Props {
  status?: boolean;
}

const RecordTravelAddModal = forwardRef<{ openModal: () => void; closeModal: () => void }, Props>(({ status }, ref) => {
  const modalRef = useRef<HTMLDialogElement>(null);
  useImperativeHandle(ref, () => ({
    openModal: () => modalRef.current?.showModal(),
    closeModal: () => modalRef.current?.close(),
  }));
  return (
    <dialog ref={modalRef} className="modal">
      <div className="modal-box max-w-[500px] p-0 relative overflow-hidden flex flex-col">
        <div className="modal-body overflow-y-auto text-center">
          <div className="modal-header bg-white sticky top-0 flex justify-between z-10">
            <div className="modal-title">{status ? "แก้ไขข้อมูลการเดินทาง" : "เพิ่มข้อมูลการเดินทาง"}</div>
            <form method="dialog">
              <button className="close btn btn-icon border-none bg-transparent shadow-none btn-tertiary">
                <i className="material-symbols-outlined">close</i>
              </button>
            </form>
          </div>
          <form>
            <div className="grid grid-cols-1 gap-4 mt-4">
              <div className="col-span-12">
                <div className="form-group">
                  <label className="form-label">วันที่ / เวลาจากต้นทาง</label>
                  <div className="input-group">
                    <div className="input-group-prepend">
                      <span className="input-group-text">
                        <i className="material-symbols-outlined">calendar_month</i>
                      </span>
                    </div>
                    <DatePicker placeholder="ระบุวันที่" />
                  </div>
                </div>
              </div>
              <div className="col-span-12">
                <div className="form-group">
                  <label className="form-label">วันที่ / เวลาถึงปลายทาง</label>
                  <div className="input-group">
                    <div className="input-group-prepend">
                      <span className="input-group-text">
                        <i className="material-symbols-outlined">calendar_month</i>
                      </span>
                    </div>
                    <DatePicker placeholder="ระบุวันที่" />
                  </div>
                </div>
              </div>
              <div className="col-span-12 grid grid-cols-2 gap-4">
                <div>
                  <div className="form-group">
                    <label className="form-label">เลขไมล์ต้นทาง</label>
                    <div className="input-group">
                      <input type="text" className="form-control" />
                    </div>
                  </div>
                </div>
                <div>
                  <div className="form-group">
                    <label className="form-label">เลขไมล์ปลายทาง</label>
                    <div className="input-group">
                      <input type="text" className="form-control" />
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-span-12">
                <div className="form-group">
                  <label className="form-label">สถานที่ต้นทาง</label>
                  <div className="input-group">
                    <input type="text" className="form-control" />
                  </div>
                </div>
              </div>
              <div className="col-span-12">
                <div className="form-group">
                  <label className="form-label">สถานที่ปลายทาง</label>
                  <div className="input-group">
                    <input type="text" className="form-control" />
                  </div>
                </div>
              </div>
              <div className="col-span-12">
                <div>
                  <div className="form-group">
                    <label className="form-label">
                      รายละเอียด<span className="font-light">(ถ้ามี)</span>
                    </label>
                    <div className="input-group">
                      <input type="text" className="form-control" />
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-span-12 grid grid-cols-2 gap-4">
                <div>
                  <button className="btn btn-secondary w-full" onClick={() => modalRef.current?.close()}>
                    ปิด
                  </button>
                </div>
                <div>
                  <button className="btn btn-primary w-full">บันทึก</button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>
  );
});

RecordTravelAddModal.displayName = "RecordTravelAddModal";

export default RecordTravelAddModal;
