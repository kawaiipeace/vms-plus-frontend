import { DriverType } from "@/app/types/driver-user-type";
import DriverInfoModal from "@/components/modal/driverInfoModal";
import UserKeyPickUpModal from "@/components/modal/userKeyPickUpModal";
import { fetchDriverDetail } from "@/services/masterService";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import AdminDriverPickModal from "../modal/adminDriverPickModal";

interface DriverSmallInfoCardProps {
  userKeyPickup?: boolean;
  id?: string;
  seeDetail?: boolean;
  driverDetail?: DriverType;
  showPhone?: boolean;
  selectDriver?: boolean;
  reqId?: string;
}

export default function DriverSmallInfoCard({
  userKeyPickup,
  seeDetail,
  driverDetail,
  showPhone,
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
  const [driverId, setDriverId] = useState<string>("");

  const seeDriverDetail = (id: string) => {
    setDriverId(id);
    adminDriverPickModalRef.current?.closeModal();
    driverInfoModalRef.current?.openModal();
  };

  useEffect(() => {
    if (driverDetail) {
      setDriver(driverDetail);
      return;
    }

    const fetchData = async () => {
      try {
        const res = await fetchDriverDetail(id || "");
        console.log("dataDriver", res.data);
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
    <div className="card card-section-inline gap-4 flex-col">
      <div className="card-body">
        <div className="card-body-inline">
          <div className="img-square w-[30%] rounded-md overflow-hidden self-start">
            <Image
              src={`${driver.driver_image || "/assets/img/avatar.svg"}`}
              className="object-cover w-[128px] h-full"
              width={100}
              height={100}
              alt={driver.driver_name}
            />
          </div>
          <div className="card-content w-[70%]">
            <div className="card-content-top">
              <div className="card-title">{driver.driver_name}</div>
              <div className="supporting-text-group">
                <div className="supporting-text">{driver.driver_dept_sap || "-"}</div>
              </div>
            </div>

            <div className="card-item-group">
              {showPhone ? (
                <div className="card-item">
                  <i className="material-symbols-outlined">smartphone</i>
                  <span className="card-item-text">{driver.driver_contact_number}</span>
                </div>
              ) : (
                <>
                  <div className="card-item">
                    <i className="material-symbols-outlined">star</i>
                    <span className="card-item-text">{driver.driver_average_satisfaction_score}</span>
                  </div>
                  <div className="card-item">
                    <i className="material-symbols-outlined">person</i>
                    <span className="card-item-text">{driver.age}</span>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
        {seeDetail && (
          <div className="card-actioins w-full">
            <div className="flex gap-3">
              <button
                className={`btn btn-secondary flex-1`}
                onClick={
                  userKeyPickup
                    ? () => userKeyPickUpModalRef.current?.openModal()
                    : () => driverInfoModalRef.current?.openModal()
                }
              >
                ดูรายละเอียด
              </button>
              {selectDriver && (
                <button
                  className="btn btn-secondary flex-1"
                  onClick={() => adminDriverPickModalRef.current?.openModal()}
                >
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
                <div className="form-section-header-title">การนัดหมายพนักงานขับรถ</div>
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
                        <i className="material-symbols-outlined">calendar_month</i>
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

      <AdminDriverPickModal ref={adminDriverPickModalRef} reqId={reqId} onClickDetail={seeDriverDetail} />

      <DriverInfoModal
        ref={driverInfoModalRef}
        id={driverDetail?.mas_driver_uid}
        pickable={true}
        onBack={() => adminDriverPickModalRef.current?.openModal()}
      />

      {userKeyPickup && <UserKeyPickUpModal ref={userKeyPickUpModalRef} />}
    </div>
  );
}
