import {
  CarChoice,
  CarpoolDepartment,
  DriverChoice,
} from "@/app/types/carpool-management-type";
import CustomMultiSelect from "@/components/customMultiSelect";
import CustomSelect, { CustomSelectOption } from "@/components/customSelect";
import RadioButton from "@/components/radioButton";
import { useFormContext } from "@/contexts/carpoolFormContext";
import {
  chooseCarChoice,
  chooseDriverChoice,
  getCarpoolDepartment,
} from "@/services/carpoolManagement";
import { yupResolver } from "@hookform/resolvers/yup";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";

const schema = yup.object().shape({
  carpool_authorized_depts: yup
    .array()
    .required("กรุณาระบุหน่วยงานที่ใช้บริการ"),
  carpool_contact_number: yup.string().required("กรุณาระบุเบอร์ติดต่อ"),
  carpool_contact_place: yup.string().required("กรุณาระบุสถานที่ติดต่อ"),
  carpool_dept_sap: yup.string().required("กรุณาระบุหน่วยงาน"),
  carpool_main_business_area: yup.string().required("กรุณาระบุสาขาหลัก"),
  carpool_name: yup.string().required("กรุณาระบุชื่อกลุ่ม"),
  ref_carpool_choose_car_id: yup.number().required("กรุณาเลือกยานพาหนะ"),
  ref_carpool_choose_driver_id: yup.number().required("กรุณาเลือกพนักงานขับรถ"),
  remark: yup.string(),
  //,
  // telInternal: yup.string().min(4, "กรุณากรอกเบอร์ภายในให้ถูกต้อง"),
  // telMobile: yup
  //   .string()
  //   .matches(/^\d{10}$/, "กรุณากรอกเบอร์โทรศัพท์ให้ถูกต้อง")
  //   .required("กรุณากรอกเบอร์โทรศัพท์"),
  // workPlace: yup.string().required("กรุณาระบุสถานที่ปฎิบัติงาน"),
  // purpose: yup.string().required("กรุณาระบุวัตถุประสงค์"),
  // remark: yup.string(),
  // referenceNumber: yup.string(),
  // startDate: yup.string(),
  // endDate: yup.string(),
  // refCostTypeCode: yup.string(),
  // timeStart: yup.string(),
  // timeEnd: yup.string(),
  // attachmentFile: yup.string(),
  // deptSapShort: yup.string(),
  // deptSap: yup.string(),
  // userImageUrl: yup.string(),
  // costOrigin: yup.string().required("กรุณาระบุการเบิกค่าใช้จ่าย"),
});

const groupOptions = [
  { value: "01", label: "สำนักงานใหญ่" },
  { value: "02", label: "การไฟฟ้าเขต" },
  { value: "03", label: "หน่วยงาน" },
];

export default function ProcessOneForm() {
  const router = useRouter();

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
      carpool_dept_sap: formData.carpool_dept_sap || "",
      carpool_main_business_area: formData.carpool_main_business_area || "",
      carpool_name: formData.carpool_name || "",
      ref_carpool_choose_car_id: formData.ref_carpool_choose_car_id,
      ref_carpool_choose_driver_id: formData.ref_carpool_choose_driver_id,
      remark: formData.remark || "",
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

    const fetchDepartmentFunc = async () => {
      try {
        const response = await getCarpoolDepartment();
        const result = response.data;
        setDepartments(result);
      } catch (error) {
        console.error("Error fetching status data:", error);
      }
    };

    fetchCarFunc();
    fetchDriverFunc();
    fetchDepartmentFunc();
  }, []);

  const departmentGroup = departments.filter((item) =>
    item.dept_sap.includes(group?.value || "")
  );

  return (
    <>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          router.push("/carpool-management/create/process-two");
        }}
      >
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
                <div className="md:col-span-2">
                  <div className="form-group">
                    <label className="form-label">ชื่อกลุ่ม</label>
                    {/* <div
                      className={`input-group ${
                        errors.workPlace && "is-invalid"
                      }`}
                    > */}
                    <input
                      type="text"
                      className="form-control"
                      {...register("carpool_name")}
                      placeholder="ระบุสชื่อกลุ่ม"
                    />
                    {/* </div> */}
                    {/* {errors.workPlace && (
                      <FormHelper text={String(errors.workPlace.message)} />
                    )} */}
                  </div>
                </div>

                <div>
                  <div className="form-group">
                    <label className="form-label">สถานที่ติดต่อ</label>
                    {/* <div
                      className={`input-group ${
                        errors.workPlace && "is-invalid"
                      }`}
                    > */}
                    <input
                      type="text"
                      className="form-control"
                      {...register("carpool_contact_place")}
                      placeholder="ระบุสถานที่ติดต่อ"
                    />
                    {/* </div> */}
                    {/* {errors.workPlace && (
                      <FormHelper text={String(errors.workPlace.message)} />
                    )} */}
                  </div>
                </div>

                <div>
                  <div className="form-group">
                    <label className="form-label">เบอร์ติดต่อ</label>
                    {/* <div
                      className={`input-group ${
                        errors.telMobile && "is-invalid"
                      }`}
                    > */}
                    <input
                      type="text"
                      className="form-control"
                      {...register("carpool_contact_number")}
                      placeholder="ระบุเบอร์ติดต่อ"
                    />
                    {/* </div> */}
                    {/* {errors.telMobile && (
                      <FormHelper text={String(errors.telMobile.message)} />
                    )} */}
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
                        onChange={(e) =>
                          setDepartmentSelected(e as CustomSelectOption[])
                        }
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
                    {/* <div
                      className={`input-group ${
                        errors.workPlace && "is-invalid"
                      }`}
                    > */}
                    <input
                      type="text"
                      className="form-control"
                      {...register("remark")}
                      placeholder="ระบุรายละเอียดกลุ่ม"
                    />
                    {/* </div> */}
                    {/* {errors.workPlace && (
                      <FormHelper text={String(errors.workPlace.message)} />
                    )} */}
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
                        setSelectedValue={function (value: string): void {
                          throw new Error("Function not implemented.");
                        }} //   selectedValue={selectedTripType}
                        //   setSelectedValue={setSelectedTripType}
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
                        setSelectedValue={function (value: string): void {
                          throw new Error("Function not implemented.");
                        }} //   selectedValue={selectedTripType}
                        //   setSelectedValue={setSelectedTripType}
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
