import { RequestDetailType } from "@/app/types/request-detail-type";
import { UploadFileType } from "@/app/types/upload-type";
import ImagePreview from "@/components/imagePreview";
import ImageUpload from "@/components/imageUpload";
import Tooltip from "@/components/tooltips";
import { AdminReturnedVehicle } from "@/services/adminService";
import {
  DriverReturnedVehicle,
  updateReceiveVehicleImages,
} from "@/services/vehicleInUseDriver";
import { UserReturnedVehicle } from "@/services/vehicleInUseUser";
import { convertToBuddhistDateTime } from "@/utils/converToBuddhistDateTime";
import { convertToISO } from "@/utils/convertToISO";
import useSwipeDown from "@/utils/swipeDown";
import { usePathname, useRouter } from "next/navigation";
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
  progress?: string;
  edit?: boolean;
}

const ReturnCarAddStep2Modal = forwardRef<
  { openModal: () => void; closeModal: () => void },
  ReturnCarAddStep2ModalProps
>(
  (
    {
      openStep1,
      status,
      useBy,
      valueFormStep1,
      id,
      requestData,
      clearForm,
      onSubmit,
      progress,
      edit,
    },
    ref
  ) => {
    const router = useRouter();
    const pathName = usePathname();
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

    const handleImageChange2 = (newImage: UploadFileType) => {
      if (images2.length < 4) {
        setImages2([...images2, ...[newImage]]);
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

        if (edit) {
          return handleEditImage();
        }

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
          returned_cleanliness_level: valueFormStep1?.cleanType
            ? Number(valueFormStep1?.cleanType)
            : 0,
          returned_vehicle_datetime: returned_vehicle_datetime,
          returned_vehicle_emp_id: requestData?.returned_vehicle_emp_id,
          returned_vehicle_remark: valueFormStep1?.remark,
          trn_request_uid: requestData?.trn_request_uid,
          vehicle_images: imageList,
        };
        console.log("formData", formData);
        let response;
        if (useBy === "user" || useBy === "userTabs") {
          response = await UserReturnedVehicle(formData);
        } else if (useBy === "admin") {
          response = await AdminReturnedVehicle(formData);
        } else {
          if (progress === "รับยานพาหนะ" || progress === "การรับยานพาหนะ") {
            response = await updateReceiveVehicleImages(formData);
          } else {
            response = await DriverReturnedVehicle(formData);
          }
        }
        if (onSubmit) {
          onSubmit();
        } else {
          if (response.status === 200) {
            clearForm?.();
            if (useBy === "user") {
              modalRef.current?.close();
              router.push(
                `/vehicle-booking/request-list?returned=success&request-no=${response.data.result.request_no}`
              );
            } else if (useBy === "admin") {
              modalRef.current?.close();
              router.push(
                `/administrator/request-list?activeTab=ตรวจสอบยานพาหนะ&returned=success&request-no=${response.data.result.request_no}`
              );
            }
            if (useBy === "userTabs") {
              modalRef.current?.close();
              router.push(
                `${pathName}?activeTab=การคืนยานพาหนะ&returned-tabs=success&request-no=${response.data.result.request_no}`
              );
            }
            if (useBy === "driver") {
              modalRef.current?.close();
              router.push(
                `${pathName}?progressType=${progress}&returned=success&request-no=${response.data.result.request_no}`
              );
            }
          }
        }
      } catch (error) {
        console.error("Error submitting form:", error);
      }
    }; // Properly closed handleSubmit function

    const handleEditImage = async () => {
      try {
        const imageList = [...images, ...images2].map((item, index) => {
          return {
            ref_vehicle_img_side_code: index + 1,
            vehicle_img_file: item.file_url,
          };
        });
        console.log("requestData", requestData);

        const formData = {
          fuel_end: requestData?.fuel_end,
          mile_end: Number(requestData?.mile_end || 0),
          returned_cleanliness_level: requestData?.returned_cleanliness_level,
          returned_vehicle_datetime: requestData?.returned_vehicle_datetime,
          returned_vehicle_emp_id: requestData?.returned_vehicle_emp_id,
          returned_vehicle_remark: requestData?.returned_vehicle_remark,
          trn_request_uid: requestData?.trn_request_uid,
          vehicle_images: imageList,
        };

        const response = await UserReturnedVehicle(formData);
        if (response.status === 200) {
          modalRef.current?.close();
          router.push(
            `${pathName}?activeTab=การคืนยานพาหนะ&edit-image-returned-tabs=success&request-no=${response.data.result.request_no}`
          );
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
            <form>
              <div className="bottom-sheet" {...swipeDownHandlers}>
                <div className="bottom-sheet-icon"></div>
              </div>
              <div className="modal-header bg-white sticky top-0 flex justify-between z-10">
                <div className="modal-title">
                  <div className="flex items-center gap-3">
                    {" "}
                    {status === "edit" || edit ? (
                      "แก้ไขรูปยานพาหนะก่อนเดินทาง"
                    ) : (
                      <div
                        onClick={openStep1}
                        className="flex items-center gap-3 cursor-pointer"
                      >
                        <i className="material-symbols-outlined">
                          keyboard_arrow_left
                        </i>{" "}
                        คืนยานพาหนะ
                      </div>
                    )}
                  </div>
                </div>

                <button
                  className="close btn btn-icon border-none bg-transparent shadow-none btn-tertiary"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    modalRef.current?.close();
                  }}
                >
                  <i className="material-symbols-outlined">close</i>
                </button>
              </div>

              <div
                className={`modal-body overflow-y-auto text-center !bg-white ${
                  useBy === "userTabs" ? "h-[55vh]" : "h-[70vh]"
                } `}
              >
                {(status !== "edit" || !edit) && (
                  <p className="text-left text-base mb-2 font-semibold">
                    Step 2: รูปยานพาหนะ
                  </p>
                )}

                <div className="form-section">
                  <div className="grid w-full flex-wrap gap-5 grid-cols-12">
                    <div className="col-span-12">
                      <div className="form-group">
                        <label className="form-label">
                          รูปหน้าปัดเรือนไมล์
                          <Tooltip
                            title="รูปหน้าปัดเรือนไมล์"
                            content="Upload ได้ 1 รูป"
                            position="right"
                          >
                            <i className="material-symbols-outlined">info</i>
                          </Tooltip>
                        </label>
                        {images.length < 1 && (
                          <ImageUpload onImageChange={handleImageChange} />
                        )}
                        <div className="image-preview flex flex-wrap gap-3 !w-[50%]">
                          {images.map((image, index) => (
                            <ImagePreview
                              key={index}
                              image={image.file_url || ""}
                              onDelete={() => handleDeleteImage(index)}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                    <div
                      className={`col-span-12 ${
                        (useBy === "driver" &&
                          progress === "คืนยานพาหนะไม่สำเร็จ") ||
                        (useBy === "driver" && progress === "การคืนยานพาหนะ") ||
                        (useBy !== "driver" && useBy === "admin") ||
                        useBy === "user" ||
                        useBy === "userTabs"
                          ? "hidden"
                          : "block"
                      }`}
                    >
                      <div className="form-group">
                        <label className="form-label">
                          รูปยานพาหนะภายในและภายนอก
                          <Tooltip
                            title="รูปหน้าปัดเรือนไมล์"
                            content="Upload ได้ 1 รูป"
                            position="right"
                          >
                            <i className="material-symbols-outlined">info</i>
                          </Tooltip>
                        </label>
                        {images2.length < 4 && (
                          <ImageUpload onImageChange={handleImageChange2} />
                        )}
                        <div className="grid grid-cols-2 gap-3 mt-3">
                          {images2.map((image, index) => (
                            <ImagePreview
                              key={index}
                              image={image.file_url || ""}
                              onDelete={() => handleDeleteImage2(index)}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                    <div
                      className={`col-span-12 ${
                        (useBy === "driver" && progress === "การรับยานพาหนะ") ||
                        (useBy !== "driver" &&
                          useBy !== "admin" &&
                          useBy !== "user" &&
                          useBy !== "userTabs")
                          ? "hidden"
                          : "block"
                      }`}
                    >
                      <div className="form-group">
                        <label className="form-label">
                          รูปภายนอกยานพาหนะรอบคัน
                          <Tooltip
                            title="รูปภายนอกยานพาหนะรอบคัน"
                            content="Upload ได้ 4 รูป"
                            position="right"
                          >
                            <i className="material-symbols-outlined">info</i>
                          </Tooltip>
                        </label>
                        {images2.length < 4 && (
                          <ImageUpload onImageChange={handleImageChange2} />
                        )}
                        <div className="grid grid-cols-2 gap-3 mt-3">
                          {images2.map((image, index) => (
                            <ImagePreview
                              key={index}
                              image={image.file_url || ""}
                              onDelete={() => handleDeleteImage2(index)}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="modal-action flex w-full flex-wrap gap-5 mt-3">
                <div className="">
                  <button
                    type="button"
                    className="btn btn-secondary w-full"
                    onClick={() => modalRef.current?.close()}
                  >
                    {useBy === "user" ? "ยกเลิก" : "ไม่ใช่ตอนนี้"}
                  </button>
                </div>
                <div className="">
                  <button
                    type="button"
                    className="btn bg-[#A80689] hover:bg-[#A80689] border-[#A80689] text-white w-full"
                    onClick={() => {
                      handleSubmit();
                    }}
                    disabled={!images.length}
                  >
                    ยืนยัน
                  </button>
                </div>
              </div>
            </form>
          </div>
          <form method="dialog" className="modal-backdrop">
            <button>close</button>
          </form>
        </dialog>
      </>
    );
  }
);

ReturnCarAddStep2Modal.displayName = "ReturnCarAddStep2Modal";

export default ReturnCarAddStep2Modal;
