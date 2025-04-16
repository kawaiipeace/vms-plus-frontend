import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import Image from "next/image";
import { fetchDriverDetail, fetchDrivers, fetchUserDrivers } from "@/services/masterService";
import { PeaDriverType } from "@/app/types/vehicle-user-type";
import { convertToBuddhistDateTime } from "@/utils/converToBuddhistDateTime";
import useSwipeDown from "@/utils/swipeDown";
import { DriverType } from "@/app/types/driver-user-type";

interface Props {
  id?: string;
}

const DriverInfoModal = forwardRef<
  { openModal: () => void; closeModal: () => void },
  Props
>(({ id }, ref) => {
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
          console.log(response.data);
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
  
  }, [name]);

  const swipeDownHandlers = useSwipeDown(() => modalRef.current?.close());

  
  return (
    <dialog ref={modalRef} id="my_modal_1" className="modal">
      <div  className="modal-box max-w-[500px] p-0 relative modal-vehicle-pick overflow-hidden flex flex-col max-h-[90vh]">
        <div className="bottom-sheet" {...swipeDownHandlers} >
          <div className="bottom-sheet-icon"></div>
        </div>
        <div className="modal-header bg-white sticky top-0 flex justify-between z-10">
          <div className="modal-title">ข้อมูลผู้ขับขี่</div>
          <form method="dialog">
            <button className="close btn btn-icon border-none bg-transparent shadow-none btn-tertiary">
              <i className="material-symbols-outlined">close</i>
            </button>
          </form>
        </div>
        {!vehicleUserData ? (
          <div className="p-4 text-center">กำลังโหลดข้อมูล...</div>
        ) : (
          <div className="modal-body overflow-y-auto">
            <div className="form-section" style={{ marginTop: 0 }}>
              <div className="form-card w-full">
                <div className="form-card-body">
                  <div className="form-group form-plaintext form-users">
                    <Image
                      src={
                        vehicleUserData?.driver_image ||
                        "/assets/img/sample-avatar.png"
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
                  <div className="form-card-right align-self-center mt-4">
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
                            {/* {vehicleUserData?.annual_driver?.driver_license_no ||
                              "-"} */}
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
                            {/* {convertToBuddhistDateTime(
                              vehicleUserData?.annual_driver
                                ?.driver_license_expire_date
                            ).date} */}
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
                  การขออนุมัติทำหน้าที่ขับรถยนต์
                </div>
              </div>

              <div className="form-card">
                <div className="form-card-body">
                  <div className="grid grid-cols-12">
                    <div className="col-span-12 md:col-span-6">
                      <div className="form-group form-plaintext">
                        <i className="material-symbols-outlined">news</i>
                        <div className="form-plaintext-group">
                          <div className="form-label">เลขที่คำขอ</div>
                          <div className="form-text">
                            {/* {vehicleUserData?.annual_driver
                              ?.request_annual_driver_no || "-"} */}
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
                          {/* {convertToBuddhistDateTime(
                              vehicleUserData?.annual_driver
                              ?.request_expire_date
                            ).date} */}
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
          <form method="dialog">
            <button className="btn btn-secondary">ปิด</button>
          </form>
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
