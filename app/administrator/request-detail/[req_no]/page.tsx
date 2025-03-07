"use client";
import { useRef } from "react";
import { useSidebar } from "@/app/contexts/sidebarContext";
import Header from "@/app/components/header";
import RequestDetailTabs from "@/app/components/admin/tabs/requestDetailTab";
import SideBar from "@/app/components/sideBar";
import CancelRequestModal from "@/app/components/modal/cancelRequestModal";
import Link from "next/link";
import FileBackRequestModal from "@/app/components/modal/fileBackModal";
import ApproveRequestModal from "@/app/components/modal/approveRequestModal";
import ConfirmKeyHandOverModal from "@/app/components/modal/confirmKeyHandOverModal";
export default function RequestDetail() {
  const { isPinned } = useSidebar();
  const approveRequestModalRef = useRef<{
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

  return (
    <div>
      <div className="main-container">
        <SideBar menuName="ตรวจสอบและจัดการคำขอ" />

        <div
          className={`main-content ${
            isPinned ? "md:pl-[280px]" : "md:pl-[80px]"
          }`}
        >
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
                  <span className="page-title-label">
                    เลขที่คำขอ VA67RA000001
                  </span>
                  <button className="text-sm">
                    <i className="material-symbols-outlined text-sm">
                      content_copy
                    </i>
                    คัดลอก
                  </button>

                  <span className="badge badge-pill-outline badge-info">
                    รออนุมัติ
                  </span>
                </div>

                <button
                  className="btn btn-tertiary-danger bg-transparent shadow-none border-none"
                  onClick={() => cancelRequestModalRef.current?.openModal()}
                >
                  ยกเลิกคำขอ
                </button>
                <button className="btn btn-secondary">
                  <i className="material-symbols-outlined">print</i>พิมพ์
                </button>
             
                  
                 
                    <button
                      className="btn btn-primary"
                      onClick={() =>
                        confirmKeyHandOverModalRef.current?.openModal()
                      }
                    >
                      <i className="material-symbols-outlined">passkey</i>
                      ให้กุญแจ
                    </button>
                
             
              </div>
            </div>

            <RequestDetailTabs status="detail" />
          </div>
        </div>
      </div>
      <CancelRequestModal
        ref={cancelRequestModalRef}
        title="ยืนยันยกเลิกคำขอ?"
        desc="ยานพาหนะและพนักงานขับรถที่จองไว้จะถูกยกเลิก"
        confirmText="ยกเลิกคำขอ"
      />
      <FileBackRequestModal ref={fileBackRequestModalRef}   title="ยืนยันตีกลับคำขอ"
        desc="ระบบจะแจ้งเตือนผู้สร้างคำขอ ผู้ใช้ยานพาหนะ และผู้ขับขี่ ให้ดำเนินการแก้ไขและส่งคำขอใหม่อีกครั้ง"
        confirmText="โปรดระบุเหตุผลที่ตีกลับ"/>

      <ApproveRequestModal
        ref={approveRequestModalRef}
        title={"ยืนยันอนุมัติคำขอ"}
        desc={"คุณต้องการอนุมัติคำขอใช้ยานพาหนะหรือไม่ ?"}
        confirmText="อนุมัติคำขอ"
      />

      <ConfirmKeyHandOverModal ref={confirmKeyHandOverModalRef} />
    </div>
  );
}
