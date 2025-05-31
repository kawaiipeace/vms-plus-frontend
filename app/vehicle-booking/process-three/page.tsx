"use client";
import DriverCard from "@/components/card/driverCard";
import CustomSelect, { CustomSelectOption } from "@/components/customSelect";
import CustomSelectOnSearch from "@/components/customSelectOnSearch";
import EmptyDriver from "@/components/emptyDriver";
import Header from "@/components/header";
import LicensePlateStat from "@/components/licensePlateStat";
import DriverAppointmentModal from "@/components/modal/driverAppointmentModal";
import ProcessRequestCar from "@/components/processRequestCar";
import RadioButton from "@/components/radioButton";
import SideBar from "@/components/sideBar";
import Tooltip from "@/components/tooltips";
import { useProfile } from "@/contexts/profileContext";
import { useFormContext } from "@/contexts/requestFormContext";
import { useSidebar } from "@/contexts/sidebarContext";
import { fetchDrivers, fetchUserDrivers } from "@/services/masterService";
import { yupResolver } from "@hookform/resolvers/yup";
import dayjs from "dayjs";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";

interface VehicleUser {
  emp_id: string;
  full_name: string;
  dept_sap: string;
  tel_internal?: string;
  tel_mobile: string;
  dept_sap_short: string;
  annual_driver: {
    request_annual_driver_no: string;
    annual_yyyy: number;
    driver_license_no: string;
    driver_license_expire_date: string;
  };
}

const schema = yup.object().shape({
  driverInternalContact: yup.string(),
  driverMobileContact: yup.string(),
  driverEmpID: yup.string().required(),
  driverEmpName: yup.string(),
  driverDeptSap: yup.string(),
  masCarpoolDriverUid: yup.string(),
  isPeaEmployeeDriver: yup.string(),
});

