import { RequestDetailType } from "@/app/types/request-detail-type";
import DatePicker from "@/components/datePicker";
import RadioButton from "@/components/radioButton";
import TimePicker from "@/components/timePicker";
import { updateKeyAdminReceiveDetail } from "@/services/keyAdmin";
import { fetchVehicleKeyType } from "@/services/masterService";
import { convertToBuddhistDateTime } from "@/utils/converToBuddhistDateTime";
import { convertToISO } from "@/utils/convertToISO";
import useSwipeDown from "@/utils/swipeDown";
import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";

interface Props {
  requestData?: RequestDetailType;
  onSubmit?: () => void; // Changed to Promise<void> to handle async operations
}

const KeyPickupDetailModal = forwardRef<
  { openModal: () => void; closeModal: () => void },
  Props
>((props, ref) => {
  const { onSubmit, requestData } = props;

  const modalRef = useRef<HTMLDialogElement>(null);
  const [vehicleKeyTypeData, setVehicleKeyTypeData] = useState<any>([]);
  const [selectedAttach, setSelectedAttach] = useState<string>(
    requestData?.receiver_key_type?.toString() || "1"
  );
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Set default values when modal opens or requestData changes
  useEffect(() => {
    if (requestData?.received_key_datetime && requestData.received_key_datetime !== "0001-01-01T00:00:00Z") {
      const { date, time } = convertToBuddhistDateTime(requestData.received_key_datetime);
      setSelectedDate(date);
      setSelectedTime(time);
    } 
  }, [requestData]);

  // Expose open and close methods via ref
  useImperativeHandle(ref, () => ({
    openModal: () => {
      modalRef.current?.showModal();
    },
    closeModal: () => modalRef.current?.close(),
  }));

  // Handler for swipe-down to close
  const swipeDownHandlers = useSwipeDown(() => modalRef.current?.close());

  useEffect(() => {
    const fetchCostTypeFromCodeFunc = async () => {
      try {
        const response = await fetchVehicleKeyType();
        setVehicleKeyTypeData(response.data);
        setSelectedAttach(
          requestData?.receiver_key_type?.toString() || 
          response.data[0]?.ref_vehicle_key_type_code.toString()
        );
      } catch (error) {
        console.error("API Error:", error);
      }
    };
    fetchCostTypeFromCodeFunc();
  }, [requestData]);

  const submit = async () => {
    if (!selectedDate || !selectedTime || !selectedAttach) {
      console.warn("Please fill all required fields!");
      return;
    }

    setIsSubmitting(true);
    try {
      const dateTime = convertToISO(selectedDate, selectedTime);
      const payload = {
        received_key_datetime: dateTime,
        ref_vehicle_key_type_code: Number(selectedAttach),
        trn_request_uid: requestData?.trn_request_uid,
      };
      
      await updateKeyAdminReceiveDetail(payload);
      
      // Call onSubmit if provided (should trigger data refresh in parent)
      if (onSubmit) {
        await onSubmit();
      }
      
      modalRef.current?.close();
    } catch (error) {
      console.error("Network error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTimeChange = (time: string) => {
    setSelectedTime(time);
  };

  return (
    <dialog ref={modalRef} className="modal">
      <div className="modal-box max-w-[500px] p-0 relative modal-vehicle-pick overflow-hidden flex flex-col max-h-[90vh]">
        {/* Swipe down indicator */}
        <div className="bottom-sheet" {...swipeDownHandlers}>
          <div className="bottom-sheet-icon"></div>
        </div>

        {/* Header */}
        <div className="modal-header bg-white sticky top-0 flex justify-between z-10">
          <div className="modal-title">แก้ไขรายละเอียดการรับกุญแจ</div>
          <form method="dialog">
            <button className="close btn btn-icon border-none bg-transparent shadow-none btn-tertiary">
              <i className="material-symbols-outlined">close</i>
            </button>
          </form>
        </div>

        {/* Body */}
        <div className="modal-body overflow-y-auto">
          <div className="form-section">
            <div className="grid grid-cols-12 gap-5">
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
                    <DatePicker
                      placeholder={"ระบุวันที่"}
                      defaultValue={selectedDate}
                      onChange={(date) => setSelectedDate(date)}
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
                      defaultValue={selectedTime}
                      onChange={handleTimeChange}
                    />
                  </div>
                </div>
              </div>

              {/* Radio buttons */}
              <div className="col-span-12">
                <div className="form-group">
                  <label className="form-label">สิ่งที่ได้รับ</label>
                  {vehicleKeyTypeData.map((item: any, index: number) => (
                    <RadioButton
                      key={index}
                      name="key"
                      label={item.ref_vehicle_key_type_name}
                      value={item.ref_vehicle_key_type_code.toString()}
                      selectedValue={selectedAttach}
                      setSelectedValue={setSelectedAttach}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="modal-action sticky bottom-0 gap-3 mt-0">
          <div className="w-[50%] md:w-auto">
            <button
              className="btn btn-secondary w-full"
              onClick={() => modalRef.current?.close()}
              disabled={isSubmitting}
            >
              ไม่ใช่ตอนนี้
            </button>
          </div>
          <button
            className="btn btn-primary w-[50%] md:w-auto"
            onClick={submit}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <span className="loading loading-spinner"></span>
            ) : (
              "ยืนยัน"
            )}
          </button>
        </div>
      </div>

      {/* Backdrop */}
      <form method="dialog" className="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>
  );
});

KeyPickupDetailModal.displayName = "KeyPickupDetailModal";
export default KeyPickupDetailModal;