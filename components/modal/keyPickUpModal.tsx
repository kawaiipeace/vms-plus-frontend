import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import Image from "next/image";
import PassVerifyModal from "@/components/modal/passVerifyModal";
import useSwipeDown from "@/utils/swipeDown";
import { useRouter } from "next/navigation";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { VehicleUserType } from "@/app/types/vehicle-user-type";
import { convertToBuddhistDateTime } from "@/utils/converToBuddhistDateTime";
import TimePicker from "../timePicker";
import FormHelper from "../formHelper";
import DatePicker from "../datePicker";
import { useForm } from "react-hook-form";
import { convertToISO } from "@/utils/convertToISO";
import { adminUpdatePickup } from "@/services/bookingAdmin";

interface Props {
  title: string;
  desc: string | React.ReactNode;
  id: string;
  role?: string;
  confirmText: string;
  place?: string;
  start_datetime?: string;
  end_datetime?: string;
  statusCode?: string;
}

const schema = yup.object().shape({
  pickupDatetime: yup.string(),
  pickupPlace: yup.string().required("กรุณาระบุสถานที่นัดหมาย"),
  masCarpoolDriverUid: yup.string(),
  pickupDate: yup.string().required("กรุณาเลือกวันที่นัดหมาย"),
  pickupTime: yup.string().required("กรุณาเลือกเวลานัดหมาย"),
});

const KeyPickupModal = forwardRef<
  { openModal: () => void; closeModal: () => void },
  Props
