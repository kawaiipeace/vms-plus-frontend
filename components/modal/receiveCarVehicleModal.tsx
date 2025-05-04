import { RequestDetailType } from "@/app/types/request-detail-type";
import { UploadFileType } from "@/app/types/upload-type";
import { VehicleUserTravelCardType } from "@/app/types/vehicle-user-type";
import DatePicker, { DatePickerRef } from "@/components/datePicker";
import ImagePreview from "@/components/imagePreview";
import ImageUpload from "@/components/imageUpload";
import ExampleCarImageModal from "@/components/modal/exampleCarImageModal";
import ReceiveCarSuccessModal from "@/components/modal/receiveCarSuccessModal";
import Tooltip from "@/components/tooltips";
import { adminReceivedVehicle } from "@/services/adminService";
import {
  fetchUserTravelCard,
  userReceivedVehicle,
} from "@/services/receivedVehicleUser";
import { convertToISO } from "@/utils/convertToISO";
import useSwipeDown from "@/utils/swipeDown";
import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import TimePicker from "../timePicker";
import {
  driverReceivedVehicle,
  driverUpdateReceivedVehicle,
  fetchDriverTravelCard,
} from "@/services/vehicleInUseDriver";
import { convertToBuddhistDateTime } from "@/utils/converToBuddhistDateTime";

interface ReceiveCarVehicleModalProps {
  status?: string;
  requestData?: RequestDetailType;
  role?: string;
  onSubmit?: () => void;
}

const ReceiveCarVehicleModal = forwardRef<
  { openModal: () => void; closeModal: () => void },
  ReceiveCarVehicleModalProps
