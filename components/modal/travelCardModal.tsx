import { VehicleUserTravelCardType } from "@/app/types/vehicle-user-type";
import ToastCustom from "@/components/toastCustom";
import { convertToBuddhistDateTime } from "@/utils/converToBuddhistDateTime";
import useSwipeDown from "@/utils/swipeDown";
import Image from "next/image";
import { forwardRef, useImperativeHandle, useRef } from "react";

interface TravelCardModalProps {
  requestData?: VehicleUserTravelCardType;
}

const TravelCardModal = forwardRef<{ openModal: () => void; closeModal: () => void }, TravelCardModalProps>(
  ({ requestData }, ref) => {
    const modalRef = useRef<HTMLDialogElement>(null);

    useImperativeHandle(ref, () => ({
      openModal: () => modalRef.current?.showModal(),
      closeModal: () => modalRef.current?.close(),
    }));

    const swipeDownHandlers = useSwipeDown(() => modalRef.current?.close());

    console.log("requestData---", requestData);

    const startDate = convertToBuddhistDateTime(requestData?.start_datetime || "");
    const endDate = convertToBuddhistDateTime(requestData?.end_datetime || "");

    return (
      <dialog ref={modalRef} className="modal">
        <div className="modal-box max-w-[500px] p-0 relative overflow-hidden flex flex-col">
          <div className="bottom-sheet" {...swipeDownHandlers}>
            <div className="bottom-sheet-icon"></div>
          </div>
          <div className="modal-body overflow-y-auto text-center">
            <div className="form-section">
              <div className="page-section-header border-0">
                <div className="page-header-left">
                  <div className="page-title">
                    <span className="page-title-label">บัตรเดินทาง</span>
                  </div>
                </div>
              </div>
              <div className="grid w-full flex-wrap gap-5 grid-cols-12">
                <div className="col-span-12">
                  <div className="flex">
                    <div className="w-[60px]">
                      <Image src="/assets/img/brand.svg" className="w-full" width={100} height={100} alt="" />
                    </div>
                    <div className="ml-auto">
                      <p>
                        {startDate.date} - {endDate.date}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex justify-start col-span-12">
                  <div className="text-left">
                    <p className="font-bold text-3xl">{requestData?.vehicle_license_plate || "-"}</p>
                    <p>{requestData?.vehicle_license_plate_province_full || "-"}</p>
                  </div>
                </div>
                <div className="col-span-12">
                  <div className="form-section">
                    <div className="form-card">
                      <div className="form-card-body">
                        <div className="grid grid-cols-12 gap-y-3">
                          <div className="col-span-12">
                            <div className="form-group form-plaintext">
                              <i className="material-symbols-outlined">calendar_month</i>
                              <div className="form-plaintext-group">
                                <div className="form-label">สถานที่ปฏิบัติงาน</div>
                                <div className="form-text text-left">{requestData?.work_place || "-"}</div>
                              </div>
                            </div>
                          </div>
                          <div className="col-span-12">
                            <div className="form-group form-plaintext">
                              <i className="material-symbols-outlined">person_edit</i>
                              <div className="form-plaintext-group">
                                <div className="form-label">ผู้อนุมัติ</div>
                                <div className="form-text text-left">
                                  {requestData?.approved_request_emp_name || "-"}
                                  <br />
                                  {requestData?.approved_request_dept_sap_short || "-"}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex justify-start items-center col-span-12">
                  <div className="w-[80px] rounded-full overflow-hidden">
                    <Image
                      src={requestData?.vehicle_user_image_url || "/assets/img/sample-avatar.png"}
                      className="w-full"
                      width={100}
                      height={100}
                      alt=""
                    />
                  </div>
                  <div className="text-left ml-3">
                    <p className="font-bold text-xl">{requestData?.vehicle_user_emp_name || "-"}</p>
                    <p>พนักงานขับรถ</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-x-4 overflow-hidden col-span-12">
                  <button className="btn btn-default w-full" onClick={() => modalRef.current?.close()}>
                    ปิด
                  </button>
                  <button className="btn btn-primary w-full">บันทึก</button>
                </div>
              </div>
            </div>
            <ToastCustom title="สร้างคำขอใช้ยานพาหนะสำเร็จ" desc="" status="success" styleText="!mx-auto" />
          </div>
        </div>
      </dialog>
    );
  }
);

TravelCardModal.displayName = "TravelCardModal";

export default TravelCardModal;
