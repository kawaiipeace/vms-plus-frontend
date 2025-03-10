import React, { useState } from "react";
import CarDetailCard2 from "@/app/components/card/carDetailCard2";
import DriverTravelCard from "@/app/components/card/driverTravelCard";
import DriverPassengerInfoCard from "@/app/components/card/driverPassengerInfoCard";

export const DriverVIURequestDetail = () => {
  const [requestDetailType, setRequestDetailType] = useState("รอรับกุญแจ");
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
            <DriverTravelCard />
          </div>
          <div className="form-section">
            <div className="form-section-header">
              <div className="form-section-header-title">
                <p>ข้อมูลยานพาหนะ</p>
              </div>
            </div>
            <CarDetailCard2 />
          </div>
          <div className="form-section">
            <div className="form-section-header">
              <div className="form-section-header-title">
                <p>ผู้โดยสาร</p>
              </div>
            </div>
            <DriverPassengerInfoCard />
          </div>

          {requestDetailType === "รอรับกุญแจ" && (
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
                      <i className="material-symbols-outlined">calendar_month</i>
                      <div className="form-plaintext-group">
                        <div className="form-label">วันที่ / เวลา</div>
                        <div className="form-text">02/12/2566 10:30</div>
                      </div>
                    </div>
                    <div className="form-group form-plaintext">
                      <i className="material-symbols-outlined">approval_delegation</i>
                      <div className="form-plaintext-group">
                        <div className="form-label">สิ่งที่ส่งมอบ</div>
                        <div className="form-text">กุญแจหลัก และบัตรเติมน้ำมัน</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
