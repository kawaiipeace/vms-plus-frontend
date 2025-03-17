"use client";
import { useEffect, useState } from "react";
import * as yup from "yup";
import { useSidebar } from "@/app/contexts/sidebarContext";
import { useRouter } from "next/navigation";
import Header from "@/app/components/header";
import ProcessRequestCar from "@/app/components/processRequestCar";
import SideBar from "@/app/components/sideBar";
import AutoCarCard from "@/app/components/card/autoCarCard";
import SelectCarCard from "@/app/components/card/selectCarCard";
import Pagination from "@/app/components/pagination";
import CustomSelect from "@/app/components/customSelect";
import ZeroRecord from "@/app/components/zeroRecord";
import { fetchVehicles } from "@/app/services/bookingUser";
import { fetchVehicleCarTypes } from "@/app/services/masterService";
import { useForm } from "react-hook-form";
// import { useFormContext } from "@/app/contexts/requestFormContext";
import { yupResolver } from "@hookform/resolvers/yup";
// import Toast from "@/app/components/toast";

interface Vehicle {
  mas_vehicle_uid: string;
  vehicle_license_plate: string;
  vehicle_brand_name: string;
  vehicle_model_name: string;
  car_type: string;
  vehicle_owner_dept_sap: string;
  vehicle_img: string;
  seat: number;
}

interface PaginationInterface {
  limit: number;
  page: number;
  total: number;
  totalPages: number;
}

const schema = yup.object().shape({
  isAdminChooseVehicle: yup.number(),
});

export default function ProcessTwo() {
  const router = useRouter();
  const [vehicleCards, setVehicleCards] = useState<Vehicle[]>([]);
  const [paginationData, setPaginationData] = useState<PaginationInterface>({
    limit: 10,
    page: 1,
    total: 0,
    totalPages: 0,
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

  const [vehicleCatOptions, setVehicleCatOptions] = useState<
  { value: string; label: string }[]
>([]);
// const { updateFormData } = useFormContext();

  const orgOptions = [
    { label: "ทุกสังกัด", value: "" },
    { label: "หน่วยงานต้นสังกัด", value: "หน่วยงานต้นสังกัด" },
    { label: "ฝพจ.", value: "ฝพจ." },
    { label: "กอพ.2", value: "กอพ.2" },
  ];

  const [selectedOrgOption, setSelectedOrgOption] = useState(orgOptions[0]);
  const [selectedVehicleOption, setSelectedVehicleOption] = useState<{ value: string; label: string }>({ value: "", label: "ทุกประเภทยานพาหนะ" });

  const handleVehicleSelect = (value: string) => {
    setSelectedVehicle(value);
    localStorage.setItem('processTwoSelect', value);
    if(value == "ผู้ดูแลยานพาหนะเลือกให้"){
      setValue("isAdminChooseVehicle", 1);
    }
  };

  const NextProcess = () => {
    router.push("process-three");
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setParams((prev) => ({ ...prev, search: e.target.value }));
  };

   const {
      // register,
      // handleSubmit,
      setValue,
      // formState: { errors, isValid },
    } = useForm({
      mode: "onChange",
      resolver: yupResolver(schema),
    });

  const handleOrgChange = async (selectedOption: {
    value: string;
    label: string;
  }) => {
    setSelectedOrgOption(selectedOption);
    setParams((prev) => ({
      ...prev,
      vehicle_owner_dept: selectedOption.value,
    }));
  };

  const handleVehicleTypeChange = async (selectedOption: {
    value: string;
    label: string;
  }) => {
    setSelectedVehicleOption(selectedOption);
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

            console.log('res',response);
            if (response.status === 200) {
              const vehicleCatData = response.data.categories;
              console.log(response.data.categories);
              const vehicleCatArr = [
                { value: "", label: "ทุกประเภทยานพาหนะ" },
                ...vehicleCatData.map(
                  (cat: {
                    ref_vehicle_type_code: string;
                    ref_vehicle_type_name: string;
                  }) => ({
                    value: cat.ref_vehicle_type_code,
                    label: cat.ref_vehicle_type_name,
                  })
                ),
              ];
              
              setVehicleCatOptions(vehicleCatArr);
              setSelectedVehicleOption((prev) =>
                prev.value ? prev : vehicleCatArr[0]
              );
            }
          } catch (error) {
            console.error("Error fetching requests:", error);
          }
        };

    fetchVehicleData();
    fetchVehicleCarTypesData();
  }, [params]);

  return (
    <div>
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
                        <span className="page-title-label">
                          ข้อมูลผู้ใช้ยานพาหนะ
                        </span>
                        <span className="badge badge-outline badge-gray page-title-status">
                          {paginationData.total} คัน
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
                          <i className="material-symbols-outlined">
                            close_small
                          </i>
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
                            imgSrc={
                              vehicle.vehicle_img ||
                              "/assets/img/sample-car.jpeg"
                            }
                            title={
                              vehicle.vehicle_brand_name +
                              vehicle.vehicle_model_name
                            }
                            subTitle={vehicle.vehicle_license_plate}
                            carType={vehicle.car_type}
                            deptSap={vehicle.vehicle_owner_dept_sap}
                            seat={vehicle.seat}
                            onSelect={() =>
                              handleVehicleSelect(vehicle.mas_vehicle_uid)
                            }
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
                disabled={selectedVehicle === ""}
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
    </div>
  );
}
