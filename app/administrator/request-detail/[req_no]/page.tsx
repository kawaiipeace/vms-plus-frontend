"use client";
import { useRef, useState } from "react";
import { useSidebar } from "@/app/contexts/sidebarContext";
import Header from "@/app/components/header";
import RequestDetailTabs from "@/app/components/admin/tabs/requestDetailTab";
import SideBar from "@/app/components/sideBar";
import CancelRequestModal from "@/app/components/modal/cancelRequestModal";
import Link from "next/link";
import FileBackRequestModal from "@/app/components/modal/fileBackModal";
import ApproveRequestModal from "@/app/components/modal/approveRequestModal";
import ConfirmKeyHandOverModal from "@/app/components/modal/confirmKeyHandOverModal";
import ReceiveCarVehicleModal from "@/app/components/modal/receiveCarVehicleModal";
import TravelCardModal from "@/app/components/modal/travelCardModal";
import ReturnCarAddModal from "@/app/components/modal/returnCarAddModal";
import ApproveRequestCheckCarModal from "@/app/components/modal/approveRequestCheckCarModal";
import RejectRequestCheckCarModal from "@/app/components/modal/rejectRequestCheckCarModal";

interface RequestNoProps {
  requestType?: "ให้กุญแจ" | "รับยานพาหนะ" | "คืนยานพาหนะ" | "ตรวจสอบยานพาหนะ" | "เสร็จสิ้น";
}

