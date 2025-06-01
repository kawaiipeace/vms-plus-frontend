"use client";
import { useEffect, useState } from "react";
import { useSidebar } from "@/contexts/sidebarContext";
import Header from "@/components/header";
import SideBar from "@/components/sideBar";
import { useParams } from "next/navigation";
import { RequestAnnualDriver } from "@/app/types/driver-lic-list-type";
import { fetchFinalRequestDetail } from "@/services/driver";
import RequestDetailForm from "@/components/annual-driver-license/requestDetailForm";
import PageHeaderFirst from "@/components/annual-driver-license/pageHeaderFirst";


export default function RequestDetail() {
  const { isPinned } = useSidebar();

  const params = useParams();
  const request_id = String(params.requestId);
  const [requestData, setRequestData] = useState<RequestAnnualDriver>();

  useEffect(() => {
    if (request_id) {
      const fetchRequestDetailfunc = async () => {
        try {
          const response = await fetchFinalRequestDetail(request_id);
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
        <SideBar menuName="อนุมัติขอคำใช้และใบอนุญาต" />

        <div
          className={`main-content ${
            isPinned ? "md:pl-[280px]" : "md:pl-[80px]"
          }`}
        >
          <Header />
          <div className="main-content-body">
          {requestData && <PageHeaderFirst data={requestData} />}
            <RequestDetailForm licType="อนุมัติ" requestId={request_id} />
          </div>
        </div>
      </div>
      
    </div>
  );
}
