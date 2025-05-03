import { RequestDetailType } from "@/app/types/request-detail-type";
import { UploadFileType } from "@/app/types/upload-type";
import ImagePreview from "@/components/imagePreview";
import ImageUpload from "@/components/imageUpload";
import Tooltip from "@/components/tooltips";
import { UserReturnedVehicle } from "@/services/vehicleInUseUser";
import { convertToBuddhistDateTime } from "@/utils/converToBuddhistDateTime";
import { convertToISO } from "@/utils/convertToISO";
import useSwipeDown from "@/utils/swipeDown";
import { useRouter } from "next/navigation";
import { forwardRef, useImperativeHandle, useRef, useState } from "react";
import { ValueFormStep1 } from "./returnCarAddModal";

interface ReturnCarAddStep2ModalProps {
  openStep1: () => void;
  status?: string;
  useBy?: string;
  valueFormStep1?: ValueFormStep1;
  id?: string;
  requestData?: RequestDetailType;
  clearForm?: () => void;
  onSubmit?: () => void;
}

const ReturnCarAddStep2Modal = forwardRef<
  { openModal: () => void; closeModal: () => void },
  ReturnCarAddStep2ModalProps
>(({ openStep1, status, useBy, valueFormStep1, id, requestData, clearForm, onSubmit }, ref) => {
  const router = useRouter();
  const modalRef = useRef<HTMLDialogElement>(null);
  const [images, setImages] = useState<UploadFileType[]>([]);
  const [images2, setImages2] = useState<UploadFileType[]>([]);

  console.log("valueFormStep1", valueFormStep1);

  useImperativeHandle(ref, () => ({
    openModal: () => modalRef.current?.showModal(),
    closeModal: () => modalRef.current?.close(),
  }));

  const handleImageChange = (newImages: UploadFileType) => {
    setImages([newImages]);
  };

  const handleDeleteImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleImageChange2 = (newImages: UploadFileType) => {
    if (images2.length < 4) {
      setImages2([...images2, ...[newImages]]);
    }
  };

  const handleDeleteImage2 = (index: number) => {
    setImages2(images2.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    try {
      const imageList = [...images, ...images2].map((item, index) => {
        return {
          ref_vehicle_img_side_code: index + 1,
          vehicle_img_file: item.file_url,
        };
      });

      const returned_vehicle_datetime =
        valueFormStep1?.selectedDate && valueFormStep1?.selectedTime
          ? convertToISO(
              convertToBuddhistDateTime(valueFormStep1?.selectedDate).date,
              convertToBuddhistDateTime(valueFormStep1?.selectedTime).time
            )
          : "";

      const formData = {
        fuel_end: valueFormStep1?.fuelQuantity,
        mile_end: Number(valueFormStep1?.miles || "0"),
        returned_cleanliness_level: valueFormStep1?.cleanType ? Number(valueFormStep1?.cleanType) : 0,
        returned_vehicle_datetime: returned_vehicle_datetime,
        returned_vehicle_emp_id: requestData?.returned_vehicle_emp_id,
        returned_vehicle_remark: valueFormStep1?.remark,
        trn_request_uid: requestData?.trn_request_uid,
        vehicle_images: imageList,
      };
      console.log("formData", formData);
      let response;
      if (useBy === "user") {
        response = await UserReturnedVehicle(formData);
      } else {
        response = await UserReturnedVehicle(formData);
      }
      if (onSubmit) {
        onSubmit();
      } else {
        if (response.status === 200) {
          clearForm?.();
          if (useBy === "user") {
            modalRef.current?.close();
            router.push(`/vehicle-booking/request-list?returned=success&request-no=${response.data.result.request_no}`);
          } else {
            modalRef.current?.close();
          }
        }
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };
  const swipeDownHandlers = useSwipeDown(() => modalRef.current?.close());

  return (
    <>
      <dialog ref={modalRef} className={`modal modal-middle`}>
        <div className="modal-box max-w-[500px] p-0 relative overflow-hidden flex flex-col">
          <div className="modal-body overflow-y-auto text-center !bg-white">
            <form>
              <div className="form-section">
                <div className="page-section-header border-0">
                  <div className="page-header-left">
                    <div
                      className="page-title"
                      onClick={() => {
                        openStep1();
                        modalRef.current?.close();
                      }}
                    >
                      <span className="page-title-label">
                        {status === "edit" ? (
                          "แก้ไขรูปยานพาหนะก่อนเดินทาง"
                        ) : (
                          <>
                            <i className="material-symbols-outlined">keyboard_arrow_left</i> คืนยานพาหนะ
                          </>
                        )}
                      </span>
                    </div>
                    {status !== "edit" && <p className="text-left font-bold">Step 2: รูปยานพาหนะ</p>}
                  </div>
                </div>

                <div className="grid w-full flex-wrap gap-5 grid-cols-12">
                  <div className="col-span-12">
                    <div className="form-group">
                      <label className="form-label">
                        รูปหน้าปัดเรือนไมล์
                        <Tooltip title="รูปหน้าปัดเรือนไมล์" content="Upload ได้ 1 รูป" position="right">
                          <i className="material-symbols-outlined">info</i>
                        </Tooltip>
                      </label>
                      {images.length < 1 && <ImageUpload onImageChange={handleImageChange} />}
                      <div className="image-preview flex flex-wrap gap-3">
                        {images.map((image, index) => (
                          <ImagePreview key={index} image={image.file_url} onDelete={() => handleDeleteImage(index)} />
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className={`col-span-12 ${useBy !== "driver" && useBy !== "admin" ? "hidden" : "block"}`}>
                    <div className="form-group">
                      <label className="form-label">
                        รูปยานพาหนะภายในและภายนอก
                        <Tooltip title="รูปหน้าปัดเรือนไมล์" content="Upload ได้ 1 รูป" position="right">
                          <i className="material-symbols-outlined">info</i>
                        </Tooltip>
                      </label>
                      {images2.length < 4 && <ImageUpload onImageChange={handleImageChange2} />}
                      <div className="image-preview flex flex-wrap gap-3">
                        {images2.map((image, index) => (
                          <ImagePreview key={index} image={image.file_url} onDelete={() => handleDeleteImage2(index)} />
                        ))}
                      </div>
                    </div>
                  </div>
                  <div
                    className={`col-span-12 ${
                      useBy !== "driver" && useBy !== "admin" && useBy !== "user" ? "hidden" : "block"
                    }`}
                  >
                    <div className="form-group">
                      <label className="form-label">
                        รูปภายนอกยานพาหนะรอบคัน
                        <Tooltip title="รูปภายนอกยานพาหนะรอบคัน" content="Upload ได้ 4 รูป" position="right">
                          <i className="material-symbols-outlined">info</i>
                        </Tooltip>
                      </label>
                      {images2.length < 4 && <ImageUpload onImageChange={handleImageChange2} />}
                      <div className="image-preview flex flex-wrap gap-3">
                        {images2.map((image, index) => (
                          <ImagePreview key={index} image={image.file_url} onDelete={() => handleDeleteImage2(index)} />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="grid w-full flex-wrap gap-5 grid-cols-12 mt-3">
                  <div className="col-span-6">
                    <button
                      type="button"
                      className="btn btn-secondary w-full"
                      onClick={() => modalRef.current?.close()}
                    >
                      {useBy === "user" ? "ยกเลิก" : "ไม่ใช่ตอนนี้"}
                    </button>
                  </div>
                  <div className="col-span-6">
                    <button
                      type="button"
                      className="btn bg-[#A80689] hover:bg-[#A80689] border-[#A80689] text-white w-full"
                      onClick={() => {
                        handleSubmit();
                        // modalRef.current?.close();
                      }}
                      disabled={!images.length || !images2.length || images2.length < 4}
                    >
                      {useBy === "admin" ? "บันทึก" : "ยืนยัน"}
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    </>
  );
});

ReturnCarAddStep2Modal.displayName = "ReturnCarAddStep2Modal";

export default ReturnCarAddStep2Modal;
