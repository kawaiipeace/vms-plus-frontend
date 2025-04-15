"use client";

import { forwardRef, useImperativeHandle, useRef, useState } from "react";
import DatePicker, { DatePickerRef } from "@/components/datePicker";

interface Props {
  onSubmitFilter: (filters: {
    requestNo: string;
    startDateTime: string;
  }) => void;
}

const FilterSortModal = forwardRef<
  { openModal: () => void; closeModal: () => void },
  Props
>(({ onSubmitFilter }, ref) => {
  const modalRef = useRef<HTMLDialogElement>(null);

  useImperativeHandle(ref, () => ({
    openModal: () => modalRef.current?.showModal(),
    closeModal: () => modalRef.current?.close(),
  }));

  const [requestNo, setRequestNo] = useState("");
  const [startDateTime, setStartDateTime] = useState("");

  const startDatePickerRef = useRef<DatePickerRef>(null);

  const handleResetFilters = () => {
    setRequestNo("");
    setStartDateTime("");
    startDatePickerRef.current?.reset();
  };

  return (
    <dialog ref={modalRef} id="my_modal_1" className="modal">
      <div className="modal-box max-w-[500px] p-0 relative rounded-none overflow-hidden flex flex-col max-h-[100vh] ml-auto mr-10 h-[100vh]">
        <div className="bottom-sheet">
          <div className="bottom-sheet-icon"></div>
        </div>
        <div className="modal-header bg-white sticky top-0 flex justify-between z-10">
          <div className="modal-header-group flex gap-4 items-center">
            <div className="featured-ico featured-ico-gray">
              <i className="material-symbols-outlined icon-settings-400-24">
                filter_list
              </i>
            </div>
            <div className="modal-header-content">
              <div className="modal-header-top">
                <div className="modal-title">ตัวกรอง</div>
              </div>
              <div className="modal-header-bottom">
                <div className="modal-subtitle">
                  กรองข้อมูลด้วยเลขที่คำขอ หรือวันที่เริ่มเดินทาง
                </div>
              </div>
            </div>
          </div>
          <form method="dialog">
            <button className="close btn btn-icon border-none bg-transparent shadow-none btn-tertiary">
              <i className="material-symbols-outlined">close</i>
            </button>
          </form>
        </div>

        <div className="modal-body overflow-y-auto flex flex-col gap-4 h-[90vh]">
          <div className="grid grid-cols-12 gap-4">
            <div className="col-span-12">
              <div className="form-group">
                <label className="form-label">เลขที่คำขอ</label>
                <input
                  type="text"
                  className="input input-bordered w-full"
                  placeholder="ระบุเลขที่คำขอ"
                  value={requestNo}
                  onChange={(e) => setRequestNo(e.target.value)}
                />
              </div>
            </div>

            <div className="col-span-12">
              <div className="form-group">
                <label className="form-label">วันที่เริ่มเดินทาง</label>
                <div className="input-group flatpickr">
                  <div className="input-group-prepend">
                    <span className="input-group-text">
                      <i className="material-symbols-outlined">
                        calendar_month
                      </i>
                    </span>
                  </div>
                  <DatePicker
                    ref={startDatePickerRef}
                    placeholder={"ระบุวันที่เริ่มเดินทาง"}
                    onChange={(dateStr: string) => setStartDateTime(dateStr)}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="modal-action absolute bottom-0 gap-3 mt-0 w-full flex justify-between">
          <div className="left">
            <button
              type="button"
              className="btn btn-tertiary btn-resetfilter block mr-auto bg-transparent shadow-none border-none"
              onClick={handleResetFilters}
            >
              ล้างตัวกรอง
            </button>
          </div>
          <div className="flex gap-3 items-center">
            <form method="dialog">
              <button className="btn btn-secondary">ยกเลิก</button>
            </form>
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => {
                onSubmitFilter({ requestNo, startDateTime });
                modalRef.current?.close();
              }}
            >
              ยืนยัน
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

FilterSortModal.displayName = "FilterSortModal";

export default FilterSortModal;
