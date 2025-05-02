import { ApproverUserType } from "@/app/types/approve-user-type";
import { VehicleUserType } from "@/app/types/vehicle-user-type";
import CustomSelect, { CustomSelectOption } from "@/components/customSelect";
import DatePicker from "@/components/datePicker";
import FormHelper from "@/components/formHelper";
import NumberInput from "@/components/numberInput";
import RadioButton from "@/components/radioButton";
import TimePicker from "@/components/timePicker";
import Tooltip from "@/components/tooltips";
import { useProfile } from "@/contexts/profileContext";
import { useFormContext } from "@/contexts/requestFormContext";
import { fetchCostTypes, fetchUserApproverUsers, fetchVehicleUsers, uploadFile } from "@/services/masterService";
import { shortenFilename } from "@/utils/shortenFilename";
import { yupResolver } from "@hookform/resolvers/yup";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";

const schema = yup.object().shape({
  telInternal: yup.string().optional(),
  telMobile: yup
    .string()
    .matches(/^\d{10}$/, "กรุณากรอกเบอร์โทรศัพท์ให้ถูกต้อง")
    .required("กรุณากรอกเบอร์โทรศัพท์"),
  workPlace: yup.string().required("กรุณาระบุสถานที่ปฎิบัติงาน"),
  purpose: yup.string().required("กรุณาระบุวัตถุประสงค์"),
  remark: yup.string(),
  referenceNumber: yup.string(),
  startDate: yup.string(),
  endDate: yup.string(),
  refCostTypeCode: yup.string(),
  timeStart: yup.string(),
  timeEnd: yup.string(),
  attachmentFile: yup.string(),
  deptSapShort: yup.string(),
  deptSap: yup.string(),
  userImageUrl: yup.string(),
  costOrigin: yup.string(),
});

interface costType {
  ref_cost_type_code: string;
  ref_cost_type_name: string;
  ref_cost_no: string;
}

