import dayjs from "dayjs";
import Image from "next/image";
import { forwardRef, useImperativeHandle, useRef } from "react";

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

  const imgPath = new Map([
    ["รออนุมัติ", "/assets/img/vehicle/pending_approval.svg"],
    ["ไป - กลับ", "/assets/img/vehicle/completed.svg"],
    ["ค้างแรม", "/assets/img/vehicle/with_overnight_stay.svg"],
    ["เสร็จสิ้น", "/assets/img/vehicle/completed.svg"],
  ]);

  const CardBox = ({ data }: { data: any }) => {
    const {
      status,
      schedule_title,
      startDate,
      endDate,
      startTime,
      endTime,
      duration,
      driverDetail,
      carUserDetail,
    } = data;

    return (
      <div className="border border-gray-300 rounded-xl p-4 bg-white shadow-sm w-full max-w-xl">
        <div className="grid grid-cols-[auto_1fr] gap-4">
          {/* Image Section */}
          <div className="flex items-start justify-center">
            <Image
              src={imgPath.get(status) ?? "/assets/img/vehicle/check_car_complete.svg"}
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
                  onClick={() => {}}
                >
                  chevron_right
                </i>
              </div>
              <span className="font-medium text-gray-700">{schedule_title}</span>
              <span className="text-gray-500">
                {dayjs(startDate).format('DD/MM/YYYY')}
                {parseInt(duration) > 1 ? ` - ${dayjs(endDate).format('DD/MM/YYYY')}` : ""} {startTime} - {endTime} | {status}
              </span>
            </div>

            <div className="grid grid-cols-2 text-base text-gray-500">
              <div className="flex items-center gap-1">
                <i className="material-symbols-outlined text-base text-gray-600">
                  directions_car
                </i>
                <span>{driverDetail.licensePlate}</span>
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

        <div className="grid grid-cols-[200px_auto] gap-2 mt-2 rounded-xl bg-gray-100 p-4">
          <div className="flex flex-col">
            <span className="font-bold">{carUserDetail.userName}</span>
            <span className="text-gray-500">นรค.6 กอพ.1 ฝพจ.</span>
          </div>

          <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
            <div className="flex items-center gap-1">
              <i className="material-symbols-outlined text-base text-brand-900">
                smartphone
              </i>
              <span className="text-sm text-gray-500">
                {carUserDetail.userContactNumber || "-"}
              </span>
            </div>

            <div className="flex items-center gap-1">
              <i className="material-symbols-outlined text-base text-brand-900">
                phone
              </i>
              <span className="text-sm text-gray-500">
                {carUserDetail.userContactInternalNumber || "-"}
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <dialog ref={detailRef} className="modal">
      <div className="modal-box bg-white rounded-lg min-w-[650px] max-w-[650px] h-[534px]">
        <div>
          <span className="text-base font-bold">{currentDate}</span>
        </div>

        <div className="flex flex-col gap-4 mt-5 overflow-y-auto max-h-[400px]">
          {detailRequest.map((item, index) => (
            <CardBox key={index} data={item} />
          ))}
        </div>

        <div className="flex justify-end">
          <button
            className="border border-gray-300 bg-white text-gray-700 shadow-sm hover:bg-gray-100 transition rounded-lg px-4 py-2 mt-4 w-full max-w-[100px]"
            onClick={() => detailRef.current?.close()}
          >
            <span>ปิด</span>
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
