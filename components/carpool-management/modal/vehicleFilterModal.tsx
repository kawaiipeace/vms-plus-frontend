import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import BadgeStatus from "./status";
import {
  getFuelType,
  getVehicleDepartment,
  getVehicleType,
} from "@/services/vehicleService";
import {
  FuelTypeApiResponse,
  VehicleDepartmentApiResponse,
  VehicleInputParams,
  VehicleStatusProps,
  VehicleTypeApiResponse,
} from "@/app/types/vehicle-management/vehicle-list-type";

type Props = {
  flag: string;
  onSubmitFilter?: (params: VehicleInputParams) => void;
};

export type VehicleFilterModalRef = {
  open: () => void;
  close: () => void;
};

const VEHICLE_STATUS = [
  { id: "0", name: "ปกติ" },
  { id: "1", name: "บำรุงรักษา" },
  { id: "2", name: "ใช้ชั่วคราว" },
  { id: "3", name: "ส่งซ่อม" },
  { id: "4", name: "สิ้นสุดสัญญา" },
];

const ModalHeader = ({ onClose }: { onClose: () => void }) => (
  <div className="flex justify-between items-center bg-white p-6 border-b border-gray-300">
    <div className="flex gap-4 items-center">
      <i className="material-symbols-outlined text-gray-500">filter_list</i>
      <div className="flex flex-col">
        <span className="text-xl font-bold">ตัวกรอง</span>
        <span className="text-gray-500 text-sm">
          กรองข้อมูลให้แสดงเฉพาะข้อมูลที่ต้องการ
        </span>
      </div>
    </div>
    <button onClick={onClose}>
      <i className="material-symbols-outlined">close</i>
    </button>
  </div>
);

const ModalBody = ({ vehicleTypes, setParams, params }: VehicleStatusProps) => {
  const [formData, setFormData] = useState<VehicleInputParams>(params);

  useEffect(() => {
    setFormData(params);
  }, [params]);

  useEffect(() => {
    setParams(formData);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData]);

  const handleChange = (key: keyof VehicleInputParams, value: any) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="flex flex-col">
      <div className="overflow-y-auto p-4">
        <div className="mb-4">
          <span>ประเภทยานพาหนะ</span>
          <select
            className="select bg-white select-bordered w-full mt-2"
            value={formData.vehicleType}
            onChange={(e) => handleChange("vehicleType", e.target.value)}
          >
            <option value="">ทั้งหมด</option>
            {vehicleTypes.map((vt: VehicleTypeApiResponse) => (
              <option key={vt.car_type_detail} value={vt.car_type_detail}>
                {vt.car_type_detail}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label className="form-label">สถานะ</label>
          <div className="flex flex-col gap-2 mt-2">
            {VEHICLE_STATUS.map((status, index) => (
              <div className="form-group" key={index}>
                <div className="custom-group">
                  <div className="custom-control custom-checkbox custom-control-inline">
                    <input
                      type="checkbox"
                      defaultChecked
                      // checked={status.includes("1")}
                      // onChange={(e) => onChecked(e.target.checked, "1")}
                      className="checkbox [--chkbg:#A80689] checkbox-sm rounded-md"
                    />
                    <label className="custom-control-label">
                      <div className="custom-control-label-group">
                        <BadgeStatus status={status.name} />
                      </div>
                    </label>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">สถานะใช้งาน</label>
          <div className="custom-group">
            <div className="custom-control custom-checkbox custom-control-inline">
              <input
                type="checkbox"
                defaultChecked
                // checked={status.includes("1")}
                // onChange={(e) => onChecked(e.target.checked, "1")}
                className="checkbox [--chkbg:#A80689] checkbox-sm rounded-md"
              />
              <label className="custom-control-label">
                <span>เปิด</span>
              </label>
            </div>
          </div>
          <div className="custom-group">
            <div className="custom-control custom-checkbox custom-control-inline">
              <input
                type="checkbox"
                defaultChecked
                // checked={status.includes("0")}
                // onChange={(e) => onChecked(e.target.checked, "0")}
                className="checkbox [--chkbg:#A80689] checkbox-sm rounded-md"
              />
              <label className="custom-control-label">
                <span>ปิด</span>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ModalFooter = ({
  onClick,
  onSubmit,
}: {
  onClick: () => void;
  onSubmit: () => void;
}) => {
  return (
    <div className="flex p-4">
      <div className="flex items-center gap-2">
        <button className="btn btn-ghost" onClick={onClick}>
          <span className="text-base text-brand-900 font-bold">
            ล้างตัวกรอง
          </span>
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

const VehicleFilterModal = forwardRef<VehicleFilterModalRef, Props>(
  ({ onSubmitFilter, flag }, ref) => {
    const dialogRef = useRef<HTMLDialogElement>(null);

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
    });
    const [fuelType, setFuelType] = useState<FuelTypeApiResponse[]>([]);
    const [vehicleDepartment, setVehicleDepartment] = useState<
      VehicleDepartmentApiResponse[]
    >([]);
    const [vehicleType, setVehicleType] = useState<VehicleTypeApiResponse[]>(
      []
    );

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
      });
    };

    useEffect(() => {
      const fetchData = async () => {
        const [fetchFuelType, fetchVehicleDepartment, fetchVehicleType] =
          await Promise.all([
            getFuelType(),
            getVehicleDepartment(),
            getVehicleType(),
          ]);

        setFuelType(fetchFuelType);
        setVehicleDepartment(fetchVehicleDepartment);
        setVehicleType(fetchVehicleType);
      };

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
            />
          </div>

          {/* Footer ลอยอยู่ล่างเสมอ */}
          <ModalFooter
            onClick={handleClearFilter}
            onSubmit={handleSubmitFilter}
          />
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    );
  }
);

VehicleFilterModal.displayName = "VehicleFilterModal";
export default VehicleFilterModal;
