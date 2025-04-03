import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import CustomSelect from "../customSelect";
import { fetchUserApproverUsers } from "@/services/masterService";
import { ApproverUserType } from "@/app/types/approve-user-type";

const ApproverModal = forwardRef((_, ref) => {
  const modalRef = useRef<HTMLDialogElement>(null);
    const [driverOptions, setDriverOptions] = useState<
      { value: string; label: string }[]
    >([]);

    const [selectedVehicleUserOption, setSelectedVehicleUserOption] = useState(
      driverOptions[0]
    );

    const [vehicleUserDatas, setVehicleUserDatas] = useState<ApproverUserType[]>([]);

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
               console.log("user", vehicleUserData);

               setVehicleUserDatas(vehicleUserData);
               const driverOptionsArray = [
                 ...vehicleUserData.map(
                   (user: {
                     emp_id: string;
                     full_name: string;
                     dept_sap: string;
                   }) => ({
                     value: user.emp_id,
                     label: `${user.full_name} (${user.dept_sap})`,
                   })
                 ),
               ];
     
               setDriverOptions(driverOptionsArray);
             }
           } catch (error) {
             console.error("Error fetching requests:", error);
           }
         };
  
         fetchApprover();
    }, []);

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
                <div className="input-group">
                  <div className="input-group-prepend">
                    <span className="input-group-text">
                      <i className="material-symbols-outlined">person</i>
                    </span>
                  </div>
                  <CustomSelect
                                       iconName="person"
                                       w="w-full"
                                       options={driverOptions}
                                       value={selectedVehicleUserOption}
                                       onChange={setSelectedVehicleUserOption}
                                     />
                </div>
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
                    placeholder=""
                    defaultValue="นรค.6 กอพ.1 ฝพจ."
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
            <button className="btn btn-primary">ยืนยัน</button>
          </form>
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
