import { updateSendback } from "@/services/bookingUser";
import useSwipeDown from "@/utils/swipeDown";
import { useRouter } from "next/navigation";
import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import CustomSelect from "../customSelect";
import { getCarpoolAdmin } from "@/services/carpoolManagement";

interface Props {
  id: string;
  title: string;
  desc: string;
  confirmText: string;
}

const AddCarpoolAdminModal = forwardRef<
  { openModal: () => void; closeModal: () => void }, // Ref type
  Props
>(({ id, title, desc, confirmText }, ref) => {
  // Destructure `process` from props
  const modalRef = useRef<HTMLDialogElement>(null);
  const [admins, setAdmins] = useState([]);

  useImperativeHandle(ref, () => ({
    openModal: () => modalRef.current?.showModal(),
    closeModal: () => modalRef.current?.close(),
  }));

  useEffect(() => {
    const fetchCarpoolAdminFunc = async () => {
      try {
        const response = await getCarpoolAdmin();
        const result = response.data;
        console.log("response: ", response);
        setAdmins(result);
      } catch (error) {
        console.error("Error fetching status data:", error);
      }
    };

    fetchCarpoolAdminFunc();
  }, []);

  const router = useRouter();

  const handleConfirm = () => {
    const sendCancelRequest = async () => {
      try {
        const payload = {
          rejected_request_reason: "",
          trn_request_uid: id,
        };
        const res = await updateSendback(payload);

        if (res) {
          modalRef.current?.close();
          router.push("/vehicle-booking/request-list/" + id);
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
          <div className="modal-header bg-white sticky top-0 flex justify-between z-10">
            <div className="modal-title">เพิ่มผู้ดูแลยานพาหนะ</div>
            <form method="dialog">
              <button className="close btn btn-icon border-none bg-transparent shadow-none btn-tertiary">
                <i className="material-symbols-outlined">close</i>
              </button>
            </form>
          </div>

          <div className="modal-body overflow-y-auto text-center">
            <form>
              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2">
                  <div className="form-group">
                    <label className="form-label">ผู้ใช้ยานพาหนะ</label>
                    <CustomSelect
                      iconName="person"
                      w="w-full"
                      options={[]}
                      // value={selectedVehicleUserOption}
                      // {...register("admin_emp_no")}
                      onChange={() => {}}
                    />
                  </div>
                </div>

                <div className="col-span-2">
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
                        className="form-control pointer-events-none"
                        // {...register("admin_dept_sap")}
                        placeholder="ระบุตำแหน่ง / สังกัด"
                        readOnly
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <div className="form-group">
                    <label className="form-label">เบอร์ภายใน</label>
                    <div className="input-group">
                      <div className="input-group-prepend">
                        <span className="input-group-text">
                          <i className="material-symbols-outlined">call</i>
                        </span>
                      </div>
                      <input
                        type="text"
                        className="form-control"
                        // {...register("admin_emp_no")}
                        placeholder="ระบุเบอร์ภายใน"
                        // readOnly
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <div className="form-group">
                    <label className="form-label">เบอร์โทรศัพท์</label>
                    <div className="input-group">
                      <div className="input-group-prepend">
                        <span className="input-group-text">
                          <i className="material-symbols-outlined">
                            smartphone
                          </i>
                        </span>
                      </div>
                      <input
                        type="text"
                        className="form-control"
                        // {...register("mobile_contact_number")}
                        placeholder="ระบุเบอร์โทรศัพท์"
                        // readOnly
                      />
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </div>

          <div className="modal-footer p-5 grid grid-cols-4 gap-3 border-t border-[#eaecf0]">
            <form method="dialog" className="col-span-1 col-start-3">
              <button className="btn btn-secondary w-full">ปิด</button>
            </form>
            <button
              type="button"
              className="btn btn-primary col-span-1"
              onClick={handleConfirm}
            >
              เพิ่ม
            </button>
          </div>
        </div>

        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    </>
  );
});

AddCarpoolAdminModal.displayName = "AddCarpoolAdminModal";

export default AddCarpoolAdminModal;
