"use client";
import { RequestDetailType } from "@/app/types/request-detail-type";
import DatePicker, { DatePickerRef } from "@/components/datePicker";
import ReturnCarAddStep2Modal from "@/components/modal/returnCarAddStep2Modal";
import RadioButton from "@/components/radioButton";
import { AdminReturnedVehicle } from "@/services/adminService";
import { fetchRequestKeyDetail } from "@/services/masterService";
import { DriverReturnedVehicle, updateReceiveVehicleImages } from "@/services/vehicleInUseDriver";
import { UserReturnedVehicle } from "@/services/vehicleInUseUser";
import { convertToBuddhistDateTime } from "@/utils/converToBuddhistDateTime";
import { convertToISO } from "@/utils/convertToISO";
import useSwipeDown from "@/utils/swipeDown";
import { usePathname, useRouter } from "next/navigation";
import { forwardRef, useCallback, useEffect, useImperativeHandle, useMemo, useRef, useState } from "react";
import TimePicker from "../timePicker";
import ImageUpload from "../imageUpload";
import { UploadFileType } from "@/app/types/upload-type";
import ImagePreview from "../imagePreview";
import CustomSelect from "../customSelect";
import dayjs from "dayjs";

interface ReturnCarAddModalProps {
  useBy?: string;
  id?: string;
  requestData?: RequestDetailType;
  edit?: boolean;
  progress?: string;
}

export interface ValueFormStep1 {
  selectedDate: string;
  selectedTime: string;
  cleanType: string;
  parkingLocation: string;
  fuelQuantity: number;
  miles: string;
  remark?: string;
}

export const dataClean = [
  { id: "0", name: "ล้างรถและดูดฝุ่น" },
  { id: "1", name: "ล้างภายนอก" },
  { id: "2", name: "ไม่ได้ดำเนินการ" },
];

