import { RequestDetailType } from "@/app/types/request-detail-type";
import DatePicker, { DatePickerRef } from "@/components/datePicker";
import ReturnCarAddStep2Modal from "@/components/modal/returnCarAddStep2Modal";
import RadioButton from "@/components/radioButton";
import useSwipeDown from "@/utils/swipeDown";
import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import TimePicker from "../timePicker";

interface ReturnCarAddModalProps {
  useBy?: string;
  id?: string;
  requestData?: RequestDetailType;
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

const ReturnCarAddModal = forwardRef<{ openModal: () => void; closeModal: () => void }, ReturnCarAddModalProps>(
  ({ useBy, id, requestData }, ref) => {
    // Destructure `process` from props
    const modalRef = useRef<HTMLDialogElement>(null);
    const datePickerRef = useRef<DatePickerRef>(null);

    const [cleanType, setCleanType] = useState<string>();
    const [miles, setMiles] = useState<string>();
    const [remark, setRemark] = useState<string>();
    const [parkingLocation, setParkingLocation] = useState<string>();
    const [selectedDate, setSelectedDate] = useState<string>();
    const [selectedTime, setSelectedTime] = useState<string>();
    const [fuelQuantity, setFuelQuantity] = useState<number>(0);

    const [valueFormStep1, setValueFormStep1] = useState<ValueFormStep1>();

    useImperativeHandle(ref, () => ({
      openModal: () => modalRef.current?.showModal(),
      closeModal: () => modalRef.current?.close(),
    }));

    useEffect(() => {
      if (requestData) {
        defaultData(requestData);
      }
    }, [requestData]);

    const defaultData = (data: RequestDetailType) => {
      console.log("data", data);

      datePickerRef.current?.setValue(data?.end_datetime || "");
      setSelectedDate(data?.end_datetime || "");
      setSelectedTime(data?.end_datetime || "");
      setCleanType(data?.returned_cleanliness_level?.toString() || "");
      setFuelQuantity(data?.fuel_start || 0);
      // setParkingLocation(data?.parking_place || "");
      // setMiles(data?.mile_end?.toString() || "");
      // setRemark(data?.returned_vehicle_remark || "");
    };

    const returnCarAddStep2ModalRef = useRef<{
      openModal: () => void;
      closeModal: () => void;
    } | null>(null);
    const swipeDownHandlers = useSwipeDown(() => modalRef.current?.close());

    const nextStep = () => {
      if (selectedDate && selectedTime && cleanType && parkingLocation && fuelQuantity && miles) {
        setValueFormStep1({ selectedDate, selectedTime, cleanType, parkingLocation, fuelQuantity, miles, remark });
        returnCarAddStep2ModalRef.current?.openModal();
        modalRef.current?.close();
      }
    };

    const clearData = () => {
      setSelectedDate("");
      setSelectedTime("");
      setCleanType("");
      setParkingLocation("");
      setFuelQuantity(0);
      setMiles("");
      setRemark("");
      datePickerRef.current?.setValue("");
    };

    return (
      <>
        <dialog ref={modalRef} className={`modal modal-middle`}>
          <div className="modal-box max-w-[500px] p-0 relative overflow-hidden flex flex-col">
            <div className="modal-body overflow-y-auto text-center !bg-white">
              <form>
                <div className="form-section">
                  <div className="page-section-header border-0 pt-6">
                    <div className="page-header-left">
                      <div className="page-title">
                        <span className="page-title-label">คืนยานพาหนะ</span>
                      </div>
                      <p className="text-left font-bold">Step 1: ข้อมูลทั่วไป</p>
                    </div>
                  </div>

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
                          defaultValue={fuelQuantity}
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
                        <div className="flex flex-col gap-2">
                          <RadioButton
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
                          />
                        </div>
                      </div>
                    </div>
                    {/* <div className="col-span-12">
                      <div className="form-group">
                        <label className="form-label">ความสะอาด</label>
                        <div className="custom-group">
                          <RadioButton
                            name="travelType"
                            label="สะอาด"
                            value="สะอาด"
                            selectedValue={inCarType}
                            setSelectedValue={setInCarType}
                          />

                          <RadioButton
                            name="travelType"
                            label="ไม่สะอาด"
                            value="ไม่สะอาด"
                            selectedValue={inCarType}
                            setSelectedValue={setInCarType}
                          />
                        </div>
                      </div>
                    </div> */}
                    {/* <div className="col-span-12">
                      <div className="form-group">
                        <label className="form-label">ภายนอกยานพาหนะ</label>
                        <div className="custom-group">
                          <RadioButton
                            name="travelType"
                            label="สะอาด"
                            value="สะอาด"
                            selectedValue={outCarType}
                            setSelectedValue={setOutCarType}
                          />

                          <RadioButton
                            name="travelType"
                            label="ไม่สะอาด"
                            value="ไม่สะอาด"
                            selectedValue={outCarType}
                            setSelectedValue={setOutCarType}
                          />
                        </div>
                      </div>
                    </div> */}
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
                  <div className="grid w-full flex-wrap gap-5 grid-cols-12 mt-3">
                    <div className="col-span-6">
                      <button
                        type="button"
                        className="btn btn-secondary w-full"
                        onClick={() => {
                          // clearData();
                          modalRef.current?.close();
                        }}
                      >
                        ไม่ใช่ตอนนี้
                      </button>
                    </div>
                    <div className="col-span-6">
                      <button
                        type="button"
                        className="btn bg-[#A80689] hover:bg-[#A80689] border-[#A80689] text-white w-full"
                        onClick={() => {
                          if (useBy !== "admin") {
                            nextStep();
                          } else {
                            modalRef.current?.close();
                          }
                        }}
                      >
                        {useBy === "admin" ? "บันทึก" : "ต่อไป"}
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
        <ReturnCarAddStep2Modal
          openStep1={() => modalRef.current?.showModal()}
          useBy={useBy}
          ref={returnCarAddStep2ModalRef}
          valueFormStep1={valueFormStep1}
          id={id}
          requestData={requestData}
        />
      </>
    );
  }
);

ReturnCarAddModal.displayName = "ReturnCarAddModal";

export default ReturnCarAddModal;
