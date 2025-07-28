import { RequestDetailType } from "@/app/types/request-detail-type";
import AlertCustom from "@/components/alertCustom";
import CarDetailCard2 from "@/components/card/carDetailCard2";
import DriverPickUpPassengerCard from "@/components/card/driverPickUpPassengerCard";
import { DriverReceiveCarInfoCard } from "@/components/card/driverReceiveCarInfoCard";
import DriverWaitKeyCard from "@/components/card/driverWaitKeyCard";
import ImagesCarCard from "@/components/card/ImagesCarCard";
import { ReturnCarInfoCard } from "@/components/card/returnCarInfoCard";
import UserInfoCard from "@/components/card/userInfoCard";
import ReceiveCarVehicleModal from "@/components/modal/receiveCarVehicleModal";
import ReturnCarAddModal from "@/components/modal/returnCarAddModal";
import RequestStatusBox from "@/components/requestStatusBox";
import RecordFuelTab from "@/components/tabs/recordFuelTab";
import RecordTravelTab from "@/components/tabs/recordTravelTab";
import dayjs from "dayjs";
import Link from "next/link";
import { useRef, useState } from "react";
// import DriverPassengerInfoCard from "./card/driverPassengerInfoCard";
import KeyPickupDetailModal from "./modal/keyPickUpDetailModal";
import { convertToBuddhistDateTime } from "@/utils/converToBuddhistDateTime";

interface DriverDetailContentProps {
  data?: RequestDetailType;
  progressType: string;
}

