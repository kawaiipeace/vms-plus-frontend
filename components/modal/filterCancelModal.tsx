"use client";

import DatePicker, { DatePickerRef } from "@/components/datePicker";
import useSwipeDown from "@/utils/swipeDown";
import { forwardRef, useImperativeHandle, useRef, useState } from "react";

interface Props {
  onSubmitFilter: (filters: { selectedStartDate: string; selectedEndDate: string }) => void;
}

const FilterCancelModal = forwardRef<{ openModal: () => void; closeModal: () => void }, Props>(
  ({ onSubmitFilter }, ref) => {
    const modalRef = useRef<HTMLDialogElement>(null);

    const [openModal, setOpenModal] = useState(false);

    useImperativeHandle(ref, () => ({
      openModal: () => {
        modalRef.current?.showModal();
        setOpenModal(true);
      },
      closeModal: () => {
        modalRef.current?.close();
        setOpenModal(false);
      },
    }));

    const handleCloseModal = () => {
      modalRef.current?.close();
      setOpenModal(false); // Update state to reflect modal is closed
    };

    const [selectedStartDate, setSelectedStartDate] = useState<string>("");
    const [selectedEndDate, setSelectedEndDate] = useState<string>("");

    // Separate refs for each DatePicker
    const startDatePickerRef = useRef<DatePickerRef>(null);
    const endDatePickerRef = useRef<DatePickerRef>(null);

    const handleStartDateChange = (dateStr: string) => {
      setSelectedStartDate(dateStr);
    };

    const handleEndDateChange = (dateStr: string) => {
      setSelectedEndDate(dateStr);
    };

    // Reset function
    const handleResetFilters = () => {
      setSelectedStartDate("");
      setSelectedEndDate("");
      startDatePickerRef.current?.reset(); // Reset start date picker
      endDatePickerRef.current?.reset(); // Reset end date picker
    };
    const swipeDownHandlers = useSwipeDown(handleCloseModal);

    return (
      <div>
        {openModal && (
          <div className="modal modal-open">
            <div className="modal-box max-w-[500px] p-0 relative rounded-none overflow-hidden flex flex-col max-h-[100vh] ml-auto mr-10 h-[100vh]">
              <div className="bottom-sheet" {...swipeDownHandlers}>
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
                  <button
                    className="close btn btn-icon border-none bg-transparent shadow-none btn-tertiary"
                    onClick={handleCloseModal}
                  >
                    <i className="material-symbols-outlined">close</i>
                  </button>
                </form>
              </div>
              <div className="modal-scroll-wrapper overflow-y-auto">
                <div className="modal-body  flex flex-col gap-4 h-[90vh]">
                  <div className="grid grid-cols-12 gap-4">
                    <div className="col-span-12">
                      <div className="form-group">
                        <label className="form-label">วันที่เริ่มเดินทาง</label>
                        <div className="input-group flatpickr">
                          <div className="input-group-prepend" data-toggle="">
                            <span className="input-group-text">
                              <i className="material-symbols-outlined">calendar_month</i>
                            </span>
                          </div>
                          <DatePicker
                            ref={startDatePickerRef}
                            placeholder={"ระบุช่วงวันที่เริ่มเดินทาง"}
                            onChange={handleStartDateChange}
                            defaultValue={selectedStartDate}
                          />
                          <div className="input-group-append hidden" data-clear>
                            <span className="input-group-text search-ico-trailing">
                              <i className="material-symbols-outlined">close</i>
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="col-span-12">
                      <div className="form-group">
                        <label className="form-label">วันที่สิ้นสุดเดินทาง</label>
                        <div className="input-group flatpickr">
                          <div className="input-group-prepend" data-toggle="">
                            <span className="input-group-text">
                              <i className="material-symbols-outlined">calendar_month</i>
                            </span>
                          </div>
                          <DatePicker
                            ref={endDatePickerRef} // Attach ref to end date picker
                            placeholder={"ระบุช่วงวันที่สิ้นสุดเดินทาง"}
                            onChange={handleEndDateChange}
                            defaultValue={selectedEndDate}
                          />
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
              </div>
              <div className="modal-action absolute bottom-0 gap-3 mt-0 w-full flex justify-between">
                <div className="left">
                  <button
                    type="button"
                    className="btn btn-tertiary btn-resetfilter block mr-auto bg-transparent shadow-none border-none"
                    onClick={handleResetFilters} // Attach the reset function
                  >
                    ล้างตัวกรอง
                  </button>
                </div>
                <div className="flex gap-3 items-center">
                  <form method="dialog">
                    <button className="btn btn-secondary" onClick={handleCloseModal}>
                      ยกเลิก
                    </button>
                  </form>
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={() => {
                      onSubmitFilter({ selectedStartDate, selectedEndDate });
                      handleCloseModal();
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
          </div>
        )}
      </div>
    );
  }
);

FilterCancelModal.displayName = "FilterModal";

export default FilterCancelModal;
