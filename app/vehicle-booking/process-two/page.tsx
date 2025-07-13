"use client";
import AutoCarCard from "@/components/card/autoCarCard";
import SelectCarCard from "@/components/card/selectCarCard";
import CustomSelect, { CustomSelectOption } from "@/components/customSelect";
import Header from "@/components/header";
import ProcessRequestCar from "@/components/processRequestCar";
import SideBar from "@/components/sideBar";
import PaginationControls from "@/components/table/pagination-control";
import ZeroRecord from "@/components/zeroRecord";
import { useProfile } from "@/contexts/profileContext";
import { useFormContext } from "@/contexts/requestFormContext";
import { useSidebar } from "@/contexts/sidebarContext";
import {
  fetchSearchVehicles,
  fetchVehicleCarTypes,
  fetchVehicleDepartmentTypes,
} from "@/services/masterService";
import { convertToISO } from "@/utils/convertToISO";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

interface Carpool {
  mas_carpool_uid: string;
  carpool_name: string;
  ref_carpool_choose_car_id: number;
  is_admin_choose_driver?: boolean;
  ref_carpool_choose_car: {
    ref_carpool_choose_car_id: number;
    type_of_choose_car: string;
  };
}

interface Vehicle {
  mas_vehicle_uid: string;
  vehicle_license_plate: string;
  vehicle_brand_name: string;
  vehicle_model_name: string;
  car_type: string;
  vehicle_owner_dept_sap: string;
  vehicle_img: string;
  vehicle_license_plate_province_full: string;
  vehicle_license_plate_province_short: string;
  seat: number;
  vehicle_owner_dept_short: string;
  is_admin_choose_driver?: boolean;
  fleet_card_no?: string;
}

type VehicleCard = Carpool | Vehicle;

interface PaginationInterface {
  limit: number;
  page: number;
  total: number;
  totalGroups: number;
  totalPages: number;
}

interface FormData {
  isAdminChooseVehicle?: string;
  isSystemChooseVehicle?: string;
  isAdminChooseDriver?: boolean;
  vehicleSelect?: string;
  carpoolName?: string;
  masCarpoolUid?: string;
  masVehicleUid?: string;
}

