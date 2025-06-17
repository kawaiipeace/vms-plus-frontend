import { RequestDetailType } from "@/app/types/request-detail-type";
import FormHelper from "@/components/formHelper";
import { useFormContext } from "@/contexts/requestFormContext";
import { adminUpdateRef } from "@/services/bookingAdmin";
import { updateRef } from "@/services/bookingUser";
import { uploadFile } from "@/services/masterService";
import { shortenFilename } from "@/utils/shortenFilename";
import useSwipeDown from "@/utils/swipeDown";
import { yupResolver } from "@hookform/resolvers/yup";
import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import * as yup from "yup";

interface Payload {
  doc_no: string;
  trn_request_uid: string;
  doc_file?: any;
}

interface RefProps {
  requestData?: RequestDetailType;
  role?: string;
  onUpdate?: (data: any) => void;
}

const schema = yup.object().shape({
  referenceNumber: yup.string(),
});

const ReferenceModal = forwardRef<
  { openModal: () => void; closeModal: () => void },
  RefProps
>(({ onUpdate, requestData, role }, ref) => {
  const modalRef = useRef<HTMLDialogElement>(null);
  const hasReset = useRef(false);
  useImperativeHandle(ref, () => ({
    openModal: () => {
      hasReset.current = false;
      modalRef.current?.showModal();
    },
    closeModal: () => modalRef.current?.close(),
  }));
  const { formData, updateFormData } = useFormContext();
  const [fileError, setFileError] = useState("");
  const [fileValue, setFileValue] = useState("");
  const [fileName, setFileName] = useState("อัพโหลดเอกสารแนบ");

  const { handleSubmit, reset, control } = useForm({
    mode: "onChange",
    resolver: yupResolver(schema),
    defaultValues: {
      referenceNumber: formData.referenceNumber || "",
    },
  });

  useEffect(() => {
    if (formData.attachmentFile) {
      setFileName(shortenFilename(formData.attachmentFile));
      setFileValue(formData.attachmentFile);
    }
  }, [formData]);

  useEffect(() => {

    if (requestData) {
      reset({
        referenceNumber: requestData?.doc_no || "",
      });
      if (requestData?.doc_file) {
        setFileName(shortenFilename(requestData.doc_file));
        setFileValue(requestData.doc_file);
      }
      hasReset.current = true;
    }
  }, [requestData, reset]);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    if (!file) return;

    try {
      const response = await uploadFile(file);
      setFileValue(response.file_url);
      setFileName(shortenFilename(response.file_url));
      setFileError("");
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message;
      setFileError(errorMessage);
      setFileValue("");
      setFileName("อัพโหลดเอกสารแนบ");
    }
  };

  const onSubmit = async (data: any) => {
    if (requestData) {
      const payload: Payload = {
        doc_no: data.referenceNumber,
        trn_request_uid: requestData?.trn_request_uid || "",
      };

      if (fileValue) {
        payload.doc_file = fileValue;
      }

      try {
        const response = role === "admin" 
          ? await adminUpdateRef(payload) 
          : await updateRef(payload);

        if (response) {
          if (onUpdate) onUpdate(response.data);
          modalRef.current?.close();
        }
      } catch (error) {
        console.error("Network error:", error);
        alert("Failed to update trip due to network error.");
      }
    } else {
      if (onUpdate) {
        onUpdate({
          ...data,
          referenceNumber: data.referenceNumber,
          attachmentFile: fileValue,
        });
      }

      updateFormData({
        referenceNumber: data.referenceNumber,
        attachmentFile: fileValue,
      });

      modalRef.current?.close();
    }
  };

  const swipeDownHandlers = useSwipeDown(() => modalRef.current?.close());

  return (
    <dialog ref={modalRef} id="my_modal_1" className="modal">
      <div className="modal-box max-w-[500px] p-0 relative modal-vehicle-pick overflow-hidden flex flex-col max-h-[90vh]">
        <div className="bottom-sheet" {...swipeDownHandlers}>
          <div className="bottom-sheet-icon"></div>
        </div>
        <div className="modal-header bg-white sticky top-0 flex justify-between z-10">
          <div className="modal-title">
            แก้ไขหนังสืออ้างอิง
          </div>
          <form method="dialog">
            <button className="close btn btn-icon border-none bg-transparent shadow-none btn-tertiary">
              <i className="material-symbols-outlined">close</i>
            </button>
          </form>
        </div>
        <div className="modal-body overflow-y-auto">
          <form onSubmit={handleSubmit(onSubmit)} className="w-full">
            <div className="grid grid-cols-12 gap-4">
              <div className="col-span-12">
                <div className="form-group">
                  <label className="form-label">
                    เลขที่หนังสืออ้างอิง
                    <span className="form-optional">(ถ้ามี)</span>
                  </label>
                  <div className="input-group">
                    <div className="input-group-prepend">
                      <span className="input-group-text">
                        <i className="material-symbols-outlined">docs</i>
                      </span>
                    </div>
                    <Controller
                      name="referenceNumber"
                      control={control}
                      render={({ field }) => (
                        <input 
                          type="text" 
                          className="form-control" 
                          placeholder="" 
                          value={field.value || ""}
                          onChange={field.onChange}
                        />
                      )}
                    />
                  </div>
                </div>
              </div>

              <div className="col-span-12">
                <div className="form-group">
                  <label className="form-label">
                    เอกสารแนบ<span className="form-optional">(ถ้ามี)</span>
                  </label>
                  <div className="input-group input-uploadfile">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <div className="input-group-prepend">
                        <span className="input-group-text">
                          <i className="material-symbols-outlined">attach_file</i>
                        </span>
                      </div>
                      <input
                        type="file"
                        className="file-input hidden"
                        onChange={handleFileChange}
                        accept=".pdf"
                      />
                      <div className="input-uploadfile-label w-full">{fileName}</div>
                    </label>
                  </div>
                  {fileError ? (
                    <FormHelper text={fileError} />
                  ) : (
                    <span className="form-helper">รองรับไฟล์ประเภท pdf เท่านั้นขนาดไม่เกิน 20 MB</span>
                  )}
                </div>
              </div>
            </div>
            <div className="modal-action sticky bottom-0 gap-3 mt-0">
              <button type="button" className="btn btn-secondary" onClick={() => modalRef.current?.close()}>
                ยกเลิก
              </button>
              <button type="submit" className="btn btn-primary">
                ยืนยัน
              </button>
            </div>
          </form>
        </div>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>
  );
});

ReferenceModal.displayName = "ReferenceModal";

export default ReferenceModal;