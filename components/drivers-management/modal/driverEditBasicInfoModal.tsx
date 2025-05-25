import DatePicker from "@/components/datePicker";
import FormHelper from "@/components/formHelper";
import ImagePreview from "@/components/imagePreview";
import ImageUpload from "@/components/imageUpload";
import RadioButton from "@/components/radioButton";
import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import * as Yup from "yup";

import { DriverInfoType, DriverUpdateDetails } from "@/app/types/drivers-management-type";

import { driverUpdateDetail } from "@/services/driversManagement";
import { convertToISO8601, convertToThaiDate } from "@/utils/driver-management";

interface DriverEditBasicInfoModalProps {
  driverInfo?: DriverInfoType;
  onUpdateDriver: React.Dispatch<React.SetStateAction<boolean>>;
  setUpdateType: React.Dispatch<React.SetStateAction<string>>;
}

const DriverEditBasicInfoModal = forwardRef<
  { openModal: () => void; closeModal: () => void },
  DriverEditBasicInfoModalProps
>(({ driverInfo, onUpdateDriver, setUpdateType }, ref) => {
  const modalRef = useRef<HTMLDialogElement>(null);
  // const [overNightStay, setOverNightStay] = useState<string>("1");
  // const [name, setName] = useState<string>(driverInfo?.driver_name || "");
  // const [nickname, setNickname] = useState<string>(driverInfo?.driver_nickname || "");
  // const [contactNumber, setContactNumber] = useState<string>(driverInfo?.driver_contact_number || "");
  // const [identificationNo, setIdentificationNo] = useState<string>(driverInfo?.driver_identification_no || "");
  // const [birthdate, setBirthdate] = useState<string>(driverInfo?.driver_birthdate || "");
  const [formData, setFormData] = useState({
    image: "",
    name: "",
    nickname: "",
    contactNumber: "",
    identificationNo: "",
    birthdate: "",
    overNightStay: 1,
  });
  const [formErrors, setFormErrors] = useState({
    image: "",
    name: "",
    nickname: "",
    contactNumber: "",
    identificationNo: "",
    birthdate: "",
  });

  const validationSchema = Yup.object().shape({
    image: Yup.string().required("กรุณาอัพโหลดรูปภาพ"),
    name: Yup.string().required("กรุณากรอกชื่อ-นามสกุล"),
    nickname: Yup.string().required("กรุณากรอกชื่อเล่น"),
    contactNumber: Yup.string()
      .matches(/^(^$|[0-9]+)$/, "กรุณาระบุเฉพาะตัวเลข")
      .length(10, "กรุณาระบุเบอร์ติดต่อ 10 หลัก")
      .max(10, "กรุณาระบุเลขบัตรประชาชน 10 หลัก")
      .min(10, "กรุณาระบุเลขบัตรประชาชน 10 หลัก"),
    identificationNo: Yup.string()
      .required("กรุณาระบุเลขบัตรประชาชน")
      .matches(/^[0-9]+$/, "กรุณาระบุเฉพาะตัวเลข")
      .length(13, "กรุณาระบุเลขบัตรประชาชน 13 หลัก")
      .max(13, "กรุณาระบุเลขบัตรประชาชน 13 หลัก")
      .min(13, "กรุณาระบุเลขบัตรประชาชน 13 หลัก"),
    birthdate: Yup.string().required("กรุณาเลือกวันเกิด"),
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
    setFormData({
      image: driverInfo?.driver_image || "",
      name: driverInfo?.driver_name || "",
      nickname: driverInfo?.driver_nickname || "",
      contactNumber: driverInfo?.driver_contact_number || "",
      identificationNo: driverInfo?.driver_identification_no || "",
      birthdate: driverInfo?.driver_birthdate || "",
      overNightStay: driverInfo?.work_type || 1,
    });
  }, [driverInfo]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await validationSchema.validate(formData, { abortEarly: false });
      const params: DriverUpdateDetails = {
        driver_birthdate: formData.birthdate,
        driver_contact_number: formData.contactNumber,
        driver_identification_no: formData.identificationNo,
        driver_image: formData.image,
        driver_name: formData.name,
        driver_nickname: formData.nickname,
        mas_driver_uid: driverInfo?.mas_driver_uid || "",
        work_type: formData.overNightStay,
      };
      // Submit form data
      const response = await driverUpdateDetail({ params });
      if (response.status === 200) {
        handleCloseModal();
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
          image: "",
          name: "",
          nickname: "",
          contactNumber: "",
          identificationNo: "",
          birthdate: "",
        });
        setFormErrors((prevErrors) => ({
          ...prevErrors,
          ...errors,
        }));
      }
    }
  };

  const handleImageChange = (newImages: any) => {
    setFormData((prevData) => ({
      ...prevData,
      image: newImages.file_url,
    }));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleChangeBirthdate = (dateStr: string) => {
    const dateStrISO = convertToISO8601(dateStr);
    setFormData((prevData) => ({
      ...prevData,
      birthdate: dateStrISO,
    }));
  };

  return (
    <>
      {openModal && (
        <div className={`modal modal-middle modal-open`}>
          <div className="modal-box max-w-[500px] p-0 relative overflow-hidden flex flex-col bg-white">
            <div className="modal-header bg-white sticky top-0 flex justify-between z-10">
              <div className="modal-title">เพิ่มข้อมูลนัดหมายพนักงานขับรถ</div>
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
              <div className="modal-body overflow-y-auto text-center border-b-[1px] border-[#E5E5E5]">
                {formData.image === "" && <ImageUpload onImageChange={handleImageChange} />}
                <div className="image-preview flex flex-wrap gap-3 !mt-0">
                  {formData.image && (
                    <ImagePreview
                      image={formData.image}
                      onDelete={() => {
                        setFormData((prevData) => ({
                          ...prevData,
                          image: "",
                        }));
                      }}
                    />
                  )}
                </div>
                {formErrors.image && <FormHelper text={String(formErrors.image)} />}
                <div className="form-section">
                  <div className="form-section-body">
                    <div className="grid md:grid-cols-2 gird-cols-1 gap-4">
                      <div className="w-full">
                        <label className="label font-semibold text-black">ชื่อ-นามสกุล</label>
                        <div className={`input-group`}>
                          <input
                            type="text"
                            name="name"
                            className="form-control"
                            placeholder="ชื่อ-นามสกุล"
                            value={formData.name}
                            onChange={handleInputChange}
                          />
                        </div>
                        {formErrors.name && <FormHelper text={String(formErrors.name)} />}
                      </div>
                      <div className="w-full">
                        <label className="label font-semibold text-black">ชื่อเล่น</label>
                        <div className={`input-group`}>
                          <input
                            type="text"
                            name="nickname"
                            className="form-control"
                            placeholder="ชื่อเล่น"
                            value={formData.nickname}
                            onChange={handleInputChange}
                          />
                        </div>
                        {formErrors.nickname && <FormHelper text={String(formErrors.nickname)} />}
                      </div>
                    </div>
                    <div className="grid md:grid-cols-2 gird-cols-1 gap-4">
                      <div className="w-full">
                        <label className="label font-semibold text-black">เบอร์ติดต่อ</label>
                        <div className={`input-group`}>
                          <input
                            type="text"
                            name="contactNumber"
                            className="form-control"
                            placeholder="เบอร์ติดต่อ"
                            value={formData.contactNumber}
                            onChange={handleInputChange}
                            maxLength={10}
                          />
                        </div>
                        {formErrors.contactNumber && <FormHelper text={String(formErrors.contactNumber)} />}
                      </div>
                      <div className="w-full">
                        <label className="label font-semibold text-black">เลขบัตรประชาชน</label>
                        <div className={`input-group`}>
                          <input
                            type="text"
                            name="identificationNo"
                            className="form-control"
                            placeholder="เลขบัตรประชาชน"
                            value={formData.identificationNo}
                            onChange={handleInputChange}
                          />
                        </div>
                        {formErrors.identificationNo && <FormHelper text={String(formErrors.identificationNo)} />}
                      </div>
                    </div>
                    <div className="grid md:grid-cols-2 gird-cols-1 gap-4">
                      <div className="w-full">
                        <label className="label font-semibold text-black">วันเกิด</label>
                        <div className={`input-group`}>
                          <div className="input-group-prepend">
                            <span className="input-group-text">
                              <i className="material-symbols-outlined">calendar_month</i>
                            </span>
                          </div>
                          <DatePicker
                            placeholder="วันเกิด"
                            defaultValue={convertToThaiDate(formData.birthdate)}
                            onChange={(dateStr) => handleChangeBirthdate(dateStr)}
                          />
                        </div>
                        {formErrors.birthdate && <FormHelper text={String(formErrors.birthdate)} />}
                      </div>
                      <div className="w-full">
                        <label className="label font-semibold text-black">การค้่างคืน</label>
                        <div className="custom-group">
                          <RadioButton
                            name="overNightStay"
                            label="ค้างคืนได้"
                            value="1"
                            selectedValue={`${formData.overNightStay}`}
                            setSelectedValue={() => {
                              setFormData((prevData) => ({
                                ...prevData,
                                overNightStay: 1,
                              }));
                            }}
                          />
                          <RadioButton
                            name="overNightStay"
                            label="ค้างคืนไม่ได้"
                            value="2"
                            selectedValue={`${formData.overNightStay}`}
                            setSelectedValue={() => {
                              setFormData((prevData) => ({
                                ...prevData,
                                overNightStay: 2,
                              }));
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="modal-footer mt-5 flex gap-3 justify-end px-4 pb-4">
                <div>
                  <button className="btn btn-secondary w-full" onClick={handleCloseModal}>
                    ไม่ใช่ตอนนี้
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
});

DriverEditBasicInfoModal.displayName = "DriverEditBasicInfoModal";

export default DriverEditBasicInfoModal;
