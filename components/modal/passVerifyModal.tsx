import { VehicleUserType } from "@/app/types/vehicle-user-type";
import { adminApproveRequest } from "@/services/bookingAdmin";
import { fetchVehicleUsers } from "@/services/masterService";
import useSwipeDown from "@/utils/swipeDown";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import CustomSelect, { CustomSelectOption } from "../customSelect";

interface Props {
  title: string;
  desc: string | React.ReactNode;
  id: string;
  role?: string;
  confirmText: string;
  pickupData?: { place: string; datetime: string } | null;
  onBack?: () => void;
}

const PassVerifyModal = forwardRef<{ openModal: () => void; closeModal: () => void }, Props>(
  ({ id, title, role, desc, confirmText, pickupData, onBack }, ref) => {
    const modalRef = useRef<HTMLDialogElement>(null);

    useImperativeHandle(ref, () => ({
      openModal: () => modalRef.current?.showModal(),
      closeModal: () => modalRef.current?.close(),
    }));

    const [vehicleUserDatas, setVehicleUserDatas] = useState<VehicleUserType[]>([]);
    const [driverOptions, setDriverOptions] = useState<{ value: string; label: string }[]>([]);
    const [selectedVehicleUserOption, setSelectedVehicleUserOption] = useState<CustomSelectOption | null>(null);
    const [selectedUserDept, setSelectedUserDept] = useState("");

    const router = useRouter();

    useEffect(() => {
      const fetchRequests = async () => {
        try {
          const response = await fetchVehicleUsers("");
          if (response.status === 200) {
            const vehicleUserData: VehicleUserType[] = response.data;
            setVehicleUserDatas(vehicleUserData);
            const driverOptionsArray = vehicleUserData.map((user) => ({
              value: user.emp_id,
              label: `${user.full_name} (${user.dept_sap})`,
            }));
            setDriverOptions(driverOptionsArray);

            // Optional: Set default selected user
            if (driverOptionsArray.length > 0) {
              setSelectedVehicleUserOption(driverOptionsArray[0]);
              const defaultUser = vehicleUserData.find((user) => user.emp_id === driverOptionsArray[0].value);
              if (defaultUser) {
                setSelectedUserDept(defaultUser.dept_sap_short);
              }
            }
          }
        } catch (error) {
          console.error("Error fetching requests:", error);
        }
      };
      fetchRequests();
    }, []);

    const handleVehicleUserChange = async (selectedOption: CustomSelectOption) => {
      setSelectedVehicleUserOption(selectedOption);

      const empData = vehicleUserDatas.find((user) => user.emp_id === selectedOption.value);

      if (empData) {
        setSelectedUserDept(empData.dept_sap_short || "");
      }
    };

    const handleConfirm = () => {
      const sendApprove = async () => {
        try {
          const payload = {
            trn_request_uid: id,
            approved_request_emp_id: selectedVehicleUserOption?.value || "",
            received_key_place: pickupData?.place || "",
            received_key_start_datetime: pickupData?.datetime || "",
          };

          const res = await adminApproveRequest(payload);
          console.log("approve", res);

          if (res) {
            modalRef.current?.close();

            router.push("/administrator/request-list?approve-req=success&request-id=" + res.data.result?.request_no);
          }
        } catch (error) {
          console.error("error:", error);
        }
      };

      sendApprove();
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
              <Image
                src="/assets/img/graphic/confirm_verify.svg"
                className="w-full confirm-img"
                width={100}
                height={100}
                alt=""
              />
              <div className="confirm-title text-xl font-medium px-5">{title}</div>
              <div className="confirm-text text-base">{desc}</div>
              <div className="confirm-form mt-4 px-5">
                <div className="form-group">
                  <label className="form-label">ผู้อนุมัติใช้ยานพาหนะ</label>
                  <div className="grid grid-cols-12 gap-4">
                    <div className="col-span-12">
                      <div className="form-group text-left">
                        <CustomSelect
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
                          <div className="input-group-prepend">
                            <span className="input-group-text">
                              <i className="material-symbols-outlined">business_center</i>
                            </span>
                          </div>
                          <input
                            type="text"
                            className="form-control"
                            placeholder=""
                            value={selectedUserDept}
                            readOnly
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="modal-action sticky bottom-0 gap-3 mt-0">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => {
                    modalRef.current?.close();
                    onBack?.();
                  }}
                >
                  ย้อนกลับ
                </button>
                <button type="button" className="btn btn-primary col-span-1" onClick={handleConfirm}>
                  {confirmText}
                </button>
              </div>
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

PassVerifyModal.displayName = "PassVerifyModal";

export default PassVerifyModal;
