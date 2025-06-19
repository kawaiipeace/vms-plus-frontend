"use client";

import DatePicker, { DatePickerRef } from "@/components/datePicker";
import { driverStatusRef, listDriverDepartment } from "@/services/driversManagement";
import useSwipeDown from "@/utils/swipeDown";
import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import CustomSearchSelect from "@/components/customSelectSerch";

interface Props {
  onSubmitFilter: (filter: {
    selectedStatuses: string[];
    selectedDriverStatus: string[];
    selectedWorkType: string[];
    selectedStartDate: string;
    selectedEndDate: string;
    driverDepartmentOptions: { value: string; label: string | React.ReactNode };
  }) => void;
  handleCountFilter?: () => void;
}

interface CustomSelectOption {
  value: string;
  label: React.ReactNode | string;
  labelDetail?: React.ReactNode | string;
}

interface DriverStatus {
  ref_driver_status_code: string;
  ref_driver_status_desc: string;
}

const FilterModal = forwardRef<{ openModal: () => void; closeModal: () => void }, Props>(({ onSubmitFilter }, ref) => {
  const modalRef = useRef<HTMLDialogElement>(null);
  const [driverDepartmentList, setDriverDepartmentList] = useState<CustomSelectOption[]>([]);
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
  const [selectedDriverStatus, setSelectedDriverStatus] = useState<string[]>([]);
  const [selectedWorkType, setSelectedWorkType] = useState<string[]>([]);
  const [selectedStartDate, setSelectedStartDate] = useState<string>("");
  const [selectedEndDate, setSelectedEndDate] = useState<string>("");
  const [driverStatus, setDriverStatus] = useState<DriverStatus[]>([]);
  const [driverDepartmentOptions, setDriverDepartmentOptions] = useState<CustomSelectOption>({
    value: "",
    label: "ทั้งหมด",
  });
  // const statusData: {
  //   ref_request_status_name: string;
  //   ref_request_status_code: string;
  // }[] = [
  //   { ref_request_status_name: "ปฏิบัติงานปกติ", ref_request_status_code: "1" },
  //   { ref_request_status_name: "ลาป่วย/ลากิจ", ref_request_status_code: "2" },
  //   { ref_request_status_name: "สำรอง", ref_request_status_code: "3" },
  //   { ref_request_status_name: "ทดแทน", ref_request_status_code: "4" },
  //   { ref_request_status_name: "ลาออก", ref_request_status_code: "5" },
  //   { ref_request_status_name: "ให้ออก", ref_request_status_code: "6" },
  //   { ref_request_status_name: "สิ้นสุดสัญญา", ref_request_status_code: "7" },
  // ];
  const statusDriver: {
    ref_request_status_name: string;
    ref_request_status_code: string;
  }[] = [
    { ref_request_status_name: "ใช้งาน", ref_request_status_code: "1" },
    { ref_request_status_name: "ไม่ใช้งาน", ref_request_status_code: "0" },
  ];
  const driverWorkType: {
    ref_request_status_name: string;
    ref_request_status_code: string;
  }[] = [
    { ref_request_status_name: "ได้", ref_request_status_code: "1" },
    { ref_request_status_name: "ไม่ได้", ref_request_status_code: "2" },
  ];

  const startDatePickerRef = useRef<DatePickerRef>(null);
  const endDatePickerRef = useRef<DatePickerRef>(null);
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

  const swipeDownHandlers = useSwipeDown(handleCloseModal);

  useEffect(() => {
    const fetchDriverDepartment = async () => {
      try {
        const response = await listDriverDepartment();
        const driverDepartmentData = response.data.map(
          (item: { dept_sap: string; dept_short: string; dept_full: string }) => {
            return {
              value: item.dept_sap,
              label: item.dept_short,
              // labelDetail: item.dept_full,
            };
          }
        );
        // console.log(driverDepartmentData);
        setDriverDepartmentList(driverDepartmentData);
      } catch (error) {
        console.error("Error fetching driver department data:", error);
      }
    };
    const fetchDriverStatus = async () => {
      try {
        const response = await driverStatusRef();
        if (response.status === 200) {
          const driverStatusArr: DriverStatus[] = response.data;
          setDriverStatus(driverStatusArr);
        } else {
          console.error("Failed to fetch driver status");
        }
      } catch (error) {
        console.error("Error fetching driver status:", error);
      }
    };

    fetchDriverStatus();
    fetchDriverDepartment();
  }, []);

  // function convertDDMMYYYYToISO(dateStr: string): string {
  //   const [day, month, year] = dateStr.split("/");
  //   if (!day || !month || !year) return "";
  //   return `${Number(year) - 543}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
  // }

  const handleResetFilters = () => {
    setDriverDepartmentOptions({ value: "", label: "ทั้งหมด" });
    setSelectedStatuses([]);
    setSelectedDriverStatus([]);
    setSelectedWorkType([]);
    startDatePickerRef.current?.reset(); // Reset start date picker
    endDatePickerRef.current?.reset(); // Reset end date picker
  };

  const handleCheckboxChange = (code: string) => {
    setSelectedStatuses((prev) => (prev.includes(code) ? prev.filter((c) => c !== code) : [...prev, code]));
  };

  const handleCheckboxChangeDriverStatus = (code: string) => {
    setSelectedDriverStatus((prev) => (prev.includes(code) ? prev.filter((c) => c !== code) : [...prev, code]));
  };

  const handleCheckboxChangeWorkType = (code: string) => {
    setSelectedWorkType((prev) => (prev.includes(code) ? prev.filter((c) => c !== code) : [...prev, code]));
  };

  const handleStartDateChange = (dateStr: string) => {
    // const convertedDate = convertDDMMYYYYToISO(dateStr);
    // console.log("Converted start date:", convertedDate);
    setSelectedStartDate(dateStr);
  };

  const handleEndDateChange = (dateStr: string) => {
    // const convertedDate = convertDDMMYYYYToISO(dateStr);
    setSelectedEndDate(dateStr);
  };

  const handleDriverDepartmentChange = async (selectedOption: { value: string; label: string | React.ReactNode }) => {
    setDriverDepartmentOptions(selectedOption as { value: string; label: string });
  };

  return (
    <>
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
              {/* <form method="dialog"> */}
              <button
                className="close btn btn-icon border-none bg-transparent shadow-none btn-tertiary"
                onClick={() => {
                  handleCloseModal();
                }}
              >
                <i className="material-symbols-outlined">close</i>
              </button>
              {/* </form> */}
            </div>
            <div className="modal-scroll-wrapper overflow-y-auto h-[74vh] max-h-full">
              <div className="modal-body  flex flex-col gap-4 md:h-[76vh] h-[70vh] md:max-h-full max-h-[70vh]">
                <div className="grid grid-cols-1">
                  <div className="col-span-1">
                    <div className="form-group">
                      <label className="form-label">หน่วยงานสังกัด</label>
                    </div>
                  </div>
                  <div className="col-span-1">
                    <div className="form-group">
                      <CustomSearchSelect
                        w="md:w-full"
                        options={driverDepartmentList}
                        value={driverDepartmentOptions}
                        enableSearch
                        onChange={handleDriverDepartmentChange}
                      />
                    </div>
                  </div>
                </div>
                <div className="col-span-1">
                  <div className="form-group">
                    <label className="form-label">สถานะการปฏิบัติงาน</label>
                    {driverStatus != null && (
                      <>
                        {driverStatus.map((statusItem, index) => (
                          <div className="custom-group" key={index}>
                            <div className="custom-control custom-checkbox custom-control-inline">
                              <input
                                type="checkbox"
                                value={statusItem.ref_driver_status_code}
                                checked={selectedStatuses.includes(statusItem.ref_driver_status_code)}
                                onChange={() => handleCheckboxChange(statusItem.ref_driver_status_code)}
                                className="checkbox [--chkbg:#A80689] checkbox-sm rounded-md"
                              />
                              <label className="custom-control-label">
                                <div className="custom-control-label-group">
                                  <span
                                    className={`badge badge-pill-outline ${
                                      statusItem.ref_driver_status_desc === "ลาออก"
                                        ? "badge-error"
                                        : statusItem.ref_driver_status_desc === "ปฏิบัติงานปกติ"
                                        ? "badge-success"
                                        : statusItem.ref_driver_status_desc === "ลา (ป่วย/กิจ)"
                                        ? "badge-warning"
                                        : statusItem.ref_driver_status_desc === "หมดสัญญาจ้าง"
                                        ? "badge-gray"
                                        : statusItem.ref_driver_status_desc.includes("ให้ออก")
                                        ? "badge-neutral"
                                        : statusItem.ref_driver_status_desc.includes("ทดแทน")
                                        ? "badge-accent"
                                        : "badge-info"
                                    }`}
                                  >
                                    {statusItem.ref_driver_status_desc}
                                  </span>
                                </div>
                              </label>
                            </div>
                          </div>
                        ))}
                      </>
                    )}
                  </div>
                </div>
                <div className="col-span-1">
                  <div className="form-group">
                    <label className="form-label">สถานะใช้งาน</label>
                    {statusDriver != null && (
                      <>
                        {statusDriver.map((statusItem, index) => (
                          <div className="custom-group" key={index}>
                            <div className="custom-control custom-checkbox custom-control-inline">
                              <input
                                type="checkbox"
                                value={statusItem.ref_request_status_code}
                                checked={selectedDriverStatus.includes(statusItem.ref_request_status_code)}
                                onChange={() => handleCheckboxChangeDriverStatus(statusItem.ref_request_status_code)}
                                className="checkbox [--chkbg:#A80689] checkbox-sm rounded-md"
                              />
                              <label className="custom-control-label">
                                <div className="custom-control-label-group">
                                  <span>{statusItem.ref_request_status_name}</span>
                                </div>
                              </label>
                            </div>
                          </div>
                        ))}
                      </>
                    )}
                  </div>
                </div>
                <div className="col-span-1">
                  <div className="form-group">
                    <label className="form-label">ประเภทค้างคืน</label>
                    {driverWorkType != null && (
                      <>
                        {driverWorkType.map((statusItem, index) => (
                          <div className="custom-group" key={index}>
                            <div className="custom-control custom-checkbox custom-control-inline">
                              <input
                                type="checkbox"
                                value={statusItem.ref_request_status_code}
                                checked={selectedWorkType.includes(statusItem.ref_request_status_code)}
                                onChange={() => handleCheckboxChangeWorkType(statusItem.ref_request_status_code)}
                                className="checkbox [--chkbg:#A80689] checkbox-sm rounded-md"
                              />
                              <label className="custom-control-label">
                                <div className="custom-control-label-group">
                                  <span>{statusItem.ref_request_status_name}</span>
                                </div>
                              </label>
                            </div>
                          </div>
                        ))}
                      </>
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-12 gap-4">
                  <div className="col-span-12">
                    <div className="form-group">
                      <label className="form-label">วันที่หมดอายุใบขับขี่</label>
                      <div className="input-group flatpickr">
                        <div className="input-group-prepend" data-toggle="">
                          <span className="input-group-text">
                            <i className="material-symbols-outlined">calendar_month</i>
                          </span>
                        </div>
                        <DatePicker
                          ref={startDatePickerRef}
                          placeholder={"ระบุวันที่หมดอายุใบขับขี่"}
                          onChange={(date) => handleStartDateChange(date)}
                          defaultValue={selectedStartDate} // Set default value if needed
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
                      <label className="form-label">วันที่สิ้นสุดปฏิบัติงาน</label>
                      <div className="input-group flatpickr">
                        <div className="input-group-prepend" data-toggle="">
                          <span className="input-group-text">
                            <i className="material-symbols-outlined">calendar_month</i>
                          </span>
                        </div>
                        <DatePicker
                          ref={endDatePickerRef} // Attach ref to end date picker
                          placeholder={"ระบุวันที่สิ้นสุดปฏิบัติงาน"}
                          onChange={handleEndDateChange}
                          defaultValue={selectedEndDate} // Set default value if needed
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
                {/* <form method="dialog"> */}
                <button className="btn btn-secondary" onClick={handleCloseModal}>
                  ยกเลิก
                </button>
                {/* </form> */}
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => {
                    onSubmitFilter({
                      selectedStatuses,
                      selectedDriverStatus,
                      selectedWorkType,
                      selectedStartDate,
                      selectedEndDate,
                      driverDepartmentOptions,
                    });
                    // if (handleCountFilter) handleCountFilter();
                  }}
                >
                  ตกลง
                </button>
              </div>
            </div>
          </div>
          {/* <form method="dialog" className="modal-backdrop">
            <button>close</button>
          </form> */}
        </div>
      )}
    </>
  );
});

FilterModal.displayName = "FilterModal";

export default FilterModal;
