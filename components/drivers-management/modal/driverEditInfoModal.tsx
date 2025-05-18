import React, { forwardRef, useImperativeHandle, useRef, useState, useEffect } from "react";
import CustomSelect from "@/components/drivers-management/customSelect";
import DatePicker from "@/components/datePicker";
import RadioButton from "@/components/radioButton";
import * as Yup from "yup";
import FormHelper from "@/components/formHelper";

import {
  listUseByOtherRadio,
  listDriverDepartment,
  listDriverVendors,
  driverUpdateContractDetails,
} from "@/services/driversManagement";

import { DriverInfoType, DriverUpdateContractDetails } from "@/app/types/drivers-management-type";
import { convertToThaiDate, convertToISO8601 } from "@/utils/driver-management";

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
    // const [useByOther, setUseByOther] = useState<string>("0");
    const [driverDepartmentList, setDriverDepartmentList] = useState<
      { value: string; label: string; labelDetail: string }[]
    >([]);
    const [driverVendorsList, setDriverVendorsList] = useState<{ value: string; label: string }[]>([]);
    const [formData, setFormData] = useState({
      driverContractStartDate: "",
      driverContractEndDate: "",
      driverContractNo: "",
      driverEmployingAgency: "",
      driverDepartment: "",
      driverContractorCompany: "",
      driverUseByOther: 0,
    });
    const [formErrors, setFormErrors] = useState({
      driverContractStartDate: "",
      driverContractEndDate: "",
      driverContractNo: "",
      driverEmployingAgency: "",
      driverDepartment: "",
      driverContractorCompany: "",
      driverUseByOther: "",
    });

    const driverEditInfoSchema = Yup.object().shape({
      driverContractStartDate: Yup.string().required("กรุณาเลือกวันที่เริ่มต้นสัญญาจ้าง"),
      driverContractEndDate: Yup.string().required("กรุณาเลือกวันที่สิ้นสุดสัญญาจ้าง"),
      driverContractNo: Yup.string().required("กรุณากรอกเลขที่สัญญาจ้าง"),
      driverEmployingAgency: Yup.string().required("กรุณาเลือกหน่วยงานผู้ว่าจ้าง"),
      driverDepartment: Yup.string().required("กรุณาเลือกหน่วยงานที่สังกัด"),
      driverContractorCompany: Yup.string().required("กรุณาเลือกบริษัทผู้รับจ้าง"),
      driverUseByOther: Yup.string().required("กรุณาเลือกหน่วยงานอื่นสามารถขอใช้งานได้"),
    });

    useImperativeHandle(ref, () => ({
      openModal: () => modalRef.current?.showModal(),
      closeModal: () => modalRef.current?.close(),
    }));

    useEffect(() => {
      if (driverInfo) {
        setFormData({
          driverContractStartDate: driverInfo.approved_job_driver_start_date || "",
          driverContractEndDate: driverInfo.approved_job_driver_end_date || "",
          driverContractNo: driverInfo.contract_no || "",
          driverEmployingAgency: driverInfo.driver_dept_sap_short_name_hire || "",
          driverDepartment: driverInfo.driver_dept_sap_short_name_work || "",
          driverContractorCompany: driverInfo.mas_vendor_code || "",
          driverUseByOther: Number(driverInfo.ref_other_use_code) || 0,
        });
      }
    }, [driverInfo]);

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
                labelDetail: item.dept_full,
              };
            }
          );
          // console.log(driverDepartmentData);
          setDriverDepartmentList(driverDepartmentData);
        } catch (error) {
          console.error("Error fetching driver department data:", error);
        }
      };

      const fetchDriverVendors = async () => {
        try {
          const response = await listDriverVendors();
          const driverDepartmentData = response.data.map(
            (item: { mas_vendor_code: string; mas_vendor_name: string }) => {
              return {
                value: item.mas_vendor_code,
                label: item.mas_vendor_name,
              };
            }
          );
          // console.log(driverDepartmentData);
          setDriverVendorsList(driverDepartmentData);
        } catch (error) {
          console.error("Error fetching driver department data:", error);
        }
      };

      fetchDriverDepartment();
      fetchDriverVendors();
      fetchUseByOtherRadio();
    }, []);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      try {
        await driverEditInfoSchema.validate(formData, { abortEarly: false });
        const params: DriverUpdateContractDetails = {
          approved_job_driver_end_date: formData.driverContractEndDate,
          approved_job_driver_start_date: formData.driverContractStartDate,
          contract_no: formData.driverContractNo,
          driver_dept_sap_short_name_hire: formData.driverEmployingAgency,
          driver_dept_sap_short_name_work: formData.driverDepartment,
          mas_driver_uid: driverInfo?.mas_driver_uid || "",
          mas_vendor_code: formData.driverContractorCompany,
          ref_other_use_code: formData.driverUseByOther,
        };
        // Submit form data
        const response = await driverUpdateContractDetails({ params });
        if (response.status === 200) {
          modalRef.current?.close();
          onUpdateDriver(true);
          setUpdateType("basicInfo");
        } else {
          console.error("Error submitting form", response);
        }
        console.log("Form submitted successfully", params);
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
      setFormData((prevData) => ({
        ...prevData,
        driverContractStartDate: dateStrISO,
      }));
    };

    const handleChangeContractEndDate = (dateStr: string) => {
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
            <div className="modal-title">แก้ไขข้อมูลสัญญาจ้างและสังกัด</div>
            <form method="dialog">
              <button className="close btn btn-icon border-none bg-transparent shadow-none btn-tertiary">
                <i className="material-symbols-outlined">close</i>
              </button>
            </form>
          </div>
          <form className="form" onSubmit={handleSubmit}>
            <div className="modal-body overflow-y-auto text-center border-b-[1px] border-[#E5E5E5] max-h-[60vh]">
              <div className="form-section">
                <div className="form-section-body">
                  <div className="grid md:grid-cols-2 gird-cols-1 gap-4">
                    <div className="w-full">
                      <label className="label font-semibold text-black">เลขที่สัญญาจ้าง</label>
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
                    <div className="w-full">
                      <div className="form-group">
                        <label className="label font-semibold text-black">หน่วยงานผู้ว่าจ้าง</label>
                        <CustomSelect
                          w="w-full"
                          options={driverDepartmentList}
                          value={
                            driverDepartmentList.find((option) => option.value === formData.driverEmployingAgency) ||
                            null
                          }
                          onChange={(selected) => {
                            setFormData((prev) => ({ ...prev, driverEmployingAgency: selected.value }));
                          }}
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
                        <label className="label font-semibold text-black">บริษัทผู้รับจ้าง</label>
                        <CustomSelect
                          w="w-full"
                          options={driverVendorsList}
                          value={
                            driverVendorsList.find((option) => option.value === formData.driverContractorCompany) ||
                            null
                          }
                          onChange={(selected) => {
                            setFormData((prev) => ({ ...prev, driverContractorCompany: selected.value }));
                          }}
                        />
                        {formErrors.driverContractorCompany && (
                          <FormHelper text={String(formErrors.driverContractorCompany)} />
                        )}
                      </div>
                    </div>
                    <div className="w-full">
                      <div className="form-group">
                        <label className="label font-semibold text-black">หน่วยงานที่สังกัด</label>
                        <CustomSelect
                          w="w-full"
                          options={driverDepartmentList}
                          value={
                            driverDepartmentList.find((option) => option.value === formData.driverDepartment) || null
                          }
                          onChange={(selected) => {
                            setFormData((prev) => ({ ...prev, driverDepartment: selected.value }));
                          }}
                        />
                        {formErrors.driverDepartment && <FormHelper text={String(formErrors.driverDepartment)} />}
                      </div>
                    </div>
                  </div>
                  <div className="grid md:grid-cols-2 gird-cols-1 gap-4">
                    <div className="w-full">
                      <div className="form-group">
                        <label className="label font-semibold text-black">วันเริ่มต้นสัญญาจ้าง</label>
                        <div className={`input-group`}>
                          <div className="input-group-prepend">
                            <span className="input-group-text">
                              <i className="material-symbols-outlined">calendar_month</i>
                            </span>
                          </div>
                          <DatePicker
                            placeholder="เลือกวันที่เริ่มต้น"
                            defaultValue={convertToThaiDate(formData.driverContractStartDate)}
                            onChange={(dateStr) => handleChangeContractStartDate(dateStr)}
                          />
                        </div>
                        {formErrors.driverContractStartDate && (
                          <FormHelper text={String(formErrors.driverContractStartDate)} />
                        )}
                      </div>
                    </div>
                    <div className="w-full">
                      <div className="form-group">
                        <label className="label font-semibold text-black">วันสิ้นสุดสัญญาจ้าง</label>
                        <div className={`input-group`}>
                          <div className="input-group-prepend">
                            <span className="input-group-text">
                              <i className="material-symbols-outlined">calendar_month</i>
                            </span>
                          </div>
                          <DatePicker
                            placeholder="เลือกวันที่สิ้นสุด"
                            defaultValue={convertToThaiDate(formData.driverContractEndDate)}
                            onChange={(dateStr) => handleChangeContractEndDate(dateStr)}
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
                        <label className="label font-semibold text-black">ประเภทการปฏิบัติงาน</label>
                        <div className="custom-group">
                          <RadioButton
                            name="operationType"
                            label="ปฏิบัติงานปกติ"
                            value="1"
                            selectedValue={`${operationType}`}
                            setSelectedValue={setOperationType}
                          />
                          <RadioButton
                            name="operationType"
                            label="สำรอง"
                            value="2"
                            selectedValue={`${operationType}`}
                            setSelectedValue={setOperationType}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="w-full">
                      <div className="form-group">
                        <label className="label justify-start font-semibold text-black">
                          พนักงานที่ถูกปฏิบัติงานแทน<span className="text-[#98A2B3]">(ถ้ามี)</span>
                        </label>
                        <CustomSelect w="w-full" options={[]} value={null} onChange={() => {}} />
                      </div>
                    </div>
                  </div>
                  <div className="grid gird-cols-1">
                    <div className="form-group">
                      <label className="label font-semibold text-black">หน่วยงานอื่นสามารถขอใช้งานได้</label>
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
            <div className="modal-footer mt-5 flex gap-3 justify-end px-4 pb-4">
              <div>
                <button className="btn btn-secondary w-full" onClick={() => modalRef.current?.close()}>
                  ยกเลิก
                </button>
              </div>
              <button type="submit" className="btn btn-primary">
                บันทึก
              </button>
            </div>
          </form>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    );
  }
);

DriverEditInfoModal.displayName = "DriverEditInfoModal";

export default DriverEditInfoModal;
