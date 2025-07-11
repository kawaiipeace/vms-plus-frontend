import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
} from "react";
import TimePicker from "@/components/timePicker";
import DatePicker, { DatePickerRef } from "@/components/datePicker";
import useSwipeDown from "@/utils/swipeDown";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { updateRecivedKeyHandover } from "@/services/keyAdmin";
import { convertToISO } from "@/utils/convertToISO";
import { convertToBuddhistDateTime } from "@/utils/converToBuddhistDateTime";
import { useRouter } from "next/navigation";

interface Props {
  place?: string;
  date?: string;
  start_time?: string;
  end_time?: string;
  req_id?: string;
  onUpdate?: () => void;
}

const schema = yup.object().shape({
  receivedKeyPlace: yup.string(),
  receivedKeyDate: yup.string(),
  pickupStartTime: yup.string(),
  pickupEndTime: yup.string(),
});

const EditKeyAppointmentModal = forwardRef<
  { openModal: () => void; closeModal: () => void },
  Props
>(({ place, date, start_time, end_time, req_id, onUpdate }, ref) => {
  const modalRef = useRef<HTMLDialogElement>(null);
  const datePickerRef = useRef<DatePickerRef>(null);
  
  useImperativeHandle(ref, () => ({
    openModal: () => modalRef.current?.showModal(),
    closeModal: () => modalRef.current?.close(),
  }));

  const router = useRouter();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    mode: "onChange",
    resolver: yupResolver(schema),
    defaultValues: {
      receivedKeyPlace: place,
      receivedKeyDate: date ? convertToBuddhistDateTime(date).date : "",
      pickupStartTime: start_time ? convertToBuddhistDateTime(start_time).time : "",
      pickupEndTime: end_time ? convertToBuddhistDateTime(end_time).time : "",
    },
  });

  // Initialize date picker with default value
  useEffect(() => {
    if (date) {
      const buddhistDate = convertToBuddhistDateTime(date);
      datePickerRef.current?.setValue(buddhistDate.date);
      setValue("receivedKeyDate", buddhistDate.date);
    }
    // Initialize time values
    if (start_time) {
      const startTime = convertToBuddhistDateTime(start_time).time;
      setValue("pickupStartTime", startTime);
    }
    if (end_time) {
      const endTime = convertToBuddhistDateTime(end_time).time;
      setValue("pickupEndTime", endTime);
    }
  }, [date, start_time, end_time, setValue]);

  const handleDateChange = (dateStr: string) => {
    setValue("receivedKeyDate", dateStr);
  };

  const handleStartTimeChange = (timeStr: string) => {
    setValue("pickupStartTime", timeStr);
  };

  const handleEndTimeChange = (timeStr: string) => {
    setValue("pickupEndTime", timeStr);
  };

  const swipeDownHandlers = useSwipeDown(() => modalRef.current?.close());

  const onSubmit = async (data: any) => {


    const payload = {
      received_key_end_datetime: convertToISO(
        data.receivedKeyDate,
        data.pickupEndTime
      ),
      received_key_place: data.receivedKeyPlace,
      received_key_start_datetime: convertToISO(
        data.receivedKeyDate,
        data.pickupStartTime
      ),
      trn_request_uid: req_id,
    };


    try {
      const response = await updateRecivedKeyHandover(payload);
      if (response) {
        modalRef.current?.close();
        if(onUpdate){
          onUpdate();
        }
      }
    } catch (error) {
      console.error("Network error:", error);
    }
  };

  return (
    <dialog
      ref={modalRef}
      className="modal"
      onClick={(e) => {
        e.stopPropagation();
      }}
    >
      <div className="modal-box max-w-[500px] p-0 relative overflow-hidden flex flex-col max-h-[90vh]">
        <div className="bottom-sheet" {...swipeDownHandlers}>
          <div className="bottom-sheet-icon"></div>
        </div>
        <div className="modal-header bg-white sticky top-0 flex justify-between z-10">
          <div className="modal-title">แก้ไขนัดหมายรับกุญแจ</div>
          <button
            type="button"
            onClick={() => modalRef.current?.close()}
            className="close btn btn-icon border-none bg-transparent shadow-none btn-tertiary"
          >
            <i className="material-symbols-outlined">close</i>
          </button>
        </div>
        <form>
          <div className="modal-body overflow-y-auto">
            <div className="grid grid-cols-12 gap-4">
              <div className="col-span-12 md:col-span-6">
                <div className="form-group">
                  <label className="form-label">สถานที่รับกุญแจ</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder=""
                    defaultValue={place}
                    {...register("receivedKeyPlace")}
                  />
                </div>
              </div>
              <div className="col-span-12 md:col-span-6">
                <div className="form-group">
                  <label className="form-label">วันที่นัดรับกุญแจ</label>
                  <div className="input-group">
                    <div className="input-group-prepend">
                      <span className="input-group-text">
                        <i className="material-symbols-outlined">
                          calendar_month
                        </i>
                      </span>
                    </div>
                    <DatePicker
                      placeholder={"ระบุวันที่นัดรับกุญแจ"}
                      defaultValue={date ? convertToBuddhistDateTime(date).date : ""}
                      onChange={handleDateChange}
                    />
                  </div>
                </div>
              </div>
              <div className="col-span-12 md:col-span-6">
                <div className="form-group">
                  <label className="form-label">เวลาเริ่มต้น</label>
                  <div className="input-group">
                    <div className="input-group-prepend">
                      <span className="input-group-text">
                        <i className="material-symbols-outlined">schedule</i>
                      </span>
                    </div>
                    <TimePicker
                      onChange={handleStartTimeChange}
                      defaultValue={start_time ? convertToBuddhistDateTime(start_time).time : ""}
                      placeholder="HH:MM"
                    />
                  </div>
                </div>
              </div>

              <div className="col-span-12 md:col-span-6">
                <div className="form-group">
                  <label className="form-label">เวลาสิ้นสุด</label>
                  <div className="input-group">
                    <div className="input-group-prepend">
                      <span className="input-group-text">
                        <i className="material-symbols-outlined">schedule</i>
                      </span>
                    </div>
                    <TimePicker
                      onChange={handleEndTimeChange}
                      defaultValue={end_time ? convertToBuddhistDateTime(end_time).time : ""}
                      placeholder="HH:MM"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="modal-action sticky bottom-0 gap-3 mt-0">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                modalRef.current?.close();
              }}
            >
              ปิด
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              onClick={handleSubmit(onSubmit)}
            >
              บันทึก
            </button>
          </div>
        </form>
      </div>

      <div
        className="modal-backdrop"
        onClick={() => modalRef.current?.close()}
      ></div>
    </dialog>
  );
});

EditKeyAppointmentModal.displayName = "EditKeyAppointmentModal";

export default EditKeyAppointmentModal;