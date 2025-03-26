import React, { forwardRef, useImperativeHandle, useRef, useState } from "react";
import TimePicker from "@/components/timePicker";
import DatePicker from "@/components/datePicker";
import { useFormContext } from "@/contexts/requestFormContext";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { convertToISO } from "@/utils/convertToISO";

interface DriverAppointmentModalProps {
  process: string;
  id: string;
  onSubmit: (date: string, time: string) => void;
}

const schema = yup.object().shape({
  pickupDatetime: yup.string(),
  pickupPlace: yup.string(),
  masCarpooluid: yup.string()
});

const DriverAppointmentModal = forwardRef<
  { openModal: () => void; closeModal: () => void }, // Ref type
  DriverAppointmentModalProps // Props type
>(({ process, id, onSubmit }, ref) => {
  const modalRef = useRef<HTMLDialogElement>(null);
  const { updateFormData } = useFormContext();

  useImperativeHandle(ref, () => ({
    openModal: () => modalRef.current?.showModal(),
    closeModal: () => modalRef.current?.close(),
  }));

  const { register, handleSubmit } = useForm({
    mode: "onChange",
    resolver: yupResolver(schema),
  });
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('');
  const handleDateChange = (dateStr: string) => {
    setSelectedDate(dateStr);
  };
  const handleTimeChange = (dateStr: string) => {
    setSelectedTime(dateStr);
  };

  const onSubmitForm = (data: any) => {
    const pickup = convertToISO(selectedDate,selectedTime);
    updateFormData({
      pickupDatetime: pickup,
      pickupPlace: data.pickupPlace,
      masCarpooluid: id
    });
    onSubmit(selectedDate, selectedTime);
    modalRef.current?.close();
  };

  return (
    <dialog ref={modalRef} id="my_modal_1" className="modal">
      <div className="modal-box max-w-[500px] p-0 relative modal-vehicle-pick overflow-hidden flex flex-col max-h-[90vh]">
        <div className="bottom-sheet">
          <div className="bottom-sheet-icon"></div>
        </div>
        <div className="modal-header bg-white sticky top-0 flex justify-between z-10">
          <div className="modal-title">
            {process == "edit" ? "แก้ไข" : "เพิ่ม"}ข้อมูลนัดหมายพนักงานขับรถ
          </div>
          <form method="dialog">
            <button className="close btn btn-icon border-none bg-transparent shadow-none btn-tertiary">
              <i className="material-symbols-outlined">close</i>
            </button>
          </form>
        </div>
        <div className="modal-body overflow-y-auto">
          <form onSubmit={handleSubmit(onSubmitForm)} method="dialog" className="w-full">
            <div className="grid grid-cols-12 pb-5 gap-4">
            <div className="col-span-12">
              <div className="form-group">
                <label className="form-label">สถานที่นัดหมาย</label>
                <div className="input-group">
                  <div className="input-group-prepend">
                    <span className="input-group-text">
                      <i className="material-symbols-outlined">location_on</i>
                    </span>
                  </div>
                  <input
                    type="text"
                    className="form-control"
                    placeholder=""
                    {...register("pickupPlace")}
                  />
                </div>
              </div>
            </div>

            <div className="col-span-12 md:col-span-6">
              <div className="form-group">
                <label className="form-label">วันที่เริ่มต้นเดินทาง</label>
                <div className="input-group">
                  <div className="input-group-prepend">
                    <span className="input-group-text">
                      <i className="material-symbols-outlined">calendar_month</i>
                    </span>
                  </div>
                  <DatePicker placeholder="" onChange={handleDateChange} />
                </div>
              </div>
            </div>

            <div className="col-span-12 md:col-span-6">
              <div className="form-group">
                <label className="form-label">เวลานัดหมาย</label>
                <div className="input-group">
                  <div className="input-group-prepend">
                    <span className="input-group-text">
                      <i className="material-symbols-outlined">schedule</i>
                    </span>
                  </div>
                  <TimePicker onChange={handleTimeChange} />
                </div>
              </div>
            </div>
            </div>

            <div className="modal-action sticky bottom-0 gap-3 mt-0 w-full">
          
                <button type="button" className="btn btn-secondary">ยกเลิก</button>
             
              <button type="submit" className="btn btn-primary">
                ยืนยัน
              </button>
            </div>
          </form>
        </div>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>
  );
});

DriverAppointmentModal.displayName = "DriverAppointmentModal";

export default DriverAppointmentModal;