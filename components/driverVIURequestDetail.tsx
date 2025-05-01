import React, { useState } from "react";
import CarDetailCard2 from "@/components/card/carDetailCard2";
import DriverTravelCard from "@/components/card/driverTravelCard";
import DriverPassengerInfoCard from "@/components/card/driverPassengerInfoCard";
import KeyUserPickupCard from "./admin/key-handover/key-user-pickup-card";
import { RequestDetailType } from "@/app/types/request-detail-type";
import dayjs from "dayjs";

interface DriverDetailContentProps {
  data?: RequestDetailType;
  progressType: string;
}

export const DriverVIURequestDetail = ({
  data,
  progressType,
}: DriverDetailContentProps) => {
  const getDateRange = (format?: string) => {
    if (!data?.start_datetime || !data?.end_datetime) return;
    const { start_datetime: start, end_datetime: end } = data;

    const startDate = dayjs(start).format(format || "DD/MM/YYYY");
    const endDate = dayjs(end).format(format || "DD/MM/YYYY");

    return `${startDate} - ${endDate}`;
  };

  const date = getDateRange();
  const timeRange = getDateRange("HH:mm");

  return (
    <div>
      <div className="grid gird-cols-1 gap-4">
        <div className="w-full">
          <div className="form-section">
            <div className="form-section-header">
              <div className="form-section-header-title">
                <p>การเดินทาง</p>
              </div>
            </div>
            <DriverTravelCard
              location={data?.work_place}
              date={date}
              timeRange={timeRange}
              tripType={data?.trip_type}
            />
          </div>
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
                <p>ผู้โดยสาร</p>
              </div>
            </div>
            <DriverPassengerInfoCard
              displayLocation
              id={data?.trn_request_uid}
              requestData={data}
            />
          </div>
          <div className="form-section">
            <div className="form-section-header">
              <div className="form-section-header-title">ผู้ไปรับกุญแจ</div>
            </div>

            <KeyUserPickupCard requestData={data} />
          </div>

          {/* {requestDetailType === "รอรับกุญแจ" && (
            <div className="form-section">
              <div className="form-section-header">
                <div className="form-section-header-title">
                  <p>การรับกุญแจ</p>
                </div>
              </div>
              <div className="form-card">
                <div className="form-card-body">
                  <div className="grid grid-cols-1 gap-4">
                    <div className="form-group form-plaintext">
                      <i className="material-symbols-outlined">
                        calendar_month
                      </i>
                      <div className="form-plaintext-group">
                        <div className="form-label">วันที่ / เวลา</div>
                        <div className="form-text">02/12/2566 10:30</div>
                      </div>
                    </div>
                    <div className="form-group form-plaintext">
                      <i className="material-symbols-outlined">
                        approval_delegation
                      </i>
                      <div className="form-plaintext-group">
                        <div className="form-label">สิ่งที่ส่งมอบ</div>
                        <div className="form-text">
                          กุญแจหลัก และบัตรเติมน้ำมัน
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )} */}
        </div>
      </div>
    </div>
  );
};
