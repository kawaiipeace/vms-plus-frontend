"use client";
import { useEffect, useState } from "react";
import { useSidebar } from "@/contexts/sidebarContext";
import Header from "@/components/header";
import RequestDetailTabs from "@/components/tabs/requestDetailTab";
import SideBar from "@/components/sideBar";
import { useParams, useSearchParams } from "next/navigation";
import { requestDetail } from "@/services/bookingUser";
import { RequestDetailType } from "@/app/types/request-detail-type";
import PageHeader from "@/components/pageHeader";
import ToastCustom from "@/components/toastCustom";

export default function RequestDetail() {
  const { isPinned } = useSidebar();

  const params = useParams();
  const searchParams = useSearchParams();
  const request_id = String(params.requestId);
  const requestNo = searchParams.get("request-no");

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

  const sendbackagainReq = searchParams.get("sendbackagain-req");

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
            {sendbackagainReq === "success" && (
              <ToastCustom
                title="ส่งคำขออีกครั้งสำเร็จ"
                desc={
                  <>
                    คำขอใช้ยานพาหนะเลขที่ {requestNo}
                    <br />
                    ส่งคำขออีกครั้งเรียบร้อยแล้ว
                  </>
                }
                status="success"
              />
            )}
            {requestData && <PageHeader data={requestData} />}
            <RequestDetailTabs requestId={request_id} />
          </div>
        </div>
      </div>
    </div>
  );
}
