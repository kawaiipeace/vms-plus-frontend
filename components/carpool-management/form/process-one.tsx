import { CarChoice, DriverChoice } from "@/app/types/carpool-management-type";
import CustomSelect from "@/components/customSelect";
import RadioButton from "@/components/radioButton";
import {
  chooseCarChoice,
  chooseDriverChoice,
} from "@/services/carpoolManagement";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function ProcessOneForm() {
  const router = useRouter();

  const [carRadio, setCarRadio] = useState<CarChoice[]>([]);
  const [driverRadio, setDriverRadio] = useState<DriverChoice[]>([]);

  useEffect(() => {
    const fetchMenuFunc = async () => {
      try {
        const response = await chooseCarChoice();
        const result = response.data;
        setCarRadio(result);
      } catch (error) {
        console.error("Error fetching status data:", error);
      }
    };

    const fetchReceivedKeyDriverFunc = async () => {
      try {
        const response = await chooseDriverChoice();
        const result = response.data;
        console.log("driver: ", response);
        setDriverRadio(result);
      } catch (error) {
        console.error("Error fetching status data:", error);
      }
    };

    fetchMenuFunc();
    fetchReceivedKeyDriverFunc();
  }, []);

  return (
    <>
      <form
        onSubmit={() => router.push("/carpool-management/create/process-one")}
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
                      // {...register("workPlace")}
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
                      // {...register("workPlace")}
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
                      // {...register("telMobile")}
                      placeholder="ระบุเบอร์ติดต่อ"
                    />
                    {/* </div> */}
                    {/* {errors.telMobile && (
                      <FormHelper text={String(errors.telMobile.message)} />
                    )} */}
                  </div>
                </div>

                <div className="md:col-span-4">
                  <div className="form-group">
                    <label className="form-label">
                      หน่วยงานที่ใช้บริการกลุ่มยานพาหนะนี้ได้
                    </label>
                    <CustomSelect
                      w="w-full"
                      options={[]}
                      //   value={selectedCostTypeOption}
                      onChange={() => {}}
                    />
                  </div>
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
                      // {...register("workPlace")}
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
          <button type="submit" className="btn btn-primary">
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
