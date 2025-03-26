import React, { useRef } from "react";
import Image from "next/image";
import DriverInfoModal from "@/components/modal/driverInfoModal";
import UserKeyPickUpModal from "@/components/modal/userKeyPickUpModal";

interface Props {
  userKeyPickup?: boolean;
}

export default function DriverPeaInfoCard({
  userKeyPickup,
}: Props) {
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
              alt=""
            />
          </div>
          <div className="card-content">
            <div className="card-content-top">
              <div className="card-title">ธนพล</div>
                <div className="supporting-text-group">
                  <div className="supporting-text">505291</div>
                  <div className="supporting-text">นรค.6 กอพ.1 ฝพจ.</div>
                </div>
            </div>

              <div className="card-item-group">
                <div className="card-item">
                  <i className="material-symbols-outlined">smartphone</i>
                  <span className="card-item-text">
                   <span className="supporting-text">082-462-5577</span>{" "}
                  </span>
                </div>
                <div className="card-item">
                  <i className="material-symbols-outlined">call</i>
                  <span className="card-item-text">5687</span>
                </div>
              </div>
          </div>
        </div>

        <div className="card-actioins w-full">
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
      </div>

      <DriverInfoModal ref={driverInfoModalRef} />
      {userKeyPickup && <UserKeyPickUpModal ref={userKeyPickUpModalRef} />}
    </div>
  );
}
