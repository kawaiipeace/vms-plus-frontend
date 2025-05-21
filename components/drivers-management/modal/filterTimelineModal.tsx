import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import VehicleStatus from "@/components/vehicle/status";
import { getFuelType, getVehicleDepartment, getVehicleType } from "@/services/vehicleService";
import { driverStatusRef } from "@/services/driversManagement";
import {
  FuelTypeApiResponse,
  VehicleDepartmentApiResponse,
  VehicleTypeApiResponse,
} from "@/app/types/vehicle-management/vehicle-list-type";

type Props = {
  flag: string;
  onSubmitFilter?: (params: VehicleInputParams) => void;
};

export type FilterModalRef = {
  open: () => void;
  close: () => void;
};

// const TAX_TYPE = [
//   { id: "1", name: "ได้" },
//   { id: "0", name: "ไม่ได้" },
// ];

// const VEHICLE_STATUS = [
//   { id: "0", name: "ปกติ" },
//   { id: "1", name: "บำรุงรักษา" },
//   { id: "2", name: "ใช้ชั่วคราว" },
//   { id: "3", name: "ส่งซ่อม" },
//   { id: "4", name: "สิ้นสุดสัญญา" },
// ];

interface DriverStatus {
  ref_driver_status_code: string;
  ref_driver_status_desc: string;
}

export interface VehicleStatusProps {
  vehicleDepartments: VehicleDepartmentApiResponse[];
  fuelTypes: FuelTypeApiResponse[];
  vehicleTypes: VehicleTypeApiResponse[];
  flag: string;
  params: VehicleInputParams;
  setParams: (params: VehicleInputParams) => void;
  driverStatus: DriverStatus[];
  statusDriver: {
    ref_request_status_name: string;
    ref_request_status_code: string;
  }[];
  driverWorkType: {
    ref_request_status_name: string;
    ref_request_status_code: string;
  }[];
}

export interface VehicleInputParams {
  fuelType: string;
  vehicleType: string;
  vehicleDepartment: string;
  taxVehicle: string[];
  vehicleStatus: string[];
  driverWorkType: string[];
}

const ModalHeader = ({ onClose }: { onClose: () => void }) => (
  <div className="flex justify-between items-center bg-white p-6 border-b border-gray-300">
    <div className="flex gap-4 items-center">
      <i className="material-symbols-outlined text-gray-500">filter_list</i>
      <div className="flex flex-col">
        <span className="text-xl font-bold">ตัวกรอง</span>
        <span className="text-gray-500 text-sm">กรองข้อมูลให้แสดงเฉพาะข้อมูลที่ต้องการ</span>
      </div>
    </div>
    <button onClick={onClose}>
      <i className="material-symbols-outlined">close</i>
    </button>
  </div>
);

