"use client";
import { useSidebar } from "@/app/contexts/sidebarContext";
import Header from "@/app/components/header";
import SideBar from "@/app/components/sideBar";
import ToastCustom from "@/app/components/toastCustom";
import ApproveVehicleTabs from "@/app/components/tabs/approveVehicleTabs";

export default function ApproveRequest() {
  const { isPinned } = useSidebar();
  return (
    <div>
      <div className="main-container">
        <SideBar menuName="อนุมัติขอคำใช้และใบอนุญาต" />

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
                    <a>อนุมัติคำขอ</a>
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
      <ToastCustom title="สร้างคำขอใช้ยานพาหนะสำเร็จ" desc="หลังจากนี้รอสถานะการอนุมัติจากต้นสังกัด" status="success"/>

    </div>
  );
}
