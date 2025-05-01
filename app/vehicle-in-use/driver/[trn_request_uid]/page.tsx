"use client";

import React, { useEffect, useState } from "react";
import { useSidebar } from "@/contexts/sidebarContext";
import Header from "@/components/header";
import SideBar from "@/components/sideBar";
import DriverDetailContent from "@/components/driverDetail";
import { useParams, useSearchParams } from "next/navigation";
import { receivedKeyDriverRequest } from "@/services/vehicleInUseDriver";
import { RequestDetailType } from "@/app/types/request-detail-type";

const DriverDetail = () => {
  const { isPinned } = useSidebar();
  const searchParams = useSearchParams();
  const { trn_request_uid } = useParams();
  const progressTypeUrl = searchParams.get("progressType");
  const [progressType, setProgressType] = useState("");
  const [data, setData] = useState<RequestDetailType>();

  useEffect(() => {
    if (progressTypeUrl) {
      console.log("progressTypeUrl: ", progressTypeUrl, " - progressTypeUrl");
      setProgressType(progressTypeUrl);
    }
  }, [progressTypeUrl]);

  useEffect(() => {
    const receivedKeyDriverRequestFunc = async () => {
      try {
        const response = await receivedKeyDriverRequest(
          trn_request_uid as string
        );
        const result = response.data;
        setData(result);
      } catch (error) {
        console.error("Error fetching status data:", error);
      }
    };

    if (trn_request_uid && typeof trn_request_uid === "string") {
      receivedKeyDriverRequestFunc();
    }
  }, [trn_request_uid]);

  return (
    <>
      <div className="main-container">
        <SideBar menuName="งานพนักงานขับรถ" />
        <div
          className={`main-content ${
            isPinned ? "md:pl-[280px]" : "md:pl-[80px]"
          }`}
        >
          <Header />
          <div className="main-content-body">
            <div className="page-header">
              <div className="breadcrumbs text-sm">
                <ul>
                  <li className="breadcrumb-item">
                    <a>
                      <i className="material-symbols-outlined">home</i>
                    </a>
                  </li>
                  <li className="breadcrumb-item active" aria-current="page">
                    <a>งานของฉัน</a>
                  </li>
                  <li className="breadcrumb-item active" aria-current="page">
                    <a>{progressType}</a>
                  </li>
                </ul>
              </div>

              <div className="page-group-header">
                <div className="page-title">
                  <span className="page-title-label">{progressType}</span>
                  {/* <span className="badge badge-outline badge-gray">95 กลุ่ม</span> */}
                </div>
              </div>
            </div>

            <div className="w-full">
              <DriverDetailContent
                data={data}
                progressType={progressType || ""}
              />
            </div>
          </div>
        </div>
        {/* <ReviewCarDriveModal ref={reviewCarDriveModalRef} /> */}
      </div>
    </>
  );
};

export default DriverDetail;
