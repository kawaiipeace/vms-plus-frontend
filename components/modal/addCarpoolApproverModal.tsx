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
import CustomSelect, { CustomSelectOption } from "../customSelect";
import {
  getCarpoolApprover,
  postCarpoolApproverCreate,
} from "@/services/carpoolManagement";
import { CarpoolApprover } from "@/app/types/carpool-management-type";
import { useFormContext } from "@/contexts/carpoolFormContext";

interface Props {
  id: string;
  title: string;
  desc: string;
  confirmText: string;
}

const AddCarpoolApproverModal = forwardRef<
  { openModal: () => void; closeModal: () => void }, // Ref type
  Props
>(({ id, title, desc, confirmText }, ref) => {
  // Destructure `process` from props
  const modalRef = useRef<HTMLDialogElement>(null);
  const [approver, setApprover] = useState<CarpoolApprover[]>([]);
  const [selectedApprover, setSelectedApprover] =
    useState<CustomSelectOption>();
  const [internal_contact_number, setInternalContactNumber] =
    useState<string>();
  const [mobile_contact_number, setMobileContactNumber] = useState<string>();

  const { formData } = useFormContext();

  useImperativeHandle(ref, () => ({
    openModal: () => modalRef.current?.showModal(),
    closeModal: () => modalRef.current?.close(),
  }));

  useEffect(() => {
    const fetchCarpoolApproverFunc = async () => {
      try {
        const response = await getCarpoolApprover();
        const result = response.data;
        setApprover(result);
      } catch (error) {
        console.error("Error fetching status data:", error);
      }
    };

    fetchCarpoolApproverFunc();
  }, []);

  const router = useRouter();

  const handleConfirm = async () => {
    if (id) {
      console.log("edit");
    } else {
      try {
        const response = await postCarpoolApproverCreate({
          mas_carpool_uid: formData.mas_carpool_uid,
          approver_emp_no: selectedApprover?.value as string,
          internal_contact_number: internal_contact_number as string,
          mobile_contact_number: mobile_contact_number as string,
        });
        if (response.request.status === 201) {
          router.push(
            "/carpool-management/form/process-three?approver-created=true"
          );
        }
      } catch (error) {
        console.log(error);
      }
    }
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
            <div className="modal-title">เพิ่มผู้อนุมัติ</div>
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
                    <label className="form-label">ผู้อนุมัติ</label>
                    <CustomSelect
                      iconName="person"
                      w="w-full"
                      options={approver.map((item) => ({
                        value: item.emp_id,
                        label: item.full_name,
                      }))}
                      value={selectedApprover}
                      onChange={setSelectedApprover}
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
                        placeholder="ระบุตำแหน่ง / สังกัด"
                        readOnly
                        value={
                          approver.find(
                            (item) => item.emp_id === selectedApprover?.value
                          )?.dept_sap_short
                        }
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
                        placeholder="ระบุเบอร์ภายใน"
                        value={internal_contact_number}
                        onChange={(e) =>
                          setInternalContactNumber(e.target.value)
                        }
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
                        placeholder="ระบุเบอร์โทรศัพท์"
                        value={mobile_contact_number}
                        onChange={(e) => setMobileContactNumber(e.target.value)}
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

AddCarpoolApproverModal.displayName = "AddCarpoolAdminModal";

export default AddCarpoolApproverModal;