export default function ProcessTwo() {
  const router = useRouter();
  const [allVehicleCards, setAllVehicleCards] = useState<VehicleCard[]>([]);
  const [filteredVehicleCards, setFilteredVehicleCards] = useState<
    VehicleCard[]
  >([]);
  const [loading, setLoading] = useState(true);
  const { formData, updateFormData } = useFormContext();
  const [paginationData, setPaginationData] = useState<PaginationInterface>({
    limit: 10,
    page: 1,
    total: 0,
    totalPages: 0,
    totalGroups: 0,
  });
  const [selectedVehicle, setSelectedVehicle] = useState<string>("");
  const { isPinned } = useSidebar();
  const { profile } = useProfile();
  const [params, setParams] = useState({
    search: "",
    emp_id: "",
    start_date: "",
    end_date: "",
    vehicle_owner_dept: "",
    car_type: "",
    category_code: "",
    page: 1,
    limit: 10,
  });

  const [vehicleCatOptions, setVehicleCatOptions] = useState<
    { value: string; label: string }[]
  >([]);

  const [orgOptions, setOrgOptions] = useState<
    { value: string; label: string }[]
  >([]);

  const [selectedOrgOption, setSelectedOrgOption] = useState<{
    value: string;
    label: string;
  }>({ value: "", label: "ทุกสังกัด" });
  const [selectedVehicleOption, setSelectedVehicleOption] = useState<{
    value: string;
    label: string;
  }>({ value: "", label: "ทุกประเภทยานพาหนะ" });

  useEffect(() => {
    const processOneStatus = localStorage.getItem("processOne");
    if (processOneStatus !== "Done") {
      router.push("process-one");
    }
  }, []);

  const searchInputRef = useRef<HTMLInputElement>(null); // Add this ref

  // Add this effect to focus the input after data loads
  useEffect(() => {
    if (!loading && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [loading]);

  useEffect(() => {
    const fetchAllData = async () => {
      if (!profile?.emp_id) return;

      try {
        setLoading(true);

        const [vehiclesResponse, carTypesResponse, deptTypesResponse] =
          await Promise.all([
            fetchSearchVehicles({
              ...params,
              emp_id: profile.emp_id,
              start_date: convertToISO(
                String(formData.startDate),
                String(formData.timeStart)
              ),
              end_date: convertToISO(
                String(formData.endDate),
                String(formData.timeEnd)
              ),
            }),
            fetchVehicleCarTypes({
              emp_id: profile.emp_id,
              start_date: convertToISO(
                String(formData.startDate),
                String(formData.timeStart)
              ),
              end_date: convertToISO(
                String(formData.endDate),
                String(formData.timeEnd)
              ),
            }),
            fetchVehicleDepartmentTypes({
              emp_id: profile.emp_id,
              start_date: convertToISO(
                String(formData.startDate),
                String(formData.timeStart)
              ),
              end_date: convertToISO(
                String(formData.endDate),
                String(formData.timeEnd)
              ),
            }),
          ]);

        if (vehiclesResponse.status === 200) {
          const allCards = [
            ...(vehiclesResponse.data.carpools || []),
            ...(vehiclesResponse.data.vehicles || []),
          ];
          setAllVehicleCards(allCards);
          setFilteredVehicleCards(allCards);
          setPaginationData({
            limit: vehiclesResponse.data.pagination.limit,
            page: vehiclesResponse.data.pagination.page,
            total: vehiclesResponse.data.pagination.total,
            totalPages: vehiclesResponse.data.pagination.totalPages,
            totalGroups: vehiclesResponse.data.pagination.totalGroups,
          });
        }

        if (carTypesResponse.status === 200) {
          const vehicleCatArr = [
            { value: "", label: "ทุกประเภทยานพาหนะ" },
            ...carTypesResponse.data.map(
              (cat: { ref_vehicle_type_name: string }) => ({
                value: cat.ref_vehicle_type_name,
                label: cat.ref_vehicle_type_name,
              })
            ),
          ];
          setVehicleCatOptions(vehicleCatArr);
          setSelectedVehicleOption((prev) =>
            prev.value ? prev : vehicleCatArr[0]
          );
        }

        if (deptTypesResponse.status === 200) {
          const orgArr = [
            { value: "", label: "ทุกสังกัด" },
            ...deptTypesResponse.data.map(
              (cat: { dept_sap: string; dept_short: string }) => ({
                value: cat.dept_sap,
                label: cat.dept_short,
              })
            ),
          ];
          setOrgOptions(orgArr);
          setSelectedOrgOption((prev) => (prev.value ? prev : orgArr[0]));
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, [
    profile?.emp_id,
    formData.startDate,
    formData.timeStart,
    formData.endDate,
    formData.timeEnd,
    params.page,
    params.limit,
    params.search,
    params.vehicle_owner_dept,
    params.category_code,
  ]);

  const handleVehicleSelect = (value: string) => {
    setSelectedVehicle(value);
    const updatedData: Partial<FormData> = {};

    if (value === "ผู้ดูแลยานพาหนะเลือกให้") {
      updatedData.isAdminChooseVehicle = "1";
      updatedData.isSystemChooseVehicle = "0";
    } else if (value === "ระบบเลือกให้(อัตโนมัติ)") {
      updatedData.isAdminChooseVehicle = "0";
    } else {
      updatedData.vehicleSelect = value;
      const selectedVehicleObj = allVehicleCards.find(
        (card) => "mas_vehicle_uid" in card && card.mas_vehicle_uid === value
      ) as Vehicle | undefined;

      updatedData.isAdminChooseDriver =
        selectedVehicleObj?.is_admin_choose_driver;
      updatedData.masCarpoolUid = "";
      updatedData.carpoolName = "";
      updatedData.masVehicleUid = value;
      updatedData.isSystemChooseVehicle = "0";
      updatedData.isAdminChooseVehicle = "0";
    }

    updateFormData(updatedData);

    if (updatedData?.isAdminChooseDriver === true) {
      router.push("process-four");
    }

    localStorage.setItem("processTwo", "Done");
    router.push("process-three");
  };

  const handleCarpoolSelect = (value: string) => {
    setSelectedVehicle(value);
    const updatedData: Partial<FormData> = {};

    if (value === "ผู้ดูแลยานพาหนะเลือกให้") {
      updatedData.isAdminChooseVehicle = "1";
      updatedData.isSystemChooseVehicle = "0";
    } else if (value === "ระบบเลือกให้(อัตโนมัติ)") {
      updatedData.isSystemChooseVehicle = "1";
      updatedData.isAdminChooseVehicle = "0";
    }

    const selectedCarpool = allVehicleCards.find(
      (card) =>
        "mas_carpool_uid" in card &&
        String(card.mas_carpool_uid) === String(value)
    ) as Carpool | undefined;
    if (selectedCarpool) {
      updatedData.carpoolName = selectedCarpool.carpool_name;
      updatedData.isAdminChooseDriver = selectedCarpool?.is_admin_choose_driver;
      updatedData.isSystemChooseVehicle =
        selectedCarpool.ref_carpool_choose_car_id === 3 ? "1" : "0";
      updatedData.isAdminChooseVehicle =
        selectedCarpool.ref_carpool_choose_car_id === 2 ? "1" : "0";
      updatedData.vehicleSelect = selectedCarpool.mas_carpool_uid;
      updatedData.masVehicleUid = "";
    }

    updateFormData(updatedData);

    if (selectedCarpool?.is_admin_choose_driver === true) {
      router.push("process-four");
    }

    localStorage.setItem("processTwo", "Done");
    router.push("process-three");
  };

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
      search: debouncedSearchInput,
      page: 1,
    }));
  }, [debouncedSearchInput]);

  const handleOrgChange = async (selectedOption: CustomSelectOption) => {
    setSelectedOrgOption(selectedOption as { value: string; label: string });
    setParams((prev) => ({
      ...prev,
      vehicle_owner_dept: selectedOption.value,
      page: 1,
    }));
  };

  const handleVehicleTypeChange = async (
    selectedOption: CustomSelectOption
  ) => {
    setSelectedVehicleOption(
      selectedOption as { value: string; label: string }
    );
    setParams((prev) => ({
      ...prev,
      category_code: selectedOption.value,
      page: 1,
    }));
  };
  const handlePageSizeChange = (newLimit: string | number) => {
    const limit =
      typeof newLimit === "string" ? parseInt(newLimit, 10) : newLimit;
    setParams((prev) => ({
      ...prev,
      limit,
      page: 1,
    }));
  };

  const handlePageChange = (page: number) => {
    setParams((prev) => ({ ...prev, page }));
  };

  if (loading) {
    return (
      <div className="main-container">
        <SideBar menuName="คำขอใช้ยานพาหนะ" />
        <div
          className={`main-content ${
            isPinned ? "md:pl-[280px]" : "md:pl-[80px]"
          }`}
        >
          <Header />
          <div className="main-content-body">
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="main-container">
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
                  <a>คำขอใช้ยานพาหนะ</a>
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

          <ProcessRequestCar step={2} />

          <div className="form-steps-group">
            <div className="form-steps" data-step="2">
              <div className="form-section">
                <div className="page-section-header border-0">
                  <div className="page-header-left">
                    <div className="page-title">
                      <span className="page-title-label">
                        ค้นหายานพาหนะ
                      </span>
                      <span className="badge badge-outline badge-gray page-title-status">
                        {filteredVehicleCards.length > 0 ? (
                          <>ว่าง {filteredVehicleCards.length} คัน {paginationData.totalGroups} กลุ่ม</>
                        ) : (
                          "ไม่พบข้อมูล"
                        )}
                      </span>
                    </div>
                    <div className="page-desc">
                      ระบบจะแสดงรายการยานพาหนะที่พร้อมให้บริการตามช่วงเวลาและเงื่อนไขที่กำหนด
                    </div>
                  </div>
                </div>

                <div className="search-section flex justify-between">
                  <div className="input-group input-group-search md:w-6/12 w-full">
                    <div className="input-group-prepend">
                      <span className="input-group-text search-ico-info">
                        <i className="material-symbols-outlined">search</i>
                      </span>
                    </div>
                    <input
                      ref={searchInputRef}
                      type="text"
                      className="form-control dt-search-input"
                      value={searchInput}
                      onChange={handleSearchChange}
                      onKeyPress={(e) => {
                        if (e.key === "Enter" && searchInput.length >= 3) {
                          setParams((prev) => ({
                            ...prev,
                            search: searchInput,
                            page: 1,
                          }));
                        }
                      }}
                      placeholder="ค้นหาเลขทะเบียน, ยี่ห้อ"
                    />
                  </div>

                  <div className="search-filter w-12/12 md:w-6/12 sm:gap-4 flex md:justify-end">
                    <CustomSelect
                      w="md:w-[13.4rem]"
                      options={orgOptions}
                      value={selectedOrgOption}
                      onChange={handleOrgChange}
                    />
                    <CustomSelect
                      w="md:w-[14rem]"
                      options={vehicleCatOptions}
                      value={selectedVehicleOption}
                      onChange={handleVehicleTypeChange}
                    />
                  </div>
                </div>

                {filteredVehicleCards.length > 0 ? (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-5 w-full">
                      {filteredVehicleCards.map((card) => {
                        if ("ref_carpool_choose_car" in card) {
                          const carpool = card;
                          return (
                            <AutoCarCard
                              key={carpool.mas_carpool_uid}
                              masCarpoolUid={carpool.mas_carpool_uid}
                              imgSrc={
                                carpool.ref_carpool_choose_car_id === 3
                                  ? "/assets/img/system-selected.png"
                                  : "/assets/img/admin-selected.png"
                              }
                              title={
                                carpool.ref_carpool_choose_car
                                  .type_of_choose_car
                              }
                              desc={carpool.carpool_name}
                              onSelect={() => {
                                updateFormData({
                                  carpoolName: carpool.carpool_name,
                                  masCarpoolUid: carpool.mas_carpool_uid,
                                });
                                handleCarpoolSelect(carpool.mas_carpool_uid);
                              }}
                              isSelected={
                                selectedVehicle === carpool.mas_carpool_uid ||
                                formData.vehicleSelect ===
                                  carpool.mas_carpool_uid
                              }
                            />
                          );
                        } else {
                          const vehicle = card;
                          return (
                            <SelectCarCard
                              key={vehicle.mas_vehicle_uid}
                              vehicleId={vehicle.mas_vehicle_uid}
                              imgSrc={
                                vehicle.vehicle_img ||
                                "/assets/img/sample-car.jpeg"
                              }
                              title={`${vehicle.vehicle_brand_name} ${vehicle.vehicle_model_name}`}
                              subTitle={vehicle.vehicle_license_plate}
                              carType={vehicle.car_type}
                              deptSap={vehicle.vehicle_owner_dept_short}
                              province={
                                vehicle.vehicle_license_plate_province_short
                              }
                              fleetCardNo={vehicle?.fleet_card_no}
                              seat={vehicle.seat}
                              onSelect={() =>
                                handleVehicleSelect(vehicle.mas_vehicle_uid)
                              }
                              isSelected={
                                selectedVehicle === vehicle.mas_vehicle_uid ||
                                formData.vehicleSelect ===
                                  vehicle.mas_vehicle_uid
                              }
                            />
                          );
                        }
                      })}
                    </div>

                    <PaginationControls
                      pagination={{
                        limit: params.limit,
                        page: params.page,
                        totalPages: paginationData.totalPages,
                        total: paginationData.total,
                      }}
                      onPageChange={handlePageChange}
                      onPageSizeChange={handlePageSizeChange}
                    />
                  </>
                ) : (
                  <ZeroRecord
                    imgSrc="/assets/img/empty/create_request_empty state_vehicle.svg"
                    title="ไม่พบยานพาหนะ"
                    desc={
                      <>
                        ระบบไม่พบยานพาหนะที่คุณสามารถเลือกได้
                        <br />
                        ลองค้นหาใหม่อีกครั้ง
                      </>
                    }
                    button="ล้างคำค้นหา"
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
