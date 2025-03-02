"use client";
import Header from "@/app/components/header";
import RequestTabs from "@/app/components/requestTabs";
import SideBar from "@/app/components/sideBar";
import ToastCustom from "@/app/components/toastCustom";

export default function requestList() {
  return (
    <div>
      <div className="main-container">
        <SideBar menuName="คำขอใช้ยานพาหนะ" />

        <div className="main-content">
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
                  {/* <span className="badge badge-outline badge-gray">95 กลุ่ม</span> */}
                </div>
              </div>
            </div>

                <RequestTabs />

          </div>
        </div>
      </div>
      <ToastCustom title="สร้างคำขอใช้ยานพาหนะสำเร็จ" desc="หลังจากนี้รอสถานะการอนุมัติจากต้นสังกัด" status="success"/>

    </div>
  );
}
