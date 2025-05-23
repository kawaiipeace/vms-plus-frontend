import { createColumnHelper, getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { useEffect, useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { DataTable } from "./dataTable";
import VehicleTaxCredit from "../vehicle/taxCredit.tsx";
import VehicleStatus from "../vehicle/status";
import { updateVehicleStatus } from "@/services/vehicleService";
import { VehicleManagementApiResponse } from "@/app/types/vehicle-management/vehicle-list-type";

type FormValues = {
    selectedRows: Record<string, boolean>;
};

interface VehicleTableProps {
    readonly data: VehicleManagementApiResponse[];
    useModal: (ids: string[]) => void;
};

export default function VehicleTable({ data, useModal }: VehicleTableProps) {
    const { control, reset, watch, setValue } = useForm<FormValues>({
        defaultValues: {
            selectedRows: {},
        },
    });

    const columnHelper = createColumnHelper<VehicleManagementApiResponse>();

    // State to hold the data
    const [reqData, setReqData] = useState<VehicleManagementApiResponse[]>(data);

    useEffect(() => {
        setReqData(data);
    }, [data]);

    // Handle toggle action for 'is_active' value
    const handleToggle = async (id: string, isActive: string) => {
        const newValue = isActive === "1" ? "0" : "1";
        await updateVehicleStatus({ mas_vehicle_uid: id, is_active: newValue });

        setReqData((prev: VehicleManagementApiResponse[]) =>
            prev.map((row: VehicleManagementApiResponse) =>
                row.mas_vehicle_uid === id ? { ...row, is_active: newValue } : row
            )
        );
    };

    // Toggle switch component to change is_active value
    const ToggleSwitch = ({ id, isActive }: { id: string; isActive: string }) => (
        <div
            onClick={() => handleToggle(id, isActive)}
            className={`w-12 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors ${
                isActive === "1" ? "bg-[#A80689]" : "bg-gray-300"
            }`}
        >
            <div
                className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                    isActive === "1" ? "translate-x-6" : "translate-x-0"
                }`}
            />
        </div>
    );

    // Memoized columns to avoid unnecessary re-rendering
    const columns = useMemo(() => [
        columnHelper.display({
            id: 'select',
            header: () => {
                const allSelected = Object.keys(watch('selectedRows')).length > 0 &&
                    data.every(vehicle => watch(`selectedRows.${vehicle.mas_vehicle_uid}`));

                return (
                    <input
                        type="checkbox"
                        className="checkbox [--chkbg:#A80689] checkbox-sm rounded-md"
                        checked={allSelected}
                        onChange={(e) => {
                            const checked = e.target.checked;
                            const newSelected: Record<string, boolean> = {};

                            data.forEach(vehicle => {
                                newSelected[vehicle.mas_vehicle_uid] = checked;
                            });

                            setValue('selectedRows', newSelected);

                            const currentSelected = Object.entries(newSelected)
                                .filter(([_, v]) => v)
                                .map(([id]) => id);

                            useModal(currentSelected);
                        }}
                    />
                );
            },
            cell: ({ row }) => (
                <Controller
                    name={`selectedRows.${row.original.mas_vehicle_uid}`}
                    control={control}
                    render={({ field }) => (
                        <input
                            type="checkbox"
                            className="checkbox [--chkbg:#A80689] checkbox-sm rounded-md"
                            checked={field.value || false}
                            onChange={(e) => {
                                field.onChange(e);
                                const selectedIds = Object.entries(watch('selectedRows'))
                                    .filter(([_, checked]) => checked)
                                    .map(([id]) => id);
                                useModal(selectedIds);
                            }}
                        />
                    )}
                />
            )
        }),
        columnHelper.accessor(row => ({
            license: row.vehicle_license_plate,
            brand: row.vehicle_brand_name,
            model: row.vehicle_model_name,
        }), {
            header: 'เลขทะเบียน / ยี่ห้อ / รุ่น',
            cell: info => (
                <div className="text-left">
                    <div className="flex flex-col">
                        <div className="text-base">{info.getValue().license}</div>
                        <div className="text-sm text-gray-500">{`${info.getValue().brand} / ${info.getValue().model}`}</div>
                    </div>
                </div>
            ),
            enableSorting: true,
        }),
        columnHelper.accessor('ref_vehicle_type_name', {
            header: 'ประเภทยานพาหนะ',
            cell: info => info.getValue(),
            enableSorting: false,
        }),
        columnHelper.accessor('vms_ref_fuel_type.ref_fuel_type_name_th', {
            header: 'ประเภทเชื้อเพลิง',
            cell: info => info.getValue(),
            enableSorting: false,
        }),
        columnHelper.accessor('vehicle_owner_dept_short', {
            header: 'สังกัดยานพาหนะ',
            cell: info => info.getValue(),
            enableSorting: false,
        }),
        columnHelper.accessor('mas_vehicle_uid', {
            header: 'หมายเลขบัตรเติมน้ำมัน / RFID',
            cell: info => info.getValue(),
            enableSorting: false,
        }),
        columnHelper.accessor('is_tax_credit', {
            header: 'เครดิตภาษี',
            cell: info => <VehicleTaxCredit status={info.getValue()} />,
            enableSorting: false,
        }),
        columnHelper.accessor('vehicle_mileage', {
            header: 'เลขไมล์ล่าสุด',
            cell: info => info.getValue(),
            enableSorting: true,
        }),
        columnHelper.accessor('vehicle_get_date', {
            header: 'อายุการใช้งาน',
            cell: info => info.getValue(),
            enableSorting: true,
        }),
        columnHelper.accessor('vms_ref_vehicle_status.ref_vehicle_status_name', {
            header: 'สถานะ',
            cell: info => <div className="whitespace-nowrap"><VehicleStatus status={info.getValue()} /></div>,
            enableSorting: false,
        }),
        columnHelper.accessor(row => ({
            id: row.mas_vehicle_uid,
            isActive: row.is_active,
        }), {
            header: 'เปิด/ปิดใช้งาน',
            cell: info => <ToggleSwitch id={info.getValue().id} isActive={info.getValue().isActive} />,
        }),
        columnHelper.display({
            id: 'action',
            cell: () => (
                <>
                    <button data-tip="ดูรายละเอียด" className="tooltip">
                        <i className="material-symbols-outlined text-lg cursor-pointer text-gray-600">quick_reference_all</i>
                    </button>
                </>
            )
        })
    ], [reqData]);

    // Initialize the table with data and columns
    const table = useReactTable({
        data: reqData,
        columns,
        getCoreRowModel: getCoreRowModel(),
    });

    return (
        <form>
            <div className="w-full py-4 pt-0">
                <DataTable table={table} />
            </div>
        </form>
    );
}
