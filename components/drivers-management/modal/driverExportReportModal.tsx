import React, { forwardRef, useImperativeHandle, useRef, useState } from "react";
import DatePicker from "@/components/datePicker";
import Image from "next/image";

import { convertToISO8601, convertToThaiDate } from "@/utils/driver-management";

const DriverExportReportModal = forwardRef<{ openModal: () => void; closeModal: () => void }>((_, ref) => {
  const modalRef = useRef<HTMLDialogElement>(null);
  const [checked, setChecked] = useState(true);
  const [formData, setFormData] = useState({
    driverReportStartDate: "",
    driverReportEndDate: "",
  });

  useImperativeHandle(ref, () => ({
    openModal: () => modalRef.current?.showModal(),
    closeModal: () => modalRef.current?.close(),
  }));

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  };

  const handleChangeReportStartDate = (dateStr: string) => {
    const dateStrISO = convertToISO8601(dateStr);
    setFormData((prevData) => ({
      ...prevData,
      driverContractStartDate: dateStrISO,
    }));
  };

  const handleChangeReportEndDate = (dateStr: string) => {
    const dateStrISO = convertToISO8601(dateStr);
    setFormData((prevData) => ({
      ...prevData,
      driverContractEndDate: dateStrISO,
    }));
  };

  return (
    <dialog ref={modalRef} className={`modal modal-middle`}>
      <div className="modal-box max-w-[600px] p-0 relative overflow-hidden flex flex-col bg-white">
        <div className="modal-header bg-white sticky top-0 flex justify-between z-10">
          <div className="modal-title">รายงาน</div>
          <form method="dialog">
            <button className="close btn btn-icon border-none bg-transparent shadow-none btn-tertiary">
              <i className="material-symbols-outlined">close</i>
            </button>
          </form>
        </div>
        <form className="form" onSubmit={handleSubmit}>
          <div className="modal-body overflow-y-auto text-center border-b-[1px] border-[#E5E5E5]">
            <div className="form-section">
              <div className="form-section-body">
                <div className="grid md:grid-cols-2 gird-cols-1 gap-4">
                  <div className="w-full">
                    <div className="form-group">
                      <label className="label font-semibold text-black">วันที่เริ่มต้น</label>
                      <div className={`input-group`}>
                        <div className="input-group-prepend">
                          <span className="input-group-text">
                            <i className="material-symbols-outlined">calendar_month</i>
                          </span>
                        </div>
                        <DatePicker
                          placeholder="เลือกวันที่เริ่มต้น"
                          defaultValue={convertToThaiDate(formData.driverReportStartDate)}
                          onChange={(dateStr) => handleChangeReportStartDate(dateStr)}
                        />
                      </div>
                      {/* {formErrors.driverContractStartDate && (
                          <FormHelper text={String(formErrors.driverContractStartDate)} />
                        )} */}
                    </div>
                  </div>
                  <div className="w-full">
                    <div className="form-group">
                      <label className="label font-semibold text-black">วันที่สิ้นสุด</label>
                      <div className={`input-group`}>
                        <div className="input-group-prepend">
                          <span className="input-group-text">
                            <i className="material-symbols-outlined">calendar_month</i>
                          </span>
                        </div>
                        <DatePicker
                          placeholder="เลือกวันที่สิ้นสุด"
                          defaultValue={convertToThaiDate(formData.driverReportEndDate)}
                          onChange={(dateStr) => handleChangeReportEndDate(dateStr)}
                        />
                      </div>
                      {/* {formErrors.driverContractStartDate && (
                          <FormHelper text={String(formErrors.driverContractStartDate)} />
                        )} */}
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-1 mt-3">
                  <div className="w-full flex rounded-2xl bg-white border-[#D0D5DD] border-[1px] p-4 items-stretch">
                    <Image src="/assets/img/empty/add_driver.svg" alt="" width={100} height={100} />
                    <div className="text-left">
                      <h5 className="text-[#344054] font-semibold pl-4">ประวัติการทำงานของพนักงานขับรถ</h5>
                      <p className="text-[#667085] font-semibold text-sm pl-4">ดาวน์โหลดไฟล์ .XLSX</p>
                      <p className="text-[#667085] text-sm pl-4">เลือก 5 คน</p>
                    </div>
                    <div className="ml-auto">
                      <button>
                        <i className="material-symbols-outlined text-[#A80689]">download</i>
                      </button>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-1 mt-3">
                  <label className="flex items-center cursor-pointer space-x-2">
                    <div className="relative flex items-center">
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => setChecked(!checked)}
                        className="peer appearance-none w-5 h-5 border-2 border-gray-400 rounded bg-white checked:bg-purple-600 checked:border-purple-600"
                      />
                      {/* เครื่องหมายถูก */}
                      <svg
                        className="absolute left-0 top-0 w-5 h-5 text-white pointer-events-none opacity-0 peer-checked:opacity-100"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span>แสดงข้อมูลพนักงานขับรถที่ไม่อยู่ในรายการปัจจุบันด้วย (ถ้ามี)</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </dialog>
  );
});

DriverExportReportModal.displayName = "DriverExportReportModal";

export default DriverExportReportModal;
