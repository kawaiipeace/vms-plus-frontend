"use client";
import Header from "@/components/header";
import SideBar from "@/components/sideBar";
import RequestTabs from "@/components/tabs/requestTabs";
import ToastCustom from "@/components/toastCustom";
import { useProfile } from "@/contexts/profileContext";
import { useSidebar } from "@/contexts/sidebarContext";
import { fetchProfile } from "@/services/authService";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect } from "react";

function RequestListContent() {
  const searchParams = useSearchParams();
  const createReq = searchParams.get("create-req");
  const cancelReq = searchParams.get("cancel-req");
  const sendbackagainReq = searchParams.get("sendbackagain-req");
  const requestId = searchParams.get("request-id");
  const receivedKey = searchParams.get("received-key");
  const licensePlate = searchParams.get("license-plate");
  const returned = searchParams.get("returned");
  const requestNo = searchParams.get("request-no");

  const { profile, setProfile, setIsAuthenticated } = useProfile();

  useEffect(() => {
    if (!profile && localStorage.getItem("accessToken")) {
      fetchProfile().then((res) => {
        setProfile(res.data);
        setIsAuthenticated(true);
      });
    }
  }, []);

  return (
    <>
      {createReq === "success" && (
        <ToastCustom
          title="สร้างคำขอใช้ยานพาหนะสำเร็จ"
          desc="หลังจากนี้รอสถานะการอนุมัติจากต้นสังกัด"
          status="success"
          seeDetail={`/vehicle-booking/request-list/${requestId}`}
          seeDetailText="ดูสถานะ"
        />
      )}

      {sendbackagainReq === "success" && (
        <ToastCustom
          title="ส่งคำขออีกครั้งสำเร็จ"
          desc={
            <>
              คำขอใช้ยานพาหนะเลขที่ {requestId}
              <br />
              ส่งคำขออีกครั้งเรียบร้อยแล้ว
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
      {receivedKey === "success" && (
        <ToastCustom
          title="รับกุญแจสำเร็จ"
          desc={
            <>
              ได้รับ กุญแจหลักและบัตรเติมน้ำมัน
              <br /> ยานพาหนะเลขทะเบียน {licensePlate}
              <br /> กรุงเทพมหานคร เรียบร้อยแล้ว
            </>
          }
          status="success"
        />
      )}

      {returned === "success" && (
        <ToastCustom
          title="คืนยานพาหนะแล้ว"
          desc={
            <div>
              <div className="">
                คืนยานพาหนะคำขอเลขที่ {requestNo}
                <br /> เรียบร้อยแล้ว กรุณารอผู้ดูแลยานพาหนะตรวจสอบ
                <br /> และยืนยันการคืน
              </div>
            </div>
          }
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
                    <Link href="/">
                      <i className="material-symbols-outlined">home</i>
                    </Link>
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
