import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import TimePicker from "@/components/timePicker";
import { useFormContext } from "@/contexts/requestFormContext";
import { Controller, useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { convertToISO } from "@/utils/convertToISO";
import { convertToBuddhistDateTime } from "@/utils/converToBuddhistDateTime";
import { updatePickup } from "@/services/bookingUser";
import { RequestDetailType } from "@/app/types/request-detail-type";
import useSwipeDown from "@/utils/swipeDown";

interface EditDriverAppointmentModalProps {
  requestData?: RequestDetailType;
  onUpdate: (data: any) => void;
}

const schema = yup.object().shape({
  pickupDatetime: yup.string(),
  pickupPlace: yup.string(),
});

const EditDriverAppointmentModal = forwardRef<
  { openModal: () => void; closeModal: () => void },
  EditDriverAppointmentModalProps
>(({ onUpdate, requestData }, ref) => {
  const modalRef = useRef<HTMLDialogElement>(null);

  const hasReset = useRef(false);

  useImperativeHandle(ref, () => ({
    openModal: () => {
      hasReset.current = false;
      modalRef.current?.showModal();
    },
    closeModal: () => modalRef.current?.close(),
  }));

  const { formData, updateFormData } = useFormContext();

  const { handleSubmit, reset, control, setValue } = useForm({
    mode: "onChange",
    resolver: yupResolver(schema),
    defaultValues: {
      pickupDatetime: formData?.pickupDatetime || "",
      pickupPlace: formData?.pickupPlace || "",
    },
  });

  const [selectedTime, setSelectedTime] = useState<string>(
    formData?.pickupDatetime
      ? formData.pickupDatetime.split("T")[1].slice(0, 5)
      : ""
  );
  const [selectedDate, setSelectedDate] = useState<string>(
    formData?.pickupDatetime ? formData.pickupDatetime.split("T")[0] : ""
  );

  useEffect(() => {
    if (requestData) {
      reset({
        pickupDatetime: requestData?.pickup_datetime || "",
        pickupPlace: requestData?.pickup_place || "",
      });
      const datetime = convertToBuddhistDateTime(requestData?.pickup_datetime);
      setSelectedDate(datetime.date);
      setSelectedTime(datetime.time);
      hasReset.current = true;
    }
  }, [requestData, reset]);

  useEffect(() => {
    setValue("pickupPlace", formData?.pickupPlace || "");
    if (formData?.pickupDatetime) {
      const datetime = convertToBuddhistDateTime(formData?.pickupDatetime);
      setSelectedDate(datetime.date);
      setSelectedTime(datetime.time);
    }
  }, [formData, setValue]);

  const handleTimeChange = (time: string) => {
    setSelectedTime(time);
  };

  const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedDate(event.target.value);
  };

  const onSubmit = async (data: any) => {
    if (!selectedDate || !selectedTime) return;

    const pickupISO = convertToISO(selectedDate, selectedTime);

 
    if (requestData) {
      const payload = {
        pickup_datetime: pickupISO,
        pickup_place: data.pickupPlace,
        trn_request_uid: requestData?.trn_request_uid,
      };
      try {
        const response = await updatePickup(payload);

        if (response) {
          if (onUpdate) onUpdate(response.data);
          modalRef.current?.close();
        }
      } catch (error) {
        console.error("Network error:", error);
        alert("Failed to update trip due to network error.");
      }
    } else {
      onUpdate({
        ...data,
        pickupDatetime: pickupISO,
        pickupPlace: data.pickupPlace,
      });

      updateFormData({
        pickupDatetime: pickupISO,
        pickupPlace: data.pickupPlace,
      });

      modalRef.current?.close();
    }
  };

  const swipeDownHandlers = useSwipeDown(() => modalRef.current?.close());


  return (
    <dialog ref={modalRef} id="my_modal_1" className="modal">
      <div  className="modal-box max-w-[500px] p-0 relative modal-vehicle-pick overflow-hidden flex flex-col max-h-[90vh]">
        <div className="bottom-sheet" {...swipeDownHandlers} >
          <div className="bottom-sheet-icon"></div>
        </div>
        <div className="modal-header bg-white sticky top-0 flex justify-between z-10">
          <div className="modal-title">แก้ไขข้อมูลนัดหมายพนักงานขับรถ</div>
          <form method="dialog">
            <button className="close btn btn-icon border-none bg-transparent shadow-none btn-tertiary">
              <i className="material-symbols-outlined">close</i>
            </button>
          </form>
        </div>
        <div className="modal-body overflow-y-auto">
          <form method="dialog" className="w-full">
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
                    <Controller
                      name="pickupPlace"
                      control={control}
                      render={({ field }) => (
                        <input
                          type="text"
                          className="form-control border-0"
                          {...field}
                        />
                      )}
                    />
                  </div>
                </div>
              </div>

              <div className="col-span-12 md:col-span-6">
                <div className="form-group">
                  <label className="form-label">วันที่เริ่มต้นเดินทาง</label>
                  <div className="input-group is-readonly">
                    <div className="input-group-prepend">
                      <span className="input-group-text">
                        <i className="material-symbols-outlined">
                          calendar_month
                        </i>
                      </span>
                    </div>

                    <input
                      value={selectedDate}
                      onChange={handleDateChange}
                      className="form-control border-0 pointer-events-none"
                      disabled
                    />
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
                    <TimePicker
                      defaultValue={selectedTime}
                      onChange={handleTimeChange}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="modal-action sticky bottom-0 gap-3 mt-0 w-full">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => modalRef.current?.close()}
              >
                ยกเลิก
              </button>

              <button
                type="submit"
                className="btn btn-primary"
                onClick={handleSubmit(onSubmit)}
              >
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

EditDriverAppointmentModal.displayName = "EditDriverAppointmentModal";

export default EditDriverAppointmentModal;
