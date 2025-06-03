import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import BadgeStatus from "./status";
import { getVehicleType } from "@/services/vehicleService";
import { VehicleTypeApiResponse } from "@/app/types/vehicle-management/vehicle-list-type";
import CustomSelect, { CustomSelectOption } from "@/components/customSelect";
import { getVehicleStatus } from "@/services/carpoolManagement";

type Props = {
  flag: string;
  onSubmitFilter?: (params: any) => void;
  vehicleParams: any;
  setVehicleParams: (p: any) => void;
};

export type VehicleFilterModalRef = {
  open: () => void;
  close: () => void;
};

interface ModalBodyProps {
  vehicleStatus: VehicleStatus[];
  vehicleTypes: VehicleTypeApiResponse[];
  setParams: (params: VehicleParams) => void;
  params: VehicleParams;
}

interface VehicleParams {
  vehicel_car_type_detail: CustomSelectOption;
  ref_vehicle_status_code: string[];
  is_active: string[];
}

interface VehicleStatus {
  ref_vehicle_status_code: number;
  ref_vehicle_status_name: string;
}

const VEHICLE_ACTIVE = [
  { id: "0", name: "ปิด" },
  { id: "1", name: "เปิด" },
];

const ModalHeader = ({ onClose }: { onClose: () => void }) => (
  <div className="modal-header flex justify-between items-center bg-white p-6 border-b border-gray-300">
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

const ModalBody = ({
  vehicleTypes,
  vehicleStatus,
  setParams,
  params,
}: ModalBodyProps) => {
  const [selected, setSelected] = useState<CustomSelectOption>();

  const options = vehicleTypes.map((vt) => ({
    value: vt.car_type_detail,
    label: vt.car_type_detail,
  }));

  const onActiveChecked = (checked: boolean, id: string) => {
    if (checked) {
      setParams({ ...params, is_active: [...params.is_active, id] });
    } else {
      setParams({
        ...params,
        is_active: params.is_active.filter((item) => item !== id),
      });
    }
  };

  const onStatusChecked = (checked: boolean, id: string) => {
    if (checked) {
      setParams({
        ...params,
        ref_vehicle_status_code: [...params.ref_vehicle_status_code, id],
      });
    } else {
      setParams({
        ...params,
        ref_vehicle_status_code: params.ref_vehicle_status_code.filter(
          (item) => item !== id
        ),
      });
    }
  };

  return (
    <div className="flex flex-col">
      <div className="overflow-y-auto p-4">
        <div className="mb-4">
          <label className="form-label">ประเภทยานพาหนะ</label>
          <div className="mt-2">
            <CustomSelect
              w="100"
              options={[{ value: "", label: "ทั้งหมด" }, ...options]}
              value={selected}
              onChange={setSelected}
            />
          </div>
        </div>

        <div className="mb-4">
          <label className="form-label">สถานะ</label>
          <div className="flex flex-col gap-2 mt-2">
            {vehicleStatus.map((_status, index) => (
              <div className="form-group" key={index}>
                <div className="custom-group">
                  <div className="custom-control custom-checkbox custom-control-inline">
                    <input
                      type="checkbox"
                      defaultChecked
                      checked={params.ref_vehicle_status_code.includes(
                        _status.ref_vehicle_status_code.toString()
                      )}
                      onChange={(e) =>
                        onStatusChecked(
                          e.target.checked,
                          _status.ref_vehicle_status_code.toString()
                        )
                      }
                      className="checkbox [--chkbg:#A80689] checkbox-sm rounded-md"
                    />
                    <label className="custom-control-label">
                      <div className="custom-control-label-group">
                        <BadgeStatus status={_status.ref_vehicle_status_name} />
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
          <div className="custom-group flex-col !gap-0">
            {VEHICLE_ACTIVE.map((e) => (
              <div
                className="custom-control custom-checkbox custom-control-inline"
                key={e.id}
              >
                <input
                  type="checkbox"
                  defaultChecked
                  checked={params.is_active.includes(e.id)}
                  onChange={(e) =>
                    onActiveChecked(e.target.checked, e.target.value)
                  }
                  className="checkbox [--chkbg:#A80689] checkbox-sm rounded-md"
                />
                <label className="custom-control-label">{e.name}</label>
              </div>
            ))}
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
  ({ onSubmitFilter, vehicleParams, setVehicleParams }, ref) => {
    const dialogRef = useRef<HTMLDialogElement>(null);

    useImperativeHandle(ref, () => ({
      open: () => dialogRef.current?.showModal(),
      close: () => dialogRef.current?.close(),
    }));

    const [vehicleStatus, setVehicleStatus] = useState<VehicleStatus[]>([]);
    const [vehicleType, setVehicleType] = useState<VehicleTypeApiResponse[]>(
      []
    );

    const [params, setParams] = useState<VehicleParams>({
      vehicel_car_type_detail: { value: "", label: "ทั้งหมด" },
      ref_vehicle_status_code: [],
      is_active: [],
    });

    useEffect(() => {
      if (vehicleParams.ref_vehicle_status_code === "") {
        setParams({
          ...params,
          vehicel_car_type_detail: { value: "", label: "ทั้งหมด" },
        });
      }
      if (vehicleParams.is_active === "") {
        setParams({
          ...params,
          is_active: [],
        });
      }
      if (vehicleParams.ref_vehicle_status_code === "") {
        setParams({
          ...params,
          ref_vehicle_status_code: [],
        });
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [vehicleParams]);

    const handleSubmitFilter = () => {
      onSubmitFilter?.({
        ...params,
        vehicel_car_type_detail: params.vehicel_car_type_detail.value,
        ref_vehicle_status_code: params.ref_vehicle_status_code.join(","),
        is_active: params.is_active.join(","),
      });
      dialogRef.current?.close();
    };

    const handleClearFilter = () => {
      setParams({
        vehicel_car_type_detail: { value: "", label: "ทั้งหมด" },
        ref_vehicle_status_code: [],
        is_active: [],
      });
      setVehicleParams({
        ...vehicleParams,
        vehicel_car_type_detail: "",
        ref_vehicle_status_code: "",
        is_active: "",
      });
    };

    useEffect(() => {
      const fetchData = async () => {
        const [fetchVehicleType, fetchVehicleStatus] = await Promise.all([
          getVehicleType(),
          getVehicleStatus(),
        ]);

        setVehicleType(fetchVehicleType.options);
        setVehicleStatus(fetchVehicleStatus);
      };

      fetchData();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
      <dialog ref={dialogRef} className="modal">
        <div className="modal-box max-w-[450px] p-0 relative rounded-none overflow-hidden flex flex-col max-h-[100vh] ml-auto mr-10 h-[100vh] bg-white">
          <ModalHeader onClose={() => dialogRef.current?.close()} />

          {/* Content scroll ได้ */}
          <div className="flex-1 overflow-y-auto">
            <ModalBody
              vehicleStatus={vehicleStatus}
              vehicleTypes={vehicleType}
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
