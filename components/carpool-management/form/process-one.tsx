"use client";
import {
  CarChoice,
  Carpool,
  CarpoolDepartment,
  DriverChoice,
} from "@/app/types/carpool-management-type";
import CustomMultiSelect from "@/components/customMultiSelect";
import CustomSelect, { CustomSelectOption } from "@/components/customSelect";
import CustomSelectOnSearch from "@/components/customSelectOnSearch";
import FormHelper from "@/components/formHelper";
import RadioButton from "@/components/radioButton";
import ToastCustom from "@/components/toastCustom";
import { useFormContext } from "@/contexts/carpoolFormContext";
import {
  chooseCarChoice,
  chooseDriverChoice,
  getCarpoolDepartmentByType,
  putCarpoolUpdate,
} from "@/services/carpoolManagement";
import { yupResolver } from "@hookform/resolvers/yup";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import * as yup from "yup";

interface ToastProps {
  title: string;
  desc: string | React.ReactNode;
  status: "success" | "error" | "warning" | "info";
}

const schema = yup.object().shape({
  carpool_type: yup.string().required("กรุณาระบุประเภทกลุ่ม"),
  carpool_authorized_depts: yup.array().when("carpool_type", {
    is: (value: string) => value === "02" || value === "03",
    then: (schema) =>
      schema
        .required("กรุณาระบุกลุ่มยานพาหนะที่ใช้บริการ")
        .min(1, "กรุณาระบุกลุ่มยานพาหนะที่ใช้บริการ"),
    otherwise: (schema) => schema.notRequired(),
  }),
  carpool_contact_number: yup
    .string()
    .required("กรุณาระบุเบอร์ติดต่อ")
    .matches(/^\d{10}$/, "กรุณากรอกเบอร์โทรศัพท์ให้ถูกต้อง")
    .required("กรุณากรอกเบอร์ติดต่อ"),
  carpool_contact_place: yup.string().required("กรุณาระบุสถานที่ติดต่อ"),
  carpool_name: yup.string().required("กรุณาระบุชื่อกลุ่ม"),
  ref_carpool_choose_car_id: yup
    .number()
    .required("กรุณาเลือกการเลือกยานพาหนะ"),
  ref_carpool_choose_driver_id: yup
    .number()
    .required("กรุณาเลือกการเลือกพนักงานขับรถ"),
  remark: yup.string(),
  is_must_pass_status_30: yup.boolean(),
  is_must_pass_status_40: yup.boolean(),
  is_must_pass_status_50: yup.boolean(),
  mas_carpool_uid: yup.string(),
});

const groupOptions = [
  { value: "01", label: "สำนักงานใหญ่" },
  { value: "02", label: "การไฟฟ้าเขต" },
  { value: "03", label: "หน่วยงาน" },
];

