import useSwipeDown from "@/utils/swipeDown";
import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { CustomSelectOption } from "../customSelect";
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
import FormHelper from "../formHelper";
import CustomSelectOnSearch from "../customSelectOnSearch";

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
  const [editName, setEditName] = useState<string | undefined>(undefined);
  const [validPhone, setValidPhone] = useState<boolean>(false);

  const { formData, updateFormData } = useFormContext();

  useImperativeHandle(ref, () => ({
    openModal: () => modalRef.current?.showModal(),
    closeModal: () => modalRef.current?.close(),
  }));

  useEffect(() => {
    fetchCarpoolApproverFunc();
  }, []);

  useEffect(() => {
    const fetchCarpoolApproverDetailsFunc = async () => {
      if (editId) {
        if (id) {
          try {
            const response = await getCarpoolApproverDetails(editId);
            const result = response.data;
            setSelectedApprover({
              value: result.approver_emp_no,
              label:
                result.approver_emp_name + " (" + result.approver_emp_no + ")",
            });
            setEditName(result.approver_emp_name);
            setDeptSapShort(result.approver_dept_sap_short);
            setInternalContactNumber(result.internal_contact_number);
            setMobileContactNumber(result.mobile_contact_number);
          } catch (error) {
            console.error("Error fetching status data:", error);
          }
        } else {
          const approve = (formData.carpool_approvers || []).find(
            (item) => item.approver_emp_no === editId
          );
          setSelectedApprover({
            value: approve?.approver_emp_no || "",
            label:
              approve?.approver_emp_name +
              " (" +
              approve?.approver_emp_no +
              ")",
          });
          setDeptSapShort(approve?.approver_dept_sap_short);
          setInternalContactNumber(approve?.internal_contact_number);
          setMobileContactNumber(approve?.mobile_contact_number);
        }
      }
    };

    fetchCarpoolApproverDetailsFunc();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editId]);

  const fetchCarpoolApproverFunc = async (search?: string) => {
    try {
      const response = await getCarpoolApprover(search, id || undefined);
      const result = response.data;
      setApprover(result);
    } catch (error) {
      console.error("Error fetching status data:", error);
    }
  };

  const handleConfirm = () => {
    if (editId) {
      approverEdit(editId);
    } else {
      approverCreate();
    }
  };

  const approverEdit = async (editId: string) => {
    try {
      if (id) {
        const response = await putCarpoolApproverUpdate(editId, {
          mas_carpool_uid: id,
          approver_emp_no: selectedApprover?.value as string,
          internal_contact_number: internal_contact_number as string,
          mobile_contact_number: mobile_contact_number as string,
        });
        if (response.request.status === 200) {
          setRefetch(true);
          setSelectedApprover(undefined);
          setEditName(undefined);
          setDeptSapShort("");
          setInternalContactNumber("");
          setMobileContactNumber("");
          modalRef.current?.close();
          setToast({
            title: "แก้ไขข้อมูลผู้อนุมัติสำเร็จ",
            desc: (
              <>
                ข้อมูลการติดต่อของผู้อนุมัติ{" "}
                <span className="font-bold">
                  {editName ||
                    approver.find(
                      (item) => item.emp_id === selectedApprover?.value
                    )?.full_name}
                </span>{" "}
                ได้รับการแก้ไขเรียบร้อยแล้ว
              </>
            ),
            status: "success",
          });
        }
      } else {
        const carpool_approvers = (formData.carpool_approvers || []).map((e) =>
          e.approver_emp_no === editId
            ? {
                ...e,
                approver_emp_no: selectedApprover?.value as string,
                internal_contact_number: internal_contact_number as string,
                mobile_contact_number: mobile_contact_number as string,
              }
            : e
        );
        updateFormData({
          ...formData,
          carpool_approvers,
        });
        setSelectedApprover(undefined);
        setEditName(undefined);
        setDeptSapShort("");
        setInternalContactNumber("");
        setMobileContactNumber("");
        modalRef.current?.close();
        setToast({
          title: "แก้ไขข้อมูลผู้อนุมัติสำเร็จ",
          desc: (
            <>
              ข้อมูลการติดต่อของผู้อนุมัติ{" "}
              <span className="font-bold">
                {editName ||
                  carpool_approvers.find(
                    (item) => item.approver_emp_no === selectedApprover?.value
                  )?.approver_emp_name}
              </span>{" "}
              ได้รับการแก้ไขเรียบร้อยแล้ว
            </>
          ),
          status: "success",
        });
      }
    } catch (error: any) {
      console.error(error);
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
  };

  const approverCreate = async () => {
    try {
      if (id) {
        const response = await postCarpoolApproverCreate({
          mas_carpool_uid: id,
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
          setToast({
            title: "เพิ่มผู้อนุมัติสำเร็จ",
            desc: (
              <>
                เพิ่มผู้อนุมัติ{" "}
                <span className="font-bold">
                  {
                    approver.find(
                      (item) => item.emp_id === selectedApprover?.value
                    )?.full_name
                  }
                </span>{" "}
                เรียบร้อยแล้ว
              </>
            ),
            status: "success",
          });
        }
      } else {
        const approve = approver.find(
          (e) => e.emp_id === selectedApprover?.value
        );
        const old = (formData.carpool_approvers || []).filter(
          (e) => e.approver_emp_no !== selectedApprover?.value
        );
        updateFormData({
          ...formData,
          carpool_approvers: [
            ...old,
            {
              approver_emp_name: approve?.full_name || "",
              approver_dept_sap_short: approve?.dept_sap_short || "",
              is_main_approver: old.length === 0 ? "1" : "0",
              image_url: approve?.image_url || "",
              approver_emp_no: selectedApprover?.value as string,
              internal_contact_number: internal_contact_number as string,
              mobile_contact_number: mobile_contact_number as string,
              approver_position: approve?.posi_text as string,
            },
          ],
        });
        modalRef.current?.close();
        setSelectedApprover(undefined);
        setDeptSapShort("");
        setInternalContactNumber("");
        setMobileContactNumber("");
        setToast({
          title: "แก้ไขข้อมูลผู้อนุมัติสำเร็จ",
          desc: (
            <>
              เพิ่มผู้อนุมัติ{" "}
              <span className="font-bold">
                {
                  approver.find(
                    (item) => item.emp_id === selectedApprover?.value
                  )?.full_name
                }
              </span>{" "}
              เรียบร้อยแล้ว
            </>
          ),
          status: "success",
        });
      }
    } catch (error: any) {
      console.error(error);
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
  };

  const selectApprover = (option: CustomSelectOption) => {
    setSelectedApprover(option);
    const approve = approver.find((item) => item.emp_id === option.value);

    const internal = approve?.tel_internal;
    const mobile = approve?.tel_mobile;
    setInternalContactNumber(internal);
    setMobileContactNumber(mobile);
    if (mobile) setValidPhone(!/^\d{10}$/.test(mobile));
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
                    <CustomSelectOnSearch
                      iconName="person"
                      w="w-full"
                      options={approver.map((item) => ({
                        value: item.emp_id,
                        label: item.full_name + " (" + item.emp_id + ")",
                      }))}
                      value={selectedApprover}
                      onChange={selectApprover}
                      enableSearchOnApi
                      onSearchInputChange={(value) =>
                        fetchCarpoolApproverFunc(value)
                      }
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
                           onKeyDown={(e) => {
                          if (
                            !/[0-9]/.test(e.key) &&
                            ![
                              "Backspace",
                              "Delete",
                              "Tab",
                              "ArrowLeft",
                              "ArrowRight",
                              "Home",
                              "End",
                            ].includes(e.key)
                          ) {
                            e.preventDefault();
                          }
                        }}
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
                           onKeyDown={(e) => {
                          if (
                            !/[0-9]/.test(e.key) &&
                            ![
                              "Backspace",
                              "Delete",
                              "Tab",
                              "ArrowLeft",
                              "ArrowRight",
                              "Home",
                              "End",
                            ].includes(e.key)
                          ) {
                            e.preventDefault();
                          }
                        }}
                        value={mobile_contact_number}
                        onChange={(e) => {
                          setMobileContactNumber(e.target.value);
                          if (e.target.value) {
                            setValidPhone(!/^\d{10}$/.test(e.target.value));
                          } else {
                            setValidPhone(false);
                          }
                        }}
                      />
                    </div>
                    {validPhone && (
                      <FormHelper text={"กรุณากรอกเบอร์โทรศัพท์ให้ถูกต้อง"} />
                    )}
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
              disabled={validPhone}
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
