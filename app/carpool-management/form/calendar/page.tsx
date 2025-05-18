"use client";

import Header from "@/components/header";
import ConfirmCancelCreateCarpoolModal from "@/components/modal/confirmCancelCreateCarpoolModal";
import SideBar from "@/components/sideBar";
import CarpoolManagementTabs from "@/components/tabs/carpoolManagemntTabs";
import { useSidebar } from "@/contexts/sidebarContext";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useRef } from "react";

export default function CarpoolCalendar() {
  const { isPinned } = useSidebar();
  const id = useSearchParams().get("id");
  const name = useSearchParams().get("name");

  const cancelCreateModalRef = useRef<{
    openModal: () => void;
    closeModal: () => void;
  } | null>(null);

  return (
    <div>
      <div className="main-container">
        <SideBar menuName="กลุ่มยานพาหนะ" />

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
                  <li className="breadcrumb-item">
                    <Link href="/carpool-management">กลุ่มยานพาหนะ</Link>
                  </li>
                  <li className="breadcrumb-item active" aria-current="page">
                    สร้างกลุ่มยานพาหนะ
                  </li>
                </ul>
              </div>

              <div className="page-group-header">
                <div className="page-title justify-between">
                  <span className="page-title-label">สร้างกลุ่มยานพาหนะ</span>
                  <span
                    className="text-icon-error cursor-pointer"
                    // onClick={() => cancelCreateModalRef.current?.openModal()}
                  >
                    {id ? "ลบ" : "ยกเลิก"}
                  </span>
                  {/* <!-- <span className="badge badge-outline badge-gray">95 กลุ่ม</span> --> */}
                </div>
              </div>
            </div>

            <CarpoolManagementTabs active={0} />

            <div></div>

            <ConfirmCancelCreateCarpoolModal
              id={""}
              ref={cancelCreateModalRef}
              title={
                id
                  ? "ยืนยันลบกลุ่มยานพาหนะ"
                  : "คุณแน่ใจที่จะยกเลิกการสร้างกลุ่ม?"
              }
              desc={
                id
                  ? "ระบบจะนำยานพาหนะและพนักงานขับรถออกจากการให้บริการของกลุ่มโดยอัตโนมัติคุณต้องการลบ " +
                    name +
                    " ใช่หรือไม่?"
                  : "หากยกเลิก การกรอกข้อมูลทั้งหมดจะไม่ถูกบันทึกไว้"
              }
              confirmText={id ? "ลบกลุ่ม" : "ยกเลิกการสร้างกลุ่ม"}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
