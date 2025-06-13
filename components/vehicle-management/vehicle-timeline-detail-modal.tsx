import Image from "next/image";
import { forwardRef, useImperativeHandle, useRef } from "react";
import { convertDateToLongTH, DateLongTH, imgPath } from "@/utils/vehicle-management";
import dayjs from "dayjs";
import 'dayjs/locale/th';
import { TripStatus, vehicleImgPath } from "@/utils/vehicle-constant";

export type VehicleTimelineRef = {
  open: () => void;
  close: () => void;
};

interface VehicleTimeLineDetailModalProps {
  detailRequest: any[];
  currentDate: string;
}

const VehicleTimeLineDetailModal = forwardRef<
  VehicleTimelineRef,
  VehicleTimeLineDetailModalProps
>(({ detailRequest, currentDate }, ref) => {
  const detailRef = useRef<HTMLDialogElement>(null);

  useImperativeHandle(ref, () => ({
    open: () => detailRef.current?.showModal(),
    close: () => detailRef.current?.close(),
  }));

  const labelCurrentDate = currentDate
    ? `${dayjs(currentDate).locale('th').format('D MMMM')} ${dayjs(currentDate).year() + 543}`
    : "";

  const isSingleBox = detailRequest.length === 1;
  let dateRange = null;

  if (isSingleBox) {
    const startDate = dayjs(detailRequest[0].startDate);
    const endDate = dayjs(detailRequest[0].endDate);

    const sameMonth = startDate.month() === endDate.month();
    const sameYear = startDate.year() === endDate.year();
    const sameDay = startDate.date() === endDate.date();

    if(sameDay) {
      const year = startDate.year() + 543;
      dateRange = `${startDate.locale('th').format('D MMMM')} ${year}`;
    } else if(sameMonth) {
      const year = startDate.year() + 543;
      dateRange = `${startDate.locale('th').format('D')} - ${endDate.locale('th').format('D MMMM')} ${year}`;
    } else if(sameYear) {
      const year = startDate.year() + 543;
      dateRange = `${startDate.locale('th').format('D MMM')} - ${endDate.locale('th').format('D MMM')} ${year}`;
    } else {
      const yearStart = startDate.year() + 543;
      const yearEnd = endDate.year() + 543;
      dateRange = `${startDate.locale('th').format('D MMM')} ${yearStart} - ${endDate.locale('th').format('D MMM')} ${yearEnd}`;
    }
  }

  return (
    <dialog ref={detailRef} className="modal">
      <div className="modal-box flex flex-col bg-white rounded-lg w-full max-w-[90vw] sm:max-w-[650px] max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex justify-between w-full px-4 pt-4">
          <span className="text-xl font-bold">{dateRange ?? labelCurrentDate}</span>
        </div>

        {/* Scrollable content */}
        <div className="flex flex-col gap-4 mt-5 px-4 overflow-y-auto w-full" style={{ maxHeight: "60vh" }}>
          {detailRequest.map((item, index) => (
            <CardBox key={index} data={item} />
          ))}
        </div>

        {/* Footer */}
        <div className="flex justify-end px-4 w-full">
          <button
            className="btn btn-outline border border-gray-300 mt-4 sm:w-auto px-6 min-w-[100px] text-base font-semibold"
            onClick={() => detailRef.current?.close()}
          >
            ปิด
          </button>
        </div>
      </div>

      <form method="dialog" className="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>
  );
});

VehicleTimeLineDetailModal.displayName = "VehicleTimeLineDetailModal";
export default VehicleTimeLineDetailModal;

const CardBox = ({ data }: { data: any }) => {
  const {
    status,
    schedule_title,
    workplace,
    startDate,
    endDate,
    startTime,
    endTime,
    duration,
    driverDetail,
    carUserDetail,
  } = data;

  return (
    <div className="card border border-gray-300 rounded-xl p-6 bg-white shadow-sm w-full max-w-xl">
      <div className="grid grid-cols-[auto_1fr] gap-4">
        {/* Image Section */}
        <div className="flex items-start justify-center">
          <Image
            src={vehicleImgPath[status as TripStatus]}
            width={150}
            height={150}
            alt="check_car_complete"
            className="object-contain"
          />
        </div>

        {/* Content Section */}
        <div className="grid grid-cols-1">
          <div className="flex flex-col gap-2 text-base">
            <div className="flex justify-between">
              <span className="text-xl font-bold">{status}</span>
              <i
                className="material-symbols-outlined text-xl text-gray-600 cursor-pointer"
                onClick={() => { }}
              >
                chevron_right
              </i>
            </div>
            <span className="text-base font-semibold text-gray-600">{workplace}</span>
            <span className="font-medium text-gray-700">{schedule_title}</span>
            <span className="text-gray-500">
              {convertDateToLongTH(dayjs(startDate).toDate(), 'DD/MM/YYYY')}
              {parseInt(duration) > 1 ? ` - ${convertDateToLongTH(dayjs(endDate).toDate(), 'DD/MM/YYYY')}` : ""} {startTime} - {endTime} | {status}
            </span>
          </div>

          <div className="grid grid-cols-2 text-base text-gray-500">
            <div className="flex items-center gap-1">
              <i className="material-symbols-outlined text-base text-gray-600">
                directions_car
              </i>
              <span>{driverDetail.licensePlate} {driverDetail.licensePlateProvinceShort}</span>
            </div>
            <div className="flex items-center gap-1">
              <i className="material-symbols-outlined text-base text-gray-600">
                person
              </i>
              <span className="text-sm">{`${driverDetail.driverName} (ชาย)`}</span>
            </div>
          </div>
        </div>
      </div>

      {/* User Section */}
      <div className="mt-4 font-bold">
        <span>ผู้ใช้ยานพาหนะ</span>
      </div>

      <div className="card grid grid-cols-[250px_auto] gap-2 mt-2 rounded-xl bg-gray-100 p-4">
        <div className="flex flex-col">
          <span className="font-bold">{carUserDetail.userName}</span>
          <span className="text-gray-500">{carUserDetail.userPosition} {carUserDetail.userDeptShortName}</span>
        </div>

        <div className="flex flex-col justify-end sm:flex-row gap-2 sm:gap-4">
          <div className="flex items-center gap-1">
            <i className="material-symbols-outlined text-base text-brand-900">
              smartphone
            </i>
            <span className="text-sm text-gray-500">
              {carUserDetail.userContactNumber ?? "-"}
            </span>
          </div>

          <div className="flex items-center gap-1">
            <i className="material-symbols-outlined text-base text-brand-900">
              phone
            </i>
            <span className="text-sm text-gray-500">
              {carUserDetail.userContactInternalNumber ?? "-"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};