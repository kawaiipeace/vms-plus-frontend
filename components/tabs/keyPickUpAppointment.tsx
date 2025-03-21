import React from "react";
import AppointmentDriverCard from "@/app/components/card/appointmentDriverCard";
import CarDetailCard2 from "@/app/components/card/carDetailCard2";
import UserInfoCard from "@/app/components/card/userInfoCard";

const KeyPickUpAppointment = () => {
  return (
    <>
      <div className="grid md:grid-cols-2 gird-cols-1 gap-4">
        <div className="w-full row-start-2 md:col-start-1">
          <div className="form-section">
            <div className="form-section-header">
              <div className="form-section-header-title">
                <p>การนัดหมายเดินทาง</p>
                <p className="text-sm text-gray-500 font-normal">พนักงานขับรถจะเป็นผู้มารับกุญแจและนำยานพาหนะไปรอรับผู้โดยสารตามสถานที่ วัน และเวลาที่กำหนด</p>
              </div>
            </div>

            <AppointmentDriverCard />
          </div>
        </div>

        <div className="col-span-1 row-start-1 md:row-start-2">
          <div className="form-section">
            <div className="form-section-header">
              <div className="form-section-header-title">ข้อมูลยานพาหนะและผู้ขับขี่</div>
            </div>

            <CarDetailCard2 />
            <div className="mt-5">
              <UserInfoCard />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default KeyPickUpAppointment;
