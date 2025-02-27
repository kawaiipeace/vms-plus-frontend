import React, { forwardRef, useImperativeHandle, useRef } from "react";
import Image from "next/image";
import ImgSlider from "./imgSlider";

const VehicleDetailModel = forwardRef((_, ref) => {
  const modalRef = useRef<HTMLDialogElement>(null);

  const imageUrls = [
    '/assets/img/sample-car.jpeg',
    '/assets/img/sample-car.jpeg',
    '/assets/img/sample-car.jpeg',
    '/assets/img/sample-car.jpeg',
  ];

  useImperativeHandle(ref, () => ({
    openModal: () => modalRef.current?.showModal(),
    closeModal: () => modalRef.current?.close(),
  }));

  return (
    <dialog ref={modalRef} id="my_modal_1" className="modal">
      <div className="modal-box max-w-[800px] p-0 relative">
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
          <div className="w-full md:w-7/12">
          <ImgSlider images={imageUrls} />
          </div>
      
          <div className="modal-inner-scrollable md:w-5/12 w-full">
      
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
                <div className="card-item">
                  <i className="material-symbols-outlined">credit_card</i>
                  <span className="card-item-text">บัตรเติมน้ำมัน</span>
                  <div className="avatar avatar-xxs">
                    <Image
                      src="/assets/img/ptt.png"
                      alt=""
                      width={100}
                      height={100}
                    />
                  </div>
                </div>
                <div className="card-item">
                  <i className="material-symbols-outlined">local_gas_station</i>
                  <span className="card-item-text">แก๊สโซฮอล์ พรีเมียม 97</span>
                </div>
                <div className="card-item">
                  <i className="material-symbols-outlined">auto_transmission</i>
                  <span className="card-item-text">เกียร์อัตโนมัติ</span>
                </div>
                <div className="card-item">
                  <i className="material-symbols-outlined">
                    airline_seat_recline_extra
                  </i>
                  <span className="card-item-text">5 ที่นั่ง</span>
                </div>
              </div>
            </div>

            <div className="modal-section">
              <div className="modal-section-label">ผู้ดูแลยานพาหนะ</div>
              <div className="card-item-group">
                <div className="media media-users">
                  <Image
                    src="/assets/img/sample-avatar.png"
                    className="avatar avatar-sm"
                    alt=""
                    width={100}
                    height={100}
                  />
                  <div className="media-body">
                    <div className="media-title">นายวิทยา สว่างวงษ์</div>
                    <div className="media-text">460137</div>
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

          <button type="button" className="btn btn-primary">
            เลือก
          </button>
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
