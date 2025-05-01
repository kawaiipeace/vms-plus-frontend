import React, { useRef } from "react";
import Image from "next/image";
import DriverInfoModal from "@/components/modal/driverInfoModal";
import { VehicleUserType } from "@/app/types/vehicle-user-type";
import CallToDriverModal from "../modal/callToDriverModal";

interface UserInfoCardProps {
  UserType?: string;
  displayBtnMore?: boolean;
  displayOn?: string;
  reviewDriver?: () => void;
  vehicleUserData?: VehicleUserType;
}

export default function UserInfoCard({
  UserType,
  displayBtnMore,
  displayOn,
  reviewDriver,
  vehicleUserData,
}: UserInfoCardProps) {
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
            <Image
              src={
                vehicleUserData?.image_url || "/assets/img/sample-avatar.png"
              }
              className="rounded-md"
              width={100}
              height={100}
              alt={vehicleUserData?.full_name || ""}
            />
          </div>
          <div className="card-content">
            <div className="card-content-top">
              <div className="card-title">{vehicleUserData?.full_name}</div>
              <div className="supporting-text-group">
                {UserType == "outsource" && (
                  <div className="supporting-text">
                    บริษัท ยุทธศาสตร์การขับขี่ยี่สิบปี จำกัด
                  </div>
                )}
                {UserType != "outsource" && (
                  <>
                    <div className="supporting-text">
                      {vehicleUserData?.emp_id}
                    </div>
                    <div className="supporting-text">
                      {vehicleUserData?.dept_sap_short}
                    </div>
                  </>
                )}
              </div>
            </div>

            {displayOn != "driver" && (
              <div className="card-item-group md:!grid-cols-2 !grid-cols-1">
                <div className="card-item w-full">
                  <i className="material-symbols-outlined">smartphone</i>
                  <span className="card-item-text">
                    {vehicleUserData?.tel_mobile}
                  </span>
                </div>
                {UserType != "outsource" && (
                  <div className="card-item w-full">
                    <i className="material-symbols-outlined">call</i>
                    <span className="card-item-text">
                      {vehicleUserData?.tel_internal}
                    </span>
                  </div>
                )}
                {UserType == "outsource" && displayOn == "admin" && (
                  <div className="card-item w-full">
                    <i className="material-symbols-outlined">star</i>
                    <span className="card-item-text">5.0</span>
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
                  <span className="card-item-text">
                    {vehicleUserData?.tel_mobile}
                  </span>
                </div>
                {UserType != "outsource" && (
                  <div className="card-item w-full">
                    <i className="material-symbols-outlined">call</i>
                    <span className="card-item-text">
                      {vehicleUserData?.tel_internal}
                    </span>
                  </div>
                )}
              </div>
              <div className="flex w-full justify-end col-span-1">
                <button
                  className="btn btn-primary"
                  onClick={() => callToDriverModalRef.current?.openModal()}
                >
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
                <button
                  className={`btn btn-secondary w-full ${
                    displayBtnMore && "hidden"
                  }`}
                  onClick={() => driverInfoModalRef.current?.openModal()}
                >
                  ดูรายละเอียด
                </button>
              </div>
              <div className="col-span-1">
                <button
                  className={`btn btn-secondary w-full ${
                    displayBtnMore && "hidden"
                  }`}
                  onClick={reviewDriver}
                >
                  คะแนนการให้บริการ
                </button>
              </div>
            </div>
          </>
        ) : (
          displayBtnMore === false && (
            <div className="card-actioins w-full">
              <button
                className={`btn btn-secondary w-full`}
                onClick={() => driverInfoModalRef.current?.openModal()}
              >
                ดูรายละเอียด
              </button>
            </div>
          )
        )}
      </div>
      <CallToDriverModal
        ref={callToDriverModalRef}
        imgSrc={""}
        name={""}
        phone={""}
      />
      <DriverInfoModal ref={driverInfoModalRef} />
    </div>
  );
}