>(
  (
    {
      id,
      title,
      role,
      desc,
      confirmText,
      place,
      start_datetime,
      end_datetime,
      statusCode,
    },
    ref
  ) => {
    const modalRef = useRef<HTMLDialogElement>(null);

    const approveRequestModalRef = useRef<{
      openModal: () => void;
      closeModal: () => void;
    } | null>(null);

    useImperativeHandle(ref, () => ({
      openModal: () => modalRef.current?.showModal(),
      closeModal: () => modalRef.current?.close(),
    }));

    const [selectedDate, setSelectedDate] = useState<string>("");
    const [selectedTime, setSelectedTime] = useState<string>("");

    const {
      register,
      handleSubmit,
      setValue,
      formState: { errors },
    } = useForm({
      mode: "onChange",
      resolver: yupResolver(schema),
      defaultValues: {
        pickupPlace: place
      }
    });

    const handleDateChange = (dateStr: string) => {
      setSelectedDate(dateStr);
      setValue("pickupDate", dateStr);
    };

    const handleTimeChange = (dateStr: string) => {
      setSelectedTime(dateStr);
      setValue("pickupTime", dateStr);
    };

    const onSubmitForm = async (data: any) => {
      const pickup = convertToISO(selectedDate, selectedTime);
      try {
        const payload = {
          trn_request_uid: id,
          pickup_place: data.pickupPlace || "",
          pickup_datetime: pickup || "",
        };

        const res =
          role === "admin"
            ? await adminUpdatePickup(payload)
            : await adminUpdatePickup(payload);
        console.log("approve---", res);

        if (res) {
          modalRef.current?.close();
        }
      } catch (error) {
        console.error("error:", error);
      }
      modalRef.current?.close();
    };

    const swipeDownHandlers = useSwipeDown(() => modalRef.current?.close());

    return (
      <>
        <dialog ref={modalRef} className={`modal modal-middle`}>
          <div className="modal-box max-w-[500px] p-0 relative overflow-hidden flex flex-col">
            <div className="bottom-sheet" {...swipeDownHandlers}>
              <div className="bottom-sheet-icon"></div>
            </div>

            <div className="modal-body text-center overflow-y-auto !p-0">
              <form
                onSubmit={handleSubmit(onSubmitForm)}
                method="dialog"
                className="w-full"
              >
                <Image
                  src="/assets/img/graphic/confirm_key.svg"
                  className="w-full confirm-img"
                  width={100}
                  height={100}
                  alt=""
                />
                <div className="confirm-title text-xl font-medium px-5">
                  {title}
                </div>
                <div className="confirm-text text-base">{desc}</div>
                <div className="confirm-form mt-4 px-5">
                  <div className="form-group">
                    <div className="grid grid-cols-12 gap-4">
                      <div className="col-span-12 md:col-span-6">
                        <div className="form-group">
                          <label className="form-label">สถานที่รับกุญแจ</label>
                          <div className="input-group">
                            <div className="input-group-prepend select-none">
                              <span className="input-group-text">
                                <i className="material-symbols-outlined">
                                  location_on
                                </i>
                              </span>
                            </div>
                            <input
                              type="text"
                              className="form-control select-none"
                              placeholder="ระบุสถานที่นัดหมาย"
                              {...register("pickupPlace")}
                            />
                          </div>
                          {errors.pickupPlace && (
                            <FormHelper
                              text={String(errors.pickupPlace.message)}
                            />
                          )}
                        </div>
                      </div>

                      <div className="col-span-12 md:col-span-6">
                        <div className="form-group">
                          <label className="form-label">
                            วันที่นัดรับกุญแจ
                          </label>
                          <div className="input-group">
                            <div className="input-group-prepend">
                              <span className="input-group-text">
                                <i className="material-symbols-outlined">
                                  calendar_month
                                </i>
                              </span>
                            </div>
                            <DatePicker
                              placeholder="01/01/2567"
                              onChange={handleDateChange}
                            />
                          </div>
                          {errors.pickupDate && (
                            <FormHelper
                              text={String(errors.pickupDate.message)}
                            />
                          )}
                        </div>
                      </div>

                      <div className="col-span-12 md:col-span-6">
                        <div className="form-group">
                          <label className="form-label">เวลาเริ่มต้น</label>
                          <div className="input-group">
                            <div className="input-group-prepend">
                              <span className="input-group-text">
                                <i className="material-symbols-outlined">
                                  schedule
                                </i>
                              </span>
                            </div>
                            <TimePicker
                              onChange={handleTimeChange}
                              placeholder="ระบุเวลานัดหมาย"
                            />
                          </div>
                          {errors.pickupTime && (
                            <FormHelper
                              text={String(errors.pickupTime.message)}
                            />
                          )}
                        </div>
                      </div>

                      <div className="col-span-12 md:col-span-6">
                        <div className="form-group">
                          <label className="form-label">เวลาสิ้นสุด</label>
                          <div className="input-group">
                            <div className="input-group-prepend">
                              <span className="input-group-text">
                                <i className="material-symbols-outlined">
                                  schedule
                                </i>
                              </span>
                            </div>
                            <TimePicker
                              onChange={handleTimeChange}
                              placeholder="ระบุเวลานัดหมาย"
                            />
                          </div>
                          {errors.pickupTime && (
                            <FormHelper
                              text={String(errors.pickupTime.message)}
                            />
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="modal-action sticky bottom-0 gap-3 mt-0">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => modalRef.current?.close()}
                  >
                    ยกเลิก
                  </button>
                  <button type="submit" className="btn btn-primary col-span-1">
                    {confirmText}
                  </button>
                </div>
              </form>
            </div>
          </div>

          <form method="dialog" className="modal-backdrop">
            <button>close</button>
          </form>
        </dialog>

        <PassVerifyModal
          id={id}
          ref={approveRequestModalRef}
          title={"ยืนยันผ่านการตรวจสอบ"}
          role="admin"
          desc={
            <>
              คุณต้องการยืนยันผ่านการตรวจสอบ<br></br>
              และส่งคำขอไปยังผู้อนุมัติใช้ยานพาหนะหรือไม่?
            </>
          }
          confirmText="ผ่านการตรวจสอบ"
        />
      </>
    );
  }
);

KeyPickupModal.displayName = "KeyPickupModal";

export default KeyPickupModal;
