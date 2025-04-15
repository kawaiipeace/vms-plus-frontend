import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { useForm, Controller } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useFormContext } from "@/contexts/requestFormContext";
import { shortenFilename } from "@/utils/shortenFilename";
import { uploadFile } from "@/services/masterService";
import FormHelper from "@/components/formHelper";
import { useRequestDetailContext } from "@/contexts/requestDetailContext";
import { updateRef } from "@/services/bookingUser";
import { RequestDetailType } from "@/app/types/request-detail-type";

interface Payload {
  reference_number: string;
  trn_request_uid: string;
  attached_document?: any;
}

interface RefProps {
  requestData?: RequestDetailType;
  onUpdate?: (data: any) => void;
}

const schema = yup.object().shape({
  referenceNumber: yup.string(),
  attachmentFile: yup.mixed(),
});

const ReferenceModal = forwardRef<
  { openModal: () => void; closeModal: () => void }, // Ref type
  RefProps
>(({ onUpdate, requestData }, ref) => {
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

  const { handleSubmit, reset, control } = useForm({
    mode: "onChange",
    resolver: yupResolver(schema),
    defaultValues: {
      referenceNumber: formData.referenceNumber || "",
      attachmentFile: formData.attachmentFile || "",
    },
  });

  const [fileName, setFileName] = useState("อัพโหลดเอกสารแนบ");

  useEffect(() => {
    if (formData.attachmentFile) {
      setFileName(shortenFilename(formData.attachmentFile));
    }
  }, [formData.attachmentFile]);

  useEffect(() => {
    if (requestData) {
      reset({
        referenceNumber: requestData?.reference_number,
        attachmentFile: requestData?.attached_document,
      });
      hasReset.current = true;
    }
  }, [requestData, reset]);

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
    onChange: (value: File | null) => void
  ) => {
    const file = event.target.files?.[0] || null;
    if (!file) return;

    try {
      const response = await uploadFile(file);
      onChange(file);
      setFileValue(response.file_url);
      setFileName(shortenFilename(response.file_url));
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message;
      setFileError(errorMessage);
    }
  };

  const onSubmit = async (data: any) => {
    if (requestData) {
      const payload: Payload = {
        reference_number: data.referenceNumber,
        trn_request_uid: requestData.trn_request_uid,
      };

      if (fileValue) {
        payload.attached_document = fileValue;
      }

      try {
        console.log("payload", payload);
        const response = await updateRef(payload);
        console.log(response);
        if (response) {
          if (onUpdate) onUpdate(response.data);
          modalRef.current?.close();
        }
      } catch (error) {
        console.error("Network error:", error);
        alert("Failed to update trip due to network error.");
      }
    } else {
      if (onUpdate)
        onUpdate({
          ...data,
          referenceNumber: data.referenceNumber,
          attachmentFile: fileValue,
        });

      updateFormData({
        referenceNumber: data.referenceNumber,
        attachmentFile: fileValue,
      });

      modalRef.current?.close();
    }
  };

  return (
    <dialog ref={modalRef} id="my_modal_1" className="modal">
      <div className="modal-box max-w-[500px] p-0 relative modal-vehicle-pick overflow-hidden flex flex-col max-h-[90vh]">
        <div className="bottom-sheet">
          <div className="bottom-sheet-icon"></div>
        </div>
        <div className="modal-header bg-white sticky top-0 flex justify-between z-10">
          <div className="modal-title">
            เลขที่หนังสืออ้างอิง<span className="form-optional">(ถ้ามี)</span>
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
                          {...field}
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
                    <Controller
                      name="attachmentFile"
                      control={control}
                      render={({ field: { onChange } }) => (
                        <label className="flex items-center gap-2 cursor-pointer">
                          <div className="input-group-prepend">
                            <span className="input-group-text">
                              <i className="material-symbols-outlined">
                                attach_file
                              </i>
                            </span>
                          </div>
                          <input
                            type="file"
                            className="file-input hidden"
                            onChange={(e) => handleFileChange(e, onChange)}
                          />
                          <div className="input-uploadfile-label w-full">
                            {fileName}
                          </div>
                        </label>
                      )}
                    />
                  </div>
                  {fileError ? (
                    <FormHelper text={fileError} />
                  ) : (
                    <span className="form-helper">
                      รองรับไฟล์ประเภท pdf เท่านั้นขนาดไม่เกิน 20 MB
                    </span>
                  )}
                </div>
              </div>
            </div>
            <div className="modal-action sticky bottom-0 gap-3 mt-0">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => modalRef.current?.close()}
              >
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
