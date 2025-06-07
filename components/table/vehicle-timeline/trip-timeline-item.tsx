import React from "react";
import dayjs from "dayjs";

const statusColorMap = {
  "รออนุมัติ": { bg: "bg-[#FEDF89] border border-[#B54708]", text: "text-[#B54708]" },
  "ไป - กลับ": { bg: "bg-[#FED8F6] border border-[#A80689]", text: "text-[#A80689]" },
  "ค้างแรม": { bg: "bg-[#C7D7FE] border border-[#3538CD]", text: "text-[#3538CD]" },
  "เสร็จสิ้น": { bg: "bg-[#ABEFC6] border border-[#067647]", text: "text-[#067647]" },
} as const;

const TripTimelineItem = ({
  item,
  onClick,
  durationDays,
}: {
  item: any;
  onClick: () => void;
  durationDays: number;
}) => {
  const statusColors = statusColorMap[item.status as keyof typeof statusColorMap] || {};

  return (
    <button
      onClick={onClick}
      className={`${statusColors.bg} !h-auto !rounded-lg justify-start !cursor-pointer`}
      style={{ width: `${200 * durationDays}px` }}
    >
      <div className={`flex items-center gap-1 text-sm font-semibold ${statusColors.text} py-[2px] px-[4px]`}>
        <div className="flex flex-col">
          <i className="material-symbols-outlined !text-base !leading-4">directions_car</i>
          <i className="material-symbols-outlined !text-base !leading-4">person</i>
        </div>
        <div className="flex flex-col items-start">
          <span>{item.destinationPlace}</span>
          <span className="text-black font-normal">{item.startTime}</span>
        </div>
      </div>
    </button>
  );
};

export default TripTimelineItem;
