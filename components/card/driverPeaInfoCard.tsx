import React, { useRef } from "react";
import Image from "next/image";
import DriverInfoModal from "@/components/modal/driverInfoModal";
import UserKeyPickUpModal from "@/components/modal/userKeyPickUpModal";

interface DriverInfoProps {
  seeDetail?: boolean;
  userKeyPickup?: boolean;
  deptSapShort?: string;
  driverEmpID?: string;
  driverEmpName?: string;
  driverInternalContact?: string;
  driverMobileContact?: string;
}

export default function DriverPeaInfoCard({
  userKeyPickup,
  deptSapShort,
  driverEmpID,
  driverEmpName,
  driverInternalContact,
  driverMobileContact,
  seeDetail
}: DriverInfoProps) {
  const driverInfoModalRef = useRef<{
    openModal: () => void;
    closeModal: () => void;
  } | null>(null);
  const userKeyPickUpModalRef = useRef<{
    openModal: () => void;
    closeModal: () => void;
  } | null>(null);

  return (
    <div className="card">
      <div className="card-body">
        <div className="card-body-inline">
          <div className="img img-square img-avatar flex-grow-1 align-self-start">
            <Image
              src="/assets/image/sample-avatar.png"
              className="rounded-md"
              width={100}
              height={100}
              alt="Driver Avatar"
            />
          </div>
          <div className="card-content">
            <div className="card-content-top">
              <div className="card-title">{driverEmpName || "ไม่ระบุชื่อ"}</div>
              <div className="supporting-text-group">
                <div className="supporting-text">{driverEmpID || "-"}</div>
                <div className="supporting-text">{deptSapShort || "-"}</div>
              </div>
            </div>

            <div className="card-item-group">
              {driverMobileContact && (
                <div className="card-item">
                  <i className="material-symbols-outlined">smartphone</i>
                  <span className="card-item-text">
                    <span className="supporting-text">{driverMobileContact}</span>
                  </span>
                </div>
              )}
              {driverInternalContact && (
                <div className="card-item">
                  <i className="material-symbols-outlined">call</i>
                  <span className="card-item-text">{driverInternalContact}</span>
                </div>
              )}
            </div>
          </div>
        </div>
          { seeDetail && 
        <div className="card-actions w-full">
          <button
            className="btn btn-default w-full"
            onClick={
              userKeyPickup
                ? () => userKeyPickUpModalRef.current?.openModal()
                : () => driverInfoModalRef.current?.openModal()
            }
          >
            ดูรายละเอียด
          </button>
        </div>
        }
      </div>

      <DriverInfoModal ref={driverInfoModalRef} />
      {userKeyPickup && <UserKeyPickUpModal ref={userKeyPickUpModalRef} />}
    </div>
  );
}
