"use client";
import { useRef } from "react";
import { useSidebar } from "@/app/contexts/sidebarContext";
import Header from "@/app/components/header";
import RequestDetailTabs from "@/app/components/requestDetailTab";
import SideBar from "@/app/components/sideBar";
import CancelRequestModal from "@/app/components/cancelRequestModal";
import Link from "next/link";
import PassVerifyModal from "@/app/components/modal/passVerifyModal";
export default function RequestDetail() {
    const { isPinned } = useSidebar();
   const cancelRequestModalRef = useRef<{
      openModal: () => void;
      closeModal: () => void;
    } | null>(null);
    const passVerifyModalRef = useRef<{
      openModal: () => void;
      closeModal: () => void;
    } | null>(null);
  return (
    <div>
      <div className="main-container">
        <SideBar menuName="คำขอใช้ยานพาหนะ" />

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
                    <Link href="../">คำขอใช้ยานพาหนะ</Link>
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
                  <i className="material-symbols-outlined text-sm">content_copy</i>
                  คัดลอก
                  </button>
               
                  <span className="badge badge-pill-outline badge-error">
                    ถูกตีกลับ
                  </span>
                </div>

                <button
                  className="btn btn-tertiary-danger bg-transparent shadow-none border-none"
                  onClick={() => passVerifyModalRef.current?.openModal()}
                >
                  ยกเลิกคำขอ
                </button>
                <button className="btn btn-secondary">
                  <i className="material-symbols-outlined">print</i>พิมพ์
                </button>
              </div>
            </div>

            <RequestDetailTabs status="edit" />



          </div>
        </div>
      </div>
      <PassVerifyModal ref={passVerifyModalRef} title="ยืนยันผ่านการตรวจสอบ" desc="คุณต้องการยืนยันผ่านการตรวจสอบ และส่งคำขอไปยังผู้อนุมัติใช้ยานพาหนะหรือไม่ ?"/>
      <CancelRequestModal ref={cancelRequestModalRef} title="ยกเลิกคำขอ" desc="ยกเลิกคำขอ" confirmText="ยกเลิกคำขอ" />
    </div>
  );
}