export default function ProcessOneForm({ carpool }: { carpool?: Carpool }) {
  const id = useSearchParams().get("id");
  const name = useSearchParams().get("name");
  const router = useRouter();

  const [carRadio, setCarRadio] = useState<CarChoice[]>([]);
  const [driverRadio, setDriverRadio] = useState<DriverChoice[]>([]);
  const [departments, setDepartments] = useState<CarpoolDepartment[]>([]);
  const [group, setGroup] = useState<CustomSelectOption>();
  const [departmentSelected, setDepartmentSelected] = useState<
    CustomSelectOption[]
  >([]);
  const [toast, setToast] = useState<ToastProps | undefined>();
  const [dLoading, setDLoading] = useState(false);

  const { formData, updateFormData } = useFormContext();

  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors, isValid },
  } = useForm({
    mode: "onChange",
    resolver: yupResolver(schema),
    defaultValues: {
      carpool_type: formData.form?.carpool_type || "",
      carpool_authorized_depts: formData.form?.carpool_authorized_depts || [],
      carpool_contact_number: formData.form?.carpool_contact_number || "",
      carpool_contact_place: formData.form?.carpool_contact_place || "",
      carpool_name: formData.form?.carpool_name || "",
      ref_carpool_choose_car_id: formData.form?.ref_carpool_choose_car_id,
      ref_carpool_choose_driver_id: formData.form?.ref_carpool_choose_driver_id,
      remark: formData.form?.remark || "",
      is_must_pass_status_30: formData.form?.is_must_pass_status_30 === "1",
      is_must_pass_status_40: formData.form?.is_must_pass_status_40 === "1",
      is_must_pass_status_50: formData.form?.is_must_pass_status_50 === "1",
    },
  });

  useEffect(() => {
    if (formData.form?.carpool_type) {
      setGroup(
        groupOptions.find((item) => item.value === formData.form?.carpool_type)
      );
    }
  }, [formData.form?.carpool_type]);

  useEffect(() => {
    const fetchCarFunc = async () => {
      try {
        const response = await chooseCarChoice();
        const result = response.data;
        setCarRadio(result);
      } catch (error) {
        console.error("Error fetching status data:", error);
      }
    };

    const fetchDriverFunc = async () => {
      try {
        const response = await chooseDriverChoice();
        const result = response.data;
        setDriverRadio(result);
      } catch (error) {
        console.error("Error fetching status data:", error);
      }
    };

    fetchCarFunc();
    fetchDriverFunc();
  }, []);

  useEffect(() => {
    if (group?.value) {
      fetchDepartmentFunc();
    }
  }, [group]);

  useEffect(() => {
    if (carpool) {
      const { carpool_authorized_depts } = carpool;
      const strArr = carpool_authorized_depts.map((item) => item.dept_sap);
      const options = departments
        .filter((item) => strArr.includes(item.dept_sap))
        .map((item) => ({
          value: item.dept_sap,
          label: item.dept_short,
          subLabel: item.dept_full,
        }));

      setValue("carpool_authorized_depts", carpool_authorized_depts);
      setDepartmentSelected(options);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [departments]);

  useEffect(() => {
    if (carpool) {
      const {
        carpool_name,
        carpool_contact_place,
        carpool_contact_number,
        carpool_type,
      } = carpool;
      setValue("carpool_name", carpool_name);
      setValue("carpool_contact_place", carpool_contact_place);
      setValue("carpool_contact_number", carpool_contact_number);
      setValue("carpool_type", carpool_type);
      setGroup(groupOptions.find((item) => item.value === carpool_type));
      setValue("ref_carpool_choose_car_id", carpool.ref_carpool_choose_car_id);
      setValue(
        "ref_carpool_choose_driver_id",
        carpool.ref_carpool_choose_driver_id
      );
      setValue("remark", carpool.remark);
      setValue(
        "is_must_pass_status_30",
        carpool.is_must_pass_status_30 === "1"
      );
      setValue(
        "is_must_pass_status_40",
        carpool.is_must_pass_status_40 === "1"
      );
      setValue(
        "is_must_pass_status_50",
        carpool.is_must_pass_status_50 === "1"
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [carpool]);

  const fetchDepartmentFunc = async (search?: string) => {
    try {
      const response = await getCarpoolDepartmentByType(
        group?.value || "",
        search || ""
      );
      const result = response.data;
      setDepartments(result);
      setDLoading(false);
    } catch (error) {
      console.error("Error fetching status data:", error);
      setDLoading(false);
    }
  };

  const onSubmit = async (data: any) => {
    const carpool_authorized_depts = data.carpool_authorized_depts?.map(
      (e: { value: string }) => ({ dept_sap: e.value })
    );

    const dataToApi = {
      ...data,
      carpool_authorized_depts:
        data.carpool_type === "01" ? [] : carpool_authorized_depts,
      ref_carpool_choose_car_id: Number(data.ref_carpool_choose_car_id),
      ref_carpool_choose_driver_id: Number(data.ref_carpool_choose_driver_id),
      is_must_pass_status_30: data.is_must_pass_status_30 ? "1" : "0",
      is_must_pass_status_40: data.is_must_pass_status_40 ? "1" : "0",
      is_must_pass_status_50: data.is_must_pass_status_50 ? "1" : "0",
    };

    if (id) {
      try {
        const response = await putCarpoolUpdate(id, dataToApi);
        if (response.request.status === 200) {
          setToast({
            title: "บันทึกการตั้งค่าสำเร็จ",
            desc: "บันทึกการตั้งค่ากลุ่มยานพาหนะ " + name + " เรียบร้อยแล้ว",
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
      updateFormData({ form: dataToApi });
      localStorage.setItem("carpoolProcessOne", "Done");
      router.push("/carpool-management/form/process-two");
    }
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
                    <span className="page-title-label">รายละเอียดกลุ่ม</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 flex-col md:flex-row w-full flex-wrap gap-5">
                <input
                  type="text"
                  className="form-control hidden"
                  {...register("mas_carpool_uid")}
                />

                <div className="md:col-span-2">
                  <div className="form-group">
                    <label className="form-label">ชื่อกลุ่ม</label>
                    <div
                      className={`input-group ${
                        errors.carpool_name && "is-invalid"
                      }`}
                    >
                      <input
                        type="text"
                        className="form-control"
                        {...register("carpool_name")}
                        placeholder="ระบุชื่อกลุ่ม"
                      />
                    </div>
                    {errors.carpool_name && (
                      <FormHelper text={String(errors.carpool_name.message)} />
                    )}
                  </div>
                </div>

                <div>
                  <div className="form-group">
                    <label className="form-label">สถานที่ติดต่อ</label>
                    <div
                      className={`input-group ${
                        errors.carpool_contact_place && "is-invalid"
                      }`}
                    >
                      <input
                        type="text"
                        className="form-control"
                        {...register("carpool_contact_place")}
                        placeholder="ระบุสถานที่ติดต่อ"
                      />
                    </div>
                    {errors.carpool_contact_place && (
                      <FormHelper
                        text={String(errors.carpool_contact_place.message)}
                      />
                    )}
                  </div>
                </div>

                <div>
                  <div className="form-group">
                    <label className="form-label">เบอร์ติดต่อ</label>
                    <div
                      className={`input-group ${
                        errors.carpool_contact_number && "is-invalid"
                      }`}
                    >
                      <input
                        type="text"
                        className="form-control"
                        {...register("carpool_contact_number")}
                        placeholder="ระบุเบอร์ติดต่อ"
                      />
                    </div>
                    {errors.carpool_contact_number && (
                      <FormHelper
                        text={String(errors.carpool_contact_number.message)}
                      />
                    )}
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">ประเภทกลุ่มยานพาหนะ</label>
                  <CustomSelect
                    w="w-full"
                    options={groupOptions}
                    value={group}
                    {...register("carpool_type")}
                    onChange={(e) => {
                      setGroup(e);
                      setValue("carpool_type", e.value);
                      setDepartmentSelected([]);
                    }}
                  />
                  <div>
                    {errors.carpool_type && (
                      <FormHelper text={String(errors.carpool_type.message)} />
                    )}
                  </div>
                </div>

                <div className="md:col-span-3">
                  {group?.value && group.value !== "01" && (
                    <div className="form-group">
                      <label className="form-label">
                        {group.value === "02" && "การไฟฟ้าเขต"}
                        {group.value === "03" &&
                          "หน่วยงานที่ใช้บริการกลุ่มยานพาหนะนี้ได้"}
                      </label>
                      {group.value === "02" && (
                        <CustomSelectOnSearch
                          w="w-full"
                          options={departments.map((item) => ({
                            value: item.dept_sap,
                            label: item.dept_short,
                            desc: item.dept_full,
                          }))}
                          value={departmentSelected[0]}
                          onChange={(e) => {
                            setDepartmentSelected([e]);
                            setValue("carpool_authorized_depts", [e]);
                          }}
                          onSearchInputChange={(value) => {
                            fetchDepartmentFunc(value);
                            setDLoading(true);
                          }}
                          loading={dLoading}
                          enableSearchOnApi={true}
                        />
                      )}
                      {group.value === "03" && (
                        <CustomMultiSelect
                          w="w-full"
                          options={departments.map((item) => ({
                            value: item.dept_sap,
                            label: item.dept_short,
                            subLabel: item.dept_full,
                          }))}
                          value={departmentSelected}
                          {...register("carpool_authorized_depts", {
                            required: group.value === "03",
                          })}
                          onChange={(e) => {
                            setDepartmentSelected(e as CustomSelectOption[]);
                            setValue("carpool_authorized_depts", e);
                          }}
                          enableSearchApi
                          setSearch={(value) => {
                            fetchDepartmentFunc(value);
                            setDLoading(true);
                          }}
                        />
                      )}
                      <div>
                        {errors.carpool_authorized_depts && (
                          <FormHelper
                            text={String(
                              errors.carpool_authorized_depts.message
                            )}
                          />
                        )}
                      </div>
                    </div>
                  )}
                </div>

                <div className="md:col-span-2">
                  <div className="form-group">
                    <label className="form-label">
                      รายละเอียดกลุ่ม{" "}
                      <span className="form-optional">(ถ้ามี)</span>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      {...register("remark")}
                      placeholder="ระบุรายละเอียดกลุ่ม"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="form-section">
              <div className="page-section-header border-0">
                <div className="page-header-left">
                  <div className="page-title">
                    <span className="page-title-label">การเลือกยานพาหนะ</span>
                  </div>
                </div>
              </div>

              <div className="col-span-12 md:col-span-3">
                <Controller
                  name="ref_carpool_choose_car_id"
                  control={control}
                  render={({ field }) => (
                    <div className="col-span-12 md:col-span-3">
                      <div className="form-group">
                        <div className="custom-group">
                          {carRadio.map((item) => (
                            <RadioButton
                              key={item.ref_carpool_choose_car_id}
                              name="tripType"
                              label={item.type_of_choose_car}
                              value={item.ref_carpool_choose_car_id.toString()}
                              selectedValue={field.value?.toString()}
                              setSelectedValue={(e) => {
                                field.onChange(Number(e));
                              }}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                />

                <div className="text-error-border">
                  {errors.ref_carpool_choose_car_id && (
                    <FormHelper
                      text={String(errors.ref_carpool_choose_car_id.message)}
                    />
                  )}
                </div>
              </div>
            </div>

            <div className="form-section">
              <div className="page-section-header border-0">
                <div className="page-header-left">
                  <div className="page-title">
                    <span className="page-title-label">
                      การเลือกพนักงานขับรถ
                    </span>
                  </div>
                </div>
              </div>

              <div className="col-span-12 md:col-span-3">
                <Controller
                  name="ref_carpool_choose_driver_id"
                  control={control}
                  render={({ field }) => (
                    <div className="form-group">
                      <div className="custom-group">
                        {driverRadio.map((item) => (
                          <RadioButton
                            key={item.ref_carpool_choose_driver_id}
                            name="tripType"
                            label={item.type_of_choose_driver}
                            value={item.ref_carpool_choose_driver_id.toString()}
                            selectedValue={field.value?.toString()}
                            setSelectedValue={(e) => {
                              field.onChange(Number(e));
                            }}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                />
                <div className="text-error-border">
                  {errors.ref_carpool_choose_driver_id && (
                    <FormHelper
                      text={String(errors.ref_carpool_choose_driver_id.message)}
                    />
                  )}
                </div>
              </div>
            </div>

            <div className="form-section">
              <div className="page-section-header border-0">
                <div className="page-header-left">
                  <div className="page-title">
                    <span className="page-title-label">
                      การอนุมัติอัตโนมัติ
                    </span>
                  </div>
                </div>
              </div>

              <div className="col-span-12 md:col-span-3">
                <div className="form-group">
                  <div className="flex flex-row gap-4">
                    <div className="custom-group">
                      <div className="custom-control custom-checkbox custom-control-inline !gap-2">
                        <input
                          type="checkbox"
                          {...register("is_must_pass_status_30")}
                          className="toggle border-[#D0D5DD] [--tglbg:#D0D5DD] text-white checked:border-[#A80689] checked:[--tglbg:#A80689] checked:text-white"
                        />
                        <label className="custom-control-label !w-fit">
                          <div className="custom-control-label-group">
                            ผู้อนุมัติต้นสังกัด
                          </div>
                        </label>
                      </div>
                    </div>

                    <div className="custom-group">
                      <div className="custom-control custom-checkbox custom-control-inline !gap-2">
                        <input
                          type="checkbox"
                          {...register("is_must_pass_status_40")}
                          className="toggle border-[#D0D5DD] [--tglbg:#D0D5DD] text-white checked:border-[#A80689] checked:[--tglbg:#A80689] checked:text-white"
                        />
                        <label className="custom-control-label !w-fit">
                          <div className="custom-control-label-group">
                            ผู้ดูแลยานพาหนะ
                          </div>
                        </label>
                      </div>
                    </div>

                    <div className="custom-group">
                      <div className="custom-control custom-checkbox custom-control-inline !gap-2">
                        <input
                          type="checkbox"
                          {...register("is_must_pass_status_50")}
                          className="toggle border-[#D0D5DD] [--tglbg:#D0D5DD] text-white checked:border-[#A80689] checked:[--tglbg:#A80689] checked:text-white"
                        />
                        <label className="custom-control-label !w-fit">
                          <div className="custom-control-label-group">
                            ผู้อนุมัติใช้ยานพาหนะ
                          </div>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="form-action">
          {id ? (
            <button type="submit" className="btn btn-primary">
              บันทึกการตั้งค่า
            </button>
          ) : (
            <button
              disabled={!isValid}
              type="submit"
              className="btn btn-primary"
            >
              ต่อไป
              <i className="material-symbols-outlined icon-settings-300-24">
                arrow_right_alt
              </i>
            </button>
          )}
        </div>
      </form>

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
}
