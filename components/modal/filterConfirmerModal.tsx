"use client";

import { summaryType } from "@/app/types/request-list-type";
import { fetchVehicleDepartments } from "@/services/masterService";
import useSwipeDown from "@/utils/swipeDown";
import dayjs from "dayjs";
import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import CustomSelect, { CustomSelectOption } from "../customSelect";
import DateRangePicker from "../vehicle-management/input/dateRangeInput";

interface Props {
  statusData?: summaryType[];
  department?: boolean;
  selectedStatuses?: string[];
  selectedDates?: { start: string; end: string };
  selectedDepartment?: { value: string; label: string };
  setSelectedDepartment?: React.Dispatch<
    React.SetStateAction<{ value: string; label: string }>
  >;
  onSubmitFilter: (filters: {
    selectedStatuses: string[];
    selectedStartDate: string;
    selectedEndDate: string;
    department?: { value: string; label: string };
  }) => void;
}

const FilterConfirmerModal = forwardRef<
  { openModal: () => void; closeModal: () => void },
  Props
>(
  (
    {
      statusData,
      selectedStatuses: propSelectedStatuses = [],
      selectedDates,
      onSubmitFilter,
      department,
    },
    ref
  ) => {
    const modalRef = useRef<HTMLDialogElement>(null);
    const [openModal, setOpenModal] = useState(false);
    const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
    const [vehicleCatOptions, setVehicleCatOptions] = useState<
      CustomSelectOption[]
    >([]);
    const [resetKey, setResetKey] = useState(0);

    const [selectedVehicleOption, setSelectedVehicleOption] =
      useState<CustomSelectOption>({
        value: "",
        label: "ทั้งหมด",
      });
    const [params, setParams] = useState<{
      start_date: string;
      end_date: string;
    }>({
      start_date: selectedDates?.start || "",
      end_date: selectedDates?.end || "",
    });

    useEffect(() => {
      setSelectedStatuses(propSelectedStatuses || []);
    }, [propSelectedStatuses]);

    useEffect(() => {
      if (selectedDates) {
        setParams({
          start_date: selectedDates.start || "",
          end_date: selectedDates.end || "",
        });
      }
    }, [selectedDates]);

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
      setOpenModal(false);
    };

    const handleCheckboxChange = (code: string) => {
      setSelectedStatuses((prev) =>
        prev.includes(code) ? prev.filter((c) => c !== code) : [...prev, code]
      );
    };

    const handleVehicleTypeChange = (selectedOption: CustomSelectOption) => {
      setSelectedVehicleOption(selectedOption);
    };

    const handleResetFilters = () => {
      setSelectedStatuses([]);
      setParams({
        start_date: "",
        end_date: "",
      });
      setSelectedVehicleOption({ value: "", label: "ทั้งหมด" });
      setResetKey((prev) => prev + 1); // force re-render
    };

    useEffect(() => {
      if (department) {
        const fetchVehicleCarTypesData = async () => {
          try {
            const response = await fetchVehicleDepartments();
            if (response.status === 200) {
              const vehicleCatData = response.data;
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
            }
          } catch (error) {
            console.error("Error fetching requests:", error);
          }
        };
        fetchVehicleCarTypesData();
      }
    }, [department]);

    const swipeDownHandlers = useSwipeDown(() => modalRef.current?.close());

    return (
      <div>
        {openModal && (
          <div className="modal modal-open">
            <div className="modal-box max-w-[500px] p-0 rounded-none !overflow-visible flex flex-col max-h-[100vh] ml-auto mr-10 h-[100vh]">
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
                <button
                  className="close btn btn-icon border-none bg-transparent shadow-none btn-tertiary"
                  onClick={handleCloseModal}
                >
                  <i className="material-symbols-outlined">close</i>
                </button>
              </div>
              <div className="modal-scroll-wrapper overflow-y-auto">
                <div className="modal-body flex flex-col gap-4 h-[70vh] max-h-[70vh]">
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
                    {statusData && (
                      <div className="col-span-12">
                        <div className="form-group">
                          <label className="form-label">สถานะคำขอ</label>
                          {statusData?.length > 0 &&
                            statusData
                              .filter(
                                (statusItem) =>
                                  statusItem.ref_request_status_name !==
                                  "ยกเลิกคำขอ"
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
                                            statusItem.ref_request_status_name ===
                                              "ถูกตีกลับ" ||
                                            statusItem.ref_request_status_name ===
                                              "คืนยานพาหนะไม่สำเร็จ"
                                              ? "badge-error"
                                              : statusItem.ref_request_status_name ===
                                                  "อนุมัติแล้ว" ||
                                                statusItem.ref_request_status_name ===
                                                  "เสร็จสิ้น"
                                              ? "badge-success"
                                              : [
                                                  "ตีกลับยานพาหนะ",
                                                  "รอตรวจสอบ",
                                                  "ตีกลับ",
                                                ].includes(
                                                  statusItem.ref_request_status_name
                                                )
                                              ? "badge-warning"
                                              : "badge-info"
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
                    )}
                  </div>

                  <div className="grid grid-cols-12 gap-4">
                    <div className="col-span-12">
                      <div className="form-group text-left">
                        <label className="form-label">วันที่เดินทาง</label>
                        <DateRangePicker
                          key={resetKey}
                          placeholder={`ระบุช่วงวันที่เดินทาง`}
                          date={{
                            from: params.start_date
                              ? dayjs(params.start_date).toDate()
                              : undefined,
                            to: params.end_date
                              ? dayjs(params.end_date).toDate()
                              : undefined,
                          }}
                          onChange={(range) =>
                            setParams({
                              start_date: range?.from
                                ? dayjs(range.from).format("YYYY-MM-DD")
                                : "",
                              end_date: range?.to
                                ? dayjs(range.to).format("YYYY-MM-DD")
                                : "",
                            })
                          }
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
                  <button
                    className="btn btn-secondary"
                    onClick={handleCloseModal}
                  >
                    ยกเลิก
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={() => {
                      onSubmitFilter({
                        selectedStatuses,
                        selectedStartDate: params.start_date,
                        selectedEndDate: params.end_date,
                        department: {
                          value: selectedVehicleOption.value,
                          label:
                            typeof selectedVehicleOption.label === "string"
                              ? selectedVehicleOption.label
                              : "",
                        },
                      });
                      handleCloseModal();
                    }}
                  >
                    ยืนยัน
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
);

FilterConfirmerModal.displayName = "FilterConfirmerModal";
export default FilterConfirmerModal;
