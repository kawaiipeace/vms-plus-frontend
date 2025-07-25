import Image from "next/image";
import { forwardRef, useImperativeHandle, useRef } from "react";

export type VehicleTimelineRef = {
  open: () => void;
  close: () => void;
};

type VehicleTimeLineDetailModalProps = {
  modalData: any; // Replace 'any' with a more specific type if available
};

const VehicleTimeLineDetailModal = forwardRef<VehicleTimelineRef, VehicleTimeLineDetailModalProps>(
  ({ modalData }, ref) => {
    const detailRef = useRef<HTMLDialogElement>(null);

    useImperativeHandle(ref, () => ({
      open: () => detailRef.current?.showModal(),
      close: () => detailRef.current?.close(),
    }));

    const CardBox = ({ modalData2 }: { modalData2: any }) => {
      return (
        <div className="border border-gray-300 rounded-xl p-4 bg-white shadow-sm w-full max-w-xl">
          {/* {JSON.stringify(modalData2)} */}
          <div className="grid grid-cols-[auto_1fr] gap-4">
            {/* Image Section */}
            <div className="flex items-start justify-center overflow-hidden rounded-xl">
              <Image
                src={
                  modalData2.statusModal === "เสร็จสิ้น"
                    ? "/assets/img/return_complete.png"
                    : modalData2.statusModal === "ไป - กลับ"
                    ? "/assets/img/graphic/status_vehicle_pickup.png"
                    : modalData2.statusModal === "รออนุมัติ"
                    ? "/assets/img/graphic/status_waiting_approval.png"
                    : "/assets/img/graphic/status_vehicle_inuse.png"
                }
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
                  <span className="text-xl font-bold">{modalData2.statusModal}</span>
                  <i className="material-symbols-outlined text-xl text-gray-600 cursor-pointer" onClick={() => {}}>
                    chevron_right
                  </i>
                </div>
                <span className="font-medium text-gray-700">{modalData2.destinationPlace}</span>
                <span className="text-gray-500">{modalData2.startDate} | ไป - กลับ</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-2 text-base text-gray-500">
                <div className="flex items-center gap-1">
                  <i className="material-symbols-outlined text-base text-gray-600">directions_car</i>
                  <span>{modalData2.carPlate}</span>
                </div>
                <div className="flex items-center gap-1">
                  <i className="material-symbols-outlined text-base text-gray-600">person</i>
                  <span>{modalData2.driverName}</span>
                </div>
              </div>
            </div>
          </div>

          {/* User Section */}
          <div className="mt-4 font-bold">
            <span>ผู้ใช้ยานพาหนะ</span>
          </div>

          <div className="grid grid-cols-[200px_auto] gap-2 mt-2 justify-between rounded-xl bg-gray-100 p-4">
            <div className="flex flex-col">
              <span className="font-bold">{modalData2.vehicleName}</span>
              <span className="text-gray-500">{modalData2.vehicleDept}</span>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
              <div className="flex items-center gap-1">
                <i className="material-symbols-outlined text-base text-brand-900">smartphone</i>
                <span className="text-sm text-gray-500">{modalData2.carContactNumberMobile}</span>
              </div>

              <div className="flex items-center gap-1">
                <i className="material-symbols-outlined text-base text-brand-900">phone</i>
                <span className="text-sm text-gray-500">{modalData2.carContactNumber}</span>
              </div>
            </div>
          </div>
        </div>
      );
    };

    return (
      <dialog ref={detailRef} className="modal">
        <div className="modal-box bg-white rounded-lg min-w-[650px] max-w-[650px] h-auto max-h-[60vh] overflow-y-auto">
          <div>
            <span className="text-base font-bold">{"2 มกราคม 2567"}</span>
          </div>

          <div className="flex flex-col gap-4 mt-5 overflow-y-auto max-h-[400px]">
            <CardBox modalData2={modalData} />
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
  }
);

VehicleTimeLineDetailModal.displayName = "VehicleTimeLineDetailModal";

export default VehicleTimeLineDetailModal;
