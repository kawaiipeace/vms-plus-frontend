"use client";
import { useSidebar } from "@/contexts/sidebarContext";
import Header from "@/components/header";
import RequestTabs from "@/components/tabs/requestTabs";
import SideBar from "@/components/sideBar";
import ToastCustom from "@/components/toastCustom";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function RequestListContent() {
  const searchParams = useSearchParams();
  const createReq = searchParams.get("create-req");
  const cancelReq = searchParams.get("cancel-req");
  const requestId = searchParams.get("request-id");

  return (
    <>
      {createReq === "success" && (
        <ToastCustom
          title="สร้างคำขอใช้ยานพาหนะสำเร็จ"
          desc="หลังจากนี้รอสถานะการอนุมัติจากต้นสังกัด"
          status="success"
          seeDetail={"/vehicle-booking/request-list/" + requestId}
          seeDetailText="ดูสถานะ"
        />
      )}
      {cancelReq === "success" && (
        <ToastCustom
          title="ยกเลิกคำขอสำเร็จ"
          desc={`คำขอใช้ยานพาหนะเลขที่ ${requestId} ถูกยกเลิกเรียบร้อยแล้ว`}
          status="success"
        />
      )}
    </>
  );
}

export default function RequestList() {
  const { isPinned } = useSidebar();

  return (
    <div>
      <div className="main-container">
        <SideBar menuName="คำขอใช้ยานพาหนะ" />

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
                  <li className="breadcrumb-item active" aria-current="page">
                    <a>คำขอใช้ยานพาหนะ</a>
                  </li>
                </ul>
              </div>

              <div className="page-group-header">
                <div className="page-title">
                  <span className="page-title-label">คำขอใช้ยานพาหนะ</span>
                </div>
              </div>
            </div>

            <RequestTabs />
          </div>
        </div>
      </div>
      <Suspense fallback={<div></div>}>
        <RequestListContent />
      </Suspense>
    </div>
  );
}
