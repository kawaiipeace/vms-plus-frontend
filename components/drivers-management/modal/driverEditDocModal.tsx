import UploadFilePreview from "@/components/drivers-management/uploadFilePreview";
import FormHelper from "@/components/formHelper";
import UploadFilePDF from "@/components/uploadFilePDF";
import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import * as Yup from "yup";

import { DriverInfoType, DriverUpdateDocumentPayload } from "@/app/types/drivers-management-type";
import { driverUpdateDocument } from "@/services/driversManagement";

interface DriverEditDocModalProps {
  driverInfo?: DriverInfoType | null;
  onUpdateDriver: React.Dispatch<React.SetStateAction<boolean>>;
  setUpdateType: React.Dispatch<React.SetStateAction<string>>;
}

interface UploadFileType2 {
  file_name: string;
  file_url: string;
  message?: string;
  file_size?: string;
}

const DriverEditLicenseModal = forwardRef<{ openModal: () => void; closeModal: () => void }, DriverEditDocModalProps>(
  ({ driverInfo, onUpdateDriver, setUpdateType }, ref) => {
    const modalRef = useRef<HTMLDialogElement>(null);
    const [filePDF, setFilePDF] = useState<UploadFileType2>();
    const [filePDF2, setFilePDF2] = useState<UploadFileType2[]>([]);
    const [formData, setFormData] = useState({
      driverDocument: filePDF2,
      driverLicense: filePDF,
    });
    const [formErrors, setFormErrors] = useState({
      driverDocument: "",
      driverLicense: "",
    });

    const validationSchema = Yup.object().shape({
      driverDocument: Yup.array().min(1, "กรุณาอัพโหลดไฟล์"),
      driverLicense: Yup.object().shape({
        file_name: Yup.string().required("กรุณาอัพโหลดไฟล์"),
        file_url: Yup.string().required("กรุณาอัพโหลดไฟล์"),
      }),
    });

    useImperativeHandle(ref, () => ({
      openModal: () => modalRef.current?.showModal(),
      closeModal: () => modalRef.current?.close(),
    }));

    useEffect(() => {
      const license = {
        file_name: "ใบขับขี่.pdf",
        file_url: driverInfo?.driver_license?.driver_license_image || "",
      };
      const doc = driverInfo?.driver_documents?.map((item) => ({
        file_name: item.driver_document_name,
        file_url: item.driver_document_file,
      }));
      setFilePDF(license || undefined);
      setFilePDF2(doc || []);
      setFormData({
        driverDocument: doc || [],
        driverLicense: license || undefined,
      });
    }, [driverInfo]);

    useEffect(() => {
      setFormData((prev) => ({
        ...prev,
        driverDocument: filePDF2,
        driverLicense: filePDF,
      }));
    }, [filePDF, filePDF2]);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      try {
        validationSchema.validateSync(formData, { abortEarly: false });
        const arrDoc = formData.driverDocument.map((item, index) => ({
          driver_document_file: item.file_url,
          driver_document_name: item.file_name,
          driver_document_no: 0 + index,
        }));
        const updatedFormData: DriverUpdateDocumentPayload = {
          driver_documents: arrDoc,
          driver_license: {
            driver_document_file: formData.driverLicense?.file_url || "",
            driver_document_name: "ใบขับขี่",
            driver_document_no: 1,
          },
          mas_driver_uid: driverInfo?.mas_driver_uid,
        };
        // Handle form submission logic here
        console.log("Form submitted successfully", updatedFormData);
        try {
          const response = await driverUpdateDocument(updatedFormData);
          if (response.status === 200) {
            console.log("Document updated successfully");
            modalRef.current?.close();
            onUpdateDriver(true);
            setUpdateType("basicInfo");
          }
        } catch (error) {
          console.error("Error submitting form:", error);
        }
        // modalRef.current?.close();
      } catch (error) {
        if (error instanceof Yup.ValidationError) {
          const errors: { [key: string]: string } = {};
          error.inner.forEach((err) => {
            if (err.path?.startsWith("driverLicense")) {
              errors.driverLicense = err.message; // รวม error ของ field ย่อย
            } else if (err.path) {
              errors[err.path] = err.message;
            }
          });
          setFormErrors({
            driverDocument: "",
            driverLicense: "",
          });
          setFormErrors((prevErrors) => ({
            ...prevErrors,
            ...errors,
          }));
        }
      }
    };

    const handleFileChange = (newImages: UploadFileType2) => {
      setFilePDF(newImages);
    };

    const handleFileChange2 = (newImages: UploadFileType2) => {
      setFilePDF2([newImages, ...filePDF2]);
    };

    const handleDeleteFile2 = (index: number) => {
      setFilePDF2((prevFiles) => prevFiles.filter((_, i) => i !== index));
    };

    return (
      <dialog ref={modalRef} className={`modal modal-middle`}>
        <div className="modal-box max-w-[500px] p-0 relative overflow-hidden flex flex-col bg-white">
          <div className="modal-header bg-white sticky top-0 flex justify-between z-10">
            <div className="modal-title">แก้ไขเอกสารเพิ่มเติม</div>
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
                  <div className="w-full">
                    <label className="form-label label justify-start">
                      รูปใบรับรอง, บัตรประชาชน, ทะเบียนบ้าน ฯลฯ&nbsp;
                      {/* <span className="text-[#98A2B3]">(ถ้ามี)</span> */}
                    </label>
                    <div className="mb-3">
                      <UploadFilePDF onImageChange={handleFileChange2} />
                    </div>
                    <div className="flex flex-col gap-y-3">
                      {formData.driverDocument?.map((item, index) => (
                        <UploadFilePreview key={index} file={item} onDeleteFile={() => handleDeleteFile2(index)} />
                      ))}
                    </div>
                    {formErrors?.driverDocument && <FormHelper text={String(formErrors?.driverDocument)} />}
                  </div>
                  <div className="w-full">
                    <label className="label form-label">รูปใบขับขี่</label>
                    <div className="mb-3">
                      <UploadFilePDF onImageChange={handleFileChange} />
                    </div>
                    {formData.driverLicense?.file_url && (
                      <UploadFilePreview file={formData.driverLicense} onDeleteFile={() => setFilePDF(undefined)} />
                    )}
                    {formErrors?.driverLicense && <FormHelper text={String(formErrors?.driverLicense)} />}
                  </div>
                </div>
              </div>
            </div>
            <div className="modal-footer mt-5 flex gap-3 justify-end px-4 pb-4">
              <div>
                <button className="btn btn-secondary w-full" type="button" onClick={() => modalRef.current?.close()}>
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

DriverEditLicenseModal.displayName = "DriverEditLicenseModal";

export default DriverEditLicenseModal;
