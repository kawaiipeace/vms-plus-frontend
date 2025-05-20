// EditApproverModal.tsx
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
import { VehicleUserType } from "@/app/types/vehicle-user-type";
import { fetchUserApprovalLic } from "@/services/masterService";
import { RequestAnnualDriver } from "@/app/types/driver-lic-list-type";

interface EditApproverModalProps {
  title: string;
  requestData?: RequestAnnualDriver;
  onUpdate?: (data: VehicleUserType) => void;
  onBack?: () => void;
}

const schema = yup.object().shape({
  name: yup.string(),
  position: yup.string(),
});

const EditApproverModal = forwardRef<
  { openModal: () => void; closeModal: () => void },
  EditApproverModalProps
>(({ title, requestData, onUpdate, onBack }, ref) => {
  const modalRef = useRef<HTMLDialogElement>(null);
  const [driverOptions, setDriverOptions] = useState<CustomSelectOption[]>([]);
  const [selectedVehicleUserOption, setSelectedVehicleUserOption] =
    useState<CustomSelectOption | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useImperativeHandle(ref, () => ({
    openModal: () => {
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
    setSelectedVehicleUserOption(selectedOption);
    if (selectedOption) {
      setValue("position", selectedOption.posi_text || "");
      // setValue("name", selectedOption.full_name || selectedOption.label || "");
    } else {
      setValue("position", "");
      setValue("name", "");
    }
  };

  useEffect(() => {
    console.log('resquset',requestData);
    const fetchVehicleUserData = async () => {
      setIsLoading(true);
      try {
        const response = await fetchUserApprovalLic();
        if (response.status === 200) {
          const vehicleUserData: VehicleUserType[] = response.data;
          const driverOptionsArray = vehicleUserData.map(
            (user: VehicleUserType) => ({
              value: user.emp_id,
              label: `${user.full_name} (${user.dept_sap_short})`,
              posi_text: user.posi_text,
              dept_sap: user.dept_sap,
              dept_sap_short: user.dept_sap_short,
              full_name: user.full_name,
              image_url: user.image_url,
              tel_mobile: user.tel_mobile,
              tel_internal: user.tel_internal,
            })
          );

          setDriverOptions(driverOptionsArray);
          
          // Set default approver if requestData has approved_request_emp_id
          if (requestData?.approved_request_emp_id) {
            const defaultApprover = driverOptionsArray.find(
              opt => opt.value === requestData.approved_request_emp_id
            );
            
            if (defaultApprover) {
              setSelectedVehicleUserOption(defaultApprover);
              setValue("name", defaultApprover.full_name || defaultApprover.label || "");
              setValue("position", defaultApprover.posi_text || "");
            }
          }
        }
      } catch (error) {
        console.error("Error fetching approvers:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchVehicleUserData();
  }, [requestData]);

  const onSubmit = async () => {
    if (!selectedVehicleUserOption) return;

    try {
      if (onUpdate) {
        onUpdate({
          emp_id: selectedVehicleUserOption.value,
          full_name: selectedVehicleUserOption.full_name || "",
          posi_text: selectedVehicleUserOption.posi_text || "",
          dept_sap_short: selectedVehicleUserOption.dept_sap_short || "",
          image_url: selectedVehicleUserOption.image_url || "",
          tel_mobile: selectedVehicleUserOption.tel_mobile || "",
          tel_internal: selectedVehicleUserOption.tel_internal || "",
        });
        if(onBack) onBack();
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
          <div className="grid grid-cols-12 gap-4">
            <div className="col-span-12">
              <div className="form-group">
                <label className="form-label">ผู้อนุมัติ</label>
                <CustomSelectApprover
                  iconName="person"
                  w="w-full"
                  options={driverOptions}
                  value={selectedVehicleUserOption}
                  onChange={handleVehicleUserChange}
                  isLoading={isLoading}
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
        </div>
        <div className="modal-action sticky bottom-0 gap-3 mt-0">
          <button 
            className="btn btn-primary" 
            onClick={handleSubmit(onSubmit)}
            disabled={isLoading || !selectedVehicleUserOption}
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

EditApproverModal.displayName = "EditApproverModal";

export default EditApproverModal;