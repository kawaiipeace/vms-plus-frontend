const STATUS_COLOR_MAP: Record<string, string> = {
    'ปกติ': 'border-green-300 bg-green-100 text-green-700',
    'บำรุงรักษา': 'border-orange-300 bg-orange-100 text-orange-700',
    'ใช้ชั่วคราว': 'border-blue-300 bg-blue-100 text-blue-700',
    'ส่งซ่อม': 'border-red-300 bg-red-100 text-red-700',
    'สิ้นสุดสัญญา': 'border-gray-300 bg-gray-100',
    'ระหว่างโอน': 'border-blue-300 bg-blue-100 text-blue-700',
};

interface VehicleStatusProps {
    status: string;
}

export default function VehicleStatus({status}: Readonly<VehicleStatusProps>) {
    return (
        <span className={`w-30 text-sm text-center font-bold px-3 py-1 rounded-full border ${STATUS_COLOR_MAP[status]}`}>
            {status}
        </span>
    );
}