"use client";

import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import DatePicker, { DatePickerRef } from "@/components/datePicker";
import { summaryType } from "@/app/types/request-list-type";
import useSwipeDown from "@/utils/swipeDown";
import CustomSelect from "../customSelect";
import { fetchVehicleDepartments } from "@/services/masterService";

interface Props {
  statusData: summaryType[];
  department?: boolean;
  onSubmitFilter: (filters: {
    selectedStatuses: string[];
    selectedStartDate: string;
    selectedEndDate: string;
    department?: string;
  }) => void;
}

const FilterModal = forwardRef<
  { openModal: () => void; closeModal: () => void },
  Props
>(({ statusData, onSubmitFilter, department }, ref) => {
  const modalRef = useRef<HTMLDialogElement>(null);

  useImperativeHandle(ref, () => ({
    openModal: () => modalRef.current?.showModal(),
    closeModal: () => modalRef.current?.close(),
  }));

  const [selectedStartDate, setSelectedStartDate] = useState<string>("");
  const [selectedEndDate, setSelectedEndDate] = useState<string>("");
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
  const [vehicleCatOptions, setVehicleCatOptions] = useState<
    { value: string; label: string }[]
  >([]);

  // Separate refs for each DatePicker
  const startDatePickerRef = useRef<DatePickerRef>(null);
  const endDatePickerRef = useRef<DatePickerRef>(null);

  const handleStartDateChange = (dateStr: string) => {
    setSelectedStartDate(dateStr);
  };

  const handleEndDateChange = (dateStr: string) => {
    setSelectedEndDate(dateStr);
  };

  const handleCheckboxChange = (code: string) => {
    setSelectedStatuses((prev) =>
      prev.includes(code) ? prev.filter((c) => c !== code) : [...prev, code]
    );
  };

  const [selectedVehicleOption, setSelectedVehicleOption] = useState<{
    value: string;
    label: string;
  }>({ value: "", label: "ทั้งหมด" });

  useEffect(() => {
    if (department) {
    }
    const fetchVehicleCarTypesData = async () => {
      try {
        const response = await fetchVehicleDepartments();

        if (response.status === 200) {
          const vehicleCatData = response.data;
          console.log("tt", response.data);
          const vehicleCatArr = [
            { value: "", label: "ทั้งหมด" },
            ...vehicleCatData.map(
              (cat: {
                vehicle_owner_dept_sap: string;
                dept_sap_short: string;
              }) => ({
                value: cat.vehicle_owner_dept_sap,
                label: cat.dept_sap_short,
              })
            ),
          ];

          setVehicleCatOptions(vehicleCatArr);
          setSelectedVehicleOption((prev) =>
            prev.value ? prev : vehicleCatArr[0]
          );
        }
      } catch (error) {
        console.error("Error fetching requests:", error);
      }
    };

    fetchVehicleCarTypesData();
  }, []);

  const handleVehicleTypeChange = async (selectedOption: {
    value: string;
    label: string;
  }) => {
    setSelectedVehicleOption(selectedOption);
    // setParams((prev) => ({ ...prev, category_code: selectedOption.value }));
  };

  // Reset function
  const handleResetFilters = () => {
    setSelectedStatuses([]);
    setSelectedStartDate("");
    setSelectedEndDate("");
    startDatePickerRef.current?.reset(); // Reset start date picker
    endDatePickerRef.current?.reset(); // Reset end date picker
  };

  const swipeDownHandlers = useSwipeDown(() => modalRef.current?.close());

  return (
    <dialog ref={modalRef} className="modal">
      <div className="modal-box max-w-[500px] p-0 relative rounded-none overflow-hidden flex flex-col max-h-[100vh] ml-auto mr-10 h-[100vh]">
        <div className="bottom-sheet" {...swipeDownHandlers}>
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
                  กรองข้อมูลให้แสดงเฉพาะข้อมูลที่ต้องการ
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
        <div className="modal-body overflow-y-auto flex flex-col gap-4 h-[70vh] max-h-[70vh]">
          <div className="grid grid-cols-12 gap-4">
            {department && (
              <div className="col-span-12">
                <div className="form-group">
                  <label className="form-label">สังกัดยานพาหนะ</label>
                  <CustomSelect
                    w="md:w-full"
                    options={vehicleCatOptions}
                    value={selectedVehicleOption}
                    onChange={handleVehicleTypeChange}
                  />
                </div>
              </div>
            )}
            <div className="col-span-12">
              <div className="form-group">
                <label className="form-label">สถานะคำขอ</label>
                {statusData
                  .filter(
                    (statusItem) =>
                      statusItem.ref_request_status_name !== "ยกเลิกคำขอ"
                  )
                  .map((statusItem, index) => (
                    <div className="custom-group" key={index}>
                      <div className="custom-control custom-checkbox custom-control-inline">
                        <input
                          type="checkbox"
                          value={statusItem.ref_request_status_code}
                          checked={selectedStatuses.includes(
                            statusItem.ref_request_status_code
                          )}
                          onChange={() =>
                            handleCheckboxChange(
                              statusItem.ref_request_status_code
                            )
                          }
                          className="checkbox [--chkbg:#A80689] checkbox-sm rounded-md"
                        />
                        <label className="custom-control-label">
                          <div className="custom-control-label-group">
                            <span
                              className={`badge badge-pill-outline ${
                                (statusItem.ref_request_status_name ===
                                "รออนุมัติ" ||  statusItem.ref_request_status_name === "รอรับกุญแจ")
                                  ? "badge-info"
                                  : statusItem.ref_request_status_name ===
                                    "อนุมัติแล้ว"
                                  ? "badge-success"
                                  : "badge-error"
                              }`}
                            >
                              {statusItem.ref_request_status_name}
                            </span>
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
                <label className="form-label">วันที่เริ่มเดินทาง</label>
                <div className="input-group flatpickr">
                  <div className="input-group-prepend" data-toggle="">
                    <span className="input-group-text">
                      <i className="material-symbols-outlined">
                        calendar_month
                      </i>
                    </span>
                  </div>
                  <DatePicker
                    ref={startDatePickerRef}
                    placeholder={"ระบุช่วงวันที่เริ่มเดินทาง"}
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
                <label className="form-label">วันที่สิ้นสุดเดินทาง</label>
                <div className="input-group flatpickr">
                  <div className="input-group-prepend" data-toggle="">
                    <span className="input-group-text">
                      <i className="material-symbols-outlined">
                        calendar_month
                      </i>
                    </span>
                  </div>
                  <DatePicker
                    ref={endDatePickerRef} // Attach ref to end date picker
                    placeholder={"ระบุช่วงวันที่สิ้นสุดเดินทาง"}
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
              <button className="btn btn-secondary">ยกเลิก</button>
            </form>
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => {
                onSubmitFilter({
                  selectedStatuses,
                  selectedStartDate,
                  selectedEndDate,
                  department: selectedVehicleOption.label
                });
                modalRef.current?.close(); // Close modal manually
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

FilterModal.displayName = "FilterModal";

export default FilterModal;
