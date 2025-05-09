import React, { useState, useEffect } from "react";
import ImageUpload from "@/components/imageUpload";
import DatePicker from "@/components/datePicker";
import RadioButton from "@/components/radioButton";
import CustomSelect from "@/components/drivers-management/customSelect";

import { listUseByOtherRadio, listDriverLicense } from "@/services/driversManagement";

const DriverForm = () => {
  interface UseByOtherRadioItem {
    ref_other_use_desc: string;
    ref_other_use_code: string;
  }
  interface DriverLicenseItem {
    ref_driver_license_type_name: string;
    ref_driver_license_type_desc: string;
    ref_driver_license_type_code: string;
  }
  interface CustomSelectOption {
    value: string;
    label: React.ReactNode | string;
    labelDetail?: React.ReactNode | string;
  }

  const [useByotherRadio, setUseByotherRadio] = useState<UseByOtherRadioItem[]>([]);
  const [driverLicenseList, setDriverLicenseList] = useState<CustomSelectOption[]>([]);
  const [overNightStay, setOverNightStay] = useState<string>("1");
  const [operationType, setOperationType] = useState<string>("1");
  const [useByOther, setUseByOther] = useState<string>("0");
  const [driverLicenseOption, setDriverLicenseOption] = useState(driverLicenseList[0]);

  useEffect(() => {
    const fetchUseByOtherRadio = async () => {
      try {
        const response = await listUseByOtherRadio();
        setUseByotherRadio(response.data);
      } catch (error) {
        console.error("Error fetching use by other radio data:", error);
      }
    };

    const fetchDriverLicense = async () => {
      try {
        const response = await listDriverLicense();
        const driverLicenseData: CustomSelectOption[] = response.data.map((item: DriverLicenseItem) => {
          return {
            value: item.ref_driver_license_type_code,
            label: item.ref_driver_license_type_name,
            labelDetail: item.ref_driver_license_type_desc,
          };
        });
        console.log(driverLicenseData);
        setDriverLicenseList(driverLicenseData);
      } catch (error) {
        console.error("Error fetching driver license data:", error);
      }
    };

    fetchUseByOtherRadio();
    fetchDriverLicense();
  }, []);

  const handleDriverLicenseTypeChange = async (selectedOption: CustomSelectOption) => {
    setDriverLicenseOption(selectedOption as { value: string; label: string });
  };

  return (
    <>
      <form className="form">
        <div className="page-section-header border-0 mt-5">
          <div className="page-header-left">
            <div className="page-title">
              <span className="page-title-label">ข้อมูลทั่วไป</span>
            </div>
          </div>
        </div>
        <div>
          <div className="grid grid-cols-12 gap-4">
            <div className="col-span-12 md:col-span-3">
              <div className="flex-1">
                <div className="form-group">
                  <label className="form-label">รูปภาพพนักงาน</label>
                  <ImageUpload onImageChange={() => {}} />
                </div>
              </div>
            </div>
            <div className="col-span-12 md:col-span-3">
              <div>
                <div className="form-group">
                  <label className="form-label">ชื่อ-นามสกุล</label>
                  <div className={`input-group`}>
                    <input type="text" className="form-control" placeholder="ระบุชื่อ-นามสกุล" />
                  </div>
                </div>
              </div>
              <div className="mt-3">
                <div className="form-group">
                  <label className="form-label">เบอร์ติดต่อ (ถ้ามี)</label>
                  <div className={`input-group`}>
                    <input type="text" className="form-control" placeholder="ระบุเบอร์ติดต่อ" />
                  </div>
                </div>
              </div>
              <div className="mt-3">
                <div className="form-group">
                  <label className="form-label">วันเกิด</label>
                  <div className={`input-group`}>
                    <div className="input-group-prepend">
                      <span className="input-group-text">
                        <i className="material-symbols-outlined">calendar_month</i>
                      </span>
                    </div>
                    <DatePicker placeholder="เลือกวันเกิด" />
                  </div>
                </div>
              </div>
            </div>
            <div className="col-span-12 md:col-span-3">
              <div>
                <div className="form-group">
                  <label className="form-label">ชื่อเล่น</label>
                  <div className={`input-group`}>
                    <input type="text" className="form-control" placeholder="ระบุชื่อเล่น" />
                  </div>
                </div>
              </div>
              <div className="mt-3">
                <div className="form-group">
                  <label className="form-label">เลขบัตรประชาชน</label>
                  <div className={`input-group`}>
                    <input type="text" className="form-control" placeholder="ระบุเลขบัตรประชาชน" />
                  </div>
                </div>
              </div>
              <div className="mt-3">
                <div className="form-group">
                  <label className="form-label">การค้่างคืน</label>
                  <div className="custom-group">
                    <RadioButton
                      name="overNightStay"
                      label="ค้างคืนได้"
                      value="1"
                      selectedValue={overNightStay}
                      setSelectedValue={setOverNightStay}
                    />
                    <RadioButton
                      name="overNightStay"
                      label="ค้างคืนไม่ได้"
                      value="2"
                      selectedValue={overNightStay}
                      setSelectedValue={setOverNightStay}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="page-section-header border-0 mt-5">
          <div className="page-header-left">
            <div className="page-title">
              <span className="page-title-label">ข้อมูลสัญญาจ้างและสังกัด</span>
            </div>
          </div>
        </div>
        <div>
          <div className="grid grid-cols-12 gap-4">
            <div className="col-span-12 md:col-span-3">
              <div>
                <div className="form-group">
                  <label className="form-label">เลขที่สัญญาจ้าง</label>
                  <div className={`input-group`}>
                    <input type="text" className="form-control" placeholder="เลขที่สัญญาจ้าง" />
                  </div>
                </div>
              </div>
            </div>
            <div className="col-span-12 md:col-span-3">
              <div>
                <div className="form-group">
                  <label className="form-label">หน่วยงานผู้ว่าจ้าง</label>
                  <CustomSelect w="w-full" options={[]} value={null} onChange={() => {}} />
                </div>
              </div>
            </div>
            <div className="col-span-12 md:col-span-3">
              <div>
                <div className="form-group">
                  <label className="form-label">บริษัทผู้รับจ้าง</label>
                  <CustomSelect w="w-full" options={[]} value={null} onChange={() => {}} />
                </div>
              </div>
            </div>
            <div className="col-span-12 md:col-span-3">
              <div>
                <div className="form-group">
                  <label className="form-label">หน่วยงานที่สังกัด</label>
                  <CustomSelect w="w-full" options={[]} value={null} onChange={() => {}} />
                </div>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-12 gap-4 mt-3">
            <div className="col-span-12 md:col-span-3">
              <div className="form-group">
                <label className="form-label">วันเริ่มต้นสัญญาจ้าง</label>
                <div className={`input-group`}>
                  <div className="input-group-prepend">
                    <span className="input-group-text">
                      <i className="material-symbols-outlined">calendar_month</i>
                    </span>
                  </div>
                  <DatePicker placeholder="เลือกวันที่เริ่มต้น" />
                </div>
              </div>
            </div>
            <div className="col-span-12 md:col-span-3">
              <div className="form-group">
                <label className="form-label">วันสิ้นสุดสัญญาจ้าง</label>
                <div className={`input-group`}>
                  <div className="input-group-prepend">
                    <span className="input-group-text">
                      <i className="material-symbols-outlined">calendar_month</i>
                    </span>
                  </div>
                  <DatePicker placeholder="เลือกวันที่สิ้นสุด" />
                </div>
              </div>
            </div>
            <div className="col-span-12 md:col-span-3">
              <div className="form-group">
                <label className="form-label">ประเภทการปฏิบัติงาน</label>
                <div className="custom-group">
                  <RadioButton
                    name="operationType"
                    label="ปฏิบัติงานปกติ"
                    value="1"
                    selectedValue={operationType}
                    setSelectedValue={setOperationType}
                  />
                  <RadioButton
                    name="operationType"
                    label="สำรอง"
                    value="2"
                    selectedValue={operationType}
                    setSelectedValue={setOperationType}
                  />
                </div>
              </div>
            </div>
            <div className="col-span-12 md:col-span-3">
              <div className="form-group">
                <label className="form-label">หน่วยงานอื่นสามารถขอใช้งานได้</label>
                <div className="custom-group">
                  {useByotherRadio.map((item, index) => {
                    return (
                      <RadioButton
                        key={index}
                        name="useByOther"
                        label={item.ref_other_use_desc}
                        value={`${item.ref_other_use_code}`}
                        selectedValue={useByOther}
                        setSelectedValue={setUseByOther}
                      />
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="page-section-header border-0 mt-5">
          <div className="page-header-left">
            <div className="page-title">
              <span className="page-title-label">ข้อมูลการขับขี่</span>
            </div>
          </div>
        </div>
        <div>
          <div className="grid grid-cols-12 gap-4">
            <div className="col-span-12 md:col-span-3">
              <div>
                <div className="form-group">
                  <label className="form-label">ประเภทใบขับขี่</label>
                  <CustomSelect
                    w="w-full"
                    options={driverLicenseList ?? []}
                    value={driverLicenseOption}
                    onChange={handleDriverLicenseTypeChange}
                  />
                </div>
              </div>
            </div>
            <div className="col-span-12 md:col-span-3">
              <div>
                <div className="form-group">
                  <label className="form-label">เลขที่ใบขับขี่</label>
                  <div className={`input-group`}>
                    <input type="text" className="form-control" placeholder="ระบุเลขที่ใบขับขี่" />
                  </div>
                </div>
              </div>
            </div>
            <div className="col-span-12 md:col-span-3">
              <div>
                <div className="form-group">
                  <label className="form-label">วันที่ออกใบขับขี่</label>
                  <div className={`input-group`}>
                    <div className="input-group-prepend">
                      <span className="input-group-text">
                        <i className="material-symbols-outlined">calendar_month</i>
                      </span>
                    </div>
                    <DatePicker placeholder="เลือกวันที่ออกใบขับขี่" />
                  </div>
                </div>
              </div>
            </div>
            <div className="col-span-12 md:col-span-3">
              <div>
                <div className="form-group">
                  <label className="form-label">วันที่หมดอายุใบขับขี่</label>
                  <div className={`input-group`}>
                    <div className="input-group-prepend">
                      <span className="input-group-text">
                        <i className="material-symbols-outlined">calendar_month</i>
                      </span>
                    </div>
                    <DatePicker placeholder="เลือกวันที่หมดอายุใบขับขี่" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="page-section-header border-0 mt-5">
          <div className="page-header-left">
            <div className="page-title">
              <span className="page-title-label">เอกสารเพิ่มเติม</span>
            </div>
          </div>
        </div>
        <div>
          <div className="grid grid-cols-12 gap-4">
            <div className="col-span-12 md:col-span-3">
              <div className="flex-1">
                <div className="form-group">
                  <label className="form-label">
                    รูปใบขับขี่
                    <br />
                    &nbsp;
                  </label>
                  <ImageUpload onImageChange={() => {}} />
                </div>
              </div>
            </div>
            <div className="col-span-12 md:col-span-3">
              <div className="flex-1">
                <div className="form-group">
                  <label className="form-label">รูปใบรับรองการอบรม,บัตรประชาชน, ทะเบียนบ้าน ฯลฯ</label>
                  <ImageUpload onImageChange={() => {}} />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="w-full">
          <div className="form-action">
            <button type="submit" className="btn btn-primary" disabled>
              สร้าง
            </button>
          </div>
        </div>
      </form>
    </>
  );
};

export default DriverForm;
