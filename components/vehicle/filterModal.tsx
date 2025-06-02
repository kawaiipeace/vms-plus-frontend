import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import VehicleStatus from "./status";
import { getFuelType, getVehicleDepartment, getVehicleType } from "@/services/vehicleService";
import { 
    CustomData, 
    FuelTypeApiCustomData, 
    FuelTypeApiResponse, 
    VehicleDepartmentApiResponse, 
    VehicleDepartmentCustomData, 
    VehicleInputParams, 
    VehicleStatusProps, 
    VehicleTypeApiCustomData, 
    VehicleTypeApiResponse } from "@/app/types/vehicle-management/vehicle-list-type";
// import CustomSelect from "../customSelect";
import CustomSelectOnSearch from "../customSelectOnSearch";

type FilterProps = {
    flag: string;
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
    <div className="modal-header bg-white sticky top-0 flex justify-between z-10">
        <div className="modal-header-group flex gap-4 items-center">
            <div className="featured-ico featured-ico-gray">
                <i className="material-symbols-outlined icon-settings-400-24">filter_list</i>
            </div>
            <div className="modal-header-content">
                <div className="modal-header-top">
                    <div className="modal-title">ตัวกรอง</div>
                </div>
                <div className="modal-header-bottom">
                    <div className="modal-subtitle">กรองข้อมูลให้แสดงเฉพาะข้อมูลที่ต้องการ</div>
                </div>
            </div>
        </div>

        <button
            className="close btn btn-icon border-none bg-transparent shadow-none btn-tertiary"
            onClick={onClose}>
            <i className="material-symbols-outlined">close</i>
        </button>
    </div>
);

