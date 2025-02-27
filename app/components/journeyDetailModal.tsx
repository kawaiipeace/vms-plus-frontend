import React, { forwardRef, useImperativeHandle, useRef } from "react";
import NumberInput from "./numberInput";
import TimePicker from "./timePicker";

const JourneyDetailModal = forwardRef((_, ref) => {
  const modalRef = useRef<HTMLDialogElement>(null);

  useImperativeHandle(ref, () => ({
    openModal: () => modalRef.current?.showModal(),
    closeModal: () => modalRef.current?.close(),
  }));

  return (
    <dialog ref={modalRef} id="my_modal_1" className="modal">
      <div className="modal-box max-w-[800px] p-0 relative modal-vehicle-pick overflow-hidden flex flex-col max-h-[90vh]">
        <div className="bottom-sheet">
          <div className="bottom-sheet-icon"></div>
        </div>
        <div className="modal-header bg-white sticky top-0 flex justify-between z-10">
          <div className="modal-title">แก้ไขรายละเอียดการเดินทาง</div>
          <form method="dialog">
            <button className="close btn btn-icon border-none bg-transparent shadow-none btn-tertiary">
              <i className="material-symbols-outlined">close</i>
            </button>
          </form>
        </div>
        <div className="modal-body overflow-y-auto">
          <div className="grid grid-cols-12 gap-4">
            <div className="col-span-12 md:col-span-6">
              <div className="form-group">
                <label className="form-label">วันที่เริ่มต้นเดินทาง</label>
                <div className="input-group is-readonly">
                  <div className="input-group-prepend">
                    <span className="input-group-text">
                      <i className="material-symbols-outlined">
                        calendar_month
                      </i>
                    </span>
                  </div>
                  <input
                    type="text"
                    className="form-control"
                    placeholder=""
                    defaultValue="01/01/2567"
                    disabled
                  />
                </div>
              </div>
            </div>

            <div className="col-span-12 md:col-span-6">
              <div className="form-group">
                <label className="form-label">วันที่สิ้นสุดเดินทาง</label>
                <div className="input-group is-readonly">
                  <div className="input-group-prepend">
                    <span className="input-group-text">
                      <i className="material-symbols-outlined">
                        calendar_month
                      </i>
                    </span>
                  </div>
                  <input
                    type="text"
                    className="form-control"
                    placeholder=""
                    defaultValue="01/01/2567"
                    disabled
                  />
                </div>
              </div>
            </div>

            <div className="col-span-12 md:col-span-6 journey-time">
              <div className="form-group">
                <label className="form-label">ช่วงเวลาการเดินทาง</label>
                <div className="input-group">
                 <TimePicker />
                 </div>
              </div>
            </div>

            <div className="col-span-12 md:col-span-6">
              <div className="form-group">
                <label className="form-label">ประเภทการเดินทาง</label>
                <div className="custom-group">
                  <div className="custom-control custom-radio custom-control-inline">
                    <input
                      type="radio"
                      className="custom-control-input"
                      name="ประเภทการเดินทาง"
                      data-group="ประเภทการเดินทาง"
                      checked
                      disabled
                    />
                    <label className="custom-control-label">ไป-กลับ</label>
                  </div>
                  <div className="custom-control custom-radio custom-control-inline">
                    <input
                      type="radio"
                      className="custom-control-input"
                      name="ประเภทการเดินทาง"
                      data-group="ประเภทการเดินทาง"
                      disabled
                    />
                    <label className="custom-control-label">ค้างแรม</label>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-span-12">
              <div className="form-group">
                <label className="form-label">สถานที่ปฏิบัติงาน</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder=""
                  defaultValue="การไฟฟ้าเขต ฉ.1 และ กฟฟ. ในสังกัด"
                />
              </div>
            </div>

            <div className="col-span-12">
              <div className="form-group">
                <label className="form-label">วัตถุประสงค์</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder=""
                  defaultValue="เพื่อเก็บรวบรวมข้อมูลการใช้งานระบบ VMS Plus ขอบเขตงานบริการเช่าชุดเครื่องยนต์กำเนิดไฟฟ้าของ กฟภ. และงานบริหารจัดการยานพาหนะขนาดใหญ่"
                />
              </div>
            </div>

            <div className="col-span-12">
              <div className="form-group">
                <label className="form-label">
                  หมายเหตุ<span className="form-optional">(ถ้ามี)</span>
                </label>
                <input
                  type="text"
                  className="form-control"
                  placeholder=""
                  defaultValue="รายละเอียดแผนและรายชื่อพนักงานตามเอกสารแนบ"
                />
              </div>
            </div>

            <div className="col-span-12 md:col-span-4">
              <div className="form-group">
                <label className="form-label">
                  จำนวนผู้โดยสาร
                  <span className="form-optional">(รวมผู้ขับขี่)</span>
                </label>
               <div className="w-full overflow-hidden">
               <NumberInput />
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

JourneyDetailModal.displayName = "JourneyDetailModal";

export default JourneyDetailModal;
