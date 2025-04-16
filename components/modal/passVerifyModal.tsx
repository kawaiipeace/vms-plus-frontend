import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import Image from "next/image";
import CustomSelect from "../customSelect";
import useSwipeDown from "@/utils/swipeDown";
import { useRouter } from "next/navigation";
import { adminApproveRequest } from "@/services/bookingAdmin";
import { fetchVehicleUsers } from "@/services/masterService";
import { VehicleUserType } from "@/app/types/vehicle-user-type";
import { convertToBuddhistDateTime } from "@/utils/converToBuddhistDateTime";

interface Props {
  title: string;
  desc: string | React.ReactNode;
  id: string;
  role?: string;
  confirmText: string;
  place?: string;
  start_datetime?: string;
  end_datetime?: string;
  statusCode?: string;
}

const PassVerifyModal = forwardRef<
  { openModal: () => void; closeModal: () => void },
  Props
>(
  (
    { id, title, role, desc, confirmText, place, start_datetime, end_datetime, statusCode },
    ref
  ) => {
    const modalRef = useRef<HTMLDialogElement>(null);

    useImperativeHandle(ref, () => ({
      openModal: () => modalRef.current?.showModal(),
      closeModal: () => modalRef.current?.close(),
    }));

    const [vehicleUserDatas, setVehicleUserDatas] = useState<VehicleUserType[]>(
      []
    );
    const [driverOptions, setDriverOptions] = useState<
      { value: string; label: string }[]
    >([]);
    const [selectedVehicleUserOption, setSelectedVehicleUserOption] = useState<{
      value: string;
      label: string;
    } | null>(null);
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
              const defaultUser = vehicleUserData.find(
                (user) => user.emp_id === driverOptionsArray[0].value
              );
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

    const handleVehicleUserChange = async (selectedOption: {
      value: string;
      label: string;
    }) => {
      setSelectedVehicleUserOption(selectedOption);

      const empData = vehicleUserDatas.find(
        (user) => user.emp_id === selectedOption.value
      );

      if (empData) {
        setSelectedUserDept(empData.dept_sap_short || "");
      }
    };

    const handleConfirm = () => {
      const sendCancelRequest = async () => {
        try {
          const payload = {
            trn_request_uid: id,
            approved_request_emp_id: selectedVehicleUserOption?.value || "",
            ref_request_status_code: statusCode || "",
          };

          const res = await adminApproveRequest(payload);
          console.log('approve',res);

          if (res) {
            modalRef.current?.close();

            role === "firstApprover"
              ? router.push(
                  "/administrator/booking-approver?approve-req=success&request-id=" +
                    res.data.result?.request_no
                )
              : router.push(
                  "/vehicle-booking/request-list?approve-req=success&request-id=" +
                    res.data.result?.request_no
                );
          }
        } catch (error) {
          console.error("error:", error);
        }
      };

      sendCancelRequest();
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
              <div className="confirm-title text-xl font-medium px-5">
                {title}
              </div>
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
                              <i className="material-symbols-outlined">
                                business_center
                              </i>
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

                    <div className="col-span-12 md:col-span-6">
                      <div className="form-group">
                        <label className="form-label">สถานที่รับกุญแจ</label>
                        <input
                          type="text"
                          className="form-control"
                          disabled={true}
                          placeholder=""
                          defaultValue={place}
                        />
                      </div>
                    </div>

                    <div className="col-span-12 md:col-span-6">
                      <div className="form-group">
                        <label className="form-label">วันที่นัดรับกุญแจ</label>
                        <input
                          type="text"
                          className="form-control"
                          disabled={true}
                          placeholder=""
                          defaultValue={
                            convertToBuddhistDateTime(String(start_datetime))
                              .date
                          }
                        />
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
                <button
                  type="button"
                  className="btn btn-primary col-span-1"
                  onClick={handleConfirm}
                >
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
