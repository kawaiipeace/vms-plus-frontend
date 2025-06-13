import { Profile } from "@/app/types/profile-type";
import { DriverLicenseCardType } from "@/app/types/vehicle-user-type";
import useSwipeDown from "@/utils/swipeDown";
import Image from "next/image";
import { forwardRef, useImperativeHandle, useRef } from "react";

interface Props {
  requestData?: DriverLicenseCardType;
  profile?: Profile | null;
  onSubmit?: () => void;
  showRequestStatus?: () => void;
  showNextRequestStatus?: () => void;
  onStepOne?: () => void;
  onStepOneEdit?: () => void;
}

const DriverLicenseUpModal = forwardRef<
  { openModal: () => void; closeModal: () => void },
  Props
>(
  (
    { profile},
    ref
  ) => {
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
            <div className="modal-title flex flex-col !items-start text-left">
              {" "}
              ใบอนุญาตทำหน้าที่ขับรถยนต์{" "}
              <span className="text-base text-color-secondary font-normal">
                ประจำปี { profile?.annual_yyyy}
              </span>{" "}
            </div>

            <form method="dialog">
              <button className="close btn btn-icon border-none bg-transparent shadow-none btn-tertiary">
                <i className="material-symbols-outlined">close</i>
              </button>
            </form>
          </div>
          <div className="modal-body overflow-y-auto text-center">
            <div className="form-section">
              <div className="grid gap-5 grid-cols-12 w-[328px] max-w-[328px] bg-[url('/assets/img/annual_driving_card.svg')] bg-center bg-no-repeat p-0 rounded-xl mx-auto pb-[13%]">
                <div className="flex justify-center col-span-12 bg-brand-900 rounded-t-xl">
                  <div className="text-center p-2">
                    <p className="font-bold text-base text-white">
                      ใบอนุญาตทำหน้าที่ขับรถยนต์ประจำปี
                    </p>
                  </div>
                </div>
                <div className="flex justify-start items-center col-span-12 mt-0 px-3">
                  <div className="w-[80px] rounded-full overflow-hidden border-brand-900 border-4">
                    <Image
                      src={
                        profile?.image_url || "/assets/img/sample-avatar.png"
                      }
                      className="w-full"
                      width={100}
                      height={100}
                      alt=""
                    />
                  </div>
                       <div className="text-left ml-3 flex flex-col gap-2">
                    <p className="font-bold text-xl">
                      {profile?.first_name} {profile?.last_name}
                    </p>
                     <p>{profile?.posi_text + " " + profile?.dept_sap_short}</p>
                  </div>

                </div>
                <div className="col-span-12 p-5">
                  <div className="form-section">
                    <div className="form-card bg-[#EAECF0] rounded-md backdrop-blur-md shadow-[0px_0px_7px_0px_#63636340_inset]">
                      <div className="form-card-body">
                      
                          <div className="px-2 py-[3rem] text-color-secondary">
                            ผู้บริหารระดับ 12 ขึ้นไป
                            สามารถทำหน้าที่ขับรถยนต์ประจำปีได้โดยไม่ต้องขออนุมัติ
                          </div>
                    
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>


      </dialog>
    );
  }
);

DriverLicenseUpModal.displayName = "DriverLicenseUpModal";

export default DriverLicenseUpModal;
