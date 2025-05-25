const STATUS_COLOR: Record<string, string> = {
  green: "border-green-300 bg-green-100 text-green-700",
  orange: "border-orange-300 bg-orange-100 text-orange-700",
  blue: "border-blue-300 bg-blue-100 text-blue-700",
  red: "border-red-300 bg-red-100 text-red-700",
  gray: "border-gray-300 bg-gray-100",
};

const STATUS_COLOR_GROUPS: Record<string, string[]> = {
  green: ["ปกติ", "เสร็จสิ้น", "ปฏิบัติงานปกติ"],
  orange: ["บำรุงรักษา", "รออนุมัติ", "ลาป่วย/ลากิจ"],
  blue: ["ใช้ชั่วคราว", "ระหว่างโอน", "ค้างแรม", "ทดแทน"],
  red: ["ส่งซ่อม", "ไป - กลับ", "สำรอง", "ให้ออก"],
  gray: ["สิ้นสุดสัญญา", "ลาออก"],
};

const STATUS_COLOR_MAP = new Map<string, string>(
  Object.entries(STATUS_COLOR_GROUPS).flatMap(([color, statuses]) =>
    statuses.map((status) => [status, STATUS_COLOR[color]])
  )
);

interface BadgeStatusProps {
  status: string;
}

export default function BadgeStatus({ status }: Readonly<BadgeStatusProps>) {
  const className = STATUS_COLOR_MAP.get(status) || STATUS_COLOR["gray"];

  return (
    <span
      className={`w-30 text-sm text-center font-bold px-3 py-1 rounded-full border ${className}`}
    >
      {status}
    </span>
  );
}
