import { VehicleDetailType } from "@/app/types/vehicle-detail-type";
import DatePicker from "@/components/datePicker";
import RadioButton from "@/components/radioButton";
import TimePicker from "@/components/timePicker";
import { updateKeyAdminReceiveDetail } from "@/services/keyAdmin";
import {
  fetchVehicleKeyType,
  updateReceivedKeyConfirmed,
} from "@/services/masterService";
import { convertToISO } from "@/utils/convertToISO";
import useSwipeDown from "@/utils/swipeDown";
import { useRouter } from "next/navigation";
import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";

// Props for the KeyPickupDetailModal component
interface Props {
  reqId: string;
  id: string;
  imgSrc: string;
  name: string;
  deptSap: string;
  phone: string;
  role?: string;
  vehicle?: VehicleDetailType;
  onEdit?: () => void;
  onSubmit?: () => void;
}

const KeyPickupDetailModal = forwardRef<
  { openModal: () => void; closeModal: () => void }, // Ref type
  Props
>((props, ref) => {
  const { id, imgSrc, name, deptSap, phone, reqId, onEdit, role, onSubmit, vehicle } =
    props;

  const router = useRouter();
  const modalRef = useRef<HTMLDialogElement>(null);
  const [vehicleKeyTypeData, setVehicleKeyTypeData] = useState<any>([]);
  const [selectedAttach, setSelectedAttach] = useState<string>(
    "กุญแจหลัก และบัตรเติมน้ำมัน"
  );
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedTime, setSelectedTime] = useState<string>("");

  // Expose open and close methods via ref
  useImperativeHandle(ref, () => ({
    openModal: () => modalRef.current?.showModal(),
    closeModal: () => modalRef.current?.close(),
  }));

  // Handler for swipe-down to close
  const swipeDownHandlers = useSwipeDown(() => modalRef.current?.close());

  useEffect(() => {
    if (modalRef) {
      const fetchCostTypeFromCodeFunc = async () => {
        try {
          const response = await fetchVehicleKeyType();
          setVehicleKeyTypeData(response.data);
          setSelectedAttach(response.data[0].ref_vehicle_key_type_code);
        } catch (error) {
          console.error("API Error:", error);
        }
      };
      fetchCostTypeFromCodeFunc();
    }
  }, [modalRef]);

  const submit = async () => {
    if (selectedDate && selectedTime && selectedAttach) {
      try {
        const dateTime = convertToISO(selectedDate, selectedTime);
        const payload = {
          received_key_datetime: dateTime,
          ref_vehicle_key_type_code: Number(selectedAttach),
          trn_request_uid: reqId,
        };
        let response;
        if(role === "keyAdmin"){
          response = await updateKeyAdminReceiveDetail(payload);
        }else{
          response = await updateReceivedKeyConfirmed(payload);
        }
    
        console.log("response", response);

        if (onSubmit) {
          onSubmit();
        }

        if (response.status === 200) {
          if(role === "keyAdmin"){
            if (onEdit) {
              onEdit();
            }
        }else{
          router.push(
            "/vehicle-booking/request-list?received-key=success&license-plate=" +
              vehicle?.vehicle_license_plate
          );
        }
        }
      } catch (error) {
        console.error("Network error:", error);
      }
    } else {
      console.warn("No formData found!");
    }
  };

  const handleTimeChange = (dateStr: string) => {
    setSelectedTime(dateStr);
  };

  return (
    <>
      <dialog ref={modalRef} className="modal">
        {/* Modal content */}
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
            {/* Date, time, and attachments section */}
            <div className="form-section">
              <div className="grid grid-cols-12 gap-5">
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
                        onChange={(time: string) => {
                          handleTimeChange(time);
                        }}
                      />
                    </div>
                  </div>
                </div>

                {/* Radio buttons */}
                <div className="col-span-12">
                  <div className="form-group">
                    <label className="form-label">สิ่งที่ได้รับ</label>
                    {vehicleKeyTypeData.map((item: any, index: number) => {
                      return (
                        <RadioButton
                          key={index}
                          name="key"
                          label={item.ref_vehicle_key_type_name}
                          value={item.ref_vehicle_key_type_code}
                          selectedValue={selectedAttach}
                          setSelectedValue={setSelectedAttach}
                        />
                      );
                    })}
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
              >
                ไม่ใช่ตอนนี้
              </button>
            </div>
            <button
              className="btn btn-primary w-[50%] md:w-auto"
              onClick={() => {
                submit();
                // confirmKeyHandOverModalRef.current?.openModal();
              }}
            >
              ยืนยัน
            </button>
          </div>
        </div>

        {/* Backdrop */}
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>

      {/* <ConfirmKeyHandOverModal
        ref={confirmKeyHandOverModalRef}
        id={id}
        selectedAttach={selectedAttach}
        selectedDate={selectedDate}
        selectedTime={selectedTime}
      /> */}
    </>
  );
});

KeyPickupDetailModal.displayName = "KeyPickupDetailModal";
export default KeyPickupDetailModal;
