import React, { forwardRef, useImperativeHandle, useRef } from "react";
import DatePicker from "@/components/datePicker";
import { summaryType } from "@/app/types/request-list-type";

interface Props{
  statusData: summaryType[]
}

const FilterModal = forwardRef<
  { openModal: () => void; closeModal: () => void },
  Props
>(({ statusData }, ref) => {
  const modalRef = useRef<HTMLDialogElement>(null);

  useImperativeHandle(ref, () => ({
    openModal: () => modalRef.current?.showModal(),
    closeModal: () => modalRef.current?.close(),
  }));


  return (
    <dialog ref={modalRef} id="my_modal_1" className="modal">
      <div className="modal-box max-w-[500px] p-0 relative rounded-none overflow-hidden flex flex-col max-h-[100vh] ml-auto mr-10 h-[100vh]">
        <div className="bottom-sheet">
          <div className="bottom-sheet-icon"></div>
        </div>
        <div className="modal-header bg-white sticky top-0 flex justify-between z-10">
        <div className="modal-header-group flex gap-4 items-center">
              <div className="featured-ico featured-ico-gray">
                <i className="material-symbols-outlined icon-settings-400-24">filter_list</i>
              </div>
              <div className="modal-header-content">
                <div className="modal-header-top">
                  <div className="modal-title">ตัวกรอง</div>
                </div>
                <div className="modal-header-bottom">
                  <div className="modal-subtitle">กรองข้อมูลให้แสดงเฉพาะข้อมูลที่ต้องการ</div>
                </div>
              </div>
            </div>
          <form method="dialog">
            <button className="close btn btn-icon border-none bg-transparent shadow-none btn-tertiary">
              <i className="material-symbols-outlined">close</i>
            </button>
          </form>
        </div>
        <div className="modal-body overflow-y-auto flex flex-col gap-4 height-[90vh]">
        <div className="grid grid-cols-12 gap-4">
              <div className="col-span-12">
                <div className="form-group">
                  <label className="form-label">สถานะคำขอ</label>
                  {statusData.map((statusItem, index) => (
                  <div className="custom-group" key={index}>
                    <div className="custom-control custom-checkbox custom-control-inline">
                    <input
                      type="checkbox"
                      defaultChecked
                      className="checkbox [--chkbg:#A80689] checkbox-sm rounded-md" />
                      <label className="custom-control-label">
                        <div className="custom-control-label-group">
                          <span className={`badge badge-pill-outline ${statusItem.ref_request_status_name === 'รออนุมัติ' ? 'badge-info' : 'badge-error'}`}> {statusItem.ref_request_status_name}</span>
                        </div>
                      </label>
                    </div>
                  </div>
                  ))}

                </div>
              </div>
            </div>

            <div className="grid grid-cols-12 gap-4">
              <div className="col-span-12">
                <div className="form-group">
                  <label className="form-label">วันที่เดินทาง</label>
                  <div className="input-group flatpickr">
                    <div className="input-group-prepend" data-toggle="">
                      <span className="input-group-text">
                        <i className="material-symbols-outlined">calendar_month</i>
                      </span>
                    </div>
                    <DatePicker placeholder="ระบุช่วงวันที่เดินทาง" />
                    <div className="input-group-append hidden" data-clear>
                      <span className="input-group-text search-ico-trailing">
                        <i className="material-symbols-outlined">close</i>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        <div className="modal-action absolute bottom-0 gap-3 mt-0 w-full flex justify-between">
          <div className="left">
        <button type="button" className="btn btn-tertiary btn-resetfilter block mr-auto bg-transparent shadow-none border-none">ล้างตัวกรอง</button>

          </div>
          <div className="flex gap-3 items-center">
          <form method="dialog">
            <button className="btn btn-secondary">ยกเลิก</button>
            </form>
          <form method="dialog">
          <button className="btn btn-primary">
            ยืนยัน
          </button>
          </form>
          </div>
        </div>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>
  );
});

FilterModal.displayName = "FilterModal";

export default FilterModal;
