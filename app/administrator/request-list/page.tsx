"use client";
import { useSidebar } from "@/contexts/sidebarContext";
import Header from "@/components/header";
import SideBar from "@/components/sideBar";
import ToastCustom from "@/components/toastCustom";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import ApproveVehicleForAdminTabs from "@/components/tabs/approveVehicleForAdminTabs";

function RequestListContent() {
  const searchParams = useSearchParams();
  const sendbackReq = searchParams.get("sendback-req");
  const cancelReq = searchParams.get("cancel-req");
  const approveReq = searchParams.get("approve-req");
  const requestId = searchParams.get("request-id");

  return (
    <>
      {sendbackReq === "success" && (
        <ToastCustom
          title="ตีกลับคำขอสำเร็จ"
          desc={
            <>
              คำขอใช้ยานพาหนะเลขที่ {requestId}
              <br />
              ถูกตีกลับเรียบร้อยแล้ว
            </>
          }
          status="success"
        />
      )}
      {approveReq === "success" && (
        <ToastCustom
          title="อนุมัติคำขอสำเร็จ"
          desc={
            <>
              คำขอใช้ยานพาหนะเลขที่ {requestId}
              <br />
              ผ่านการอนุมัติเรียบร้อยแล้ว
            </>
          }
          status="success"
        />
      )}
      {cancelReq === "success" && (
        <ToastCustom
          title="ยกเลิกคำขอสำเร็จ"
          desc={
            <>
              คำขอใช้ยานพาหนะเลขที่ {requestId}
              <br />
              ถูกยกเลิกเรียบร้อยแล้ว
            </>
          }
          status="success"
        />
      )}
    </>
  );
}

export default function ApproveRequest() {
  const { isPinned } = useSidebar();

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
                  <li className="breadcrumb-item active">
                    <a>ตรวจสอบและจัดการคำขอ</a>
                  </li>
                </ul>
              </div>

              <div className="page-group-header">
                <div className="page-title">
                  <span className="page-title-label">ตรวจสอบและจัดการคำขอ</span>
                </div>
              </div>
            </div>
            <ApproveVehicleForAdminTabs />
          </div>
        </div>
      </div>

      <Suspense fallback={<div></div>}>
        <RequestListContent />
      </Suspense>
    </div>
  );
}