const ModalBody = ({
  // vehicleDepartments,
  // fuelTypes,
  // vehicleTypes,
  // flag,
  setParams,
  params,
  driverStatus,
  statusDriver,
  driverWorkType,
}: VehicleStatusProps) => {
  const [formData, setFormData] = useState<VehicleInputParams>(params);

  useEffect(() => {
    setFormData(params);
  }, [params]);

  useEffect(() => {
    setParams(formData);
  }, [formData]);

  const handleCheckboxToggle = (key: keyof VehicleInputParams, value: string) => {
    setFormData((prev) => {
      const current = prev[key] as string[];
      return {
        ...prev,
        [key]: current.includes(value) ? current.filter((v) => v !== value) : [...current, value],
      };
    });
  };

  // const handleChange = (key: keyof VehicleInputParams, value: any) => {
  //   setFormData((prev) => ({ ...prev, [key]: value }));
  // };

  return (
    <div className="flex flex-col">
      <div className="overflow-y-auto p-4">
        <div className="mb-4">
          <div>
            <span className="text-base font-semibold">สถานะใช้งาน</span>
            <div>
              {statusDriver.map((option, index) => (
                <div key={index} className="flex gap-2">
                  <label htmlFor={`option1-${index}`} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      id={`option1-${index}`}
                      checked={formData.taxVehicle.includes(option.ref_request_status_code)}
                      className="checkbox checkbox-primary h-5 w-5"
                      onChange={() => handleCheckboxToggle("taxVehicle", option.ref_request_status_code)}
                    />
                    <span className="text-base">{option.ref_request_status_name}</span>
                  </label>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mb-4">
          <div>
            <span className="text-base font-semibold">ประเภทค้างคืน</span>
            <div>
              {driverWorkType.map((option, index) => (
                <div key={index} className="flex gap-2">
                  <label htmlFor={`option2-${index}`} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      id={`option2-${index}`}
                      checked={formData.driverWorkType.includes(option.ref_request_status_code)}
                      className="checkbox checkbox-primary h-5 w-5"
                      onChange={() => handleCheckboxToggle("driverWorkType", option.ref_request_status_code)}
                    />
                    <span className="text-base">{option.ref_request_status_name}</span>
                  </label>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mb-4">
          <span className="text-base font-semibold">สถานะการปฏิบัติงาน</span>
          <div className="flex flex-col gap-2 mt-2">
            {driverStatus.map((status, index) => (
              <div key={index} className="flex items-center gap-2">
                <label htmlFor={`status-${index}`} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    id={`status-${index}`}
                    className="checkbox checkbox-primary h-5 w-5"
                    checked={formData.vehicleStatus.includes(status.ref_driver_status_code)}
                    onChange={() => handleCheckboxToggle("vehicleStatus", status.ref_driver_status_code)}
                  />
                  <VehicleStatus status={status.ref_driver_status_desc} />
                </label>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const ModalFooter = ({ onClick, onSubmit }: { onClick: () => void; onSubmit: () => void }) => {
  return (
    <div className="flex p-4">
      <div className="flex items-center gap-2">
        <button className="btn btn-ghost" onClick={onClick}>
          <span className="text-base text-brand-900 font-bold">ล้างตัวกรอง</span>
        </button>
      </div>

      <div className="flex gap-2 ml-auto">
        <button className="btn btn-secondary" onClick={onClick}>
          ยกเลิก
        </button>
        <button className="btn btn-primary" onClick={onSubmit}>
          ตกลง
        </button>
      </div>
    </div>
  );
};

const FilterModal = forwardRef<FilterModalRef, Props>(({ onSubmitFilter, flag }, ref) => {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [driverStatus, setDriverStatus] = useState<DriverStatus[]>([]);

  useImperativeHandle(ref, () => ({
    open: () => dialogRef.current?.showModal(),
    close: () => dialogRef.current?.close(),
  }));

  const [params, setParams] = useState<VehicleInputParams>({
    fuelType: "",
    vehicleType: "",
    vehicleDepartment: "",
    taxVehicle: [],
    vehicleStatus: [],
    driverWorkType: [],
  });
  const [fuelType, setFuelType] = useState<FuelTypeApiResponse[]>([]);
  const [vehicleDepartment, setVehicleDepartment] = useState<VehicleDepartmentApiResponse[]>([]);
  const [vehicleType, setVehicleType] = useState<VehicleTypeApiResponse[]>([]);
  const statusDriver: {
    ref_request_status_name: string;
    ref_request_status_code: string;
  }[] = [
    { ref_request_status_name: "ใช้งาน", ref_request_status_code: "1" },
    { ref_request_status_name: "ไม่ใช้งาน", ref_request_status_code: "0" },
  ];
  const driverWorkType: {
    ref_request_status_name: string;
    ref_request_status_code: string;
  }[] = [
    { ref_request_status_name: "ได้", ref_request_status_code: "1" },
    { ref_request_status_name: "ไม่ได้", ref_request_status_code: "2" },
  ];

  const handleSubmitFilter = () => {
    console.log("submit filter", params);
    onSubmitFilter?.(params);
    dialogRef.current?.close();
  };

  const handleClearFilter = () => {
    console.log("clear filter");
    setParams({
      fuelType: "",
      vehicleType: "",
      vehicleDepartment: "",
      taxVehicle: [],
      vehicleStatus: [],
      driverWorkType: [],
    });
  };

  useEffect(() => {
    const fetchData = async () => {
      const [fetchFuelType, fetchVehicleDepartment, fetchVehicleType] = await Promise.all([
        getFuelType(),
        getVehicleDepartment(),
        getVehicleType(),
      ]);

      setFuelType(fetchFuelType);
      setVehicleDepartment(fetchVehicleDepartment);
      setVehicleType(fetchVehicleType);
    };
    const fetchDriverStatus = async () => {
      try {
        const response = await driverStatusRef();
        if (response.status === 200) {
          const driverStatusArr: DriverStatus[] = response.data;
          setDriverStatus(driverStatusArr);
        } else {
          console.error("Failed to fetch driver status");
        }
      } catch (error) {
        console.error("Error fetching driver status:", error);
      }
    };

    fetchDriverStatus();
    fetchData();
  }, []);

  return (
    <dialog ref={dialogRef} className="modal">
      <div className="modal-box max-w-[450px] p-0 relative rounded-none overflow-hidden flex flex-col max-h-[100vh] ml-auto mr-10 h-[100vh] bg-white">
        <ModalHeader onClose={() => dialogRef.current?.close()} />

        {/* Content scroll ได้ */}
        <div className="flex-1 overflow-y-auto">
          <ModalBody
            fuelTypes={fuelType}
            vehicleDepartments={vehicleDepartment}
            vehicleTypes={vehicleType}
            flag={flag}
            setParams={setParams}
            params={params}
            driverStatus={driverStatus}
            statusDriver={statusDriver}
            driverWorkType={driverWorkType}
          />
        </div>

        {/* Footer ลอยอยู่ล่างเสมอ */}
        <ModalFooter onClick={handleClearFilter} onSubmit={handleSubmitFilter} />
      </div>
      <form method="dialog" className="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>
  );
});

FilterModal.displayName = "FilterModal";
export default FilterModal;
