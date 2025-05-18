"use client";

import { Carpool } from "@/app/types/carpool-management-type";
import ProcessOneForm from "@/components/carpool-management/form/process-one";
import Header from "@/components/header";
import ConfirmCancelCreateCarpoolModal from "@/components/modal/confirmCancelCreateCarpoolModal";
import ProcessCreateCarpool from "@/components/processCreateCarpool";
import SideBar from "@/components/sideBar";
import CarpoolManagementTabs from "@/components/tabs/carpoolManagemntTabs";
import { useFormContext } from "@/contexts/carpoolFormContext";
import { useSidebar } from "@/contexts/sidebarContext";
import { getCarpoolManagementId } from "@/services/carpoolManagement";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export default function CarpoolProcessOne() {
  const id = useSearchParams().get("id");
  const { isPinned } = useSidebar();

  const [carpool, setCarpool] = useState<Carpool>();

  const cancelCreateModalRef = useRef<{
    openModal: () => void;
    closeModal: () => void;
  } | null>(null);

  const { formData } = useFormContext();

  console.log("formData: ", formData);
  console.log("id: ", id);

  useEffect(() => {
    const FetchIdFunc = async () => {
      if (id || formData.mas_carpool_uid) {
        try {
          const response = await getCarpoolManagementId(
            id || formData.mas_carpool_uid
          );
          const result = response.data;
          console.log("result: ", result);
          setCarpool(result);
        } catch (error) {
          console.error("Error fetching status data:", error);
        }
      }
    };

    FetchIdFunc();
  }, [id]);

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
                  <span className="page-title-label">
                    {id ? carpool?.carpool_name : "สร้างกลุ่มยานพาหนะ"}
                  </span>
                  <span
                    className="text-icon-error cursor-pointer"
                    onClick={() => cancelCreateModalRef.current?.openModal()}
                  >
                    ยกเลิก
                  </span>
                  {/* <!-- <span className="badge badge-outline badge-gray">95 กลุ่ม</span> --> */}
                </div>
              </div>
            </div>

            {id ? (
              <CarpoolManagementTabs active={5} />
            ) : (
              <ProcessCreateCarpool step={1} />
            )}

            <ProcessOneForm carpool={carpool} />
            <ConfirmCancelCreateCarpoolModal
              id={""}
              ref={cancelCreateModalRef}
              title={"คุณแน่ใจที่จะยกเลิกการสร้างกลุ่ม?"}
              desc={"หากยกเลิก การกรอกข้อมูลทั้งหมดจะไม่ถูกบันทึกไว้"}
              confirmText={"ยกเลิกการสร้างกลุ่ม"}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
