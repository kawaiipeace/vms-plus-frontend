import Link from "next/link";
import CancelRequestModal from "@/components/modal/cancelRequestModal";
import ApproveRequestModal from "@/components/modal/approveRequestModal";
import { useRef } from "react";
import { RequestAnnualDriver } from "@/app/types/driver-lic-list-type";
import FileBackRequestModal from "../modal/fileBackModal";
import { useProfile } from "@/contexts/profileContext";
import { fetchProfile } from "@/services/authService";

interface Props {
  data: RequestAnnualDriver;
}

export default function PageHeaderFirst({ data }: Props) {
  const approveRequestModalRef = useRef<{
    openModal: () => void;
    closeModal: () => void;
  } | null>(null);
  const fileBackRequestModalRef = useRef<{
    openModal: () => void;
    closeModal: () => void;
  } | null>(null);
  const cancelRequestModalRef = useRef<{
    openModal: () => void;
    closeModal: () => void;
  } | null>(null);
  const { profile, setProfile } = useProfile();

  return (
    <div className="page-header">
      <div className="breadcrumbs text-sm">
        <ul>
          <li className="breadcrumb-item">
            <Link href={"/"}>
              <i className="material-symbols-outlined">home</i>
            </Link>
          </li>
          <li className="breadcrumb-item">
            <Link href="/administrator/booking-approver">
              อนุมัติคำขอใช้และใบอนุญาต
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

          {data?.ref_request_annual_driver_status_name &&
            (data?.ref_request_annual_driver_status_name === "อนุมัติ" ||
            data?.ref_request_annual_driver_status_name === "อนุมัติแล้ว" ? (
              <span className="badge badge-pill-outline badge-success">
                {data?.ref_request_annual_driver_status_name}
              </span>
            ) : data?.ref_request_annual_driver_status_name === "ยกเลิกคำขอ" ? (
              <span className="badge badge-pill-outline badge-gray">
                {data?.ref_request_annual_driver_status_name}
              </span>
            ) : data?.ref_request_annual_driver_status_name === "ตีกลับคำขอ" ? (
              <span className="badge badge-pill-outline badge-warning">
                {data?.ref_request_annual_driver_status_name}
              </span>
            ) : (
              <span className="badge badge-pill-outline badge-info">
                {data?.ref_request_annual_driver_status_name}
              </span>
            ))}
        </div>
        {/* {data?.ref_request_annual_driver_status_code !== "30" && (
          <button
            className="btn btn-tertiary-danger bg-transparent shadow-none border-none"
            onClick={() => cancelRequestModalRef.current?.openModal()}
          >
            ยกเลิกคำขอ
          </button>
        )} */}
        {data?.ref_request_annual_driver_status_code !== "11" && (
          <>
            {data?.ref_request_annual_driver_status_code === "10" &&
              data?.confirmed_request_emp_id === profile?.emp_id && (
                <>
                  <button
                    className="btn btn-secondary"
                    onClick={() => fileBackRequestModalRef.current?.openModal()}
                  >
                    <i className="material-symbols-outlined">reply</i>
                    ตีกลับให้แก้ไข
                  </button>
                  <button
                    className="btn btn-primary"
                    onClick={() => approveRequestModalRef.current?.openModal()}
                  >
                    <i className="material-symbols-outlined">check</i>
                    ผ่านการตรวจสอบ
                  </button>
                </>
              )}
            {data?.ref_request_annual_driver_status_code === "20" &&
              data?.approved_request_emp_id === profile?.emp_id && (
                <>
                  <button
                    className="btn btn-secondary"
                    onClick={() => fileBackRequestModalRef.current?.openModal()}
                  >
                    <i className="material-symbols-outlined">reply</i>
                    ตีกลับให้แก้ไข
                  </button>
                  <button
                    className="btn btn-primary"
                    onClick={() => approveRequestModalRef.current?.openModal()}
                  >
                    <i className="material-symbols-outlined">check</i>
                    อนุมัติคำขอ
                  </button>
                </>
              )}
          </>
        )}
      </div>
      {data?.ref_request_annual_driver_status_code === "10" && (
        <FileBackRequestModal
          id={data?.trn_request_annual_driver_uid}
          ref={fileBackRequestModalRef}
          title="ยืนยันตีกลับคำขอ"
          role="licAdmin"
          desc="เมื่อยกเลิกคำขอแล้ว ผู้ขออนุมัติจะสามารถแก้ไขข้อมูล และขออนุมัติทำหน้าที่ขับรถยนต์ได้อีกครั้ง"
          placeholder="โปรดระบุเหตุผลที่ตีกลับ"
          confirmText="ตีกลับคำขอ"
          onSuccess={() => {
            const refreshProfile = async () => {
              try {
                const response = await fetchProfile();
                setProfile(response.data);
              } catch (error) {
                console.error("Failed to refresh profile:", error);
              }
            };
            refreshProfile();
          }}
        />
      )}
      {data?.ref_request_annual_driver_status_code === "20" && (
        <FileBackRequestModal
          id={data?.trn_request_annual_driver_uid}
          ref={fileBackRequestModalRef}
          title="ยืนยันตีกลับคำขอ"
          role="licFinalAdmin"
          desc="เมื่อยกเลิกคำขอแล้ว ผู้ขออนุมัติจะสามารถแก้ไขข้อมูล และขออนุมัติทำหน้าที่ขับรถยนต์ได้อีกครั้ง"
          placeholder="โปรดระบุเหตุผลที่ตีกลับ"
          confirmText="ตีกลับคำขอ"
          onSuccess={() => {
            const refreshProfile = async () => {
              try {
                const response = await fetchProfile();
                setProfile(response.data);
              } catch (error) {
                console.error("Failed to refresh profile:", error);
              }
            };
            refreshProfile();
          }}
        />
      )}

      {data?.ref_request_annual_driver_status_code === "10" &&
        data?.confirmed_request_emp_id === profile?.emp_id && (
          <>
            {" "}
            <ApproveRequestModal
              id={data?.trn_request_annual_driver_uid}
              ref={approveRequestModalRef}
              title={"ยืนยันผ่านการตรวจสอบ"}
              role="licAdmin"
              desc={
                <>
                  คุณต้องการยืนยันผ่านการตรวจสอบ
                  <br />
                  และส่งคำขอไปยังผู้อนุมัติใช่หรือไม่
                </>
              }
              confirmText="ผ่านการตรวจสอบ"
              onSuccess={() => {
                const refreshProfile = async () => {
                  try {
                    const response = await fetchProfile();
                    setProfile(response.data);
                  } catch (error) {
                    console.error("Failed to refresh profile:", error);
                  }
                };
                refreshProfile();
              }}
            />
            <CancelRequestModal
              id={data?.trn_request_annual_driver_uid || ""}
              ref={cancelRequestModalRef}
              title="ยืนยันยกเลิกคำขอ?"
              desc="เมื่อยกเลิกคำขอแล้ว คุณจะสามารถแก้ไขข้อมูล และขออนุมัติทำหน้าที่ขับรถยนต์ได้อีกครั้ง"
              role="licAdmin"
              confirmText="ยกเลิกคำขอ"
              onSuccess={() => {
                const refreshProfile = async () => {
                  try {
                    const response = await fetchProfile();
                    setProfile(response.data);
                  } catch (error) {
                    console.error("Failed to refresh profile:", error);
                  }
                };
                refreshProfile();
              }}
            />
          </>
        )}

      {data?.ref_request_annual_driver_status_code === "20" &&
        data?.approved_request_emp_id === profile?.emp_id && (
          <>
            {" "}
            <ApproveRequestModal
              id={data?.trn_request_annual_driver_uid}
              ref={approveRequestModalRef}
              title={"ยืนยันอนุมัติคำขอ"}
              role="licFinalAdmin"
              desc={
                <>
                  คุณต้องการอนุมัติให้ {data?.created_request_emp_name}
                  <br />
                  ทำหน้าที่ขับรถยนต์ประจำปี {data?.annual_yyyy} ใช่หรือไม่ ?
                </>
              }
              confirmText="อนุมัติคำขอ"
              onSuccess={() => {
                const refreshProfile = async () => {
                  try {
                    const response = await fetchProfile();
                    setProfile(response.data);
                  } catch (error) {
                    console.error("Failed to refresh profile:", error);
                  }
                };
                refreshProfile();
              }}
            />
            <CancelRequestModal
              id={data?.trn_request_annual_driver_uid || ""}
              ref={cancelRequestModalRef}
              title="ยืนยันยกเลิกคำขอ?"
              desc="เมื่อยกเลิกคำขอแล้ว คุณจะสามารถแก้ไขข้อมูล และขออนุมัติทำหน้าที่ขับรถยนต์ได้อีกครั้ง"
              role="licFinalAdmin"
              confirmText="ยกเลิกคำขอ"
              onSuccess={() => {
                const refreshProfile = async () => {
                  try {
                    const response = await fetchProfile();
                    setProfile(response.data);
                  } catch (error) {
                    console.error("Failed to refresh profile:", error);
                  }
                };
                refreshProfile();
              }}
            />
          </>
        )}
    </div>
  );
}
