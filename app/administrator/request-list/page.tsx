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
  const sendbackvehicleReq = searchParams.get("sendbackvehicle-req");
  const acceptvehicleReq = searchParams.get("acceptvehicle-req");
  const cancelReq = searchParams.get("cancel-req");
  const returned = searchParams.get("returned");
  const approveReq = searchParams.get("approve-req");
    const verifyReq = searchParams.get("verify-req");
  const keychangeReq = searchParams.get("keychange-req");
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

        {verifyReq === "success" && (
        <ToastCustom
          title="ตรวจสอบคำขอสำเร็จ"
          desc={
            <>
              คำขอใช้ยานพาหนะเลขที่  {requestId}
              <br />
              ผ่านการตรวจสอบแล้ว
            </>
          }
          status="success"
        />
      )}

      {keychangeReq === "success" && (
        <ToastCustom
          title="แก้ไขนัดหมายสำเร็จ"
          desc={
            <>
              แก้ไขนัดหมายรับกุญแจคำขอใช้ยานพหานะเลขที่
              <br />
              {requestId} เรียบร้อยแล้ว
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

      {returned === "success" && (
        <ToastCustom
          title="คืนยานพาหนะแล้ว"
          desc={
            <>
              คืนยานพาหนะคำขอเลขที่
              <br /> {requestId} เรียบร้อยแล้ว
              <br /> กรุณารอผู้ดูแลยานพาหนะตรวจสอบ
              <br /> และยืนยันการคืน
            </>
          }
          status="success"
          searchParams=""
        />
      )}

      {sendbackvehicleReq === "success" && (
        <ToastCustom
          title="ตีกลับยานพาหนะสำเร็จ"
          desc={
            <>
              ตีกลับยานพาหนะคำขอเลขที่
              <br /> {requestId} เรียบร้อยแล้ว
            </>
          }
          status="success"
          searchParams=""
        />
      )}

      {acceptvehicleReq === "success" && (
        <ToastCustom
          title="ตรวจสอบยานพาหนะสำเร็จ"
          desc={
            <>
              ตรวจสอบและยืนยันการคืนยานพาหนะคำขอเลขที่
              <br /> {requestId} เรียบร้อยแล้ว
            </>
          }
          status="success"
          searchParams=""
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
                    <a href="/">
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
