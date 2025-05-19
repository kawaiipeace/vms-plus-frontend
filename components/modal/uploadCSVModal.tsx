import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import UploadFileCSV from "@/components/uploadFileCSV";
import UploadFilePreview from "../drivers-management/uploadFilePreview";
// import * as Yup from "yup";

import { importDriverCSV } from "@/services/driversManagement";
// import { UploadCSVFileType } from "@/app/types/drivers-management-type";
export interface UploadCSVFileType {
  name: string;
  size: number;
  type: string;
  lastModified: number;
  file: File;
}

interface UploadCSVModalProps {
  onUpdateType: (text: string, value?: string) => void;
}

const UploadCSVModal = forwardRef<{ openModal: () => void; closeModal: () => void }, UploadCSVModalProps>(
  ({ onUpdateType }, ref) => {
    const modalRef = useRef<HTMLDialogElement>(null);
    const [formData, setFormData] = useState<{ file: UploadCSVFileType | null }>({
      file: null,
    });
    useImperativeHandle(ref, () => ({
      openModal: () => modalRef.current?.showModal(),
      closeModal: () => modalRef.current?.close(),
    }));

    // useEffect(() => {
    //   console.log("formData", formData);
    // }, [formData]);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      try {
        if (!formData.file || !formData.file.file) {
          // alert("กรุณาเลือกไฟล์ .CSV ก่อนนำเข้า");
          return;
        }
        const response = await importDriverCSV(formData.file.file);
        if (response.status === 200) {
          onUpdateType("import", `${response.data.count}`);
          modalRef.current?.close();
        }
      } catch (error) {
        console.error("Error uploading file:", error);
      }
    };

    const handleFileChange = (file: UploadCSVFileType | null) => {
      setFormData((prev) => ({
        ...prev,
        file: file,
      }));
    };
    return (
      <dialog ref={modalRef} className="modal">
        <div className="modal-box max-w-[600px] p-0 relative overflow-hidden flex flex-col">
          <div className="modal-header bg-white sticky top-0 flex justify-between z-10">
            <div className="modal-title">สร้างข้อมูลพนักงานขับรถจำนวนมาก</div>
            <form method="dialog">
              <button className="close btn btn-icon border-none bg-transparent shadow-none btn-tertiary">
                <i className="material-symbols-outlined">close</i>
              </button>
            </form>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="modal-body overflow-y-auto text-center bg-white">
              <div className="flex mb-3">
                <div className="text-left">
                  <h6 className="font-semibold">อัปโหลดไฟล์ .CSV</h6>
                  <p className="text-sm">สร้างข้อมูลพนักงานขับรถจำนวนมากด้วยการนำเข้าไฟล์ .CSV</p>
                </div>
                <div className="ml-auto">
                  <button type="button" onClick={() => window.open("/assets/driver-data-example.csv", "_blank")}>
                    <i className="material-symbols-outlined text-[#A80689]">download</i>
                    <span className="text-[#A80689] font-bold">ตัวอย่างไฟล์ .csv</span>
                  </button>
                </div>
              </div>
              <div>
                {formData.file === null ? (
                  <UploadFileCSV onFileChange={(file) => handleFileChange(file)} />
                ) : (
                  <UploadFilePreview
                    file={{ file_name: formData.file.name, file_size: formData.file.size.toString() }}
                    onDeleteFile={() => setFormData({ file: null })}
                  />
                )}
              </div>
            </div>
            <div className="modal-footer bg-white pb-5">
              <div className="flex justify-end bg-white px-[1.5rem]">
                <button
                  className="btn btn-secondary h-[40px] min-h-[40px] mr-3"
                  type="button"
                  onClick={() => {
                    modalRef.current?.close();
                  }}
                >
                  ย้อนกลับ
                </button>
                <button
                  className="btn h-[40px] min-h-[40px] btn-secondary"
                  type="submit"
                  onClick={() => {
                    modalRef.current?.close();
                  }}
                  disabled={!formData.file}
                >
                  นำเข้า
                </button>
              </div>
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

UploadCSVModal.displayName = "UploadCSVModal";

export default UploadCSVModal;
