import { VehicleUserType } from "@/app/types/vehicle-user-type";
import RadioButton from "@/components/radioButton";
import {
  fetchReceivedKeyUsers,
  updateKeyPickupDriver,
  updateKeyPickupOutsider,
  updateKeyPickupPea,
} from "@/services/masterService";
import useSwipeDown from "@/utils/swipeDown";
import Image from "next/image";
import Link from "next/link";
import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";

import { RequestDetailType } from "@/app/types/request-detail-type";
import {
  updateKeyAdminPickupDriver,
  updateKeyAdminPickupOutsider,
  updateKeyAdminPickupPea,
} from "@/services/keyAdmin";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import CustomSelectKeyPickup from "../customSelectKeyPickup";
import FormHelper from "../formHelper";

interface Props {
  onBack?: () => void;
  onSubmit?: () => void;
  onUpdate?: (data: any) => void;
  requestData?: RequestDetailType;
  role?: string;
}
const KeyPickUpEditModal = forwardRef<
  { openModal: () => void; closeModal: () => void }, // Ref type
  Props // Props type
>(({ onBack, onSubmit, onUpdate, requestData, role }, ref) => {
  const modalRef = useRef<HTMLDialogElement>(null);

  useImperativeHandle(ref, () => ({
    openModal: () => {
      if (requestData?.trn_request_uid) {
        fetchRequests();
      }
      modalRef.current?.showModal();
    },
    closeModal: () => modalRef.current?.close(),
  }));

  const schema = yup.object().shape({
    telInternal: yup.string().optional(),
    selectedUserType: yup.string().optional(),
    name: yup.string().when("selectedUserType", {
      is: "บุคคลภายนอก",
      then: (schema) => schema.required("กรุณากรอกชื่อ-นามสกุล"),
      otherwise: (schema) => schema.optional(),
    }),
    remark: yup.string().optional(),
    remarkOutside: yup.string().optional(),
    telMobile: yup.string().when("selectedUserType", {
      is: "พนักงาน กฟภ.",
      then: (schema) =>
        schema
          .matches(/^\d{10}$/, "กรุณากรอกเบอร์โทรศัพท์ให้ถูกต้อง")
          .required("กรุณากรอกเบอร์โทรศัพท์"),
      otherwise: (schema) => schema.optional(),
    }),
    telOutsideMobile: yup.string().when("selectedUserType", {
      is: "บุคคลภายนอก",
      then: (schema) =>
        schema
          .matches(/^\d{10}$/, "กรุณากรอกเบอร์โทรศัพท์ให้ถูกต้อง")
          .required("กรุณากรอกเบอร์โทรศัพท์"),
      otherwise: (schema) => schema.optional(),
    }),
  });

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    mode: "onChange",
    resolver: yupResolver(schema),
    defaultValues: {
      telInternal: "",
      telOutsideMobile: "",
      remarkOutside: "",
      name: "",
      remark: "",
      telMobile: "",
      selectedUserType: "พนักงานขับรถ",
    },
  });

  const [vehicleUserDatas, setVehicleUserDatas] = useState<VehicleUserType[]>(
    []
  );

  const [selectedVehicleUserOption, setSelectedVehicleUserOption] =
    useState<VehicleUserType | null>(null);
  const [selectedUserDept, setSelectedUserDept] = useState("");
  const [driverOptions, setDriverOptions] = useState<VehicleUserType[]>([]);

  const reqId = requestData?.trn_request_uid || "";
  const name = requestData?.driver?.driver_name || "";
  const deptSap = requestData?.driver?.driver_dept_sap_short || "";
  const phone = requestData?.driver?.driver_contact_number || "";
  const imgSrc = requestData?.driver?.driver_image || "/assets/img/avatar.svg";

  const selectedUserType = watch("selectedUserType");

  useEffect(() => {
    if (selectedUserType === "บุคคลภายนอก") {
      setValue("telOutsideMobile", "");
      setValue("remarkOutside", "");
      setValue("name", "");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedUserType]);

  const fetchRequests = async () => {
    try {
      const response = await fetchReceivedKeyUsers(
        requestData?.trn_request_uid || "",
        ""
      );
      if (response.status === 200) {
        const vehicleUserData: VehicleUserType[] = response.data;
        setVehicleUserDatas(vehicleUserData);

        setDriverOptions(vehicleUserData);

        // Optional: Set default selected user
        if (vehicleUserData.length > 0) {
          setSelectedVehicleUserOption({
            emp_id: requestData?.received_key_emp_id || "",
            full_name: requestData?.received_key_emp_name || "",
            dept_sap: "",
            tel_internal: "",
            tel_mobile: "",
            dept_sap_short: "",
            posi_text: "",
            image_url: "",
          });
          const defaultUser = vehicleUserData.find(
            (user) => user.emp_id === requestData?.received_key_emp_id
          );

          if (defaultUser) {
            setSelectedUserDept(
              defaultUser.posi_text + "/" + defaultUser.dept_sap_short
            );
            setValue("telInternal", defaultUser.tel_internal);
            setValue("telMobile", defaultUser.tel_mobile);
          }
        }
      }
    } catch (error) {
      console.error("Error fetching requests:", error);
    }
  };

  const handleVehicleUserChange = async (selectedOption: VehicleUserType) => {
    setSelectedVehicleUserOption(selectedOption);

    const empData = vehicleUserDatas.find(
      (user) => user.emp_id === selectedOption.emp_id
    );

    if (empData) {
      setSelectedUserDept(
        empData.posi_text + "/" + empData.dept_sap_short || ""
      );
      setValue("telInternal", empData.tel_internal);
      setValue("telMobile", empData.tel_mobile);
    }
  };

  const submit = async (data: any) => {
    let payload;

    if (selectedUserType === "พนักงาน กฟภ.") {
      // Handle payload for internal employee
      payload = {
        received_key_dept_sap: selectedVehicleUserOption?.dept_sap || "",
        received_key_dept_sap_full: selectedUserDept || "",
        received_key_dept_sap_short: selectedUserDept || "",
        received_key_emp_id: selectedVehicleUserOption?.emp_id || "",
        received_key_emp_name: selectedVehicleUserOption?.full_name || "",
        received_key_internal_contact_number: data.telInternal || "", // Get from form data
        received_key_mobile_contact_number: data.telMobile || "", // Get from form data
        received_key_remark: data.remark || "", // Get from form data
        trn_request_uid: reqId || "",
      };
    } else if (selectedUserType === "บุคคลภายนอก") {
      // Handle payload for outsider
      payload = {
        outsider_name: data.name || "", // Get from form data
        received_key_mobile_contact_number: data.telOutsideMobile || "", // Get from form data
        received_key_remark: data.remarkOutside || "", // Get from form data
        trn_request_uid: reqId || "",
      };
    } else {
      payload = {
        trn_request_uid: reqId || "",
      };
    }

    try {
      let res;
      if (role == "keyAdmin") {
        if (selectedUserType === "พนักงาน กฟภ.") {
          res = await updateKeyAdminPickupPea(payload);
        } else if (selectedUserType === "บุคคลภายนอก") {
          res = await updateKeyAdminPickupOutsider(payload);
        } else {
          res = await updateKeyAdminPickupDriver(payload);
        }
        modalRef.current?.close();
        if (onUpdate) onUpdate(res.data);

      } else {
        if (selectedUserType === "พนักงาน กฟภ.") {
          res = await updateKeyPickupPea(payload);
        } else if (selectedUserType === "บุคคลภายนอก") {
          res = await updateKeyPickupOutsider(payload);
        } else {
          res = await updateKeyPickupDriver(payload);
        }
   
        modalRef.current?.close();
      }

      if (onSubmit) {
        onSubmit();
        modalRef.current?.close();
      }
    } catch (error) {
      console.error("Network error:", error);
    }
  };

  const swipeDownHandlers = useSwipeDown(() => modalRef.current?.close());

  return (
    <dialog ref={modalRef} className="modal">
      <div className="modal-box max-w-[500px] p-0 relative modal-vehicle-pick overflow-hidden flex flex-col max-h-[90vh]">
        <div className="bottom-sheet" {...swipeDownHandlers}>
          <div className="bottom-sheet-icon"></div>
        </div>
        <div className="modal-header bg-white sticky top-0 flex justify-between z-10">
          <div className="modal-title">
            {" "}
            {onBack && (
              <Link href="" className="flex items-center gap-3">
                <i
                  className="material-symbols-outlined"
                  onClick={() => {
                    modalRef.current?.close();
                    if (onBack) {
                      onBack();
                    }
                  }}
                >
                  keyboard_arrow_left
                </i>{" "}
              </Link>
            )}
            แก้ไขผู้มารับกุญแจ{" "}
          </div>
          <form method="dialog">
            <button className="close btn btn-icon border-none bg-transparent shadow-none btn-tertiary">
              <i className="material-symbols-outlined">close</i>
            </button>
          </form>
        </div>
        <form onSubmit={handleSubmit(submit)}>
          <div className="modal-body overflow-y-auto">
            <div className="form-section">
              <div className="form-group">
                <div className="custom-group flex md:flex-row flex-col !gap-0 space-y-0 space-x-2">
                  <RadioButton
                    name="userType"
                    label="พนักงานขับรถ"
                    value="พนักงานขับรถ"
                    selectedValue={selectedUserType}
                    setSelectedValue={(value) =>
                      setValue("selectedUserType", value)
                    }
                  />
                  <RadioButton
                    name="userType"
                    label="พนักงาน กฟภ."
                    value="พนักงาน กฟภ."
                    selectedValue={selectedUserType}
                    setSelectedValue={(value) =>
                      setValue("selectedUserType", value)
                    }
                  />
                  <RadioButton
                    name="userType"
                    label="บุคคลภายนอก"
                    value="บุคคลภายนอก"
                    selectedValue={selectedUserType}
                    setSelectedValue={(value) =>
                      setValue("selectedUserType", value)
                    }
                  />
                </div>
              </div>
            </div>

            {selectedUserType == "พนักงาน กฟภ." ? (
              <div className="grid grid-cols-12 gap-4 mt-3">
                <div className="col-span-12">
                  <div className="form-group">
                    <label className="form-label">ชื่อ - นามสกุล</label>

                    <CustomSelectKeyPickup
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
                <div className="col-span-6 md:col-span-6">
                  <div className="form-group">
                    <label className="form-label">เบอร์ภายใน</label>
                    <div className={`input-group`}>
                      <div className="input-group-prepend">
                        <span className="input-group-text">
                          <i className="material-symbols-outlined">call</i>
                        </span>
                      </div>
                      <input
                        type="text"
                        className="form-control"
                        {...register("telInternal")}
                        placeholder="ระบุเบอร์ภายใน"
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
                <div className="col-span-6 md:col-span-6">
                  <div className="form-group">
                    <label className="form-label">เบอร์โทรศัพท์</label>
                    <div
                      className={`input-group ${
                        errors.telMobile && "is-invalid"
                      }`}
                    >
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
                        {...register("telMobile")}
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
                      />
                    </div>
                    {errors.telMobile && (
                      <FormHelper text={String(errors.telMobile.message)} />
                    )}
                  </div>
                </div>

                <div className="col-span-12">
                  <div className="form-group">
                    <label className="form-label">
                      หมายเหตุ <span className="form-optional">(ถ้ามี)</span>
                    </label>
                    <div className="input-group">
                      <div className="input-group-prepend">
                        <span className="input-group-text">
                          <i className="material-symbols-outlined">sms</i>
                        </span>
                      </div>
                      <input
                        type="text"
                        className="form-control"
                        {...register("remark")}
                        placeholder="ระบุหมายเหตุ"
                      />
                    </div>
                  </div>
                </div>
              </div>
            ) : selectedUserType == "บุคคลภายนอก" ? (
              <div className="grid grid-cols-12 gap-4 mt-3">
                <div className="col-span-12">
                  <div className="form-group">
                    <label className="form-label">ชื่อ - นามสกุล</label>
                    <div
                      className={`input-group ${errors.name && "is-invalid"}`}
                    >
                      <input
                        type="text"
                        className="form-control"
                        {...register("name")}
                        placeholder="ระบุชื่อ-นามสกุล"
                      />
                    </div>
                    {errors.name && (
                      <FormHelper text={String(errors.name.message)} />
                    )}
                  </div>
                </div>

                <div className="col-span-12 md:col-span-12">
                  <div className="form-group">
                    <label className="form-label">เบอร์โทรศัพท์</label>
                    <div
                      className={`input-group ${
                        errors.telOutsideMobile && "is-invalid"
                      }`}
                    >
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
                        {...register("telOutsideMobile")}
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
                    {errors.telOutsideMobile && (
                      <FormHelper
                        text={String(errors.telOutsideMobile.message)}
                      />
                    )}
                  </div>
                </div>

                <div className="col-span-12">
                  <div className="form-group">
                    <label className="form-label">
                      หมายเหตุ <span className="form-optional">(ถ้ามี)</span>
                    </label>
                    <div className="input-group">
                      <div className="input-group-prepend">
                        <span className="input-group-text">
                          <i className="material-symbols-outlined">sms</i>
                        </span>
                      </div>
                      <input
                        type="text"
                        className="form-control"
                        {...register("remarkOutside")}
                        placeholder="ระบุหมายเหตุ"
                      />
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="col-span-12">
                <div className="form-card w-full">
                  <div className="form-card-body">
                    <div className="form-group form-plaintext form-users">
                      <Image
                        src={imgSrc}
                        className="avatar avatar-md object-cover"
                        width={100}
                        height={100}
                        alt=""
                      />
                      <div className="form-plaintext-group align-self-center">
                        <div className="form-label">
                          {name} ({requestData?.driver?.driver_nickname}){" "}
                        </div>
                        <div className="supporting-text-group">
                          <div className="supporting-text">
                            {requestData?.driver?.vendor_name}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="form-card-right align-self-center mt-4">
                      <div className="flex flex-wrap gap-4">
                        <div className="col-span-12 md:col-span-6">
                          <div className="form-group form-plaintext">
                            <i className="material-symbols-outlined">
                              smartphone
                            </i>
                            <div className="form-plaintext-group">
                              <div className="form-text text-nowrap">
                                {phone}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
          <div className="modal-action sticky bottom-0 gap-3 mt-0">
            <div className="w-[50%] md:w-auto">
              <button
                className="btn btn-secondary w-full"
                type="button"
                onClick={() => modalRef.current?.close()}
              >
                ไม่ใช่ตอนนี้
              </button>
            </div>
            <button className="btn btn-primary w-[50%] md:w-auto" type="submit">
              ยืนยัน
            </button>
          </div>
        </form>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>
  );
});

KeyPickUpEditModal.displayName = "KeyPickUpEditModal";

export default KeyPickUpEditModal;
