import { RequestDetailType } from "@/app/types/request-detail-type";
import CancelRequestModal from "@/components/modal/cancelRequestModal";
import Link from "next/link";
import { useRef, useState } from "react";

interface Props {
  data: RequestDetailType;
  editable?: boolean;
}

export default function PageKeyPickupHeader({ data, editable }: Props) {
  const cancelRequestModalRef = useRef<{
    openModal: () => void;
    closeModal: () => void;
  } | null>(null);

  const [copied, setCopied] = useState(false);

  const handleCopyRequestNo = async (text?: string) => {
  if (!text) return;
  if (typeof navigator === "undefined" || !navigator.clipboard?.writeText) {
    console.error("Clipboard API not available");
    return;
  }
  try {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  } catch (err) {
    console.error("Copy failed:", err);
  }
};

  return (
    <div className="page-header ">
      <div className="breadcrumbs text-sm">
        <ul>
          <li className="breadcrumb-item">
            <a>
              <i className="material-symbols-outlined">home</i>
            </a>
          </li>
          <li className="breadcrumb-item">
            <Link href="/vehicle-booking/request-list">คำขอใช้ยานพาหนะ</Link>
          </li>
          <li className="breadcrumb-item active" aria-current="page">
            เลขที่คำขอ {data?.request_no || ""}
          </li>
        </ul>
      </div>

      <div className="page-group-header">
        <div className="page-title">
          <span className="page-title-label">เลขที่คำขอ {data?.request_no || ""}</span>

          <div className="relative group inline-block">
            <button className="text-sm" onClick={() => handleCopyRequestNo(data?.request_no)}>
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
              <span className="badge badge-pill-outline badge-success">{data?.ref_request_status_name}</span>
            ) : data?.ref_request_status_name === "ยกเลิกคำขอ" ? (
              <span className="badge badge-pill-outline badge-gray">{data?.ref_request_status_name}</span>
            ) : data?.ref_request_status_name === "ตีกลับ" ? (
              <span className="badge badge-pill-outline badge-warning">{data?.ref_request_status_name}</span>
            ) : (
              <span className="badge badge-pill-outline badge-info">{data?.ref_request_status_name}</span>
            ))}
        </div>

        <div className="block md:hidden">
          <div className="dropdown">
            <div className="btn btn-secondary px-3" tabIndex={0} role="button">
              <i className="material-symbols-outlined icon-settings-fill-300-24">more_vert</i>
            </div>

            <ul
              className="dropdown-menu dropdown-content absolute top-auto bottom-full z-[9999] max-w-[200px] w-[200px]"
              tabIndex={0}
            >
              <Link className="dropdown-item" href="#" onClick={() => window.print()}>
                <i className="material-symbols-outlined">print</i>
                พิมพ์
              </Link>

              <div className="divider py-0 my-0"></div>
              <Link className="dropdown-item" href="#" onClick={() => cancelRequestModalRef.current?.openModal()}>
                <i className="material-symbols-outlined">delete</i>
                ยกเลิกคำขอ
              </Link>
            </ul>
          </div>
        </div>

        <div className="md:block hidden">
          <div className="flex gap-3">
            <button
              className="btn btn-tertiary-danger bg-transparent shadow-none border-none"
              onClick={() => cancelRequestModalRef.current?.openModal()}
            >
              ยกเลิกคำขอ
            </button>
            <button className="btn btn-secondary" onClick={() => window.print()}>
              <i className="material-symbols-outlined">print</i>พิมพ์
            </button>{" "}
          </div>
        </div>
      </div>
      <CancelRequestModal
        id={data?.trn_request_uid || ""}
        ref={cancelRequestModalRef}
        title="ยืนยันยกเลิกคำขอ?"
        desc="ยานพาหนะและพนักงานขับรถที่จองไว้จะถูกยกเลิก"
        role="key"
        confirmText="ยกเลิกคำขอ"
      />
    </div>
  );
}
