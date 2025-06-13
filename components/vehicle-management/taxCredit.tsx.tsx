interface VehicleTaxCreditProps {
    status: boolean;
}

export default function VehicleTaxCredit({ status }: VehicleTaxCreditProps) {
    const baseClasses = "inline-flex items-center justify-center w-8 h-8 rounded-full border";
    const statusClasses = status
        ? "border-green-300 bg-green-100 text-green-700"
        : "border-red-300 bg-red-100 text-red-700";
    const icon = status ? "Check" : "Close";

    return (
        <span className={`${baseClasses} ${statusClasses}`}>
            <i className="material-symbols-outlined">{icon}</i>
        </span>
    );
}