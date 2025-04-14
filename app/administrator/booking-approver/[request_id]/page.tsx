"use client";
import { useEffect, useState } from "react";
import { useSidebar } from "@/contexts/sidebarContext";
import Header from "@/components/header";
import SideBar from "@/components/sideBar";
import { useParams } from "next/navigation";
import { RequestDetailType } from "@/app/types/request-detail-type";
import { firstApproverRequestDetail } from "@/services/bookingApprover";
import PageHeaderFirst from "@/components/pageHeaderFirst";
import RequestDetailTabs from "@/components/booking-approver/requestDetailTab";


export default function RequestDetail() {
  const { isPinned } = useSidebar();

  const params = useParams();
  const request_id = String(params.request_id);

  const [requestData, setRequestData] = useState<RequestDetailType>();

  useEffect(() => {
    if (request_id) {
      const fetchRequestDetailfunc = async () => {
        try {
          const response = await firstApproverRequestDetail(request_id);
          setRequestData(response.data);
          console.log('reqeustdetail',response.data);
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
        <SideBar menuName="อนุมัติขอคำใช้และใบอนุญาต" />

        <div
          className={`main-content ${
            isPinned ? "md:pl-[280px]" : "md:pl-[80px]"
          }`}
        >
          <Header />
          <div className="main-content-body">
          {requestData && <PageHeaderFirst data={requestData} />}
            <RequestDetailTabs requestId={request_id} />
          </div>
        </div>
      </div>
      
    </div>
  );
}