export default function RequestForm() {
  const router = useRouter();
  const { profile } = useProfile();
  const [fileName, setFileName] = useState("อัพโหลดเอกสารแนบ");
  const [selectedTripType, setSelectedTripType] = useState("1");
  const { formData, updateFormData } = useFormContext();
  const [vehicleUserDatas, setVehicleUserDatas] = useState<VehicleUserType[]>([]);
  const [costTypeOptions, setCostTypeOptions] = useState<{ value: string; label: string }[]>([]);
  const [selectedCostTypeOption, setSelectedCostTypeOption] = useState(costTypeOptions[0]);

  const [driverOptions, setDriverOptions] = useState<{ value: string; label: string }[]>([]);

  const [passengerCount, setPassengerCount] = useState(0);
  const [costTypeDatas, setCostTypeDatas] = useState<costType[]>([]);
  const [fileError, setFileError] = useState("");
  const [approverData, setApproverData] = useState<ApproverUserType>();

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await fetchVehicleUsers("");
        if (response.status === 200) {
          const vehicleUserData: VehicleUserType[] = response.data;
          setVehicleUserDatas(vehicleUserData);
          const driverOptionsArray = [
            ...vehicleUserData.map((user: { emp_id: string; full_name: string; dept_sap: string }) => ({
              value: user.emp_id,
              label: `${user.full_name} (${user.dept_sap})`,
            })),
          ];

          setDriverOptions(driverOptionsArray);
        }
      } catch (error) {
        console.error("Error fetching requests:", error);
      }
    };

    const fetchCostTypeRequest = async () => {
      try {
        const response = await fetchCostTypes();
        if (response.status === 200) {
          const costTypeData = response.data;
          setCostTypeDatas(costTypeData);
          const costTypeArr = [
            ...costTypeData.map((cost: { ref_cost_type_code: string; ref_cost_type_name: string }) => ({
              value: cost.ref_cost_type_code,
              label: cost.ref_cost_type_name,
            })),
          ];

          setCostTypeOptions(costTypeArr);
        }
      } catch (error) {
        console.error("Error fetching requests:", error);
      }
    };

    fetchRequests();
    fetchCostTypeRequest();
  }, []);
  const [selectedVehicleUserOption, setSelectedVehicleUserOption] = useState(driverOptions[0]);

  useEffect(() => {
    if (profile && profile.emp_id && vehicleUserDatas.length > 0) {
      if (formData.vehicleUserEmpId) {
        setSelectedVehicleUserOption({
          value: formData.vehicleUserEmpId,
          label: `${formData.vehicleUserEmpName} (${formData.vehicleUserDeptSap})`,
        });
      } else {
        const defaultVehicleUser = vehicleUserDatas.find((user) => user.emp_id === profile.emp_id);
        if (defaultVehicleUser) {
          setSelectedVehicleUserOption({
            value: defaultVehicleUser.emp_id,
            label: `${defaultVehicleUser.full_name} (${defaultVehicleUser.dept_sap})`,
          });
          setValue("telInternal", defaultVehicleUser.tel_internal);
          setValue("telMobile", defaultVehicleUser.tel_mobile);
          setValue("deptSapShort", defaultVehicleUser.dept_sap_short);
          setValue("deptSap", defaultVehicleUser.dept_sap);
          setValue("userImageUrl", defaultVehicleUser.image_url);
        }
      }
    }

    const fetchApprover = async () => {
      try {
        const response = await fetchUserApproverUsers("");
        if (response.status === 200) {
          const data = response.data[0];
          setApproverData(data);
        }
      } catch (error) {
        console.error("Error fetching requests:", error);
      }
    };

    fetchApprover();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile, vehicleUserDatas]);

  const handleVehicleUserChange = async (selectedOption: CustomSelectOption) => {
    setSelectedVehicleUserOption(selectedOption as { value: string; label: string });

    const empData = vehicleUserDatas.find((user: { emp_id: string }) => user.emp_id === selectedOption.value);

    if (empData) {
      setValue("telInternal", empData.tel_internal);
      setValue("telMobile", empData.tel_mobile);
      setValue("deptSapShort", empData.dept_sap_short);
      setValue("deptSap", empData.dept_sap);
      setValue("userImageUrl", empData.image_url);
    }
  };

  const handleCostTypeChange = async (selectedOption: CustomSelectOption) => {
    setSelectedCostTypeOption(selectedOption as { value: string; label: string });

    const data = costTypeDatas.find(
      (cost: { ref_cost_type_code: string }) => cost.ref_cost_type_code === selectedOption.value
    );

    if (data) {
      setValue("costOrigin", data.ref_cost_no);
    }
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files) return;
    const file = event.target.files?.[0];
    setFileName(file ? file.name : "อัพโหลดเอกสารแนบ");

    try {
      const response = await uploadFile(file);
      setValue("attachmentFile", response.file_url || "");
      setFileName(shortenFilename(response.file_url) || "อัพโหลดเอกสารแนบ");
    } catch (error: unknown) {
      if (typeof error === "object" && error !== null && "response" in error) {
        const axiosError = error as {
          response?: { data?: { message?: string } };
        };
        setFileError(axiosError.response?.data?.message || "Upload failed");
      } else {
        setFileError("An unexpected error occurred");
      }
    }
  };

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isValid },
  } = useForm({
    mode: "onChange",
    resolver: yupResolver(schema),
    defaultValues: {
      telInternal: formData.telInternal || "",
      telMobile: formData.telMobile || "",
      workPlace: formData.workPlace || "",
      purpose: formData.purpose || "",
      remark: formData.remark || "",
      referenceNumber: formData.referenceNumber || "",
      startDate: formData.startDate || "",
      endDate: formData.endDate || "",
      refCostTypeCode: formData.refCostTypeCode || "",
      timeStart: formData.timeStart || "",
      timeEnd: formData.timeEnd || "",
      attachmentFile: formData.attachmentFile || "",
      deptSapShort: formData.deptSapShort || "",
      deptSap: formData.vehicleUserDeptSap || "",
      userImageUrl: formData.userImageUrl || "",
    },
  });

  useEffect(() => {
    if (formData.numberOfPassenger) {
      setPassengerCount(formData.numberOfPassenger);
    }
    if (formData.tripType) {
      setSelectedTripType(String(formData.tripType));
    }

    if (formData.attachmentFile) {
      setFileName(shortenFilename(String(formData?.attachmentFile)));
    }

    const data = costTypeDatas.find(
      (cost: { ref_cost_type_code: string }) => String(cost.ref_cost_type_code) === String(formData.refCostTypeCode)
    );

    if (data) {
      setSelectedCostTypeOption({
        value: data.ref_cost_type_code,
        label: data.ref_cost_type_name,
      });
      setValue("costOrigin", data.ref_cost_no);
    }
  }, [formData, costTypeDatas]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onSubmit = (data: any) => {
    data.vehicleUserEmpId = selectedVehicleUserOption.value;
    const result = selectedVehicleUserOption.label.split("(")[0].trim();
    data.vehicleUserEmpName = result;
    data.vehicleUserDeptSap = data.deptSap;
    data.numberOfPassenger = passengerCount;
    data.refCostTypeCode = selectedCostTypeOption.value;
    data.tripType = selectedTripType;
    data.approvedRequestDeptSap = approverData?.dept_sap;
    data.approvedRequestDeptSapFull = approverData?.dept_sap_full;
    data.approvedRequestDeptSapShort = approverData?.dept_sap_short;
    data.approvedRequestEmpId = approverData?.emp_id;
    data.approvedRequestEmpName = approverData?.full_name;
    localStorage.setItem("processOne", "Done");
    updateFormData(data);
    router.push("process-two");
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="form-steps-group">
          <div className="form-steps" data-step="1">
            <div className="form-section">
              <div className="page-section-header border-0">
                <div className="page-header-left">
                  <div className="page-title">
                    <span className="page-title-label">ข้อมูลผู้ใช้ยานพาหนะ</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 flex-col md:flex-row w-full flex-wrap gap-5">
                <div className="flex-1">
                  <div className="form-group">
                    <label className="form-label">
                      ผู้ใช้ยานพาหนะ
                      <Tooltip
                        title="ผู้ใช้ยานพาหนะคือ?"
                        content="คือคนที่รับผิดชอบยานพาหนะในการเดินทางครั้งนี้ มีหน้าที่ในการกรอกเลขไมล์และ เบิกค่าน้ำมัน"
                        position="right"
                      >
                        <i className="material-symbols-outlined">info</i>
                      </Tooltip>
                    </label>

                    <CustomSelect
                      iconName="person"
                      w="w-full"
                      options={driverOptions}
                      value={selectedVehicleUserOption}
                      onChange={handleVehicleUserChange}
                    />
                  </div>
                </div>

                <input
                  type="hidden"
                  className="form-control pointer-events-none"
                  {...register("deptSap")}
                  placeholder=""
                  readOnly
                />

                <div className="flex-1">
                  <div className="form-group">
                    <label className="form-label">ตำแหน่ง / สังกัด</label>
                    <div className="input-group is-readonly">
                      <div className="input-group-prepend">
                        <span className="input-group-text">
                          <i className="material-symbols-outlined">business_center</i>
                        </span>
                      </div>
                      <input
                        type="text"
                        className="form-control pointer-events-none"
                        {...register("deptSapShort")}
                        placeholder=""
                        readOnly
                      />
                    </div>
                  </div>
                </div>

                <div className="flex-1">
                  <div className="form-group">
                    <label className="form-label">เบอร์ภายใน</label>
                    <div className={`input-group ${errors.telInternal && "is-invalid"}`}>
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
                    {errors.telInternal && <FormHelper text={String(errors.telInternal.message)} />}
                  </div>
                </div>

                <div className="flex-1">
                  <div className="form-group">
                    <label className="form-label">เบอร์โทรศัพท์</label>
                    <div className={`input-group ${errors.telMobile && "is-invalid"}`}>
                      <div className="input-group-prepend">
                        <span className="input-group-text">
                          <i className="material-symbols-outlined">smartphone</i>
                        </span>
                      </div>
                      <input
                        type="text"
                        className="form-control"
                        {...register("telMobile")}
                        placeholder="ระบุเบอร์โทรศัพท์"
                      />
                    </div>
                    {errors.telMobile && <FormHelper text={String(errors.telMobile.message)} />}
                  </div>
                </div>
              </div>
            </div>

            <div className="form-section">
              <div className="page-section-header border-0">
                <div className="page-header-left">
                  <div className="page-title">
                    <span className="page-title-label">รายละเอียดการเดินทาง</span>
                  </div>
                </div>
              </div>

              <div className="grid w-full flex-wrap gap-5 grid-cols-12">
                <div className="col-span-6 md:col-span-3">
                  <div className="form-group">
                    <label className="form-label">วันที่เริ่มต้นเดินทาง</label>
                    <div className="input-group">
                      <div className="input-group-prepend">
                        <span className="input-group-text">
                          <i className="material-symbols-outlined">calendar_month</i>
                        </span>
                      </div>
                      <DatePicker
                        placeholder={formData?.startDate || "ระบุวันที่"}
                        onChange={(dateStr) => setValue("startDate", dateStr)}
                      />
                    </div>
                  </div>
                </div>

                <div className="col-span-12 md:col-span-3 journey-time">
                  <div className="form-group">
                    <label className="form-label">เวลาที่ออกเดินทาง</label>
                    <div className="input-group">
                      <TimePicker
                        defaultValue={formData.timeStart}
                        onChange={(dateStr) => setValue("timeStart", dateStr)}
                      />
                    </div>
                  </div>
                </div>

                <div className="col-span-6 md:col-span-3">
                  <div className="form-group">
                    <label className="form-label">วันที่สิ้นสุดเดินทาง</label>
                    <div className="input-group">
                      <div className="input-group-prepend">
                        <span className="input-group-text">
                          <i className="material-symbols-outlined">calendar_month</i>
                        </span>
                      </div>
                      <DatePicker
                        placeholder={formData?.endDate || "ระบุวันที่"}
                        onChange={(dateStr) => setValue("endDate", dateStr)}
                      />
                    </div>
                  </div>
                </div>

                <div className="col-span-12 md:col-span-3 journey-time">
                  <div className="form-group">
                    <label className="form-label">เวลาที่สิ้นสุดเดินทาง</label>
                    <div className="input-group">
                      <TimePicker
                        defaultValue={formData.timeEnd}
                        onChange={(dateStr) => setValue("timeEnd", dateStr)}
                      />
                    </div>
                  </div>
                </div>

                <div className="col-span-12 md:col-span-3">
                  <div className="form-group">
                    <label className="form-label">
                      จำนวนผู้โดยสาร <span className="form-optional">(รวมผู้ขับขี่)</span>
                    </label>

                    <NumberInput value={passengerCount} onChange={setPassengerCount} />
                  </div>
                </div>

                <div className="col-span-12 md:col-span-3">
                  <div className="form-group">
                    <label className="form-label">ประเภทการเดินทาง</label>
                    <div className="custom-group">
                      <RadioButton
                        name="tripType"
                        label="ไป-กลับ"
                        value="1"
                        selectedValue={selectedTripType}
                        setSelectedValue={setSelectedTripType}
                      />

                      <RadioButton
                        name="tripType"
                        label="ค้างแรม"
                        value="2"
                        selectedValue={selectedTripType}
                        setSelectedValue={setSelectedTripType}
                      />
                    </div>
                  </div>
                </div>

                <div className="col-span-12 md:col-span-6">
                  <div className="form-group">
                    <label className="form-label">สถานที่ปฏิบัติงาน</label>
                    <div className={`input-group ${errors.workPlace && "is-invalid"}`}>
                      <div className="input-group-prepend">
                        <span className="input-group-text">
                          <i className="material-symbols-outlined">emoji_transportation</i>
                        </span>
                      </div>
                      <input
                        type="text"
                        className="form-control"
                        {...register("workPlace")}
                        placeholder="ระบุสถานที่ปฏิบัติงาน"
                      />
                    </div>
                    {errors.workPlace && <FormHelper text={String(errors.workPlace.message)} />}
                  </div>
                </div>

                <div className="col-span-12 md:col-span-6">
                  <div className="form-group">
                    <label className="form-label">วัตถุประสงค์</label>
                    <div className={`input-group ${errors.purpose && "is-invalid"}`}>
                      <div className="input-group-prepend">
                        <span className="input-group-text">
                          <i className="material-symbols-outlined">target</i>
                        </span>
                      </div>
                      <input
                        type="text"
                        className="form-control select-none"
                        {...register("purpose")}
                        placeholder="ระบุวัตถุประสงค์"
                      />
                    </div>
                    {errors.purpose && <FormHelper text={String(errors.purpose.message)} />}
                  </div>
                </div>

                <div className="col-span-12 md:col-span-3">
                  <div className="form-group">
                    <label className="form-label">
                      เลขที่หนังสืออ้างอิง <span className="form-optional">(ถ้ามี)</span>
                    </label>
                    <div className="input-group">
                      <div className="input-group-prepend">
                        <span className="input-group-text">
                          <i className="material-symbols-outlined">docs</i>
                        </span>
                      </div>
                      <input
                        type="text"
                        className="form-control"
                        {...register("referenceNumber")}
                        placeholder="ระบุเลขที่หนังสืออ้างอิง"
                      />
                    </div>
                  </div>
                </div>

                <div className="col-span-12 md:col-span-3">
                  <div className="form-group">
                    <label className="form-label">
                      เอกสารแนบ <span className="form-optional">(ถ้ามี)</span>
                    </label>
                    <div className={`input-group input-uploadfile ${fileError && "is-invalid"}`}>
                      {/* <input type="file" className="file-input hidden" /> */}
                      <label className="flex items-center gap-2 cursor-pointer">
                        <div className="input-group-prepend">
                          <span className="input-group-text">
                            <i className="material-symbols-outlined">attach_file</i>
                          </span>
                        </div>
                        <input
                          type="file"
                          accept="application/pdf"
                          className="file-input hidden"
                          onChange={handleFileChange}
                        />
                        <div className="input-uploadfile-label w-full">{fileName}</div>
                      </label>
                    </div>
                    {fileError && <FormHelper text={fileError} />}
                  </div>
                </div>

                <div className="col-span-12 md:col-span-10">
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
                      <input type="text" className="form-control" {...register("remark")} placeholder="ระบุหมายเหตุ" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="form-section">
              <div className="page-section-header border-0">
                <div className="page-header-left">
                  <div className="page-title">
                    <span className="page-title-label">การเบิกค่าใช้จ่าย</span>
                  </div>
                </div>
              </div>

              <div className="grid gap-5 grid-cols-12">
                <div className="md:col-span-3 col-span-12">
                  <div className="form-group">
                    <label className="form-label">ประเภทงบประมาณ</label>
                    <CustomSelect
                      iconName="paid"
                      w="w-full"
                      options={costTypeOptions}
                      value={selectedCostTypeOption}
                      onChange={handleCostTypeChange}
                    />
                  </div>
                </div>

                <div className="md:col-span-3 col-span-12">
                  <div className="form-group">
                    <label className="form-label">ศูนย์ต้นทุน</label>
                    <div className="input-group is-readonly">
                      <div className="input-group-prepend">
                        <span className="input-group-text">
                          <i className="material-symbols-outlined">crop_free</i>
                        </span>
                      </div>
                      <input type="text" className="form-control" {...register("costOrigin")} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="form-action">
          <button type="submit" className="btn btn-primary" disabled={!isValid}>
            ต่อไป
            <i className="material-symbols-outlined icon-settings-300-24">arrow_right_alt</i>
          </button>
        </div>
      </form>
    </>
  );
}
