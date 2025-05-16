import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import VehicleStatus from "./status";
import { getFuelType, getVehicleDepartment, getVehicleType } from "@/services/vehicleService";
import { FuelTypeApiResponse, VehicleDepartmentApiResponse, VehicleInputParams, VehicleStatusProps, VehicleTypeApiResponse } from "@/app/types/vehicle-management/vehicle-list-type";

type Props = {
    onSubmitFilter?: (params: VehicleInputParams) => void;
};

export type FilterModalRef = {
    open: () => void;
    close: () => void;
};

const TAX_TYPE = [
    { id: "1", name: "ได้" },
    { id: "0", name: "ไม่ได้" },
];

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
                <span className="text-gray-500 text-sm">กรองข้อมูลให้แสดงเฉพาะข้อมูลที่ต้องการ</span>
            </div>
        </div>
        <button onClick={onClose}>
            <i className="material-symbols-outlined">close</i>
        </button>
    </div>
);

const ModalBody = ({
    vehicleDepartments,
    fuelTypes,
    vehicleTypes,
    setParams,
}: VehicleStatusProps) => {
    const [data, setData] = useState<VehicleInputParams>({
        fuelType: "",
        vehicleType: "",
        vehicleDepartment: "",
        taxVehicle: [] as string[],
        vehicleStatus: [],
    });

    const _handleSubmitFilter = () => {
        setParams({ ...data });
    }

    const _valueFilterTaxVehicle = (option: string) => {
        const taxVehicle = data.taxVehicle.includes(option)
            ? data.taxVehicle.filter(item => item !== option)
            : [...data.taxVehicle, option];

        setData({ ...data, taxVehicle });
    }

    const _valueFilterVehicleStatus = (status: string) => {
        const vehicleStatus = data.vehicleStatus.includes(status)
            ? data.vehicleStatus.filter(item => item !== status)
            : [...data.vehicleStatus, status];

        setData({ ...data, vehicleStatus });
    }
    

    return (
        <div className="flex flex-col p-4 overflow-y-auto">
            <div className="overflow-y-auto">
                <div className="mb-4">
                    <span>ประเภทยานพาหนะ</span>
                    <select
                        className="select bg-white select-bordered w-full mt-2"
                        value={data.vehicleType}
                        onChange={(e) => {
                            setData({ ...data, vehicleType: e.target.value });
                        }}
                    >
                        <option value="">ทั้งหมด</option>
                        {vehicleTypes.map((vt: VehicleTypeApiResponse) => (
                            <option key={vt.ref_vehicle_type_code} value={vt.ref_vehicle_type_code}>
                                {vt.ref_vehicle_type_name}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="mb-4">
                    <span>ประเภทเชื้อเพลิง</span>
                    <select
                        className="select bg-white select-bordered w-full mt-2"
                        value={data.fuelType}
                        onChange={(e) => {
                            setData({ ...data, fuelType: e.target.value });
                        }}
                    >
                        <option value="">ทั้งหมด</option>
                        {fuelTypes.map((fuelType: FuelTypeApiResponse) => (
                            <option key={fuelType.ref_fuel_type_id} value={fuelType.ref_fuel_type_id}>
                                {fuelType.ref_fuel_type_name_th}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="mb-4">
                    <span>สังกัดยานพาหนะ</span>
                    <select
                        className="select bg-white select-bordered w-full mt-2"
                        value={data.vehicleDepartment}
                        onChange={(e) => {
                            setData({ ...data, vehicleDepartment: e.target.value });
                        }}
                    >
                        <option value="">ทั้งหมด</option>
                        {vehicleDepartments.map((vd: VehicleDepartmentApiResponse) => (
                            <option key={vd.vehicle_owner_dept_sap} value={vd.vehicle_owner_dept_sap}>
                                {vd.dept_sap_full}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="mb-4">
                    <div>
                        <span className="text-base font-semibold">เครดิตภาษี</span>
                        <div>
                            {TAX_TYPE.map((option, index) => (
                                <div key={index} className="flex gap-2">
                                    <input type="checkbox" checked={data.taxVehicle.includes(option.id)} className="checkbox checkbox-primary h-5 w-5" onChange={() => {_valueFilterTaxVehicle(option.id)}}/>
                                    <span className="text-base">{option.name}</span>
                                </div>    
                            ))}
                        </div>
                    </div>
                </div>

                <div className="mb-4">
                    <span>สถานะ</span>
                    <div className="flex flex-col gap-2 mt-2">
                        {VEHICLE_STATUS.map((status, index) => (
                            <div key={index} className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    id={`status-${index}`}
                                    className="checkbox checkbox-primary h-5 w-5"
                                    checked={data.vehicleStatus.includes(status.id)}
                                    onChange={() => {_valueFilterVehicleStatus(status.id)}}
                                />
                                <VehicleStatus status={status.name} />
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="flex gap-2 mt-4 border-t border-gray-300 pt-4">
                <div className="flex items-center gap-2">
                    <button className="btn btn-ghost" onClick={() => {
                        setData({
                            fuelType: "",
                            vehicleType: "",
                            vehicleDepartment: "",
                            taxVehicle: [],
                            vehicleStatus: [],
                        });
                    }}>
                        <span className="text-base text-brand-900 font-bold">ล้างตัวกรอง</span>
                    </button>
                </div>

                <div className="flex gap-2 ml-auto">
                    <button className="btn btn-secondary" onClick={() => {
                        setParams({
                            fuelType: "",
                            vehicleType: "",
                            vehicleDepartment: "",
                            taxVehicle: [],
                            vehicleStatus: [],
                        });
                    }}>
                        ยกเลิก
                    </button>
                    <button className="btn btn-primary" onClick={() => { _handleSubmitFilter() }}>
                        ตกลง
                    </button>
                </div>
            </div>
        </div>
    );
};

const FilterModal = forwardRef<FilterModalRef, Props>(({ onSubmitFilter }, ref) => {
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
    const [vehicleDepartment, setVehicleDepartment] = useState<VehicleDepartmentApiResponse[]>([]);
    const [vehicleType, setVehicleType] = useState<VehicleTypeApiResponse[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            const [fetchFuelType, fetchVehicleDepartment, fetchVehicleType] = await Promise.all([
                getFuelType(),
                getVehicleDepartment(),
                getVehicleType()
            ]);

            setFuelType(fetchFuelType);
            setVehicleDepartment(fetchVehicleDepartment);
            setVehicleType(fetchVehicleType);
        }

        fetchData();
    }, []);

    useEffect(() => {
        if (onSubmitFilter) onSubmitFilter(params)
        dialogRef.current?.close();
    }, [params]);

    return (
        <dialog ref={dialogRef} className="modal">
            <div className="modal-box max-w-[450px] p-0 relative rounded-none overflow-hidden flex flex-col max-h-[100vh] ml-auto mr-10 h-[100vh] bg-white">
                <ModalHeader onClose={() => dialogRef.current?.close()} />
                <ModalBody
                    setParams={setParams}
                    fuelTypes={fuelType}
                    vehicleDepartments={vehicleDepartment}
                    vehicleTypes={vehicleType}
                />
            </div>
            <form method="dialog" className="modal-backdrop">
                <button>close</button>
            </form>
        </dialog>
    );
});

FilterModal.displayName = "FilterModal";
export default FilterModal;
