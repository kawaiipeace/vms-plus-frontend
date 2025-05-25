import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import BadgeStatus from "./status";
import { getDriverStatus } from "@/services/carpoolManagement";

type Props = {
  flag: string;
  onSubmitFilter?: (params: any) => void;
};

export type DriverFilterModalRef = {
  open: () => void;
  close: () => void;
};

interface ModalBodyProps {
  driverStatus: DriverStatus[];
  setParams: (params: DriverParams) => void;
  params: DriverParams;
}

interface DriverParams {
  ref_driver_status_code: string[];
  is_active: string[];
  work_type: string[];
}

interface DriverStatus {
  ref_driver_status_code: number;
  ref_driver_status_desc: string;
}

// const DRIVER_STATUS = [
//   { id: "0", name: "ปฏิบัติงานปกติ" },
//   { id: "1", name: "ลาป่วย/ลากิจ" },
//   { id: "2", name: "ทดแทน" },
//   { id: "3", name: "สำรอง" },
//   { id: "4", name: "สิ้นสุดสัญญา" },
//   { id: "5", name: "ลาออก" },
//   { id: "6", name: "ให้ออก" },
// ];

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

const ModalBody = ({ driverStatus, setParams, params }: ModalBodyProps) => {
  const onStatusChecked = (checked: boolean, id: string) => {
    const newParams = { ...params };
    if (checked) {
      newParams.ref_driver_status_code.push(id);
    } else {
      newParams.ref_driver_status_code =
        newParams.ref_driver_status_code.filter((e) => e !== id);
    }
    setParams(newParams);
  };

  const onActiveChecked = (checked: boolean, id: string) => {
    const newParams = { ...params };
    if (checked) {
      newParams.is_active.push(id);
    } else {
      newParams.is_active = newParams.is_active.filter((e) => e !== id);
    }
    setParams(newParams);
  };

  const onTypeChecked = (checked: boolean, id: string) => {
    const newParams = { ...params };
    if (checked) {
      newParams.work_type.push(id);
    } else {
      newParams.work_type = newParams.work_type.filter((e) => e !== id);
    }
    setParams(newParams);
  };

  return (
    <div className="flex flex-col">
      <div className="overflow-y-auto p-4">
        <div className="mb-4">
          <label className="form-label">สถานะ</label>
          <div className="flex flex-col gap-2 mt-2">
            {driverStatus.map((status, index) => (
              <div className="form-group" key={index}>
                <div className="custom-group">
                  <div className="custom-control custom-checkbox custom-control-inline">
                    <input
                      type="checkbox"
                      defaultChecked
                      checked={params.ref_driver_status_code.includes(
                        status.ref_driver_status_code.toString()
                      )}
                      onChange={(e) =>
                        onStatusChecked(
                          e.target.checked,
                          status.ref_driver_status_code.toString()
                        )
                      }
                      className="checkbox [--chkbg:#A80689] checkbox-sm rounded-md"
                    />
                    <label className="custom-control-label">
                      <div className="custom-control-label-group">
                        <BadgeStatus status={status.ref_driver_status_desc} />
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
            {DRIVER_ACTIVE.map((active) => (
              <div
                className="custom-control custom-checkbox custom-control-inline"
                key={active.id}
              >
                <input
                  type="checkbox"
                  defaultChecked
                  checked={params.is_active.includes(active.id)}
                  onChange={(e) => onActiveChecked(e.target.checked, active.id)}
                  className="checkbox [--chkbg:#A80689] checkbox-sm rounded-md"
                />
                <label className="custom-control-label">{active.name}</label>
              </div>
            ))}
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">ประเภทค้างคืน</label>
          <div className="custom-group flex-col !gap-0">
            {DRIVER_TYPE.map((type) => (
              <div
                className="custom-control custom-checkbox custom-control-inline"
                key={type.id}
              >
                <input
                  type="checkbox"
                  defaultChecked
                  checked={params.work_type.includes(type.id)}
                  onChange={(e) => onTypeChecked(e.target.checked, type.id)}
                  className="checkbox [--chkbg:#A80689] checkbox-sm rounded-md"
                />
                <label className="custom-control-label">{type.name}</label>
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

const DriverFilterModal = forwardRef<DriverFilterModalRef, Props>(
  ({ onSubmitFilter }, ref) => {
    const dialogRef = useRef<HTMLDialogElement>(null);

    useImperativeHandle(ref, () => ({
      open: () => dialogRef.current?.showModal(),
      close: () => dialogRef.current?.close(),
    }));

    const [driverStatus, setDriverStatus] = useState<DriverStatus[]>([]);

    const [params, setParams] = useState<DriverParams>({
      ref_driver_status_code: [],
      is_active: DRIVER_ACTIVE.map((e) => e.id),
      work_type: DRIVER_TYPE.map((e) => e.id),
    });

    const handleSubmitFilter = () => {
      onSubmitFilter?.({
        ...params,
        work_type: params.work_type.join(","),
        is_active: params.is_active.join(","),
        ref_driver_status_code: params.ref_driver_status_code.join(","),
      });
      dialogRef.current?.close();
    };

    const handleClearFilter = () => {
      setParams({
        ref_driver_status_code: driverStatus.map((e) =>
          e.ref_driver_status_code.toString()
        ),
        is_active: DRIVER_ACTIVE.map((e) => e.id),
        work_type: DRIVER_TYPE.map((e) => e.id),
      });
    };

    useEffect(() => {
      const fetchData = async () => {
        const [fetchDriverStatus] = await Promise.all([getDriverStatus()]);

        setDriverStatus(fetchDriverStatus);
        setParams({
          ...params,
          ref_driver_status_code: fetchDriverStatus.map((e: any) =>
            e.ref_driver_status_code.toString()
          ),
        });
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
              setParams={setParams}
              params={params}
              driverStatus={driverStatus}
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
