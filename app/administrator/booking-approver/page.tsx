"use client";
import { useSidebar } from "@/contexts/sidebarContext";
import Header from "@/components/header";
import SideBar from "@/components/sideBar";
import ToastCustom from "@/components/toastCustom";
import ApproveVehicleTabs from "@/components/tabs/approveVehicleTabs";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function RequestListContent() {
  const searchParams = useSearchParams();
  const sendbackReq = searchParams.get("sendback-req");
  const sendbackLicReq = searchParams.get("sendbacklic-req");
  const cancelReq = searchParams.get("cancel-req");
  const approveReq = searchParams.get("approve-req");
  const approveLicReq = searchParams.get("approvelic-req");
  const approveFinalLicReq = searchParams.get("  approvelicfinal-req");
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
      {sendbackLicReq === "success" && (
        <ToastCustom
          title="ตีกลับคำขอสำเร็จ"
          desc={
            <>
              คำขออนุมัติทำหน้าที่ขับรถยนต์ประจำปี {requestId}
              <br />
              ถูกตีกลับเรียบร้อยแล้ว
            </>
          }
          status="success"
        />
      )}
      {sendbackLicReq === "success" && (
        <ToastCustom
          title="ตีกลับคำขอสำเร็จ"
          desc={
            <>
              คำขออนุมัติทำหน้าที่ขับรถยนต์ประจำปี {requestId}
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

      {approveLicReq === "success" && (
        <ToastCustom
          title="ตรวจสอบคำขอสำเร็จ"
          desc={
            <>
              คำขออนุมัติทำหน้าที่ขับรถยนต์ประจำปี {requestId}
              <br />
              ผ่านการตรวจสอบแล้ว
            </>
          }
          status="success"
        />
      )}

      {approveFinalLicReq === "success" && (
        <ToastCustom
          title="อนุมัติคำขอสำเร็จ"
          desc={
            <>
              คำขออนุมัติทำหน้าที่ขับรถยนต์ประจำปี
              <br />
              เลขที่ {requestId} ผ่านการอนุมัติเรียบร้อยแล้ว
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
        <SideBar menuName="อนุมัติขอคำใช้และใบอนุญาต" />

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
                    <a>อนุมัติขอคำใช้และใบอนุญาต</a>
                  </li>
                </ul>
              </div>

              <div className="page-group-header">
                <div className="page-title">
                  <span className="page-title-label">อนุมัติคำขอ</span>
                  {/* <span className="badge badge-outline badge-gray">95 กลุ่ม</span> */}
                </div>
              </div>
            </div>

            <ApproveVehicleTabs />
          </div>
        </div>
      </div>

      <Suspense fallback={<div></div>}>
        <RequestListContent />
      </Suspense>
    </div>
  );
}
