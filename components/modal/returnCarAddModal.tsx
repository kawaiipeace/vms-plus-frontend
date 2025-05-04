"use client";
import { RequestDetailType } from "@/app/types/request-detail-type";
import DatePicker, { DatePickerRef } from "@/components/datePicker";
import ReturnCarAddStep2Modal from "@/components/modal/returnCarAddStep2Modal";
import RadioButton from "@/components/radioButton";
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
import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import TimePicker from "../timePicker";

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

const ReturnCarAddModal = forwardRef<
  { openModal: () => void; closeModal: () => void },
  ReturnCarAddModalProps
>(({ useBy, id, requestData, edit, progress }, ref) => {
  // Destructure `process` from props
  const router = useRouter();
  const pathName = usePathname();
  const modalRef = useRef<HTMLDialogElement>(null);
  const datePickerRef = useRef<DatePickerRef>(null);
  const fuelQuantityRef = useRef<HTMLInputElement>(null);

  const [cleanType, setCleanType] = useState<string>("");
  const [miles, setMiles] = useState<string>("");
  const [remark, setRemark] = useState<string>("");
  const [parkingLocation, setParkingLocation] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [fuelQuantity, setFuelQuantity] = useState<number>(0);

  const [valueFormStep1, setValueFormStep1] = useState<ValueFormStep1>();

  useImperativeHandle(ref, () => ({
    openModal: () => modalRef.current?.showModal(),
    closeModal: () => modalRef.current?.close(),
  }));

  const defaultData = useCallback(
    (data: RequestDetailType) => {
      datePickerRef.current?.setValue(data?.end_datetime || "");
      setSelectedDate(data?.end_datetime || "");
      setSelectedTime(data?.end_datetime || "");
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

  useEffect(() => {
    if (requestData) {
      console.log("requestData", requestData);

      defaultData(requestData);
    }
  }, [defaultData, requestData, edit]);

  const returnCarAddStep2ModalRef = useRef<{
    openModal: () => void;
    closeModal: () => void;
  } | null>(null);
  const swipeDownHandlers = useSwipeDown(() => modalRef.current?.close());

  const nextStep = () => {
    if (
      selectedDate &&
      selectedTime &&
      cleanType &&
      parkingLocation &&
      fuelQuantity &&
      miles
    ) {
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

  const handleSubmit = async () => {
    try {
      const imageList = requestData?.vehicle_images_returned;

      const returned_vehicle_datetime =
        selectedDate && selectedTime
          ? convertToISO(
              convertToBuddhistDateTime(selectedDate).date,
              convertToBuddhistDateTime(selectedTime).time
            )
          : "";

      const formData = {
        fuel_end: fuelQuantity,
        mile_end: Number(miles || "0"),
        returned_cleanliness_level: cleanType ? Number(cleanType) : 0,
        returned_vehicle_datetime: returned_vehicle_datetime,
        returned_vehicle_emp_id: requestData?.returned_vehicle_emp_id,
        returned_vehicle_remark: remark,
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
            <div className="modal-title">
              {edit ? "แก้ไขข้อมูลการคืนยานพาหนะ" : "คืนยานพาหนะ"}
            </div>

            <form method="dialog">
              <button
                className="close btn btn-icon border-none bg-transparent shadow-none btn-tertiary"
                onClick={() => modalRef.current?.close()}
              >
                <i className="material-symbols-outlined">close</i>
              </button>
            </form>
          </div>
          <div className="modal-body overflow-y-auto text-center !bg-white h-[70vh]">
            {!edit && (
              <p className="text-left text-base mb-2 font-semibold">
                Step 1: ข้อมูลทั่วไป
              </p>
            )}

            <div className="form-section">
              <div className="grid w-full flex-wrap gap-5 grid-cols-12">
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
                          <i className="material-symbols-outlined">schedule</i>
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
                    <label className="form-label">สถานที่จอดรถ</label>
                    <div className="input-group">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="ระบุสถานที่จอดรถ"
                        value={parkingLocation}
                        onChange={(e) => {
                          setParkingLocation(e.target.value);
                        }}
                      />
                    </div>
                  </div>
                </div>
                <div className="col-span-12">
                  <div className="form-group">
                    <label className="form-label">เลขไมล์สิ้นสุดเดินทาง</label>
                    <div className="input-group">
                      <input
                        type="number"
                        className="form-control"
                        placeholder="ระบุเลขไมล์สิ้นสุดเดินทาง"
                        value={miles}
                        onChange={(e) => setMiles(e.target.value)}
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
                      type="range"
                      min={0}
                      max={100}
                      value={fuelQuantity}
                      className="range"
                      step={1}
                      onChange={(e) => setFuelQuantity(Number(e.target.value))}
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
                    <div className="flex w-full justify-start text-xs text-[#475467]">
                      ควรเติมเชื้อเพลิงให้เต็มก่อนคืน
                    </div>
                  </div>
                </div>
                <div className="col-span-12">
                  <div className="form-group">
                    <label className="form-label">ความสะอาด</label>

                    {dataClean.map((item, index) => {
                      return (
                        <RadioButton
                          key={index}
                          name="travelType"
                          label={item.name}
                          value={item.id}
                          selectedValue={cleanType}
                          setSelectedValue={setCleanType}
                        />
                      );
                    })}
                    {/* <RadioButton
                        name="travelType"
                        label="ล้างรถและดูดฝุ่น"
                        value="0"
                        selectedValue={cleanType}
                        setSelectedValue={setCleanType}
                      />

                      <RadioButton
                        name="travelType"
                        label="ล้างภายนอก"
                        value="1"
                        selectedValue={cleanType}
                        setSelectedValue={setCleanType}
                      />

                      <RadioButton
                        name="travelType"
                        label="ไม่ได้ดำเนินการ"
                        value="2"
                        selectedValue={cleanType}
                        setSelectedValue={setCleanType}
                      /> */}
                  </div>
                </div>
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
                        value={remark}
                        onChange={(e) => setRemark(e.target.value)}
                      />
                    </div>
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
});

ReturnCarAddModal.displayName = "ReturnCarAddModal";

export default ReturnCarAddModal;
