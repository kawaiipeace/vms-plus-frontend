import DatePicker from "@/components/datePicker";
import CustomSelect from "@/components/drivers-management/customSelect";
import UploadFilePreview from "@/components/drivers-management/uploadFilePreview";
import FormHelper from "@/components/formHelper";
import ImagePreview from "@/components/imagePreview";
import ImageUpload from "@/components/imageUpload";
import RadioButton from "@/components/radioButton";
import UploadFilePDF from "@/components/uploadFilePDF";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import * as Yup from "yup";

import {
  DriverCreate,
  listDriverDepartment,
  listDriverLicense,
  listDriverVendors,
  listUseByOtherRadio,
} from "@/services/driversManagement";
import { convertToISO8601, convertToThaiDate } from "@/utils/driver-management";

import { DriverCreateDetails } from "@/app/types/drivers-management-type";
import { UploadFileType } from "@/app/types/upload-type";

interface UseByOtherRadioItem {
  ref_other_use_desc: string;
  ref_other_use_code: string;
}
interface DriverLicenseItem {
  ref_driver_license_type_name: string;
  ref_driver_license_type_desc: string;
  ref_driver_license_type_code: string;
}
interface CustomSelectOption {
  value: string;
  label: React.ReactNode | string;
  labelDetail?: React.ReactNode | string;
}

interface UploadFileType2 {
  file_name: string;
  file_url: string;
  message?: string;
  file_size?: string;
}

