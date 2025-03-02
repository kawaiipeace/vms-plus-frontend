"use client";
import React, { useRef } from "react";
import { useRouter } from "next/navigation";
import Header from "@/app/components/header";
import ProcessRequestCar from "@/app/components/processRequestCar";
import SideBar from "@/app/components/sideBar";
import RequestDetailForm from "@/app/components/flow/requestDetailForm";
import TermAndConditionModal from "@/app/components/termAndConditionModal";
import Link from "next/link";

export default function ProcessFour() {
  const router = useRouter();
  const termAndConditionModalRef = useRef<{
    openModal: () => void;
    closeModal: () => void;
  } | null>(null);

  const nextStep = () => {
    router.push("request-list");
  };

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

            <ProcessRequestCar step={4} />

            <div className="form-steps-group">
              <div className="form-steps" data-step="4">
                <div className="form-section">
                  <div className="page-section-header border-0">
                    <div className="page-header-left">
                      <div className="page-title">
                        <span className="page-title-label">
                          ยืนยันการสร้างคำขอ
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <RequestDetailForm status="add" />
              </div>

              <div className="form-accept">
                การกดปุ่ม “สร้างคำขอ” จะถือว่าท่านอ่านและตกลงยอมรับ{" "}
                <a
                  onClick={() => termAndConditionModalRef.current?.openModal()}
                  className="text-info text-underline"
                >
                  เงื่อนไข หลักเกณฑ์ และระเบียบการใช้ยานพาหนะ
                </a>
              </div>

              <div className="form-action">
                <button className="btn btn-primary" onClick={() => nextStep()}>
                  สร้างคำขอ
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <TermAndConditionModal ref={termAndConditionModalRef} />
    </div>
  );
}
