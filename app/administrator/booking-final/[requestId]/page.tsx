"use client";
import { useEffect, useState } from "react";
import { useSidebar } from "@/contexts/sidebarContext";
import Header from "@/components/header";
import SideBar from "@/components/sideBar";
import { useParams } from "next/navigation";
import { RequestDetailType } from "@/app/types/request-detail-type";
import { fetchRequestDetail } from "@/services/bookingFinal";
import PageHeaderFinal from "@/components/page-header/pageHeaderFinal";
import RequestDetailTabs from "@/components/booking-final/requestDetailTab";
import { LogProvider } from "@/contexts/log-context";

export default function RequestDetail() {
  const { isPinned } = useSidebar();

  const params = useParams();
  const request_id = String(params.requestId);
  const [requestData, setRequestData] = useState<RequestDetailType>();

  useEffect(() => {
    if (request_id) {
      const fetchRequestDetailfunc = async () => {
        try {
          const response = await fetchRequestDetail(request_id);

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
        <SideBar menuName="อนุมัติใช้ยานพาหนะ" />

        <div
          className={`main-content ${
            isPinned ? "md:pl-[280px]" : "md:pl-[80px]"
          }`}
        >
          <Header />
          <div className="main-content-body">
            {requestData && <PageHeaderFinal data={requestData} />}
            <LogProvider>
              {" "}
              <RequestDetailTabs requestId={request_id} />
            </LogProvider>
          </div>
        </div>
      </div>
    </div>
  );
}
