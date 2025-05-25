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

export type DriverFilterModalRef = {
  open: () => void;
  close: () => void;
};

const DRIVER_STATUS = [
  { id: "0", name: "ปฏิบัติงานปกติ" },
  { id: "1", name: "ลาป่วย/ลากิจ" },
  { id: "2", name: "ทดแทน" },
  { id: "3", name: "สำรอง" },
  { id: "4", name: "สิ้นสุดสัญญา" },
  { id: "5", name: "ลาออก" },
  { id: "6", name: "ให้ออก" },
];

const DRIVER_TYPE = [
  { id: "1", name: "ได้" },
  { id: "2", name: "ไม่ได้" },
];

const DRIVER_ACTIVE = [
  { id: "0", name: "ปิด" },
  { id: "1", name: "เปิด" },
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

const ModalBody = ({ setParams, params }: VehicleStatusProps) => {
  // const [work_type, setWorkType] = useState<string[]>([]);
  // const [is_active, setIsActive] = useState<string[]>([]);

  return (
    <div className="flex flex-col">
      <div className="overflow-y-auto p-4">
        <div className="mb-4">
          <label className="form-label">สถานะ</label>
          <div className="flex flex-col gap-2 mt-2">
            {DRIVER_STATUS.map((status, index) => (
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

        <div className="form-group">
          <label className="form-label">ประเภทค้างคืน</label>
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
                <span>ได้</span>
              </label>
            </div>
          </div>
          <div className="custom-group">
            <div className="custom-control custom-checkbox custom-control-inline">
              <input
                type="checkbox"
                defaultChecked
                // checked={status.includes("2")}
                // onChange={(e) => onChecked(e.target.checked, "2")}
                className="checkbox [--chkbg:#A80689] checkbox-sm rounded-md"
              />
              <label className="custom-control-label">
                <span>ไม่ได้</span>
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

const DriverFilterModal = forwardRef<DriverFilterModalRef, Props>(
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

DriverFilterModal.displayName = "DriverFilterModal";
export default DriverFilterModal;
