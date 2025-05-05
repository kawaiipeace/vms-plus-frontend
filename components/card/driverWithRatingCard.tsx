import React, { useRef } from "react";
import Image from "next/image";
import { RequestDetailType } from "@/app/types/request-detail-type";

interface Props {
  UserType?: string;
  displayBtnMore?: boolean;
  displayOn?: string;
  reviewDriver?: () => void;
  requestData?: RequestDetailType;
}

export default function DriverWithRatingCard({
  displayBtnMore,
  requestData,
}: Props) {
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
              src={
                requestData?.driver?.driver_image || "/assets/img/avatar.svg"
              }
              className="rounded-md"
              width={100}
              height={100}
              alt={requestData?.driver?.driver_name || "-"}
            />
          </div>
          <div className="card-content">
            <div className="card-content-top">
              <div className="card-title">
                {requestData?.driver?.driver_name || "-"}
              </div>
              <div className="supporting-text-group">
                <div className="supporting-text">
                  {requestData?.driver?.driver_dept_sap || "-"}
                </div>
              </div>
            </div>

            <div className="card-item-group md:!grid-cols-2 !grid-cols-1">
              <div className="card-item w-full">
                <i className="material-symbols-outlined">smartphone</i>
                <span className="card-item-text">
                  {requestData?.driver?.driver_contact_number || "-"}
                </span>
              </div>

              <div className="card-item w-full">
                <i className="material-symbols-outlined">star</i>
                <span className="card-item-text">
                  {" "}
                  {requestData?.driver?.driver_average_satisfaction_score ||
                    "-"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      {displayBtnMore === false && (
        <div className="card-actioins w-full">
          <button
            className={`btn btn-secondary w-full`}
            onClick={() => driverInfoModalRef.current?.openModal()}
          >
            ดูรายละเอียด
          </button>
        </div>
      )}
    </div>
  );
}
