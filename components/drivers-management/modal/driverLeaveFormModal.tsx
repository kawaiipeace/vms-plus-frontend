import DatePicker from "@/components/datePicker";
import TimePicker from "@/components/timePicker";
import CustomSelect from "@/components/drivers-management/customSelect";
import FormHelper from "@/components/formHelper";
import RadioButton from "@/components/radioButton";
import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import * as Yup from "yup";

import { DriverLeaveTimeList, driverReplacementLists, driverUpdateLeaveStatus } from "@/services/driversManagement";
import { convertToISO8601, convertToThaiDate } from "@/utils/driver-management";

import {
  DriverInfoType,
  DriverLeaveStatus,
  DriverLeaveTimeType,
  DriverReplacementDetails,
} from "@/app/types/drivers-management-type";
import { formatDateToThai } from "@/components/drivers-management/driverForm";

interface CustomSelectOption {
  value: string;
  label: React.ReactNode | string;
  labelDetail?: React.ReactNode | string;
}

interface DriverLeaveFormModalProps {
  driverInfo: DriverInfoType | null;
  onUpdateDriver: React.Dispatch<React.SetStateAction<boolean>>;
  setUpdateType: React.Dispatch<React.SetStateAction<string>>;
}

const DriverLeaveFormModal = forwardRef<{ openModal: () => void; closeModal: () => void }, DriverLeaveFormModalProps>(
  ({ driverInfo, onUpdateDriver, setUpdateType }, ref) => {
    const modalRef = useRef<HTMLDialogElement>(null);
    const [leaveTimeList, setLeaveTimeList] = useState<DriverLeaveTimeType[]>([]);
    const [btnDisabled, setBtnDisabled] = useState(true);
    const [driverReplacementList, setDriverReplacementList] = useState<CustomSelectOption[]>([]);
    const [disableStartDate, setDisableStartDate] = useState<string>();
    const [formData, setFormData] = useState({
      leave_end_date: "",
      leave_reason: "",
      leave_start_date: "",
      leave_time_type_code: 1,
      replacement_driver_uid: "",
      leave_start_timeStart: "8:30",
      leave_start_timeEnd: "8:30",
    });
    const [formErrors, setFormErrors] = useState({
      leave_end_date: "",
      leave_reason: "",
      leave_start_date: "",
      leave_time_type_code: "",
      replacement_driver_uid: "",
      leave_start_timeStart: "",
      leave_start_timeEnd: "",
    });

    const validationSchema = Yup.object().shape({
      leave_end_date: Yup.string().required("Required"),
      leave_reason: Yup.string().required("Required"),
      leave_start_date: Yup.string().required("Required"),
      leave_time_type_code: Yup.number().required("Required"),
      replacement_driver_uid: Yup.string().required("Required"),
    });

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
    useEffect(() => {
      const fetchLeaveTimeList = async () => {
        try {
          const response = await DriverLeaveTimeList();
          setLeaveTimeList(response.data);
        } catch (error) {
          console.error("Error fetching leave time list:", error);
        }
      };

      const fetchDriverReplacementLists = async () => {
        const name = "";
        try {
          const response = await driverReplacementLists(name);
          const driverReplacementData: CustomSelectOption[] = response.data
            .filter((e: DriverReplacementDetails) => e.driver_name !== driverInfo?.driver_name)
            .map((item: DriverReplacementDetails) => {
              return {
                value: item.mas_driver_uid,
                label: `${item.driver_name}${item.driver_nickname && `(${item.driver_nickname})`}`,
              };
            });
          setDriverReplacementList(driverReplacementData);
          // setDriverReplacementList(response.data);
        } catch (error) {
          console.error("Error fetching driver replacement lists:", error);
        }
      };

      fetchLeaveTimeList();
      fetchDriverReplacementLists();
    }, [driverInfo]);

    useEffect(() => {
      handleLeaveTimeCheck(formData);
    }, [formData]);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      try {
        await validationSchema.validate(formData, { abortEarly: false });

        // console.log("Leave Data:", formData);

        const leaveData: DriverLeaveStatus = {
          leave_end_date: formData.leave_end_date,
          leave_reason: formData.leave_reason,
          leave_start_date: formData.leave_start_date,
          leave_time_type_code: formData.leave_time_type_code,
          mas_driver_uid: driverInfo?.mas_driver_uid || "",
          replacement_driver_uid: formData.replacement_driver_uid,
        };

        try {
          const response = await driverUpdateLeaveStatus(leaveData);
          if (response.status === 200) {
            handleCloseModal();
            onUpdateDriver(true);
            setUpdateType("leave");
          }
        } catch (error) {
          console.error("Error submitting leave data:", error);
        }
      } catch (error) {
        if (error instanceof Yup.ValidationError) {
          const errors: { [key: string]: string } = {};
          error.inner.forEach((err) => {
            if (err.path) {
              errors[err.path] = err.message;
            }
          });
          setFormErrors((prevErrors) => ({
            ...prevErrors,
            ...errors,
          }));
        }
      }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    };

    const handleChangeLeaveStartDate = (dateStr: string) => {
      const dateStrISO = convertToISO8601(dateStr);
      const thaiDate = formatDateToThai(dateStrISO);
      setFormData((prevData) => ({
        ...prevData,
        leave_start_date: dateStrISO,
      }));

      setDisableStartDate(thaiDate);
    };

    const handleChangeLeaveEndDate = (dateStr: string) => {
      const dateStrISO = convertToISO8601(dateStr);
      setFormData((prevData) => ({
        ...prevData,
        leave_end_date: dateStrISO,
      }));
    };

    const handleChangeLeaveTime = (value: string) => {
      setFormData((prevData) => ({
        ...prevData,
        leave_time_type_code: Number(value),
      }));
    };

    const handleLeaveTimeCheck = (data: {
      leave_end_date: string;
      leave_reason: string;
      leave_start_date: string;
      leave_time_type_code: number;
      replacement_driver_uid: string;
    }) => {
      if (
        data.leave_end_date === "" ||
        data.leave_reason === "" ||
        data.leave_start_date === "" ||
        data.leave_time_type_code === 0 ||
        data.replacement_driver_uid === ""
      ) {
        setBtnDisabled(true);
      } else {
        setBtnDisabled(false);
      }
    };

    return (
      <>
        {openModal && (
          <div className={`modal modal-middle modal-open`}>
            <div className="modal-box max-w-[500px] p-0 relative overflow-hidden flex flex-col bg-white">
              <div className="modal-header bg-white sticky top-0 flex justify-between z-10">
                <div className="modal-title">ลาป่วย/ลากิจ</div>
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
                <div className="modal-body">
                  <div className="form-section">
                    <div className="form-section-body">
                      <div className="grid md:grid-cols-2 grid-cols-1 gap-4">
                        <div className="w-full">
                          <div className="form-group">
                            <label className="form-label">วันที่เริ่มต้นลา</label>
                            <div className={`input-group`}>
                              <div className="input-group-prepend">
                                <span className="input-group-text">
                                  <i className="material-symbols-outlined">calendar_month</i>
                                </span>
                              </div>
                              <DatePicker
                                placeholder="วันที่เริ่มต้นลา"
                                defaultValue={convertToThaiDate(formData.leave_start_date)}
                                onChange={(dateStr) => {
                                  handleChangeLeaveStartDate(dateStr);
                                  setFormData((prev) => ({ ...prev, leave_end_date: "" }));
                                }}
                              />
                            </div>
                            {formErrors.leave_start_date && <FormHelper text={String(formErrors.leave_start_date)} />}
                          </div>
                        </div>
                        <div className="w-full">
                          <div className="form-group">
                            <label className="form-label">&nbsp;</label>
                            <div className={`input-group`}>
                              <div className="input-group-prepend">
                                <span className="input-group-text">
                                  <i className="material-symbols-outlined">schedule</i>
                                </span>
                              </div>
                              <TimePicker
                                placeholder="ระบุเวลาที่ออกเดินทาง"
                                defaultValue={formData.leave_start_timeStart ? formData.leave_start_timeStart : "8:30"}
                                onChange={(dateStr) => {
                                  setFormData((prev) => ({ ...prev, leave_start_timeStart: dateStr }));
                                }}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="grid md:grid-cols-2 grid-cols-1 gap-4 mt-3">
                        <div className="w-full">
                          <div className="form-group">
                            <label className="form-label">วันที่สิ้นสุดลา</label>
                            <div className={`input-group`}>
                              <div className="input-group-prepend">
                                <span className="input-group-text">
                                  <i className="material-symbols-outlined">calendar_month</i>
                                </span>
                              </div>
                              <DatePicker
                                key={disableStartDate || "default"}
                                placeholder="วันที่สิ้นสุดลา"
                                defaultValue={convertToThaiDate(formData.leave_end_date)}
                                onChange={(dateStr) => handleChangeLeaveEndDate(dateStr)}
                                minDate={disableStartDate ? disableStartDate : undefined}
                                // disabled={disableStartDate ? false : true}
                              />
                            </div>
                            {formErrors.leave_start_date && <FormHelper text={String(formErrors.leave_start_date)} />}
                          </div>
                        </div>
                        <div className="w-full">
                          <div className="form-group">
                            <label className="form-label">&nbsp;</label>
                            <div className={`input-group`}>
                              <div className="input-group-prepend">
                                <span className="input-group-text">
                                  <i className="material-symbols-outlined">schedule</i>
                                </span>
                              </div>
                              <TimePicker
                                placeholder="ระบุเวลาที่ออกเดินทาง"
                                defaultValue={formData.leave_start_timeEnd ? formData.leave_start_timeEnd : "8:30"}
                                onChange={(dateStr) => {
                                  setFormData((prev) => ({ ...prev, leave_start_timeEnd: dateStr }));
                                }}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="w-full grid grid-cols-1 mt-3">
                        {/* <div className="form-group">
                          <label className="form-label">ช่วงเวลา</label>
                          <div className="flex flex-wrap gap-4">
                            {leaveTimeList.map((item, index) => (
                              <div key={index} className="form-group">
                                <RadioButton
                                  name="leaveTimeType"
                                  value={`${item.leave_time_type_code}`}
                                  label={item.leave_time_type_name ?? ""}
                                  selectedValue={`${formData.leave_time_type_code}`}
                                  setSelectedValue={handleChangeLeaveTime}
                                />
                              </div>
                            ))}
                            {formErrors.leave_time_type_code && (
                              <FormHelper text={String(formErrors.leave_time_type_code)} />
                            )}
                          </div>
                        </div> */}
                        <div className="w-full grid grid-cols-1">
                          <div className="w-full">
                            <div className="form-group">
                              <label className="form-label">เหตุผลการลา</label>
                              <div className={`input-group`}>
                                <input
                                  type="text"
                                  name="leave_reason"
                                  className="form-control"
                                  placeholder="เหตุผลการลา"
                                  onChange={handleInputChange}
                                />
                              </div>
                              {formErrors.leave_reason && <FormHelper text={String(formErrors.leave_reason)} />}
                            </div>
                          </div>
                        </div>
                        <div className="w-full grid grid-cols-1 mt-3">
                          <div className="w-full">
                            <div className="form-group">
                              <label className="form-label">พนักงานที่จะมาปฏิบัติงานแทน</label>
                              <CustomSelect
                                w="w-full"
                                options={driverReplacementList}
                                value={
                                  driverReplacementList.find(
                                    (option) => option.value === formData.replacement_driver_uid
                                  ) || null
                                }
                                onChange={(selected) => {
                                  setFormData((prev) => ({ ...prev, replacement_driver_uid: selected.value }));
                                }}
                              />
                              {formErrors.replacement_driver_uid && (
                                <FormHelper text={String(formErrors.replacement_driver_uid)} />
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="modal-action mt-5 flex gap-3 justify-end px-4 pb-4">
                  <div>
                    <button className="btn btn-secondary w-full" type="button" onClick={handleCloseModal}>
                      ยกเลิก
                    </button>
                  </div>
                  <button type="submit" className="btn btn-primary" disabled={btnDisabled}>
                    บันทึก
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </>
    );
  }
);

DriverLeaveFormModal.displayName = "DriverLeaveFormModal";

export default DriverLeaveFormModal;