export default function ProcessThree() {
  const router = useRouter();
  const [drivers, setDrivers] = useState([]);
  const [filteredDrivers, setFilteredDrivers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [vehicleUserDatas, setVehicleUserDatas] = useState<VehicleUser[]>([]);
  const { isPinned } = useSidebar();
  const [driverLicenseNo, setDriverLicenseNo] = useState("");
  const today = new Date();
  const [annualYear, setAnnualYear] = useState<number>(2025);
  const [masDriverUid, setMasDriverUid] = useState<string>("");
  const [requestAnnual, setRequestAnnual] = useState("");
  const [licenseExpDate, setLicenseExpDate] = useState("");
  const [selectedDriverType, setSelectedDriverType] = useState("พนักงาน กฟภ.");
  const [loadingDrivers, setLoadingDrivers] = useState(false);
  const [selectedDriverId, setSelectedDriverId] = useState<string | null>(null);
  const { formData, updateFormData } = useFormContext();
  const [driverOptions, setDriverOptions] = useState<
    { value: string; label: string }[]
  >([]);
  const [selectedVehiclePoolId, setSelectedVehiclePoolId] =
    useState<string>("");
  const { profile } = useProfile();

  const driverAppointmentRef = useRef<{
    openModal: () => void;
    closeModal: () => void;
  } | null>(null);

  const handleVehicleSelection = (vehiclePoolId: string) => {
    setSelectedVehiclePoolId(vehiclePoolId);
    setValue("masCarpoolDriverUid", vehiclePoolId);
    updateFormData({
      masCarpoolDriverUid: vehiclePoolId,
    });
  };
  const [params] = useState({
    name: "",
    page: 1,
    limit: 10,
  });
  const [selectedVehicleUserOption, setSelectedVehicleUserOption] = useState(
    driverOptions[0]
  );

  const [licenseValid, setLicenseValid] = useState(false);
  const [annualValid, setAnnualValid] = useState(false);
  const [appointValid, setAppointValid] = useState(false);
  const [loading, setLoading] = useState(true);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    const filtered = drivers.filter((driver: any) =>
      driver.driver_name.includes(value)
    );
    setFilteredDrivers(filtered);
  };

  const handleAppointmentSubmit = () => {
    setAppointValid(true);
  };

  useEffect(() => {
    const processOneStatus = localStorage.getItem("processTwo");
    if (processOneStatus !== "Done") {
      router.push("process-two");
    }
    setLoading(false);
    if (!formData.isPeaEmployeeDriver) {
      if (formData.isPeaEmployeeDriver === "1") {
        setSelectedDriverType("พนักงาน กฟภ.");
      } else {
        setSelectedDriverType("พนักงานขับรถ");
      }
    }
  }, []);

  useEffect(() => {
    if (formData.isAdminChooseDriver) {
      driverAppointmentRef.current?.openModal();
    }
  }, [formData.isAdminChooseDriver]);

  useEffect(() => {
    if (appointValid) {
    }
  }, [appointValid]);

  useEffect(() => {
    if (driverLicenseNo) {
      const isLicenseValid = new Date(licenseExpDate) > today;
      setLicenseValid(isLicenseValid);

      if (requestAnnual) {
        const isAnnualValid = annualYear >= today.getFullYear();
        setAnnualValid(isAnnualValid);
      } else {
        setAnnualValid(true); // if no requestAnnual, treat as valid
      }
    }
  }, [driverLicenseNo, licenseExpDate, requestAnnual, annualYear, today]);

  const allValid = licenseValid && annualValid;

  const handleSelectTypes = (typeName: string) => {
    setSelectedDriverType(typeName);
    setValue("isPeaEmployeeDriver", "0");
    updateFormData({
      isPeaEmployeeDriver: "0",
    });
    if (formData.isAdminChooseDriver) {
      driverAppointmentRef.current?.openModal();
    }
  };

  useEffect(() => {
    const fetchDriverData = async () => {
      try {
        const response = await fetchDrivers(params);
        if (response.status === 200) {
          setDrivers(response.data.drivers);
          setFilteredDrivers(response.data.drivers);
        }
      } catch (error) {
        console.error("Error fetching requests:", error);
      }
    };

    fetchDriverData();
  }, []);

  const handleVehicleUserChange = async (
    selectedOption: CustomSelectOption
  ) => {
    setSelectedVehicleUserOption(
      selectedOption as { value: string; label: string }
    );

    setValue("driverInternalContact", "");
    setValue("driverMobileContact", "");
    setValue("driverEmpID", "");
    setValue("driverEmpName", "");
    setValue("driverDeptSap", "");

    const empData = vehicleUserDatas.find(
      (user: { emp_id: string }) => user.emp_id === selectedOption.value
    );

    if (empData) {
      setValue("driverInternalContact", empData.tel_internal);
      setValue("driverMobileContact", empData.tel_mobile);
      setValue("driverEmpID", empData.emp_id);
      setValue("driverEmpName", empData.full_name);
      setValue("driverDeptSap", empData.dept_sap_short);
      setValue("isPeaEmployeeDriver", "1");
      setDriverLicenseNo(empData.annual_driver.driver_license_no);
      setAnnualYear(empData.annual_driver.annual_yyyy);
      setRequestAnnual(empData.annual_driver.request_annual_driver_no);
      setLicenseExpDate(empData.annual_driver.driver_license_expire_date);

      updateFormData({
        driverInternalContact: empData.tel_internal,
        driverMobileContact: empData.tel_mobile,
        driverEmpID: empData.emp_id,
        driverEmpName: empData.full_name,
        driverDeptSap: empData.dept_sap_short,
        isPeaEmployeeDriver: "1",
      });
    }
  };

  useEffect(() => {

 
      if(!formData.isPeaEmployeeDriver){
        setSelectedDriverType("พนักงาน กฟภ.");
      }
    
      const fetchDefaultData = async () => {
        try {
          const response = await fetchUserDrivers(formData?.driverEmpID ? formData?.driverEmpID : profile?.emp_id);
          if (response) {
            const vehicleUserData = response.data;
     
            console.log('vehicledata',vehicleUserData);
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
              setValue("isPeaEmployeeDriver", "1");
              setDriverLicenseNo(vehicleUserData[0]?.annual_driver?.driver_license_no);
              setAnnualYear(vehicleUserData[0]?.annual_driver?.annual_yyyy);
              setRequestAnnual(vehicleUserData[0]?.annual_driver?.request_annual_driver_no);
              setLicenseExpDate(vehicleUserData[0]?.annual_driver?.driver_license_expire_date);
              setValue("driverInternalContact", vehicleUserData[0]?.tel_internal);
              setValue("driverMobileContact", vehicleUserData[0]?.tel_mobile);
              setValue("driverEmpID", vehicleUserData[0]?.emp_id);
              setValue("driverEmpName", vehicleUserData[0]?.full_name);
              setValue("driverDeptSap", vehicleUserData[0]?.dept_sap_short);
              console.log('test',vehicleUserData[0]?.emp_id);
            }
         
          setSelectedVehicleUserOption(selectedDriverOption);
          }
        } catch (error) {
          console.error("Error resetting options:", error);
        }
      };
      fetchDefaultData();
    

 
    // setSelectedVehicleUserOption(selectedDriverOption);
  }, [vehicleUserDatas, formData, profile]);

  const setCarpoolId = (mas_driver_uid: string) => {
    setMasDriverUid(mas_driver_uid);
    setValue("masCarpoolDriverUid", mas_driver_uid);
    updateFormData({
      masCarpoolDriverUid: mas_driver_uid,
    });
  };
  const next = () => {
    localStorage.setItem("processThree", "Done");
    router.push("process-four");
  };

  const { register, setValue } = useForm({
    mode: "onChange",
    resolver: yupResolver(schema),
    defaultValues: {
      driverDeptSap: formData.driverDeptSap || "",
      driverInternalContact: formData.driverInternalContact || "",
      driverMobileContact: formData.driverMobileContact || "",
    },
  });

  const handleDriverSearch = async (search: string) => {
    console.log('test',search);
    // Debounce handled by parent component or elsewhere
    if (search.trim().length < 3) {
      setLoadingDrivers(true);
      try {
        const response = await fetchUserDrivers(search);
        if (response) {
          const vehicleUserData = response.data;
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
        } else {
          setDriverOptions([]);
        }
      } catch (error) {
        setDriverOptions([]);
        console.error("Error resetting options:", error);
      } finally {
        setLoadingDrivers(false);
      }
      return;
    }
  };

  return (
    <div>
      <div className={`main-container`}>
        <SideBar menuName="คำขอใช้ยานพาหนะ" />

        <div
          className={`main-content ${
            isPinned ? "md:pl-[280px]" : "md:pl-[80px]"
          }`}
        >
          <Header />
          <div className="main-content-body">
            <div className="page-header">
              <div className="breadcrumbs text-sm">
                <ul>
                  <li className="breadcrumb-item">
                    <a>
                      <i className="material-symbols-outlined">home</i>
                    </a>
                  </li>
                  <li className="breadcrumb-item">
                    <Link href="request-list">คำขอใช้ยานพาหนะ</Link>
                  </li>
                  <li className="breadcrumb-item active" aria-current="page">
                    สร้างคำขอใช้ยานพาหนะ
                  </li>
                </ul>
              </div>

              <div className="page-group-header">
                <div className="page-title">
                  <span className="page-title-label">สร้างคำขอใช้ยานพาหนะ</span>
                  {/* <!-- <span className="badge badge-outline badge-gray">95 กลุ่ม</span> --> */}
                </div>
              </div>
            </div>

            <ProcessRequestCar step={3} />

            <div className="form-steps-group">
              <div className="form-steps" data-step="3">
                <div className="form-section">
                  <div className="page-section-header border-0">
                    <div className="page-header-left">
                      <div className="page-title">
                        <span className="page-title-label">
                          เลือกประเภทผู้ขับขี่
                        </span>
                      </div>
                      <div className="page-desc">
                        โปรดเลือกพนักงานขับรถที่ท่านต้องการ
                        โดยยานพาหนะบางคันอนุญาตให้พนักงาน กฟภ. สามารถขับเองได้
                      </div>
                    </div>
                  </div>
                  <div className="form-group">
                    <div className="custom-group">
                      <RadioButton
                        name="driverType"
                        label="พนักงาน กฟภ."
                        value="พนักงาน กฟภ."
                        selectedValue={selectedDriverType}
                        setSelectedValue={setSelectedDriverType}
                      />

                      <RadioButton
                        name="driverType"
                        label="พนักงานขับรถ"
                        value="พนักงานขับรถ"
                        selectedValue={selectedDriverType}
                        setSelectedValue={() =>
                          handleSelectTypes("พนักงานขับรถ")
                        }
                      />
                    </div>
                    {/* <!-- <span className="form-helper">Helper</span> --> */}
                  </div>
                </div>

                <div
                  className={`form-section ${
                    selectedDriverType == "พนักงาน กฟภ." ? "block" : "hidden"
                  } `}
                >
                  <div className="page-section-header border-0">
                    <div className="page-header-left">
                      <div className="page-title">
                        <span className="page-title-label">
                          รายละเอียดผู้ขับขี่
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-4 flex-col md:flex-row w-full flex-wrap gap-5">
                    <div className="flex-1">
                      <div className="form-group">
                        <label className="form-label">
                          ผู้ขับขี่ยานพาหนะ
                          <Tooltip
                            title="ผู้ขับขี่ยานพาหนะคือ?"
                            content="คือคนที่รับผิดชอบขับยานพาหนะในการเดินทางครั้งนี้"
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
                          onSearchInputChange={handleDriverSearch}
                          loading={loadingDrivers}
                          enableSearchOnApi={true}
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
                            className="form-control"
                            {...register("driverDeptSap")}
                            placeholder=""
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex-1">
                      <div className="form-group">
                        <label className="form-label">เบอร์ภายใน</label>
                        <div className="input-group">
                          <div className="input-group-prepend">
                            <span className="input-group-text">
                              <i className="material-symbols-outlined">call</i>
                            </span>
                          </div>
                          <input
                            type="text"
                            className="form-control"
                            {...register("driverInternalContact")}
                            placeholder="ระบุเบอร์ภายใน"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex-1">
                      <div className="form-group">
                        <label className="form-label">เบอร์โทรศัพท์</label>
                        <input
                          type="text"
                          className="form-control"
                          {...register("driverMobileContact")}
                          placeholder="ระบุเบอร์ภายใน"
                        />
                      </div>
                    </div>
                  </div>
                  {selectedVehicleUserOption && (
                    <div className="form-card w-full mt-5">
                      <div className="form-card-body space-y-2">
                        {driverLicenseNo &&
                          (new Date(licenseExpDate) > today ? (
                            <LicensePlateStat
                              status={true}
                              title="มีใบขับขี่"
                            />
                          ) : (
                            <LicensePlateStat
                              status={false}
                              title="ใบขับขี่หมดอายุ"
                            />
                          ))}

                        {driverLicenseNo === "" && (
                          <LicensePlateStat
                            status={false}
                            title={`ไม่มีใบอนุญาตทำหน้าที่ขับรถยนต์ประจำปี ${
                              dayjs().year() + 543
                            }`}
                          />
                        )}

                        {driverLicenseNo &&
                          requestAnnual &&
                          (annualYear >= today.getFullYear() ? (
                            <LicensePlateStat
                              status={true}
                              title={`มีใบอนุญาตทำหน้าที่ขับรถยนต์ประจำปี ${annualYear}`}
                            />
                          ) : (
                            <LicensePlateStat
                              status={false}
                              title={`ไม่มีใบอนุญาตทำหน้าที่ขับรถยนต์ประจำปี ${annualYear}`}
                              desc="ผู้ขับขี่จะต้องขออนุมัติทำหน้าที่ขับรถยนต์ประจำปีก่อน"
                            />
                          ))}
                      </div>
                    </div>
                  )}
                </div>

                <div
                  className={`form-section ${
                    selectedDriverType == "พนักงานขับรถ" ? "block" : "hidden"
                  } `}
                >
                  {!formData.isAdminChooseDriver && (
                    <>
                      <>
                        <div className="page-section-header border-0">
                          <div className="page-header-left">
                            <div className="page-title">
                              <span className="page-title-label">
                                เลือกพนักงานขับรถ
                              </span>
                              <span className="badge badge-outline badge-gray page-title-status">
                                ว่าง {filteredDrivers.length} คน
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="input-group input-group-search hidden mb-5 w-[20em]">
                          <div className="input-group-prepend">
                            <span className="input-group-text search-ico-info">
                              <i className="material-symbols-outlined">
                                search
                              </i>
                            </span>
                          </div>
                          <input
                            type="text"
                            id="myInputTextField"
                            value={searchTerm}
                            onChange={handleSearch}
                            className="form-control dt-search-input"
                            placeholder="ค้นหาชื่อพนักงานขับรถ.."
                          />
                        </div>

                        {filteredDrivers.length > 0 ? (
                          <div className="grid md:grid-cols-4 grid-cols-1 gap-5 w-full">
                            {filteredDrivers.map(
                              (driver: any, index: number) => (
                                <DriverCard
                                  key={index}
                                  id={driver.mas_driver_uid}
                                  imgSrc={
                                    driver.driver_image ||
                                    "/assets/img/sample-driver.png"
                                  }
                                  name={driver.driver_name || ""}
                                  nickname={driver.driver_nickname || ""}
                                  company={driver?.vendor_name || ""}
                                  rating={
                                    driver.driver_average_satisfaction_score ||
                                    0
                                  }
                                  age={driver.age || "-"}
                                  onVehicleSelect={handleVehicleSelection}
                                  isSelected={
                                    selectedVehiclePoolId ===
                                    driver.mas_driver_uid
                                  }
                                />
                              )
                            )}
                          </div>
                        ) : (
                          <EmptyDriver
                            imgSrc="/assets/img/empty/empty_driver.svg"
                            title="ไม่พบพนักงานขับรถ"
                            desc={
                              <>เปลี่ยนคำค้นหรือเงื่อนไขแล้วลองใหม่อีกครั้ง</>
                            }
                          />
                        )}
                      </>
                      {drivers.length <= 0 && (
                        <EmptyDriver
                          imgSrc="/assets/img/empty/empty_driver.svg"
                          title="ไม่พบพนักงานขับรถ"
                          desc={
                            <>
                              ระบบไม่พบพนักงานขับรถในสังกัด <br />{" "}
                              กลุ่มยานพาหนะนี้ที่คุณสามารถเลือกได้ <br />{" "}
                              ลองค้นหาใหม่หรือเลือกจากนอกกลุ่มนี้
                            </>
                          }
                          button="ค้นหานอกสังกัด"
                          onSelectDriver={setCarpoolId}
                        />
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>

            <div className="form-action">
              <button
                className="btn btn-primary"
                onClick={() => next()}
                disabled={
                  selectedDriverType === "พนักงาน กฟภ."
                    ? !selectedVehicleUserOption || !allValid
                    : selectedVehiclePoolId === "" &&
                      masDriverUid === "" &&
                      !appointValid &&
                      formData.isPeaEmployeeDriver !== "0"
                }
              >
                ต่อไป
                <i className="material-symbols-outlined icon-settings-300-24">
                  arrow_right_alt
                </i>
              </button>
            </div>
          </div>
        </div>
      </div>
      <DriverAppointmentModal
        ref={driverAppointmentRef}
        onSubmit={handleAppointmentSubmit}
      />
    </div>
  );
}
