"use client";
import { useSidebar } from "@/contexts/sidebarContext";
import Header from "@/components/header";
import SideBar from "@/components/sideBar";
import ToastCustom from "@/components/toastCustom";
import Main from "@/components/finalapprove/main";

export default function ApproveRequest() {
  const { isPinned } = useSidebar();
  return (
    <div>
      <div className="main-container">
        <SideBar menuName="อนุมัติใช้ยานพาหนะ" />

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
                  <li className="breadcrumb-item active">
                    <a>อนุมัติใช้ยานพาหนะ</a>
                  </li>
                </ul>
              </div>

              <div className="page-group-header">
                <div className="page-title">
                  <span className="page-title-label">อนุมัติใช้ยานพาหนะ</span>
                  {/* <span className="badge badge-outline badge-gray">95 กลุ่ม</span> */}
                </div>
              </div>
            </div>

                <Main />

          </div>
        </div>
      </div>
      <ToastCustom title="สร้างคำขอใช้ยานพาหนะสำเร็จ" desc="หลังจากนี้รอสถานะการอนุมัติจากต้นสังกัด" status="success"/>

    </div>
  );
}
