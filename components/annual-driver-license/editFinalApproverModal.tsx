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
import useSwipeDown from "@/utils/swipeDown";
import CustomSelectApprover, {
  CustomSelectOption,
} from "./customSelectApprover";
import { DriverLicenseCardType, VehicleUserType } from "@/app/types/vehicle-user-type";
import { fetchUserApprovalLic, fetchUserFinalApprovalLic } from "@/services/masterService";
import { updateAnnualApprover } from "@/services/driver";

interface VehicleUserModalProps {
  requestData?: DriverLicenseCardType;
  title?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onUpdate?: (data: any) => void;
  onBack?: () => void;
}

const schema = yup.object().shape({
  name: yup.string(),
  position: yup.string(),
});

const EditFinalApproverModal = forwardRef<
  { openModal: () => void; closeModal: () => void },
  VehicleUserModalProps
>(({ onUpdate, requestData, title, onBack }, ref) => {
  const modalRef = useRef<HTMLDialogElement>(null);
  const hasReset = useRef(false);
  const [driverOptions, setDriverOptions] = useState<CustomSelectOption[]>([]);
  const [selectedVehicleUserOption, setSelectedVehicleUserOption] =
    useState<CustomSelectOption | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useImperativeHandle(ref, () => ({
    openModal: () => {
      hasReset.current = false;
      modalRef.current?.showModal();
    },
    closeModal: () => modalRef.current?.close(),
  }));

  const { control, handleSubmit, reset, setValue } = useForm({
    mode: "onChange",
    resolver: yupResolver(schema),
    defaultValues: {
      name: "",
      position: "",
    },
  });

  const handleVehicleUserChange = (selectedOption: CustomSelectOption | null) => {
    const fullOption = selectedOption 
      ? driverOptions.find(opt => opt.value === selectedOption.value) 
      : null;
    
    setSelectedVehicleUserOption(fullOption || null);
    setValue("position", fullOption?.posi_text || "");
    setValue("name", fullOption?.label || "");
  };

  useEffect(() => {
    const fetchVehicleUserData = async () => {
      setIsLoading(true);
      try {
        const response = await fetchUserFinalApprovalLic();
        if (response.status === 200) {
          const vehicleUserData: VehicleUserType[] = response.data;
          const driverOptionsArray = vehicleUserData.map(
            (user: VehicleUserType) => ({
              value: user.emp_id,
              label: `${user.full_name} (${user.dept_sap})`,
              posi_text: user.posi_text,
            })
          );

          setDriverOptions(driverOptionsArray);
          
          // Set default selected approver if requestData exists
          // if (requestData?.approved_request_emp_id) {
          //   const defaultApprover = driverOptionsArray.find(
          //     opt => opt.value === requestData.approved_request_emp_id
          //   );
            
          //   if (defaultApprover) {
          //     setSelectedVehicleUserOption(defaultApprover);
          //     setValue("name", defaultApprover.label);
          //     setValue("position", defaultApprover.posi_text);
          //   }
          // }
        }
      } catch (error) {
        console.error("Error fetching requests:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchVehicleUserData();
  }, [requestData, reset, setValue]);

  // useEffect(() => {
  //   if (modalRef.current?.open && requestData?.approved_request_emp_id && driverOptions.length > 0) {
  //     const defaultApprover = driverOptions.find(
  //       opt => opt.value === requestData.approved_request_emp_id
  //     );
      
  //     if (defaultApprover) {
  //       setSelectedVehicleUserOption(defaultApprover);
  //       // setValue("name", defaultApprover.label);
  //       // setValue("position", defaultApprover.posi_text);
  //     }
  //   }
  // }, [modalRef.current?.open, requestData, driverOptions, setValue]);

  const onSubmit = async (data: any) => {

    const payload = {
      trn_request_annual_driver_uid: requestData?.trn_request_annual_driver_uid,
      approved_request_emp_id: selectedVehicleUserOption?.value
    };
console.log('payload',payload);
    try {
      const response = await updateAnnualApprover(payload);
      
      if (response) {
        if (onUpdate) onUpdate(response.data);
        modalRef.current?.close();
      }
    } catch (error) {
      console.error("Network error:", error);
      alert("Failed to update approver due to network error.");
    }
  };

  const swipeDownHandlers = useSwipeDown(() => modalRef.current?.close());

  return (
    <dialog ref={modalRef} className="modal">
      <div
        className="modal-box max-w-[500px] p-0 relative modal-vehicle-pick overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => {
          e.stopPropagation();
          e.preventDefault();
        }}
      >
        <div className="bottom-sheet" {...swipeDownHandlers}>
          <div className="bottom-sheet-icon"></div>
        </div>
        <div className="modal-header bg-white sticky top-0 flex justify-between z-10">
          <div className="modal-title flex items-center">
            {onBack && (
              <i
                className="material-symbols-outlined cursor-pointer"
                onClick={() => {
                  modalRef.current?.close();
                  if (onBack) {
                    onBack();
                  }
                }}
              >
                keyboard_arrow_left
              </i>
            )}
            {title}
          </div>
          <form method="dialog">
            <button
              className="close btn btn-icon border-none bg-transparent shadow-none btn-tertiary"
              onClick={() => modalRef.current?.close()}
            >
              <i className="material-symbols-outlined">close</i>
            </button>
          </form>
        </div>
        <div className="modal-body overflow-y-auto">
          {isLoading ? (
            <div className="flex justify-center items-center h-32">
              <span className="loading loading-spinner loading-lg"></span>
            </div>
          ) : (
            <div className="grid grid-cols-12 gap-4">
              <div className="col-span-12">
                <div className="form-group">
                  <label className="form-label">ผู้ใช้ยานพาหนะ</label>
                  <CustomSelectApprover
                    iconName="person"
                    w="w-full"
                    options={driverOptions}
                    value={selectedVehicleUserOption}
                    onChange={handleVehicleUserChange}
                  />
                </div>
              </div>
              <div className="col-span-12">
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
            </div>
          )}
        </div>
        <div className="modal-action sticky bottom-0 gap-3 mt-0">
          <button 
            className="btn btn-primary" 
            onClick={handleSubmit(onSubmit)}
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="loading loading-spinner"></span>
            ) : (
              "บันทึก"
            )}
          </button>
        </div>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>
  );
});

EditFinalApproverModal.displayName = "EditFinalApproverModal";

export default EditFinalApproverModal;