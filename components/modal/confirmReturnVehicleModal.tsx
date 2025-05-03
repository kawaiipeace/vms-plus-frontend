import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import Image from "next/image";
import useSwipeDown from "@/utils/swipeDown";
import DatePicker, { DatePickerRef } from "../datePicker";
import TimePicker from "../timePicker";
import { adminAcceptVehicle } from "@/services/adminService";
import { useRouter } from "next/navigation";

interface Props {
  id?: string;
  fleet_card_no?: string;
  keys: ReceiverKeyTypeDetail;
}

const ConfirmReturnVehicleModal = forwardRef<{
  openModal: () => void;
  closeModal: () => void;
}, Props>(({ id }, ref) => {
  const modalRef = useRef<HTMLDialogElement>(null);

  useImperativeHandle(ref, () => ({
    openModal: () => modalRef.current?.showModal(),
    closeModal: () => modalRef.current?.close(),
  }));

  const getCurrentDate = () => {
    const today = new Date();
    return today.toISOString().split("T")[0]; // "YYYY-MM-DD"
  };

  const getCurrentTime = () => {
    const now = new Date();
    return now.toTimeString().slice(0, 5); // "HH:mm"
  };

  const datePickerRef = useRef<DatePickerRef>(null);
  const router = useRouter();

  const [selectedDate, setSelectedDate] = useState<string>(getCurrentDate());
  const [selectedTime, setSelectedTime] = useState<string>(getCurrentTime());

  const swipeDownHandlers = useSwipeDown(() => modalRef.current?.close());

  useEffect(() => {
    const today = new Date();
    const localDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
    datePickerRef.current?.setValue(localDate);
  }, []);

  const handleConfirm = () => {
    const acceptVehicle = async () => {
      try {
        // selectedDate is in "DD/MM/BBBB" (Buddhist year)
        const [day, month, buddhistYear] = selectedDate.split("/");
        const gregorianYear = parseInt(buddhistYear) - 543;
  
        // selectedTime is "HH:mm"
        const [hours, minutes] = selectedTime.split(":").map(Number);
  
        // Create ISO Date object in UTC
        const date = new Date(Date.UTC(gregorianYear, parseInt(month) - 1, parseInt(day), hours, minutes, 0));
  
        // Get ISO string like "2025-04-16T14:30:00Z"
        const acceptedVehicleDatetime = date.toISOString();
  
        const payload = {
          accepted_vehicle_datetime: acceptedVehicleDatetime,
          trn_request_uid: id || "",
        };
  
        const res = await adminAcceptVehicle(payload);
  
        if (res) {
          modalRef.current?.close();
          router.push(`/administrator/request-list?acceptvehicle-req=success&request-id=${res.data.result?.request_no}`);
        }
      } catch (error) {
        console.error("error:", error);
      }
    };
  
    acceptVehicle();
  };
  
  

  return (
    <>
      <dialog ref={modalRef} className={`modal modal-middle`}>
        <div className="modal-box max-w-[500px] p-0 relative overflow-hidden flex flex-col">
          <div className="bottom-sheet" {...swipeDownHandlers}>
            <div className="bottom-sheet-icon"></div>
          </div>

          <div className="modal-body text-center overflow-y-auto ">
            <Image
              src="/assets/img/graphic/confirm_vehicle.svg"
              className="w-full confirm-img"
              width={100}
              height={100}
              alt=""
            />
            <div className="modal-content mt-3">
              <div className="confirm-title text-xl font-medium">
                ยืนยันรับคืนยานพาหนะ
              </div>
              <div className="confirm-text">
                คุณได้ตรวจสอบการคืนยานพาหนะ<br />
                และได้รับสิ่งที่ส่งมอบครบถ้วนแล้วใช่หรือไม่?
              </div>
              <div className="text-left text-secondary font-semibold mt-3">
                สิ่งที่ส่งมอบ
              </div>
              <div className="card rounded-md !border-none">
                <div className="card-item-group !border-0 !rounded-md shadow-none outline-0">
                  <div className="card-item">
                    <i className="material-symbols-outlined">credit_card</i>
                    <span className="card-item-text">บัตรเติมน้ำมัน</span>
                  </div>
                  <div className="card-item">
                    <i className="material-symbols-outlined">key</i>
                    <span className="card-item-text"> กุญแจหลัก</span>
                  </div>
                </div>
              </div>

              <div className="grid w-full flex-wrap gap-5 grid-cols-12 pb-2 mt-3">
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
                        placeholder="ระบุวันที่"
                        ref={datePickerRef}
                        onChange={(date) => {
                          setSelectedDate(date); // Keep in YYYY-MM-DD
                        }}
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
                        value={selectedTime}
                        onChange={(time) => setSelectedTime(time)}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="modal-footer mt-5 grid grid-cols-2 gap-3">
              <button
                className="btn btn-secondary w-full"
                onClick={() => {
                  modalRef.current?.close();
                }}
              >
                ไม่ใช่ตอนนี้
              </button>
              <button
                type="button"
                className="btn btn-primary col-span-1"
                onClick={handleConfirm}
              >
                ผ่านการตรวจสอบ
              </button>
            </div>
          </div>
        </div>

        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    </>
  );
});

ConfirmReturnVehicleModal.displayName = "ConfirmReturnVehicleModal";

export default ConfirmReturnVehicleModal;
