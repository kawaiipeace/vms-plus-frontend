import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import CustomSelect from "@/components/drivers-management/customSelect";
import DatePicker from "@/components/datePicker";
import * as Yup from "yup";
import FormHelper from "@/components/formHelper";

import { listDriverLicense, driverUpdateLicenseDetails } from "@/services/driversManagement";
import { convertToISO8601, convertToThaiDate } from "@/utils/driver-management";

import { DriverUpdateLicenseDetails, DriverInfoType } from "@/app/types/drivers-management-type";

interface CustomSelectOption {
  value: string;
  label: React.ReactNode | string;
  labelDetail?: React.ReactNode | string;
}

interface DriverLicenseItem {
  ref_driver_license_type_name: string;
  ref_driver_license_type_desc: string;
  ref_driver_license_type_code: string;
}

interface DriverEditLicenseModalProps {
  driverInfo?: DriverInfoType | null;
  onUpdateDriver: React.Dispatch<React.SetStateAction<boolean>>;
  setUpdateType: React.Dispatch<React.SetStateAction<string>>;
}

const DriverEditLicenseModal = forwardRef<
  { openModal: () => void; closeModal: () => void },
  DriverEditLicenseModalProps
>(({ driverInfo, onUpdateDriver, setUpdateType }, ref) => {
  const modalRef = useRef<HTMLDialogElement>(null);
  const [driverLicenseList, setDriverLicenseList] = React.useState<CustomSelectOption[]>([]);
  const [formData, setFormData] = useState({
    driverLicenseType: "",
    driverLicenseNo: "",
    driverLicenseStartDate: "",
    driverLicenseEndDate: "",
  });
  const [formErrors, setFormErrors] = useState({
    driverLicenseType: "",
    driverLicenseNo: "",
    driverLicenseStartDate: "",
    driverLicenseEndDate: "",
  });

  const driverLicenseSchema = Yup.object().shape({
    driverLicenseType: Yup.string().required("ประเภทใบขับขี่ไม่ถูกต้อง"),
    driverLicenseNo: Yup.string().required("เลขที่ใบขับขี่ไม่ถูกต้อง"),
    driverLicenseStartDate: Yup.string().required("วันที่ออกใบขับขี่ไม่ถูกต้อง"),
    driverLicenseEndDate: Yup.string().required("วันที่หมดอายุใบขับขี่ไม่ถูกต้อง"),
  });

  useImperativeHandle(ref, () => ({
    openModal: () => modalRef.current?.showModal(),
    closeModal: () => modalRef.current?.close(),
  }));

  useEffect(() => {
    if (driverInfo) {
      setFormData({
        driverLicenseType: driverInfo.driver_license?.ref_driver_license_type_code || "",
        driverLicenseNo: driverInfo.driver_license?.driver_license_no || "",
        driverLicenseStartDate: driverInfo.driver_license?.driver_license_start_date || "",
        driverLicenseEndDate: driverInfo.driver_license?.driver_license_end_date || "",
      });
    }
  }, [driverInfo]);

  useEffect(() => {
    const fetchDriverLicense = async () => {
      try {
        const response = await listDriverLicense();
        const driverLicenseData: CustomSelectOption[] = response.data.map((item: DriverLicenseItem) => {
          return {
            value: item.ref_driver_license_type_code,
            label: item.ref_driver_license_type_name,
            labelDetail: item.ref_driver_license_type_desc,
          };
        });
        // console.log(driverLicenseData);
        setDriverLicenseList(driverLicenseData);
      } catch (error) {
        console.error("Error fetching driver license data:", error);
      }
    };
    fetchDriverLicense();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await driverLicenseSchema.validate(formData, { abortEarly: false });

      const params: DriverUpdateLicenseDetails = {
        driver_license_no: formData.driverLicenseNo,
        ref_driver_license_type_code: formData.driverLicenseType,
        driver_license_start_date: formData.driverLicenseStartDate,
        driver_license_end_date: formData.driverLicenseEndDate,
        mas_driver_uid: driverInfo?.mas_driver_uid || "",
      };

      const response = await driverUpdateLicenseDetails({ params });
      if (response.status === 200) {
        modalRef.current?.close();
        onUpdateDriver(true);
        setUpdateType("basicInfo");
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
          driverLicenseType: "",
          driverLicenseNo: "",
          driverLicenseStartDate: "",
          driverLicenseEndDate: "",
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

  const handleChangeDriverLicenseStartDate = (dateStr: string) => {
    const dateStrISO = convertToISO8601(dateStr);
    setFormData((prevData) => ({
      ...prevData,
      driverLicenseStartDate: dateStrISO,
    }));
  };

  const handleChangeDriverLicenseEndDate = (dateStr: string) => {
    const dateStrISO = convertToISO8601(dateStr);
    setFormData((prevData) => ({
      ...prevData,
      driverLicenseEndDate: dateStrISO,
    }));
  };

  return (
    <dialog ref={modalRef} className={`modal modal-middle`}>
      <div className="modal-box max-w-[600px] p-0 relative overflow-hidden flex flex-col bg-white">
        <div className="modal-header bg-white sticky top-0 flex justify-between z-10">
          <div className="modal-title">แก้ไขข้อมูลการขับขี่</div>
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
                      <label className="label font-semibold text-black">ประเภทใบขับขี่</label>
                      <CustomSelect
                        w="w-full"
                        options={driverLicenseList}
                        value={driverLicenseList.find((option) => option.value === formData.driverLicenseType) || null}
                        onChange={(selected) => setFormData((prev) => ({ ...prev, driverLicenseType: selected.value }))}
                      />
                      {formErrors.driverLicenseType && <FormHelper text={String(formErrors.driverLicenseType)} />}
                    </div>
                  </div>
                  <div className="w-full">
                    <div className="form-group">
                      <label className="label font-semibold text-black">เลขที่ใบขับขี่</label>
                      <div className={`input-group`}>
                        <input
                          type="text"
                          name="driverLicenseNo"
                          className="form-control"
                          placeholder="เลขที่ใบขับขี่"
                          value={formData.driverLicenseNo}
                          onChange={handleInputChange}
                        />
                      </div>
                      {formErrors.driverLicenseNo && <FormHelper text={String(formErrors.driverLicenseNo)} />}
                    </div>
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gird-cols-1 gap-4">
                  <div className="w-full">
                    <div className="form-group">
                      <label className="label font-semibold text-black">วันที่ออกใบขับขี่</label>
                      <div className={`input-group`}>
                        <div className="input-group-prepend">
                          <span className="input-group-text">
                            <i className="material-symbols-outlined">calendar_month</i>
                          </span>
                        </div>
                        <DatePicker
                          placeholder="เลือกวันที่ออกใบขับขี่"
                          defaultValue={convertToThaiDate(formData.driverLicenseStartDate)}
                          onChange={(dateStr) => handleChangeDriverLicenseStartDate(dateStr)}
                        />
                      </div>
                      {formErrors.driverLicenseStartDate && (
                        <FormHelper text={String(formErrors.driverLicenseStartDate)} />
                      )}
                    </div>
                  </div>
                  <div className="w-full">
                    <div className="form-group">
                      <label className="label font-semibold text-black">วันที่หมดอายุใบขับขี่</label>
                      <div className={`input-group`}>
                        <div className="input-group-prepend">
                          <span className="input-group-text">
                            <i className="material-symbols-outlined">calendar_month</i>
                          </span>
                        </div>
                        <DatePicker
                          placeholder="เลือกวันที่หมดอายุใบขับขี่"
                          defaultValue={convertToThaiDate(formData.driverLicenseEndDate)}
                          onChange={(dateStr) => handleChangeDriverLicenseEndDate(dateStr)}
                        />
                      </div>
                      {formErrors.driverLicenseEndDate && <FormHelper text={String(formErrors.driverLicenseEndDate)} />}
                    </div>
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
});

DriverEditLicenseModal.displayName = "DriverEditLicenseModal";

export default DriverEditLicenseModal;
