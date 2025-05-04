import React, { useRef } from "react";
import ReceiveCarVehicleModal from "@/components/modal/receiveCarVehicleModal";
import ReturnCarAddModal from "@/components/modal/returnCarAddModal";
import ReturnCarAddStep2Modal from "@/components/modal/returnCarAddStep2Modal";
import { ReturnCarInfoCard } from "@/components/card/returnCarInfoCard";
import AlertCustom from "@/components/alertCustom";
import { DriverReceiveCarInfoCard } from "@/components/card/driverReceiveCarInfoCard";
import ImagesCarCard from "@/components/card/ImagesCarCard";
import { RequestDetailType } from "@/app/types/request-detail-type";
import dayjs from "dayjs";

dayjs.extend(require("dayjs/plugin/buddhistEra"));
dayjs.locale("th");

interface DriverEditContentProps {
  data?: RequestDetailType;
  progressType: string;
}

export const DriverEditContent = ({
  data,
  progressType,
}: DriverEditContentProps) => {
  const receiveCarVehicleModalRef = useRef<{
    openModal: () => void;
    closeModal: () => void;
  } | null>(null);
  const returnCarAddModalRef = useRef<{
    openModal: () => void;
    closeModal: () => void;
  } | null>(null);
  const returnCarAddStep2ModalRef = useRef<{
    openModal: () => void;
    closeModal: () => void;
  } | null>(null);
  return (
    <>
      {progressType === "คืนยานพาหนะไม่สำเร็จ" && (
        <AlertCustom
          title="ถูกตีกลับโดยผู้ดูแลยานพาหนะ"
          desc="เหตุผล: กรุณาเติมเชื้อเพลิงและดูแลความสะอาด ก่อนคืนยานพาหนะ"
        />
      )}
      <div className="grid md:grid-cols-2 gird-cols-1">
        <div className="w-full row-start-2 md:col-start-1">
          {progressType === "การรับยานพาหนะ" && (
            <>
              <div className="form-section">
                <div className="form-section-header">
                  <div className="form-section-header-title">
                    <p>ข้อมูลการรับยานพาหนะ</p>
                  </div>

                  <div className="form-section-header-actions">
                    <button
                      className="btn bg-transparent border-none shadow-none hover:bg-transparent text-[#A80689]"
                      onClick={() =>
                        receiveCarVehicleModalRef.current?.openModal()
                      }
                    >
                      แก้ไข
                    </button>
                  </div>
                </div>

                <DriverReceiveCarInfoCard
                  date={
                    data?.accepted_vehicle_datetime
                      ? dayjs(data?.pickup_datetime).format("DD/MM/BBBB")
                      : "-"
                  }
                  time={
                    data?.accepted_vehicle_datetime
                      ? dayjs(data?.pickup_datetime).format("HH:mm")
                      : "-"
                  }
                  mile_end={data?.mile_start?.toString() || "-"}
                  fuel_end={data?.fuel_start?.toString() || "-"}
                  remark={data?.remark || "-"}
                />
              </div>

              <div className="form-section">
                <div className="form-section-header">
                  <div className="form-section-header-title">
                    <p>รูปยานพาหนะก่อนเดินทาง</p>
                  </div>
                  <div className="form-section-header-actions">
                    <button
                      className="btn bg-transparent border-none shadow-none hover:bg-transparent text-[#A80689]"
                      onClick={() =>
                        returnCarAddStep2ModalRef.current?.openModal()
                      }
                    >
                      แก้ไข
                    </button>
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

          {(progressType === "การคืนยานพาหนะ" ||
            progressType === "คืนยานพาหนะไม่สำเร็จ") && (
            <>
              <div className="form-section">
                <div className="form-section-header">
                  <div className="form-section-header-title">
                    <p>ข้อมูลการคืนยานพาหนะ</p>
                  </div>

                  <div className="form-section-header-actions">
                    <button
                      className="btn bg-transparent border-none shadow-none hover:bg-transparent text-[#A80689]"
                      onClick={() => returnCarAddModalRef.current?.openModal()}
                    >
                      แก้ไข
                    </button>
                  </div>
                </div>

                <ReturnCarInfoCard data={data} />
              </div>

              <div className="form-section">
                <div className="form-section-header">
                  <div className="form-section-header-title">
                    <p>รูปยานพาหนะก่อนเดินทาง</p>
                  </div>
                  <div className="form-section-header-actions">
                    <button
                      className="btn bg-transparent border-none shadow-none hover:bg-transparent text-[#A80689]"
                      onClick={() =>
                        returnCarAddStep2ModalRef.current?.openModal()
                      }
                    >
                      แก้ไข
                    </button>
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
              {progressType === "คืนยานพาหนะไม่สำเร็จ" && (
                <div className="w-full mt-8">
                  <button
                    className="btn btn-primary w-full"
                    onClick={() => returnCarAddModalRef.current?.openModal()}
                  >
                    คืนยานพาหนะอีกครั้ง
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
      <ReceiveCarVehicleModal
        status="edit"
        requestData={data}
        role="driver"
        ref={receiveCarVehicleModalRef}
      />
      <ReturnCarAddModal
        useBy="driver"
        requestData={data}
        ref={returnCarAddModalRef}
        progress={progressType}
      />
      <ReturnCarAddStep2Modal
        status="edit"
        useBy="driver"
        openStep1={() => () => {}}
        requestData={data}
        ref={returnCarAddStep2ModalRef}
        progress={progressType}
      />
    </>
  );
};