const ModalBody = ({
    vehicleDepartments,
    fuelTypes,
    vehicleTypes,
    flag,
    setParams,
    params
}: VehicleStatusProps) => {
    const [formData, setFormData] = useState<VehicleInputParams>(params);
    const [vehicleTypeOptions, setVehicleTypeOptions] = useState<CustomData>({ label: "ทั้งหมด", value: "" });
    const [vehicleDepartmentOptions, setVehicleDepartmentOptions] = useState<CustomData>({ label: "ทั้งหมด", value: "" });
    const [fuelTypeOptions, setFuelTypeOptions] = useState<CustomData>({ label: "ทั้งหมด", value: "" });

    useEffect(() => {
        setFormData(params);
    
        const isAllEmpty =
            params.vehicleType === '' &&
            params.fuelType === '' &&
            params.vehicleDepartment === '';
    
        if (isAllEmpty) {
            const defaultOption = { label: "ทั้งหมด", value: "" };
    
            setVehicleTypeOptions(defaultOption);
            setFuelTypeOptions(defaultOption);
            setVehicleDepartmentOptions(defaultOption);
        }
    }, [params]);    

    useEffect(() => {
        setParams(formData);
    }, [formData]);

    const handleCheckboxToggle = (key: keyof VehicleInputParams, value: string) => {
        setFormData(prev => {
            const current = prev[key] as string[];
            return {
                ...prev,
                [key]: current.includes(value) ? current.filter(v => v !== value) : [...current, value],
            };
        });
    };

    const handleChange = (key: keyof VehicleInputParams, value: any) => {
        setFormData(prev => ({ ...prev, [key]: value }));
    };

    return (
        <div className="modal-body flex flex-col gap-4 h-[70vh] max-h-[70vh]">
            <div className="grid grid-cols-12 gap-4">
                <div className="col-span-12">
                    <div className="form-group">
                        <label className="form-label">ประเภทยานพาหนะ</label>
                        <CustomSelectOnSearch
                            w="md:w-full"
                            options={vehicleTypes}
                            value={vehicleTypeOptions}
                            enableSearchOnApi={true}
                            onChange={(selectedValue: CustomData) => {
                                if(selectedValue.label === "") {
                                    selectedValue = { label: "ทั้งหมด", value: "" };
                                }

                                handleChange("vehicleType", selectedValue.value);
                                setVehicleTypeOptions(selectedValue);
                            }}
                        />
                    </div>
                </div>

                {flag == 'TABLE_LIST' && (
                    <div className="col-span-12">
                        <div className="form-group">
                            <span className="form-label">ประเภทเชื้อเพลิง</span>
                            <CustomSelectOnSearch
                                w="md:w-full"
                                options={fuelTypes}
                                value={fuelTypeOptions}
                                enableSearchOnApi={true}
                                onChange={(selectedValue) => {
                                    if(selectedValue.label === "") {
                                        selectedValue = { label: "ทั้งหมด", value: "" };
                                    }

                                    handleChange("fuelType", selectedValue.value);
                                    setFuelTypeOptions(selectedValue);
                                }}
                            />
                        </div>
                    </div>
                )}

                <div className="col-span-12">
                    <div className="form-group">
                        <span className="form-label">สังกัดยานพาหนะ</span>
                        <CustomSelectOnSearch
                            w="md:w-full"
                            options={vehicleDepartments}
                            value={vehicleDepartmentOptions}
                            enableSearchOnApi={true}
                            onChange={(selectedValue) => {
                                if(selectedValue.label === "") {
                                    selectedValue = { label: "ทั้งหมด", value: "" };
                                }

                                handleChange("vehicleDepartment", selectedValue.value);
                                setVehicleDepartmentOptions(selectedValue);
                            }}
                        />
                    </div>
                </div>

                {flag == 'TABLE_LIST' && (
                    <>
                        <div className="col-span-12">
                            <div className="form-group">
                                <span className="form-label">เครดิตภาษี</span>
                                <div>
                                    {TAX_TYPE.map((option, index) => (
                                        <div key={index} className="flex gap-2">
                                            <label htmlFor={`option-${index}`} className="flex items-center gap-2 cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    id={`option-${index}`}
                                                    checked={formData.taxVehicle.includes(option.id)}
                                                    className="checkbox checkbox-primary h-5 w-5"
                                                    onChange={() => handleCheckboxToggle('taxVehicle', option.id)}
                                                />
                                                <span className="text-base">{option.name}</span>
                                            </label>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="col-span-12">
                            <div className="form-group">
                                <span>สถานะ</span>
                                <div className="flex flex-col gap-2 mt-2">
                                    {VEHICLE_STATUS.map((status, index) => (
                                        <div key={index} className="flex items-center gap-2">
                                            <label htmlFor={`status-${index}`} className="flex items-center gap-2 cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    id={`status-${index}`}
                                                    className="checkbox checkbox-primary h-5 w-5"
                                                    checked={formData.vehicleStatus.includes(status.id)}
                                                    onChange={() => handleCheckboxToggle('vehicleStatus', status.id)}
                                                />
                                                <VehicleStatus status={status.name} />
                                            </label>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

const ModalFooter = (
    {
        onClick,
        onSubmit
    }: {
        onClick: () => void;
        onSubmit: () => void;
    }) => {

    return (
        <>
            <div className="left">
                <button
                    type="button"
                    className="btn btn-tertiary btn-resetfilter block mr-auto bg-transparent shadow-none border-none"
                    onClick={onClick}>
                    <span className="text-base text-brand-900 font-bold">ล้างตัวกรอง</span>
                </button>
            </div>

            <div className="flex gap-3 items-center">
                <button className="btn btn-secondary" onClick={onClick}>
                    ยกเลิก
                </button>
                <button
                    type="button"
                    className="btn btn-primary"
                    onClick={onSubmit}>
                    ตกลง
                </button>
            </div>
        </>
    );
};

const FilterModal = forwardRef<FilterModalRef, FilterProps>(({ onSubmitFilter, flag }, ref) => {
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
    const [fuelType, setFuelType] = useState<FuelTypeApiCustomData[]>([]);
    const [vehicleDepartment, setVehicleDepartment] = useState<VehicleDepartmentCustomData[]>([]);
    const [vehicleType, setVehicleType] = useState<VehicleTypeApiCustomData[]>([]);

    const handleSubmitFilter = () => {
        console.log("submit filter", params);
        onSubmitFilter?.(params);
        dialogRef.current?.close();
    };

    const handleClearFilter = () => {
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
            const [fetchFuelType, fetchVehicleDepartment, fetchVehicleType] = await Promise.all([
                getFuelType(),
                getVehicleDepartment(),
                getVehicleType()
            ]);

            setVehicleType(fetchVehicleType.options);
            setFuelType(fetchFuelType.options);
            setVehicleDepartment(fetchVehicleDepartment.options);
        }

        fetchData();
    }, []);

    return (
        <dialog ref={dialogRef} className="modal">
            <div className="modal-box max-w-[450px] p-0 relative rounded-none overflow-hidden flex flex-col max-h-[100vh] ml-auto mr-10 h-[100vh] bg-white">
                <ModalHeader onClose={() => dialogRef.current?.close()} />

                {/* Content scroll ได้ */}
                <div className="modal-scroll-wrapper overflow-y-auto">
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
                <div className="modal-action absolute bottom-0 gap-3 mt-0 w-full flex justify-between">
                    <ModalFooter onClick={handleClearFilter} onSubmit={handleSubmitFilter} />
                </div>
            </div>

            <form method="dialog" className="modal-backdrop">
                <button>close</button>
            </form>
        </dialog>
    );
});

FilterModal.displayName = "FilterModal";
export default FilterModal;
