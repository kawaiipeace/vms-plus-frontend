import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import CustomSelect from "@/components/customSelect";
import Link from "next/link";
import RadioButton from "@/components/radioButton";
import Image from "next/image";
import useSwipeDown from "@/utils/swipeDown";
import {
  fetchVehicleUsers,
  updateKeyPickupDriver,
  updateKeyPickupOutsider,
  updateKeyPickupPea,
} from "@/services/masterService";
import { VehicleUserType } from "@/app/types/vehicle-user-type";
// import KeyPickupDetailModal from "./keyPickUpDetailModal";

import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import FormHelper from "../formHelper";


interface Props {
  reqId: string;
  imgSrc: string;
  name: string;
  deptSap: string;
  phone: string;
  onBack?: () => void;
  onSubmit?: () => void;
}
const KeyPickUpEditModal = forwardRef<
  { openModal: () => void; closeModal: () => void }, // Ref type
  Props // Props type
>(({ imgSrc, name, deptSap, phone, reqId, onBack, onSubmit }, ref) => {
  const modalRef = useRef<HTMLDialogElement>(null);
  const [selectedUserType, setSelectedUserType] = useState<string>("พนักงาน กฟภ.");

  useImperativeHandle(ref, () => ({
    openModal: () => modalRef.current?.showModal(),
    closeModal: () => modalRef.current?.close(),
  }));

  const schema = yup.object().shape({
    telInternal: yup.string().optional(),
    name: yup.string().optional(),
    remark: yup.string().optional(),
    telMobile: yup
    .string()
    .when("selectedUserType", (selectedUserType: any, schema) =>
      typeof selectedUserType === "string" && selectedUserType !== "พนักงานขับรถ"
        ? schema
            .matches(/^\d{10}$/, "กรุณากรอกเบอร์โทรศัพท์ให้ถูกต้อง")
            .required("กรุณากรอกเบอร์โทรศัพท์")
        : schema.optional()
    ),
  });

  
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isValid },
  } = useForm({
    mode: "onChange",
    resolver: yupResolver(schema),
    defaultValues: {
      telInternal: "",
      name: "",
      remark: "",
      telMobile: "",
    },
  });

  const [vehicleUserDatas, setVehicleUserDatas] = useState<VehicleUserType[]>(
    []
  );

  const [selectedVehicleUserOption, setSelectedVehicleUserOption] = useState<{
    value: string;
    label: string;
  } | null>(null);
  const [selectedUserDept, setSelectedUserDept] = useState("");
  const [driverOptions, setDriverOptions] = useState<
    { value: string; label: string }[]
  >([]);
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
    console.log('test',selectedOption);

    const empData = vehicleUserDatas.find(
      (user) => user.emp_id === selectedOption.value
    );

    if (empData) {
      setSelectedUserDept(empData.dept_sap_short || "");
    }
  };

  const submit = async (data: any) => {
    let payload;

    if (selectedUserType === "พนักงาน กฟภ.") {
      // Handle payload for internal employee
      payload = {
        received_key_dept_sap: selectedVehicleUserOption?.value || "",
        received_key_dept_sap_full: selectedUserDept || "",
        received_key_dept_sap_short: selectedUserDept || "",
        received_key_emp_id: selectedVehicleUserOption?.value || "",
        received_key_emp_name: selectedVehicleUserOption?.label || "",
        received_key_internal_contact_number: data.telInternal || "", // Get from form data
        received_key_mobile_contact_number: data.telMobile || "", // Get from form data
        received_key_remark: data.remark || "", // Get from form data
        trn_request_uid: reqId || "",
      };
    } else if (selectedUserType === "บุคคลภายนอก") {
      // Handle payload for outsider
      payload = {
        outsider_name: data.name || "", // Get from form data
        received_key_mobile_contact_number: data.telMobile || "", // Get from form data
        received_key_remark: data.remark || "", // Get from form data
        trn_request_uid: reqId || "",
      };
    }else{
      payload = {
        trn_request_uid: reqId || "",
      };
    }

    try {
      // Update API call based on selectedUserType
      let res;
      if (selectedUserType === "พนักงาน กฟภ.") {
        res = await updateKeyPickupPea(payload);
      } else if (selectedUserType === "บุคคลภายนอก") {
        res = await updateKeyPickupOutsider(payload);
      }else{
        res = await updateKeyPickupDriver(payload);
      }
      console.log("API Response:", res);
      if (onSubmit) {
        onSubmit();
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
              แก้ไขผู้มารับกุญแจ{" "}
            </Link>
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
                <div className="custom-group flex flex-col !gap-0">
                  <RadioButton
                    name="userType"
                    label="พนักงานขับรถ"
                    value="พนักงานขับรถ"
                    selectedValue={selectedUserType}
                    setSelectedValue={setSelectedUserType}
                  />
                  <RadioButton
                    name="userType"
                    label="พนักงาน กฟภ."
                    value="พนักงาน กฟภ."
                    selectedValue={selectedUserType}
                    setSelectedValue={setSelectedUserType}
                  />
                  <RadioButton
                    name="userType"
                    label="บุคคลภายนอก"
                    value="บุคคลภายนอก"
                    selectedValue={selectedUserType}
                    setSelectedValue={setSelectedUserType}
                  />
                </div>
                {/* <!-- <span className="form-helper">Helper</span> --> */}
              </div>
            </div>

            {selectedUserType == "พนักงาน กฟภ." ? (
              <div className="grid grid-cols-12 gap-4 mt-3">
                <div className="col-span-12">
                  <div className="form-group">
                    <label className="form-label">ชื่อ - นามสกุล</label>

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

                    <input
                      type="text"
                      className="form-control"
                      {...register("name")}
                      placeholder="ระบุชื่อ-นามสกุล"
                    />
                  </div>
                </div>

                <div className="col-span-12 md:col-span-12">
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
                        placeholder="ระบุเบอร์โทรศัพท์"
                        {...register("telMobile")}
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
            ) : (
              <div className="col-span-12">
                <div className="form-card w-full mt-5">
                  <div className="form-card-body">
                    <div className="form-group form-plaintext form-users">
                      <Image
                        src={imgSrc}
                        className="avatar avatar-md"
                        width={100}
                        height={100}
                        alt=""
                      />
                      <div className="form-plaintext-group align-self-center">
                        <div className="form-label">{name}</div>
                        <div className="supporting-text-group">
                          <div className="supporting-text">{deptSap}</div>
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
            <form method="dialog" className="w-[50%] md:w-auto">
              <button className="btn btn-secondary w-full">ไม่ใช่ตอนนี้</button>
            </form>
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
