import { RequestDetailType } from "@/app/types/request-detail-type";
import Link from "next/link";
import CancelRequestModal from "./modal/cancelRequestModal";
import FileBackRequestModal from "./modal/fileBackModal";
import { useRef, useState } from "react";
import KeyPickupModal from "@/components/modal/keyPickUpModal";
import PassVerifyModal from "./modal/passVerifyModal";

interface Props {
  data: RequestDetailType;
  editable?: boolean;
}

export default function PageHeaderAdmin({ data, editable }: Props) {
  const keyPickupModalRef = useRef<{
    openModal: () => void;
    closeModal: () => void;
  } | null>(null);

  const passVerifyModalRef = useRef<{
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
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
    } else {
      const textarea = document.createElement("textarea");
      textarea.value = text;
      textarea.style.position = "fixed"; // prevent scroll
      document.body.appendChild(textarea);
      textarea.focus();
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
    }

    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  } catch (err) {
    console.error("Copy failed:", err);
  }
};


  const [pickupData, setPickupData] = useState<{
    place: string;
    datetime: string;
    endtime: string
  } | null>(null);

  const handlePickupConfirmed = (data: { place: string; datetime: string; endtime: string; }) => {
    setPickupData(data);
    passVerifyModalRef.current?.openModal();
  };

  return (
    <div className="page-header w-full bg-white pt-5 pb-3 !mb-0">
      <div className="breadcrumbs text-sm">
        <ul>
          <li className="breadcrumb-item">
            <Link href="/">
              <i className="material-symbols-outlined">home</i>
            </Link>
          </li>
          <li className="breadcrumb-item">
            <Link href="/administrator/request-list">ตรวจสอบและจัดการคำขอ</Link>
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
            (data?.ref_request_status_name === "อนุมัติ" ||
            data?.ref_request_status_name === "อนุมัติแล้ว" ? (
              <span className="badge badge-pill-outline badge-success">
                {data?.ref_request_status_name}
              </span>
            ) : data?.ref_request_status_name === "ยกเลิกคำขอ" ? (
              <span className="badge badge-pill-outline badge-gray">
                {data?.ref_request_status_name}
              </span>
            ) : (data?.ref_request_status_name === "ตีกลับ" || data?.ref_request_status_name === "ถูกตีกลับ") ? (
              <span className="badge badge-pill-outline badge-warning">
                {data?.ref_request_status_name}
              </span>
            ) : (
              <span className="badge badge-pill-outline badge-info">
                {data?.ref_request_status_name}
              </span>
            ))}
        </div>

        <div className="block md:hidden">
          <div className="dropdown">
            <div className="btn btn-secondary px-3" tabIndex={0} role="button">
              <i className="material-symbols-outlined icon-settings-fill-300-24">
                more_vert
              </i>
            </div>

            <ul
              className="dropdown-menu dropdown-content absolute top-auto bottom-full z-[9999] max-w-[200px] w-[200px]"
              tabIndex={0}
            >
                  {data?.ref_request_status_code === "30" &&
              <Link
                className="dropdown-item"
                href="#"
                onClick={() => fileBackRequestModalRef.current?.openModal()}
              >
                <i className="material-symbols-outlined">reply</i>
                ตีกลับให้แก้ไข
              </Link>
}
              <Link
                className="dropdown-item"
                href="#"
                onClick={() => window.print()}
              >
                <i className="material-symbols-outlined">print</i>
                พิมพ์
              </Link>

              <div className="divider py-0 my-0"></div>
            
              <Link
                className="dropdown-item"
                href="#"
                onClick={() => cancelRequestModalRef.current?.openModal()}
              >
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

            <button
              className="btn btn-secondary"
              onClick={() => window.print()}
            >
              <i className="material-symbols-outlined">print</i>พิมพ์
            </button>{" "}
            {data?.ref_request_status_code === "30" &&
            <button
              className="btn btn-secondary"
              onClick={() => fileBackRequestModalRef.current?.openModal()}
            >
              <i className="material-symbols-outlined">reply</i>
              ตีกลับให้แก้ไข
            </button>
          }
          </div>
        </div>
        {data?.ref_request_status_code === "30" &&
        <button
          className="btn btn-primary"
          disabled={editable ? false : false}
          onClick={() => keyPickupModalRef.current?.openModal()}
        >
          <i className="material-symbols-outlined">check</i>
          ผ่านการตรวจสอบ
        </button>
}
      </div>
      <CancelRequestModal
        id={data?.trn_request_uid || ""}
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
        desc={<>ระบบจะแจ้งเตือนผู้สร้างคำขอ ผู้ใช้ยานพาหนะ และผู้ขับขี่ <br></br> ให้ดำเนินการแก้ไขและส่งคำขอใหม่อีกครั้ง</>}
        placeholder="โปรดระบุเหตุผลที่ตีกลับ"
        confirmText="ตีกลับคำขอ"
      />

      <KeyPickupModal
        ref={keyPickupModalRef}
        title={"นัดหมายรับกุญแจ"}
        role="admin"
        desc={
          <>
            ระบบจะแจ้งข้อมูลการนัดหมายรับกุญแจให้ผู้ใช้ทราบ<br></br>
            เมื่อคำขอได้รับการอนุมัติในขั้นตอนสุดท้าย
          </>
        }
        confirmText="ต่อไป"
        place={data?.received_key_place}
        start_datetime={data?.received_key_start_datetime}
        end_datetime={data?.received_key_end_datetime}
        onPickupConfirmed={handlePickupConfirmed}
      />

      <PassVerifyModal
        id={data?.trn_request_uid}
        ref={passVerifyModalRef}
        title={"ยืนยันผ่านการตรวจสอบ"}
        role="admin"
        desc={
          <>
            คุณต้องการยืนยันผ่านการตรวจสอบ<br></br>
            และส่งคำขอไปยังผู้อนุมัติใช้ยานพาหนะหรือไม่ ?
          </>
        }
        confirmText="ผ่านการตรวจสอบ"
        pickupData={pickupData}
        onBack={() => keyPickupModalRef.current?.openModal()}
      />
    </div>
  );
}
