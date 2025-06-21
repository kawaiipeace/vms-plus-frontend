"use client";

import React, { useEffect, useState } from "react";
import { useSidebar } from "@/contexts/sidebarContext";
import Header from "@/components/header";
import SideBar from "@/components/sideBar";
import DriverProgressTab from "@/components/tabs/driverProgressTab";
import DriverSoonTab from "@/components/tabs/driverSoonTab";
import DriverFinishTab from "@/components/tabs/driverFinishTab";
import DriverCancelTab from "@/components/tabs/driverCancelTab";
import {
  ReceivedKeyDriverParams,
  VehicleInUseDriverMenu,
} from "@/app/types/vehicle-in-use-driver-type";
import { fetchMenus, receivedKeyDriver } from "@/services/vehicleInUseDriver";
import buddhistEra from "dayjs/plugin/buddhistEra";
import "dayjs/locale/th";
import dayjs from "dayjs";
import { RequestListType } from "@/app/types/request-list-type";
import PaginationControls from "@/components/table/pagination-control";
import { PaginationType } from "@/app/types/request-action-type";
import Link from "next/link";

dayjs.extend(buddhistEra);
dayjs.locale("th");

const paginationDefault: PaginationType = {
  limit: 10,
  page: 1,
  total: 0,
  totalPages: 0,
};

export default function DriverMain() {
  const [pagination, setPagination] =
    useState<PaginationType>(paginationDefault);
  const [params, setParams] = useState<ReceivedKeyDriverParams>({
    ref_request_status_code: "51,60,70,71",
  });
  const [statusData, setStatusData] = useState<VehicleInUseDriverMenu[]>([]);
  const [data, setData] = useState<RequestListType[]>([]);
  const [activeTab, setActiveTab] = useState(0);
  const { isPinned } = useSidebar();

  const menuOrder: { [key: string]: string } = {
    0: "51,60,70,71",
    1: "50",
    2: "80",
    3: "90",
  };

  const getFilterData = () => {
    const status = menuOrder[activeTab];
    const filter = data.filter((e) =>
      status.includes(e.ref_request_status_code || "")
    );

    return filter.sort(
      (a, b) => dayjs(a.start_datetime).unix() - dayjs(b.start_datetime).unix()
    );
  };

  const filterData = getFilterData();

  //   const reviewCarDriveModalRef = useRef<{
  //     openModal: () => void;
  //     closeModal: () => void;
  //   } | null>(null);

  useEffect(() => {
    const fetchMenuFunc = async () => {
      try {
        const response = await fetchMenus();
        const result = response.data;
        setStatusData(result);
      } catch (error) {
        console.error("Error fetching status data:", error);
      }
    };

    const fetchReceivedKeyDriverFunc = async () => {
      try {
        const response = await receivedKeyDriver(params);
        const result = response.data;
        setData(result.requests ?? []);
        setPagination({ ...result?.pagination });
      } catch (error) {
        console.error("Error fetching status data:", error);
      }
    };

    fetchMenuFunc();
    fetchReceivedKeyDriverFunc();
  }, [params]);

  const getTabContent = (code: string) => {
    switch (code) {
      case "50":
        return <DriverSoonTab data={filterData} />;
      case "51,60,70,71":
        return <DriverProgressTab data={filterData} />;
      case "80":
        return <DriverFinishTab data={filterData} />;
      case "90":
        return <DriverCancelTab data={filterData} />;
      default:
        return <>Invalid</>;
    }
  };

  const getOrder = (status_code: string) => {
    const keys = Object.keys(menuOrder);
    const order = keys.find((e) => menuOrder[e].includes(status_code));
    return Number(order);
  };

  const getTabs = () => {
    const tabs = statusData?.map((item) => ({
      order: getOrder(item.ref_request_status_code),
      label: item.ref_request_status_name,
      badge: item.count > 0 ? item.count : undefined,
      content: getTabContent(item.ref_request_status_code),
    }));

    return tabs.sort((a, b) => a.order - b.order);
  };

  const tabs = getTabs();

  const handlePageChange = (page: number) => {
    setParams({ ...params, page });
  };

  const handlePageSizeChange = (pageSize: number) => {
    setParams({ ...params, limit: pageSize });
  };

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
                    <Link href="/">
                      <i className="material-symbols-outlined">home</i>
                    </Link>
                  </li>
                  <li className="breadcrumb-item active" aria-current="page">
                    <a>งานของฉัน</a>
                  </li>
                </ul>
              </div>

              <div className="page-group-header">
                <div className="page-title">
                  <span className="page-title-label">งานของฉัน</span>
                  {/* <span className="badge badge-outline badge-gray">95 กลุ่ม</span> */}
                </div>
              </div>
            </div>

            <div className="w-full">
              <div className="flex border-b tablist w-[100vw] max-w-[100vw] overflow-auto">
                {tabs.map((tab, index) => (
                  <button
                    key={index}
                    className={`tab transition-colors duration-300 ease-in-out ${
                      activeTab === index ? "active" : "text-gray-600"
                    }`}
                    onClick={() => {
                      setActiveTab(index);
                      setParams({
                        ...params,
                        page: 1,
                        ref_request_status_code: menuOrder[index],
                      });
                    }}
                  >
                    <div className="flex gap-2 items-center">
                      {tab.label}
                      {tab.badge && (
                        <span className="badge badge-brand badge-pill-outline">
                          {tab.badge}
                        </span>
                      )}{" "}
                    </div>
                  </button>
                ))}
              </div>

              <div>{tabs[activeTab]?.content}</div>
              <div>
                {data.length > 0 && (
                  <PaginationControls
                    pagination={pagination}
                    onPageChange={handlePageChange}
                    onPageSizeChange={handlePageSizeChange}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
        {/* <ReviewCarDriveModal ref={reviewCarDriveModalRef} /> */}
      </div>
    </>
  );
}
