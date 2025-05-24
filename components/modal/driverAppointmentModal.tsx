import { DriverType } from "@/app/types/driver-user-type";
import DatePicker from "@/components/datePicker";
import FormHelper from "@/components/formHelper";
import TimePicker from "@/components/timePicker";
import { useFormContext } from "@/contexts/requestFormContext";
import { fetchDriverDetail } from "@/services/masterService";
import { convertToISO } from "@/utils/convertToISO";
import useSwipeDown from "@/utils/swipeDown";
import { yupResolver } from "@hookform/resolvers/yup";
import Image from "next/image";
import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";

interface DriverAppointmentModalProps {
  id?: string;
  onClickDetail?: string;
  onSubmit?: (date: string, time: string) => void;
}

const schema = yup.object().shape({
  pickupDatetime: yup.string(),
  pickupPlace: yup.string().required("กรุณาระบุสถานที่นัดหมาย"),
  masCarpoolDriverUid: yup.string(),
  pickupDate: yup.string().required("กรุณาเลือกวันที่นัดหมาย"),
  pickupTime: yup.string().required("กรุณาเลือกเวลานัดหมาย"),
});

const DriverAppointmentModal = forwardRef<
  { openModal: () => void; closeModal: () => void }, // Ref type
  DriverAppointmentModalProps // Props type
>(({ onSubmit, id, onClickDetail }, ref) => {
  const modalRef = useRef<HTMLDialogElement>(null);
  const { updateFormData } = useFormContext();
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

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    mode: "onChange",
    resolver: yupResolver(schema),
  });

  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [driver, setDriver] = useState<DriverType>();
  const [params] = useState({
    name: "",
    page: 1,
    limit: 10,
  });

  const handleDateChange = (dateStr: string) => {
    setSelectedDate(dateStr);
    setValue("pickupDate", dateStr);
  };

  const handleTimeChange = (dateStr: string) => {
    setSelectedTime(dateStr);
    setValue("pickupTime", dateStr);
  };

  useEffect(() => {
    console.log("id", id);
    if (id) {
      const fetchDriverData = async () => {
        try {
          const response = await fetchDriverDetail(String(id));
          if (response.status === 200) {
            setDriver(response.data);
            console.log(response.data);
          }
        } catch (error) {
          console.error("Error fetching requests:", error);
        }
      };
      fetchDriverData();
    }
  }, [id]);

  const onSubmitForm = (data: any) => {
    const pickup = convertToISO(selectedDate, selectedTime);
    updateFormData({
      pickupDatetime: pickup,
      pickupPlace: data.pickupPlace,
    });

    if (onSubmit) onSubmit(selectedDate, selectedTime);
    handleCloseModal();
  };

  const swipeDownHandlers = useSwipeDown(handleCloseModal);

  return (
    <div>
      {openModal && (
        <div className="modal modal-open">
          <div className="modal-box max-w-[500px] p-0 relative modal-vehicle-pick overflow-hidden flex flex-col max-h-[90vh]">
            <div className="bottom-sheet" {...swipeDownHandlers}>
              <div className="bottom-sheet-icon"></div>
            </div>
            <div className="modal-header bg-white sticky top-0 flex justify-between z-10">
              <div className="modal-title">เพิ่มข้อมูลนัดหมายพนักงานขับรถ</div>
              {/* <form method="dialog"> */}
              <button
                className="close btn btn-icon border-none bg-transparent shadow-none btn-tertiary"
                onClick={handleCloseModal}
              >
                <i className="material-symbols-outlined">close</i>
              </button>
              {/* </form> */}
            </div>
            <div className="modal-scroll-wrapper overflow-y-auto">
              <div className="modal-body">
                {id && (
                  <div className="card !bg-surface-secondary-subtle mb-3 !border-0 shadow-none outline-none">
                    <div className="card-body border-0 shadow-none outline-none">
                      <div className="flex items-center gap-5">
                        <div className="img img-square img-avatar">
                          <Image
                            src={`${driver?.driver_image || "/assets/img/avatar.svg"}`}
                            className="rounded-md"
                            width={64}
                            height={64}
                            alt={"driver"}
                          />
                        </div>
                        <div className="card-content">
                          <div className="card-content-top">
                            <div className="card-title">{driver?.driver_name}</div>
                            <div className="supporting-text-group">
                              <div className="supporting-text">{driver?.driver_dept_sap}</div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="card-item w-full flex items-center gap-2">
                        <i className="material-symbols-outlined text-brand-900">smartphone</i>
                        <span className="card-item-text">{driver?.driver_contact_number}</span>
                      </div>
                    </div>
                  </div>
                )}
                <form onSubmit={handleSubmit(onSubmitForm)} method="dialog" className="w-full">
                  <div className="grid grid-cols-12 pb-5 gap-4">
                    <div className="col-span-12">
                      <div className="form-group">
                        <label className="form-label">สถานที่นัดหมาย</label>
                        <div className="input-group">
                          <div className="input-group-prepend select-none">
                            <span className="input-group-text">
                              <i className="material-symbols-outlined">location_on</i>
                            </span>
                          </div>
                          <input
                            type="text"
                            className="form-control select-none"
                            placeholder="ระบุสถานที่นัดหมาย"
                            {...register("pickupPlace")}
                          />
                        </div>
                        {errors.pickupPlace && <FormHelper text={String(errors.pickupPlace.message)} />}
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
                          <DatePicker placeholder="01/01/2567" onChange={handleDateChange} />
                        </div>
                        {errors.pickupDate && <FormHelper text={String(errors.pickupDate.message)} />}
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
                          <TimePicker onChange={handleTimeChange} placeholder="ระบุเวลานัดหมาย" />
                        </div>
                        {errors.pickupTime && <FormHelper text={String(errors.pickupTime.message)} />}
                      </div>
                    </div>
                  </div>

                  <div className="modal-action sticky bottom-0 gap-3 mt-0 w-full">
                    <button type="button" className="btn btn-secondary" onClick={handleCloseModal}>
                      ยกเลิก
                    </button>
                    <button type="submit" className="btn btn-primary">
                      ยืนยัน
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
          {/* <form method="dialog" className="modal-backdrop">
            <button>close</button>
          </form> */}
        </div>
      )}
    </div>
  );
});

DriverAppointmentModal.displayName = "DriverAppointmentModal";

export default DriverAppointmentModal;
