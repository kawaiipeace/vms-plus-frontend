"use client";
import DriverCard from "@/components/card/driverCard";
import { CustomSelectOption } from "@/components/customSelect";
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
import { fetchSearchDrivers, fetchUserDrivers } from "@/services/masterService";
import { yupResolver } from "@hookform/resolvers/yup";
import dayjs from "dayjs";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import PaginationControls from "@/components/table/pagination-control";
import { toISODateTime } from "@/utils/toIsoFormat";

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
  posi_text: string;
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

  // 1. Add pagination state
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });

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

  const [params, setParams] = useState({
    name: "",
    page: 1,
    limit: 10,
  });

  const [selectedVehicleUserOption, setSelectedVehicleUserOption] = useState<{
    value: string;
    label: string;
  } | null>(null);

  const [licenseValid, setLicenseValid] = useState(false);
  const [annualValid, setAnnualValid] = useState(false);
  const [appointValid, setAppointValid] = useState(false);
  const [allDriver, setAllDriver] = useState(0);
  const [loading, setLoading] = useState(true);

  const searchInputRef = useRef<HTMLInputElement>(null);

  const handleAppointmentSubmit = () => {
    setAppointValid(true);
  };

  useEffect(() => {
      console.log('form',formData.timeStart);
  },[]);

  useEffect(() => {
    if (formData.masCarpoolDriverUid) {
      setSelectedVehiclePoolId(formData.masCarpoolDriverUid);
    }
    const processOneStatus = localStorage.getItem("processTwo");
    if (processOneStatus !== "Done") {
      router.push("process-two");
    }
    setLoading(false);
    if (formData.isPeaEmployeeDriver) {
      if (formData.isPeaEmployeeDriver === "1") {
        setSelectedDriverType("พนักงาน กฟภ.");
      } else {
        setSelectedDriverType("พนักงานขับรถ");
      }
    }
  }, [formData, router]);

  useEffect(() => {
    if (formData.isAdminChooseDriver) {
      driverAppointmentRef.current?.openModal();
    }
  }, [formData.isAdminChooseDriver]);

  useEffect(() => {
    if (appointValid) {
      // Handle appointment validation logic
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
    // Clear any previous selections when switching types
    if (typeName === "พนักงานขับรถ") {
      setSelectedVehiclePoolId("");
      setValue("masCarpoolDriverUid", "");
      updateFormData({
        masCarpoolDriverUid: "",
      });
    }
  
    setSelectedDriverType(typeName);
    const isPeaEmployee = typeName === "พนักงาน กฟภ." ? "1" : "0";
    
    setValue("isPeaEmployeeDriver", isPeaEmployee);
    updateFormData({
      isPeaEmployeeDriver: isPeaEmployee,
    });
  
    if (typeName === "พนักงานขับรถ" && formData.isAdminChooseDriver) {
      driverAppointmentRef.current?.openModal();
    }
  };

  useEffect(() => {
    console.log("Driver type changed to:", selectedDriverType);
  }, [selectedDriverType]);

  // In the data fetching useEffect, always set filteredDrivers to the API result for the current page
  useEffect(() => {
    const fetchDrivers = async () => {
      try {
        setLoadingDrivers(true);
        const queryParams: Record<string, any> = {
          ...params,
          emp_id: profile?.emp_id,
          start_date:  toISODateTime(formData.startDate || "",formData.timeStart || ""),
          end_date: toISODateTime(formData.endDate || "",formData.timeEnd || ""),
        };
        
  
        if (formData.masCarpoolUid) {
          queryParams.mas_carpool_uid = formData.masCarpoolUid;
        }
  
        if (formData.masVehicleUid) {
          queryParams.mas_vehicle_uid = formData.masVehicleUid;
        }
  
        const response = await fetchSearchDrivers(queryParams);
        if (response.status === 200) {
          // Always set filteredDrivers to the API result for the current page
          setFilteredDrivers(response.data.drivers);
          setAllDriver(response.data.pagination.total);
          setPagination({
            page: response.data.pagination.page,
            limit: response.data.pagination.limit,
            total: response.data.pagination.total,
            totalPages: response.data.pagination.totalPages,
          });
        }
      } catch (error) {
        console.error("Error fetching drivers:", error);
        setFilteredDrivers([]);
      } finally {
        setLoadingDrivers(false);
      }
    };
    fetchDrivers();
  }, [params, profile, formData]);

  // 3. Pagination handler
  const handlePageChange = (newPage: number) => {
    setParams(prev => ({
      ...prev,
      page: newPage,
    }));
  };

  // 4. Render PaginationControls below driver cards
  // 5. Use the same empty state logic, but grid and pagination are now correct
  const handleVehicleUserChange = async (
    selectedOption: CustomSelectOption
  ) => {
    console.log('test');
    setValue("driverInternalContact", "");
    setValue("driverMobileContact", "");
    setValue("driverEmpID", "");
    setValue("driverEmpName", "");
    setValue("driverDeptSap", "");
    setDriverLicenseNo("");
    setAnnualYear(0);
    setRequestAnnual("");
    setLicenseExpDate("");
    setLicenseValid(false);
    setAnnualValid(false);

    if (selectedOption.value === "") {
      setSelectedVehicleUserOption(null);
    } else {
      setSelectedVehicleUserOption(
        selectedOption as { value: string; label: string }
      );
    }

    const empData = vehicleUserDatas.find(
      (user: { emp_id: string }) => user.emp_id === selectedOption.value
    );

    if (empData) {
      setValue("driverInternalContact", empData.tel_internal);
      setValue("driverMobileContact", empData.tel_mobile);
      setValue("driverEmpID", empData.emp_id);
      setValue("driverEmpName", empData.full_name);
      setValue(
        "driverDeptSap",
        empData.posi_text + " " + empData.dept_sap_short
      );
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
        driverEmpPosition: empData.posi_text,
        driverDeptSap: empData.posi_text + " " + empData.dept_sap_short,
        isPeaEmployeeDriver: "1",
      });
    }
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

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(e.target.value);
  };

  const useDebounce = (value: string, delay: number, minLength: number = 0) => {
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
      const handler = setTimeout(() => {
        if (value.length >= minLength || value.length === 0) {
          setDebouncedValue(value);
        }
      }, delay);

      return () => {
        clearTimeout(handler);
      };
    }, [value, delay, minLength]);

    return debouncedValue;
  };

  const [searchInput, setSearchInput] = useState("");
  const debouncedSearchInput = useDebounce(searchInput, 200, 3);

  useEffect(() => {
    setParams((prev) => ({
      ...prev,
      name: debouncedSearchInput,
      page: 1,
    }));
  }, [debouncedSearchInput]);

  useEffect(() => {
    // if (!formData.isPeaEmployeeDriver) {
    //   setSelectedDriverType("พนักงาน กฟภ.");
    // }

    const fetchDefaultData = async () => {
      try {
        const response = await fetchUserDrivers(
          formData?.driverEmpID ? formData?.driverEmpID : profile?.emp_id
        );
        
        if (response) {
          const vehicleUserData = response.data;
          setVehicleUserDatas(vehicleUserData);
    
          const driverOptionsArray = vehicleUserData.map(
            (user: { emp_id: string; full_name: string; dept_sap: string }) => ({
              value: user.emp_id,
              label: `${user.full_name} (${user.emp_id})`,
            })
          );
          setDriverOptions(driverOptionsArray);
    
          const selectedDriverOption = {
            value: vehicleUserData[0]?.emp_id,
            label: `${vehicleUserData[0]?.full_name} (${vehicleUserData[0]?.emp_id})`,
          };
    
          if (vehicleUserData[0]) {
            const driver = vehicleUserData[0];
            const isSameDriver = formData.vehicleUserEmpId === driver.emp_id;
            
            // Prepare all form values
            const formValues = {
              isPeaEmployeeDriver: "1",
              driverEmpID: driver.emp_id,
              driverEmpName: driver.full_name,
              driverDeptSap: `${driver.posi_text} ${driver.dept_sap_short}`,
              driverMobileContact: isSameDriver ? formData.telMobile : driver.tel_mobile,
              driverInternalContact: isSameDriver ? formData.telInternal : driver.tel_internal,
            };
    
            // Set all form values at once
            Object.entries(formValues).forEach(([key, value]) => {
              setValue(key as keyof typeof formValues, value);
            });
            
    
            // Update other state
            setDriverLicenseNo(driver?.annual_driver?.driver_license_no);
            setAnnualYear(driver?.annual_driver?.annual_yyyy);
            setRequestAnnual(driver?.annual_driver?.request_annual_driver_no);
            setLicenseExpDate(driver?.annual_driver?.driver_license_expire_date);
    
            // Update form data
            updateFormData({
              ...formValues,
              driverEmpPosition: driver.posi_text,
              isPeaEmployeeDriver: "1",
            });
          }
    
          setSelectedVehicleUserOption(selectedDriverOption);
        }
      } catch (error) {
        console.error("Error resetting options:", error);
      }
    };
    fetchDefaultData();
  }, [profile, setValue]);

  const setCarpoolId = (mas_driver_uid: string) => {
    setMasDriverUid(mas_driver_uid);
    setValue("masCarpoolDriverUid", mas_driver_uid);
    updateFormData({
      masCarpoolDriverUid: mas_driver_uid,
    });
    driverAppointmentRef.current?.openModal();
  };

  const next = () => {
    localStorage.setItem("processThree", "Done");
    router.push("process-four");
  };

  const handleDriverSearch = useCallback(async (search: string) => {
    const trimmed = search.trim();

    if (trimmed.length < 3) {
      setDriverOptions([]);
      setVehicleUserDatas([]);
      setLoadingDrivers(false);
      return;
    }

    setLoadingDrivers(true);
    try {
      const response = await fetchUserDrivers(trimmed);
      if (response && Array.isArray(response.data)) {
        const vehicleUserData = response.data;
        setVehicleUserDatas(vehicleUserData);
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
  }, []);

  const onPageChange = (newPage: number) => {
    setParams(prev => ({
      ...prev,
      page: newPage,
      ...(searchInput.length >= 3 ? { search: searchInput } : { search: "" }),
    }));
  };

  const handlePageSizeChange = (newLimit: number) => {
    setParams(prev => ({
      ...prev,
      limit: newLimit,
      page: 1,
    }));
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
                    <Link href="/">
                      <i className="material-symbols-outlined">home</i>
                    </Link>
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
                        setSelectedValue={() =>
                          handleSelectTypes("พนักงาน กฟภ.")
                        }
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
                            desc="ผู้ขับขี่จะต้องขออนุมัติทำหน้าที่ขับรถยนต์ประจำปีก่อน"
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
                                {filteredDrivers.length > 0 ? (
                                  <>ว่าง {filteredDrivers.length} คน</>
                                ) : (
                                  "ไม่พบข้อมูล"
                                )}
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
                          {/* <input
                            ref={searchInputRef}
                            key="driver-search-input"
                            type="text"
                            id="myInputTextField"
                            value={searchTerm}
                            onChange={handleSearch}
                            className="form-control dt-search-input"
                            placeholder="ค้นหาชื่อพนักงานขับรถ.."
                            disabled={loadingDrivers}
                            autoFocus
                          /> */}

                          <input
                            ref={searchInputRef}
                            type="text"
                            className="form-control dt-search-input"
                            value={searchInput}
                            onChange={handleSearchChange}
                            onKeyPress={(e) => {
                              if (
                                e.key === "Enter" &&
                                searchInput.length >= 3
                              ) {
                                setParams((prev) => ({
                                  ...prev,
                                  search: searchInput,
                                  page: 1,
                                }));
                              }
                            }}
                            placeholder="ค้นหาชื่อพนักงานขับรถ.."
                          />
                        </div>
                        {allDriver <= 0 ? (
                          <EmptyDriver
                            imgSrc="/assets/img/empty/empty_driver.svg"
                            title="ไม่พบพนักงานขับรถ"
                            desc={
                              <>
                                ระบบไม่พบพนักงานขับรถในสังกัด <br />
                                กลุ่มยานพาหนะนี้ที่คุณสามารถเลือกได้ <br />
                                ลองค้นหาใหม่หรือเลือกจากนอกกลุ่มนี้
                              </>
                            }
                            button="ค้นหานอกสังกัด"
                            onSelectDriver={setCarpoolId}
                          />
                        ) : searchInput.length >= 3 && filteredDrivers.length === 0 ? (
                          <EmptyDriver
                            imgSrc="/assets/img/empty/empty_driver.svg"
                            title="ไม่พบพนักงานขับรถ"
                            desc={<>เปลี่ยนคำค้นหรือเงื่อนไขแล้วลองใหม่อีกครั้ง</>}
                          />
                        ) : filteredDrivers.length === 0 ? (
                          <div className="text-center text-gray-500 py-8">ไม่พบข้อมูล</div>
                        ) : (
                          <>
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
                                      "ยังไม่มีการให้คะแนน"
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
                            {/* 4. PaginationControls */}
                            <PaginationControls
                              pagination={pagination}
                              onPageChange={handlePageChange}
                              onPageSizeChange={handlePageSizeChange}
                            />
                          </>
                        )}
                      </>
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