export default function RequestDetail() {
  const { isPinned } = useSidebar();
  const [requestType, setRequestType] = useState<RequestNoProps["requestType"]>("ตรวจสอบยานพาหนะ");
  const approveRequestModalRef = useRef<{
    openModal: () => void;
    closeModal: () => void;
  } | null>(null);
  const approveRequestCheckCarModalRef = useRef<{
    openModal: () => void;
    closeModal: () => void;
  } | null>(null);
  const cancelRequestModalRef = useRef<{
    openModal: () => void;
    closeModal: () => void;
  } | null>(null);
  const fileBackRequestModalRef = useRef<{
    openModal: () => void;
    closeModal: () => void;
  } | null>(null);
  const confirmKeyHandOverModalRef = useRef<{
    openModal: () => void;
    closeModal: () => void;
  } | null>(null);
  const receiveCarVehicleModalRef = useRef<{
    openModal: () => void;
    closeModal: () => void;
  } | null>(null);
  const TravelCardModalRef = useRef<{
    openModal: () => void;
    closeModal: () => void;
  } | null>(null);
  const returnCarAddModalRef = useRef<{
    openModal: () => void;
    closeModal: () => void;
  } | null>(null);
  const rejectRequestCheckCarModalRef = useRef<{
    openModal: () => void;
    closeModal: () => void;
  } | null>(null);

  return (
    <div>
      <div className="main-container">
        <SideBar menuName="ตรวจสอบและจัดการคำขอ" />

        <div className={`main-content ${isPinned ? "md:pl-[280px]" : "md:pl-[80px]"}`}>
          <Header />
          <div className="main-content-body">
            <div className="page-header">
              <div className="breadcrumbs text-sm">
                <ul>
                  <li className="breadcrumb-item">
                    <a>
                      <i className="material-symbols-outlined">home</i>
                    </a>
                  </li>
                  <li className="breadcrumb-item">
                    <Link href="/administrator">ตรวจสอบและจัดการคำขอ</Link>
                  </li>
                  <li className="breadcrumb-item active" aria-current="page">
                    เลขที่คำขอ VA67RA000001
                  </li>
                </ul>
              </div>

              <div className="page-group-header">
                <div className="page-title">
                  <span className="page-title-label">เลขที่คำขอ VA67RA000001</span>
                  <button className="text-sm">
                    <i className="material-symbols-outlined text-sm">content_copy</i>
                    คัดลอก
                  </button>

                  <span className="badge badge-pill-outline badge-info">รออนุมัติ</span>
                </div>

                {requestType !== "เสร็จสิ้น" && (
                  <button className="btn btn-tertiary-danger bg-transparent shadow-none border-none" onClick={() => cancelRequestModalRef.current?.openModal()}>
                    ยกเลิกคำขอ
                  </button>
                )}

                <button className="btn btn-secondary">
                  <i className="material-symbols-outlined">print</i>พิมพ์
                </button>

                {requestType === "คืนยานพาหนะ" && (
                  <button className="btn btn-secondary" onClick={() => TravelCardModalRef.current?.openModal()}>
                    <i className="material-symbols-outlined">id_card</i>แสดงบัตรเดินทาง
                  </button>
                )}

                {requestType === "ตรวจสอบยานพาหนะ" && (
                  <button className="btn btn-secondary" onClick={() => rejectRequestCheckCarModalRef.current?.openModal()}>
                    <i className="material-symbols-outlined">reply</i>
                    ตีกลับยานพาหนะ
                  </button>
                )}

                {requestType === "ให้กุญแจ" && (
                  <button className="btn btn-primary" onClick={() => confirmKeyHandOverModalRef.current?.openModal()}>
                    <i className="material-symbols-outlined">passkey</i>
                    ให้กุญแจ
                  </button>
                )}
                {requestType === "รับยานพาหนะ" && (
                  <button className="btn btn-primary" onClick={() => receiveCarVehicleModalRef.current?.openModal()}>
                    <i className="material-symbols-outlined">directions_car</i>
                    รับยานพาหนะ
                  </button>
                )}
                {requestType === "คืนยานพาหนะ" && (
                  <button className="btn btn-primary" onClick={() => returnCarAddModalRef.current?.openModal()}>
                    <i className="material-symbols-outlined">reply</i>
                    คืนยานพาหนะ
                  </button>
                )}
                {requestType === "ตรวจสอบยานพาหนะ" && (
                  <button className="btn btn-primary" onClick={() => approveRequestCheckCarModalRef.current?.openModal()}>
                    <i className="material-symbols-outlined">check</i>
                    ผ่านการตรวจสอบ
                  </button>
                )}
              </div>
            </div>

            <RequestDetailTabs status="detail" requestType={requestType} />
          </div>
        </div>
      </div>
      <CancelRequestModal ref={cancelRequestModalRef} title="ยืนยันยกเลิกคำขอ?" desc="ยานพาหนะและพนักงานขับรถที่จองไว้จะถูกยกเลิก" confirmText="ยกเลิกคำขอ" />
      <FileBackRequestModal ref={fileBackRequestModalRef} title="ยืนยันตีกลับคำขอ" desc="ระบบจะแจ้งเตือนผู้สร้างคำขอ ผู้ใช้ยานพาหนะ และผู้ขับขี่ ให้ดำเนินการแก้ไขและส่งคำขอใหม่อีกครั้ง" confirmText="โปรดระบุเหตุผลที่ตีกลับ" />

      <ApproveRequestModal ref={approveRequestModalRef} title={"ยืนยันอนุมัติคำขอ"} desc={"คุณต้องการอนุมัติคำขอใช้ยานพาหนะหรือไม่ ?"} confirmText="อนุมัติคำขอ" />
      <ApproveRequestCheckCarModal title={"ยืนยันการคืนยานพาหนะ"} desc={"คุณได้ตรวจสอบข้อมูลการคืนยานพาหนะ รับกุญแจ บัตรเติมน้ำมัน และยานพาหนะคืนเรียบร้อยแล้วใช่หรือไม่ ?"} confirmText="ผ่านการตรวจสอบ" ref={approveRequestCheckCarModalRef} />
      <RejectRequestCheckCarModal title={"ยืนยันตีกลับยานพาหนะ"} desc={"ระบบจะแจ้งเตือนผู้สร้างคำขอ ผู้ใช้ยานพาหนะ และผู้ขับขี่ ให้ดำเนินการแก้ไขและคืนยานพาหนะใหม่อีกครั้ง"} confirmText="ตีกลับยานพาหนะ" ref={rejectRequestCheckCarModalRef} />
      <ConfirmKeyHandOverModal ref={confirmKeyHandOverModalRef} />
      <ReceiveCarVehicleModal status="" ref={receiveCarVehicleModalRef} />
      <TravelCardModal ref={TravelCardModalRef} />
      <ReturnCarAddModal useBy="driver" ref={returnCarAddModalRef} />
    </div>
  );
}
