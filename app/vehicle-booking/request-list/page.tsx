"use client";
import { useSidebar } from "@/app/contexts/sidebarContext";
import Header from "@/app/components/header";
import RequestTabs from "@/app/components/tabs/requestTabs";
import SideBar from "@/app/components/sideBar";
import ToastCustom from "@/app/components/toastCustom";
import { useSearchParams } from "next/navigation"; // Import this

export default function RequestList() {
  const { isPinned } = useSidebar();
  const searchParams = useSearchParams();
  const created = searchParams.get("created");

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

      {created === "success" && (
        <ToastCustom
          title="สร้างคำขอใช้ยานพาหนะสำเร็จ"
          desc="หลังจากนี้รอสถานะการอนุมัติจากต้นสังกัด"
          status="success"
        />
      )}
    </div>
  );
}
