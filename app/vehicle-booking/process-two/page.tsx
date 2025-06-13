"use client";
import AutoCarCard from "@/components/card/autoCarCard";
import SelectCarCard from "@/components/card/selectCarCard";
import CustomSelect, { CustomSelectOption } from "@/components/customSelect";
import Header from "@/components/header";
import ProcessRequestCar from "@/components/processRequestCar";
import SideBar from "@/components/sideBar";
import ZeroRecord from "@/components/zeroRecord";
import { useProfile } from "@/contexts/profileContext";
import { useFormContext } from "@/contexts/requestFormContext";
import { useSidebar } from "@/contexts/sidebarContext";
import {
  fetchSearchVehicles,
  fetchVehicleCarTypes,
  fetchVehicleDepartmentTypes,
} from "@/services/masterService";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

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
}

type VehicleCard = Carpool | Vehicle;

interface PaginationInterface {
  limit: number;
  page: number;
  total: number;
  totalPages: number;
  totalGroups: number;
}

interface FormData {
  isAdminChooseVehicle?: string;
  isSystemChooseVehicle?: string;
  isAdminChooseDriver?: boolean;
  vehicleSelect?: string;
  carpoolName?: string;
  masCarpoolUid?: string;
}

export default function ProcessTwo() {
  const router = useRouter();
  const [vehicleCards, setVehicleCards] = useState<VehicleCard[]>([]);
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
    limit: 10, // Set initial limit to 8
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
    setLoading(false);
  }, []);

  const handleVehicleSelect = (value: string) => {
    setSelectedVehicle(value);
    const updatedData: Partial<FormData> = {};

    if (value === "ผู้ดูแลยานพาหนะเลือกให้") {
      updatedData.isAdminChooseVehicle = "1";
      updatedData.isSystemChooseVehicle = "0";
    } else if (value === "ระบบเลือกยานพาหนะให้อัตโนมัติ") {
      updatedData.isSystemChooseVehicle = "1";
      updatedData.isAdminChooseVehicle = "0";
    } else {
      updatedData.vehicleSelect = value;
      // Find the selected vehicle (if it's a vehicle, not a carpool)
      const selectedVehicleObj = vehicleCards.find(
        (card) => "mas_vehicle_uid" in card && card.mas_vehicle_uid === value
      ) as Vehicle | undefined;

      updatedData.isAdminChooseDriver =
        selectedVehicleObj?.is_admin_choose_driver;
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
    } else if (value === "ระบบเลือกยานพาหนะให้อัตโนมัติ") {
      updatedData.isSystemChooseVehicle = "1";
      updatedData.isAdminChooseVehicle = "0";
    }

    console.log("vehiclecard", vehicleCards);

    // Add carpool name if a carpool is selected
    const selectedCarpool = vehicleCards.find(
      (card) =>
        "mas_carpool_uid" in card &&
        String(card.mas_carpool_uid) === String(value)
    ) as Carpool | undefined;
    if (selectedCarpool) {
      updatedData.carpoolName = selectedCarpool.carpool_name;
      updatedData.isAdminChooseDriver = selectedCarpool?.is_admin_choose_driver;
      updatedData.masCarpoolUid = "";
    }

    updateFormData(updatedData);

    if (selectedCarpool?.is_admin_choose_driver === true) {
      router.push("process-four");
    }

    localStorage.setItem("processTwo", "Done");
    router.push("process-three");
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setParams((prev) => ({ ...prev, search: e.target.value }));
  };

  const handleOrgChange = async (selectedOption: CustomSelectOption) => {
    setSelectedOrgOption(selectedOption as { value: string; label: string });
    setParams((prev) => ({
      ...prev,
      vehicle_owner_dept: selectedOption.value,
    }));
  };

  const handleVehicleTypeChange = async (
    selectedOption: CustomSelectOption
  ) => {
    setSelectedVehicleOption(
      selectedOption as { value: string; label: string }
    );
    setParams((prev) => ({ ...prev, category_code: selectedOption.value }));
  };

  const handlePageChange = (page: number) => {
    setParams((prev) => ({ ...prev, page }));
  };

  useEffect(() => {
    const fetchVehicleData = async () => {
      try {
        const currentLimit = params.page === 1 ? 10 : 10;
        const response = await fetchSearchVehicles({
          ...params,
          limit: currentLimit,
          emp_id: profile?.emp_id,
          start_date: `${formData.startDate} ${formData.timeStart}`,
          end_date: `${formData.endDate} ${formData.timeEnd}`,
        });

        if (response.status === 200) {
          const allCards = [
            ...(response.data.carpools || []),
            ...(response.data.vehicles || []),
          ];
          setVehicleCards(allCards);
          console.log("vehicles", allCards);
          setPaginationData(response.data.pagination);
        }
      } catch (error) {
        console.error("Error fetching vehicle data:", error);
      }
    };

    const fetchVehicleCarTypesData = async () => {
      if (
        !profile?.emp_id ||
        !formData.startDate ||
        !formData.timeStart ||
        !formData.endDate ||
        !formData.timeEnd
      ) {
        // Required data not available yet
        return;
      }
      const vehicleParams = {
        emp_id: profile?.emp_id,
        start_date: `${formData.startDate} ${formData.timeStart}`,
        end_date: `${formData.endDate} ${formData.timeEnd}`,
      };

      try {
        const response = await fetchVehicleCarTypes(vehicleParams);

        if (response.status === 200) {
          const vehicleCatData = response.data;
          const vehicleCatArr = [
            { value: "", label: "ทุกประเภทยานพาหนะ" },
            ...vehicleCatData.map((cat: { ref_vehicle_type_name: string }) => ({
              value: cat.ref_vehicle_type_name,
              label: cat.ref_vehicle_type_name,
            })),
          ];

          setVehicleCatOptions(vehicleCatArr);
          setSelectedVehicleOption((prev) =>
            prev.value ? prev : vehicleCatArr[0]
          );
        }
      } catch (error) {
        console.error("Error fetching vehicle car types:", error);
      }
    };

    const fetchVehicleDepartmentsData = async () => {
      if (
        !profile?.emp_id ||
        !formData.startDate ||
        !formData.timeStart ||
        !formData.endDate ||
        !formData.timeEnd
      ) {
        // Required data not available yet
        return;
      }
      const vehicleParams = {
        emp_id: profile?.emp_id,
        start_date: `${formData.startDate} ${formData.timeStart}`,
        end_date: `${formData.endDate} ${formData.timeEnd}`,
      };
      try {
        const response = await fetchVehicleDepartmentTypes(vehicleParams);

        if (response.status === 200) {
          const vehicleCatData = response.data;
          const vehicleCatArr = [
            { value: "", label: "ทุกสังกัด" },
            ...vehicleCatData.map(
              (cat: { dept_sap: string; dept_short: string }) => ({
                value: cat.dept_sap,
                label: cat.dept_short,
              })
            ),
          ];

          setOrgOptions(vehicleCatArr);
          setSelectedOrgOption((prev) =>
            prev.value ? prev : vehicleCatArr[0]
          );
        }
      } catch (error) {
        console.error("Error fetching vehicle car types:", error);
      }
    };
    if (profile?.emp_id) {
      fetchVehicleData();
      fetchVehicleCarTypesData();
      fetchVehicleDepartmentsData();
    }
  }, [
    params,
    profile?.emp_id,
    formData.startDate,
    formData.timeStart,
    formData.endDate,
    formData.timeEnd,
  ]);

  if (loading) return null;

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
                  <a>
                    <i className="material-symbols-outlined">home</i>
                  </a>
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
                        ข้อมูลผู้ใช้ยานพาหนะ
                      </span>
                      <span className="badge badge-outline badge-gray page-title-status">
                        ว่าง {paginationData.total} คัน และ{" "}
                        {paginationData.totalGroups} กลุ่ม
                      </span>
                    </div>
                    <div className="page-desc">
                      ระบบจะแสดงรายการยานพาหนะที่พร้อมให้บริการตามช่วงเวลาและเงื่อนไขที่กำหนด
                    </div>
                  </div>
                </div>

                <div className="search-section flex justify-between">
                  <div className="input-group input-group-search w-6/12">
                    <div className="input-group-prepend">
                      <span className="input-group-text search-ico-info">
                        <i className="material-symbols-outlined">search</i>
                      </span>
                    </div>
                    <input
                      type="text"
                      className="form-control dt-search-input"
                      onChange={handleSearchChange}
                      placeholder="ค้นหาเลขทะเบียน, ยี่ห้อ"
                    />
                    <div className="input-group-append hidden">
                      <span className="input-group-text search-ico-trailing">
                        <i className="material-symbols-outlined">close_small</i>
                      </span>
                    </div>
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

                {vehicleCards.length > 0 ? (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-5 w-full">
                      {vehicleCards.map((card) => {
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
                                // Set carpoolName in formData when selecting an AutoCarCard
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
                          // It's a Vehicle
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

                {vehicleCards.length > 0 && (
                  <div className="flex justify-between items-center mt-5 dt-bottom">
                    <div className="flex items-center gap-2">
                      <div className="dt-info" aria-live="polite" role="status">
                        แสดง{" "}
                        {(paginationData.page - 1) * paginationData.limit + 1}{" "}
                        ถึง{" "}
                        {Math.min(
                          paginationData.page * paginationData.limit,
                          paginationData.total
                        )}{" "}
                        จาก {paginationData.total} รายการ
                      </div>
                      <CustomSelect
                        w="w-[5em]"
                        options={[
                          { value: "10", label: "10" },
                          { value: "30", label: "30" },
                          { value: "50", label: "50" },
                          { value: "100", label: "100" },
                        ]}
                        value={{
                          value: paginationData.limit.toString(),
                          label: paginationData.limit.toString(),
                        }}
                        onChange={(selectedOption) =>
                          setParams((prev) => ({
                            ...prev,
                            limit: Number(selectedOption.value),
                            page: 1,
                          }))
                        }
                      />
                    </div>

                    <div className="pagination flex justify-end">
                      <div className="join">
                        <button
                          className="join-item btn btn-sm btn-outline"
                          onClick={() =>
                            handlePageChange(paginationData.page - 1)
                          }
                          disabled={paginationData.page === 1}
                        >
                          <i className="material-symbols-outlined">
                            chevron_left
                          </i>
                        </button>

                        {Array.from(
                          { length: paginationData.totalPages },
                          (_, index) => index + 1
                        ).map((page) => (
                          <button
                            key={page}
                            className={`join-item btn btn-sm btn-outline ${
                              paginationData.page === page ? "btn-active" : ""
                            }`}
                            onClick={() => handlePageChange(page)}
                          >
                            {page}
                          </button>
                        ))}

                        <button
                          className="join-item btn btn-sm btn-outline"
                          onClick={() =>
                            handlePageChange(paginationData.page + 1)
                          }
                          disabled={
                            paginationData.page === paginationData.totalPages
                          }
                        >
                          <i className="material-symbols-outlined">
                            chevron_right
                          </i>
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* <div className="form-action">
            <button
              onClick={() => NextProcess()}
              className="btn btn-primary"
              disabled={selectedVehicle === "" && formData.vehicleSelect === ""}
            >
              ต่อไป
              <i className="material-symbols-outlined icon-settings-300-24">
                arrow_right_alt
              </i>
            </button>
          </div> */}
        </div>
      </div>
    </div>
  );
}
