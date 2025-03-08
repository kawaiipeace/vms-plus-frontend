import React, { useRef } from "react";
import Image from "next/image";
import DriverInfoModal from "@/app/components/modal/driverInfoModal";

interface UserInfoCardProps {
  UserType?: string;
  displayBtnMore?: boolean;
}
export default function UserInfoCard({ UserType, displayBtnMore }: UserInfoCardProps) {
  const driverInfoModalRef = useRef<{
    openModal: () => void;
    closeModal: () => void;
  } | null>(null);
  return (
    <div className="card">
      <div className="card-body">
        <div className="card-body-inline">
          <div className="img img-square img-avatar flex-grow-1 align-self-start">
            <Image src="/assets/img/sample-avatar.png" className="rounded-md" width={100} height={100} alt="" />
          </div>
          <div className="card-content">
            <div className="card-content-top">
              <div className="card-title">ธนพล วิจารณ์ปรีชา</div>

              <div className="supporting-text-group">
                {UserType == "outsource" && <div className="supporting-text">บริษัท ยุทธศาสตร์การขับขี่ยี่สิบปี จำกัด</div>}
                {UserType != "outsource" && (
                  <>
                    <div className="supporting-text">505291</div>
                    <div className="supporting-text">นรค.6 กอพ.1 ฝพจ.</div>
                  </>
                )}
              </div>
            </div>

            <div className="card-item-group md:!grid-cols-2 !grid-cols-1">
              <div className="card-item w-full">
                <i className="material-symbols-outlined">smartphone</i>
                <span className="card-item-text">091-234-5678</span>
              </div>
              {UserType != "outsource" && (
                <div className="card-item w-full">
                  <i className="material-symbols-outlined">call</i>
                  <span className="card-item-text">6032</span>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="card-actioins w-full">
          <button className={`btn btn-default w-full ${displayBtnMore && "hidden"}`} onClick={() => driverInfoModalRef.current?.openModal()}>
            ดูรายละเอียด
          </button>
        </div>
      </div>
      <DriverInfoModal ref={driverInfoModalRef} />
    </div>
  );
}
