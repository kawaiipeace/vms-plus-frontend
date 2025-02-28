"use client";
import Header from "@/app/components/header";
import ProcessRequestCar from "@/app/components/processRequestCar";
import SideBar from "@/app/components/sideBar";
import StatusModal from "@/app/components/statusModel";
import ToastCustom from "@/app/components/toastCustom";
import Link from "next/link";
import RequestForm from "@/app/components/flow/requestForm";

export default function ProcessOne() {
 
  return (
    <div>
      <div className="main-container">
        <SideBar />

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
                  <li className="breadcrumb-item">
                    <Link href="request-list">คำขอใช้ยานพาหนะ</Link>
                  </li>
                  <li className="breadcrumb-item active" aria-current="page">
                    สร้างคำขอใช้ยานพาหนะ
                  </li>
                </ul>
              </div>

              <div className="page-group-header">
                <div className="page-title">
                  <span className="page-title-label">สร้างคำขอใช้ยานพาหนะ</span>
                  {/* <!-- <span className="badge badge-outline badge-gray">95 กลุ่ม</span> --> */}
                </div>
              </div>
            </div>

            <ProcessRequestCar step={1} />

           <RequestForm />
          
          </div>
        </div>
      </div>

      <ToastCustom />
      <StatusModal />
    </div>
  );
}
