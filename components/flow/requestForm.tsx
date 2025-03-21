import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import CustomSelect from "@/components/customSelect";
import DatePicker from "@/components/datePicker";
import TimePicker from "@/components/timePicker";
import NumberInput from "@/components/numberInput";
import RadioButton from "@/components/radioButton";
import Tooltip from "@/components/tooltips";
import FormHelper from "../formHelper";
import { useRouter } from "next/navigation";
import { useFormContext } from "@/contexts/requestFormContext";
import {
  fetchCostTypes,
  fetchVehicleUsers,
  uploadFile,
} from "@/services/masterService";
import { yupResolver } from "@hookform/resolvers/yup";
import { useProfile } from "@/contexts/profileContext";

const schema = yup.object().shape({
  telInternal: yup.string().matches(/^\d+$/, "กรุณากรอกเบอร์ภายในให้ถูกต้อง"),
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
  userImageUrl: yup.string()
});

interface VehicleUser {
  emp_id: string;
  full_name: string;
  dept_sap: string;
  tel_internal?: string;
  tel_mobile: string;
  dept_sap_short: string;
  image_url: string;
}

export default function RequestForm() {
  const router = useRouter();
  const { profile } = useProfile();
  const [fileName, setFileName] = useState("อัพโหลดเอกสารแนบ");
  const [selectedTravelType, setSelectedTravelType] = useState("1");
  const { updateFormData } = useFormContext();
  const [vehicleUserDatas, setVehicleUserDatas] = useState<VehicleUser[]>([]);
  const [costTypeOptions, setCostTypeOptions] = useState<
    { value: string; label: string }[]
  >([]);
  const [selectedCostTypeOption, setSelectedCostTypeOption] = useState(
    costTypeOptions[0]
  );

  const [driverOptions, setDriverOptions] = useState<
    { value: string; label: string }[]
  >([]);

  const [passengerCount, setPassengerCount] = useState(0);
  const [fileError, setFileError] = useState("");

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await fetchVehicleUsers("");
        if (response.status === 200) {
          const vehicleUserData: VehicleUser[] = response.data;
          setVehicleUserDatas(vehicleUserData);
          const driverOptionsArray = [
            ...vehicleUserData.map(
              (user: {
                emp_id: string;
                full_name: string;
                dept_sap: string;
              }) => ({
                value: user.emp_id,
                label: `${user.full_name} (${user.dept_sap})`,
              })
            ),
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
          const costTypeArr = [
            ...costTypeData.map(
              (cost: {
                ref_cost_type_code: string;
                ref_cost_type_name: string;
              }) => ({
                value: cost.ref_cost_type_code,
                label: cost.ref_cost_type_name,
              })
            ),
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
  const [selectedVehicleUserOption, setSelectedVehicleUserOption] = useState(
    driverOptions[0]
  );

  useEffect(() => {
    if (profile && profile.emp_id && vehicleUserDatas.length > 0) {
      const defaultVehicleUser = vehicleUserDatas.find(
        (user) => user.emp_id === profile.emp_id
      );
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile, vehicleUserDatas]);

  const handleVehicleUserChange = async (selectedOption: {
    value: string;
    label: string;
  }) => {
    setSelectedVehicleUserOption(selectedOption);

    const empData = vehicleUserDatas.find(
      (user: { emp_id: string }) => user.emp_id === selectedOption.value
    );

    if (empData) {
      setValue("telInternal", empData.tel_internal);
      setValue("telMobile", empData.tel_mobile);
      setValue("deptSapShort", empData.dept_sap_short);
      setValue("deptSap", empData.dept_sap);
      setValue("userImageUrl", empData.image_url);
    }
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (!event.target.files) return;
    const file = event.target.files?.[0];
    setFileName(file ? file.name : "อัพโหลดเอกสารแนบ");

    try {
      const response = await uploadFile(file);
      setValue("attachmentFile", response.file_url);
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message;
      setFileError(errorMessage);
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
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onSubmit = (data: any) => {
    data.vehicleUserEmpId = selectedVehicleUserOption.value;
    data.vehicleUserEmpName = selectedVehicleUserOption.label;
    data.numberOfPassanger = passengerCount;
    data.refCostTypeCode = selectedCostTypeOption.value;
    data.tripType = selectedTravelType;
    console.log("Form Data:", data);
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
                    <span className="page-title-label">
                      ข้อมูลผู้ใช้ยานพาหนะ
                    </span>
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

                <div className="flex-1">
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
                    <div
                      className={`input-group ${
                        errors.telInternal && "is-invalid"
                      }`}
                    >
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
                    {errors.telInternal && (
                      <FormHelper text={String(errors.telInternal.message)} />
                    )}
                  </div>
                </div>

                <div className="flex-1">
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
              </div>
            </div>

            <div className="form-section">
              <div className="page-section-header border-0">
                <div className="page-header-left">
                  <div className="page-title">
                    <span className="page-title-label">
                      รายละเอียดการเดินทาง
                    </span>
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
                          <i className="material-symbols-outlined">
                            calendar_month
                          </i>
                        </span>
                      </div>
                      <DatePicker
                        placeholder="ระบุวันที่"
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
                          <i className="material-symbols-outlined">
                            calendar_month
                          </i>
                        </span>
                      </div>
                      <DatePicker
                        placeholder="ระบุวันที่"
                        onChange={(dateStr) => setValue("endDate", dateStr)}
                      />
                    </div>
                  </div>
                </div>

                <div className="col-span-12 md:col-span-3 journey-time">
                  <div className="form-group">
                    <label className="form-label">วันที่สิ้นสุดเดินทาง</label>
                    <div className="input-group">
                      <TimePicker
                        onChange={(dateStr) => setValue("timeEnd", dateStr)}
                      />
                    </div>
                  </div>
                </div>

                <div className="col-span-12 md:col-span-3">
                  <div className="form-group">
                    <label className="form-label">
                      จำนวนผู้โดยสาร{" "}
                      <span className="form-optional">(รวมผู้ขับขี่)</span>
                    </label>

                    <NumberInput
                      value={passengerCount}
                      onChange={setPassengerCount}
                    />
                  </div>
                </div>

                <div className="col-span-12 md:col-span-3">
                  <div className="form-group">
                    <label className="form-label">ประเภทการเดินทาง</label>
                    <div className="custom-group">
                      <RadioButton
                        name="travelType"
                        label="ไป-กลับ"
                        value="1"
                        selectedValue={selectedTravelType}
                        setSelectedValue={setSelectedTravelType}
                      />

                      <RadioButton
                        name="travelType"
                        label="ค้างแรม"
                        value="2"
                        selectedValue={selectedTravelType}
                        setSelectedValue={setSelectedTravelType}
                      />
                    </div>
                  </div>
                </div>

                <div className="col-span-12 md:col-span-6">
                  <div className="form-group">
                    <label className="form-label">สถานที่ปฏิบัติงาน</label>
                    <div
                      className={`input-group ${
                        errors.workPlace && "is-invalid"
                      }`}
                    >
                      <div className="input-group-prepend">
                        <span className="input-group-text">
                          <i className="material-symbols-outlined">
                            emoji_transportation
                          </i>
                        </span>
                      </div>
                      <input
                        type="text"
                        className="form-control"
                        {...register("workPlace")}
                        placeholder="ระบุสถานที่ปฏิบัติงาน"
                      />
                    </div>
                    {errors.workPlace && (
                      <FormHelper text={String(errors.workPlace.message)} />
                    )}
                  </div>
                </div>

                <div className="col-span-12 md:col-span-6">
                  <div className="form-group">
                    <label className="form-label">วัตถุประสงค์</label>
                    <div
                      className={`input-group ${
                        errors.purpose && "is-invalid"
                      }`}
                    >
                      <div className="input-group-prepend">
                        <span className="input-group-text">
                          <i className="material-symbols-outlined">target</i>
                        </span>
                      </div>
                      <input
                        type="text"
                        className="form-control"
                        {...register("purpose")}
                        placeholder="ระบุวัตถุประสงค์"
                      />
                    </div>
                    {errors.purpose && (
                      <FormHelper text={String(errors.purpose.message)} />
                    )}
                  </div>
                </div>

                <div className="col-span-12 md:col-span-3">
                  <div className="form-group">
                    <label className="form-label">
                      เลขที่หนังสืออ้างอิง{" "}
                      <span className="form-optional">(ถ้ามี)</span>
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
                    <div
                      className={`input-group input-uploadfile ${
                        fileError && "is-invalid"
                      }`}
                    >
                      {/* <input type="file" className="file-input hidden" /> */}
                      <label className="flex items-center gap-2 cursor-pointer">
                        <div className="input-group-prepend">
                          <span className="input-group-text">
                            <i className="material-symbols-outlined">
                              attach_file
                            </i>
                          </span>
                        </div>
                        <input
                          type="file"
                           accept="application/pdf"
                          className="file-input hidden"
                          onChange={handleFileChange}
                        />
                        <div className="input-uploadfile-label w-full">
                          {fileName}
                        </div>
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
                      onChange={setSelectedCostTypeOption}
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
                      <input
                        type="text"
                        className="form-control"
                        placeholder=""
                      />
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
            <i className="material-symbols-outlined icon-settings-300-24">
              arrow_right_alt
            </i>
          </button>
        </div>
      </form>
    </>
  );
}