const RequestDrivingStepOneModal = forwardRef<{ openModal: () => void; closeModal: () => void }, ReturnCarAddModalProps>(
  ({ useBy, id, requestData, edit, progress }, ref) => {
    // Destructure `process` from props
    const router = useRouter();
    const pathName = usePathname();
    const modalRef = useRef<HTMLDialogElement>(null);
    const datePickerRef = useRef<DatePickerRef>(null);
    const fuelQuantityRef = useRef<HTMLInputElement>(null);
    const [costTypeOptions, setCostTypeOptions] = useState<{ value: string; label: string }[]>([]);

    const [cleanType, setCleanType] = useState<string>("");
    const [miles, setMiles] = useState<string>("");
    const [remark, setRemark] = useState<string>("");
    const [parkingLocation, setParkingLocation] = useState<string>("");
    const [selectedDate, setSelectedDate] = useState<string>("");
    const [selectedTime, setSelectedTime] = useState<string>("");
    const [fuelQuantity, setFuelQuantity] = useState<number>(0);
    const [images, setImages] = useState<UploadFileType[]>([]);
    const [valueFormStep1, setValueFormStep1] = useState<ValueFormStep1>();
    const [requestGetData, setRequestData] = useState<RequestDetailType>();
    const [selectedCostTypeOption, setSelectedCostTypeOption] = useState<{
      value: string;
      label: string;
    } | null>(null);
      const handleImageChange = (newImages: UploadFileType) => {
        setImages([newImages]);
      };

    useImperativeHandle(ref, () => ({
      openModal: () => modalRef.current?.showModal(),
      closeModal: () => modalRef.current?.close(),
    }));
    

    const fetchRequestDetailfunc = useCallback(async () => {
      try {
        // Ensure parsedData is an object before accessing vehicleSelect
        const response = await fetchRequestKeyDetail(id || "");
        console.log("data---", response.data);
        setRequestData(response.data);
      } catch (error) {
        console.error("Error fetching vehicle details:", error);
      }
    }, [id]);

    useEffect(() => {
      if (id) {
        fetchRequestDetailfunc();
      }
    }, [fetchRequestDetailfunc, id]);

    const defaultData = useCallback(
      (data: RequestDetailType) => {
        // datePickerRef.current?.setValue(data?.end_datetime || "");
        const { date, time } = convertToBuddhistDateTime(data?.end_datetime || "");
        setSelectedDate(date);
        setSelectedTime(time);
        setCleanType(data?.returned_cleanliness_level?.toLocaleString() || "");
        setFuelQuantity(data?.fuel_start || 0);
        if (edit) {
          setFuelQuantity(data?.fuel_end || 0);
          setParkingLocation(data?.parking_place || "");
          setMiles(data?.mile_end?.toString() || "");
          setRemark(data?.returned_vehicle_remark || "");
        }
      },
      [edit]
    );

    const data = useMemo(() => (requestData ? requestData : requestGetData), [requestData, requestGetData]);

    const handleDeleteImage = (index: number) => {
      setImages(images.filter((_, i) => i !== index));
    };
  

    useEffect(() => {
      if (data) {
        defaultData(data);
      }
    }, [defaultData, requestData, edit, data]);

    const returnCarAddStep2ModalRef = useRef<{
      openModal: () => void;
      closeModal: () => void;
    } | null>(null);
    const swipeDownHandlers = useSwipeDown(() => modalRef.current?.close());

    const nextStep = () => {
      if (selectedDate && selectedTime && cleanType && parkingLocation && fuelQuantity && miles) {
        if (edit) {
          console.log("edit");

          return handleSubmit();
        }
        setValueFormStep1({
          selectedDate,
          selectedTime,
          cleanType,
          parkingLocation,
          fuelQuantity,
          miles,
          remark,
        });
        returnCarAddStep2ModalRef.current?.openModal();
        modalRef.current?.close();
      }
    };

    const handleCostTypeChange = (option: any) => {
      setSelectedCostTypeOption(option);
    };

    const handleSubmit = async () => {
      try {
        const imageList = data?.vehicle_images_returned;
        console.log("selectedDate", selectedDate);
        console.log("selectedTime", selectedTime);

        const returned_vehicle_datetime = selectedDate && selectedTime ? convertToISO(selectedDate, selectedTime) : "";

        const formData = {
          fuel_end: fuelQuantity,
          mile_end: Number(miles || "0"),
          returned_cleanliness_level: cleanType ? Number(cleanType) : 0,
          returned_vehicle_datetime: returned_vehicle_datetime,
          returned_vehicle_emp_id: data?.returned_vehicle_emp_id,
          returned_vehicle_remark: remark,
          trn_request_uid: data?.trn_request_uid,
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

        if (response.status === 200) {
          clearForm?.();
          if (useBy === "user") {
            modalRef.current?.close();
            router.push(`/vehicle-booking/request-list?returned=success&request-no=${response.data.result.request_no}`);
          } else if (useBy === "admin") {
            modalRef.current?.close();
            router.push(
              `/administrator/request-list?activeTab=ตรวจสอบยานพาหนะ&returned=success&request-no=${response.data.result.request_no}`
            );
          }
          if (useBy === "userTabs") {
            modalRef.current?.close();
            router.push(
              `${pathName}?activeTab=การคืนยานพาหนะ&edit-data-returned-tabs=success&request-no=${response.data.result.request_no}`
            );
          }
          if (useBy === "driver") {
            modalRef.current?.close();
            router.push(
              `${pathName}?progressType=${progress}&returned=success&request-no=${response.data.result.request_no}`
            );
          }
        }
      } catch (error) {
        console.error("Error submitting form:", error);
      }
    }; // Properly closed handleSubmit function

    const clearForm = () => {
      setSelectedDate("");
      setSelectedTime("");
      setCleanType("");
      setParkingLocation("");
      setFuelQuantity(0);
      setMiles("");
      setRemark("");
      datePickerRef.current?.setValue("");
      if (fuelQuantityRef.current) {
        fuelQuantityRef.current.value = "0";
      }
    };

    return (
      <>
        <dialog ref={modalRef} className={`modal modal-middle`}>
          <div className="modal-box max-w-[500px] p-0 relative overflow-hidden flex flex-col">
            {/* <form> */}
            <div className="bottom-sheet" {...swipeDownHandlers}>
              <div className="bottom-sheet-icon"></div>
            </div>
            <div className="modal-header bg-white sticky top-0 flex justify-between z-10">
              <div className="modal-title">ขออนุมัติทำหน้าที่ขับรถยนต์ประจำปี</div>

              <form method="dialog">
                <button
                  className="close btn btn-icon border-none bg-transparent shadow-none btn-tertiary"
                  onClick={() => modalRef.current?.close()}
                >
                  <i className="material-symbols-outlined">close</i>
                </button>
              </form>
            </div>
            <div className="modal-body overflow-y-auto text-center !bg-white">
              {!edit && <p className="text-left text-base mb-2 font-semibold">Step 1: ข้อมูลทั่วไป</p>}

              <div className="form-section">
                <div className="grid w-full flex-wrap gap-5 grid-cols-12">

                       <div className="col-span-12">
                                    <div className="form-group text-left">
                                      <label className="form-label">ประเภทการขับขี่</label>
                                      <CustomSelect
                                        w="w-full"
                                        options={costTypeOptions}
                                        value={selectedCostTypeOption}
                                        onChange={handleCostTypeChange}
                                      />
                                    </div>
                                  </div>
                  
        
                <div className="col-span-12">
                    <div className="form-group">
                      <label className="form-label">ประจำปี</label>

                        <div className="w-full flex gap-5">
                        <RadioButton
                        name="travelType"
                        label={`${ dayjs().year()+543}`}
                        value={`${dayjs().year()+543}`}
                        selectedValue={cleanType}
                        setSelectedValue={setCleanType}
                      />

                      <RadioButton
                        name="travelType"
                        label={`${dayjs().year()+544}`}
                        value={`${dayjs().year()+544}`}
                        selectedValue={cleanType}
                        setSelectedValue={setCleanType}
                      />
                        </div>
                  

                    </div>
                  </div>
                  <div className="col-span-6">
                    <div className="form-group">
                      <label className="form-label">เลขที่ใบขับขี่</label>
                      <div className="input-group">
                        <input
                          type="text"
                          className="form-control"
                          placeholder="ระบุเลขที่ใบขับขี่"
                          value={parkingLocation}
                          onChange={(e) => {
                            setParkingLocation(e.target.value);
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="col-span-6">
                    <div className="form-group">
                      <label className="form-label">วันที่สิ้นอายุ</label>
                      <div className="input-group">
                        <div className="input-group-prepend">
                          <span className="input-group-text">
                            <i className="material-symbols-outlined">calendar_month</i>
                          </span>
                        </div>
                        <DatePicker
                          placeholder={"ระบุวันที่"}
                          onChange={(date) => setSelectedDate(date)}
                          defaultValue={selectedDate}
                          // ref={datePickerRef}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="col-span-12">
                        <div className="form-group">
                          <label className="form-label">
                          รูปใบขับขี่
                          </label>
                          {images.length < 1 && (
                            <ImageUpload onImageChange={handleImageChange} />
                          )}
                        </div>
                        <div className="image-preview flex flex-wrap gap-3 !w-[50%]">
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
              </div>
            </div>
            <div className="modal-action flex w-full gap-5 mt-3 mr-auto">
              <div className="">
                <button
                  type="button"
                  className="btn btn-secondary w-full"
                  onClick={() => {
                    // clearData();
                    modalRef.current?.close();
                  }}
                >
                  {edit ? "ยกเลิก" : "ไม่ใช่ตอนนี้"}
                </button>
              </div>
              <div className="">
                <button
                  type="button"
                  className="btn bg-[#A80689] hover:bg-[#A80689] border-[#A80689] text-white w-full"
                  onClick={() => {
                    nextStep();
                  }}
                >
                  {edit ? "บันทึก" : "ต่อไป"}
                </button>
              </div>
            </div>
            {/* </form> */}
          </div>
          <form method="dialog" className="modal-backdrop">
            <button>close</button>
          </form>
        </dialog>
        <ReturnCarAddStep2Modal
          openStep1={() => modalRef.current?.showModal()}
          useBy={useBy}
          ref={returnCarAddStep2ModalRef}
          valueFormStep1={valueFormStep1}
          id={id}
          requestData={requestData}
          progress={progress}
        />
      </>
    );
  }
);

RequestDrivingStepOneModal.displayName = "RequestDrivingStepOneModal";

export default RequestDrivingStepOneModal;
