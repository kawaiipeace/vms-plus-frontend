import { DriverType } from "@/app/types/driver-user-type";
import DriverInfoModal from "@/components/modal/driverInfoModal";
import { fetchDriverDetail } from "@/services/masterService";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import AdminDriverPickModal from "../modal/adminDriverPickModal";
import { convertToBuddhistDateTime } from "@/utils/converToBuddhistDateTime";
import { RequestDetailType } from "@/app/types/request-detail-type";
import ChooseDriverCard from "./chooseDriverCard";

interface DriverSmallInfoCardProps {
  userKeyPickup?: boolean;
  id?: string;
  seeDetail?: boolean;
  requestData?: RequestDetailType;
  driverDetail?: DriverType;
  showPhone?: boolean;
  selectDriver?: boolean;
  reqId?: string;
  noBack?: boolean;
  pickupPlace?: string;
  pickupDatetime?: string;
  onUpdate?: () => void;
}

export default function DriverSmallInfoCard({
  userKeyPickup,
  seeDetail,
  requestData,
  driverDetail,
  showPhone,
  id,
  selectDriver,
  reqId,
  noBack,
  pickupPlace,
  pickupDatetime,
  onUpdate,
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
        {requestData?.can_choose_driver === false && (
          <>
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
                  <div className="card-title">
                    {driver.driver_name}{" "}
                    {driver?.driver_nickname
                      ? "(" + driver?.driver_nickname + ")"
                      : ""}
                  </div>
                  <div className="supporting-text-group">
                    <div className="supporting-text">
                      {driver.vendor_name || "-"}
                    </div>
                  </div>
                </div>

                <div className="card-item-group">
                  {showPhone ? (
                    <div className="card-item">
                      <i className="material-symbols-outlined">smartphone</i>
                      <span className="card-item-text">
                        {driver.driver_contact_number}
                      </span>
                    </div>
                  ) : (
                    <>
                      <div className="card-item">
                        <i className="material-symbols-outlined">star</i>
                        <span className="card-item-text">
                          {driver.driver_average_satisfaction_score ||
                            "ยังไม่มีการให้คะแนน"}
                        </span>
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
                      // userKeyPickup
                      //   ? () => userKeyPickUpModalRef.current?.openModal()
                      () => driverInfoModalRef.current?.openModal()
                    }
                  >
                    ดูรายละเอียด
                  </button>
                  {selectDriver && (
                    <button
                      className="btn btn-secondary flex-1"
                      onClick={() =>
                        adminDriverPickModalRef.current?.openModal()
                      }
                    >
                      เลือกพนักงานขับรถ
                    </button>
                  )}
                </div>
              </div>
            )}
          </>
        )}
        {requestData?.can_choose_driver === true && (
          <>
            <ChooseDriverCard
              requestData={requestData}
              number={requestData?.number_of_available_drivers}
            />
          </>
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
                          <div className="form-text">{pickupPlace}</div>
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
                          <div className="form-text">
                            {convertToBuddhistDateTime(pickupDatetime || "")
                              .date +
                              convertToBuddhistDateTime(pickupDatetime || "")
                                .time}
                          </div>
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

      <AdminDriverPickModal
        ref={adminDriverPickModalRef}
        requestData={requestData}
        reqId={reqId}
        onClickDetail={seeDriverDetail}
        onUpdate={onUpdate}
      />

      {noBack && (
        <DriverInfoModal
          ref={driverInfoModalRef}
          id={driverDetail?.mas_driver_uid}
          pickable={false}
        />
      )}

      {!noBack && (
        <DriverInfoModal
          ref={driverInfoModalRef}
          id={driverDetail?.mas_driver_uid}
          pickable={true}
          onPick={onUpdate}
          onBack={() => adminDriverPickModalRef.current?.openModal()}
        />
      )}

      {/* {userKeyPickup && <UserKeyPickUpModal ref={userKeyPickUpModalRef} />} */}
    </div>
  );
}
