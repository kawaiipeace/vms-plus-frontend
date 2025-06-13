import { STATUS_CLASS_MAP } from "@/utils/vehicle-management";
import clsx from "clsx";

interface VehicleStatusProps {
    status: string;
}

export default function VehicleStatus({ status }: Readonly<VehicleStatusProps>) {
    const className = STATUS_CLASS_MAP[status];

    return (
        <div
            className={clsx(
                "flex border rounded-full items-center gap-2 text-center w-fit",
                "px-3 py-1",
                "text-sm font-bold",
                className
            )}
        >
            <span>{status}</span>
        </div>
    );
}