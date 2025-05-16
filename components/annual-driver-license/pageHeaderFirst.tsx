import Link from "next/link";
import CancelRequestModal from "@/components/modal/cancelRequestModal";
import ApproveRequestModal from "@/components/modal/approveRequestModal";
import { useRef, useState } from "react";
import { RequestAnnualDriver } from "@/app/types/driver-lic-list-type";

interface Props {
  data: RequestAnnualDriver;
}

export default function PageHeaderFirst({ data }: Props) {
  const approveRequestModalRef = useRef<{
    openModal: () => void;
    closeModal: () => void;
  } | null>(null);
  const cancelRequestModalRef = useRef<{
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
            <Link href="/administrator/booking-approver">
              อนุมัติขอคำใช้และใบอนุญาต
            </Link>
          </li>
          <li className="breadcrumb-item active" aria-current="page">
            เลขที่คำขอ {data?.request_annual_driver_no || ""}
          </li>
        </ul>
      </div>

      <div className="page-group-header">
        <div className="page-title">
          <span className="page-title-label">
            เลขที่คำขอ {data?.request_annual_driver_no || ""}
          </span>

          {/* {data?.ref_request_status_name &&
            (data?.ref_request_status_name === "อนุมัติ" || data?.ref_request_status_name === "อนุมัติแล้ว" ? (
              <span className="badge badge-pill-outline badge-success">
                {data?.ref_request_status_name}
              </span>
            ) : data?.ref_request_status_name === "ยกเลิกคำขอ" ? (
              <span className="badge badge-pill-outline badge-gray">
                {data?.ref_request_status_name}
              </span>
            ) : (
              <span className="badge badge-pill-outline badge-info">
                {data?.ref_request_status_name}
              </span>
            ))} */}
        </div>


          <button
            className="btn btn-tertiary-danger bg-transparent shadow-none border-none"
            onClick={() => cancelRequestModalRef.current?.openModal()}
          >
            ยกเลิกคำขอ
          </button>


        <button
          className="btn btn-primary"
          onClick={() => approveRequestModalRef.current?.openModal()}
        >
          <i className="material-symbols-outlined">check</i>
          ผ่านการตรวจสอบ
        </button>
      </div>
      <CancelRequestModal
        id={data?.trn_request_annual_driver_uid}
        ref={cancelRequestModalRef}
        title="ยืนยันยกเลิกคำขอ?"
        desc="ยานพาหนะและพนักงานขับรถที่จองไว้จะถูกยกเลิก"
        role="firstApprover"
        confirmText="ยกเลิกคำขอ"
      />
      <ApproveRequestModal
        id={data?.trn_request_annual_driver_uid}
        ref={approveRequestModalRef}
        title={"ยืนยันอนุมัติคำขอ"}
        role="firstApprover"
        desc={"คุณต้องการอนุมัติคำขอใช้ยานพาหนะหรือไม่ ?"}
        confirmText="อนุมัติคำขอ"
      />
    </div>
  );
}