const DriverForm = () => {
  const router = useRouter();
  const [useByotherRadio, setUseByotherRadio] = useState<UseByOtherRadioItem[]>([]);
  const [driverLicenseList, setDriverLicenseList] = useState<CustomSelectOption[]>([]);
  const [driverDepartmentList, setDriverDepartmentList] = useState<CustomSelectOption[]>([]);
  const [driverVendorsList, setDriverVendorsList] = useState<CustomSelectOption[]>([]);
  const [overNightStay, setOverNightStay] = useState<string>("1");
  const [operationType, setOperationType] = useState<string>("1");
  const [useByOther, setUseByOther] = useState<string>("0");
  // const [driverLicenseOption, setDriverLicenseOption] = useState(driverLicenseList[0]);
  const [profileImage, setProfileImage] = useState<UploadFileType>();
  const [filePDF, setFilePDF] = useState<UploadFileType2>();
  const [filePDF2, setFilePDF2] = useState<UploadFileType2[]>([]);
  const [formData, setFormData] = useState({
    driverImage: profileImage?.file_url || "",
    driverName: "",
    driverNickname: "",
    driverContactNumber: "",
    driverBirthdate: "",
    driverIdentificationNo: "",
    driverOverNightStay: overNightStay,
    driverContractNo: "",
    driverEmployingAgency: "",
    driverContractorCompany: "",
    driverDepartment: "",
    driverContractStartDate: "",
    driverContractEndDate: "",
    driverOperationType: "0",
    driverUseByOther: 0,
    driverLicenseType: "",
    driverLicenseNo: "",
    driverLicenseStartDate: "",
    driverLicenseEndDate: "",
    driverLicensePDF: "",
    driverDoc: [] as {
      driver_document_file: string;
      driver_document_name: string;
      driver_document_no: number;
    }[],
  });
  const [formErrors, setFormErrors] = useState({
    driverImage: "",
    driverName: "",
    driverNickname: "",
    driverContactNumber: "",
    driverBirthdate: "",
    driverIdentificationNo: "",
    driverOverNightStay: "",
    driverContractNo: "",
    driverEmployingAgency: "",
    driverContractorCompany: "",
    driverDepartment: "",
    driverContractStartDate: "",
    driverContractEndDate: "",
    driverOperationType: "",
    driverUseByOther: "",
    driverLicenseType: "",
    driverLicenseNo: "",
    driverLicenseStartDate: "",
    driverLicenseEndDate: "",
    driverLicensePDF: "",
  });

  // const [disableStartDate, setDisableStartDate] = useState<string>();
  // const [disableEndDate, setDisableEndDate] = useState<string>();
  // const [disableDriverStartDate, setDisableDriverStartDate] = useState<string>();
  // const [disableDriverEndDate, setDisableDriverEndDate] = useState<string>();

  const driverFormSchema = Yup.object().shape({
    driverImage: Yup.string().required("กรุณาอัพโหลดรูปภาพ"),
    driverName: Yup.string().required("กรุณาระบุชื่อ-นามสกุล"),
    driverNickname: Yup.string().required("กรุณาระบุชื่อเล่น"),
    driverContactNumber: Yup.string()
      .matches(/^(^$|[0-9]+)$/, "กรุณาระบุเฉพาะตัวเลข")
      // .length(10, "กรุณาระบุเบอร์ติดต่อ 10 หลัก")
      // .max(10, "กรุณาระบุเบอร์ติดต่อ 10 หลัก")
      // .min(10, "กรุณาระบุเบอร์ติดต่อ 10 หลัก")
      .optional()
      .nonNullable(),
    driverBirthdate: Yup.string().required("กรุณาเลือกวันเกิด"),
    driverIdentificationNo: Yup.string()
      .required("กรุณาระบุเลขบัตรประชาชน")
      .matches(/^[0-9]+$/, "กรุณาระบุเฉพาะตัวเลข")
      .length(13, "กรุณาระบุเลขบัตรประชาชน 13 หลัก")
      .max(13, "กรุณาระบุเลขบัตรประชาชน 13 หลัก")
      .min(13, "กรุณาระบุเลขบัตรประชาชน 13 หลัก"),
    driverOverNightStay: Yup.number().required("กรุณาเลือกการค้างคืน"),
    driverContractNo: Yup.string().required("กรุณาระบุเลขที่สัญญาจ้าง"),
    driverEmployingAgency: Yup.string().required("กรุณาเลือกหน่วยงานผู้ว่าจ้าง"),
    driverContractorCompany: Yup.string().required("กรุณาเลือกบริษัทผู้รับจ้าง"),
    driverDepartment: Yup.string().required("กรุณาเลือกหน่วยงานที่สังกัด"),
    driverContractStartDate: Yup.string().required("กรุณาเลือกวันเริ่มต้นสัญญาจ้าง"),
    driverContractEndDate: Yup.string().required("กรุณาเลือกวันสิ้นสุดสัญญาจ้าง"),
    driverOperationType: Yup.string().required("กรุณาเลือกประเภทการปฏิบัติงาน"),
    driverUseByOther: Yup.string().required("กรุณาเลือกหน่วยงานอื่นสามารถขอใช้งานได้"),
    driverLicenseType: Yup.string().required("กรุณาเลือกประเภทใบขับขี่"),
    driverLicenseNo: Yup.string()
      .required("กรุณาระบุเลขที่ใบขับขี่")
      .length(8, "กรุณาระบุเลขที่ใบขับขี่ 8 หลัก")
      .min(8, "กรุณาระบุเลขที่ใบขับขี่ 8 หลัก")
      .max(8, "กรุณาระบุเลขที่ใบขับขี่ 8 หลัก"),
    driverLicenseStartDate: Yup.string().required("กรุณาเลือกวันที่ออกใบขับขี่"),
    driverLicenseEndDate: Yup.string().required("กรุณาเลือกวันที่หมดอายุใบขับขี่"),
    driverLicensePDF: Yup.string().required("กรุณาอัพโหลดใบขับขี่"),
  });

  useEffect(() => {
    const fetchUseByOtherRadio = async () => {
      try {
        const response = await listUseByOtherRadio();
        setUseByotherRadio(response.data);
      } catch (error) {
        console.error("Error fetching use by other radio data:", error);
      }
    };

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
        const driverDepartmentData = response.data.map((item: { mas_vendor_code: string; mas_vendor_name: string }) => {
          return {
            value: item.mas_vendor_code,
            label: item.mas_vendor_name,
          };
        });
        // console.log(driverDepartmentData);
        setDriverVendorsList(driverDepartmentData);
      } catch (error) {
        console.error("Error fetching driver department data:", error);
      }
    };

    fetchUseByOtherRadio();
    fetchDriverLicense();
    fetchDriverDepartment();
    fetchDriverVendors();
  }, []);

  useEffect(() => {
    console.log(formData);
  }, [formData]);

  useEffect(() => {
    const updatedFiles = filePDF2.map((file, index) => ({
      driver_document_file: file.file_url,
      driver_document_name: file.file_name,
      driver_document_no: index + 1,
    }));
    // console.log(updatedFiles);
    setFormData((prevData) => ({
      ...prevData,
      driverLicensePDF: filePDF?.file_url || "",
      driverDoc: updatedFiles,
    }));
  }, [filePDF, filePDF2]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      await driverFormSchema.validate(formData, { abortEarly: false });
      const doc = filePDF2.map((file, index) => ({
        driver_document_file: file.file_url,
        driver_document_name: file.file_name,
        driver_document_no: index + 1,
      }));
      const params: DriverCreateDetails = {
        approved_job_driver_end_date: formData.driverContractEndDate,
        approved_job_driver_start_date: formData.driverContractStartDate,
        contract_no: formData.driverContractNo,
        driver_birthdate: formData.driverBirthdate,
        driver_contact_number: formData.driverContactNumber,
        driver_dept_sap_hire: formData.driverEmployingAgency,
        driver_dept_sap_work: formData.driverDepartment,
        driver_documents: [...doc],
        driver_identification_no: formData.driverIdentificationNo,
        driver_image: formData.driverImage,
        driver_license: {
          driver_license_end_date: formData.driverLicenseEndDate,
          driver_license_image: filePDF?.file_url || "",
          driver_license_no: formData.driverLicenseNo,
          driver_license_start_date: formData.driverLicenseStartDate,
          ref_driver_license_type_code: formData.driverLicenseType,
        },
        driver_name: formData.driverName,
        driver_nickname: formData.driverNickname,
        is_replacement: formData.driverOperationType,
        mas_vendor_code: formData.driverContractorCompany,
        ref_other_use_code: useByOther,
        work_type: Number(formData.driverOverNightStay),
      };
      // console.log("params", params);

      console.log("Form data is valid:", params);

      try {
        const response = await DriverCreate(params);

        if (response.status === 201) {
          console.log("Driver created successfully:", response.data);
          router.push(`/drivers-management?create=success&driverName=${formData.driverName}`);
        }
      } catch (error) {
        console.error("Error creating driver:", error);
      }
    } catch (error) {
      if (error instanceof Yup.ValidationError) {
        console.log("Validation errors:", error);
        const errors: { [key: string]: string } = {};
        setFormErrors({
          driverImage: "",
          driverName: "",
          driverNickname: "",
          driverContactNumber: "",
          driverBirthdate: "",
          driverIdentificationNo: "",
          driverOverNightStay: "",
          driverContractNo: "",
          driverEmployingAgency: "",
          driverContractorCompany: "",
          driverDepartment: "",
          driverContractStartDate: "",
          driverContractEndDate: "",
          driverOperationType: "",
          driverUseByOther: "",
          driverLicenseType: "",
          driverLicenseNo: "",
          driverLicenseStartDate: "",
          driverLicenseEndDate: "",
          driverLicensePDF: "",
        }); // Clear errors if validation passes
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

  // const handleDriverLicenseTypeChange = async (selectedOption: CustomSelectOption) => {
  //   setDriverLicenseOption(selectedOption as { value: string; label: string });
  // };

  const handleChangeBirthdate = (dateStr: string) => {
    const dateStrISO = convertToISO8601(dateStr);
    setFormData((prevData) => ({
      ...prevData,
      driverBirthdate: dateStrISO,
    }));
  };

  const handleChangeOverNightStay = (value: string) => {
    setOverNightStay(value);
    setFormData((prevData) => ({
      ...prevData,
      driverOverNightStay: value,
    }));
  };

  const handleImageChange = (newImages: any) => {
    setProfileImage(newImages);
    setFormData((prevData) => ({
      ...prevData,
      driverImage: newImages.file_url,
    }));
  };

  const handleChangeOperationType = (value: string) => {
    setOperationType(value);
    setFormData((prevData) => ({
      ...prevData,
      driverOperationType: value,
    }));
  };

  const handleChangeContractStartDate = (dateStr: string) => {
    const dateStrISO = convertToISO8601(dateStr);
    setFormData((prevData) => ({
      ...prevData,
      driverContractStartDate: dateStrISO,
    }));

    // setDisableStartDate(dateStr);
  };

  const handleChangeContractEndDate = (dateStr: string) => {
    const dateStrISO = convertToISO8601(dateStr);
    setFormData((prevData) => ({
      ...prevData,
      driverContractEndDate: dateStrISO,
    }));

    // setDisableEndDate(dateStr);
  };

  const handleChangeDriverLicenseStartDate = (dateStr: string) => {
    const dateStrISO = convertToISO8601(dateStr);
    setFormData((prevData) => ({
      ...prevData,
      driverLicenseStartDate: dateStrISO,
    }));
    // setDisableDriverStartDate(dateStr);
  };

  const handleChangeDriverLicenseEndDate = (dateStr: string) => {
    const dateStrISO = convertToISO8601(dateStr);
    setFormData((prevData) => ({
      ...prevData,
      driverLicenseEndDate: dateStrISO,
    }));
    // setDisableDriverEndDate(dateStr);
  };

  const handleFileChange = (newImages: UploadFileType2) => {
    setFilePDF(newImages);
  };

  const handleDeleteFile = () => {
    setFilePDF(undefined);
  };

  const handleFileChange2 = (newImages: UploadFileType2) => {
    setFilePDF2([newImages, ...filePDF2]);
  };

  const handleDeleteFile2 = (index: number) => {
    setFilePDF2((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };

  return (
    <>
      <form className="form" onSubmit={handleSubmit}>
        <div className="page-section-header border-0 mt-5">
          <div className="page-header-left">
            <div className="page-title">
              <span className="page-title-label">ข้อมูลทั่วไป</span>
            </div>
          </div>
        </div>
        <div>
          <div className="grid grid-cols-12 gap-4">
            <div className="col-span-12 md:col-span-3">
              <div className="flex-1">
                <div className="form-group">
                  <label className="form-label">รูปภาพพนักงาน</label>
                  {profileImage === undefined && <ImageUpload onImageChange={handleImageChange} />}
                  <div className="image-preview flex flex-wrap gap-3">
                    {profileImage && (
                      <ImagePreview
                        image={profileImage.file_url || ""}
                        onDelete={() => {
                          setProfileImage(undefined);
                        }}
                      />
                    )}
                  </div>
                  {formErrors.driverImage && <FormHelper text={String(formErrors.driverImage)} />}
                </div>
              </div>
            </div>
            <div className="col-span-12 md:col-span-3">
              <div>
                <div className="form-group">
                  <label className="form-label">ชื่อ-นามสกุล</label>
                  {/* {formData.driverName} */}
                  <div className={`input-group`}>
                    <input
                      type="text"
                      name="driverName"
                      className="form-control"
                      placeholder="ระบุชื่อ-นามสกุล"
                      value={formData.driverName}
                      onChange={handleInputChange}
                    />
                  </div>
                  {formErrors.driverName && <FormHelper text={String(formErrors.driverName)} />}
                </div>
              </div>
              <div className="mt-3">
                <div className="form-group">
                  <label className="form-label">เบอร์ติดต่อ (ถ้ามี)</label>
                  {/* {formData.driverContactNumber} */}
                  <div className={`input-group`}>
                    <input
                      type="text"
                      name="driverContactNumber"
                      className="form-control"
                      placeholder="ระบุเบอร์ติดต่อ"
                      value={formData.driverContactNumber}
                      onChange={handleInputChange}
                      maxLength={10}
                    />
                  </div>
                  {formErrors.driverContactNumber && <FormHelper text={String(formErrors.driverContactNumber)} />}
                </div>
              </div>
              <div className="mt-3">
                <div className="form-group">
                  <label className="form-label">วันเกิด</label>
                  {/* {formData.driverBirthdate} */}
                  <div className={`input-group flatpickr`}>
                    <div className="input-group-prepend">
                      <span className="input-group-text">
                        <i className="material-symbols-outlined">calendar_month</i>
                      </span>
                    </div>
                    <DatePicker
                      placeholder="เลือกวันเกิด"
                      defaultValue={convertToThaiDate(formData.driverBirthdate)}
                      onChange={(dateStr) => handleChangeBirthdate(dateStr)}
                    />
                  </div>
                  {formErrors.driverBirthdate && <FormHelper text={String(formErrors.driverBirthdate)} />}
                </div>
              </div>
            </div>
            <div className="col-span-12 md:col-span-3">
              <div>
                <div className="form-group">
                  <label className="form-label">ชื่อเล่น</label>
                  {/* {formData.driverNickname} */}
                  <div className={`input-group`}>
                    <input
                      type="text"
                      name="driverNickname"
                      className="form-control"
                      placeholder="ระบุชื่อเล่น"
                      value={formData.driverNickname}
                      onChange={handleInputChange}
                    />
                  </div>
                  {formErrors.driverNickname && <FormHelper text={String(formErrors.driverNickname)} />}
                </div>
              </div>
              <div className="mt-3">
                <div className="form-group">
                  <label className="form-label">เลขบัตรประชาชน</label>
                  {/* {formData.driverIdentificationNo} */}
                  <div className={`input-group`}>
                    <input
                      type="text"
                      name="driverIdentificationNo"
                      className="form-control"
                      placeholder="ระบุเลขบัตรประชาชน"
                      value={formData.driverIdentificationNo}
                      onChange={handleInputChange}
                      maxLength={13}
                    />
                  </div>
                  {formErrors.driverIdentificationNo && <FormHelper text={String(formErrors.driverIdentificationNo)} />}
                </div>
              </div>
              <div className="mt-3">
                <div className="form-group">
                  <label className="form-label">การค้่างคืน</label>
                  {/* {formData.driverOverNightStay} */}
                  <div className="custom-group">
                    <RadioButton
                      name="overNightStay"
                      label="ค้างคืนได้"
                      value="1"
                      selectedValue={`${formData.driverOverNightStay}`}
                      setSelectedValue={handleChangeOverNightStay}
                    />
                    <RadioButton
                      name="overNightStay"
                      label="ค้างคืนไม่ได้"
                      value="2"
                      selectedValue={`${formData.driverOverNightStay}`}
                      setSelectedValue={handleChangeOverNightStay}
                    />
                  </div>
                  {formErrors.driverOverNightStay && <FormHelper text={String(formErrors.driverOverNightStay)} />}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="page-section-header border-0 mt-5">
          <div className="page-header-left">
            <div className="page-title">
              <span className="page-title-label">ข้อมูลสัญญาจ้างและสังกัด</span>
            </div>
          </div>
        </div>
        <div>
          <div className="grid grid-cols-12 gap-4">
            <div className="col-span-12 md:col-span-3">
              <div>
                <div className="form-group">
                  <label className="form-label">เลขที่สัญญาจ้าง</label>
                  {/* {formData.driverContractNo} */}
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
            </div>
            <div className="col-span-12 md:col-span-3">
              <div>
                <div className="form-group">
                  <label className="form-label">หน่วยงานผู้ว่าจ้าง</label>
                  {/* {formData.driverEmployingAgency} */}
                  <CustomSelect
                    w="w-full"
                    options={driverDepartmentList}
                    value={
                      driverDepartmentList.find((option) => option.value === formData.driverEmployingAgency) || null
                    }
                    onChange={(selected) => setFormData((prev) => ({ ...prev, driverEmployingAgency: selected.value }))}
                  />
                  {formErrors.driverEmployingAgency && <FormHelper text={String(formErrors.driverEmployingAgency)} />}
                </div>
              </div>
            </div>
            <div className="col-span-12 md:col-span-3">
              <div>
                <div className="form-group">
                  <label className="form-label">บริษัทผู้รับจ้าง</label>
                  <CustomSelect
                    w="w-full"
                    options={driverVendorsList}
                    value={
                      driverVendorsList.find((option) => option.value === formData.driverContractorCompany) || null
                    }
                    onChange={(selected) =>
                      setFormData((prev) => ({ ...prev, driverContractorCompany: selected.value }))
                    }
                  />
                  {formErrors.driverContractorCompany && (
                    <FormHelper text={String(formErrors.driverContractorCompany)} />
                  )}
                </div>
              </div>
            </div>
            <div className="col-span-12 md:col-span-3">
              <div>
                <div className="form-group">
                  <label className="form-label">หน่วยงานที่สังกัด</label>
                  <CustomSelect
                    w="w-full"
                    options={driverDepartmentList}
                    value={driverDepartmentList.find((option) => option.value === formData.driverDepartment) || null}
                    onChange={(selected) => setFormData((prev) => ({ ...prev, driverDepartment: selected.value }))}
                  />
                  {formErrors.driverDepartment && <FormHelper text={String(formErrors.driverDepartment)} />}
                </div>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-12 gap-4 mt-3">
            <div className="col-span-12 md:col-span-3">
              <div className="form-group">
                <label className="form-label">วันเริ่มต้นสัญญาจ้าง</label>
                <div className={`input-group flatpickr`}>
                  <div className="input-group-prepend">
                    <span className="input-group-text">
                      <i className="material-symbols-outlined">calendar_month</i>
                    </span>
                  </div>
                  <DatePicker
                    placeholder="เลือกวันที่เริ่มต้น"
                    defaultValue={convertToThaiDate(formData.driverContractStartDate)}
                    onChange={(dateStr) => handleChangeContractStartDate(dateStr)}
                    // maxDate={disableEndDate ? convertToISO8601(disableEndDate) : undefined}
                  />
                </div>
                {formErrors.driverContractStartDate && <FormHelper text={String(formErrors.driverContractStartDate)} />}
              </div>
            </div>
            <div className="col-span-12 md:col-span-3">
              <div className="form-group">
                <label className="form-label">วันสิ้นสุดสัญญาจ้าง</label>
                <div className={`input-group flatpickr`}>
                  <div className="input-group-prepend">
                    <span className="input-group-text">
                      <i className="material-symbols-outlined">calendar_month</i>
                    </span>
                  </div>
                  <DatePicker
                    placeholder="เลือกวันที่สิ้นสุด"
                    defaultValue={convertToThaiDate(formData.driverContractEndDate)}
                    onChange={(dateStr) => handleChangeContractEndDate(dateStr)}
                    // minDate={disableStartDate ? convertToISO8601(disableStartDate) : undefined}
                  />
                </div>
                {formErrors.driverContractEndDate && <FormHelper text={String(formErrors.driverContractEndDate)} />}
              </div>
            </div>
            <div className="col-span-12 md:col-span-3">
              <div className="form-group">
                <label className="form-label">ประเภทการปฏิบัติงาน</label>
                <div className="custom-group">
                  <RadioButton
                    name="operationType"
                    label="ปฏิบัติงานปกติ"
                    value="0"
                    selectedValue={formData.driverOperationType}
                    setSelectedValue={handleChangeOperationType}
                  />
                  <RadioButton
                    name="operationType"
                    label="สำรอง"
                    value="1"
                    selectedValue={formData.driverOperationType}
                    setSelectedValue={handleChangeOperationType}
                  />
                </div>
                {formErrors.driverOperationType && <FormHelper text={String(formErrors.driverOperationType)} />}
              </div>
            </div>
            <div className="col-span-12 md:col-span-3">
              <div className="form-group">
                <label className="form-label">หน่วยงานอื่นสามารถขอใช้งานได้</label>
                <div className="custom-group">
                  {useByotherRadio.map((item, index) => {
                    return (
                      <RadioButton
                        key={index}
                        name="useByOther"
                        label={item.ref_other_use_desc}
                        value={`${item.ref_other_use_code}`}
                        selectedValue={useByOther}
                        setSelectedValue={setUseByOther}
                      />
                    );
                  })}
                </div>
                {formErrors.driverUseByOther && <FormHelper text={String(formErrors.driverUseByOther)} />}
              </div>
            </div>
          </div>
        </div>
        <div className="page-section-header border-0 mt-5">
          <div className="page-header-left">
            <div className="page-title">
              <span className="page-title-label">ข้อมูลการขับขี่</span>
            </div>
          </div>
        </div>
        <div>
          <div className="grid grid-cols-12 gap-4">
            <div className="col-span-12 md:col-span-3">
              <div>
                <div className="form-group">
                  <label className="form-label">ประเภทใบขับขี่</label>
                  <CustomSelect
                    w="w-full"
                    options={driverLicenseList}
                    value={driverLicenseList.find((option) => option.value === formData.driverLicenseType) || null}
                    onChange={(selected) => setFormData((prev) => ({ ...prev, driverLicenseType: selected.value }))}
                  />
                  {formErrors.driverLicenseType && <FormHelper text={String(formErrors.driverLicenseType)} />}
                </div>
              </div>
            </div>
            <div className="col-span-12 md:col-span-3">
              <div>
                <div className="form-group">
                  <label className="form-label">เลขที่ใบขับขี่</label>
                  <div className={`input-group`}>
                    <input
                      type="text"
                      name="driverLicenseNo"
                      className="form-control"
                      placeholder="ระบุเลขที่ใบขับขี่"
                      value={formData.driverLicenseNo}
                      onChange={handleInputChange}
                      maxLength={8}
                    />
                  </div>
                  {formErrors.driverLicenseNo && <FormHelper text={String(formErrors.driverLicenseNo)} />}
                </div>
              </div>
            </div>
            <div className="col-span-12 md:col-span-3">
              <div>
                <div className="form-group">
                  <label className="form-label">วันที่ออกใบขับขี่</label>
                  <div className={`input-group flatpickr`}>
                    <div className="input-group-prepend">
                      <span className="input-group-text">
                        <i className="material-symbols-outlined">calendar_month</i>
                      </span>
                    </div>
                    <DatePicker
                      placeholder="เลือกวันที่ออกใบขับขี่"
                      defaultValue={convertToThaiDate(formData.driverLicenseStartDate)}
                      onChange={(dateStr) => handleChangeDriverLicenseStartDate(dateStr)}
                      // maxDate={disableDriverEndDate ? convertToISO8601(disableDriverEndDate) : undefined}
                    />
                  </div>
                  {formErrors.driverLicenseStartDate && <FormHelper text={String(formErrors.driverLicenseStartDate)} />}
                </div>
              </div>
            </div>
            <div className="col-span-12 md:col-span-3">
              <div>
                <div className="form-group">
                  <label className="form-label">วันที่หมดอายุใบขับขี่</label>
                  <div className={`input-group flatpickr`}>
                    <div className="input-group-prepend">
                      <span className="input-group-text">
                        <i className="material-symbols-outlined">calendar_month</i>
                      </span>
                    </div>
                    <DatePicker
                      placeholder="เลือกวันที่หมดอายุใบขับขี่"
                      defaultValue={convertToThaiDate(formData.driverLicenseEndDate)}
                      onChange={(dateStr) => handleChangeDriverLicenseEndDate(dateStr)}
                      // minDate={disableDriverStartDate ? convertToISO8601(disableDriverStartDate) : undefined}
                    />
                  </div>
                  {formErrors.driverLicenseEndDate && <FormHelper text={String(formErrors.driverLicenseEndDate)} />}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="page-section-header border-0 mt-5">
          <div className="page-header-left">
            <div className="page-title">
              <span className="page-title-label">เอกสารเพิ่มเติม</span>
            </div>
          </div>
        </div>
        <div>
          <div className="grid grid-cols-12 gap-4">
            <div className="col-span-12 md:col-span-3">
              <div className="flex-1">
                <div className="form-group">
                  <label className="form-label">
                    รูปใบขับขี่
                    <br />
                    &nbsp;
                  </label>
                  <UploadFilePDF onImageChange={handleFileChange} />
                  <div className="flex flex-col gap-3 mt-3">
                    {filePDF && (
                      <div>
                        <UploadFilePreview file={filePDF} onDeleteFile={handleDeleteFile} />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className="col-span-12 md:col-span-3">
              <div className="flex-1">
                <div className="form-group">
                  <label className="form-label">รูปใบรับรองการอบรม,บัตรประชาชน, ทะเบียนบ้าน ฯลฯ</label>
                  <UploadFilePDF onImageChange={handleFileChange2} />
                  <div className="flex flex-col gap-3 mt-3">
                    {filePDF2.length > 0 ? (
                      filePDF2.map((item, index) => {
                        return (
                          <div key={index}>
                            <UploadFilePreview file={item} onDeleteFile={() => handleDeleteFile2(index)} />
                          </div>
                        );
                      })
                    ) : (
                      <></>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="w-full">
          <div className="form-action">
            <button type="submit" className="btn btn-primary">
              สร้าง
            </button>
          </div>
        </div>
      </form>
    </>
  );
};

export default DriverForm;
