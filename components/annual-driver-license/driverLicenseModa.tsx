import { Profile } from "@/app/types/profile-type";
import { VehicleUserTravelCardType } from "@/app/types/vehicle-user-type";
import ToastCustom from "@/components/toastCustom";
import useSwipeDown from "@/utils/swipeDown";
import Image from "next/image";
import { forwardRef, useImperativeHandle, useRef } from "react";

interface Props {
  requestData?: VehicleUserTravelCardType;
  profile?: Profile | null;
  onSubmit?: () => void;
}

const DriverLicenseModal = forwardRef<{ openModal: () => void; closeModal: () => void }, Props>(
  ({ requestData, id, profile }, ref) => {
    const modalRef = useRef<HTMLDialogElement>(null);
      useImperativeHandle(ref, () => ({
        openModal: () => modalRef.current?.showModal(),
        closeModal: () => modalRef.current?.close(),
      }));

    const swipeDownHandlers = useSwipeDown(() => modalRef.current?.close());


    return (
      <dialog ref={modalRef} className="modal">
        <div
          className="modal-box max-w-[500px] p-0 relative overflow-hidden flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="bottom-sheet" {...swipeDownHandlers}>
            <div className="bottom-sheet-icon"></div>
          </div>
          <div className="modal-header bg-white sticky top-0 flex justify-between z-10 !border-b-0">
            <div className="modal-title flex flex-col"> ใบอนุญาตทำหน้าที่ขับรถยนต์ <span className="text-base text-color-secondary font-normal">ประจำปี 2568</span> </div>
   
            <form method="dialog">
              <button className="close btn btn-icon border-none bg-transparent shadow-none btn-tertiary">
                <i className="material-symbols-outlined">close</i>
              </button>
            </form>
          </div>
          <div className="modal-body overflow-y-auto text-center">
            <div className="form-section">
              <div
                className="grid gap-5 grid-cols-12 w-[328px] max-w-[328px] bg-[url('/assets/img/annual_card.png')] bg-center bg-no-repeat p-4 rounded-xl mx-auto"
              >

                <div className="flex justify-start col-span-12">
                  <div className="text-left">
                    <p className="font-bold text-3xl"></p>
                    <p></p>
                  </div>
                </div>
                <div className="col-span-12">
                  <div className="form-section">
                    <div className="form-card bg-[#EAECF0]">
                      <div className="form-card-body">
                        <div className="grid grid-cols-12 gap-y-3">
                          <div className="col-span-12">
                            <div className="form-group form-plaintext">
                              <i className="material-symbols-outlined">calendar_month</i>
                              <div className="form-plaintext-group">
                                <div className="form-label">สถานที่ปฏิบัติงาน</div>
                                <div className="form-text text-left"></div>
                              </div>
                            </div>
                          </div>
                          <div className="col-span-12">
                            <div className="form-group form-plaintext">
                              <i className="material-symbols-outlined">person_edit</i>
                              <div className="form-plaintext-group">
                                <div className="form-label">ผู้อนุมัติ</div>
                                <div className="form-text text-left">
                            
                                  <br />
                               
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-start items-center col-span-12 mt-5">
                  <div className="w-[80px] rounded-full overflow-hidden">
                    <Image
                      src={profile?.image || "/assets/img/sample-avatar.png"}
                      className="w-full"
                      width={100}
                      height={100}
                      alt=""
                    />
                  </div>
                  <div className="text-left ml-3">
                    <p className="font-bold text-xl"></p>
                    <p></p>
                  </div>
                </div>
              </div>
            </div>

         
          </div>
          <div className="modal-action sticky bottom-0 gap-3 mt-0 w-full">
            <div className="flex justify-between w-full gap-3 items-center">
              <span className="text-brand-900 text-sm">ขออนุมัติประจำปี 2568</span>
              <button
                className={`btn btn-secondary`}
              >
                  ดูรายละเอียด
              </button>
            </div>
          </div>
        </div>
      </dialog>
    );
  }
);

DriverLicenseModal.displayName = "DriverLicenseModal";

export default DriverLicenseModal;
