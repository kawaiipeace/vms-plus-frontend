import React, {
  forwardRef,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import Image from "next/image";
import useSwipeDown from "@/utils/swipeDown";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import TimePicker from "../timePicker";
import FormHelper from "../formHelper";
import DatePicker from "../datePicker";
import { useForm } from "react-hook-form";
import { convertToISO } from "@/utils/convertToISO";

interface Props {
  title: string;
  desc: string | React.ReactNode;
  role?: string;
  confirmText: string;
  place?: string;
  start_datetime?: string;
  end_datetime?: string;
  onPickupConfirmed?: (data: { place: string; datetime: string, endtime: string; }) => void;
}

const schema = yup.object().shape({
  pickupDatetime: yup.string(),
  pickupPlace: yup.string().required("กรุณาระบุสถานที่นัดหมาย"),
  masCarpoolDriverUid: yup.string(),
  pickupDate: yup.string().required("กรุณาเลือกวันที่นัดหมาย"),
  pickupTime: yup.string().required("กรุณาเลือกเวลานัดหมาย"),
  pickupEndTime: yup.string().required("กรุณาเลือกเวลานัดหมาย"),
});

const KeyPickupModal = forwardRef<
  { openModal: () => void; closeModal: () => void },
  Props
>(
  (
    {
      title,
      role,
      desc,
      confirmText,
      place,
      start_datetime,
      end_datetime,
      onPickupConfirmed
    },
    ref
  ) => {
    const modalRef = useRef<HTMLDialogElement>(null);

    useImperativeHandle(ref, () => ({
      openModal: () => modalRef.current?.showModal(),
      closeModal: () => modalRef.current?.close(),
    }));

    const [selectedDate, setSelectedDate] = useState<string>("");
    const [selectedTime, setSelectedTime] = useState<string>("");
    const [selectedEndTime, setSelectedEndTime] = useState<string>("");

    const {
      register,
      handleSubmit,
      setValue,
      formState: { errors },
    } = useForm({
      mode: "onChange",
      resolver: yupResolver(schema),
      defaultValues: {
        pickupPlace: place,
      },
    });

    const handleDateChange = (dateStr: string) => {
      setSelectedDate(dateStr);
      setValue("pickupDate", dateStr);
    };

    const handleTimeChange = (dateStr: string) => {
      setSelectedTime(dateStr);
      setValue("pickupTime", dateStr);
    };

    const handleEndTimeChange = (dateStr: string) => {
      setSelectedEndTime(dateStr);
      setValue("pickupEndTime", dateStr);
    };

    const onSubmitForm = async (data: any) => {
      const pickup = convertToISO(selectedDate, selectedTime);
      const pickupEnd = convertToISO(selectedDate, selectedEndTime);

      const payload = {
        place: data.pickupPlace,
        datetime: pickup,
        endtime: pickupEnd
      };

      modalRef.current?.close();
      if (onPickupConfirmed) {
        onPickupConfirmed(payload);
      }
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
                              placeholder="ระบุวันที่นัดรับกุญแจ"
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
                              placeholder="ระบุเวลาเริ่มต้น"
                            />
                          </div>
                          {errors.pickupTime && (
                            <FormHelper text="กรุณาเลือกเวลาเริ่มต้น" />
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
                              onChange={handleEndTimeChange}
                              placeholder="ระบุเวลาสิ้นสุด"
                            />
                          </div>
                          {errors.pickupEndTime && (
                            <FormHelper text="กรุณาเลือกเวลาสิ้นสุด" />
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
        
      </>
    );
  }
);

KeyPickupModal.displayName = "KeyPickupModal";

export default KeyPickupModal;
