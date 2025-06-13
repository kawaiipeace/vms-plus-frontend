import DatePicker from "@/components/datePicker";
import CustomSelect, { CustomSelectOption } from "@/components/drivers-management/customSelect";
import FormHelper from "@/components/formHelper";
import RadioButton from "@/components/radioButton";
import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import * as Yup from "yup";
import CustomSearchSelect from "@/components/customSelectSerch";
import dayjs from "dayjs";
import buddhistEra from "dayjs/plugin/buddhistEra";

dayjs.extend(buddhistEra);
dayjs.locale("th");

import {
  driverReplacementLists,
  driverUpdateContractDetails,
  listDriverDepartment,
  listUseByOtherRadio,
} from "@/services/driversManagement";

import {
  DriverInfoType,
  DriverReplacementDetails,
  DriverUpdateContractDetails,
} from "@/app/types/drivers-management-type";
import { convertToISO8601, convertToThaiDate } from "@/utils/driver-management";
import { formatDateToThai } from "@/components/drivers-management/driverForm";

interface UseByOtherRadioItem {
  ref_other_use_desc: string;
  ref_other_use_code: string;
}

interface DriverEditInfoModalProps {
  driverInfo?: DriverInfoType | null;
  onUpdateDriver: React.Dispatch<React.SetStateAction<boolean>>;
  setUpdateType: React.Dispatch<React.SetStateAction<string>>;
}

