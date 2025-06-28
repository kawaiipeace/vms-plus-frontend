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
import {
  fetchCostCenter,
  fetchCostTypes,
  fetchUserApproverUsers,
  fetchVehicleUsers,
  uploadFile,
} from "@/services/masterService";
import { convertToThaiDate } from "@/utils/driver-management";
import { shortenFilename } from "@/utils/shortenFilename";
import { yupResolver } from "@hookform/resolvers/yup";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import CustomSelectOnSearch from "@/components/customSelectOnSearch";
import dayjs from "dayjs";

const schema = yup
  .object()
  .shape({
    telInternal: yup.string().min(4, "กรุณากรอกเบอร์ภายในให้ถูกต้อง"),
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
    vehicleUserEmpPosition: yup.string(),
    timeStart: yup.string(),
    timeEnd: yup.string(),
    attachmentFile: yup.string(),
    deptSapShort: yup.string(),
    wbsNumber: yup.string().when("refCostTypeCode", {
      is: (val: string) => val === "3",
      then: (schema) => schema.required("กรุณาระบุเลขที่ WBS"),
      otherwise: (schema) => schema.optional(),
    }),
    deptSap: yup.string(),
    userImageUrl: yup.string(),
    costCenter: yup.string().when("refCostTypeCode", {
      is: (val: string) => val === "1" || val === "2",
      then: (schema) => schema.required("กรุณาระบุการเบิกค่าใช้จ่าย"),
      otherwise: (schema) => schema.optional(),
    }),
    pmOrderNo: yup.string(),
    activityNo: yup.string(),
    networkNo: yup.string(),
  })
  .test(
    "at-least-one-for-4",
    "กรุณาระบุ เลขที่ใบสั่ง หรือ เลขที่กิจกรรม หรือ เลขที่โครงข่าย สำหรับประเภทงบประมาณนี้",
    function (value) {
      if (value.refCostTypeCode === "4") {
        return !!(value.pmOrderNo || value.activityNo || value.networkNo);
      }
      return true;
    }
  );

interface costType {
  ref_cost_type_code: string;
  ref_cost_type_name: string;
  cost_center: string;
}

interface costCenter {
  cost_center: string;
}

