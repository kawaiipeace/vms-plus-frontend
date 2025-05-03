import DatePicker, { DatePickerRef } from "@/components/datePicker";
import { RecordTravelTabProps } from "@/data/requestData";
import { driverCreateTravelDetail, driverUpdateTravelDetail } from "@/services/vehicleInUseDriver";
import { UserCreateTravelDetail, UserUpdateTravelDetail } from "@/services/vehicleInUseUser";
import { convertToBuddhistDateTime } from "@/utils/converToBuddhistDateTime";
import { convertToISO } from "@/utils/convertToISO";
import useSwipeDown from "@/utils/swipeDown";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import TimePicker from "../timePicker";

interface Props {
  status?: boolean;
  role?: string;
  requestId?: string;
  dataItem?: RecordTravelTabProps;
}

export interface RecordTravelValueType {
  startDate: string;
  startTime: string;
  endDate: string;
  endTime: string;
  startLocation: string;
  endLocation: string;
  startMile: string;
  endMile: string;
  detail: string;
}

const RecordTravelAddModal = forwardRef<{ openModal: () => void; closeModal: () => void }, Props>(
  ({ status, role, requestId, dataItem }, ref) => {
    const router = useRouter();
    const pathName = usePathname();
    const searchParams = useSearchParams();
    const activeTab = searchParams.get("activeTab");
    const progressType = searchParams.get("progressType");
    const modalRef = useRef<HTMLDialogElement>(null);
    const [value, setValue] = useState<Partial<RecordTravelValueType>>();

    const startPickerRef = useRef<DatePickerRef>(null);
    const endPickerRef = useRef<DatePickerRef>(null);

    useImperativeHandle(ref, () => ({
      openModal: () => modalRef.current?.showModal(),
      closeModal: () => modalRef.current?.close(),
    }));

    useEffect(() => {
      if (status && dataItem) {
        const startDate = convertToBuddhistDateTime(dataItem?.trip_start_datetime);
        const endDate = convertToBuddhistDateTime(dataItem?.trip_end_datetime);
        startPickerRef.current?.setValue?.(startDate.date);
        endPickerRef.current?.setValue?.(endDate.date);
        setValue({
          startDate: startDate.date,
          startTime: startDate.time,
          endDate: endDate.date,
          endTime: endDate.time,
          startLocation: dataItem?.trip_departure_place,
          endLocation: dataItem?.trip_destination_place,
          startMile: String(dataItem?.trip_start_miles),
          endMile: String(dataItem?.trip_end_miles),
          detail: dataItem?.trip_detail,
        });
      } else {
        setValue(undefined);
      }
    }, [dataItem, status]);

    const handleSubmit = () => {
      const { startDate, startTime, endDate, endTime, startLocation, endLocation, startMile, endMile, detail } =
        value || {};

      if (startDate && startTime && endDate && endTime && startLocation && endLocation && startMile && endMile) {
        const submitForm = async () => {
          try {
            const payload = {
              trip_departure_place: startLocation,
              trip_destination_place: endLocation,
              trip_detail: detail || "",
              trip_end_datetime: convertToISO(endDate, endTime),
              trip_end_miles: Number(endMile),
              trip_start_datetime: convertToISO(startDate, startTime),
              trip_start_miles: Number(startMile),
              trn_request_uid: requestId,
            };

            if (status) {
              const res =
                role === "user"
                  ? await UserUpdateTravelDetail(dataItem?.trn_trip_detail_uid || "", payload)
                  : await driverUpdateTravelDetail(dataItem?.trn_trip_detail_uid || "", payload);
              const data = res.data;
              if (data) {
                modalRef.current?.close();

                // eslint-disable-next-line @typescript-eslint/no-unused-expressions
                role === "user"
                  ? router.push(
                      pathName +
                        `?activeTab=${activeTab}&update-travel-req=success&date-time=${data.data?.trip_start_datetime}`
                    )
                  : router.push(
                      pathName +
                        `?progressType=${progressType}&update-travel-req=success&date-time=${data.data?.trip_start_datetime}`
                    );
                // : router.push("/vehicle-booking/request-list?cancel-req=success&request-id=" + data.result?.request_no);
              }
              return;
            }

            const res =
              role === "user" ? await UserCreateTravelDetail(payload) : await driverCreateTravelDetail(payload);
            const data = res.data;
            if (data) {
              modalRef.current?.close();

              // eslint-disable-next-line @typescript-eslint/no-unused-expressions
              role === "user"
                ? router.push(
                    pathName +
                      `?activeTab=${activeTab}&create-travel-req=success&date-time=${data.data?.trip_start_datetime}`
                  )
                : router.push(
                    pathName +
                      `?progressType=${progressType}&create-travel-req=success&date-time=${data.data?.trip_start_datetime}`
                  );
            }
          } catch (error) {
            console.error("Error submitting form:", error);
          }
        };

        submitForm();
      }
    };
    const swipeDownHandlers = useSwipeDown(() => modalRef.current?.close());

    return (
      <dialog ref={modalRef} className="modal">
        <div className="modal-box max-w-[500px] p-0 relative overflow-hidden flex flex-col">
          <div className="modal-body overflow-y-auto text-center">
            <div className="modal-header bg-white sticky top-0 flex justify-between z-10">
              <div className="modal-title">{status ? "แก้ไขข้อมูลการเดินทาง" : "เพิ่มข้อมูลการเดินทาง"}</div>
              <form method="dialog">
                <button className="close btn btn-icon border-none bg-transparent shadow-none btn-tertiary">
                  <i className="material-symbols-outlined">close</i>
                </button>
              </form>
            </div>
            <form>
              <div className="grid grid-cols-1 gap-4 mt-4">
                {/* Date picker */}
                <div className="col-span-6">
                  <div className="form-group">
                    <label className="form-label">วันที่จากต้นทาง</label>
                    <div className="input-group">
                      <div className="input-group-prepend">
                        <span className="input-group-text">
                          <i className="material-symbols-outlined">calendar_month</i>
                        </span>
                      </div>
                      <DatePicker
                        placeholder={"ระบุวันที่จากต้นทาง"}
                        onChange={(date) => setValue((val) => ({ ...val, startDate: date }))}
                        ref={startPickerRef}
                      />
                    </div>
                  </div>
                </div>

                {/* Time picker */}
                <div className="col-span-6">
                  <div className="form-group">
                    <label className="form-label">เวลาจากต้นทาง</label>
                    <div className="input-group">
                      <div className="input-group-prepend">
                        <span className="input-group-text">
                          <i className="material-symbols-outlined">schedule</i>
                        </span>
                      </div>
                      <TimePicker
                        placeholder="ระบุเวลาจากต้นทาง"
                        onChange={(time) => setValue((val) => ({ ...val, startTime: time }))}
                        defaultValue={value?.startTime}
                        value={value?.startTime}
                      />
                    </div>
                  </div>
                </div>
                {/* Date picker */}
                <div className="col-span-6">
                  <div className="form-group">
                    <label className="form-label">วันที่ถึงปลายทาง</label>
                    <div className="input-group">
                      <div className="input-group-prepend">
                        <span className="input-group-text">
                          <i className="material-symbols-outlined">calendar_month</i>
                        </span>
                      </div>
                      <DatePicker
                        placeholder={"ระบุวันที่ถึงปลายทาง"}
                        onChange={(date) => setValue((val) => ({ ...val, endDate: date }))}
                        ref={endPickerRef}
                      />
                    </div>
                  </div>
                </div>

                {/* Time picker */}
                <div className="col-span-6">
                  <div className="form-group">
                    <label className="form-label">เวลาถึงปลายทาง</label>
                    <div className="input-group">
                      <div className="input-group-prepend">
                        <span className="input-group-text">
                          <i className="material-symbols-outlined">schedule</i>
                        </span>
                      </div>
                      <TimePicker
                        placeholder="ระบุเวลาถึงปลายทาง"
                        onChange={(time) => setValue((val) => ({ ...val, endTime: time }))}
                        defaultValue={value?.endTime}
                        value={value?.endTime}
                      />
                    </div>
                  </div>
                </div>

                <div className="col-span-6">
                  <div className="form-group">
                    <label className="form-label">เลขไมล์ต้นทาง</label>
                    <div className="input-group">
                      <input
                        type="number"
                        className="form-control"
                        value={value?.startMile}
                        onChange={(e) => {
                          setValue((val) => ({
                            ...val,
                            startMile: e.target.value,
                          }));
                        }}
                      />
                    </div>
                  </div>
                </div>

                <div className="col-span-6">
                  <div className="form-group">
                    <label className="form-label">เลขไมล์ปลายทาง</label>
                    <div className="input-group">
                      <input
                        type="number"
                        className="form-control"
                        value={value?.endMile}
                        onChange={(e) => {
                          setValue((val) => ({
                            ...val,
                            endMile: e.target.value,
                          }));
                        }}
                      />
                    </div>
                  </div>
                </div>

                <div className="col-span-12">
                  <div className="form-group">
                    <label className="form-label">สถานที่ต้นทาง</label>
                    <div className="input-group">
                      <input
                        type="text"
                        className="form-control"
                        value={value?.startLocation}
                        onChange={(e) => {
                          setValue((val) => ({
                            ...val,
                            startLocation: e.target.value,
                          }));
                        }}
                      />
                    </div>
                  </div>
                </div>
                <div className="col-span-12">
                  <div className="form-group">
                    <label className="form-label">สถานที่ปลายทาง</label>
                    <div className="input-group">
                      <input
                        type="text"
                        className="form-control"
                        value={value?.endLocation}
                        onChange={(e) => {
                          setValue((val) => ({
                            ...val,
                            endLocation: e.target.value,
                          }));
                        }}
                      />
                    </div>
                  </div>
                </div>
                <div className="col-span-12">
                  <div>
                    <div className="form-group">
                      <label className="form-label">
                        รายละเอียด<span className="font-light">(ถ้ามี)</span>
                      </label>
                      <div className="input-group">
                        <input
                          type="text"
                          className="form-control"
                          value={value?.detail}
                          onChange={(e) => {
                            setValue((val) => ({
                              ...val,
                              detail: e.target.value,
                            }));
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-span-12 grid grid-cols-2 gap-4">
                  <div>
                    <button
                      type="button"
                      className="btn btn-secondary w-full"
                      onClick={() => modalRef.current?.close()}
                    >
                      ปิด
                    </button>
                  </div>
                  <div>
                    <button type="button" className="btn btn-primary w-full" onClick={handleSubmit}>
                      บันทึก
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    );
  }
);

RecordTravelAddModal.displayName = "RecordTravelAddModal";

export default RecordTravelAddModal;
