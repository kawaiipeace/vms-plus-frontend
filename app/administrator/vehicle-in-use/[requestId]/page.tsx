"use client";
import { useEffect, useState } from "react";
import { useSidebar } from "@/contexts/sidebarContext";
import Header from "@/components/header";
import SideBar from "@/components/sideBar";
import { useParams } from "next/navigation";
import { RequestDetailType } from "@/app/types/request-detail-type";
import RequestDetailTabs from "@/components/admin/tabs/requestKeyDetailTab";
import PageKeyHandOverHeader from "@/components/page-header/page-key-handover-header";
import { fetchRequestDetail } from "@/services/keyAdmin";
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
          console.log('reffdsfs',response.data);
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
        <SideBar menuName="ตรวจสอบและจัดการคำขอ" />

        <div
          className={`main-content ${
            isPinned ? "md:pl-[280px]" : "md:pl-[80px]"
          }`}
        >
          <Header />
          <div className="main-content-body">
          {requestData && <PageKeyHandOverHeader data={requestData} />}
          <LogProvider>
            <RequestDetailTabs displayKeyHandover={true} requestId={request_id} displayTravelRecord={(requestData?.ref_request_status_code === "60" || requestData?.ref_request_status_code === "60e") ? true : false} displayVehiclePickup={(requestData?.ref_request_status_code === "60" || requestData?.ref_request_status_code === "60e") ? true : false} />
            </LogProvider>
          </div>
        </div>
      </div>
      
    </div>
  );
}
