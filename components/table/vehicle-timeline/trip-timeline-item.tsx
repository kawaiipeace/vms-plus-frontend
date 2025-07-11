import { STATUS_DETAIL_MAP } from "@/utils/vehicle-management";
import dayjs from "dayjs";
import React from "react";

const TripTimelineItem = ({
  item,
  startDate,
  endDate,
  timelineStartDate,
  timelineEndDate,
  onClick,
}: {
  item: any;
  startDate: Date;
  endDate: Date;
  timelineStartDate: string;
  timelineEndDate: string;
  onClick: () => void;
}) => {
  const statusColors = STATUS_DETAIL_MAP[item.status];

  const daysBetween = (a: dayjs.ConfigType, b: dayjs.ConfigType) => {
    return dayjs(b).diff(dayjs(a), "day") + 1;
  };

  const actualDuration = Math.min(
    daysBetween(dayjs(startDate).format('YYYY-MM-DD'), dayjs(endDate).format('YYYY-MM-DD')),
    daysBetween(dayjs(startDate).format('YYYY-MM-DD'), dayjs(timelineEndDate).format('YYYY-MM-DD'))
  );

  const boxWidth = actualDuration * 150;

  return (
    <button
      onClick={onClick}
      className="border top-0 left-0 rounded-lg justify-start cursor-pointer"
      style={{
        width: boxWidth,
        backgroundColor: statusColors?.bg,
        borderColor: statusColors?.border,
      }}
    >
      <div
        className="flex items-center gap-1 text-sm font-semibold py-[2px] px-[4px]"
        style={{ color: statusColors?.text }}
      >
        <div className="flex flex-col">
          <i className="material-symbols-outlined text-base leading-4">directions_car</i>
          <i className="material-symbols-outlined text-base leading-4">person</i>
        </div>

        <div className="flex flex-col items-start overflow-hidden w-full">
          <span className="truncate w-full text-start">{item.destinationPlace}</span>
          <span className="text-black font-normal">{item.startTime}</span>
        </div>
      </div>
    </button>
  );
};

export default TripTimelineItem;
