"use client";

import { summaryDriverType } from "@/app/types/request-list-type";
import DatePicker, { DatePickerRef } from "@/components/datePicker";
import { fetchDriverLicenseType } from "@/services/masterService";
import useSwipeDown from "@/utils/swipeDown";
import dayjs from "dayjs";
import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import CustomSelect, { CustomSelectOption } from "../customSelect";

interface Props {
  statusData: summaryDriverType[];
  onSubmitFilter: (filters: {
    selectedStatuses: string[];
    selectedStartDate: string;
    selectedEndDate: string;
    licenseTypes?: string[];
    year?: string;
  }) => void;
}

const FilterDriverModal = forwardRef<{ openModal: () => void; closeModal: () => void }, Props>(
  ({ statusData, onSubmitFilter }, ref) => {
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
    const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
    const [selectedLicenseTypes, setSelectedLicenseTypes] = useState<string[]>([]);
    const [vehicleCatOptions, setVehicleCatOptions] = useState<{ value: string; label: string }[]>([]);
    const [licenseTypeOptions, setLicenseTypeOptions] = useState<{ value: string; label: string; desc?: string }[]>([]);

    const startDatePickerRef = useRef<DatePickerRef>(null);
    const endDatePickerRef = useRef<DatePickerRef>(null);

    const handleStartDateChange = (dateStr: string) => {
      setSelectedStartDate(dateStr);
    };

    const handleEndDateChange = (dateStr: string) => {
      setSelectedEndDate(dateStr);
    };

    const handleCheckboxChange = (code: string) => {
      setSelectedStatuses((prev) => (prev.includes(code) ? prev.filter((c) => c !== code) : [...prev, code]));
    };

    const handleLicenseTypeChange = (code: string) => {
      setSelectedLicenseTypes((prev) => (prev.includes(code) ? prev.filter((c) => c !== code) : [...prev, code]));
    };

    const [selectedVehicleOption, setSelectedVehicleOption] = useState<CustomSelectOption>({
      value: "",
      label: "ทั้งหมด",
    });

    useEffect(() => {
      const yearOptions = [
        { value: "", label: "เลือกปี" },
        { value: String(dayjs().year() + 543), label: String(dayjs().year() + 543) },
        { value: String(dayjs().year() + 544), label: String(dayjs().year() + 544) },
      ];
      setVehicleCatOptions(yearOptions);

      const fetchLicenseTypes = async () => {
        try {
          const response = await fetchDriverLicenseType();
          if (response.status === 200) {
            const licenseTypeData = response.data;
            const licenseTypeArr = licenseTypeData.map(
              (type: {
                ref_driver_license_type_code: string;
                ref_driver_license_type_name: string;
                ref_driver_license_type_desc: string;
              }) => ({
                value: type.ref_driver_license_type_code,
                label: type.ref_driver_license_type_name,
                desc: type.ref_driver_license_type_desc,
              })
            );
            setLicenseTypeOptions(licenseTypeArr);
          }
        } catch (error) {
          console.error("Error fetching license types:", error);
        }
      };

      fetchLicenseTypes();
    }, []);

    const handleVehicleTypeChange = async (selectedOption: { value: string; label: string | React.ReactNode }) => {
      setSelectedVehicleOption(selectedOption as { value: string; label: string });
    };

    const handleResetFilters = () => {
      setSelectedStatuses([]);
      setSelectedLicenseTypes([]);
      setSelectedStartDate("");
      setSelectedEndDate("");
      setSelectedVehicleOption({ value: "", label: "ทั้งหมด" });
      startDatePickerRef.current?.reset();
      endDatePickerRef.current?.reset();
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
                {/* <form method="dialog"> */}
                <button
                  className="close btn btn-icon border-none bg-transparent shadow-none btn-tertiary"
                  onClick={handleCloseModal}
                >
                  <i className="material-symbols-outlined">close</i>
                </button>
                {/* </form> */}
              </div>
              <div className="modal-scroll-wrapper overflow-y-auto">
                <div className="modal-body flex flex-col gap-4 h-[70vh] max-h-[70vh]">
                  <div className="grid grid-cols-12 gap-4">
                    <div className="col-span-12">
                      <div className="form-group">
                        <label className="form-label">สถานะคำขอ</label>
                        {statusData != null && (
                          <>
                            {statusData
                              .filter((statusItem) => statusItem.ref_request_annual_driver_status_name !== "ยกเลิกคำขอ")
                              .map((statusItem, index) => (
                                <div className="custom-group" key={index}>
                                  <div className="custom-control custom-checkbox custom-control-inline">
                                    <input
                                      type="checkbox"
                                      value={statusItem.ref_request_annual_driver_status_code}
                                      checked={selectedStatuses.includes(
                                        statusItem.ref_request_annual_driver_status_code
                                      )}
                                      onChange={() =>
                                        handleCheckboxChange(statusItem.ref_request_annual_driver_status_code)
                                      }
                                      className="checkbox [--chkbg:#A80689] checkbox-sm rounded-md"
                                    />
                                    <label className="custom-control-label">
                                      <div className="custom-control-label-group">
                                        <span
                                          className={`badge badge-pill-outline ${
                                            statusItem.ref_request_annual_driver_status_name === "ถูกตีกลับ" ||
                                            statusItem.ref_request_annual_driver_status_name === "คืนยานพาหนะไม่สำเร็จ"
                                              ? "badge-error"
                                              : statusItem.ref_request_annual_driver_status_name === "อนุมัติ"
                                              ? "badge-success"
                                              : statusItem.ref_request_annual_driver_status_name === "ยกเลิกคำขอ"
                                              ? "badge-gray"
                                              : statusItem.ref_request_annual_driver_status_name === "ตีกลับคำขอ"
                                              ? "badge-warning"
                                              : "badge-info"
                                          }`}
                                        >
                                          {statusItem.ref_request_annual_driver_status_name}
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
                  </div>

                  <div className="col-span-12">
                    <div className="form-group">
                      <label className="form-label">ประเภทการขับขี่</label>
                      {licenseTypeOptions.map((licenseType, index) => (
                        <div className="custom-group !flex !gap-5 space-y-10" key={index}>
                          <div className="custom-control custom-checkbox flex items-center gap-4 space-y-2">
                            <input
                              type="checkbox"
                              value={licenseType.value}
                              checked={selectedLicenseTypes.includes(licenseType.value)}
                              onChange={() => handleLicenseTypeChange(licenseType.value)}
                              className="checkbox [--chkbg:#A80689] checkbox-sm rounded-md"
                            />
                            <label className="custom-control-label">
                              <div className="custom-control-label-group flex flex-col">
                                <p>{licenseType.label}</p>
                                {licenseType.desc && <small className="text-color-secondary">{licenseType.desc}</small>}
                              </div>
                            </label>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-12 gap-4">
                    <div className="col-span-12">
                      <div className="form-group">
                        <label className="form-label">ประจำปี</label>
                        <CustomSelect
                          w="md:w-full"
                          options={vehicleCatOptions}
                          value={selectedVehicleOption}
                          onChange={handleVehicleTypeChange}
                        />
                      </div>
                    </div>

                    <div className="col-span-12">
                      <div className="form-group">
                        <label className="form-label">วันที่สร้างคำขอ</label>
                        <div className="input-group flatpickr">
                          <div className="input-group-prepend" data-toggle="">
                            <span className="input-group-text">
                              <i className="material-symbols-outlined">calendar_month</i>
                            </span>
                          </div>
                          <DatePicker
                            ref={startDatePickerRef}
                            placeholder={"ระบุช่วงวันที่สร้างคำของ"}
                            onChange={handleStartDateChange}
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
                        <label className="form-label">วันที่สิ้นอายุใบอนุญาตขับขี่</label>
                        <div className="input-group flatpickr">
                          <div className="input-group-prepend" data-toggle="">
                            <span className="input-group-text">
                              <i className="material-symbols-outlined">calendar_month</i>
                            </span>
                          </div>
                          <DatePicker
                            ref={endDatePickerRef}
                            placeholder={"ระบุช่วงวันที่สิ้นอายุใบอนุญาตขับขี่"}
                            onChange={handleEndDateChange}
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
                    onClick={handleResetFilters}
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
                      onSubmitFilter({
                        selectedStatuses,
                        selectedStartDate,
                        selectedEndDate,
                        licenseTypes: selectedLicenseTypes,
                        year: selectedVehicleOption.value,
                      });
                      handleCloseModal();
                    }}
                  >
                    ยืนยัน
                  </button>
                </div>
              </div>
            </div>
            {/* <form method="dialog" className="modal-backdrop">
              <button>close</button>
            </form> */}
          </div>
        )}
      </div>
    );
  }
);

FilterDriverModal.displayName = "FilterDriverModal";

export default FilterDriverModal;
