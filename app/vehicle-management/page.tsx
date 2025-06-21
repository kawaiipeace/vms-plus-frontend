"use client";

import Header from "@/components/header";
import SideBar from "@/components/sideBar";
import VehicleManagementTabs from "@/components/tabs/vehicleManagementTabs";
import { useSidebar } from "@/contexts/sidebarContext";
import Link from "next/link";

const Breadcrumbs = () => (
    <div className="breadcrumbs text-sm">
        <ul>
            <li className="breadcrumb-item">
                <Link href="/">
                    <i className="material-symbols-outlined">home</i>
                </Link>
            </li>
            <li className="breadcrumb-item active">
                <Link href="/">ข้อมูลยานพาหนะ</Link>
            </li>
        </ul>
    </div>
);

const PageHeader = () => (
    <div className="page-header">
        <Breadcrumbs />
        <div className="page-group-header">
            <div className="page-title">
                <span className="page-title-label">ข้อมูลยานพาหนะ</span>
            </div>
        </div>
    </div>
);

export default function VehicleManagement() {
    const { isPinned } = useSidebar();

    return (
        <div className="main-container">
            <SideBar menuName="ข้อมูลยานพาหนะ" />
            <div className={`main-content ${isPinned ? "md:pl-[280px]" : "md:pl-[80px]"}`}>
                <Header />
                <div className="main-content-body">
                    <PageHeader />
                    <VehicleManagementTabs />
                </div>
            </div>
        </div>
    );
}