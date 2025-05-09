import React from "react";
import Image from "next/image";
import ZeroRecord from "../zeroRecord";
import RequestStatusBox from "../requestStatusBox";
import ArpproveFlow from "./approveFlow";

export default function Main() {


  return (
      <div className="py-4">
        <div className="grid grid-cols-4 gap-4 mb-4">
          <RequestStatusBox
            iconName="schedule"
            status="info"
            title="รออนุมัติ"
            number={3}
          />
          <RequestStatusBox
            iconName="reply"
            status="warning"
            title="ตีกลับคำขอ"
            number={1}
          />
             <RequestStatusBox
            iconName="check"
            status="success"
            title="อนุมัติ"
            number={1}
          />
             <RequestStatusBox
            iconName="delete"
            status="default"
            title="ยกเลิกคำขอ"
            number={1}
          />
        </div>

        <ArpproveFlow />

        <div className="hidden">
          <ZeroRecord
            imgSrc="/assets/img/empty/create_request_empty state_vehicle.svg"
            title="ไม่พบคำขอใช้ยานพาหนะ"
            desc={<>เปลี่ยนคำค้นหรือเงื่อนไขแล้วลองใหม่อีกครั้ง</>}
            button="ล้างตัวกรอง"
          />
        </div>

        <div className="dt-table-emptyrecord hidden">
          <div className="emptystate">
            <Image
              src="/assets/img/empty/add_carpool.svg"
              width={100}
              height={100}
              alt=""
            />
            <div className="emptystate-title">ไม่มีกลุ่มยานพาหนะ</div>
            <div className="emptystate-text">
              เริ่มสร้างกลุ่มยานพาหนะกลุ่มแรก
            </div>
            <div className="emptystate-action">
              <button className="btn btn-primary">
                <i className="material-symbols-outlined">add</i>
                สร้างกลุ่มยานพาหนะ
              </button>
            </div>
          </div>
        </div>
      </div>
  );
}
