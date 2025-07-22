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
  getCarpoolAdmin,
  getCarpoolAdminDetails,
  postCarpoolAdminCreate,
  putCarpoolAdminUpdate,
} from "@/services/carpoolManagement";
import { CarpoolAdmin } from "@/app/types/carpool-management-type";
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
  const [toast, setToast] = useState<ToastProps | undefined>();
  const [validPhone, setValidPhone] = useState<boolean>(false);

  const { formData, updateFormData } = useFormContext();

  useImperativeHandle(ref, () => ({
    openModal: () => modalRef.current?.showModal(),
    closeModal: () => modalRef.current?.close(),
  }));

  useEffect(() => {
    fetchCarpoolAdminFunc();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const fetchCarpoolAdminDetailsFunc = async () => {
      if (editId) {
        if (id) {
          try {
            const response = await getCarpoolAdminDetails(editId);
            const result = response.data;
            setAdminSelected({
              value: result.admin_emp_no,
              label: result.admin_emp_name + " (" + result.admin_emp_no + ")",
            });
            setDeptSapShort(
              result.admin_position + " " + result.admin_dept_sap_short
            );
            setInternalContactNumber(result.internal_contact_number);
            setMobileContactNumber(result.mobile_contact_number);
          } catch (error) {
            console.error("Error fetching status data:", error);
          }
        } else {
          const admin = (formData.carpool_admins || []).find(
            (item) => item.admin_emp_no === editId
          );
          setAdminSelected({
            value: admin?.admin_emp_no || "",
            label: admin?.admin_emp_name + " (" + admin?.admin_emp_no + ")",
          });
          setDeptSapShort(
            admin?.admin_position + " " + admin?.admin_dept_sap_short
          );
          setInternalContactNumber(admin?.internal_contact_number);
          setMobileContactNumber(admin?.mobile_contact_number);
        }
      }
    };

    fetchCarpoolAdminDetailsFunc();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editId]);

  const fetchCarpoolAdminFunc = async (search?: string) => {
    try {
      const response = await getCarpoolAdmin(search, id || undefined);
      const result = response.data;
      setAdmins(result);
    } catch (error) {
      console.error("Error fetching status data:", error);
    }
  };

  const handleConfirm = () => {
    if (editId) {
      adminEdit(editId);
    } else {
      adminCreate();
    }
  };

  const adminEdit = async (editId: string) => {
    try {
      if (id) {
        const response = await putCarpoolAdminUpdate(editId, {
          mas_carpool_uid: id,
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
          setToast({
            title: "แก้ไขข้อมูลผู้ดูแลยานพาหนะสำเร็จ",
            desc: (
              <>
                ข้อมูลการติดต่อของผู้ดูแลยานพาหนะ{" "}
                <span className="font-bold">
                  {
                    admins.find((item) => item.emp_id === adminSelected?.value)
                      ?.full_name
                  }
                </span>{" "}
                ได้รับการแก้ไขเรียบร้อยแล้ว
              </>
            ),
            status: "success",
          });
        }
      } else {
        const not_change_admin = (formData.carpool_admins || []).find(
          (e) => e.admin_emp_no === adminSelected?.value
        );
        let carpool_admins = formData.carpool_admins || [];

        if (not_change_admin) {
          carpool_admins = carpool_admins.map((e) =>
            e.admin_emp_no === editId
              ? {
                  ...e,
                  admin_emp_no: adminSelected?.value as string,
                  internal_contact_number: internal_contact_number as string,
                  mobile_contact_number: mobile_contact_number as string,
                }
              : e
          );

          updateFormData({
            ...formData,
            carpool_admins,
          });
        } else {
          const find = (formData.carpool_admins || []).find(
            (e) => e.admin_emp_no === editId
          );
          const admin = admins.find((e) => e.emp_id === adminSelected?.value);

          carpool_admins = carpool_admins.map((e) =>
            e.admin_emp_no !== editId
              ? e
              : {
                  admin_emp_name: admin?.full_name || "",
                  admin_dept_sap_short: admin?.dept_sap_short || "",
                  is_main_admin: find?.is_main_admin || "0",
                  image_url: admin?.image_url || "",
                  admin_emp_no: adminSelected?.value as string,
                  internal_contact_number: internal_contact_number as string,
                  mobile_contact_number: mobile_contact_number as string,
                  admin_position: admin?.posi_text as string,
                }
          );

          updateFormData({
            ...formData,
            carpool_admins,
          });
        }

        setAdminSelected(undefined);
        setDeptSapShort("");
        setInternalContactNumber("");
        setMobileContactNumber("");
        modalRef.current?.close();
        setToast({
          title: "แก้ไขข้อมูลผู้ดูแลยานพาหนะสำเร็จ",
          desc: (
            <>
              ข้อมูลการติดต่อของผู้ดูแลยานพาหนะ{" "}
              <span className="font-bold">
                {
                  carpool_admins.find(
                    (item) => item.admin_emp_no === adminSelected?.value
                  )?.admin_emp_name
                }
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

  const adminCreate = async () => {
    try {
      if (id) {
        const response = await postCarpoolAdminCreate({
          mas_carpool_uid: id,
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
          setToast({
            title: "เพิ่มผู้ดูแลยานพาหนะสำเร็จ",
            desc: (
              <>
                เพิ่มผู้ดูแลยานพาหนะ{" "}
                <span className="font-bold">
                  {
                    admins.find((item) => item.emp_id === adminSelected?.value)
                      ?.full_name
                  }
                </span>{" "}
                เรียบร้อยแล้ว
              </>
            ),
            status: "success",
          });
        }
      } else {
        const admin = admins.find((e) => e.emp_id === adminSelected?.value);
        const old = (formData.carpool_admins || []).filter(
          (e) => e.admin_emp_no !== adminSelected?.value
        );
        updateFormData({
          ...formData,
          carpool_admins: [
            ...old,
            {
              admin_emp_name: admin?.full_name || "",
              admin_dept_sap_short: admin?.dept_sap_short || "",
              is_main_admin: old.length === 0 ? "1" : "0",
              image_url: admin?.image_url || "",
              admin_emp_no: adminSelected?.value as string,
              internal_contact_number: internal_contact_number as string,
              mobile_contact_number: mobile_contact_number as string,
              admin_position: admin?.posi_text as string,
            },
          ],
        });
        setAdminSelected(undefined);
        setDeptSapShort("");
        setInternalContactNumber("");
        setMobileContactNumber("");
        modalRef.current?.close();
        setToast({
          title: "เพิ่มผู้ดูแลยานพาหนะสำเร็จ",
          desc: (
            <>
              เพิ่มผู้ดูแลยานพาหนะ{" "}
              <span className="font-bold">
                {
                  admins.find((item) => item.emp_id === adminSelected?.value)
                    ?.full_name
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

  const selectAdmin = (option: CustomSelectOption) => {
    if (option.value === "") {
      setAdminSelected(undefined);
      setDeptSapShort("");
      setInternalContactNumber("");
      setMobileContactNumber("");
    } else {
      setAdminSelected(option);
      const admin = admins.find((item) => item.emp_id === option.value);

      const internal = admin?.tel_internal;
      const mobile = admin?.tel_mobile;
      setInternalContactNumber(internal);
      setMobileContactNumber(mobile);
      if (mobile) setValidPhone(!/^\d{10}$/.test(mobile));
      setDeptSapShort(admin?.posi_text + " " + admin?.dept_sap_short);
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
            <div className="modal-title">
              {editId ? "แก้ไข" : "เพิ่ม"}ผู้ดูแลยานพาหนะ
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
                    <label className="form-label">ผู้ดูแลยานพาหนะ</label>
                    <CustomSelectOnSearch
                      iconName="person"
                      w="w-full"
                      options={admins
                        .filter(
                          (item) =>
                            (formData.carpool_admins || [])
                              .map((e) => e.admin_emp_no)
                              .includes(item.emp_id) === false
                        )
                        .map((item) => ({
                          value: item.emp_id,
                          label: item.full_name + " (" + item.emp_id + ")",
                        }))}
                      value={adminSelected}
                      onChange={selectAdmin}
                      enableSearchOnApi
                      onSearchInputChange={(value) =>
                        fetchCarpoolAdminFunc(value)
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
                        value={mobile_contact_number}
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

AddCarpoolAdminModal.displayName = "AddCarpoolAdminModal";

export default AddCarpoolAdminModal;