const DriverDetailContent = ({
  data,
  progressType,
}: DriverDetailContentProps) => {
  const [activeTab, setActiveTab] = useState(0);

  const keyPickupDetailModalRef = useRef<{
    openModal: () => void;
    closeModal: () => void;
  } | null>(null);
  const receiveCarVehicleModalRef = useRef<{
    openModal: () => void;
    closeModal: () => void;
  } | null>(null);
  const returnCarAddModalRef = useRef<{
    openModal: () => void;
    closeModal: () => void;
  } | null>(null);

  const tabs = [
    {
      label: "ข้อมูลการเดินทาง",
      content: (
        <>
          <RecordTravelTab
            requestId={data?.trn_request_uid}
            role="driver"
            data={data}
          />
        </>
      ),
      badge: "",
    },
    {
      label: "การเติมเชื้อเพลิง",
      content: (
        <>
          <RecordFuelTab
            requestId={data?.trn_request_uid}
            role="driver"
            requestData={data}
          />
        </>
      ),
      badge: "",
    },
  ];

  return (
    <div>
      {progressType !== "การรับยานพาหนะ" &&
        progressType !== "การคืนยานพาหนะ" && (
          <div className="card card-body p-0 !border-0 !rounded-none">
            <div className="flex items-center -mx-4 px-4">
              <p>{data?.request_no || "-"}</p>
              <Link
                className="ml-auto"
                href={
                  progressType === "คืนยานพาหนะไม่สำเร็จ"
                    ? "/vehicle-in-use/driver/edit/" +
                      data?.trn_request_uid +
                      "?progressType=" +
                      progressType
                    : "/vehicle-in-use/driver/request-list/" +
                      data?.trn_request_uid +
                      "?progressType=" +
                      progressType
                }
              >
                <button className="btn bg-transparent border-0 shadow-none text-[#A80689] p-1">
                  รายละเอียด{" "}
                  <i className="material-symbols-outlined">
                    keyboard_arrow_right
                  </i>
                </button>
              </Link>
            </div>
          </div>
        )}

      {(data?.can_cancel_request === false ||
        data?.ref_request_status_code === "90") && (
        <AlertCustom title="งานถูกยกเลิกแล้ว" desc="ยกเลิกเมื่อ 25/12/2566" />
      )}

      {(progressType === "รอรับกุญแจ" || progressType === "ยกเลิกภารกิจ") && (
        <div className="grid gird-cols-1 gap-4">
          <div className="w-full">
            <div className="form-section">
              <div className="form-section-header">
                <div className="form-section-header-title">
                  <p>การรับกุญแจ</p>
                  <p className="text-sm text-gray-500 font-normal">
                    กรุณาไปรับกุญแจตามสถานที่ ในวันและเวลาที่กำหนด
                  </p>
                </div>
              </div>
              <DriverWaitKeyCard
                received_key_place={data?.received_key_place || "-"}
                received_key_datetime={data?.received_key_datetime || ""}
                received_key_start_datetime={
                  data?.received_key_start_datetime || ""
                }
                received_key_end_datetime={
                  data?.received_key_end_datetime || ""
                }
              />
            </div>
            <div className="form-section">
              <div className="form-section-header">
                <div className="form-section-header-title">
                  <p>การรับผู้โดยสาร</p>
                  <p className="text-sm text-gray-500 font-normal">
                    กรุณาไปรับผู้โดยสารตามวัน เวลา และสถานที่ดังนี้
                  </p>
                </div>
              </div>
              <DriverPickUpPassengerCard
                pickup_place={data?.pickup_place || "-"}
                pickup_datetime={data?.pickup_datetime || ""}
                number_of_passengers={data?.number_of_passengers || 0}
              />
            </div>
            <div className="form-section">
              <div className="form-section-header">
                <div className="form-section-header-title">
                  <p>ข้อมูลผู้ดูแลยานพาหนะ</p>
                </div>
              </div>
              <UserInfoCard
                displayOn="driver"
                displayBtnMore={true}
                vehicleUserData={
                  data?.vehicle?.vehicle_department?.vehicle_user
                }
              />
            </div>
          </div>
          {progressType === "รอรับกุญแจ" && (
            <button
              className="btn btn-primary w-full mt-5"
              onClick={() => keyPickupDetailModalRef.current?.openModal()}
            >
              รับกุญแจ
            </button>
          )}
          <KeyPickupDetailModal
            reqId={data?.trn_request_uid || ""}
            imgSrc={data?.received_key_image_url || "/assets/img/avatar.svg"}
            ref={keyPickupDetailModalRef}
            id={data?.received_key_emp_id || ""}
            name={data?.received_key_emp_name || "-"}
            keyStartTime={data?.received_key_start_datetime || ""}
            deptSap={data?.received_key_dept_sap || "-"}
            phone={data?.received_key_mobile_contact_number || "-"}
            vehicle={data?.vehicle}
            role="driver"
            deptSapShort={
              data?.received_key_position
                ? data?.received_key_position +
                  " " +
                  data?.received_key_dept_sap_short
                : data?.received_key_dept_sap_short || "-"
            }
          />
        </div>
      )}

      {progressType === "รอรับยานพาหนะ" && (
        <>
          <div className="grid gird-cols-1 gap-4">
            <div className="w-full">
              <div className="form-section">
                <div className="form-section-header">
                  <div className="form-section-header-title">
                    <p>ข้อมูลยานพาหนะ</p>
                  </div>
                </div>
                <CarDetailCard2 vehicle={data?.vehicle} />
              </div>
              <div className="form-section">
                <div className="form-section-header">
                  <div className="form-section-header-title">
                    <p>สถานที่จอดรถ</p>
                  </div>
                </div>
                <div className="form-card">
                  <div className="form-card-body">
                    <div className="grid grid-cols-12">
                      <div className="col-span-12 md:col-span-6">
                        <div className="form-group form-plaintext">
                          <i className="material-symbols-outlined">
                            local_parking
                          </i>
                          <div className="form-plaintext-group">
                            <div className="form-text">
                              {data?.parking_place || "-"}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="form-section">
                <div className="form-section-header">
                  <div className="form-section-header-title">
                    <p>การรับผู้โดยสาร</p>
                    <p className="text-sm text-gray-500 font-normal">
                      กรุณาไปรับผู้โดยสารตามวัน เวลา และสถานที่ดังนี้
                    </p>
                  </div>
                </div>
                <DriverPickUpPassengerCard
                  pickup_place={data?.pickup_place || "-"}
                  pickup_datetime={data?.pickup_datetime || ""}
                  number_of_passengers={data?.number_of_passengers || 0}
                />
              </div>
              <div className="form-section">
                <div className="form-section-header">
                  <div className="form-section-header-title">
                    <p>ผู้โดยสาร</p>
                  </div>
                </div>
                {/* <DriverPassengerInfoCard
                  id={data?.trn_request_uid}
                  requestData={data}
                /> */}
                <UserInfoCard
                  displayOn="driver"
                  displayBtnMore={true}
                  vehicleUserData={
                    data?.vehicle?.vehicle_department?.vehicle_user
                  }
                />
              </div>
            </div>
          </div>
          <div className="mt-8">
            <button
              type="button"
              className="btn btn-primary w-full"
              onClick={() => receiveCarVehicleModalRef.current?.openModal()}
            >
              รับยานพาหนะ
            </button>
          </div>
          <ReceiveCarVehicleModal
            role="driver"
            status=""
            requestData={data}
            ref={receiveCarVehicleModalRef}
          />
        </>
      )}

      {(progressType === "บันทึกการเดินทาง" ||
        progressType === "บันทึกการเติมเชื้อเพลิง" ||
        progressType === "รอการตรวจสอบ" ||
        progressType === "คืนยานพาหนะไม่สำเร็จ" ||
        progressType === "ภารกิจสำเร็จ") && (
        <>
          <div className="w-full">
            <div className="grid grid-cols-2 gap-4 my-4">
              <Link
                href={
                  progressType === "ภารกิจสำเร็จ"
                    ? "/vehicle-in-use/driver/" +
                      data?.trn_request_uid +
                      "?progressType=การรับยานพาหนะ"
                    : "/vehicle-in-use/driver/edit/" +
                      data?.trn_request_uid +
                      "?progressType=การรับยานพาหนะ"
                }
              >
                <RequestStatusBox
                  iconName="directions_car"
                  status="info"
                  title="รับยานพาหนะ"
                />
              </Link>
              {progressType === "คืนยานพาหนะไม่สำเร็จ" ||
              progressType === "บันทึกการเดินทาง" ? (
                <div
                  onClick={() => returnCarAddModalRef.current?.openModal()}
                  className="cursor-pointer"
                >
                  <RequestStatusBox
                    iconName="reply"
                    status="warning"
                    title="คืนยานพาหนะ"
                  />
                </div>
              ) : (
                <Link
                  href={
                    progressType === "ภารกิจสำเร็จ"
                      ? "/vehicle-in-use/driver/" +
                        data?.trn_request_uid +
                        "?progressType=การคืนยานพาหนะ"
                      : "/vehicle-in-use/driver/edit/" +
                        data?.trn_request_uid +
                        "?progressType=การคืนยานพาหนะ"
                  }
                >
                  <RequestStatusBox
                    iconName="reply"
                    status="warning"
                    title="คืนยานพาหนะ"
                  />
                </Link>
              )}
            </div>
            {progressType === "คืนยานพาหนะไม่สำเร็จ" && (
              <AlertCustom
                title="ถูกตีกลับโดยผู้ดูแลยานพาหนะ"
                desc="เหตุผล: กรุณาเติมเชื้อเพลิงและดูแลความสะอาด ก่อนคืนยานพาหนะ"
              />
            )}
          </div>
          <div className="w-full overflow-x-auto">
            <div className="flex border-b tablist w-[100vw] max-w-[100vw] overflow-auto">
              {tabs.map((tab, index) => (
                <button
                  key={index}
                  className={`tab transition-colors duration-300 ease-in-out ${
                    activeTab === index ? "active" : "text-gray-600"
                  }`}
                  onClick={() => setActiveTab(index)}
                >
                  <div className="flex gap-2 items-center">
                    {tab.label}
                    {tab.badge && (
                      <span className="badge badge-brand badge-pill-outline">
                        4
                      </span>
                    )}{" "}
                  </div>
                </button>
              ))}
            </div>
          </div>
          <div className="mt-4">{tabs[activeTab].content}</div>
        </>
      )}

      {progressType === "การรับยานพาหนะ" && (
        <>
          <div className="form-section">
            <div className="form-section-header">
              <div className="form-section-header-title">
                <p>ข้อมูลการรับยานพาหนะ</p>
              </div>
            </div>

            <DriverReceiveCarInfoCard
              date={
                data?.accepted_vehicle_datetime
                  ? dayjs(data?.accepted_vehicle_datetime).format("DD/MM/YYYY")
                  : "-"
              }
              time={
                data?.accepted_vehicle_datetime
                  ? convertToBuddhistDateTime(data?.accepted_vehicle_datetime)
                      .time
                  : "-"
              }
              mile_end={data?.mile_end?.toString() || "-"}
              fuel_end={data?.fuel_end?.toString() || "-"}
              remark={data?.remark || "-"}
            />
          </div>

          <div className="form-section">
            <div className="form-section-header">
              <div className="form-section-header-title">
                <p>รูปยานพาหนะก่อนเดินทาง</p>
              </div>
            </div>

            <ImagesCarCard
              images={
                data?.vehicle_images_received?.map(
                  (image) => image.vehicle_img_file || ""
                ) || []
              }
            />
          </div>
        </>
      )}

      {progressType === "การคืนยานพาหนะ" && (
        <>
          <div className="form-section">
            <div className="form-section-header">
              <div className="form-section-header-title">
                <p>ข้อมูลการคืนยานพาหนะ</p>
              </div>
            </div>

            <ReturnCarInfoCard data={data} />
          </div>

          <div className="form-section">
            <div className="form-section-header">
              <div className="form-section-header-title">
                <p>รูปยานพาหนะก่อนเดินทาง</p>
              </div>
            </div>

            <ImagesCarCard
              images={
                data?.vehicle_images_returned?.map(
                  (image) => image.vehicle_img_file || ""
                ) || []
              }
            />
          </div>
        </>
      )}
      <ReturnCarAddModal
        useBy="driver"
        progress={progressType}
        ref={returnCarAddModalRef}
        requestData={data}
      />
    </div>
  );
};

export default DriverDetailContent;
