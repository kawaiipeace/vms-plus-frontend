"use client";
import AutoCarCard from "@/components/card/autoCarCard";
import SelectCarCard from "@/components/card/selectCarCard";
import CustomSelect, { CustomSelectOption } from "@/components/customSelect";
import Header from "@/components/header";
import Pagination from "@/components/pagination";
import ProcessRequestCar from "@/components/processRequestCar";
import SideBar from "@/components/sideBar";
import ZeroRecord from "@/components/zeroRecord";
import { useFormContext } from "@/contexts/requestFormContext";
import { useSidebar } from "@/contexts/sidebarContext";
import { fetchVehicleCarTypes, fetchVehicles } from "@/services/masterService";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
// import Toast from "@/components/toast";

interface Vehicle {
  mas_vehicle_uid: string;
  vehicle_license_plate: string;
  vehicle_brand_name: string;
  vehicle_model_name: string;
  car_type: string;
  vehicle_owner_dept_sap: string;
  vehicle_img: string;
  seat: number;
  is_admin_choose_driver?: boolean;
}

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
}

export default function ProcessTwo() {
  const router = useRouter();
  const [vehicleCards, setVehicleCards] = useState<Vehicle[]>([]);
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
  const [params, setParams] = useState({
    search: "",
    vehicle_owner_dept: "",
    car_type: "",
    category_code: "",
    page: 1,
    limit: 10,
  });

  const [vehicleCatOptions, setVehicleCatOptions] = useState<{ value: string; label: string }[]>([]);
  // const { updateFormData } = useFormContext();

  const orgOptions = [
    { label: "ทุกสังกัด", value: "" },
    { label: "หน่วยงานต้นสังกัด", value: "หน่วยงานต้นสังกัด" },
    { label: "ฝพจ.", value: "ฝพจ." },
    { label: "กอพ.2", value: "กอพ.2" },
  ];

  const [selectedOrgOption, setSelectedOrgOption] = useState(orgOptions[0]);
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
    if (value == "ผู้ดูแลยานพาหนะเลือกให้") {
      updatedData.isAdminChooseVehicle = "1"; // Update the data object
      updatedData.isSystemChooseVehicle = "0";
    } else if (value == "ระบบเลือกยานพาหนะให้อัตโนมัติ") {
      updatedData.isSystemChooseVehicle = "1"; // Update the data object
      updatedData.isAdminChooseVehicle = "0";
    } else {
      updatedData.vehicleSelect = value; // Update the data object

      const selectedVehicleObj = vehicleCards.find((vehicle) => vehicle.mas_vehicle_uid === value);

      if (selectedVehicleObj?.is_admin_choose_driver !== undefined) {
        updatedData.isAdminChooseDriver = selectedVehicleObj.is_admin_choose_driver ? true : false;
      }
    }

    updateFormData(updatedData);
  };

  const NextProcess = () => {
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

  const handleVehicleTypeChange = async (selectedOption: CustomSelectOption) => {
    setSelectedVehicleOption(selectedOption as { value: string; label: string });
    setParams((prev) => ({ ...prev, category_code: selectedOption.value }));
  };

  const handlePageChange = (page: number) => {
    setParams((prev) => ({ ...prev, page }));
  };

  useEffect(() => {
    const fetchVehicleData = async () => {
      try {
        const response = await fetchVehicles(params);
        if (response.status === 200) {
          if (response.data.vehicles == null) {
            setVehicleCards([]);
          }
          setVehicleCards(response.data.vehicles);
          setPaginationData(response.data.pagination);
        }
      } catch (error) {
        console.error("Error fetching requests:", error);
      }
    };

    const fetchVehicleCarTypesData = async () => {
      try {
        const response = await fetchVehicleCarTypes();

        if (response.status === 200) {
          const vehicleCatData = response.data;
          console.log(response.data);
          const vehicleCatArr = [
            { value: "", label: "ทุกประเภทยานพาหนะ" },
            ...vehicleCatData.map((cat: { ref_vehicle_type_code: string; ref_vehicle_type_name: string }) => ({
              value: cat.ref_vehicle_type_code,
              label: cat.ref_vehicle_type_name,
            })),
          ];

          setVehicleCatOptions(vehicleCatArr);
          setSelectedVehicleOption((prev) => (prev.value ? prev : vehicleCatArr[0]));
        }
      } catch (error) {
        console.error("Error fetching requests:", error);
      }
    };

    fetchVehicleData();
    fetchVehicleCarTypesData();
  }, [params]);

  if (loading) return null;

  return (
    <div className="main-container">
      <SideBar menuName="คำขอใช้ยานพาหนะ" />

      <div className={`main-content ${isPinned ? "md:pl-[280px]" : "md:pl-[80px]"}`}>
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
                {/* <!-- <span className="badge badge-outline badge-gray">95 กลุ่ม</span> --> */}
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
                      <span className="page-title-label">ข้อมูลผู้ใช้ยานพาหนะ</span>
                      <span className="badge badge-outline badge-gray page-title-status">
                        ว่าง {paginationData.total} คัน และ {paginationData.totalGroups} กลุ่ม
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

                <div className="grid grid-cols-1 md:grid-cols-4 gap-5 w-full">
                  {vehicleCards != null && vehicleCards.length > 0 && (
                    <>
                      <AutoCarCard
                        imgSrc="/assets/img/admin-selected.png"
                        title="ผู้ดูแลยานพาหนะเลือกให้"
                        desc="สายงานดิจิทัล"
                        onSelect={handleVehicleSelect}
                      />
                      <AutoCarCard
                        imgSrc="/assets/img/system-selected.png"
                        title="ระบบเลือกยานพาหนะให้อัตโนมัติ"
                        desc="สายงานดิจิทัล"
                        onSelect={handleVehicleSelect}
                      />
                      {vehicleCards.map((vehicle) => (
                        <SelectCarCard
                          key={vehicle.mas_vehicle_uid}
                          vehicleId={vehicle.mas_vehicle_uid}
                          imgSrc={vehicle.vehicle_img || "/assets/img/sample-car.jpeg"}
                          title={vehicle.vehicle_brand_name + vehicle.vehicle_model_name}
                          subTitle={vehicle.vehicle_license_plate}
                          carType={vehicle.car_type}
                          deptSap={vehicle.vehicle_owner_dept_sap}
                          seat={vehicle.seat}
                          onSelect={() => handleVehicleSelect(vehicle.mas_vehicle_uid)}
                        />
                      ))}{" "}
                    </>
                  )}
                </div>
                {vehicleCards != null && vehicleCards.length > 0 && (
                  <div className="pagination mt-[1.5rem] flex justify-end">
                    <Pagination
                      currentPage={paginationData.page}
                      totalPages={paginationData.totalPages}
                      onPageChange={handlePageChange}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          {(vehicleCards == null || vehicleCards.length === 0) && (
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

          <div className="form-action">
            <button
              onClick={() => NextProcess()}
              className="btn btn-primary"
              disabled={selectedVehicle === "" && formData.vehicleSelect === ""}
            >
              ต่อไป
              <i className="material-symbols-outlined icon-settings-300-24">arrow_right_alt</i>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