export default function RequestForm() {
  const router = useRouter();
  const { profile } = useProfile();
  const [fileName, setFileName] = useState("อัพโหลดเอกสารแนบ");
  const [selectedTripType, setSelectedTripType] = useState("0");
  const { formData, updateFormData } = useFormContext();
  const [loadingDrivers, setLoadingDrivers] = useState(false);
  const [loadingCostCenter, setLoadingCostCenter] = useState(false);
  const [vehicleUserDatas, setVehicleUserDatas] = useState<VehicleUserType[]>(
    []
  );
  const [costTypeOptions, setCostTypeOptions] = useState<
    { value: string; label: string }[]
  >([]);
  const [selectedCostTypeOption, setSelectedCostTypeOption] = useState<{
    value: string;
    label: string;
  }>({
    value: "",
    label: "",
  });
  const [costCenterOptions, setCostCenterOptions] = useState<
    { value: string; label: string }[]
  >([]);
  const [selectedCostCenterOption, setSelectedCostCenterOption] = useState<{
    value: string;
    label: string;
  }>();
  const [driverOptions, setDriverOptions] = useState<
    { value: string; label: string }[]
  >([]);
  const [passengerCount, setPassengerCount] = useState(1);
  const [costTypeDatas, setCostTypeDatas] = useState<costType[]>([]);
  const [costCenterDatas, setCostCenterDatas] = useState<costCenter[]>([]);
  const [fileError, setFileError] = useState("");
  const [approverData, setApproverData] = useState<ApproverUserType>();

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Add a handler to remove the uploaded file
  const handleRemoveFile = () => {
    setFileName("อัพโหลดเอกสารแนบ");
    setValue("attachmentFile", "");
    setFileError("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  useEffect(() => {
    fetchCostTypeRequest(profile?.emp_id || "");
  }, []);

  const fetchCostTypeRequest = async (id: string) => {
    console.log("cost", id);
    try {
      const response = await fetchCostTypes(id);
      if (response.status === 200) {
        const costTypeData = response.data;
        console.log("costtype", costTypeData);
        setCostTypeDatas(costTypeData);
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
        setValue("costCenter", costTypeData[0]?.cost_center || "");
      }
    } catch (error) {
      console.error("Error fetching requests:", error);
    }
  };

  const [selectedVehicleUserOption, setSelectedVehicleUserOption] = useState<{
    value: string;
    label: string;
  } | null>(null);

  useEffect(() => {
    // Set default times if not provided
    if (!formData.timeStart) {
      setValue("timeStart", "08:30");
    }
    if (!formData.timeEnd) {
      setValue("timeEnd", "16:30");
    }

    if (profile) {
      const fetchDefaultData = async () => {
        try {
          const response = await fetchVehicleUsers(
            formData?.vehicleUserEmpId
              ? formData?.vehicleUserEmpId
              : profile?.emp_id
          );

          if (response) {
            const vehicleUserData = response.data;
            setVehicleUserDatas(vehicleUserData);

            const driverOptionsArray = vehicleUserData.map(
              (user: {
                emp_id: string;
                full_name: string;
                dept_sap: string;
              }) => ({
                value: user.emp_id,
                label: `${user.full_name} (${user.emp_id})`,
              })
            );
            setDriverOptions(driverOptionsArray);

            const selectedDriverOption = {
              value: vehicleUserData[0]?.emp_id,
              label: `${vehicleUserData[0]?.full_name} (${vehicleUserData[0]?.emp_id})`,
            };

            if (vehicleUserData) {
              if (!formData) {
                setValue("telInternal", vehicleUserData[0].tel_internal);
                setValue("telMobile", vehicleUserData[0].tel_mobile);
              }

              setValue(
                "deptSapShort",
                `${vehicleUserData[0].posi_text} ${vehicleUserData[0].dept_sap_short}`
              );
              setValue("deptSap", vehicleUserData[0].dept_sap);
              setValue("userImageUrl", vehicleUserData[0].image_url);
              setValue(
                "vehicleUserEmpPosition",
                vehicleUserData[0].posi_text || ""
              );
            }

            setSelectedVehicleUserOption(selectedDriverOption);
          }
        } catch (error) {
          console.error("Error resetting options:", error);
        }
      };

      const fetchApprover = async () => {
        const param = {
          emp_id: profile?.emp_id,
        };
        try {
          const response = await fetchUserApproverUsers(param);
          if (response.status === 200) {
            const data = response.data[0];
            setApproverData(data);
          }
        } catch (error) {
          console.error("Error fetching requests:", error);
        }
      };

      fetchDefaultData();
      fetchApprover();
    }
  }, [profile, formData]);

  const handleVehicleUserChange = async (
    selectedOption: CustomSelectOption
  ) => {
    setValue("telInternal", "");
    setValue("telMobile", "");
    setValue("deptSapShort", "");
    setValue("vehicleUserEmpPosition", "");

    if (selectedOption.value === "") {
      setSelectedVehicleUserOption(null);
    } else {
      setSelectedVehicleUserOption(
        selectedOption as { value: string; label: string }
      );
      if (selectedOption?.value) {
        fetchCostTypeRequest(selectedOption.value); // send the selected id to fetchCostTypes
      }
    }

    // If cleared (value is empty), reset related fields
    if (!selectedOption.value) {
      setValue("telInternal", "");
      setValue("telMobile", "");
      setValue("deptSapShort", "");
      setValue("vehicleUserEmpPosition", "");
      return;
    }

    const empData = vehicleUserDatas.find(
      (user: { emp_id: string }) =>
        String(user.emp_id) === String(selectedOption.value)
    );

    if (empData) {
      if (!formData) {
        setValue("telInternal", empData.tel_internal);
        setValue("telMobile", empData.tel_mobile);
      }

      setValue("deptSapShort", empData.dept_sap_short);
      setValue("deptSap", empData.dept_sap);
      setValue("userImageUrl", empData.image_url);
      setValue("vehicleUserEmpPosition", empData.posi_text || "");
    }
  };

  const handleCostTypeChange = async (selectedOption: CustomSelectOption) => {
    setSelectedCostTypeOption(
      selectedOption as { value: string; label: string }
    );
    setValue("refCostTypeCode", selectedOption.value); // <-- add this line
    setValue("costCenter", "");

    if (selectedOption.value === "1") {
      const data = costTypeDatas.find(
        (cost: { ref_cost_type_code: string }) =>
          cost.ref_cost_type_code === selectedOption.value
      );

      if (data) {
        setValue("costCenter", data.cost_center);
      }
    }
  };

  const handleCostCenterChange = (selectedOption: CustomSelectOption) => {
    setSelectedCostCenterOption(
      selectedOption as { value: string; label: string }
    );
    setValue("costCenter", selectedOption.value);
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (!event.target.files) return;
    const file = event.target.files?.[0];

    // Check if file exists and is PDF
    if (file) {
      if (file.type !== "application/pdf") {
        setFileError("กรุณาอัพโหลดไฟล์ PDF เท่านั้น");
        setFileName("อัพโหลดเอกสารแนบ");
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
        return;
      }

      // Reset previous errors
      setFileError("");
      setFileName(file.name);

      try {
        const response = await uploadFile(file);
        setValue("attachmentFile", response.file_url || "");
      } catch (error: unknown) {
        if (
          typeof error === "object" &&
          error !== null &&
          "response" in error
        ) {
          const axiosError = error as {
            response?: { data?: { message?: string } };
          };
          setFileError(axiosError.response?.data?.message || "Upload failed");
        } else {
          setFileError("An unexpected error occurred");
        }
      }
    }
  };

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isValid },
    reset,
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
      timeStart: formData.timeStart || "08:30",
      timeEnd: formData.timeEnd || "16:30",
      attachmentFile: formData.attachmentFile || "",
      deptSapShort: formData.deptSapShort || "",
      deptSap: formData.vehicleUserDeptSap || "",
      userImageUrl: formData.userImageUrl || "",
      costCenter: formData.costCenter || "",
      pmOrderNo: formData.pmOrderNo || "",
      networkNo: formData.networkNo || "",
      activityNo: formData.activityNo || "",
    },
  });

  // Replace your existing watches and add:
  const startDate = watch("startDate");
  const endDate = watch("endDate");
  const isSameDay = startDate === endDate;
  const isOvernightDisabled = startDate === endDate;
  const [minTime, setMinTime] = useState("8:30");
  // ADD: Require cost center for type 2
  const isCostCenterRequired =
    selectedCostTypeOption?.value === "2" && !selectedCostCenterOption;

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
      (cost: { ref_cost_type_code: string }) =>
        String(cost.ref_cost_type_code) === String(formData.refCostTypeCode)
    );

    if (data) {
      setSelectedCostTypeOption({
        value: data.ref_cost_type_code,
        label: data.ref_cost_type_name,
      });
      setValue("costCenter", data.cost_center);
    }
  }, [formData, costTypeDatas]);

  useEffect(() => {
    if (costTypeDatas.length > 0 && selectedCostTypeOption.label === "") {
      const defaultData = costTypeDatas.find(
        (cost) => cost.ref_cost_type_code === (formData.refCostTypeCode || "1")
      );
      if (defaultData) {
        setSelectedCostTypeOption({
          value: defaultData.ref_cost_type_code,
          label: defaultData.ref_cost_type_name,
        });
        setValue("costCenter", defaultData.cost_center);
      }
    }
  }, [costTypeDatas, formData.refCostTypeCode]);

  const handleDriverSearch = async (search: string) => {
    const trimmed = search.trim();

    if (trimmed.length < 3) {
      setDriverOptions([]);
      setVehicleUserDatas([]); // Clear vehicleUserDatas if search is too short
      setLoadingDrivers(false);
      return;
    }

    setLoadingDrivers(true);
    try {
      const response = await fetchVehicleUsers(trimmed);
      if (response && Array.isArray(response.data)) {
        const vehicleUserData = response.data;
        setVehicleUserDatas(vehicleUserData); // <-- Update here!
        setDriverOptions(
          vehicleUserData.map(
            (user: { emp_id: string; full_name: string }) => ({
              value: user.emp_id,
              label: `${user.full_name} (${user.emp_id})`,
            })
          )
        );
      } else {
        setDriverOptions([]);
        setVehicleUserDatas([]);
      }
    } catch (error) {
      setDriverOptions([]);
      setVehicleUserDatas([]);
      console.error("Error in handleDriverSearch:", error);
    } finally {
      setLoadingDrivers(false);
    }
  };

  const handleCostCenterSearch = async (search: string) => {
    if (search.trim().length < 3) {
      setLoadingCostCenter(true);
      try {
        const response = await fetchCostCenter(search);
        if (response.status === 200) {
          const costCenterData = response.data;
          setCostCenterDatas(costCenterData);
          const costCenterArr = [
            ...costCenterData.map((cost: { cost_center: string }) => ({
              value: cost.cost_center,
              label: cost.cost_center,
            })),
          ];

          setCostCenterOptions(costCenterArr);
        } else {
          setCostCenterOptions([]);
        }
      } catch (error) {
        setCostCenterOptions([]);
        console.error("Error resetting options:", error);
      } finally {
        setLoadingCostCenter(false);
      }
      return;
    }

    setLoadingCostCenter(true);
    // try {
    //   const response = await fetchVehicleUsers(search);
    //   if (response.status === 200) {
    //     const vehicleUserData = response.data;
    //     const driverOptionsArray = vehicleUserData.map(
    //       (user: { emp_id: string; full_name: string; dept_sap: string }) => ({
    //         value: user.emp_id,
    //         label: `${user.full_name} (${user.emp_id})`,
    //       })
    //     );
    //     setDriverOptions(driverOptionsArray);
    //   } else {
    //     setDriverOptions([]);
    //   }
    // } catch (error) {
    //   if ((error as Error).name !== "AbortError") {
    //     setDriverOptions([]);
    //     console.error("Search failed:", error);
    //   }
    // } finally {
    //   setLoadingDrivers(false);
    // }
  };

  const onSubmit = (data: any) => {
    data.vehicleUserEmpId = selectedVehicleUserOption?.value;
    const result = selectedVehicleUserOption?.label.split("(")[0].trim();

    data.vehicleUserEmpName = result;
    data.vehicleUserDeptSap = data.deptSap;
    data.numberOfPassenger = passengerCount;
    data.refCostTypeCode = selectedCostTypeOption?.value;
    data.tripType = selectedTripType;
    data.approvedRequestDeptSap = approverData?.dept_sap;
    data.approvedRequestDeptSapFull = approverData?.dept_sap_full;
    data.approvedRequestDeptSapShort = approverData?.dept_sap_short;
    data.approvedRequestEmpId = approverData?.emp_id;
    data.approvedRequestEmpName = approverData?.full_name;

    if (selectedCostTypeOption?.value === "2" && selectedCostCenterOption) {
      data.costCenter = selectedCostCenterOption.value;
    } else {
      data.costCenter = data.costCenter;
    }
    data.vehicleUserEmpPosition = watch("vehicleUserEmpPosition") || "";

    localStorage.setItem("processOne", "Done");
    updateFormData(data);
    router.push("process-two");
  };

  useEffect(() => {
    if (!formData || Object.keys(formData).length === 0) {
      reset({
        telInternal: "",
        telMobile: "",
        workPlace: "",
        purpose: "",
        remark: "",
        referenceNumber: "",
        startDate: "",
        endDate: "",
        refCostTypeCode: "",
        timeStart: "08:30",
        timeEnd: "16:30",
        attachmentFile: "",
        deptSapShort: "",
        deptSap: "",
        userImageUrl: "",
        costCenter: "",
        pmOrderNo: "",
        networkNo: "",
        activityNo: "",
      });
      setFileName("อัพโหลดเอกสารแนบ");
      setSelectedVehicleUserOption(null);
      setSelectedCostTypeOption({ value: "", label: "" });
      setSelectedCostCenterOption(undefined);
      setPassengerCount(1);
      setSelectedTripType("0");
    }
  }, [formData, reset]);

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

                    <CustomSelectOnSearch
                      iconName="person"
                      w="w-full"
                      options={driverOptions}
                      value={selectedVehicleUserOption}
                      onChange={handleVehicleUserChange}
                      showDescriptions={true}
                      onSearchInputChange={handleDriverSearch}
                      loading={loadingDrivers}
                      enableSearchOnApi={true}
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
                        maxLength={10}
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
                        inputMode="numeric"
                        pattern="[0-9]*"
                        className="form-control"
                        maxLength={10}
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
                <div className="col-span-12 md:col-span-3">
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
                        placeholder="ระบุวันที่เริ่มต้นเดินทาง"
                        defaultValue={convertToThaiDate(formData.startDate)}
                        minDate={dayjs().format("YYYY-MM-DD")}
                        onChange={(dateStr) => setValue("startDate", dateStr)}
                      />
                    </div>
                  </div>
                </div>

                <div className="col-span-12 md:col-span-3 journey-time">
                  <div className="form-group">
                    <label className="form-label">เวลาที่ออกเดินทาง</label>
                    <div className="input-group">
                      <div className="input-group-prepend">
                        <span className="input-group-text">
                          <i className="material-symbols-outlined">schedule</i>
                        </span>
                      </div>
                      <TimePicker
                        placeholder="ระบุเวลาที่ออกเดินทาง"
                        defaultValue={
                          formData.timeEnd ? formData.timeEnd : "8:30"
                        }
                        onChange={(dateStr) => {
                          setValue("timeStart", dateStr);
                          setMinTime(dateStr);
                        }}
                      />
                    </div>
                  </div>
                </div>

                <div className="col-span-12 md:col-span-3">
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
                        placeholder="ระบุวันที่สิ้นสุดเดินทาง"
                        defaultValue={convertToThaiDate(formData.endDate)}
                        onChange={(dateStr) => setValue("endDate", dateStr)}
                        minDate={startDate}
                      />
                    </div>
                  </div>
                </div>

                <div className="col-span-12 md:col-span-3 journey-time">
                  <div className="form-group">
                    <label className="form-label">เวลาที่สิ้นสุดเดินทาง</label>
                    <div className="input-group">
                      <div className="input-group-prepend">
                        <span className="input-group-text">
                          <i className="material-symbols-outlined">schedule</i>
                        </span>
                      </div>
                      <TimePicker
                        defaultValue={
                          formData.timeEnd ? formData.timeEnd : "16:30"
                        }
                        placeholder="ระบุเวลาที่สิ้นสุดเดินทาง"
                        onChange={(dateStr) => setValue("timeEnd", dateStr)}
                        minTime={isSameDay ? minTime : undefined}
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
                        name="tripType"
                        label="ไป-กลับ"
                        value="0"
                        selectedValue={selectedTripType}
                        setSelectedValue={setSelectedTripType}
                      />

                      <RadioButton
                        name="tripType"
                        label="ค้างแรม"
                        value="1"
                        selectedValue={selectedTripType}
                        disabled={isOvernightDisabled}
                        setSelectedValue={setSelectedTripType}
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
                        className="form-control select-none"
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
                      <div className="flex items-center gap-2 w-full justify-between">
                        <label className="flex items-center gap-2 cursor-pointer mb-0">
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
                            ref={fileInputRef}
                          />
                          <div className="input-uploadfile-label w-full">
                            {fileName}
                          </div>
                        </label>
                        {fileName !== "อัพโหลดเอกสารแนบ" && (
                          <button
                            type="button"
                            onClick={handleRemoveFile}
                            className="ml-2 text-gray-400 hover:text-gray-500"
                            aria-label="Remove file"
                            tabIndex={0}
                          >
                            <i className="material-symbols-outlined">
                              close_small
                            </i>
                          </button>
                        )}
                      </div>
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
                      position="top"
                      onChange={handleCostTypeChange}
                    />
                  </div>
                </div>
                {selectedCostTypeOption?.value === "1" && (
                  <div className="md:col-span-3 col-span-12">
                    <div className="form-group">
                      <label className="form-label">ศูนย์ต้นทุน</label>
                      <div
                        className={`input-group ${
                          selectedCostTypeOption?.value === "1"
                            ? "is-readonly"
                            : ""
                        }`}
                      >
                        <div className="input-group-prepend">
                          <span className="input-group-text">
                            <i className="material-symbols-outlined">
                              crop_free
                            </i>
                          </span>
                        </div>
                        <input
                          type="text"
                          className="form-control"
                          {...register("costCenter")}
                        />
                      </div>
                    </div>
                  </div>
                )}
                {selectedCostTypeOption?.value === "2" && (
                  <div className="md:col-span-4 col-span-12">
                    <div className="form-group">
                      <label className="form-label">ศูนย์ต้นทุน</label>
                      <CustomSelectOnSearch
                        iconName="business_center"
                        w="w-full"
                        options={costCenterOptions}
                        value={selectedCostCenterOption}
                        onChange={handleCostCenterChange}
                        onSearchInputChange={handleCostCenterSearch}
                        loading={loadingCostCenter}
                        enableSearchOnApi={true}
                      />
                    </div>
                  </div>
                )}
                {selectedCostTypeOption?.value === "3" && (
                  <>
                    <div className="md:col-span-3 col-span-12">
                      <div className="form-group">
                        <label className="form-label">เลขที่ WBS</label>
                        <div className={`input-group`}>
                          <input
                            type="text"
                            className="form-control"
                            placeholder="ระบุเลขที่ WBS"
                            {...register("wbsNumber")}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="md:col-span-3 col-span-12">
                      <div className="form-group">
                        <label className="form-label">เลขที่โครงข่าย</label>
                        <div className={`input-group`}>
                          <input
                            type="text"
                            className="form-control"
                            placeholder="ระบุเลขที่โครงข่าย"
                            {...register("networkNo")}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="md:col-span-3 col-span-12">
                      <div className="form-group">
                        <label className="form-label">เลขที่กิจกรรม</label>
                        <div className={`input-group`}>
                          <input
                            type="text"
                            className="form-control"
                            placeholder="ระบุเลขที่กิจกรรม"
                            {...register("activityNo")}
                          />
                        </div>
                      </div>
                    </div>
                  </>
                )}
                {selectedCostTypeOption?.value === "4" && (
                  <div className="md:col-span-3 col-span-12">
                    <div className="form-group">
                      <label className="form-label">เลขที่ใบสั่ง</label>
                      <div className={`input-group`}>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="ระบุเลขที่ใบสั่ง"
                          {...register("pmOrderNo")}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="form-action">
          <button
            type="submit"
            className="btn btn-primary"
            disabled={!isValid || isCostCenterRequired}
          >
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
