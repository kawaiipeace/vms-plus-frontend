import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import CustomSelect from "../customSelect";
import { fetchUserApproverUsers } from "@/services/masterService";
import { ApproverUserType } from "@/app/types/approve-user-type";
import { useFormContext } from "@/contexts/requestFormContext";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";


interface Props {
  onUpdate?: (data: any) => void;
}

const schema = yup.object().shape({
  approvedRequestDeptSap: yup.string(),
  approvedRequestDeptSapFull: yup.string(),
  approvedRequestDeptSapShort: yup.string(),
  approvedRequestEmpId: yup.string(),
  approvedRequestEmpName: yup.string(),
});


const ApproverModal = forwardRef<
  { openModal: () => void; closeModal: () => void },
  Props
>(({ onUpdate }, ref) => {
  const modalRef = useRef<HTMLDialogElement>(null);
  const { formData, updateFormData } = useFormContext();

    const { handleSubmit } = useForm({
      mode: "onChange",
      resolver: yupResolver(schema),
    });
    
  const [driverOptions, setDriverOptions] = useState<
    { value: string; label: string }[]
  >([]);
  const [costName, setCostName] = useState<string>("");

  const [selectedVehicleUserOption, setSelectedVehicleUserOption] = useState(
    driverOptions[0]
  );

  const [vehicleUserDatas, setVehicleUserDatas] = useState<ApproverUserType[]>(
    []
  );

  useImperativeHandle(ref, () => ({
    openModal: () => modalRef.current?.showModal(),
    closeModal: () => modalRef.current?.close(),
  }));

  useEffect(() => {
    const fetchApprover = async () => {
      try {
        const response = await fetchUserApproverUsers("");
        if (response.status === 200) {
          const vehicleUserData = response.data;
          setVehicleUserDatas(vehicleUserData);

          const driverOptionsArray = vehicleUserData.map((user: ApproverUserType) => ({
            value: user.emp_id,
            label: `${user.full_name} (${user.dept_sap})`,
          }));

          setDriverOptions(driverOptionsArray);

          // Find selected user based on formData.approvedRequestEmpId
          const selectedUser = vehicleUserData.find(
            (user: ApproverUserType) => user.emp_id === formData.approvedRequestEmpId
          );

          if (selectedUser) {
            setSelectedVehicleUserOption({
              value: selectedUser.emp_id,
              label: `${selectedUser.full_name} (${selectedUser.dept_sap})`,
            });

            setCostName(selectedUser.dept_sap); // Set costName
          } else {
            setSelectedVehicleUserOption(driverOptionsArray[0]);
            setCostName(
              driverOptionsArray[0]?.label.split("(")[1]?.replace(")", "") || ""
            );
          }
        }
      } catch (error) {
        console.error("Error fetching requests:", error);
      }
    };

    fetchApprover();
  }, []);

  const onSubmit = (data: any) => {

    const selectedUser = vehicleUserDatas.find(
      (user) => user.emp_id === selectedVehicleUserOption?.value
    );
    if(onUpdate)
    onUpdate({
      ...data,
      approvedRequestDeptSap: selectedUser?.dept_sap || "",
      approvedRequestDeptSapFull: selectedUser?.dept_sap_full || "",
      approvedRequestDeptSapShort: selectedUser?.dept_sap_short || "",
      approvedRequestEmpId: selectedUser?.emp_id || "",
      approvedRequestEmpName: selectedUser?.full_name || "",
    });

    updateFormData({
      approvedRequestDeptSap: selectedUser?.dept_sap || "",
      approvedRequestDeptSapFull: selectedUser?.dept_sap_full || "",
      approvedRequestDeptSapShort: selectedUser?.dept_sap_short || "",
      approvedRequestEmpId: selectedUser?.emp_id || "",
      approvedRequestEmpName: selectedUser?.full_name || "",
    });

    modalRef.current?.close();
  };


  return (
    <dialog ref={modalRef} id="my_modal_1" className="modal">
      <div className="modal-box max-w-[500px] p-0 relative modal-vehicle-pick overflow-hidden flex flex-col max-h-[90vh]">
        <div className="bottom-sheet">
          <div className="bottom-sheet-icon"></div>
        </div>
        <div className="modal-header bg-white sticky top-0 flex justify-between z-10">
          <div className="modal-title">ผู้อนุมัติต้นสังกัด</div>
          <form method="dialog">
            <button className="close btn btn-icon border-none bg-transparent shadow-none btn-tertiary">
              <i className="material-symbols-outlined">close</i>
            </button>
          </form>
        </div>
        <div className="modal-body overflow-y-auto">
          <div className="grid grid-cols-12 gap-4">
            <div className="col-span-12">
              <div className="form-group">
                <label className="form-label">ผู้อนุมัติต้นสังกัด</label>

                <CustomSelect
                  iconName="person"
                  w="w-full"
                  options={driverOptions}
                  value={selectedVehicleUserOption}
                  onChange={(option) => {
                    setSelectedVehicleUserOption(option);
                    const selectedUser = vehicleUserDatas.find(
                      (user) => user.emp_id === option.value
                    );
                    setCostName(selectedUser?.dept_sap || ""); // Update costName when selecting an option
                  }}
                />
              </div>
            </div>

            <div className="col-span-12">
              <div className="form-group">
                <label className="form-label">ตำแหน่ง / สังกัด</label>
                <div className="input-group is-readonly">
                  <div className="input-group-prepend">
                    <span className="input-group-text">
                      <i className="material-symbols-outlined">
                        business_center
                      </i>
                    </span>
                  </div>
                  <input
                    type="text"
                    className="form-control"
                    value={costName}
                    placeholder=""
                    readOnly
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
            <button className="btn btn-primary" onClick={handleSubmit(onSubmit)}>ยืนยัน</button>
        </div>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>
  );
});

ApproverModal.displayName = "ApproverModal";

export default ApproverModal;
