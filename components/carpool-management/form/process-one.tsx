import {
  CarChoice,
  Carpool,
  CarpoolDepartment,
  DriverChoice,
} from "@/app/types/carpool-management-type";
import CustomMultiSelect from "@/components/customMultiSelect";
import CustomSelect, { CustomSelectOption } from "@/components/customSelect";
import FormHelper from "@/components/formHelper";
import RadioButton from "@/components/radioButton";
import { useFormContext } from "@/contexts/carpoolFormContext";
import {
  chooseCarChoice,
  chooseDriverChoice,
  getCarpoolDepartment,
  getCarpoolDepartmentByType,
  postCarpoolCreate,
} from "@/services/carpoolManagement";
import { yupResolver } from "@hookform/resolvers/yup";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";

const schema = yup.object().shape({
  carpool_authorized_depts: yup
    .array()
    .required("กรุณาระบุหน่วยงานที่ใช้บริการ"),
  carpool_contact_number: yup
    .string()
    .required("กรุณาระบุเบอร์ติดต่อ")
    .matches(/^\d{10}$/, "กรุณากรอกเบอร์โทรศัพท์ให้ถูกต้อง")
    .required("กรุณากรอกเบอร์ติดต่อ"),
  carpool_contact_place: yup.string().required("กรุณาระบุสถานที่ติดต่อ"),
  carpool_name: yup.string().required("กรุณาระบุชื่อกลุ่ม"),
  ref_carpool_choose_car_id: yup.number().required("กรุณาเลือกยานพาหนะ"),
  ref_carpool_choose_driver_id: yup.number().required("กรุณาเลือกพนักงานขับรถ"),
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
  const router = useRouter();

  const [carSelected, setCarSelected] = useState<string>("");
  const [driverSelected, setDriverSelected] = useState<string>("");

  const [carRadio, setCarRadio] = useState<CarChoice[]>([]);
  const [driverRadio, setDriverRadio] = useState<DriverChoice[]>([]);
  const [departments, setDepartments] = useState<CarpoolDepartment[]>([]);
  const [group, setGroup] = useState<CustomSelectOption>();
  const [departmentSelected, setDepartmentSelected] = useState<
    CustomSelectOption[]
  >([]);

  const { formData, updateFormData } = useFormContext();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isValid },
  } = useForm({
    mode: "onChange",
    resolver: yupResolver(schema),
    defaultValues: {
      carpool_authorized_depts: formData.carpool_authorized_depts || [],
      carpool_contact_number: formData.carpool_contact_number || "",
      carpool_contact_place: formData.carpool_contact_place || "",
      carpool_name: formData.carpool_name || "",
      ref_carpool_choose_car_id: formData.ref_carpool_choose_car_id,
      ref_carpool_choose_driver_id: formData.ref_carpool_choose_driver_id,
      remark: formData.remark || "",
      is_must_pass_status_30: formData.is_must_pass_status_30 === "1",
      is_must_pass_status_40: formData.is_must_pass_status_40 === "1",
      is_must_pass_status_50: formData.is_must_pass_status_50 === "1",
      mas_carpool_uid: formData.mas_carpool_uid || "",
    },
  });

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
      const fetchDepartmentFunc = async () => {
        try {
          const response = await getCarpoolDepartmentByType(group?.value);
          const result = response.data;
          setDepartments(result);
        } catch (error) {
          console.error("Error fetching status data:", error);
        }
      };

      fetchDepartmentFunc();
    }
  }, [group]);

  useEffect(() => {
    if (carpool) {
      const { carpool_name, carpool_contact_place, carpool_contact_number } =
        carpool;
      setValue("carpool_name", carpool_name);
      setValue("carpool_contact_place", carpool_contact_place);
      setValue("carpool_contact_number", carpool_contact_number);
      setValue("ref_carpool_choose_car_id", carpool.ref_carpool_choose_car_id);
      setCarSelected(carpool.ref_carpool_choose_car_id.toString());
      setValue(
        "ref_carpool_choose_driver_id",
        carpool.ref_carpool_choose_driver_id
      );
      setDriverSelected(carpool.ref_carpool_choose_driver_id.toString());
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
  }, [carpool]);

  const onSubmit = async (data: any) => {
    const carpool_authorized_depts = data.carpool_authorized_depts.map(
      (e: { value: string }) => ({ dept_sap: e.value })
    );
    if (id) {
      console.log("edit");
    } else {
      try {
        const response = await postCarpoolCreate({
          ...data,
          carpool_authorized_depts,
          ref_carpool_choose_car_id: Number(data.ref_carpool_choose_car_id),
          ref_carpool_choose_driver_id: Number(
            data.ref_carpool_choose_driver_id
          ),
          is_must_pass_status_30: data.is_must_pass_status_30 ? "1" : "0",
          is_must_pass_status_40: data.is_must_pass_status_40 ? "1" : "0",
          is_must_pass_status_50: data.is_must_pass_status_50 ? "1" : "0",
        });
        console.log(response.data);
        if (response.request.status === 201) {
          updateFormData({
            ...data,
            mas_carpool_uid: await response.data.mas_carpool_uid,
          });
          router.push("/carpool-management/form/process-two");
        }
      } catch (error) {
        console.log(error);
      }
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
                  <label className="form-label">
                    หน่วยงานที่ใช้บริการกลุ่มยานพาหนะนี้ได้
                  </label>
                  <CustomSelect
                    w="w-full"
                    options={groupOptions}
                    value={group}
                    {...register("carpool_authorized_depts")}
                    onChange={(e) => setGroup(e)}
                  />
                </div>

                <div className="md:col-span-3">
                  {group && (
                    <div className="form-group">
                      <label className="form-label">
                        {
                          groupOptions.find(
                            (item) => item.value === group.value
                          )?.label
                        }
                      </label>
                      <CustomMultiSelect
                        w="w-full"
                        options={departments.map((item) => ({
                          value: item.dept_sap,
                          label: item.dept_short,
                          subLabel: item.dept_full,
                        }))}
                        value={departmentSelected}
                        {...register("carpool_authorized_depts")}
                        onChange={(e) => {
                          setDepartmentSelected(e as CustomSelectOption[]);
                          setValue("carpool_authorized_depts", e);
                        }}
                      />
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
                <div className="form-group">
                  <div className="custom-group">
                    {carRadio.map((item) => (
                      <RadioButton
                        key={item.ref_carpool_choose_car_id}
                        name="tripType"
                        label={item.type_of_choose_car}
                        value={item.ref_carpool_choose_car_id.toString()}
                        selectedValue={carSelected}
                        setSelectedValue={(e) => {
                          setCarSelected(e);
                          setValue("ref_carpool_choose_car_id", Number(e));
                        }}
                      />
                    ))}
                  </div>
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
                <div className="form-group">
                  <div className="custom-group">
                    {driverRadio.map((item) => (
                      <RadioButton
                        key={item.ref_carpool_choose_driver_id}
                        name="tripType"
                        label={item.type_of_choose_driver}
                        value={item.ref_carpool_choose_driver_id.toString()}
                        selectedValue={driverSelected}
                        setSelectedValue={(e) => {
                          setDriverSelected(e);
                          setValue("ref_carpool_choose_driver_id", Number(e));
                        }}
                      />
                    ))}
                  </div>
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
            <button
              type="submit"
              className="btn btn-primary"
              disabled={!isValid}
            >
              บันทึกการตั้งค่า
            </button>
          ) : (
            <button
              type="submit"
              className="btn btn-primary"
              disabled={!isValid}
            >
              ต่อไป
              <i className="material-symbols-outlined icon-settings-300-24">
                arrow_right_alt
              </i>
            </button>
          )}
        </div>
      </form>
    </>
  );
}
