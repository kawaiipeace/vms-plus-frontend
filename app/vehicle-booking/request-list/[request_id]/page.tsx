"use client";
import { useEffect, useRef, useState } from "react";
import { useSidebar } from "@/contexts/sidebarContext";
import Header from "@/components/header";
import RequestDetailTabs from "@/components/tabs/requestDetailTab";
import SideBar from "@/components/sideBar";
import CancelRequestModal from "@/components/modal/cancelRequestModal";
import Link from "next/link";
import FileBackRequestModal from "@/components/modal/fileBackModal";
import ApproveRequestModal from "@/components/modal/approveRequestModal";
import { useParams, useSearchParams } from "next/navigation";
import { requestDetail } from "@/services/bookingUser";
import { RequestDetailType } from "@/app/types/request-detail-type";

interface Props {
  copy?: boolean;
  returnRequest?: boolean;
  cancelRequest?: boolean;
  approveRequest?: boolean;
  status?: string;
}

export default function RequestDetail({
  copy,
  returnRequest,
  cancelRequest,
  approveRequest,
  status,
}: Props) {
  const { isPinned } = useSidebar();
  const approveRequestModalRef = useRef<{
    openModal: () => void;
    closeModal: () => void;
  } | null>(null);
  const cancelRequestModalRef = useRef<{
    openModal: () => void;
    closeModal: () => void;
  } | null>(null);
  const fileBackRequestModalRef = useRef<{
    openModal: () => void;
    closeModal: () => void;
  } | null>(null);

  const params = useParams();
  const request_id = String(params.request_id);

  const [requestData, setRequestData] = useState<RequestDetailType>();

  useEffect(() => {
    if (request_id) {
      const fetchRequestDetailfunc = async () => {
        try {
          const response = await requestDetail(request_id);
          setRequestData(response.data);
        } catch (error) {
          console.error("Error fetching vehicle details:", error);
        }
      };

      fetchRequestDetailfunc();
    }
  }, [request_id]);

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
                  <li className="breadcrumb-item">
                    <Link href="../request-list">คำขอใช้ยานพาหนะ</Link>
                  </li>
                  <li className="breadcrumb-item active" aria-current="page">
                    เลขที่คำขอ {requestData?.request_no || ""}
                  </li>
                </ul>
              </div>

              <div className="page-group-header">
                <div className="page-title">
                  <span className="page-title-label">
                    เลขที่คำขอ {requestData?.request_no || ""}
                  </span>
                  {copy && (
                    <button className="text-sm">
                      <i className="material-symbols-outlined text-sm">
                        content_copy
                      </i>
                      คัดลอก
                    </button>
                  )}

                  {status && (
                    <span className="badge badge-pill-outline badge-info">
                      {status}
                    </span>
                  )}
                </div>

                {cancelRequest && (
                  <button
                    className="btn btn-tertiary-danger bg-transparent shadow-none border-none"
                    onClick={() => cancelRequestModalRef.current?.openModal()}
                  >
                    ยกเลิกคำขอ
                  </button>
                )}
                <button className="btn btn-secondary">
                  <i className="material-symbols-outlined">print</i>พิมพ์
                </button>
                {returnRequest && (
                  <button
                    className="btn btn-secondary"
                    onClick={() => fileBackRequestModalRef.current?.openModal()}
                  >
                    <i className="material-symbols-outlined">reply</i>
                    ตีกลับให้แก้ไข
                  </button>
                )}
                {approveRequest && (
                  <button
                    className="btn btn-primary"
                    onClick={() => approveRequestModalRef.current?.openModal()}
                  >
                    <i className="material-symbols-outlined">check</i>
                    อนุมัติคำขอ
                  </button>
                )}
              </div>
            </div>

            <RequestDetailTabs requestId={request_id} />
          </div>
        </div>
      </div>
      <CancelRequestModal
        ref={cancelRequestModalRef}
        title="ยืนยันยกเลิกคำขอ?"
        desc="ยานพาหนะและพนักงานขับรถที่จองไว้จะถูกยกเลิก"
        confirmText="ยกเลิกคำขอ"
      />
      <FileBackRequestModal
        ref={fileBackRequestModalRef}
        title="ยืนยันตีกลับคำขอ"
        desc="ระบบจะแจ้งเตือนผู้สร้างคำขอ ผู้ใช้ยานพาหนะ และผู้ขับขี่ ให้ดำเนินการแก้ไขและส่งคำขอใหม่อีกครั้ง"
        confirmText="โปรดระบุเหตุผลที่ตีกลับ"
      />

      <ApproveRequestModal
        ref={approveRequestModalRef}
        title={"ยืนยันอนุมัติคำขอ"}
        desc={"คุณต้องการอนุมัติคำขอใช้ยานพาหนะหรือไม่ ?"}
        confirmText="อนุมัติคำขอ"
      />
    </div>
  );
}
