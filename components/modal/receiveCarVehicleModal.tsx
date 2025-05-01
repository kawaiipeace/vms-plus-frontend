import { RequestDetailType } from "@/app/types/request-detail-type";
import { UploadFileType } from "@/app/types/upload-type";
import { VehicleUserTravelCardType } from "@/app/types/vehicle-user-type";
import DatePicker from "@/components/datePicker";
import ImagePreview from "@/components/imagePreview";
import ImageUpload from "@/components/imageUpload";
import ExampleCarImageModal from "@/components/modal/exampleCarImageModal";
import ReceiveCarSuccessModal from "@/components/modal/receiveCarSuccessModal";
import Tooltip from "@/components/tooltips";
import { fetchUserTravelCard, userReceivedVehicle } from "@/services/receiVedehicleUser";
import { convertToISO } from "@/utils/convertToISO";
import useSwipeDown from "@/utils/swipeDown";
import { forwardRef, useImperativeHandle, useRef, useState } from "react";
import TimePicker from "../timePicker";
interface ReceiveCarVehicleModalProps {
  status?: string;
  requestData?: RequestDetailType;
}

const ReceiveCarVehicleModal = forwardRef<
  { openModal: () => void; closeModal: () => void },
  ReceiveCarVehicleModalProps
>(({ status, requestData }, ref) => {
  // Destructure `process` from props
  const modalRef = useRef<HTMLDialogElement>(null);

  const [miles, setMiles] = useState<string>("");
  const [remark, setRemark] = useState<string>("");
  const [images, setImages] = useState<UploadFileType[]>([]);
  const [images2, setImages2] = useState<UploadFileType[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [passengerCount, setPassengerCount] = useState(0);
  const [imageEx, setImageEx] = useState<UploadFileType[]>();

  const [travelCardData, setTravelCardData] = useState<VehicleUserTravelCardType>();

  useImperativeHandle(ref, () => ({
    openModal: () => modalRef.current?.showModal(),
    closeModal: () => modalRef.current?.close(),
  }));

  const receiveCarSuccessModalRef = useRef<{
    openModal: () => void;
    closeModal: () => void;
  } | null>(null);

  const exampleCarImageModalRef = useRef<{
    openModal: () => void;
    closeModal: () => void;
  } | null>(null);

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

  const onSubmit = async () => {
    console.log("Selected Date:", selectedDate);
    console.log("Selected Time:", selectedTime);
    console.log("Selected Images:", images);
    console.log("Selected Images2:", images2);
    console.log("passengerCount", passengerCount);

    if (selectedDate && selectedTime && images.length > 0 && passengerCount !== undefined && miles !== undefined) {
      try {
        const imageList = [...images, ...images2].map((item, index) => {
          return {
            ref_vehicle_img_side_code: index + 1,
            vehicle_img_file: item.file_url,
          };
        });
        const pickup = convertToISO(selectedDate, selectedTime);

        const formData = {
          comment_on_received_vehicle: remark,
          fuel_start: passengerCount,
          mile_start: Number(miles),
          pickup_datetime: pickup,
          trn_request_uid: requestData?.trn_request_uid,
          vehicle_images: imageList,
        };
        const response = await userReceivedVehicle(formData);

        if (response.status === 200) {
          const response = await fetchUserTravelCard(requestData?.trn_request_uid || "");
          console.log("data---", response.data);
          setTravelCardData(response.data);

          console.log("Form data submitted successfully:", response.data);
          receiveCarSuccessModalRef.current?.openModal();
          modalRef.current?.close();
        }
      } catch (error) {
        console.error("Error submitting form data:", error);
      }
    }
  };
  const swipeDownHandlers = useSwipeDown(() => modalRef.current?.close());

  return (
    <>
      <dialog ref={modalRef} className={`modal modal-middle`}>
        <div className="modal-box max-w-[500px] p-0 relative overflow-hidden flex flex-col">
          <div className="bottom-sheet" {...swipeDownHandlers}>
            <div className="bottom-sheet-icon"></div>
          </div>

          <div className="modal-body overflow-y-auto text-center !bg-white">
            <form>
              <div className="form-section">
                {/* <div className="page-section-header border-0">
                  <div className="page-header-left">
                    <div className="page-title">
                      <span className="page-title-label"> */}
                <div className="page-section-header pt-6 pb-2 text-xl font-semibold">
                  {status === "edit" ? "แก้ไขข้อมูลการรับยานพาหนะ" : "รับยานพาหนะ"}
                </div>
                {/* </span>
                    </div>
                  </div>
                </div> */}

                <div className="grid w-full flex-wrap gap-5 grid-cols-12 pb-2">
                  {/* Date picker */}
                  <div className="col-span-6">
                    <div className="form-group">
                      <label className="form-label">วันที่</label>
                      <div className="input-group">
                        <div className="input-group-prepend">
                          <span className="input-group-text">
                            <i className="material-symbols-outlined">calendar_month</i>
                          </span>
                        </div>
                        <DatePicker placeholder={"ระบุวันที่"} onChange={(date) => setSelectedDate(date)} />
                      </div>
                    </div>
                  </div>

                  {/* Time picker */}
                  <div className="col-span-6">
                    <div className="form-group">
                      <label className="form-label">เวลา</label>
                      <div className="input-group">
                        <div className="input-group-prepend">
                          <span className="input-group-text">
                            <i className="material-symbols-outlined">schedule</i>
                          </span>
                        </div>
                        <TimePicker placeholder="ระบุเวลา" onChange={(time) => setSelectedTime(time)} />
                      </div>
                    </div>
                  </div>
                  <div className="col-span-12">
                    <div className="form-group">
                      <label className="form-label">เลขไมล์ก่อนเดินทาง</label>
                      <div className="input-group">
                        <input
                          type="number"
                          className="form-control"
                          placeholder="ระบุเลขไมล์ก่อนเดินทาง"
                          value={miles}
                          onChange={(e) => {
                            setMiles(e.target.value);
                          }}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="col-span-12">
                    <div className="form-group">
                      <label className="form-label flex justify-between items-center">
                        <span>ปริมาณเชื้อเพลิง</span>
                        <span>{passengerCount}%</span>
                      </label>
                      <input
                        defaultValue={passengerCount}
                        type="range"
                        min={0}
                        max={100}
                        // value={passengerCount}
                        className="range"
                        step={passengerCount}
                        onChange={(e) => setPassengerCount(Number(e.target.value))}
                      />
                      <div className="flex w-full justify-between px-2 text-xs">
                        {Array.from({ length: 9 }, (_, index) => {
                          const isMod = (index + 1) % 2 === 0;
                          return (
                            <span
                              key={index}
                              className={
                                isMod
                                  ? "border-[] border-[#EAECF0] bg-[#EAECF0] rounded-full text-[#EAECF0]"
                                  : "border-[] border-[#D0D5DD] bg-[#D0D5DD] rounded-full text-[#D0D5DD]"
                              }
                            >
                              |
                            </span>
                          );
                        })}
                      </div>
                      <div className="flex w-full justify-between px-2 text-[#475467] font-semibold ">
                        {Array.from({ length: 9 }, (_, index) => {
                          return <span key={index}>{index === 0 ? "E" : index === 8 ? "F" : ""}</span>;
                        })}
                      </div>
                    </div>
                  </div>

                  {status !== "edit" && (
                    <>
                      <div className="col-span-12">
                        <div className="form-group">
                          <label className="form-label">
                            รูปหน้าปัดเรือนไมล์
                            <Tooltip title="รูปหน้าปัดเรือนไมล์" content="Upload ได้ 1 รูป" position="right">
                              <i
                                className="material-symbols-outlined"
                                onClick={() => {
                                  exampleCarImageModalRef.current?.openModal();
                                  modalRef.current?.close();
                                  setImageEx(images);
                                }}
                              >
                                info
                              </i>
                            </Tooltip>
                          </label>
                          {images.length < 1 && <ImageUpload onImageChange={handleImageChange} />}
                          <div className="image-preview flex flex-wrap gap-3">
                            {images.map((image, index) => (
                              <ImagePreview
                                key={index}
                                image={image.file_url}
                                onDelete={() => handleDeleteImage(index)}
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                      <div className="col-span-12">
                        <div className="form-group">
                          <label className="form-label">
                            รูปยานพาหนะภายในและภายนอก<span className="font-light">(ถ้ามี)</span>
                            <Tooltip title="รูปหน้าปัดเรือนไมล์" content="Upload ได้ 4 รูป" position="right">
                              <i
                                className="material-symbols-outlined"
                                onClick={() => {
                                  exampleCarImageModalRef.current?.openModal();
                                  modalRef.current?.close();
                                  setImageEx(images2);
                                }}
                              >
                                info
                              </i>
                            </Tooltip>
                          </label>
                          {images2.length < 4 && <ImageUpload onImageChange={handleImageChange2} />}
                          <div className="image-preview flex flex-wrap gap-3">
                            {images2.map((image, index) => (
                              <ImagePreview
                                key={index}
                                image={image.file_url}
                                onDelete={() => handleDeleteImage2(index)}
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                  <div className="col-span-12">
                    <div className="form-group">
                      <label className="form-label">
                        หมายเหตุ<span className="font-light">(ถ้ามี)</span>
                      </label>
                      <div className="input-group">
                        <input
                          type="text"
                          className="form-control"
                          placeholder="ระบุหมายเหตุ"
                          onChange={(e) => {
                            setRemark(e.target.value);
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="grid w-full flex-wrap gap-5 grid-cols-12 py-3">
                  <div className="col-span-6">
                    <button type="button" className="btn btn-secondary w-full" onClick={() => modalRef.current?.close()}>
                      ไม่ใช่ตอนนี้
                    </button>
                  </div>
                  <div className="col-span-6">
                    <button
                      type="button"
                      className="btn bg-[#A80689] hover:bg-[#A80689] border-[#A80689] text-white w-full"
                      onClick={onSubmit}
                    >
                      ยืนยัน
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
      <ReceiveCarSuccessModal ref={receiveCarSuccessModalRef} requestData={travelCardData} />
      <ExampleCarImageModal
        backModal={() => modalRef.current?.showModal()}
        ref={exampleCarImageModalRef}
        imageEx={imageEx || []}
      />
    </>
  );
});

ReceiveCarVehicleModal.displayName = "ReceiveCarVehicleModal";

export default ReceiveCarVehicleModal;
