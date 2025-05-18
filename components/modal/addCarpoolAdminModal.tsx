import useSwipeDown from "@/utils/swipeDown";
import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import CustomSelect, { CustomSelectOption } from "../customSelect";
import {
  getCarpoolAdmin,
  getCarpoolAdminDetails,
  postCarpoolAdminCreate,
  putCarpoolAdminUpdate,
} from "@/services/carpoolManagement";
import { CarpoolAdmin } from "@/app/types/carpool-management-type";
import { useFormContext } from "@/contexts/carpoolFormContext";
import { useSearchParams } from "next/navigation";

interface Props {
  id?: string;
  setRefetch: (value: boolean) => void;
}

const AddCarpoolAdminModal = forwardRef<
  { openModal: () => void; closeModal: () => void }, // Ref type
  Props
>(({ id: editId, setRefetch }, ref) => {
  // Destructure `process` from props
  const id = useSearchParams().get("id");
  const modalRef = useRef<HTMLDialogElement>(null);
  const [admins, setAdmins] = useState<CarpoolAdmin[]>([]);
  const [adminSelected, setAdminSelected] = useState<CustomSelectOption>();
  const [dept_sap_short, setDeptSapShort] = useState<string>();
  const [internal_contact_number, setInternalContactNumber] =
    useState<string>();
  const [mobile_contact_number, setMobileContactNumber] = useState<string>();

  const { formData } = useFormContext();

  useImperativeHandle(ref, () => ({
    openModal: () => modalRef.current?.showModal(),
    closeModal: () => modalRef.current?.close(),
  }));

  useEffect(() => {
    const fetchCarpoolAdminFunc = async () => {
      try {
        const response = await getCarpoolAdmin();
        const result = response.data;
        setAdmins(result);
      } catch (error) {
        console.error("Error fetching status data:", error);
      }
    };

    fetchCarpoolAdminFunc();
  }, []);

  useEffect(() => {
    const fetchCarpoolAdminDetailsFunc = async () => {
      if (editId) {
        try {
          const response = await getCarpoolAdminDetails(editId);
          const result = response.data;
          console.log("result: ", result);
        } catch (error) {
          console.error("Error fetching status data:", error);
        }
      }
    };

    fetchCarpoolAdminDetailsFunc();
  }, [editId]);

  const handleConfirm = async () => {
    if (editId) {
      try {
        const response = await putCarpoolAdminUpdate(editId, {
          mas_carpool_uid: formData.mas_carpool_uid,
          admin_emp_no: adminSelected?.value as string,
          internal_contact_number: internal_contact_number as string,
          mobile_contact_number: mobile_contact_number as string,
        });
        if (response.request.status === 200) {
          setRefetch(true);
          setAdminSelected(undefined);
          setDeptSapShort("");
          setInternalContactNumber("");
          setMobileContactNumber("");
          modalRef.current?.close();
        }
      } catch (error) {
        console.log(error);
      }
    } else {
      try {
        const response = await postCarpoolAdminCreate({
          mas_carpool_uid: id || formData.mas_carpool_uid,
          admin_emp_no: adminSelected?.value as string,
          internal_contact_number: internal_contact_number as string,
          mobile_contact_number: mobile_contact_number as string,
        });
        if (response.request.status === 201) {
          setRefetch(true);
          setAdminSelected(undefined);
          setDeptSapShort("");
          setInternalContactNumber("");
          setMobileContactNumber("");
          modalRef.current?.close();
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  const selectAdmin = (option: CustomSelectOption) => {
    setAdminSelected(option);
    const admin = admins.find((item) => item.emp_id === option.value);

    const internal = admin?.tel_internal;
    const mobile = admin?.tel_mobile;
    setInternalContactNumber(internal);
    setMobileContactNumber(mobile);
    setDeptSapShort(admin?.dept_sap_short);
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
                      options={admins.map((item) => ({
                        value: item.emp_id,
                        label: item.full_name,
                      }))}
                      value={adminSelected}
                      onChange={selectAdmin}
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
                        value={dept_sap_short}
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
              {editId ? "บันทึก" : "เพิ่ม"}
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
