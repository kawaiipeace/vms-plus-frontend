import { VehicleDetailType } from "@/app/types/vehicle-detail-type";
import DatePicker from "@/components/datePicker";
import RadioButton from "@/components/radioButton";
import TimePicker from "@/components/timePicker";
import {
  fetchVehicleKeyType,
  updateReceivedKeyConfirmed,
} from "@/services/masterService";
import { requestReceivedKeyDriver } from "@/services/vehicleInUseDriver";
import { convertToBuddhistDateTime } from "@/utils/converToBuddhistDateTime";
import { convertToISO } from "@/utils/convertToISO";
import useSwipeDown from "@/utils/swipeDown";
import dayjs from "dayjs";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";

// Props for the KeyPickupDetailModal component
interface KeyPickUpDetailProps {
  reqId: string;
  id: string;
  imgSrc: string;
  name: string;
  deptSap: string;
  deptSapShort: string;
  keyStartTime?: string;
  phone: string;
  vehicle?: VehicleDetailType;
  onEdit?: () => void;
  onSubmit?: () => void;
  role?: string;
}

// Ref methods exposed by the modal
export interface KeyPickupDetailModalRef {
  openModal: () => void;
  closeModal: () => void;
}

const KeyPickupDetailModal = forwardRef<
  KeyPickupDetailModalRef,
  KeyPickUpDetailProps
>((props, ref) => {
  const {
    id,
    imgSrc,
    name,
    deptSap,
    deptSapShort,
    phone,
    keyStartTime,
    reqId,
    onEdit,
    onSubmit,
    vehicle,
    role,
  } = props;

  const router = useRouter();
  const modalRef = useRef<HTMLDialogElement>(null);
  const [vehicleKeyTypeData, setVehicleKeyTypeData] = useState<any>([]);
  const [selectedAttach, setSelectedAttach] = useState<string>(
    "กุญแจหลัก และบัตรเติมน้ำมัน"
  );
  const [selectedDate, setSelectedDate] = useState<string>();
  const [selectedTime, setSelectedTime] = useState<string>();

  // Expose open and close methods via ref
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

  useEffect(() => {
    if (keyStartTime) {
      setSelectedDate(convertToBuddhistDateTime(keyStartTime || "").date);
      setSelectedTime(convertToBuddhistDateTime(keyStartTime || "").time);
    } else {
      setSelectedTime(dayjs().hour(8).minute(30).format("HH:mm"));
    }
  }, [keyStartTime]);

  const submit = async () => {

    if (selectedDate && selectedTime && selectedAttach) {
      try {
        const dateTime = convertToISO(selectedDate, selectedTime);
        const payload = {
          received_key_datetime: dateTime,
          ref_vehicle_key_type_code: Number(selectedAttach),
          trn_request_uid: reqId,
        };

        if (role === "driver") {
          const response = await requestReceivedKeyDriver(payload);

          if (response.status === 200) {
            router.push("/vehicle-in-use/driver");
          }
        } else {
          const response = await updateReceivedKeyConfirmed(payload);

          if (response.status === 200) {
            router.push(
              "/vehicle-booking/request-list?received-key=success&license-plate=" +
                vehicle?.vehicle_license_plate
            );
            if (onSubmit) {
              onSubmit();
            }
          }
        }
      } catch (error) {
        console.error("Network error:", error);
      }
    } else {
      console.warn("No formData found!");
    }
  };

  return (
    <>
      {openModal && (
        <div className="modal modal-open">
          {/* Modal content */}
          <div className="modal-box max-w-[500px] p-0 relative modal-vehicle-pick overflow-hidden flex flex-col max-h-[90vh]">
            {/* Swipe down indicator */}
            <div className="bottom-sheet" {...swipeDownHandlers}>
              <div className="bottom-sheet-icon"></div>
            </div>

            {/* Header */}
            <div className="modal-header bg-white sticky top-0 flex justify-between z-10">
              <div className="modal-title">รับกุญแจ</div>
              <form method="dialog">
                <button
                  className="close btn btn-icon border-none bg-transparent shadow-none btn-tertiary"
                  onClick={handleCloseModal}
                >
                  <i className="material-symbols-outlined">close</i>
                </button>
              </form>
            </div>

            {/* Body */}
            <div className="modal-scroll-wrapper overflow-y-auto">
              <div className="modal-body">
                {/* User info section */}
                <div className="form-section" style={{ marginTop: 0 }}>
                  <div className="form-section-header">
                    <div className="form-section-header-title">
                      {role === "driver" ? "ผู้รับกุญแจ" : "ผู้ไปรับกุญแจ"}
                    </div>
                    {/* {role !== "driver" && (
                      <button
                        className="btn btn-tertiary-brand bg-transparent shadow-none border-none"
                        onClick={() => {
                          handleCloseModal();
                          if (onEdit) {
                            onEdit();
                          }
                        }}
                      >
                        แก้ไข
                      </button>
                    )} */}
                  </div>
                  <div className="form-card w-full">
                    <div className="form-card-body">
                      <div className="form-group form-plaintext form-users">
                        <Image
                          src={imgSrc || "/assets/img/avatar.svg"}
                          className="avatar avatar-md"
                          width={100}
                          height={100}
                          alt={name}
                        />
                        <div className="form-plaintext-group align-self-center">
                          <div className="form-label">{name}</div>
                          <div className="supporting-text-group">
                            <div className="supporting-text">{deptSap}</div>
                            <div className="supporting-text">
                              {" "}
                              {deptSapShort}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="form-card-right align-self-center mt-4">
                        <div className="text-error text-center text-sm">
                          ผู้รับกุญแจมีหน้าที่ดูแลรักษา <br />
                          ไม่ให้กุญแจและ/หรือบัตรเติมน้ำมันสูญหาย
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

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
                            onChange={(date) => {
                              setSelectedDate(date);
                            }}
                            defaultValue={
                              convertToBuddhistDateTime(keyStartTime || "").date
                            }
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
                              <i className="material-symbols-outlined">
                                schedule
                              </i>
                            </span>
                          </div>
                          <TimePicker
                            placeholder="ระบุเวลา"
                            onChange={(time) => setSelectedTime(time)}
                            defaultValue={
                              keyStartTime
                                ? convertToBuddhistDateTime(keyStartTime).time
                                : dayjs().hour(8).minute(30).format("HH:mm")
                            }
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
                        {/* <RadioButton
                      name="key"
                      label="กุญแจหลัก และบัตรเติมน้ำมัน"
                      value="กุญแจหลัก และบัตรเติมน้ำมัน"
                      selectedValue={selectedAttach}
                      setSelectedValue={setSelectedAttach}
                    />
                    <RadioButton
                      name="key"
                      label="กุญแจหลัก"
                      value="กุญแจหลัก"
                      selectedValue={selectedAttach}
                      setSelectedValue={setSelectedAttach}
                    /> */}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="modal-action sticky bottom-0 gap-3 mt-0">
              <form method="dialog" className="w-[50%] md:w-auto">
                <button
                  className="btn btn-secondary w-full"
                  onClick={handleCloseModal}
                >
                  ไม่ใช่ตอนนี้
                </button>
              </form>
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
        </div>
      )}

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
