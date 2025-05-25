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
  getCarpoolApprover,
  getCarpoolApproverDetails,
  postCarpoolApproverCreate,
  putCarpoolApproverUpdate,
} from "@/services/carpoolManagement";
import { CarpoolApprover } from "@/app/types/carpool-management-type";
import { useFormContext } from "@/contexts/carpoolFormContext";
import { useSearchParams } from "next/navigation";
import ToastCustom from "../toastCustom";

interface Props {
  id?: string;
  setRefetch: (value: boolean) => void;
}

interface ToastProps {
  title: string;
  desc: string | React.ReactNode;
  status: "success" | "error" | "warning" | "info";
}

const AddCarpoolApproverModal = forwardRef<
  { openModal: () => void; closeModal: () => void }, // Ref type
  Props
>(({ id: editId, setRefetch }, ref) => {
  // Destructure `process` from props
  const id = useSearchParams().get("id");
  const modalRef = useRef<HTMLDialogElement>(null);
  const [approver, setApprover] = useState<CarpoolApprover[]>([]);
  const [selectedApprover, setSelectedApprover] =
    useState<CustomSelectOption>();
  const [dept_sap_short, setDeptSapShort] = useState<string>();
  const [internal_contact_number, setInternalContactNumber] =
    useState<string>();
  const [mobile_contact_number, setMobileContactNumber] = useState<string>();
  const [toast, setToast] = useState<ToastProps | undefined>();

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

  useEffect(() => {
    const fetchCarpoolApproverDetailsFunc = async () => {
      if (editId) {
        try {
          const response = await getCarpoolApproverDetails(editId);
          const result = response.data;
          setSelectedApprover({
            value: result.approver_emp_no,
            label: result.approver_emp_name,
          });
          setDeptSapShort(result.approver_dept_sap_short);
          setInternalContactNumber(result.internal_contact_number);
          setMobileContactNumber(result.mobile_contact_number);
        } catch (error) {
          console.error("Error fetching status data:", error);
        }
      }
    };

    fetchCarpoolApproverDetailsFunc();
  }, [editId]);

  const handleConfirm = async () => {
    if (editId) {
      try {
        const response = await putCarpoolApproverUpdate(editId, {
          mas_carpool_uid: id || formData.mas_carpool_uid,
          approver_emp_no: selectedApprover?.value as string,
          internal_contact_number: internal_contact_number as string,
          mobile_contact_number: mobile_contact_number as string,
        });
        if (response.request.status === 200) {
          setRefetch(true);
          setSelectedApprover(undefined);
          setDeptSapShort("");
          setInternalContactNumber("");
          setMobileContactNumber("");
          modalRef.current?.close();
          setToast({
            title: "แก้ไขข้อมูลผู้อนุมัติสำเร็จ",
            desc:
              "ข้อมูลการติดต่อของผู้อนุมัติ " +
              approver.find((item) => item.emp_id === selectedApprover?.value)
                ?.full_name +
              " ได้รับการแก้ไขเรียบร้อยแล้ว",
            status: "success",
          });
        }
      } catch (error: any) {
        console.log(error);
        setToast({
          title: "Error",
          desc: (
            <div>
              <div>{error.response.data.error}</div>
              <div>{error.response.data.message}</div>
            </div>
          ),
          status: "error",
        });
      }
    } else {
      try {
        const response = await postCarpoolApproverCreate({
          mas_carpool_uid: id || formData.mas_carpool_uid,
          approver_emp_no: selectedApprover?.value as string,
          internal_contact_number: internal_contact_number as string,
          mobile_contact_number: mobile_contact_number as string,
        });
        if (response.request.status === 201) {
          modalRef.current?.close();
          setSelectedApprover(undefined);
          setDeptSapShort("");
          setInternalContactNumber("");
          setMobileContactNumber("");
          setRefetch(true);
        }
      } catch (error: any) {
        console.log(error);
        setToast({
          title: "Error",
          desc: (
            <div>
              <div>{error.response.data.error}</div>
              <div>{error.response.data.message}</div>
            </div>
          ),
          status: "error",
        });
      }
    }
  };

  const selectApprover = (option: CustomSelectOption) => {
    setSelectedApprover(option);
    const approve = approver.find((item) => item.emp_id === option.value);

    const internal = approve?.tel_internal;
    const mobile = approve?.tel_mobile;
    setInternalContactNumber(internal);
    setMobileContactNumber(mobile);
    setDeptSapShort(approve?.dept_sap_short);
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
            <div className="modal-title">
              {editId ? "แก้ไขผู้อนุมัติ" : "เพิ่มผู้อนุมัติ"}
            </div>
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
                        label: item.full_name + " (" + item.emp_id + ")",
                      }))}
                      value={selectedApprover}
                      onChange={selectApprover}
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
                        value={dept_sap_short}
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

      {toast && (
        <ToastCustom
          title={toast.title}
          desc={toast.desc}
          status={toast.status}
          onClose={() => setToast(undefined)}
        />
      )}
    </>
  );
});

AddCarpoolApproverModal.displayName = "AddCarpoolApproverModal";

export default AddCarpoolApproverModal;
