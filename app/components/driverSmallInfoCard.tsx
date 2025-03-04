import React, { useRef } from "react";
import Image from "next/image";
import DriverInfoModal from "./modal/driverInfoModal";
export default function DriverSmallInfoCard() {
      const driverInfoModalRef = useRef<{
        openModal: () => void;
        closeModal: () => void;
      } | null>(null);
  return (
    <div className="card">
      <div className="card-body">
        <div className="card-body-inline">
        <div className="img img-square img-avatar flex-grow-1 align-self-start">
          <Image
            src="/assets/img/sample-avatar.png"
            className="rounded-md"
            width={100}
            height={100}
            alt=""
          />
        </div>
        <div className="card-content">
          <div className="card-content-top">
            <div className="card-title">ธนพล วิจารณ์ปรีชา</div>
            <div className="supporting-text-group">
              <div className="supporting-text">
                บริษัท ยุทธศาสตร์การขับขี่ยี่สิบปี จำกัด
              </div>
            </div>
          </div>

          <div className="card-item-group">
            <div className="card-item">
              <i className="material-symbols-outlined">star</i>
              <span className="card-item-text">
                4.5 <span className="supporting-text">(200)</span>{" "}
              </span>
            </div>
            <div className="card-item">
              <i className="material-symbols-outlined">person</i>
              <span className="card-item-text">35 ปี</span>
            </div>
          </div>
        </div>
        </div>
   
        <div className="card-actioins w-full">
          <button
            className="btn btn-default w-full"
            onClick={() => driverInfoModalRef.current?.openModal()}
          >
            ดูรายละเอียด
          </button>
        </div>
        <hr />
        <div className="form-section">
            <div className="form-section-header">
              <div className="form-section-header-title">
              การนัดหมายพนักงานขับรถ
              </div>
            </div>

            <div className="form-card">
              <div className="form-card-body">
                <div className="grid grid-cols-12 gap-4">
                  <div className="col-span-12 md:col-span-12">
                    <div className="form-group form-plaintext">
                      <i className="material-symbols-outlined">id_card</i>
                      <div className="form-plaintext-group">
                        <div className="form-label">สถานที่นัดหมาย</div>
                        <div className="form-text">49005622</div>
                      </div>
                    </div>
                  </div>

                  <div className="col-span-12 md:col-span-12">
                    <div className="form-group form-plaintext">
                      <i className="material-symbols-outlined">
                        calendar_month
                      </i>
                      <div className="form-plaintext-group">
                        <div className="form-label">วันที่และเวลา</div>
                        <div className="form-text">01/01/2567</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

      </div>
   
      <DriverInfoModal ref={driverInfoModalRef} />
    </div>
  );
}
