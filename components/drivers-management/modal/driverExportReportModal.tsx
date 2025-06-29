// import DatePicker from "@/components/datePicker";
import DatePicker from "@/components/datePicker";
import FormHelper from "@/components/formHelper";
import { downloadReport } from "@/services/driversManagement";
import Image from "next/image";
import React, { forwardRef, useImperativeHandle, useRef, useState } from "react";
import * as Yup from "yup";

import { convertToThaiDate } from "@/utils/driver-management";

interface DriverExportReportModalProps {
  selectedRow: { [key: string]: string };
}

const DriverExportReportModal = forwardRef<
  { openModal: () => void; closeModal: () => void },
  DriverExportReportModalProps
>(({ selectedRow }, ref) => {
  const modalRef = useRef<HTMLDialogElement>(null);
  const [checked, setChecked] = useState(true);
  const [formData, setFormData] = useState({
    driverReportStartDate: "",
    driverReportEndDate: "",
  });
  const [formErrors, setFormErrors] = useState({
    driverReportStartDate: "",
    driverReportEndDate: "",
  });

  const validationSchema = Yup.object().shape({
    driverReportStartDate: Yup.string().required("กรุณาเลือกวันที่เริ่มต้น"),
    driverReportEndDate: Yup.string().required("กรุณาเลือกวันที่สิ้นสุด"),
  });
  const [openModal, setOpenModal] = useState(false);
  // const [disableStartDate, setDisableStartDate] = useState<string>();
  // const [disableEndDate, setDisableEndDate] = useState<string>();

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

  // useEffect(() => {
  //   if (selectedRow) {
  //     console.log("Selected rows:", selectedRow);
  //   }
  // }, [selectedRow]);

  // function convertDDMMYYYYToISO(dateStr: string): string {
  //   const [day, month, year] = dateStr.split("/");
  //   if (!day || !month || !year) return "";
  //   return `${Number(year) - 543}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
  // }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      validationSchema.validateSync(formData, { abortEarly: false });
      const selectedRowValues: string[] = [];
      Object.keys(selectedRow).forEach((key) => {
        if (selectedRow[key]) {
          selectedRowValues.push(selectedRow[key]);
        }
      });

      const params = {
        starDate: formData.driverReportStartDate,
        endDate: formData.driverReportEndDate,
        // showAll: checked ? true : false,
        mas_driver_uid: selectedRowValues, // Add the driver IDs you want to include in the report
      };

      try {
        const response = await downloadReport(params);
        // console.log("Download report response:", response);
        if (response.status === 200) {
          const blob = new Blob([response.data], {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          });
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = "Driver_Report.xlsx"; // Set the desired file name
          document.body.appendChild(a);
          a.click();
          window.URL.revokeObjectURL(url);
          a.remove();
          handleCloseModal();
        }
      } catch (error) {
        console.error("Error downloading report:", error);
      }

      // modalRef.current?.close();
    } catch (error) {
      if (error instanceof Yup.ValidationError) {
        const errors: { [key: string]: string } = {};
        error.inner.forEach((err) => {
          if (err.path) {
            errors[err.path] = err.message;
          }
        });
        setFormErrors({ driverReportStartDate: "", driverReportEndDate: "" });
        setFormErrors((prevErrors) => ({
          ...prevErrors,
          ...errors,
        }));
      }
    }
  };

  const handleChangeReportStartDate = (dateStr: string) => {
    // const dateStrISO = convertToISO8601(dateStr);
    setFormData((prevData) => ({
      ...prevData,
      driverReportStartDate: dateStr,
    }));
    // setDisableStartDate(dateStr);
  };

  const handleChangeReportEndDate = (dateStr: string) => {
    // const dateStrISO = convertToISO8601(dateStr);
    setFormData((prevData) => ({
      ...prevData,
      driverReportEndDate: dateStr,
    }));
    // setDisableEndDate(dateStr);
  };

  return (
    <>
      {openModal && (
        <div className={`modal modal-middle modal-open`}>
          <div className="modal-box max-w-[600px] p-0 relative overflow-hidden flex flex-col bg-white">
            <div className="modal-header bg-white sticky top-0 flex justify-between z-10">
              <div className="modal-title">รายงาน</div>
              <form method="dialog">
                <button
                  className="close btn btn-icon border-none bg-transparent shadow-none btn-tertiary"
                  onClick={handleCloseModal}
                >
                  <i className="material-symbols-outlined">close</i>
                </button>
              </form>
            </div>
            <form className="form" onSubmit={handleSubmit}>
              <div className="modal-scroll-wrapper overflow-y-auto">
                <div className="modal-body text-center ">
                  <div className="form-section">
                    <div className="form-section-body">
                      <div className="grid md:grid-cols-2 gird-cols-1 gap-4">
                        <div className="w-full">
                          <div className="form-group">
                            <label className="form-label">วันที่เริ่มต้น</label>
                            <div className={`input-group flatpickr`}>
                              <div className="input-group-prepend">
                                <span className="input-group-text">
                                  <i className="material-symbols-outlined">calendar_month</i>
                                </span>
                              </div>
                              <DatePicker
                                placeholder="เลือกวันที่เริ่มต้น"
                                defaultValue={convertToThaiDate(formData.driverReportStartDate)}
                                onChange={(dateStr) => handleChangeReportStartDate(dateStr)}
                                // maxDate={disableEndDate ? convertToISO8601(disableEndDate) : undefined}
                              />
                            </div>
                            {formErrors.driverReportStartDate && (
                              <FormHelper text={String(formErrors.driverReportStartDate)} />
                            )}
                          </div>
                        </div>
                        <div className="w-full">
                          <div className="form-group">
                            <label className="form-label">วันที่สิ้นสุด</label>
                            <div className={`input-group flatpickr`}>
                              <div className="input-group-prepend">
                                <span className="input-group-text">
                                  <i className="material-symbols-outlined">calendar_month</i>
                                </span>
                              </div>
                              <DatePicker
                                placeholder="เลือกวันที่สิ้นสุด"
                                defaultValue={convertToThaiDate(formData.driverReportEndDate)}
                                onChange={(dateStr) => handleChangeReportEndDate(dateStr)}
                                // minDate={disableStartDate ? convertToISO8601(disableStartDate) : undefined}
                              />
                            </div>
                            {formErrors.driverReportEndDate && (
                              <FormHelper text={String(formErrors.driverReportEndDate)} />
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 mt-3">
                        <div className=" card card-body p-4 ">
                          <div className="w-full flex rounded-2xl  items-stretch">
                            <Image src="/assets/img/empty/driver.svg" alt="" width={100} height={100} />
                            <div className="text-left">
                              <h5 className="text-[#344054] font-semibold pl-4 text-color">
                                ประวัติการทำงานของพนักงานขับรถ
                              </h5>
                              <p className="text-[#667085] font-semibold text-sm pl-4 text-color">
                                ดาวน์โหลดไฟล์ .XLSX
                              </p>
                              <p className="text-[#667085] text-sm pl-4 text-color">
                                เลือก {Object.keys(selectedRow).length} คน
                              </p>
                            </div>
                            <div className="ml-auto">
                              <button type="submit">
                                <i className="material-symbols-outlined text-[#A80689]">download</i>
                              </button>
                            </div>
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
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
});

DriverExportReportModal.displayName = "DriverExportReportModal";

export default DriverExportReportModal;
