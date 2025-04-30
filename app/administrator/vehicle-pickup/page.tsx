"use client";
import { useEffect, useState } from "react";
import { useSidebar } from "@/contexts/sidebarContext";
import Header from "@/components/header";
import SideBar from "@/components/sideBar";
import { useParams } from "next/navigation";
import { RequestDetailType } from "@/app/types/request-detail-type";
import { LogProvider } from "@/contexts/log-context";
import { fetchRequestDetail } from "@/services/adminService";
import RequestVehiclePickupDetailTabs from "@/components/admin/tabs/requestVehiclePickupDetailTab";
import PageVehiclePickupHeader from "@/components/page-header/page-vehicle-pickup-header";


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
        <SideBar menuName="ตรวจสอบและจัดการคำขอ" />

        <div
          className={`main-content ${
            isPinned ? "md:pl-[280px]" : "md:pl-[80px]"
          }`}
        >
          <Header />
          <div className="main-content-body">
          {requestData && <PageVehiclePickupHeader data={requestData} />}
          <LogProvider>
            <RequestVehiclePickupDetailTabs requestId={request_id} />
            </LogProvider>
          </div>
        </div>
      </div>
      
    </div>
  );
}
