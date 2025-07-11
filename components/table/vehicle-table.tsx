import { createColumnHelper, getCoreRowModel, getSortedRowModel, SortingState, useReactTable } from "@tanstack/react-table";
import { useEffect, useMemo, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { DataTable } from "./dataTable";
import VehicleTaxCredit from "../vehicle-management/taxCredit.tsx";
import { updateVehicleStatus } from "@/services/vehicleService";
import { VehicleManagementApiResponse } from "@/app/types/vehicle-management/vehicle-list-type";
import VehicleStatus from "../vehicle-management/vehicle-status-without-icon";

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
    const [sorting, setSorting] = useState<SortingState>([]);

    useEffect(() => {
        setReqData(data);
    }, [data]);

    const selectedRows = watch('selectedRows');
    useEffect(() => {
        const currentSelected = Object.entries(selectedRows)
            .filter(([_, v]) => v)
            .map(([id]) => id);

        useModal(currentSelected);
    }, [selectedRows]);

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
            className={`w-12 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors ${isActive === "1" ? "bg-[#A80689]" : "bg-gray-300"
                }`}
        >
            <div
                className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${isActive === "1" ? "translate-x-6" : "translate-x-0"
                    }`}
            />
        </div>
    );

    const HeaderCheckbox = ({ data, selectedRows, setValue, useModal }: any) => {
        const headerCheckboxRef = useRef<HTMLInputElement>(null);
        const allSelected =
            data.length > 0 &&
            data.every((vehicle: any) => selectedRows?.[vehicle.mas_vehicle_uid]);

        const partiallySelected =
            data.some((v: any) => selectedRows?.[v.mas_vehicle_uid]) && !allSelected;

        useEffect(() => {
            if (headerCheckboxRef.current) {
                headerCheckboxRef.current.indeterminate = partiallySelected;
            }
        }, [partiallySelected, selectedRows]);

        const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            const checked = e.target.checked;
            const newSelected: Record<string, boolean> = {};

            data.forEach((vehicle: any) => {
                newSelected[vehicle.mas_vehicle_uid] = checked;
            });

            setValue('selectedRows', newSelected);
        };

        return (
            <input
                ref={headerCheckboxRef}
                type="checkbox"
                className="checkbox [--chkbg:#A80689] checkbox-sm rounded-md"
                checked={allSelected}
                onChange={handleChange}
            />
        );
    };

    // Memoized columns to avoid unnecessary re-rendering
    const columns = useMemo(() => [
        columnHelper.display({
            id: 'select',
            header: () => (
                <HeaderCheckbox
                    data={data}
                    selectedRows={watch('selectedRows')}
                    setValue={setValue}
                    useModal={useModal}
                />
            ),
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

                                setValue('selectedRows', {
                                    ...watch('selectedRows'),
                                    [row.original.mas_vehicle_uid]: e.target.checked,
                                });
                            }}
                        />
                    )}
                />
            )
        }),
        columnHelper.accessor('vehicle_license_plate', {
            header: 'เลขทะเบียน / ยี่ห้อ / รุ่น',
            enableSorting: true,
            sortingFn: (rowA, rowB) => {
                const a = rowA.original.vehicle_license_plate || '';
                const b = rowB.original.vehicle_license_plate || '';
                return a.localeCompare(b, 'th', { numeric: true });
            },
            cell: info => {
                const row = info.row.original;

                return (
                    <div className="flex flex-col text-left">
                        <span className="text-base">{row.vehicle_license_plate} {row.vehicle_license_plate_province_short}</span>
                        <span className="text-color-secondary">{`${row.vehicle_brand_name} / ${row.vehicle_model_name}`}</span>
                    </div>
                );
            },
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
        columnHelper.accessor((row) => ({
            department: row.vehicle_owner_dept_short,
            carpoolName: row.vehicle_carpool_name,
        }), {
            header: 'สังกัดยานพาหนะ',
            cell: info => {
                const { department, carpoolName } = info.getValue();
                return (
                    <div className="flex flex-col text-left">
                        <span className="truncate">{department}</span>
                        <span className="text-gray-500">{carpoolName}</span>
                    </div>
                );
            },
            enableSorting: false,
        }),
        columnHelper.accessor('fleet_card_no', {
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
            cell: info => info.getValue().toLocaleString(),
            enableSorting: true,
        }),
        columnHelper.accessor('age', {
            header: 'อายุการใช้งาน',
            cell: info => info.getValue(),
            enableSorting: true,
        }),
        columnHelper.accessor('vms_ref_vehicle_status.ref_vehicle_status_name', {
            header: 'สถานะ',
            cell: info => <div><VehicleStatus status={info.getValue()} /></div>,
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
                <button
                    data-tip="ดูรายละเอียด"
                    disabled={true}
                    className="tooltip disabled:cursor-not-allowed disabled:text-gray-300"
                    aria-label="ดูรายละเอียด"
                >
                    <i className="material-symbols-outlined text-lg">
                        quick_reference_all
                    </i>
                </button>
            )
        })
    ], [reqData]);

    // Initialize the table with data and columns
    const table = useReactTable({
        data: reqData,
        columns,
        state: { sorting },
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        onSortingChange: setSorting,
    });

    return (
        <form>
            <div className="w-full py-4 pt-0">
                <DataTable table={table} />
            </div>
        </form>
    );
}
