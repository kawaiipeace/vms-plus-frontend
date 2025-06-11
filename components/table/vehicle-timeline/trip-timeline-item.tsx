import { STATUS_DETAIL_MAP } from "@/utils/vehicle-management";
import React from "react";

const TripTimelineItem = ({
  item,
  onClick,  
  durationDays,
}: {
  item: any;
  onClick: () => void;
  durationDays: number;
}) => {
  const statusColors = STATUS_DETAIL_MAP[item.status];

  return (
    <button
      onClick={onClick}
      className={`bg-[${statusColors.bg}] border border-[${statusColors.border}] top-0 left-0 !rounded-lg justify-start !cursor-pointer`}
      style={{ width: `${200 * durationDays}px` }}
    >
      <div className={`flex items-center gap-1 text-sm font-semibold text-[${statusColors.text}] py-[2px] px-[4px]`}>
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
