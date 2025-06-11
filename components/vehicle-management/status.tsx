import { STATUS_CLASS_MAP } from "@/utils/vehicle-management";
import clsx from "clsx";

interface VehicleStatusProps {
    status: string;
    icon?: boolean;
}

export default function VehicleStatus({ status, icon }: Readonly<VehicleStatusProps>) {
    const className = STATUS_CLASS_MAP[status];

    return (
        <div
            className={clsx(
                "inline-flex items-center gap-2",
                "px-3 py-1 text-sm font-bold text-center",
                "border rounded-full",
                className
            )}
        >
            {icon && (
                <i
                    className={`
              material-symbols-outlined text-base leading-none
              ${icon ? 'visible' : 'invisible'}
            `}
                >
                    check
                </i>
            )}
            <span>{status}</span>
        </div>
    );
}