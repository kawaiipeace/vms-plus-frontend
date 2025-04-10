import { RequestDetailType } from "@/app/types/request-detail-type";
import Link from "next/link";
import CancelRequestModal from "./modal/cancelRequestModal";
import FileBackRequestModal from "./modal/fileBackModal";
import ApproveRequestModal from "./modal/approveRequestModal";
import { useRef } from "react";

interface Props {
  copyRequest?: boolean;
  returnRequest?: boolean;
  cancelRequest?: boolean;
  approveRequest?: boolean;
  status?: string;
  data: RequestDetailType;
}

export default function PageHeader({
  copyRequest,
  returnRequest,
  cancelRequest,
  approveRequest,
  status,
  data,
}: Props) {
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

  return (
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
            เลขที่คำขอ {data?.request_no || ""}
          </li>
        </ul>
      </div>

      <div className="page-group-header">
        <div className="page-title">
          <span className="page-title-label">
            เลขที่คำขอ {data?.request_no || ""}
          </span>
          {copyRequest && (
            <button className="text-sm">
              <i className="material-symbols-outlined text-sm">content_copy</i>
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
