import CustomSelect from "@/components/drivers-management/customSelect";
import FormHelper from "@/components/formHelper";
import { driverDelete, driverLayoff, driverReplacementLists, driverResign } from "@/services/driversManagement";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import * as Yup from "yup";

import { DriverInfoType, DriverReplacementDetails } from "@/app/types/drivers-management-type";

interface Props {
  driverInfo?: DriverInfoType;
  deleteDriverType?: string;
  onValidateDelete?: () => void;
}

interface DeleteDriverParams {
  driver_name: string;
  mas_driver_uid: string;
}

interface CustomSelectOption {
  value: string;
  label: React.ReactNode | string;
  labelDetail?: React.ReactNode | string;
}

const DriverDeleteModal = forwardRef<{ openModal: () => void; closeModal: () => void }, Props>(
  ({ driverInfo, deleteDriverType, onValidateDelete }, ref) => {
    const modalRef = useRef<HTMLDialogElement>(null);
    const router = useRouter();
    const [btnDisabled, setBtnDisabled] = useState(true);
    const [driverReplacementList, setDriverReplacementList] = useState<CustomSelectOption[]>([]);
    const [formData_1, setFormData_1] = useState({
      driver_name: "",
    });
    const [formData_2, setFormData_2] = useState({
      doc_number: "",
      replaced_mas_driver_uid: "",
    });
    const [formData_3, setFormData_3] = useState({
      mas_driver_uid: "",
      replaced_mas_driver_uid: "",
    });
    const [formErrors_1, setFormErrors_1] = useState({
      driver_name: "",
      mas_driver_uid: "",
    });
    const [formErrors_2, setFormErrors_2] = useState({
      doc_number: "",
      replaced_mas_driver_uid: "",
    });
    const [formErrors_3, setFormErrors_3] = useState({
      replaced_mas_driver_uid: "",
    });

    const validationSchema_1 = Yup.object().shape({
      driver_name: Yup.string()
        .required("กรุณากรอกชื่อพนักงาน")
        .equals([driverInfo?.driver_name], "กรุณากรอกชื่อพนักงานให้ถูกต้อง"),
    });
    const validationSchema_2 = Yup.object().shape({
      doc_number: Yup.string().required("กรุณากรอกเลขที่เอกสาร"),
      replaced_mas_driver_uid: Yup.string().required("กรุณาเลือกพนักงานที่มาทำงานแทน"),
    });
    const validationSchema_3 = Yup.object().shape({
      replaced_mas_driver_uid: Yup.string().required("กรุณาเลือกพนักงานที่มาทำงานแทน"),
    });

    useImperativeHandle(ref, () => ({
      openModal: () => modalRef.current?.showModal(),
      closeModal: () => modalRef.current?.close(),
    }));

    useEffect(() => {
      const fetchDriverReplacementLists = async () => {
        try {
          const name = "";
          const response = await driverReplacementLists(name);
          const driverReplacementData: CustomSelectOption[] = response.data
            .filter((e: DriverReplacementDetails) => e.driver_name !== driverInfo?.driver_name)
            .map((item: DriverReplacementDetails) => {
              return {
                value: item.mas_driver_uid,
                label: `${item.driver_name}${item.driver_nickname && `(${item.driver_nickname})`}`,
              };
            });

          setDriverReplacementList(driverReplacementData);
          // setDriverReplacementList(response.data);
        } catch (error) {
          console.error("Error fetching driver replacement lists:", error);
        }
      };

      fetchDriverReplacementLists();
    }, [driverInfo]);

    useEffect(() => {
      handleCheckInputLayoff(formData_2);
    }, [formData_2]);

    useEffect(() => {
      handleCheckSelectResign(formData_3);
    }, [formData_3]);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      if (deleteDriverType === "delete") {
        try {
          await validationSchema_1.validate(formData_1, { abortEarly: false });
          const params: DeleteDriverParams = {
            driver_name: formData_1.driver_name,
            mas_driver_uid: driverInfo?.mas_driver_uid || "",
          };
          const response = await driverDelete(params);
          if (response.status === 200) {
            onValidateDelete?.();
            modalRef.current?.close();
            router.push("/drivers-management?activeTab=1&delete=success&driverName=" + formData_1.driver_name);
          } else {
            console.error("Error deleting driver:", response.data);
          }
          // console.log("Form data is valid:", params);
        } catch (error) {
          if (error instanceof Yup.ValidationError) {
            const errors: { [key: string]: string } = {};
            error.inner.forEach((err) => {
              if (err.path) {
                errors[err.path] = err.message;
              }
            });
            setFormErrors_1((prevErrors) => ({
              ...prevErrors,
              ...errors,
            }));
          }
        }
      } else if (deleteDriverType === "giveout") {
        try {
          await validationSchema_2.validate(formData_2, { abortEarly: false });
          const params: {
            mas_driver_uid: string;
            replace_mas_driver_uid: string;
            replaced_mas_driver_uid: string;
          } = {
            mas_driver_uid: driverInfo?.mas_driver_uid || "",
            replace_mas_driver_uid: driverInfo?.mas_driver_uid || "",
            replaced_mas_driver_uid: formData_2?.replaced_mas_driver_uid || "",
          };

          const response = await driverLayoff(params);
          if (response.status === 200) {
            modalRef.current?.close();
            router.push("/drivers-management?activeTab=1&giveout=success&driverName=" + driverInfo?.driver_name);
          }
        } catch (error) {
          if (error instanceof Yup.ValidationError) {
            const errors: { [key: string]: string } = {};
            error.inner.forEach((err) => {
              if (err.path) {
                errors[err.path] = err.message;
              }
            });
            setFormErrors_2((prevErrors) => ({
              ...prevErrors,
              ...errors,
            }));
          }
        }
      } else if (deleteDriverType === "resign") {
        try {
          await validationSchema_3.validate(formData_3, { abortEarly: false });
          const params: {
            mas_driver_uid: string;
            replaced_mas_driver_uid: string;
          } = {
            mas_driver_uid: driverInfo?.mas_driver_uid || "",
            replaced_mas_driver_uid: formData_3?.replaced_mas_driver_uid || "",
          };

          try {
            const response = await driverResign(params);
            if (response.status === 200) {
              modalRef.current?.close();
              router.push("/drivers-management?activeTab=1&resign=success&driverName=" + driverInfo?.driver_name);
            }
          } catch (error) {
            console.error("Error deleting driver:", error);
          }
        } catch (error) {
          if (error instanceof Yup.ValidationError) {
            const errors: { [key: string]: string } = {};
            error.inner.forEach((err) => {
              if (err.path) {
                errors[err.path] = err.message;
              }
            });
            setFormErrors_3((prevErrors) => ({
              ...prevErrors,
              ...errors,
            }));
          }
        }
      }
    };

    const handleInputChange_1 = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setFormData_1((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    };

    const handleInputChange_2 = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setFormData_2((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    };

    const handleCheckInputLayoff = (data: { doc_number: string; replaced_mas_driver_uid: string }) => {
      if (data.doc_number === "" || data.replaced_mas_driver_uid === "") {
        setBtnDisabled(true);
      } else {
        setBtnDisabled(false);
      }
    };

    const handleCheckSelectResign = (data: { replaced_mas_driver_uid: string }) => {
      if (data.replaced_mas_driver_uid === "") {
        setBtnDisabled(true);
      } else {
        setBtnDisabled(false);
      }
    };

    return (
      <dialog ref={modalRef} className={`modal modal-middle`}>
        <div className="modal-box max-w-[500px] p-0 relative overflow-hidden flex flex-col bg-white">
          <form className="form" onSubmit={handleSubmit}>
            <div className="modal-body overflow-y-auto text-center">
              <Image
                src="/assets/img/graphic/confirm_delete_2.svg"
                className="w-full confirm-img mb-5"
                width={100}
                height={100}
                alt=""
              />
              {deleteDriverType === "delete" ? (
                <>
                  <div className="confirm-title text-xl font-medium">ยืนยันลบพนักงานขับรถ</div>
                  <div className="confirm-text">
                    ระบบจะนำพนักงานขับรถออกจากการให้บริการโดยอัตโนมัติคุณต้องการลบ
                    <strong> {driverInfo?.driver_name}</strong> ใช่หรือไม่?
                  </div>
                  <div className="grid grid-cols-1 mt-3">
                    <div className="form-group">
                      <label className="form-label">พิมพ์ชื่อพนักงานเพื่อยืนยันการลบ</label>
                      <div className={`input-group`}>
                        <input
                          type="text"
                          name="driver_name"
                          className="form-control"
                          placeholder="พิมพ์ชื่อพนักงาน"
                          onChange={(e) => {
                            handleInputChange_1(e);
                            setBtnDisabled(e.target.value === "");
                          }}
                        />
                      </div>
                      {formErrors_1.driver_name && <FormHelper text={formErrors_1.driver_name} />}
                    </div>
                  </div>
                </>
              ) : deleteDriverType === "giveout" ? (
                <>
                  <div className="confirm-title text-xl font-medium">ให้่พนักงานออก</div>
                  <div className="grid grid-cols-1">
                    <div className="form-group">
                      <label className="form-label">เลขหนังสือ มท</label>
                      <div className={`input-group`}>
                        <input
                          type="text"
                          name="doc_number"
                          className="form-control"
                          placeholder="เลขหนังสือ มท"
                          onChange={(e) => {
                            handleInputChange_2(e);
                          }}
                        />
                      </div>
                      {formErrors_2.doc_number && <FormHelper text={formErrors_2.doc_number} />}
                    </div>
                  </div>
                  <div className="grid grid-cols-1 mt-3">
                    <div className="form-group">
                      <label className="form-label">พนักงานที่มาปฏิบัติงานแทน</label>
                      <CustomSelect
                        w="w-full"
                        options={driverReplacementList}
                        value={
                          driverReplacementList.find((option) => option.value === formData_2.replaced_mas_driver_uid) ||
                          null
                        }
                        onChange={(selected) => {
                          setFormData_2((prev) => ({ ...prev, replaced_mas_driver_uid: selected.value }));
                        }}
                      />
                      {formErrors_2.replaced_mas_driver_uid && (
                        <FormHelper text={formErrors_2.replaced_mas_driver_uid} />
                      )}
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="confirm-title text-xl font-medium">พนักงานลาออก</div>
                  <div className="grid grid-cols-1">
                    <div className="form-group">
                      <label className="form-label">พนักงานที่มาปฏิบัติงานแทน</label>
                      <CustomSelect
                        w="w-full"
                        options={driverReplacementList}
                        value={
                          driverReplacementList.find((option) => option.value === formData_3.replaced_mas_driver_uid) ||
                          null
                        }
                        onChange={(selected) => {
                          setFormData_3((prev) => ({ ...prev, replaced_mas_driver_uid: selected.value }));
                        }}
                      />
                      {formErrors_3.replaced_mas_driver_uid && (
                        <FormHelper text={formErrors_3.replaced_mas_driver_uid} />
                      )}
                    </div>
                  </div>
                </>
              )}
              <div className="modal-footer mt-5 grid grid-cols-2 gap-3">
                <button className="btn btn-secondary w-full" type="button" onClick={() => modalRef.current?.close()}>
                  ไม่ใช่ตอนนี้
                </button>
                <button type="submit" className="btn btn-primary-danger col-span-1" disabled={btnDisabled}>
                  {deleteDriverType === "delete" ? "ลบพนักงาน" : deleteDriverType === "resign" ? "ลาออก" : "ให้ออก"}
                </button>
              </div>
            </div>
          </form>
        </div>
        {/* <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form> */}
      </dialog>
    );
  }
);
DriverDeleteModal.displayName = "DriverDeleteModal";

export default DriverDeleteModal;
