"use client";
import { Suspense, useEffect, useState } from "react";
import { useSidebar } from "@/contexts/sidebarContext";
import Header from "@/components/header";
import SideBar from "@/components/sideBar";
import { useParams, useSearchParams } from "next/navigation";
import { requestDetail } from "@/services/bookingUser";
import { RequestDetailType } from "@/app/types/request-detail-type";
import KeyPickupDetailTabs from "@/components/tabs/keyPickupDetailTab";
import PageKeyPickupHeader from "@/components/page-header/pageKeyPickupHeader";
import ToastCustom from "@/components/toastCustom";

function RequestListContent() {
  const searchParams = useSearchParams();
  const createReq = searchParams.get("create-req");
  const cancelReq = searchParams.get("cancel-req");
  const requestId = searchParams.get("request-id");

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
    </>
  );
}

export default function RequestDetail() {
  const { isPinned } = useSidebar();

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
            {requestData && <PageKeyPickupHeader data={requestData} />}
            <KeyPickupDetailTabs requestId={request_id} />
          </div>
        </div>
      </div>
      <Suspense fallback={<div></div>}>
        <RequestListContent />
      </Suspense>
    </div>
  );
}
