"use client";

import React, { useState, Suspense } from "react";
import { useSidebar } from "@/contexts/sidebarContext";
import Header from "@/components/header";
import SideBar from "@/components/sideBar";
import DriversListTab from "@/components/drivers-management/tabs/driversListTab";
import ToastCustom from "@/components/toastCustom";
import { useSearchParams } from "next/navigation";
import VehicleTimeLine from "@/components/drivers-management/driverManageTimeLineFlow";

import { DriversManagementParams } from "@/app/types/drivers-management-type";

import buddhistEra from "dayjs/plugin/buddhistEra";
import "dayjs/locale/th";
import dayjs from "dayjs";

dayjs.extend(buddhistEra);
dayjs.locale("th");

function RequestListContent() {
  const searchParams = useSearchParams();
  const createReq = searchParams.get("create");
  const deleteReq = searchParams.get("delete");
  const driverCreateName = searchParams.get("driverName");
  // const cancelReq = searchParams.get("cancel-req");
  // const requestId = searchParams.get("request-id");
  // const receivedKey = searchParams.get("received-key");
  // const licensePlate = searchParams.get("license-plate");
  // const returned = searchParams.get("returned");
  // const requestNo = searchParams.get("request-no");

  return (
    <>
      {createReq === "success" && (
        <ToastCustom
          title="สร้างข้อมูลพนักงานขับรถสำเร็จ"
          desc={
            <>
              สร้างข้อมูลพนักงานขับรถ <span className="font-semibold">{driverCreateName}</span> เรียบร้อยแล้ว
            </>
          }
          status="success"
          // seeDetail={`/vehicle-booking/request-list/${requestId}`}
          // seeDetailText="ดูสถานะ"
        />
      )}
      {deleteReq === "success" && (
        <ToastCustom
          title="ลบพนักงานขับรถสำเร็จ"
          desc={
            <>
              พนักงานขับรถ <span className="font-semibold">{driverCreateName}</span> <br />
              ถูกลบจากระบบเรียบร้อยแล้ว
            </>
          }
          status="success"
        />
      )}
      {/* {receivedKey === "success" && (
        <ToastCustom
          title="รับกุญแจสำเร็จ"
          desc={
            <>
              รับกุญแจรถทะเบียน <span className="font-semibold">{licensePlate}</span> เรียบร้อยแล้ว
            </>
          }
          status="success"
        />
      )} */}
      {/* {cancelReq === "success" && (
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
      )} */}
    </>
  );
}

const DriverManagementPage = () => {
  const [params, setParams] = useState<DriversManagementParams>({});
  // const [statusData, setStatusData] = useState<VehicleInUseDriverMenu[]>([]);
  const [activeTab, setActiveTab] = useState(0);
  const { isPinned } = useSidebar();

  // const getFilterData = () => {
  //   const status = menuOrder[activeTab];
  //   const filter = data.filter((e) => status.includes(e.ref_request_status_code || ""));

  //   return filter.sort((a, b) => dayjs(a.start_datetime).unix() - dayjs(b.start_datetime).unix());
  // };

  // const filterData = getFilterData();

  // useEffect(() => {
  //   const fetchMenuFunc = async () => {
  //     try {
  //       const response = await fetchMenus();
  //       const result = response.data;
  //       setStatusData(result);
  //     } catch (error) {
  //       console.error("Error fetching status data:", error);
  //     }
  //   };

  //   const fetchReceivedKeyDriverFunc = async () => {
  //     try {
  //       const response = await receivedKeyDriver(params);
  //       const result = response.data;
  //       setData(result.requests ?? []);
  //       setPagination({ ...result?.pagination });
  //     } catch (error) {
  //       console.error("Error fetching status data:", error);
  //     }
  //   };

  //   fetchMenuFunc();
  //   fetchReceivedKeyDriverFunc();
  // }, [params]);

  // const getTabContent = (code: string) => {
  //   switch (code) {
  //     case "50":
  //       return <DriverSoonTab data={filterData} />;
  //     case "80":
  //       return <DriverFinishTab data={filterData} />;
  //     default:
  //       return <>Invalid</>;
  //   }
  // };

  // const getOrder = (status_code: string) => {
  //   const keys = Object.keys(menuOrder);
  //   const order = keys.find((e) => menuOrder[e].includes(status_code));
  //   return Number(order);
  // };

  const getTabs = () => {
    // const tabs = statusData?.map((item) => ({
    //   order: getOrder(item.ref_request_status_code),
    //   label: item.ref_request_status_name,
    //   badge: item.count > 0 ? item.count : undefined,
    //   content: getTabContent(item.ref_request_status_code),
    // }));

    // return tabs.sort((a, b) => a.order - b.order);
    const tabs = [
      {
        order: 0,
        label: "ปฏิทินการจอง",
        content: <VehicleTimeLine />,
      },
      {
        order: 1,
        label: "พนักงานขับรถ",
        content: <DriversListTab />,
      },
    ];
    return tabs;
  };

  const tabs = getTabs();

  return (
    <>
      <div className="main-container">
        <SideBar menuName="ข้อมูลพนักงานขับรถ" />
        <div className={`main-content ${isPinned ? "md:pl-[280px]" : "md:pl-[80px]"}`}>
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
                    <a>ข้อมูลพนักงานขับรถ</a>
                  </li>
                </ul>
              </div>

              <div className="page-group-header">
                <div className="page-title">
                  <span className="page-title-label">ข้อมูลพนักงานขับรถ</span>
                </div>
              </div>
            </div>

            <div className="w-full">
              <div className="flex border-b tablist z-[10] w-full max-w-[100vw] overflow-auto">
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
                      });
                    }}
                  >
                    <div className="flex gap-2 items-center">{tab.label}</div>
                  </button>
                ))}
              </div>

              <div>{tabs[activeTab]?.content}</div>
            </div>
          </div>
        </div>
      </div>
      <Suspense fallback={<div></div>}>
        <RequestListContent />
      </Suspense>
    </>
  );
};

export default DriverManagementPage;
