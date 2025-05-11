import { Profile } from "@/app/types/profile-type";
import { DriverLicenseCardType } from "@/app/types/vehicle-user-type";
import { convertToBuddhistDateTime } from "@/utils/converToBuddhistDateTime";
import useSwipeDown from "@/utils/swipeDown";
import Image from "next/image";
import { forwardRef, useImperativeHandle, useRef } from "react";
import DriverLicProgress from "../driverLicProgress";

interface Props {
  requestData?: DriverLicenseCardType;
  onBack?: () => void;
}

const DriverLicenseDetailModal = forwardRef<
  { openModal: () => void; closeModal: () => void },
  Props
>(({ requestData, id, onBack }, ref) => {
  const modalRef = useRef<HTMLDialogElement>(null);
  useImperativeHandle(ref, () => ({
    openModal: () => modalRef.current?.showModal(),
    closeModal: () => modalRef.current?.close(),
  }));

  const swipeDownHandlers = useSwipeDown(() => modalRef.current?.close());

  console.log("driverUser", requestData);

  return (
    <dialog ref={modalRef} className="modal">
      <div
        className="modal-box max-w-[500px] p-0 relative overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bottom-sheet" {...swipeDownHandlers}>
          <div className="bottom-sheet-icon"></div>
        </div>
        <div className="modal-header bg-white sticky top-0 flex justify-between z-10">
          <div className="modal-title flex items-center gap-4">
            {" "}
            <i
              className="material-symbols-outlined cursor-pointer"
              onClick={() => {
                modalRef.current?.close();
                if (onBack) {
                  onBack();
                }
              }}
            >
              keyboard_arrow_left
            </i>{" "}
            <div className="">
              <p>เลขที่ิคำขอ RAD000006789 </p>
              <span className="text-color-secondary text-base font-normal">
                ขออนุมัติทำหน้าที่ขับรถยนต์ประจำปี 2568
              </span>
            </div>
          </div>

          <button
            className="close btn btn-icon border-none bg-transparent shadow-none btn-tertiary"
            onClick={() => modalRef.current?.close}
          >
            <i className="material-symbols-outlined">close</i>
          </button>
        </div>
        <div className="modal-body overflow-y-auto text-left">
          <div className="form-section">
            <div className="form-section-header">
              <div className="form-section-header-title">รายละเอียดคำขอ</div>
            </div>

            <div className="form-card">
              <div className="form-card-body">
                <div className="grid grid-cols-12">
                  <div className="col-span-12">
                    <div className="form-group form-plaintext">
                      <i className="material-symbols-outlined">
                        directions_car
                      </i>
                      <div className="form-plaintext-group">
                        <div className="form-label">
                          {
                            requestData?.driver_license?.driver_license_type
                              ?.ref_driver_license_type_name
                          }
                        </div>
                        <div className="form-text">
                          {
                            requestData?.driver_license?.driver_license_type
                              ?.ref_driver_license_type_desc
                          }
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="form-section">
            <div className="form-section-header">
              <div className="form-section-header-title">
                ใบอนุญาตขับรถยนต์ส่วนบุคคล
              </div>
            </div>

            <div className="form-card">
              <div className="form-card-body">
                <div className="grid grid-cols-12">
                  <div className="col-span-12 md:col-span-6">
                    <div className="form-group form-plaintext">
                      <i className="material-symbols-outlined">id_card</i>
                      <div className="form-plaintext-group">
                        <div className="form-label">เลขที่ใบอนุญาต</div>
                        <div className="form-text">
                          {requestData?.driver_license?.driver_license_no}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="col-span-12 md:col-span-6">
                    <div className="form-group form-plaintext">
                      <i className="material-symbols-outlined">
                        calendar_month
                      </i>
                      <div className="form-plaintext-group">
                        <div className="form-label">วันที่สิ้นอายุ</div>
                        <div className="form-text">
                          {
                            convertToBuddhistDateTime(
                              requestData?.driver_license
                                ?.driver_license_end_date || ""
                            ).date
                          }
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-span-12">
                    <div className="form-plaintext-group">
                      <div className="form-label font-semibold">
                        รูปใบขับขี่
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="form-section mt-0">
            <div className="form-section-header">
              <div className="form-section-header-title">
                ประวัติการดำเนินการ
              </div>
            </div>

            <div className="process-driver">
                          <DriverLicProgress />
            </div>
          </div>
        </div>
        <div className="modal-action">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => modalRef.current?.close()}
          >
            ปิด
          </button>
        </div>
      </div>
    </dialog>
  );
});

DriverLicenseDetailModal.displayName = "DriverLicenseDetailModal";

export default DriverLicenseDetailModal;
