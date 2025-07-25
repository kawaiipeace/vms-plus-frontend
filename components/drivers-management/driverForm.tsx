import DatePicker from "@/components/datePicker";
import CustomSelect from "@/components/customSelect";
import UploadFilePreview from "@/components/drivers-management/uploadFilePreview";
import FormHelper from "@/components/formHelper";
import ImagePreview from "@/components/imagePreview";
import ImageUpload from "@/components/imageUpload";
import RadioButton from "@/components/radioButton";
import UploadFilePDF from "@/components/uploadFilePDF";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import * as Yup from "yup";
import CustomSearchSelect from "@/components/customSelectSerch";
import CustomSelectOnSearch from "@/components/customSelectOnSearch";

import {
  DriverCreate,
  listDriverDepartment,
  listDriverLicense,
  // listDriverVendors,
  listUseByOtherRadio,
  driverCertificateTypeRef,
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

export function formatDateToThai(dateStr: string): string {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return "";
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

export function convertToISO8601FromThai(dateStr: string): string {
  if (!dateStr) return "";
  const [day, month, year] = dateStr.split("/");
  if (!day || !month || !year) return "";
  return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
}

const DriverForm = () => {
  const router = useRouter();
  const [useByotherRadio, setUseByotherRadio] = useState<UseByOtherRadioItem[]>([]);
  const [driverLicenseList, setDriverLicenseList] = useState<CustomSelectOption[]>([]);
  const [driverDepartmentList, setDriverDepartmentList] = useState<CustomSelectOption[]>([]);
  // const [driverVendorsList, setDriverVendorsList] = useState<CustomSelectOption[]>([]);
  const [overNightStay, setOverNightStay] = useState<string>("1");
  const [operationType, setOperationType] = useState<string>("1");
  const [useByOther, setUseByOther] = useState<string>("0");
  // const [driverLicenseOption, setDriverLicenseOption] = useState(driverLicenseList[0]);
  const [profileImage, setProfileImage] = useState<UploadFileType>();
  const [filePDF, setFilePDF] = useState<UploadFileType2>();
  const [filePDF2, setFilePDF2] = useState<UploadFileType2[]>([]);
  const [driverDepartmentOptions, setDriverDepartmentOptions] = useState<CustomSelectOption>({
    value: "",
    label: "เลือกหน่วยงาน",
  });
  const [driverDepartmentOptions2, setDriverDepartmentOptions2] = useState<CustomSelectOption>({
    value: "",
    label: "เลือกหน่วยงาน",
  });
  const [driverCertificateTypeList, setDriverCertificateTypeList] = useState<CustomSelectOption[]>([]);
  const [formData, setFormData] = useState({
    driverImage: profileImage?.file_url || "",
    driverName: "",
    driverNickname: "",
    driverContactNumber: "",
    driverBirthdate: "",
    driverCertificate: {
      driver_certificate_no: "",
      driver_certificate_name: "",
      driver_certificate_issue_date: "",
      driver_certificate_expire_date: "",
      ref_driver_certificate_type_code: "",
    },
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
    driverCertificate: {
      driver_certificate_no: "",
      driver_certificate_name: "",
      driver_certificate_issue_date: "",
      driver_certificate_expire_date: "",
      ref_driver_certificate_type_code: "",
    },
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

  const [disableStartDate, setDisableStartDate] = useState<string>();
  // const [disableEndDate, setDisableEndDate] = useState<string>();
  const [disableDriverStartDate, setDisableDriverStartDate] = useState<string>();
  // const [disableDriverEndDate, setDisableDriverEndDate] = useState<string>();

  const driverFormSchema = Yup.object().shape({
    driverImage: Yup.string().required("กรุณาอัพโหลดรูปภาพ"),
    driverName: Yup.string().required("กรุณาระบุชื่อ-นามสกุล"),
    driverNickname: Yup.string().required("กรุณาระบุชื่อเล่น"),
    driverContactNumber: Yup.string()
      .matches(/^(\d{3}-\d{3}-\d{4}|^$)$/, "กรุณาระบุเฉพาะตัวเลข")
      .length(12, "กรุณาระบุเบอร์ติดต่อ 10 หลัก")
      .max(12, "กรุณาระบุเบอร์ติดต่อ 10 หลัก")
      .min(12, "กรุณาระบุเบอร์ติดต่อ 10 หลัก")
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
    driverLicenseNo: Yup.string().required("กรุณาระบุเลขที่ใบขับขี่"),
    // .length(8, "กรุณาระบุเลขที่ใบขับขี่ 8 หลัก")
    // .min(8, "กรุณาระบุเลขที่ใบขับขี่ 8 หลัก")
    // .max(8, "กรุณาระบุเลขที่ใบขับขี่ 8 หลัก"),
    driverLicenseStartDate: Yup.string().required("กรุณาเลือกวันที่ออกใบขับขี่"),
    driverLicenseEndDate: Yup.string().required("กรุณาเลือกวันที่หมดอายุใบขับขี่"),
    driverLicensePDF: Yup.string().required("กรุณาอัพโหลดใบขับขี่"),
    driverCertificate: Yup.object().shape({
      driver_certificate_no: Yup.string().when("$driverLicenseType", {
        is: (value: string) => value === "2+" || value === "3+",
        then: () => Yup.string().required("กรุณาระบุเลขที่ใบรับรอง"),
        otherwise: () => Yup.string().notRequired(),
      }),
      driver_certificate_name: Yup.string().when("$driverLicenseType", {
        is: (value: string) => value === "2+" || value === "3+",
        then: () => Yup.string().required("กรุณาระบุชื่อหลักสูตร"),
        otherwise: () => Yup.string().notRequired(),
      }),
      driver_certificate_issue_date: Yup.string().when("$driverLicenseType", {
        is: (value: string) => value === "2+" || value === "3+",
        then: () => Yup.string().required("กรุณาเลือกวันที่อบรม"),
        otherwise: () => Yup.string().notRequired(),
      }),
      driver_certificate_expire_date: Yup.string().when("$driverLicenseType", {
        is: (value: string) => value === "2+" || value === "3+",
        then: () => Yup.string().required("กรุณาเลือกวันที่สิ้นอายุ"),
        otherwise: () => Yup.string().notRequired(),
      }),
      ref_driver_certificate_type_code: Yup.string().when("$driverLicenseType", {
        is: (value: string) => value === "2+" || value === "3+",
        then: () => Yup.string().required("กรุณาเลือกประเภทยานพาหนะ"),
        otherwise: () => Yup.string().notRequired(),
      }),
    }),
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
            desc: item.ref_driver_license_type_desc,
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
              desc: item.dept_full,
            };
          }
        );

        setDriverDepartmentList(driverDepartmentData);
      } catch (error) {
        console.error("Error fetching driver department data:", error);
      }
    };

    const fetchDriverCertificateType = async () => {
      try {
        const response = await driverCertificateTypeRef();
        const driverCertificateData: CustomSelectOption[] = response.data.map((item: any) => {
          return {
            value: String(item.ref_driver_certificate_type_code),
            label: item.ref_driver_certificate_type_name,
            desc: item.ref_driver_certificate_type_desc,
          };
        });
        setDriverCertificateTypeList(driverCertificateData);
      } catch (error) {
        console.error("Error fetching driver certificate type data:", error);
      }
    };

    // const fetchDriverVendors = async () => {
    //   try {
    //     const response = await listDriverVendors();
    //     const driverDepartmentData = response.data.map((item: { mas_vendor_code: string; mas_vendor_name: string }) => {
    //       return {
    //         value: item.mas_vendor_code,
    //         label: item.mas_vendor_name,
    //       };
    //     });
    //     // console.log(driverDepartmentData);
    //     setDriverVendorsList(driverDepartmentData);
    //   } catch (error) {
    //     console.error("Error fetching driver department data:", error);
    //   }
    // };

    fetchUseByOtherRadio();
    fetchDriverLicense();
    fetchDriverDepartment();
    fetchDriverCertificateType();
    // fetchDriverVendors();
  }, []);

  // useEffect(() => {
  //   console.log(formData);
  // }, [formData]);

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
      await driverFormSchema.validate(formData, {
        abortEarly: false,
        context: { driverLicenseType: formData.driverLicenseType },
      });
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
        driver_certificate: {
          driver_certificate_expire_date: formData.driverCertificate.driver_certificate_expire_date,
          driver_certificate_issue_date: formData.driverCertificate.driver_certificate_issue_date,
          driver_certificate_name: formData.driverCertificate.driver_certificate_name,
          driver_certificate_no: formData.driverCertificate.driver_certificate_no,
          ref_driver_certificate_type_code: formData.driverCertificate.ref_driver_certificate_type_code,
        },
        driver_contact_number: formData.driverContactNumber.replace(/-/g, ""),
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
        vendor_name: formData.driverContractorCompany,
        ref_other_use_code: useByOther,
        work_type: Number(formData.driverOverNightStay),
      };
      // console.log("params", params);

      try {
        const response = await DriverCreate(params);

        if (response.status === 201) {
          router.push(`/drivers-management?activeTab=1&create=success&driverName=${formData.driverName}`);
        }
      } catch (error) {
        console.error("Error creating driver:", error);
      }
    } catch (error) {
      if (error instanceof Yup.ValidationError) {
        const errors: any = {};
        setFormErrors({
          driverImage: "",
          driverName: "",
          driverNickname: "",
          driverContactNumber: "",
          driverBirthdate: "",
          driverCertificate: {
            driver_certificate_no: "",
            driver_certificate_name: "",
            driver_certificate_issue_date: "",
            driver_certificate_expire_date: "",
            ref_driver_certificate_type_code: "",
          },
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
        // Process validation errors
        error.inner.forEach((err) => {
          if (err.path) {
            // Handle nested paths like "driverCertificate.driver_certificate_no"
            const pathParts = err.path.split(".");
            if (pathParts.length === 1) {
              // Simple field error
              errors[err.path] = err.message;
            } else if (pathParts.length === 2) {
              // Nested field error
              const [parentField, childField] = pathParts;
              if (!errors[parentField]) {
                errors[parentField] = {};
              }
              errors[parentField][childField] = err.message;
            }
          }
        });
        setFormErrors((prevErrors) => ({
          ...prevErrors,
          ...errors,
        }));
      }
    }
  };

  const getMaxBirthdateInThai = (): string => {
    const today = new Date();
    const maxBirthYear = today.getFullYear() - 18;
    const maxBirthdate = new Date(maxBirthYear, today.getMonth(), today.getDate());

    // แปลงเป็นรูปแบบไทย (วัน/เดือน/ปีพุทธศักราช)
    const day = String(maxBirthdate.getDate()).padStart(2, "0");
    const month = String(maxBirthdate.getMonth() + 1).padStart(2, "0");
    const year = maxBirthdate.getFullYear() + 543; // เพิ่ม 543 เพื่อแปลงเป็นปีพุทธศักราช

    return `${day}/${month}/${year}`;
  };

  const convertBuddhistToChristian = (dateStr: string): Date => {
    if (!dateStr) return new Date();

    // แยกวันที่ออกจากรูปแบบ ISO หรือรูปแบบอื่นๆ
    const date = new Date(dateStr);

    // ถ้าปีมากกว่า 2500 แสดงว่าเป็นปีพุทธศักราช ต้องลบ 543
    if (date.getFullYear() > 2500) {
      date.setFullYear(date.getFullYear() - 543);
    }

    return date;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleInputChangeCertificate = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      driverCertificate: {
        ...prevData.driverCertificate,
        [name]: value,
      },
    }));
  };

  // const handleDriverLicenseTypeChange = async (selectedOption: CustomSelectOption) => {
  //   setDriverLicenseOption(selectedOption as { value: string; label: string });
  // };

  const handleChangeBirthdate = (dateStr: string) => {
    if (!dateStr) return;
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
    const thaiDate = formatDateToThai(dateStrISO);
    setFormData((prevData) => ({
      ...prevData,
      driverContractStartDate: dateStrISO,
    }));

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

  const handleChangeDriverLicenseStartDate = (dateStr: string) => {
    const dateStrISO = convertToISO8601(dateStr);
    const thaiDate = formatDateToThai(dateStrISO);
    setFormData((prevData) => ({
      ...prevData,
      driverLicenseStartDate: dateStrISO,
    }));
    setDisableDriverStartDate(thaiDate);
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

  const handleDriverDepartmentChange = async (selectedOption: { value: string; label: string | React.ReactNode }) => {
    // console.log(selectedOption);
    setFormData((prevData) => ({
      ...prevData,
      driverEmployingAgency: selectedOption.value,
    }));
    setDriverDepartmentOptions(selectedOption as { value: string; label: string });
  };

  const handleDriverDepartmentChange2 = async (selectedOption: { value: string; label: string | React.ReactNode }) => {
    // console.log(selectedOption);
    setFormData((prevData) => ({
      ...prevData,
      driverDepartment: selectedOption.value,
    }));
    setDriverDepartmentOptions2(selectedOption as { value: string; label: string });
  };

  const fetchDriverDepartment = async (search?: string) => {
    try {
      const response = await listDriverDepartment(search || undefined);
      const driverDepartmentData = response.data.map(
        (item: { dept_sap: string; dept_short: string; dept_full: string }) => {
          return {
            value: item.dept_sap,
            label: item.dept_short,
            desc: item.dept_full,
          };
        }
      );
      setDriverDepartmentList(driverDepartmentData);
    } catch (error) {
      console.error("Error fetching status data:", error);
    }
  };

  const handleChangeDriverCertificateIssue = (field: string, value: string) => {
    setFormData((prevData) => ({
      ...prevData,
      driverCertificate: {
        ...prevData.driverCertificate,
        [field]: convertToISO8601(value),
      },
    }));
  };

  const handleChangeDriverCertificateExpire = (field: string, value: string) => {
    setFormData((prevData) => ({
      ...prevData,
      driverCertificate: {
        ...prevData.driverCertificate,
        [field]: convertToISO8601(value),
      },
    }));
  };

  return (
    <>
      <form className="form" onSubmit={handleSubmit}>
        {/* <div className="break-all">{JSON.stringify(formData)}</div> */}
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
                  <label className="form-label">เบอร์ติดต่อ</label>
                  {/* {formData.driverContactNumber} */}
                  <div className={`input-group`}>
                    <input
                      type="text"
                      name="driverContactNumber"
                      className="form-control"
                      placeholder="ระบุเบอร์ติดต่อ"
                      value={formData.driverContactNumber}
                      onChange={handleInputChange}
                      onFocus={(e) => {
                        e.target.value = e.target.value.replace(/-/g, "");
                        e.target.maxLength = 10;
                      }}
                      onBlur={(e) => {
                        const formattedValue = e.target.value.replace(/(\d{3})(\d{3})(\d{4})/, "$1-$2-$3");
                        e.target.value = formattedValue;
                        setFormData((prevData) => ({
                          ...prevData,
                          driverContactNumber: formattedValue,
                        }));
                      }}
                      maxLength={12}
                      onKeyDown={(e) => {
                        if (
                          !/[0-9]/.test(e.key) &&
                          !["Backspace", "Delete", "Tab", "ArrowLeft", "ArrowRight", "Home", "End"].includes(e.key)
                        ) {
                          e.preventDefault();
                        }
                      }}
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
                      maxDate={getMaxBirthdateInThai()}
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
                      onKeyDown={(e) => {
                        if (
                          !/[0-9]/.test(e.key) &&
                          !["Backspace", "Delete", "Tab", "ArrowLeft", "ArrowRight", "Home", "End"].includes(e.key)
                        ) {
                          e.preventDefault();
                        }
                      }}
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
                      placeholder="ระบุเลขที่สัญญาจ้าง"
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
                  {/* <CustomSearchSelect
                    w="md:w-full"
                    options={driverDepartmentList}
                    value={driverDepartmentOptions}
                    enableSearch
                    showDescriptions
                    onChange={handleDriverDepartmentChange}
                  /> */}
                  <CustomSelectOnSearch
                    w="md:w-full"
                    options={driverDepartmentList}
                    value={driverDepartmentOptions}
                    showDescriptions
                    enableSearchOnApi
                    onChange={handleDriverDepartmentChange}
                    onSearchInputChange={(value) => fetchDriverDepartment(value)}
                  />
                  {formErrors.driverEmployingAgency && <FormHelper text={String(formErrors.driverEmployingAgency)} />}
                </div>
              </div>
            </div>
            <div className="col-span-12 md:col-span-3">
              <div>
                <div className="form-group">
                  <label className="form-label">บริษัทผู้รับจ้าง</label>
                  {/* <CustomSelect
                    w="w-full"
                    options={driverVendorsList}
                    value={
                      driverVendorsList.find((option) => option.value === formData.driverContractorCompany) || null
                    }
                    onChange={(selected) =>
                      setFormData((prev) => ({ ...prev, driverContractorCompany: selected.value }))
                    }
                  /> */}
                  <input
                    type="text"
                    name="driverContractorCompany"
                    className="form-control"
                    placeholder="เลือกบริษัท"
                    value={formData.driverContractorCompany}
                    onChange={handleInputChange}
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
                  {/* <CustomSelect
                    w="w-full"
                    options={driverDepartmentList}
                    value={driverDepartmentList.find((option) => option.value === formData.driverDepartment) || null}
                    onChange={(selected) => setFormData((prev) => ({ ...prev, driverDepartment: selected.value }))}
                  /> */}
                  <CustomSelectOnSearch
                    w="md:w-full"
                    options={driverDepartmentList}
                    value={driverDepartmentOptions2}
                    showDescriptions
                    enableSearchOnApi
                    onChange={handleDriverDepartmentChange2}
                    onSearchInputChange={(value) => fetchDriverDepartment(value)}
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
                    onChange={(dateStr) => {
                      handleChangeContractStartDate(dateStr);
                      setFormData((prev) => ({ ...prev, driverContractEndDate: "" }));
                    }}
                    // maxDate={disableEndDate ? convertToISO8601(disableEndDate) : undefined}
                  />
                </div>
                {formErrors.driverContractStartDate && <FormHelper text={String(formErrors.driverContractStartDate)} />}
              </div>
            </div>
            <div className="col-span-12 md:col-span-3">
              <div className="form-group">
                <label className="form-label">
                  วันสิ้นสุดสัญญาจ้าง
                  {/* {disableStartDate && <div>{disableStartDate}</div>} */}
                </label>
                <div className={`input-group flatpickr`}>
                  <div className="input-group-prepend">
                    <span className="input-group-text">
                      <i className="material-symbols-outlined">calendar_month</i>
                    </span>
                  </div>

                  <DatePicker
                    key={disableStartDate || "default"}
                    placeholder="เลือกวันที่สิ้นสุด"
                    defaultValue={convertToThaiDate(formData.driverContractEndDate)}
                    onChange={(dateStr) => handleChangeContractEndDate(dateStr)}
                    minDate={disableStartDate ? disableStartDate : undefined}
                    // minDate="27/05/2025"
                    // disabled={disableStartDate ? false : true}
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
                    showDescriptions
                    placeholder="เลือกประเภทใบขับขี่"
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
                      onKeyDown={(e) => {
                        if (
                          !/[0-9]/.test(e.key) &&
                          !["Backspace", "Delete", "Tab", "ArrowLeft", "ArrowRight", "Home", "End"].includes(e.key)
                        ) {
                          e.preventDefault();
                        }
                      }}
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
                      onChange={(dateStr) => {
                        handleChangeDriverLicenseStartDate(dateStr);
                        setFormData((prev) => ({ ...prev, driverLicenseEndDate: "" }));
                      }}
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
                      key={disableDriverStartDate || "default"}
                      placeholder="เลือกวันที่หมดอายุใบขับขี่"
                      defaultValue={convertToThaiDate(formData.driverLicenseEndDate)}
                      onChange={(dateStr) => handleChangeDriverLicenseEndDate(dateStr)}
                      minDate={disableDriverStartDate ? disableDriverStartDate : undefined}
                      // disabled={disableDriverStartDate ? false : true}
                    />
                  </div>
                  {formErrors.driverLicenseEndDate && <FormHelper text={String(formErrors.driverLicenseEndDate)} />}
                </div>
              </div>
            </div>
          </div>

          {(formData.driverLicenseType === "2+" || formData.driverLicenseType === "3+") && (
            <>
              <div className="grid grid-cols-12 gap-4 mt-5">
                <div className="col-span-12 md:col-span-6">
                  <div>
                    <div className="form-group">
                      <label className="form-label">ชื่อหลักสูตร</label>
                      <div className={`input-group`}>
                        <div className="input-group-prepend">
                          <span className="input-group-text">
                            <i className="material-symbols-outlined">developer_guide</i>
                          </span>
                        </div>
                        <input
                          type="text"
                          name="driver_certificate_name"
                          className="form-control"
                          placeholder="ระบุชื่อหลักสูตร"
                          value={formData.driverCertificate.driver_certificate_name}
                          onChange={handleInputChangeCertificate}
                        />
                      </div>
                      {formErrors.driverCertificate.driver_certificate_name && (
                        <FormHelper text={String(formErrors.driverCertificate.driver_certificate_name)} />
                      )}
                    </div>
                  </div>
                </div>
                <div className="col-span-12 md:col-span-3">
                  <div>
                    <div className="form-group">
                      <label className="form-label">เลขที่ใบรับรอง</label>
                      <div className={`input-group`}>
                        <div className="input-group-prepend">
                          <span className="input-group-text">
                            <i className="material-symbols-outlined">news</i>
                          </span>
                        </div>
                        <input
                          type="text"
                          name="driver_certificate_no"
                          className="form-control"
                          placeholder="ระบุเลขที่ใบรับรอง"
                          value={formData.driverCertificate.driver_certificate_no}
                          onChange={handleInputChangeCertificate}
                        />
                      </div>
                      {formErrors.driverCertificate.driver_certificate_no && (
                        <FormHelper text={String(formErrors.driverCertificate.driver_certificate_no)} />
                      )}
                    </div>
                  </div>
                </div>
                <div className="col-span-12 md:col-span-3">
                  <div>
                    <div className="form-group">
                      <label className="form-label">ประเภทยานพาหนะ</label>
                      <CustomSelect
                        iconName="front_loader"
                        w="w-full"
                        options={driverCertificateTypeList}
                        value={
                          driverCertificateTypeList.find(
                            (option) => option.value === formData.driverCertificate.ref_driver_certificate_type_code
                          ) || null
                        }
                        onChange={(selected) =>
                          setFormData((prev) => ({
                            ...prev,
                            driverCertificate: {
                              ...prev.driverCertificate,
                              ref_driver_certificate_type_code: String(selected.value),
                            },
                          }))
                        }
                        showDescriptions
                        placeholder="กรุณาเลือก"
                      />
                      {formErrors.driverCertificate.ref_driver_certificate_type_code && (
                        <FormHelper text={String(formErrors.driverCertificate.ref_driver_certificate_type_code)} />
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-12 gap-4 mt-5">
                <div className="col-span-12 md:col-span-3">
                  <div>
                    <div className="form-group">
                      <label className="form-label">วันที่อบรม</label>
                      <div className={`input-group flatpickr`}>
                        <div className="input-group-prepend">
                          <span className="input-group-text">
                            <i className="material-symbols-outlined">calendar_month</i>
                          </span>
                        </div>
                        <DatePicker
                          placeholder="ระบบวันที่"
                          defaultValue={convertToThaiDate(formData.driverCertificate.driver_certificate_issue_date)}
                          onChange={(dateStr) => {
                            // handleChangeDriverLicenseStartDate(dateStr);
                            // setFormData((prev) => ({ ...prev, driverLicenseEndDate: "" }));
                            handleChangeDriverCertificateIssue("driver_certificate_issue_date", dateStr);
                          }}
                        />
                      </div>
                      {formErrors.driverCertificate.driver_certificate_issue_date && (
                        <FormHelper text={String(formErrors.driverCertificate.driver_certificate_issue_date)} />
                      )}
                    </div>
                  </div>
                </div>
                <div className="col-span-12 md:col-span-3">
                  <div>
                    <div className="form-group">
                      <label className="form-label">วันที่สิ้นอายุ</label>
                      <div className={`input-group flatpickr`}>
                        <div className="input-group-prepend">
                          <span className="input-group-text">
                            <i className="material-symbols-outlined">calendar_month</i>
                          </span>
                        </div>
                        <DatePicker
                          placeholder="ระบบวันที่"
                          defaultValue={convertToThaiDate(formData.driverCertificate.driver_certificate_expire_date)}
                          onChange={(dateStr) => {
                            // handleChangeDriverLicenseStartDate(dateStr);
                            // setFormData((prev) => ({ ...prev, driverLicenseEndDate: "" }));
                            handleChangeDriverCertificateExpire("driver_certificate_expire_date", dateStr);
                          }}
                        />
                      </div>
                      {formErrors.driverCertificate.driver_certificate_expire_date && (
                        <FormHelper text={String(formErrors.driverCertificate.driver_certificate_expire_date)} />
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
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
                  <label className="form-label md:min-h-[48px] min-[1600px]:min-h-0">
                    รูปใบขับขี่
                    <div className="2xl:hidden xl:block hidden">
                      <br />
                      &nbsp;
                    </div>
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
                  <label className="form-label md:min-h-[48px] min-[1600px]:min-h-0">
                    รูปใบรับรองการอบรม,บัตรประชาชน, ทะเบียนบ้าน ฯลฯ (ถ้ามี)
                  </label>
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