>(({ status, requestData, role, onSubmit }, ref) => {
  const modalRef = useRef<HTMLDialogElement>(null);
  const datePickerRef = useRef<DatePickerRef>(null);
  const fuelQuantityRef = useRef<HTMLInputElement>(null);

  const [miles, setMiles] = useState<number>(0);
  const [remark, setRemark] = useState<string>("");
  const [images, setImages] = useState<UploadFileType[]>([]);
  const [images2, setImages2] = useState<UploadFileType[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [fuelQuantity, setFuelQuantity] = useState(0);
  const [imageEx, setImageEx] = useState<UploadFileType[]>();

  const [travelCardData, setTravelCardData] =
    useState<VehicleUserTravelCardType>();

    useEffect(() => {
      if (requestData) {
        setFuelQuantity(requestData?.fuel_start || 0);
        setMiles(requestData?.mile_start || 0);
        setRemark(requestData?.received_vehicle_remark || "");
  
        // Set default date and time
        if (requestData?.pickup_datetime && requestData.pickup_datetime !== "0001-01-01T00:00:00Z") {
          const { date, time } = convertToBuddhistDateTime(requestData.pickup_datetime);
          setSelectedDate(date);
          setSelectedTime(time);
        } else {
          // Set current date/time as default
          const now = new Date();
          const { date, time } = convertToBuddhistDateTime(now.toISOString());
          setSelectedDate(date);
          setSelectedTime(time);
        }
      }
    }, [requestData]);
    
  useImperativeHandle(ref, () => ({
    openModal: () => {
      // clearForm(); ลบออกเพราะข้อมูลไม่ขึ้น

      modalRef.current?.showModal();
    },
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

  const onSubmitForm = async () => {
    try {
      const imageList = [...images, ...images2].map((item, index) => {
        return {
          ref_vehicle_img_side_code: index + 1,
          vehicle_img_file: item.file_url,
        };
      });
      const pickup = convertToISO(selectedDate, selectedTime);

      const formData = {
        received_vehicle_remark: remark,
        fuel_start: fuelQuantity,
        mile_start: miles,
        pickup_datetime: pickup,
        trn_request_uid: requestData?.trn_request_uid,
        vehicle_images: imageList,
      };
      let response;
      if (role === "admin") {
        response = await adminReceivedVehicle(formData);
      } else if (role === "user") {
        response = await userReceivedVehicle(formData);
      } else {
        if (status === "edit") {
          response = await driverUpdateReceivedVehicle(formData);
        } else {
          response = await driverReceivedVehicle(formData);
        }
      }
      if (onSubmit) {
        onSubmit();
      } else {
        if (response.status === 200) {
          let response;
          if (role === "driver") {
            response = await fetchDriverTravelCard(
              requestData?.trn_request_uid || ""
            );
          } else {
            response = await fetchUserTravelCard(
              requestData?.trn_request_uid || ""
            );
          }
          setTravelCardData(response?.data);
          clearForm();

          receiveCarSuccessModalRef.current?.openModal();
          modalRef.current?.close();
        }
      }
    } catch (error) {
      console.error("Error submitting form data:", error);
    }
  };

  const clearForm = () => {
    datePickerRef.current?.reset();
    if (fuelQuantityRef.current) {
      fuelQuantityRef.current.value = "0";
    }
    setMiles(0);
    setRemark("");
    setImages([]);
    setImages2([]);
    setSelectedDate("");
    setSelectedTime("");
    setFuelQuantity(0);
    setImageEx(undefined);
  };
  const swipeDownHandlers = useSwipeDown(() => modalRef.current?.close());

  return (
    <>
      <dialog ref={modalRef} className={`modal modal-middle`}>
        <div
          className="modal-box max-w-[500px] p-0 relative overflow-hidden flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="bottom-sheet" {...swipeDownHandlers}>
            <div className="bottom-sheet-icon"></div>
          </div>
          <div className="modal-header bg-white sticky top-0 flex justify-between z-10">
            <div className="modal-title">
              {" "}
              {status === "edit" ? "แก้ไขข้อมูลการรับยานพาหนะ" : "รับยานพาหนะ"}
            </div>
            <form method="dialog">
              <button className="close btn btn-icon border-none bg-transparent shadow-none btn-tertiary">
                <i className="material-symbols-outlined">close</i>
              </button>
            </form>
          </div>

          <div className="modal-body overflow-y-auto text-center !bg-white">
            <form>
              <div className="form-section">
                <div className="grid w-full flex-wrap gap-5 grid-cols-12 pb-2">
                  {/* Date picker */}
                  <div className="col-span-6">
                    <div className="form-group">
                      <label className="form-label">วันที่</label>
                      <div className="input-group">
                        <div className="input-group-prepend">
                          <span className="input-group-text">
                            <i className="material-symbols-outlined">
                              calendar_month
                            </i>
                          </span>
                        </div>
                        <DatePicker
                          placeholder={"ระบุวันที่"}
                          defaultValue={selectedDate}
                          onChange={(date) => setSelectedDate(date)}
                          ref={datePickerRef}
                        />
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
                            <i className="material-symbols-outlined">
                              schedule
                            </i>
                          </span>
                        </div>
                        <TimePicker
                          placeholder="ระบุเวลา"
                          onChange={(time) => setSelectedTime(time)}
                          defaultValue={selectedTime}
                        />
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
                            setMiles(Number(e.target.value));
                          }}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="col-span-12">
                    <div className="form-group">
                      <label className="form-label flex justify-between items-center">
                        <span>ปริมาณเชื้อเพลิง</span>
                        <span>{fuelQuantity}%</span>
                      </label>
                      <input
                        ref={fuelQuantityRef}
                        // defaultValue={fuelQuantity}
                        type="range"
                        min={0}
                        max={100}
                        value={fuelQuantity}
                        className="range"
                        step={1}
                        onChange={(e) =>
                          setFuelQuantity(Number(e.target.value))
                        }
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
                          return (
                            <span key={index}>
                              {index === 0 ? "E" : index === 8 ? "F" : ""}
                            </span>
                          );
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
                            <Tooltip
                              title="รูปหน้าปัดเรือนไมล์"
                              content="Upload ได้ 1 รูป"
                              position="right"
                            >
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
                          {images.length < 1 && (
                            <ImageUpload onImageChange={handleImageChange} />
                          )}
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
                            รูปยานพาหนะภายในและภายนอก
                            <span className="font-light">(ถ้ามี)</span>
                            <Tooltip
                              title="รูปหน้าปัดเรือนไมล์"
                              content="Upload ได้ 4 รูป"
                              position="right"
                            >
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
                          {images2.length < 4 && (
                            <ImageUpload onImageChange={handleImageChange2} />
                          )}
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
                          defaultValue={remark}
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
              </div>
            </form>
          </div>
          <div className="flex w-full gap-5 py-3 modal-action mt-0">
            <div className="flex-1">
              <button
                type="button"
                className="btn btn-secondary !w-full"
                onClick={() => {
                  clearForm();
                  modalRef.current?.close();
                }}
              >
                ปิด
              </button>
            </div>
            <div className="flex-1">
              <button
                type="submit"
                className="btn bg-[#A80689] hover:bg-[#A80689] border-[#A80689] text-white !w-full"
                onClick={onSubmitForm}
              >
                บันทึก
              </button>
            </div>
          </div>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
      <ReceiveCarSuccessModal
        ref={receiveCarSuccessModalRef}
        requestData={travelCardData}
        role="admin"
      />
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
