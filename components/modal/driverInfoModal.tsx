import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import Image from "next/image";
import {
  fetchDriverDetail,
} from "@/services/masterService";
import { convertToBuddhistDateTime } from "@/utils/converToBuddhistDateTime";
import useSwipeDown from "@/utils/swipeDown";
import { DriverType } from "@/app/types/driver-user-type";

interface Props {
  id?: string;
  pickable?: boolean;
  onBack?: () => void;
}

const DriverInfoModal = forwardRef<
  { openModal: () => void; closeModal: () => void },
  Props
>(({ id, pickable, onBack } , ref) => {
  const modalRef = useRef<HTMLDialogElement>(null);
  const [vehicleUserData, setVehicleUserData] = useState<DriverType>();

  useImperativeHandle(ref, () => ({
    openModal: () => modalRef.current?.showModal(),
    closeModal: () => modalRef.current?.close(),
  }));

  useEffect(() => {
    if (id) {
      const fetchVehicleUserData = async () => {
        try {
          const response = await fetchDriverDetail(id);
          console.log("driver---", response.data);
          if (response.status === 200) {
            const res = response.data;
            setVehicleUserData(res);
          }
        } catch (error) {
          console.error("Error fetching requests:", error);
        }
      };
      fetchVehicleUserData();
    }
  }, [id]);

  const swipeDownHandlers = useSwipeDown(() => modalRef.current?.close());

  return (
    <dialog ref={modalRef} id="my_modal_1" className="modal">
      <div className="modal-box max-w-[500px] p-0 relative modal-vehicle-pick overflow-hidden flex flex-col max-h-[90vh]">
        <div className="bottom-sheet" {...swipeDownHandlers}>
          <div className="bottom-sheet-icon"></div>
        </div>
        <div className="modal-header bg-white sticky top-0 flex justify-between z-10">
         
          <div className="modal-title flex items-center gap-4"> { pickable &&   <i
                className="material-symbols-outlined cursor-pointer"
                onClick={() => {
                  modalRef.current?.close();
                  if (onBack) {
                    onBack();
                  }
                }}
              >
                keyboard_arrow_left
              </i>}  ข้อมูลผู้ขับขี่</div>
          <form method="dialog">
            <button className="close btn btn-icon border-none bg-transparent shadow-none btn-tertiary">
              <i className="material-symbols-outlined">close</i>
            </button>
          </form>
        </div>
        {!vehicleUserData ? (
         <></>
        ) : (
          <div className="modal-body overflow-y-auto">
            <div className="form-section" style={{ marginTop: 0 }}>
              <div className="form-card w-full">
                <div className="form-card-body">
                  <div className="form-group form-plaintext form-users">
                    <Image
                      src={
                        vehicleUserData?.driver_image ||
                        "/assets/img/avatar.svg"
                      }
                      className="avatar avatar-md"
                      width={100}
                      height={100}
                      alt=""
                    />
                    <div className="form-plaintext-group align-self-center">
                      <div className="form-label">
                        {vehicleUserData?.driver_name || "-"}
                      </div>
                      <div className="supporting-text-group">
                        <div className="supporting-text">
                          {vehicleUserData?.driver_id || "-"}
                        </div>
                        <div className="supporting-text">
                          {vehicleUserData?.driver_dept_sap || "-"}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 justify-start items-center flex-wrap">
                    <div className="form-card mt-4">
                      <div className="flex flex-wrap gap-4">
                        <div className="col-span-12 md:col-span-6">
                          <div className="form-group form-plaintext">
                            <i className="material-symbols-outlined">
                              smartphone
                            </i>
                            <div className="form-plaintext-group">
                              <div className="form-text text-nowrap">
                                {vehicleUserData?.driver_contact_number || "-"}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="form-card mt-4">
                      <div className="flex flex-wrap gap-4">
                        <div className="col-span-12 md:col-span-6">
                          <div className="form-group form-plaintext">
                            <i className="material-symbols-outlined">star</i>
                            <div className="form-plaintext-group">
                              <div className="form-text text-nowrap">
                                {vehicleUserData?.driver_contact_number || "-"}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="form-card mt-4">
                      <div className="flex flex-wrap gap-4">
                        <div className="col-span-12 md:col-span-6">
                          <div className="form-group form-plaintext">
                            <i className="material-symbols-outlined">person</i>
                            <div className="form-plaintext-group">
                              <div className="form-text text-nowrap">
                                {vehicleUserData?.driver_contact_number || "-"}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="form-card mt-4">
                      <div className="flex flex-wrap gap-4">
                        <div className="col-span-12 md:col-span-6">
                          <div className="form-group form-plaintext">
                            <i className="material-symbols-outlined">hotel</i>
                            <div className="form-plaintext-group">
                              <div className="form-text text-nowrap">
                                {vehicleUserData?.driver_contact_number || "-"}
                              </div>
                            </div>
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
                            {vehicleUserData?.driver_license?.driver_license_no}
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
                                vehicleUserData?.driver_license
                                  ?.driver_license_end_date
                              ).date
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
                <div className="form-section-header-title">สัญญาจ้าง</div>
              </div>

              <div className="form-card">
                <div className="form-card-body">
                  <div className="grid grid-cols-12">
                    <div className="col-span-12 md:col-span-6">
                      <div className="form-group form-plaintext">
                        <i className="material-symbols-outlined">news</i>
                        <div className="form-plaintext-group">
                          <div className="form-label">เลขที่สัญญา</div>
                          <div className="form-text">
                            {vehicleUserData?.contract_no}
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
                          <div className="form-label">มีผลถึงวันที่</div>
                          <div className="form-text">
                            {
                              convertToBuddhistDateTime(
                                vehicleUserData?.contract_end_date
                              ).date
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
                <div className="form-section-header-title">ใบรับรองการอบรม</div>
              </div>

              <div className="form-card">
                <div className="form-card-body">
                  <div className="grid grid-cols-12">
                    <div className="col-span-12 md:col-span-6">
                      <div className="form-group form-plaintext">
                        <i className="material-symbols-outlined">
                          developer_guide
                        </i>
                        <div className="form-plaintext-group">
                          <div className="form-label">
                            {" "}
                            {
                              vehicleUserData?.driver_license
                                .driver_license_type
                                .ref_driver_license_type_name
                            }
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="modal-action sticky bottom-0 gap-3 mt-0">
         
          {pickable ?
          <button
            className="btn btn-primary"
          >
            เลือก
          </button>
          : 
          <form method="dialog">
          <button className="btn btn-secondary">ปิด</button>
        </form>
           }
        </div>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>
  );
});

DriverInfoModal.displayName = "DriverInfoModal";

export default DriverInfoModal;
