import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import NumberInput from "@/components/numberInput";
import { useFormContext } from "@/contexts/requestFormContext";
import RadioButton from "../radioButton";
import { updateTrip } from "@/services/bookingUser";
import { convertToBuddhistDateTime } from "@/utils/converToBuddhistDateTime";
import { convertToISO } from "@/utils/convertToISO";
import { RequestDetailType } from "@/app/types/request-detail-type";
import useSwipeDown from "@/utils/swipeDown";

interface Props {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  requestData?: RequestDetailType;
  onUpdate?: (data: any) => void;
}

const schema = yup.object().shape({
  startDate: yup.string(),
  endDate: yup.string(),
  timeStart: yup.string(),
  timeEnd: yup.string(),
  workPlace: yup.string().required(),
  purpose: yup.string().required(),
  remark: yup.string().optional(),
  tripType: yup.number(),
  numberOfPassenger: yup.number(),
});

const JourneyDetailModal = forwardRef<
  { openModal: () => void; closeModal: () => void },
  Props
>(({ onUpdate, requestData }, ref) => {
  const modalRef = useRef<HTMLDialogElement>(null);
  const { formData, updateFormData } = useFormContext();

  const hasReset = useRef(false);

  useImperativeHandle(ref, () => ({
    openModal: () => {
      hasReset.current = false;
      modalRef.current?.showModal();
    },
    closeModal: () => modalRef.current?.close(),
  }));

  const [passengerCount, setPassengerCount] = useState<number>(
    formData.numberOfPassenger || 0
  );
  const [selectedTripType, setSelectedTripType] = useState<string>("0");

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    mode: "onChange",
    resolver: yupResolver(schema),
    defaultValues: {
      startDate: formData.startDate || "",
      endDate: formData.endDate || "",
      timeStart: formData.timeStart || "",
      timeEnd: formData.timeEnd || "",
      workPlace: formData.workPlace || "",
      purpose: formData.purpose || "",
      remark: formData.remark || "",
    },
  });

  useEffect(() => {
    if (requestData) {
      reset({
        startDate:
          convertToBuddhistDateTime(requestData?.start_datetime).date || "",
        endDate:
          convertToBuddhistDateTime(requestData?.end_datetime).date || "",
        timeStart:
          convertToBuddhistDateTime(requestData?.start_datetime).time || "",
        timeEnd:
          convertToBuddhistDateTime(requestData?.end_datetime).time || "",
        workPlace: requestData?.work_place || "",
        purpose: requestData?.objective || "",
        remark: requestData?.remark || "",
      });
      setSelectedTripType(String(requestData?.trip_type || "0"));
      setPassengerCount(requestData?.number_of_passengers);
      hasReset.current = true;
    }
  }, [requestData, reset]);

  const onSubmit = async (data: any) => {
    const payload = {
      end_datetime: convertToISO(data.endDate, data.timeEnd),
      number_of_passengers: passengerCount,
      objective: data.purpose,
      reserved_time_type: "1",
      start_datetime: convertToISO(data.startDate, data.timeStart),
      trip_type: parseInt(selectedTripType),
      trn_request_uid: requestData?.trn_request_uid,
      work_place: data.workPlace,
      remark: data.remark
    };

    if (requestData) {
      try {
        const response = await updateTrip(payload);

        if (response) {
          if (onUpdate) onUpdate(response.data);
          modalRef.current?.close();
        }
      } catch (error) {
        console.error("Network error:", error);
        alert("Failed to update trip due to network error.");
      }
    } else {
      // fallback to form state update only
      const updatedata = {
        startDate: data.startDate,
        endDate: data.endDate,
        timeStart: data.timeStart,
        timeEnd: data.timeEnd,
        workPlace: data.workPlace,
        purpose: data.purpose,
        remark: data.remark,
        numberOfPassenger: passengerCount,
        tripType: parseInt(selectedTripType),
      };

      updateFormData(updatedata);
      if (onUpdate) onUpdate(updatedata);
      modalRef.current?.close();
    }
  };
  const swipeDownHandlers = useSwipeDown(() => modalRef.current?.close());

  return (
    <dialog ref={modalRef} id="my_modal_1" className="modal">
      <div  className="modal-box max-w-[800px] p-0 relative modal-vehicle-pick overflow-hidden flex flex-col max-h-[90vh]">
        <div className="bottom-sheet" {...swipeDownHandlers} >
          <div className="bottom-sheet-icon"></div>
        </div>
        <div className="modal-header bg-white sticky top-0 flex justify-between z-10">
          <div className="modal-title">แก้ไขรายละเอียดการเดินทาง</div>
          <form method="dialog">
            <button className="close btn btn-icon border-none bg-transparent shadow-none btn-tertiary">
              <i className="material-symbols-outlined">close</i>
            </button>
          </form>
        </div>
        <div className="modal-body overflow-y-auto">
          <div className="grid grid-cols-12 gap-4">
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

                  <Controller
                    name="startDate"
                    control={control}
                    render={({ field }) => (
                      <input
                        type="text"
                        className="form-control pointer-events-none border-0"
                        readOnly
                        {...field}
                      />
                    )}
                  />
                </div>
              </div>
            </div>

            <div className="col-span-12 md:col-span-6">
              <div className="form-group">
                <label className="form-label">วันที่สิ้นสุดเดินทาง</label>
                <div className="input-group is-readonly">
                  <div className="input-group-prepend">
                    <span className="input-group-text">
                      <i className="material-symbols-outlined">
                        calendar_month
                      </i>
                    </span>
                  </div>
                  <Controller
                    name="endDate"
                    control={control}
                    render={({ field }) => (
                      <input
                        type="text"
                        className="form-control pointer-events-none border-0"
                        readOnly
                        {...field}
                      />
                    )}
                  />
                </div>
              </div>
            </div>

            <div className="col-span-6 md:col-span-6 journey-time">
              <div className="form-group">
                <label className="form-label">เวลาเริ่มต้นเดินทาง</label>
                <div className="input-group is-readonly">
                  <Controller
                    name="timeStart"
                    control={control}
                    render={({ field }) => (
                      <input
                        type="text"
                        className="form-control pointer-events-none border-0"
                        readOnly
                        {...field}
                      />
                    )}
                  />
                </div>
              </div>
            </div>

            <div className="col-span-6 md:col-span-6 journey-time">
              <div className="form-group">
                <label className="form-label">เวลาสิ้นสุดเดินทาง</label>
                <div className="input-group is-readonly">
                  <Controller
                    name="timeEnd"
                    control={control}
                    render={({ field }) => (
                      <input
                        type="text"
                        className="form-control pointer-events-none border-0"
                        readOnly
                        {...field}
                      />
                    )}
                  />
                </div>
              </div>
            </div>
            <div className="col-span-12 md:col-span-6">
              <div className="form-group">
                <label className="form-label">ประเภทการเดินทาง</label>
                <div className="custom-group">
                  <div className="custom-control custom-radio custom-control-inline">
                    <RadioButton
                      name="tripType"
                      label="ไป-กลับ"
                      value="1"
                      selectedValue={selectedTripType}
                      setSelectedValue={setSelectedTripType}
                    />
                  </div>
                  <div className="custom-control custom-radio custom-control-inline">
                    <RadioButton
                      name="tripType"
                      label="ค้างแรม"
                      value="0"
                      selectedValue={selectedTripType}
                      setSelectedValue={setSelectedTripType}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="col-span-12">
              <div className="form-group">
                <label className="form-label">สถานที่ปฏิบัติงาน</label>
                <div className="input-group">
                  <Controller
                    name="workPlace"
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

            <div className="col-span-12">
              <div className="form-group">
                <label className="form-label">วัตถุประสงค์</label>
                <div className="input-group">
                  <Controller
                    name="purpose"
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

            <div className="col-span-12">
              <div className="form-group">
                <label className="form-label">
                  หมายเหตุ<span className="form-optional">(ถ้ามี)</span>
                </label>
                <div className="input-group">
                  <Controller
                    name="remark"
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

            <div className="col-span-12 md:col-span-4">
              <div className="form-group">
                <label className="form-label">
                  จำนวนผู้โดยสาร
                  <span className="form-optional">(รวมผู้ขับขี่)</span>
                </label>
                <div className="w-full overflow-hidden">
                  <NumberInput
                    value={passengerCount}
                    onChange={setPassengerCount}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="modal-action sticky bottom-0 gap-3 mt-0">
          <form method="dialog">
            <button className="btn btn-secondary">ยกเลิก</button>
          </form>
          <form method="dialog">
            <button
              className="btn btn-primary"
              onClick={handleSubmit(onSubmit)}
            >
              ยืนยัน
            </button>
          </form>
        </div>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>
  );
});

JourneyDetailModal.displayName = "JourneyDetailModal";

export default JourneyDetailModal;
