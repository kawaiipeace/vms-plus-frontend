"use client";
import { RequestDetailType } from "@/app/types/request-detail-type";
import Header from "@/components/header";
import PageKeyPickupHeader from "@/components/page-header/pageKeyPickupHeader";
import SideBar from "@/components/sideBar";
import VehiclePickupDetailTabs from "@/components/tabs/vehiclePickupDetailTab";
import ToastCustom from "@/components/toastCustom";
import { useSidebar } from "@/contexts/sidebarContext";
import { requestDetail } from "@/services/bookingUser";
import { useParams, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

function RequestListContent() {
  const searchParams = useSearchParams();
  const createReq = searchParams.get("create-req");
  const cancelReq = searchParams.get("cancel-req");
  const requestId = searchParams.get("request-id");
  const returned = searchParams.get("returned-tabs");
  const returnedData = searchParams.get("edit-data-returned-tabs");
  const returnedImage = searchParams.get("edit-image-returned-tabs");
  const requestNo = searchParams.get("request-no");

  return (
    <>
      {createReq === "success" && (
        <ToastCustom
          title="สร้างคำขอใช้ยานพาหนะสำเร็จ"
          desc="หลังจากนี้รอสถานะการอนุมัติจากต้นสังกัด"
          status="success"
          seeDetail={`/vehicle-booking/request-list/${requestId}`}
          seeDetailText="ดูสถานะ"
        />
      )}
      {cancelReq === "success" && (
        <ToastCustom
          title="ยกเลิกคำขอสำเร็จ"
          desc={
            <>
              คำขอใช้ยานพาหนะเลขที่ {requestId}
              <br />
              ถูกยกเลิกเรียบร้อยแล้ว
            </>
          }
          status="success"
        />
      )}
      {returned === "success" && (
        <ToastCustom
          title="คืนยานพาหนะแล้ว"
          desc={
            <div>
              <div className="">
                คืนยานพาหนะคำขอเลขที่ {requestNo}
                <br /> เรียบร้อยแล้ว กรุณารอผู้ดูแลยานพาหนะตรวจสอบ
                <br /> และยืนยันการคืน
              </div>
            </div>
          }
          status="success"
          searchParams="activeTab=การคืนยานพาหนะ"
        />
      )}
      {returnedData === "success" && (
        <ToastCustom
          title="แก้ไขข้อมูลสำเร็จ"
          desc={
            <div>
              <div className="">
                แก้ไขข้อมูลการคืนยานพาหนะคำขอเลขที่
                <br /> {requestNo} เรียบร้อยแล้ว
              </div>
            </div>
          }
          status="success"
          searchParams="activeTab=การคืนยานพาหนะ"
        />
      )}
      {returnedImage === "success" && (
        <ToastCustom
          title="แก้ไขรูปภาพสำเร็จ"
          desc={
            <div>
              <div className="">
                แก้ไขรูปยานพาหนะหลังเดินทางคำขอเลขที่
                <br /> {requestNo} เรียบร้อยแล้ว
              </div>
            </div>
          }
          status="success"
          searchParams="activeTab=การคืนยานพาหนะ"
        />
      )}
    </>
  );
}

export default function RequestDetail() {
  const { isPinned } = useSidebar();
  const searchParams = useSearchParams();
  const active = searchParams.get("activeTab");

  const params = useParams();
  const request_id = String(params.requestId);

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
  }, [request_id, active]);

  return (
    <div>
      <div className="main-container">
        <SideBar menuName="คำขอใช้ยานพาหนะ" />

        <div className={`main-content ${isPinned ? "md:pl-[280px]" : "md:pl-[80px]"}`}>
          <Header />
          <div className="main-content-body">
            {requestData && <PageKeyPickupHeader data={requestData} />}
            <VehiclePickupDetailTabs requestId={request_id} />
          </div>
        </div>
      </div>
      <Suspense fallback={<div></div>}>
        <RequestListContent />
      </Suspense>
    </div>
  );
}
