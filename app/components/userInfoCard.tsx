import React, { useRef } from "react";
import Image from "next/image";
import DriverInfoModal from "./modal/driverInfoModal";
export default function UserInfoCard() {
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
                <div className="supporting-text">505291</div>
                <div className="supporting-text">นรค.6 กอพ.1 ฝพจ.</div>
              </div>
            </div>

            <div className="card-item-group">
              <div className="card-item">
                <i className="material-symbols-outlined">smartphone</i>
                <span className="card-item-text">091-234-5678</span>
              </div>
              <div className="card-item">
                <i className="material-symbols-outlined">call</i>
                <span className="card-item-text">6032</span>
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
      </div>
      <DriverInfoModal ref={driverInfoModalRef} />
    </div>
  );
}
