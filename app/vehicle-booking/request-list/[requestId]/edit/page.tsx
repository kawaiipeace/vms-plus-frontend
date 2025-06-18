"use client";
import { useEffect, useState } from "react";
import { useSidebar } from "@/contexts/sidebarContext";
import Header from "@/components/header";
import SideBar from "@/components/sideBar";
import { useParams } from "next/navigation";
import { requestDetail } from "@/services/bookingUser";
import { RequestDetailType } from "@/app/types/request-detail-type";
import PageHeader from "@/components/pageHeader";
import RequestEditTabs from "@/components/tabs/requestEditTab";
import { LogProvider } from "@/contexts/log-context";

export default function RequestDetail() {
  const { isPinned } = useSidebar();

  const params = useParams();
  const {requestId} = params;
  const request_id = String(requestId);

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
            {requestData && <PageHeader data={requestData} />}
            <LogProvider>
              {" "}
              <RequestEditTabs requestId={request_id} />
            </LogProvider>
          </div>
        </div>
      </div>
    </div>
  );
}
