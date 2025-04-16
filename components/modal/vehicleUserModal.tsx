import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
} from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useFormContext } from "@/contexts/requestFormContext";
import FormHelper from "@/components/formHelper";
import { updateVehicleUser } from "@/services/bookingUser";
import { RequestDetailType } from "@/app/types/request-detail-type";
import useSwipeDown from "@/utils/swipeDown";

interface VehicleUserModalProps {
  process: string;
  requestData?: RequestDetailType;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onUpdate?: (data: any) => void;
}

const schema = yup.object().shape({
  name: yup.string(),
  position: yup.string(),
  internalPhone: yup.string().optional(),
  mobilePhone: yup
    .string()
    .matches(/^\d{10}$/, "กรุณากรอกเบอร์โทรศัพท์ให้ถูกต้อง")
    .required("กรุณากรอกเบอร์โทรศัพท์"),
});

const VehicleUserModal = forwardRef<
  { openModal: () => void; closeModal: () => void },
  VehicleUserModalProps
>(({ process, onUpdate, requestData }, ref) => {
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

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    mode: "onChange",
    resolver: yupResolver(schema),
    defaultValues: {
      name: formData.vehicleUserEmpName || "",
      position: formData.deptSapShort || "",
      internalPhone: formData.telInternal || "",
      mobilePhone: formData.telMobile || "",
    },
  });

  useEffect(() => {
 
          if (requestData) {
            reset({
              name: requestData.vehicle_user_emp_name,
              position: requestData.vehicle_user_dept_sap,
              internalPhone: requestData.car_user_mobile_contact_number,
              mobilePhone: requestData.car_user_mobile_contact_number,
            });
            hasReset.current = true;
          }
       
  }, [requestData, reset]);


  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onSubmit = async (data: any) => {
    if (requestData) {
      const payload = {
        car_user_internal_contact_number: data.internalPhon,
        car_user_mobile_contact_number: data.mobilePhone,
        trn_request_uid: requestData?.trn_request_uid,
      };
      try {
        const response = await updateVehicleUser(payload);

        if (response) {
          if (onUpdate) onUpdate(response.data);
          modalRef.current?.close();
        }
      } catch (error) {
        console.error("Network error:", error);
        alert("Failed to update trip due to network error.");
      }
    } else {
    if (onUpdate)
      onUpdate({
        ...data,
        telInternal: data.internalPhone,
        telMobile: data.mobilePhone,
      });

    data.telInternal = data.internalPhone;
    data.telMobile = data.mobilePhone;
    updateFormData(data);
    modalRef.current?.close();
    }
  };
  const swipeDownHandlers = useSwipeDown(() => modalRef.current?.close());

  return (
    <dialog ref={modalRef} className="modal">
      <div  className="modal-box max-w-[500px] p-0 relative modal-vehicle-pick overflow-hidden flex flex-col max-h-[90vh]">
        <div className="bottom-sheet" {...swipeDownHandlers} >
          <div className="bottom-sheet-icon"></div>
        </div>
        <div className="modal-header bg-white sticky top-0 flex justify-between z-10">
          <div className="modal-title">
            {process === "edit"
              ? "แก้ไขข้อมูลผู้ใช้ยานพาหนะ"
              : "ข้อมูลผู้ใช้ยานพาหนะ"}
          </div>
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
                <label className="form-label">ผู้ใช้ยานพาหนะ</label>
                <div className="input-group is-readonly select-none">
                  <Controller
                    name="name"
                    control={control}
                    render={({ field }) => (
                      <input
                        type="text"
                        className="form-control pointer-events-none"
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
                <label className="form-label">ตำแหน่ง / สังกัด</label>
                <div className="input-group is-readonly">
                  <Controller
                    name="position"
                    control={control}
                    render={({ field }) => (
                      <input
                        type="text"
                        className="form-control pointer-events-none"
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
                <label className="form-label">เบอร์ภายใน</label>
                <div
                  className={`input-group ${
                    errors.internalPhone && "is-invalid"
                  }`}
                >
                  <Controller
                    name="internalPhone"
                    control={control}
                    render={({ field }) => (
                      <input type="text" className="form-control" {...field} />
                    )}
                  />
                </div>
                {errors.internalPhone && (
                  <FormHelper text={String(errors.internalPhone.message)} />
                )}
              </div>
            </div>
            <div className="col-span-12 md:col-span-6">
              <div className="form-group">
                <label className="form-label">เบอร์โทรศัพท์</label>
                <div
                  className={`input-group ${
                    errors.mobilePhone && "is-invalid"
                  }`}
                >
                  <Controller
                    name="mobilePhone"
                    control={control}
                    render={({ field }) => (
                      <input type="text" className="form-control" {...field} />
                    )}
                  />
                </div>
                {errors.mobilePhone && (
                  <FormHelper text={String(errors.mobilePhone.message)} />
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="modal-action sticky bottom-0 gap-3 mt-0">
          <form method="dialog">
            <button className="btn btn-secondary">ปิด</button>
          </form>
          <button className="btn btn-primary" onClick={handleSubmit(onSubmit)}>
            ยืนยัน
          </button>
        </div>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>
  );
});

VehicleUserModal.displayName = "VehicleUserModal";

export default VehicleUserModal;
