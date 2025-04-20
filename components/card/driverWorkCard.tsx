import React, { useRef, useEffect, useState } from "react";
import Image from "next/image";
import DriverInfoModal from "@/components/modal/driverInfoModal";
import UserKeyPickUpModal from "@/components/modal/userKeyPickUpModal";
import { fetchDriverDetail } from "@/services/masterService";
import { DriverType } from "@/app/types/driver-user-type";
import { requestDetail } from "@/services/bookingUser";
import AdminDriverPickModal from "../modal/adminDriverPickModal";

interface DriverSmallInfoCardProps {
  userKeyPickup?: boolean;
  id?: string;
  seeDetail?: boolean;
  driverDetail?: DriverType;
  selectDriver?: boolean;
  reqId?: string;
}

export default function DriverWorkCard({
  userKeyPickup,
  seeDetail,
  driverDetail,
  id,
  selectDriver,
  reqId,
}: DriverSmallInfoCardProps) {
  const adminDriverPickModalRef = useRef<{
    openModal: () => void;
    closeModal: () => void;
  } | null>(null);

  const driverInfoModalRef = useRef<{
    openModal: () => void;
    closeModal: () => void;
  } | null>(null);
  const userKeyPickUpModalRef = useRef<{
    openModal: () => void;
    closeModal: () => void;
  } | null>(null);

  const [driver, setDriver] = useState<DriverType>();

  useEffect(() => {
    if (driverDetail) {
      setDriver(driverDetail);
      return;
    }

    const fetchData = async () => {
      try {
        const res = await fetchDriverDetail(id || "");
        setDriver(res.data);
      } catch (error) {
        console.error("Error fetching driver data:", error);
      }
    };

    fetchData();
  }, [id, driverDetail]);

  if (!driver) {
    return;
  }

  return (
    <div className="card">
      <div className="card-body">
        <div className="card-body-inline">
          <div className="img img-square img-avatar flex-grow-1 align-self-start">
            <Image
              src={`${driver.driver_image || "/assets/img/avatar.svg"}`}
              className="rounded-md"
              width={100}
              height={100}
              alt={driver.driver_name}
            />
          </div>
          <div className="card-content">
            <div className="card-content-top">
              <div className="card-title">   {driver.driver_name} {driver.driver_nickname && `(${driver.driver_nickname})`}</div>
              <div className="supporting-text-group">
              <div className="card-supporting-text">{driver.driver_status.ref_driver_status_desc}</div>
              <div className="card-supporting-text">{driver.work_type_name}</div>
              </div>
            </div>

            <div className="card-item-group">
    
                <div className="card-item">
                  <i className="material-symbols-outlined">work</i>
                  <span className="card-item-text">
                  {driver.work_count} งาน / {driver.work_days} วัน
                  </span>
                </div>
             
            </div>
          </div>
        </div>
        {seeDetail && (
          <div className="card-actioins w-full">
            <div className="flex gap-3">
              <button
                className={`btn ${selectDriver ? "btn-secondary" : "btn-secondary"} flex-1`}
                onClick={
                  userKeyPickup
                    ? () => userKeyPickUpModalRef.current?.openModal()
                    : () => driverInfoModalRef.current?.openModal()
                }
              >
                ดูรายละเอียด
              </button>
              {selectDriver && (
                <button className="btn btn-secondary flex-1"   onClick={() => adminDriverPickModalRef.current?.openModal()}>
                  เลือกพนักงานขับรถ
                </button>
              )}
            </div>
          </div>
        )}
        {userKeyPickup && (
          <>
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
          </>
        )}
      </div>


      <DriverInfoModal
        ref={driverInfoModalRef}
        id={driverDetail?.mas_driver_uid}
        onBack={() => adminDriverPickModalRef.current?.openModal()}
      />

      {userKeyPickup && <UserKeyPickUpModal ref={userKeyPickUpModalRef} />}
    </div>
  );
}