const DriverEditInfoModal = forwardRef<{ openModal: () => void; closeModal: () => void }, DriverEditInfoModalProps>(
  ({ driverInfo, onUpdateDriver, setUpdateType }, ref) => {
    const modalRef = useRef<HTMLDialogElement>(null);
    const [operationType, setOperationType] = useState<string>("1");
    const [useByotherRadio, setUseByotherRadio] = useState<UseByOtherRadioItem[]>([]);
    const [driverReplacementList, setDriverReplacementList] = useState<CustomSelectOption[]>([]);
    // const [useByOther, setUseByOther] = useState<string>("0");
    const [driverDepartmentList, setDriverDepartmentList] = useState<
      { value: string; label: string; labelDetail: string }[]
    >([]);
    // const [driverVendorsList, setDriverVendorsList] = useState<{ value: string; label: string }[]>([]);
    const [disableStartDate, setDisableStartDate] = useState<string>();
    const [driverDepartmentOptions, setDriverDepartmentOptions] = useState<CustomSelectOption>({
      value: "",
      label: "ทั้งหมด",
    });
    const [driverEmployingAgencyOptions, setDriverEmployingAgencyOptions] = useState<CustomSelectOption>({
      value: "",
      label: "ทั้งหมด",
    });
    const [formData, setFormData] = useState({
      driverContractStartDate: "",
      driverContractEndDate: "",
      driverContractNo: "",
      driverEmployingAgency: "",
      driverDepartment: "",
      driverContractorCompany: "",
      driverUseByOther: 0,
      driverOperationType: "0",
      driverReplacementEmployee: "",
    });
    const [formErrors, setFormErrors] = useState({
      driverContractStartDate: "",
      driverContractEndDate: "",
      driverContractNo: "",
      driverEmployingAgency: "",
      driverDepartment: "",
      driverContractorCompany: "",
      driverUseByOther: "",
      driverOperationType: "",
      driverReplacementEmployee: "",
    });

    // const [disableStartDate, setDisableStartDate] = useState<string>();
    // const [disableEndDate, setDisableEndDate] = useState<string>();

    const driverEditInfoSchema = Yup.object().shape({
      driverContractStartDate: Yup.string().required("กรุณาเลือกวันที่เริ่มต้นสัญญาจ้าง"),
      driverContractEndDate: Yup.string().required("กรุณาเลือกวันที่สิ้นสุดสัญญาจ้าง"),
      driverContractNo: Yup.string().required("กรุณากรอกเลขที่สัญญาจ้าง"),
      driverEmployingAgency: Yup.string().required("กรุณาเลือกหน่วยงานผู้ว่าจ้าง"),
      driverDepartment: Yup.string().required("กรุณาเลือกหน่วยงานที่สังกัด"),
      driverContractorCompany: Yup.string().required("กรุณาเลือกบริษัทผู้รับจ้าง"),
      driverUseByOther: Yup.string().required("กรุณาเลือกหน่วยงานอื่นสามารถขอใช้งานได้"),
      driverOperationType: Yup.string().required("กรุณาเลือกประเภทการปฏิบัติงาน"),
      driverReplacementEmployee: Yup.string().optional(),
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
      if (driverInfo && driverDepartmentList.length > 0) {
        const initialDepartment = driverDepartmentList.find(
          (option) => option.label === driverInfo.driver_dept_sap_short_name_work
        );
        const initialEmployingAgency = driverDepartmentList.find(
          (option) => option.label === driverInfo.driver_dept_sap_short_name_hire
        );

        setDriverDepartmentOptions({
          value: initialDepartment?.value || "",
          label: initialDepartment?.label || "ทั้งหมด",
        });
        setDriverEmployingAgencyOptions({
          value: initialEmployingAgency?.value || "",
          label: initialEmployingAgency?.label || "ทั้งหมด",
        });

        // console.log("Department : ", initialDepartment, "Employing Agency : ", initialEmployingAgency);

        setFormData({
          driverContractStartDate: driverInfo.approved_job_driver_start_date || "",
          driverContractEndDate: driverInfo.approved_job_driver_end_date || "",
          driverContractNo: driverInfo.contract_no || "",
          driverEmployingAgency: initialEmployingAgency?.value || "",
          driverDepartment: initialDepartment?.value || "",
          driverContractorCompany: driverInfo.vendor_name || "",
          driverUseByOther: Number(driverInfo.ref_other_use_code) || 0,
          driverOperationType: driverInfo.is_replacement || "0",
          driverReplacementEmployee: driverInfo.replacement_driver_uid || "",
        });
        // setDisableEndDate(
        //   driverInfo.approved_job_driver_start_date
        //     ? convertToThaiDate(driverInfo.approved_job_driver_start_date)
        //     : undefined
        // );
        // setDisableStartDate(
        //   driverInfo.approved_job_driver_end_date
        //     ? convertToThaiDate(driverInfo.approved_job_driver_end_date)
        //     : undefined
        // );
      }
    }, [driverInfo, driverDepartmentList]);

    useEffect(() => {
      const fetchUseByOtherRadio = async () => {
        try {
          const response = await listUseByOtherRadio();
          setUseByotherRadio(response.data);
        } catch (error) {
          console.error("Error fetching use by other radio:", error);
        }
      };

      const fetchDriverDepartment = async () => {
        try {
          const response = await listDriverDepartment();
          const driverDepartmentData = response.data.map(
            (item: { dept_sap: string; dept_short: string; dept_full: string }) => {
              return {
                value: item.dept_sap,
                label: item.dept_short,
                desc: item.dept_full,
              };
            }
          );
          // console.log(driverDepartmentData);
          setDriverDepartmentList(driverDepartmentData);
        } catch (error) {
          console.error("Error fetching driver department data:", error);
        }
      };

      fetchDriverDepartment();
      fetchUseByOtherRadio();
    }, []);

    useEffect(() => {
      const fetchDriverReplacementLists = async () => {
        try {
          const name = "";
          const response = await driverReplacementLists(name);
          const driverReplacementData: CustomSelectOption[] = response.data
            .filter((e: DriverReplacementDetails) => e.driver_name !== driverInfo?.driver_name)
            .map((item: DriverReplacementDetails) => {
              return {
                value: item.mas_driver_uid,
                label: `${item.driver_name}${item.driver_nickname && `(${item.driver_nickname})`}`,
              };
            }); // Exclude current driver

          const addDriverReplacementOption: CustomSelectOption = {
            value: "",
            label: "ไม่มี",
          };
          driverReplacementData.unshift(addDriverReplacementOption);

          console.log("Driver Replacement Data:", driverReplacementData);

          setDriverReplacementList(driverReplacementData);
        } catch (error) {
          console.error("Error fetching driver replacement lists:", error);
        }
      };

      fetchDriverReplacementLists();
    }, [driverInfo]);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      try {
        await driverEditInfoSchema.validate(formData, { abortEarly: false });
        const params: DriverUpdateContractDetails = {
          approved_job_driver_end_date: formData.driverContractEndDate,
          approved_job_driver_start_date: formData.driverContractStartDate,
          contract_no: formData.driverContractNo,
          driver_dept_sap_hire: formData.driverEmployingAgency,
          driver_dept_sap_work: formData.driverDepartment,
          mas_driver_uid: driverInfo?.mas_driver_uid || "",
          vendor_name: formData.driverContractorCompany,
          ref_other_use_code: formData.driverUseByOther,
          is_replacement: formData.driverOperationType,
          replacement_driver_uid: formData.driverReplacementEmployee != "" ? formData.driverReplacementEmployee : null,
        };

        console.log("Submitting form with params:", params);

        // Submit form data
        try {
          const response = await driverUpdateContractDetails({ params });
          if (response.status === 200) {
            handleCloseModal();
            onUpdateDriver(true);
            setUpdateType("basicInfo");
          }
          console.log("Form submitted successfully", params);
        } catch (error) {
          console.error("Error submitting form", error);
        }
      } catch (error) {
        if (error instanceof Yup.ValidationError) {
          const errors: { [key: string]: string } = {};
          error.inner.forEach((err) => {
            if (err.path) {
              errors[err.path] = err.message;
            }
          });
          setFormErrors({
            driverContractStartDate: "",
            driverContractEndDate: "",
            driverContractNo: "",
            driverEmployingAgency: "",
            driverDepartment: "",
            driverContractorCompany: "",
            driverUseByOther: "",
            driverOperationType: "",
            driverReplacementEmployee: "",
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

    const handleChangeContractStartDate = (dateStr: string) => {
      const dateStrISO = convertToISO8601(dateStr);
      const thaiDate = formatDateToThai(dateStrISO);
      setFormData((prevData) => ({
        ...prevData,
        driverContractStartDate: dateStrISO,
      }));
      // setDisableStartDate(dateStr);
      setDisableStartDate(thaiDate);
    };

    const handleChangeContractEndDate = (dateStr: string) => {
      const dateStrISO = convertToISO8601(dateStr);
      setFormData((prevData) => ({
        ...prevData,
        driverContractEndDate: dateStrISO,
      }));

      // setDisableEndDate(dateStr);
    };

    const handleDriverDepartmentChange = async (selectedOption: { value: string; label: string | React.ReactNode }) => {
      // console.log(selectedOption);
      setFormData((prevData) => ({
        ...prevData,
        driverDepartment: selectedOption.value,
      }));
      console.log("Selected Employing Agency:", selectedOption);
      setDriverDepartmentOptions(selectedOption as { value: string; label: string });
    };

    const handleDriverEmployingAgencyChange = async (selectedOption: {
      value: string;
      label: string | React.ReactNode;
    }) => {
      // console.log(selectedOption);
      setFormData((prevData) => ({
        ...prevData,
        driverEmployingAgency: selectedOption.value,
      }));
      console.log("Selected Department:", selectedOption);
      setDriverEmployingAgencyOptions(selectedOption as { value: string; label: string });
    };

    const buddhistYear = dayjs(formData.driverContractStartDate).year() + 543;

    return (
      <>
        {openModal && (
          <div className={`modal modal-middle modal-open`}>
            <div className="modal-box max-w-[600px] p-0 relative overflow-hidden flex flex-col bg-white">
              <div className="modal-header bg-white sticky top-0 flex justify-between z-10">
                <div className="modal-title">แก้ไขข้อมูลสัญญาจ้างและสังกัด</div>
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
                <div className="modal-scroll-wrapper overflow-y-auto max-h-[70vh] h-[60vh] ">
                  <div className="modal-body  text-center h-[60vh] max-h-[60vh]">
                    <div className="form-section">
                      <div className="form-section-body">
                        <div className="grid md:grid-cols-2 gird-cols-1 gap-4">
                          <div className="w-full">
                            <div className="form-group">
                              <label className="label form-label">เลขที่สัญญาจ้าง</label>
                              <div className={`input-group`}>
                                <input
                                  type="text"
                                  name="driverContractNo"
                                  className="form-control"
                                  placeholder="เลขที่สัญญาจ้าง"
                                  value={formData.driverContractNo}
                                  onChange={handleInputChange}
                                />
                              </div>
                              {formErrors.driverContractNo && <FormHelper text={String(formErrors.driverContractNo)} />}
                            </div>
                          </div>
                          <div className="w-full">
                            <div className="form-group">
                              <label className="label form-label">หน่วยงานผู้ว่าจ้าง</label>
                              {/* <CustomSelect
                                w="w-full"
                                options={driverDepartmentList}
                                value={
                                  driverDepartmentList.find(
                                    (option) => option.value === formData.driverEmployingAgency
                                  ) || null
                                }
                                onChange={(selected) => {
                                  setFormData((prev) => ({ ...prev, driverEmployingAgency: selected.value }));
                                }}
                              /> */}
                              <CustomSearchSelect
                                w="md:w-full"
                                options={driverDepartmentList}
                                value={driverEmployingAgencyOptions}
                                enableSearch
                                showDescriptions
                                onChange={handleDriverEmployingAgencyChange}
                              />
                              {formErrors.driverEmployingAgency && (
                                <FormHelper text={String(formErrors.driverEmployingAgency)} />
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="grid md:grid-cols-2 gird-cols-1 gap-4">
                          <div className="w-full">
                            <div className="form-group">
                              <label className="label form-label">บริษัทผู้รับจ้าง</label>
                              {/* <CustomSelect
                                w="w-full"
                                options={driverVendorsList}
                                value={
                                  driverVendorsList.find(
                                    (option) => option.value === formData.driverContractorCompany
                                  ) || null
                                }
                                onChange={(selected) => {
                                  setFormData((prev) => ({ ...prev, driverContractorCompany: selected.value }));
                                }}
                              /> */}
                              <input
                                type="text"
                                name="driverContractorCompany"
                                className="form-control"
                                placeholder="บริษัทผู้รับจ้าง"
                                value={formData.driverContractorCompany}
                                onChange={handleInputChange}
                              />
                              {formErrors.driverContractorCompany && (
                                <FormHelper text={String(formErrors.driverContractorCompany)} />
                              )}
                            </div>
                          </div>
                          <div className="w-full">
                            <div className="form-group">
                              <label className="label form-label">หน่วยงานที่สังกัด</label>
                              {/* <CustomSelect
                                w="w-full"
                                options={driverDepartmentList}
                                value={
                                  driverDepartmentList.find((option) => option.value === formData.driverDepartment) ||
                                  null
                                }
                                onChange={(selected) => {
                                  setFormData((prev) => ({ ...prev, driverDepartment: selected.value }));
                                }}
                              /> */}
                              <CustomSearchSelect
                                w="md:w-full"
                                options={driverDepartmentList}
                                value={driverDepartmentOptions}
                                enableSearch
                                showDescriptions
                                onChange={handleDriverDepartmentChange}
                              />
                              {formErrors.driverDepartment && <FormHelper text={String(formErrors.driverDepartment)} />}
                            </div>
                          </div>
                        </div>
                        <div className="grid md:grid-cols-2 gird-cols-1 gap-4">
                          <div className="w-full">
                            <div className="form-group">
                              <label className="label form-label">วันเริ่มต้นสัญญาจ้าง</label>
                              {/* {dayjs(formData.driverContractStartDate).format("D/MM/BBBB")}
                              {formData.driverContractStartDate} */}
                              <div className={`input-group`}>
                                <div className="input-group-prepend">
                                  <span className="input-group-text">
                                    <i className="material-symbols-outlined">calendar_month</i>
                                  </span>
                                </div>
                                <DatePicker
                                  placeholder="เลือกวันที่เริ่มต้น"
                                  defaultValue={
                                    buddhistYear < 1980
                                      ? dayjs(formData.driverContractStartDate)
                                          .year(dayjs(formData.driverContractStartDate).year() + 1980)
                                          .format("D/MM/BBBB")
                                      : dayjs(formData.driverContractStartDate).format("D/MM/BBBB")
                                  }
                                  // defaultValue={convertToThaiDate(formData.driverContractStartDate)}
                                  onChange={(dateStr) => {
                                    handleChangeContractStartDate(dateStr);
                                    setFormData((prev) => ({ ...prev, driverContractEndDate: "" }));
                                  }}
                                  // maxDate={disableEndDate || undefined}
                                />
                              </div>
                              {formErrors.driverContractStartDate && (
                                <FormHelper text={String(formErrors.driverContractStartDate)} />
                              )}
                            </div>
                          </div>
                          <div className="w-full">
                            <div className="form-group">
                              <label className="label form-label">วันสิ้นสุดสัญญาจ้าง</label>
                              {/* {formData.driverContractEndDate} */}
                              <div className={`input-group`}>
                                <div className="input-group-prepend">
                                  <span className="input-group-text">
                                    <i className="material-symbols-outlined">calendar_month</i>
                                  </span>
                                </div>
                                <DatePicker
                                  key={disableStartDate || "default"} // Reset DatePicker when disableStartDate changes
                                  placeholder="เลือกวันที่สิ้นสุด"
                                  defaultValue={
                                    buddhistYear < 1980
                                      ? dayjs(formData.driverContractEndDate)
                                          .year(dayjs(formData.driverContractEndDate).year() + 1980)
                                          .format("D/MM/BBBB")
                                      : dayjs(formData.driverContractEndDate).format("D/MM/BBBB")
                                  }
                                  // defaultValue={dayjs(formData.driverContractEndDate).format("D/MM/BBBB")}
                                  // defaultValue={convertToThaiDate(formData.driverContractEndDate)}
                                  onChange={(dateStr) => handleChangeContractEndDate(dateStr)}
                                  // minDate={disableStartDate || undefined}
                                  minDate={disableStartDate ? disableStartDate : undefined}
                                  // disabled={disableStartDate ? false : true}
                                />
                              </div>
                              {formErrors.driverContractEndDate && (
                                <FormHelper text={String(formErrors.driverContractEndDate)} />
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="grid md:grid-cols-2 gird-cols-1 gap-4">
                          <div className="w-full">
                            <div className="form-group">
                              <label className="label form-label">ประเภทการปฏิบัติงาน</label>
                              <div className="custom-group">
                                <RadioButton
                                  name="operationType"
                                  label="ปฏิบัติงานปกติ"
                                  value="0"
                                  selectedValue={formData.driverOperationType}
                                  setSelectedValue={(v) => {
                                    setOperationType(v);
                                    setFormData((prev) => ({ ...prev, driverOperationType: v }));
                                  }}
                                />
                                <RadioButton
                                  name="operationType"
                                  label="สำรอง"
                                  value="1"
                                  selectedValue={formData.driverOperationType}
                                  setSelectedValue={(v) => {
                                    setOperationType(v);
                                    setFormData((prev) => ({ ...prev, driverOperationType: v }));
                                  }}
                                />
                              </div>
                            </div>
                          </div>
                          <div className="w-full">
                            <div className="form-group">
                              <label className="justify-start label form-label">
                                พนักงานที่ถูกปฏิบัติงานแทน<span className="text-[#98A2B3]">(ถ้ามี)</span>
                              </label>
                              {/* {formData.driverReplacementEmployee} */}
                              <CustomSelect
                                w="w-full"
                                options={driverReplacementList}
                                value={
                                  driverReplacementList.find(
                                    (option) => option.value === formData.driverReplacementEmployee
                                  ) || null
                                }
                                onChange={(selected) => {
                                  setFormData((prev) => ({ ...prev, driverReplacementEmployee: selected.value }));
                                }}
                              />
                            </div>
                          </div>
                        </div>
                        <div className="grid gird-cols-1">
                          <div className="form-group">
                            <label className="label form-label">หน่วยงานอื่นสามารถขอใช้งานได้</label>
                            <div className="custom-group">
                              {useByotherRadio.map((item, index) => {
                                return (
                                  <RadioButton
                                    key={index}
                                    name="useByOther"
                                    label={item.ref_other_use_desc}
                                    value={`${item.ref_other_use_code}`}
                                    selectedValue={`${formData.driverUseByOther}`}
                                    setSelectedValue={() => {
                                      setFormData({ ...formData, driverUseByOther: Number(item.ref_other_use_code) });
                                    }}
                                  />
                                );
                              })}
                            </div>
                            {formErrors.driverUseByOther && <FormHelper text={String(formErrors.driverUseByOther)} />}
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
                  <button type="submit" className="btn btn-primary">
                    บันทึก
                  </button>
                </div>
              </form>
            </div>
            {/* <form method="dialog" className="modal-backdrop">
              <button>close</button>
            </form> */}
          </div>
        )}
      </>
    );
  }
);

DriverEditInfoModal.displayName = "DriverEditInfoModal";

export default DriverEditInfoModal;
