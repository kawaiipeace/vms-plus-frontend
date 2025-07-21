import DatePicker from "@/components/datePicker";
import CustomSelect from "@/components/customSelect";
import FormHelper from "@/components/formHelper";
import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import * as Yup from "yup";

import { driverUpdateLicenseDetails, listDriverLicense, driverCertificateTypeRef } from "@/services/driversManagement";
import { convertToISO8601, convertToThaiDate } from "@/utils/driver-management";

import { DriverInfoType, DriverUpdateLicenseDetails } from "@/app/types/drivers-management-type";
import { formatDateToThai } from "@/components/drivers-management/driverForm";
// import { convertToBuddhistDateTime } from "@/utils/converToBuddhistDateTime";

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
  const [disableStartDate, setDisableStartDate] = useState<string>();
  const [disableCertificateStartDate, setDisableCertificateStartDate] = useState<string>();
  const [driverCertificateTypeList, setDriverCertificateTypeList] = useState<CustomSelectOption[]>([]);
  const [formData, setFormData] = useState({
    driverLicenseType: "",
    driverLicenseNo: "",
    driverLicenseStartDate: "",
    driverLicenseEndDate: "",
    driverCertificate: {
      driver_certificate_name: "",
      driver_certificate_no: "",
      ref_driver_certificate_type_code: "",
      driver_certificate_issue_date: "",
      driver_certificate_expire_date: "",
    },
  });
  const [formErrors, setFormErrors] = useState({
    driverLicenseType: "",
    driverLicenseNo: "",
    driverLicenseStartDate: "",
    driverLicenseEndDate: "",
    driverCertificate: {
      driver_certificate_name: "",
      driver_certificate_no: "",
      ref_driver_certificate_type_code: "",
      driver_certificate_issue_date: "",
      driver_certificate_expire_date: "",
    },
  });

  const driverLicenseSchema = Yup.object().shape({
    driverLicenseType: Yup.string().required("ประเภทใบขับขี่ไม่ถูกต้อง"),
    driverLicenseNo: Yup.string()
      .required("เลขที่ใบขับขี่ไม่ถูกต้อง")
      .length(8, "กรุณาระบุเลขที่ใบขับขี่ 8 หลัก")
      .min(8, "กรุณาระบุเลขที่ใบขับขี่ 8 หลัก")
      .max(8, "กรุณาระบุเลขที่ใบขับขี่ 8 หลัก"),
    driverLicenseStartDate: Yup.string().required("วันที่ออกใบขับขี่ไม่ถูกต้อง"),
    driverLicenseEndDate: Yup.string().required("วันที่หมดอายุใบขับขี่ไม่ถูกต้อง"),
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
    if (driverInfo) {
      setFormData({
        driverLicenseType: driverInfo.driver_license?.ref_driver_license_type_code || "",
        driverLicenseNo: driverInfo.driver_license?.driver_license_no || "",
        driverLicenseStartDate: driverInfo.driver_license?.driver_license_start_date || "",
        driverLicenseEndDate: driverInfo.driver_license?.driver_license_end_date || "",
        driverCertificate: {
          driver_certificate_name: driverInfo.driver_certificate?.driver_certificate_name || "",
          driver_certificate_no: driverInfo.driver_certificate?.driver_certificate_no || "",
          ref_driver_certificate_type_code: driverInfo.driver_certificate?.ref_driver_certificate_type_code || "",
          driver_certificate_issue_date: driverInfo.driver_certificate?.driver_certificate_issue_date || "",
          driver_certificate_expire_date: driverInfo.driver_certificate?.driver_certificate_expire_date || "",
        },
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
            desc: item.ref_driver_license_type_desc,
          };
        });
        // console.log(driverLicenseData);
        setDriverLicenseList(driverLicenseData);
      } catch (error) {
        console.error("Error fetching driver license data:", error);
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

    fetchDriverLicense();
    fetchDriverCertificateType();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await driverLicenseSchema.validate(formData, {
        abortEarly: false,
        context: { driverLicenseType: formData.driverLicenseType },
      });

      const params: DriverUpdateLicenseDetails = {
        driver_license_no: formData.driverLicenseNo,
        ref_driver_license_type_code: formData.driverLicenseType,
        driver_license_start_date: formData.driverLicenseStartDate,
        driver_license_end_date: formData.driverLicenseEndDate,
        mas_driver_uid: driverInfo?.mas_driver_uid || "",
        driver_certificate: {
          driver_certificate_name:
            formData.driverLicenseType === "2+" || formData.driverLicenseType === "3+"
              ? formData.driverCertificate.driver_certificate_name
              : "",
          driver_certificate_no:
            formData.driverLicenseType === "2+" || formData.driverLicenseType === "3+"
              ? formData.driverCertificate.driver_certificate_no
              : "",
          ref_driver_certificate_type_code:
            formData.driverLicenseType === "2+" || formData.driverLicenseType === "3+"
              ? formData.driverCertificate.ref_driver_certificate_type_code
              : "",
          driver_certificate_issue_date:
            formData.driverLicenseType === "2+" || formData.driverLicenseType === "3+"
              ? formData.driverCertificate.driver_certificate_issue_date
              : "",
          driver_certificate_expire_date:
            formData.driverLicenseType === "2+" || formData.driverLicenseType === "3+"
              ? formData.driverCertificate.driver_certificate_expire_date
              : "",
        },
      };

      // console.log("Submitting form data:", params);

      try {
        const response = await driverUpdateLicenseDetails({ params });
        if (response.status === 200) {
          handleCloseModal();
          onUpdateDriver(true);
          setUpdateType("basicInfo");
          setFormErrors({
            driverLicenseType: "",
            driverLicenseNo: "",
            driverLicenseStartDate: "",
            driverLicenseEndDate: "",
            driverCertificate: {
              driver_certificate_name: "",
              driver_certificate_no: "",
              ref_driver_certificate_type_code: "",
              driver_certificate_issue_date: "",
              driver_certificate_expire_date: "",
            },
          });
        }
      } catch (error) {
        console.error("Error validating form data:", error);
        throw error; // Re-throw to handle in the catch block below
      }
    } catch (error) {
      if (error instanceof Yup.ValidationError) {
        const errors: any = {};
        setFormErrors({
          driverLicenseType: "",
          driverLicenseNo: "",
          driverLicenseStartDate: "",
          driverLicenseEndDate: "",
          driverCertificate: {
            driver_certificate_name: "",
            driver_certificate_no: "",
            ref_driver_certificate_type_code: "",
            driver_certificate_issue_date: "",
            driver_certificate_expire_date: "",
          },
        });
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleChangeDriverLicenseStartDate = (dateStr: string) => {
    const dateStrISO = convertToISO8601(dateStr);
    const thaiDate = formatDateToThai(dateStrISO);
    setFormData((prevData) => ({
      ...prevData,
      driverLicenseStartDate: dateStrISO,
    }));

    setDisableStartDate(thaiDate);
  };

  const handleChangeDriverLicenseEndDate = (dateStr: string) => {
    const dateStrISO = convertToISO8601(dateStr);
    setFormData((prevData) => ({
      ...prevData,
      driverLicenseEndDate: dateStrISO,
    }));
    setFormErrors((prevErrors) => ({
      ...prevErrors,
      driverLicenseEndDate: "",
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

  const handleChangeDriverCertificateStartDate = (dateStr: string) => {
    const dateStrISO = convertToISO8601(dateStr);
    const thaiDate = formatDateToThai(dateStrISO);
    setFormData((prevData) => ({
      ...prevData,
      driverCertificate: {
        ...prevData.driverCertificate,
        driver_certificate_issue_date: dateStrISO,
      },
    }));
    setDisableCertificateStartDate(thaiDate);
  };

  const handleChangeDriverCertificateEndDate = (dateStr: string) => {
    const dateStrISO = convertToISO8601(dateStr);
    setFormData((prevData) => ({
      ...prevData,
      driverCertificate: {
        ...prevData.driverCertificate,
        driver_certificate_expire_date: dateStrISO,
      },
    }));
  };

  return (
    <>
      {openModal && (
        <div className={`modal modal-middle modal-open`}>
          <div className="modal-box max-w-[600px] p-0 relative overflow-hidden flex flex-col bg-white">
            <div className="modal-header bg-white sticky top-0 flex justify-between z-10">
              <div className="modal-title">แก้ไขข้อมูลการขับขี่</div>
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
              <div className="modal-scroll-wrapper overflow-y-auto">
                <div className="modal-body">
                  <div className="form-section">
                    <div className="form-section-body">
                      <div className="grid md:grid-cols-2 gird-cols-1 gap-4">
                        <div className="w-full">
                          <div className="form-group">
                            <label className="form-label">ประเภทใบขับขี่</label>
                            <CustomSelect
                              w="w-full"
                              options={driverLicenseList}
                              value={
                                driverLicenseList.find((option) => option.value === formData.driverLicenseType) || null
                              }
                              onChange={(selected) =>
                                setFormData((prev) => ({ ...prev, driverLicenseType: selected.value }))
                              }
                              showDescriptions
                              placeholder="เลือกประเภทใบขับขี่"
                            />
                            {formErrors.driverLicenseType && <FormHelper text={String(formErrors.driverLicenseType)} />}
                          </div>
                        </div>
                        <div className="w-full">
                          <div className="form-group">
                            <label className="form-label">เลขที่ใบขับขี่</label>
                            <div className={`input-group`}>
                              <input
                                type="text"
                                name="driverLicenseNo"
                                className="form-control"
                                placeholder="เลขที่ใบขับขี่"
                                value={formData.driverLicenseNo}
                                onChange={handleInputChange}
                                maxLength={8}
                                onKeyDown={(e) => {
                                  if (
                                    !/[0-9]/.test(e.key) &&
                                    !["Backspace", "Delete", "Tab", "ArrowLeft", "ArrowRight", "Home", "End"].includes(
                                      e.key
                                    )
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
                      <div className="grid md:grid-cols-2 gird-cols-1 gap-4 mt-3">
                        <div className="w-full">
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
                                defaultValue={convertToThaiDate(formData?.driverLicenseStartDate)}
                                // defaultValue={convertToBuddhistDateTime(formData?.driverLicenseStartDate || "").date}
                                onChange={(dateStr) => {
                                  handleChangeDriverLicenseStartDate(dateStr);
                                  setFormData((prev) => ({ ...prev, driverLicenseEndDate: "" }));
                                }}
                              />
                              <div className="input-group-append hidden" data-clear>
                                <span className="input-group-text search-ico-trailing">
                                  <i className="material-symbols-outlined">close</i>
                                </span>
                              </div>
                            </div>
                            {formErrors.driverLicenseStartDate && (
                              <FormHelper text={String(formErrors.driverLicenseStartDate)} />
                            )}
                          </div>
                        </div>
                        <div className="w-full">
                          <div className="form-group">
                            <label className="form-label">วันที่หมดอายุใบขับขี่</label>
                            <div className={`input-group flatpickr`}>
                              <div className="input-group-prepend">
                                <span className="input-group-text">
                                  <i className="material-symbols-outlined">calendar_month</i>
                                </span>
                              </div>
                              <DatePicker
                                key={disableStartDate || "default"} // Reset DatePicker when disableStartDate changes
                                placeholder="เลือกวันที่หมดอายุใบขับขี่"
                                defaultValue={convertToThaiDate(formData.driverLicenseEndDate)}
                                onChange={(dateStr) => handleChangeDriverLicenseEndDate(dateStr)}
                                minDate={disableStartDate ? disableStartDate : undefined}
                                // disabled={disableStartDate ? false : true}
                              />
                            </div>
                            {formErrors.driverLicenseEndDate && (
                              <FormHelper text={String(formErrors.driverLicenseEndDate)} />
                            )}
                          </div>
                        </div>
                      </div>
                      {(formData.driverLicenseType === "2+" || formData.driverLicenseType === "3+") && (
                        <>
                          <div className="grid gird-cols-1 gap-4 my-3">
                            <div className="w-full">
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
                          <div className="grid md:grid-cols-2 gird-cols-1 gap-4 mb-3">
                            <div className="w-full">
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
                            <div className="w-full">
                              <div className="form-group">
                                <label className="form-label">ประเภทยานพาหนะ</label>
                                <CustomSelect
                                  iconName="front_loader"
                                  w="w-full"
                                  options={driverCertificateTypeList}
                                  value={
                                    driverCertificateTypeList.find(
                                      (option) =>
                                        option.value === formData.driverCertificate.ref_driver_certificate_type_code
                                    ) || null
                                  }
                                  onChange={(selected) => {
                                    setFormData((prevData) => ({
                                      ...prevData,
                                      driverCertificate: {
                                        ...prevData.driverCertificate,
                                        ref_driver_certificate_type_code: selected.value,
                                      },
                                    }));
                                    // Clear error when user selects an option
                                    setFormErrors((prevErrors) => ({
                                      ...prevErrors,
                                      driverCertificate: {
                                        ...prevErrors.driverCertificate,
                                        ref_driver_certificate_type_code: "",
                                      },
                                    }));
                                  }}
                                  showDescriptions
                                  placeholder="กรุณาเลือก"
                                />
                                {formErrors.driverCertificate.ref_driver_certificate_type_code && (
                                  <FormHelper
                                    text={String(formErrors.driverCertificate.ref_driver_certificate_type_code)}
                                  />
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="grid md:grid-cols-2 gird-cols-1 gap-4">
                            <div className="w-full">
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
                                    defaultValue={convertToThaiDate(
                                      formData?.driverCertificate?.driver_certificate_issue_date
                                    )}
                                    onChange={(dateStr) => {
                                      handleChangeDriverCertificateStartDate(dateStr);
                                      setFormData((prev) => ({
                                        ...prev,
                                        driverCertificate: {
                                          ...prev.driverCertificate,
                                          driver_certificate_expire_date: "",
                                        },
                                      }));
                                    }}
                                  />
                                </div>
                                {formErrors.driverCertificate.driver_certificate_issue_date && (
                                  <FormHelper
                                    text={String(formErrors.driverCertificate.driver_certificate_issue_date)}
                                  />
                                )}
                              </div>
                            </div>
                            <div className="w-full">
                              <div className="form-group">
                                <label className="form-label">วันที่สิ้นอายุ</label>
                                <div className={`input-group flatpickr`}>
                                  <div className="input-group-prepend">
                                    <span className="input-group-text">
                                      <i className="material-symbols-outlined">calendar_month</i>
                                    </span>
                                  </div>
                                  <DatePicker
                                    key={disableCertificateStartDate || "default"}
                                    placeholder="ระบบวันที่"
                                    defaultValue={convertToThaiDate(
                                      formData?.driverCertificate?.driver_certificate_expire_date
                                    )}
                                    onChange={(dateStr) => {
                                      handleChangeDriverCertificateEndDate(dateStr);
                                    }}
                                    minDate={disableCertificateStartDate ? disableCertificateStartDate : undefined}
                                  />
                                </div>
                                {formErrors.driverCertificate.driver_certificate_expire_date && (
                                  <FormHelper
                                    text={String(formErrors.driverCertificate.driver_certificate_expire_date)}
                                  />
                                )}
                              </div>
                            </div>
                          </div>
                        </>
                      )}
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
        </div>
      )}
    </>
  );
});

DriverEditLicenseModal.displayName = "DriverEditLicenseModal";

export default DriverEditLicenseModal;
