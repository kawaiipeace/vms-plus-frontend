"use client";
import { RequestDetailType } from "@/app/types/request-detail-type";
import DatePicker, { DatePickerRef } from "@/components/datePicker";
import RadioButton from "@/components/radioButton";
import { AdminUpdateReturnedVehicle } from "@/services/adminService";
import { convertToBuddhistDateTime } from "@/utils/converToBuddhistDateTime";
import { convertToISO } from "@/utils/convertToISO";
import useSwipeDown from "@/utils/swipeDown";
import { forwardRef, useCallback, useEffect, useImperativeHandle, useRef, useState } from "react";
import TimePicker from "../timePicker";

interface Props {
  requestData?: RequestDetailType;
  progress?: string;
  onSubmit?: () => void;
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

const ReturnCarInfoEditModal = forwardRef<{ openModal: () => void; closeModal: () => void }, Props>(
  ({ requestData, onSubmit }, ref) => {
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

    const [openModal, setOpenModal] = useState(false);

    useImperativeHandle(ref, () => ({
      openModal: () => {
        modalRef.current?.showModal();
        setOpenModal(true);
      },
      closeModal: () => {
        modalRef.current?.close();
        setOpenModal(false);
      },
    }));

    const handleCloseModal = () => {
      modalRef.current?.close();
      setOpenModal(false); // Update state to reflect modal is closed
    };

    const defaultData = useCallback((data: RequestDetailType) => {
      datePickerRef.current?.setValue(data?.end_datetime || "");
      setSelectedDate(data?.end_datetime || "");
      setSelectedTime(data?.end_datetime || "");
      setCleanType(data?.returned_cleanliness_level?.toLocaleString() || "");
      setFuelQuantity(data?.fuel_start || 0);
    }, []);

    useEffect(() => {
      if (requestData) {


        defaultData(requestData);
      }
    }, [defaultData, requestData]);

    const swipeDownHandlers = useSwipeDown(handleCloseModal);

    const handleSubmit = async () => {
      try {
        const returned_vehicle_datetime =
          selectedDate && selectedTime
            ? convertToISO(convertToBuddhistDateTime(selectedDate).date, convertToBuddhistDateTime(selectedTime).time)
            : "";

        const formData = {
          fuel_end: fuelQuantity,
          mile_end: Number(miles || "0"),
          returned_cleanliness_level: cleanType ? Number(cleanType) : 0,
          returned_vehicle_datetime: returned_vehicle_datetime,
          received_vehicle_remark: requestData?.returned_vehicle_emp_id,
          returned_vehicle_remark: remark,
          trn_request_uid: requestData?.trn_request_uid,
        };
     

        const response = await AdminUpdateReturnedVehicle(formData);
        if (response)
          if (onSubmit) {
            onSubmit();
          }
      } catch (error) {
        console.error("Error submitting form:", error);
      }
    }; // Properly closed handleSubmit function

    return (
      <>
        {openModal && (
          <div className={`modal modal-middle modal-open`}>
            <div className="modal-box max-w-[500px] p-0 relative overflow-hidden flex flex-col">
              <div className="bottom-sheet" {...swipeDownHandlers}>
                <div className="bottom-sheet-icon"></div>
              </div>
              <div className="modal-header bg-white sticky top-0 flex justify-between z-10">
                <div className="modal-title">แก้ไขข้อมูลการคืนยานพาหนะ</div>

                <form method="dialog">
                  <button
                    className="close btn btn-icon border-none bg-transparent shadow-none btn-tertiary"
                    onClick={handleCloseModal}
                  >
                    <i className="material-symbols-outlined">close</i>
                  </button>
                </form>
              </div>
              <div className="modal-scroll-wrapper overflow-y-auto h-[70vh]">
                <div className="modal-body text-center !bg-white h-[70vh]">
                  <div className="form-section">
                    <div className="grid w-full flex-wrap gap-5 grid-cols-12">
                      <div className="col-span-6">
                        <div className="form-group">
                          <label className="form-label">วันที่</label>
                          <div className="input-group">
                            <div className="input-group-prepend">
                              <span className="input-group-text">
                                <i className="material-symbols-outlined">calendar_month</i>
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
                              return <span key={index}>{index === 0 ? "E" : index === 8 ? "F" : ""}</span>;
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
              </div>
              <div className="modal-action flex w-full gap-5 mt-3 mr-auto">
                <div className="">
                  <button type="button" className="btn btn-secondary w-full" onClick={handleCloseModal}>
                    ยกเลิก
                  </button>
                </div>
                <div className="">
                  <button
                    type="button"
                    className="btn bg-[#A80689] hover:bg-[#A80689] border-[#A80689] text-white w-full"
                    onClick={() => {
                      handleSubmit();
                    }}
                  >
                    บันทึก
                  </button>
                </div>
              </div>
              {/* </form> */}
            </div>
            <form method="dialog" className="modal-backdrop">
              <button>close</button>
            </form>
          </div>
        )}
      </>
    );
  }
);

ReturnCarInfoEditModal.displayName = "ReturnCarInfoEditModal";

export default ReturnCarInfoEditModal;
