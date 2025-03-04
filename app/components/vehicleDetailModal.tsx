import React, { forwardRef, useImperativeHandle, useRef } from "react";
import Image from "next/image";
import ImgSlider from "./imgSlider";
import CarCardItem from "./carCardItem";

// Define the props type for the VehicleDetailModel
interface VehicleDetailModelProps {
  onSelect?: (vehicle: string) => void; // onSelect prop to pass the selected vehicle
  status?: string;
}

// Define the type for the ref object
interface VehicleDetailModelRef {
  openModal: () => void;
  closeModal: () => void;
}

const VehicleDetailModel = forwardRef<
  VehicleDetailModelRef,
  VehicleDetailModelProps
>(({ onSelect, status }, ref) => {
  const modalRef = useRef<HTMLDialogElement>(null);

  const imageUrls = [
    "/assets/img/sample-car.jpeg",
    "/assets/img/sample-car.jpeg",
    "/assets/img/sample-car.jpeg",
    "/assets/img/sample-car.jpeg",
  ];

  // Expose methods to open and close the modal via ref
  useImperativeHandle(ref, () => ({
    openModal: () => modalRef.current?.showModal(),
    closeModal: () => modalRef.current?.close(),
  }));

  return (
    <dialog ref={modalRef} id="my_modal_1" className="modal">
      <div className="modal-box max-w-[1200px] p-0 relative">
        <div className="bottom-sheet">
          <div className="bottom-sheet-icon"></div>
        </div>
        <div className="modal-header bg-white sticky top-0 flex justify-between z-10">
          <div className="modal-title">รายละเอียด</div>
          <form method="dialog">
            <button className="close btn btn-icon border-none bg-transparent shadow-none btn-tertiary">
              <i className="material-symbols-outlined">close</i>
            </button>
          </form>
        </div>
        <div className="modal-body flex flex-col md:flex-row gap-5">
          <div className="w-full md:w-6/12">
            <ImgSlider images={imageUrls} />
          </div>

          <div className="modal-inner-scrollable md:w-6/12 w-full">
            <div className="modal-section">
              <div className="modal-section-inner">
                <div className="modal-inner-title">BMW M2 Coupe</div>
                <div className="modal-inner-subtitle">9กข5432 กรุงเทพ</div>
                <div className="supporting-text-group">
                  <div className="supporting-text">รถแวนตรวจการ</div>
                  <div className="supporting-text">สายงานดิจิทัล</div>
                </div>
              </div>

              <div className="card-item-group">
                <CarCardItem
                  icon="calendar_clock"
                  title="อายุการใช้งาน"
                  value="1 ปี"
                />
                <CarCardItem
                  icon="swap_driving_apps_wheel"
                  title="เลขไมล์"
                  value="36032"
                />
                <CarCardItem
                  icon="credit_card"
                  title="บัตรเติมน้ำมัน"
                  images={[
                    "/assets/img/ptt.png",
                    "/assets/img/gas_3.svg",
                    "/assets/img/gas_2.svg",
                  ]}
                  value="4030526388745563"
                />
                <CarCardItem
                  icon="local_gas_station"
                  title="ประเภทเชื้อเพลิง"
                  value="แก๊สโซฮอล์ พรีเมียม 97"
                />
                <CarCardItem
                  icon="airline_seat_recline_extra"
                  title="จำนวนที่นั่ง"
                  value="5 ที่นั่ง"
                />
                <CarCardItem
                  icon="auto_transmission"
                  title="ประเภทเกียร์"
                  value="เกียร์อัตโนมัติ"
                />
                <CarCardItem
                  icon="airport_shuttle"
                  title="รหัสข้างรถ"
                  value="กจพ.2-ช(รช)-003/2564"
                />
                <CarCardItem
                  icon="local_parking"
                  title="สถานที่จอดรถ"
                  value="ล็อคที่ 5A ชั้น 2B อาคาร LED"
                />
              </div>
            </div>

            <div className="modal-section">
              <div className="modal-section-label">ผู้ดูแลยานพาหนะ</div>
              <div className="form-card">
                <div className="form-card-body form-card-inline items-center">
                  <div className="form-group form-plaintext form-users items-center">
                    <Image
                      src="/assets/img/sample-avatar.png"
                      className="avatar avatar-md"
                      width={100}
                      height={100}
                      alt=""
                    />
                    <div className="form-plaintext-group align-self-center">
                      <div className="form-label">ศรัญยู บริรัตน์ฤทธิ์</div>
                      <div className="supporting-text-group">
                        <div className="supporting-text">505291</div>
                        <div className="supporting-text">นรค.6 กอพ.1 ฝพจ.</div>
                      </div>
                    </div>
                  </div>
                  <div className="form-card-right align-self-center">
                    <div className="flex flex-wrap gap-4">
                      <div className="col-span-12 md:col-span-6">
                        <div className="form-group form-plaintext">
                          <i className="material-symbols-outlined">
                            smartphone
                          </i>
                          <div className="form-plaintext-group">
                            <div className="form-text text-nowrap">
                              091-234-5678
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="col-span-12 md:col-span-6">
                        <div className="form-group form-plaintext">
                          <i className="material-symbols-outlined">call</i>
                          <div className="form-plaintext-group">
                            <div className="form-text text-nowra">6032</div>
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
        <div className="modal-action sticky bottom-0 gap-3 mt-0">
          <form method="dialog">
            <button className="btn btn-secondary">ปิด</button>
          </form>
          {status == "detail" ? (
            ""
          ) : (
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => {
                if(onSelect)
                onSelect("Toyota"); // Call onSelect with the title
                modalRef.current?.close(); // Close the modal after selecting
              }}
            >
              เลือก
            </button>
          )}
        </div>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>
  );
});

VehicleDetailModel.displayName = "VehicleDetailModel";

export default VehicleDetailModel;
