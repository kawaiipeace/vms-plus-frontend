import { RequestDetailType } from "@/app/types/request-detail-type";
import Link from "next/link";
import CancelRequestModal from "./modal/cancelRequestModal";
import FileBackRequestModal from "./modal/fileBackModal";
import { useRef, useState } from "react";
import KeyPickupModal from "@/components/modal/keyPickUpModal";

interface Props {
  data: RequestDetailType;
}

export default function PageHeaderAdmin({ data }: Props) {
  const keyPickupModalRef = useRef<{
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

  const [copied, setCopied] = useState(false);

  const handleCopyRequestNo = async (text?: string) => {
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000); // hide tooltip after 2 seconds
    } catch (err) {
      console.error("Copy failed:", err);
    }
  };

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
            <Link href="/administrator/booking-approver">
              อนุมัติขอคำใช้และใบอนุญาต
            </Link>
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

          <div className="relative group inline-block">
            <button
              className="text-sm"
              onClick={() => handleCopyRequestNo(data?.request_no)}
            >
              <i className="material-symbols-outlined text-sm">content_copy</i>
              คัดลอก
            </button>

            <div
              className={`absolute left-1/2 -translate-x-1/2 bottom-full mb-1 
              w-24 text-center px-2 py-1 text-xs rounded bg-base-200 text-base-content shadow
              transition-opacity duration-300 
              ${copied ? "opacity-100 visible" : "opacity-0 invisible"}`}
            >
              คัดลอกสำเร็จ
            </div>
          </div>

          {data?.ref_request_status_name &&
            (data?.ref_request_status_name === "อนุมัติ" || data?.ref_request_status_name === "อนุมัติแล้ว" ? (
              <span className="badge badge-pill-outline badge-success">
                {data?.ref_request_status_name}
              </span>
            ) : data?.ref_request_status_name === "ยกเลิกคำขอ" ? (
              <span className="badge badge-pill-outline badge-gray !border-gray-200 !bg-gray-50">
                {data?.ref_request_status_name}
              </span>
            ) : (
              <span className="badge badge-pill-outline badge-info">
                {data?.ref_request_status_name}
              </span>
            ))}
        </div>

     
          <button
            className="btn btn-tertiary-danger bg-transparent shadow-none border-none"
            onClick={() => cancelRequestModalRef.current?.openModal()}
          >
            ยกเลิกคำขอ
          </button>
       
        <button className="btn btn-secondary" onClick={() => window.print()}>
          <i className="material-symbols-outlined">print</i>พิมพ์
        </button>

        <button
          className="btn btn-secondary"
          onClick={() => fileBackRequestModalRef.current?.openModal()}
        >
          <i className="material-symbols-outlined">reply</i>
          ตีกลับให้แก้ไข
        </button>

        <button
          className="btn btn-primary"
          onClick={() => keyPickupModalRef.current?.openModal()}
        >
          <i className="material-symbols-outlined">check</i>
          ผ่านการตรวจสอบ
        </button>
      </div>
      <CancelRequestModal
        id={data?.trn_request_uid}
        ref={cancelRequestModalRef}
        title="ยืนยันยกเลิกคำขอ?"
        desc="ยานพาหนะและพนักงานขับรถที่จองไว้จะถูกยกเลิก"
        role="admin"
        confirmText="ยกเลิกคำขอ"
      />
      <FileBackRequestModal
        id={data?.trn_request_uid}
        ref={fileBackRequestModalRef}
        title="ยืนยันตีกลับคำขอ"
        role="admin"
        desc="ระบบจะแจ้งเตือนผู้สร้างคำขอ ผู้ใช้ยานพาหนะ และผู้ขับขี่ ให้ดำเนินการแก้ไขและส่งคำขอใหม่อีกครั้ง"
        placeholder="โปรดระบุเหตุผลที่ตีกลับ"
        confirmText="ตีกลับคำขอ"
      />

      <KeyPickupModal  
        id={data?.trn_request_uid}
        ref={keyPickupModalRef}
        title={"นัดหมายรับกุญแจ"}
        role="admin"
        desc={<>ระบบจะแจ้งข้อมูลการนัดหมายรับกุญแจให้ผู้ใช้ทราบ<br></br>เมื่อคำขอได้รับการอนุมัติในขั้นตอนสุดท้าย?</>  }
        confirmText="ต่อไป"
        place={data?.received_key_place}
        statusCode={data?.ref_request_status_code}
        start_datetime={data?.received_key_start_datetime}
        end_datetime={data?.received_key_end_datetime} />

    </div>
  );
}
