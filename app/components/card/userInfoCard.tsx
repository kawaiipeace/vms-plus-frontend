import React, { useRef } from "react";
import Image from "next/image";
import DriverInfoModal from "@/app/components/modal/driverInfoModal";
import { CallToDriverModal } from "@/app/components/modal/callToDriverModal";

interface UserInfoCardProps {
  UserType?: string;
  displayBtnMore?: boolean;
  displayOn?: string;
}
export default function UserInfoCard({ UserType, displayBtnMore, displayOn }: UserInfoCardProps) {
  const driverInfoModalRef = useRef<{
    openModal: () => void;
    closeModal: () => void;
  } | null>(null);
  const callToDriverModalRef = useRef<{
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

            {displayOn != "driver" && (
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
            )}
          </div>
        </div>
        <div>
          {displayOn == "driver" && (
            <div className="card-item-group !grid-cols-4">
              <div className="grid grid-cols-1 gap-3 col-span-3">
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
              <div className="flex w-full justify-end col-span-1">
                <button className="btn btn-primary" onClick={() => callToDriverModalRef.current?.openModal()}>
                  <i className="material-symbols-outlined">call</i>
                </button>
              </div>
            </div>
          )}
        </div>
        {displayOn === "admin" ? (
          <>
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-1">
                <button className={`btn btn-secondary w-full ${displayBtnMore && "hidden"}`} onClick={() => driverInfoModalRef.current?.openModal()}>
                  ดูรายละเอียด
                </button>
              </div>
              <div className="col-span-1">
                <button className={`btn btn-secondary w-full ${displayBtnMore && "hidden"}`} onClick={() => driverInfoModalRef.current?.openModal()}>
                  คะแนนการให้บริการ
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="card-actioins w-full">
            <button className={`btn btn-secondary w-full ${displayBtnMore && "hidden"}`} onClick={() => driverInfoModalRef.current?.openModal()}>
              ดูรายละเอียด
            </button>
          </div>
        )}
      </div>
      <CallToDriverModal ref={callToDriverModalRef} />
      <DriverInfoModal ref={driverInfoModalRef} />
    </div>
  );
}
