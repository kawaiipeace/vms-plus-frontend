"use client";
import LoginHeader from "@/components/loginHeader";
import BackButton from "@/components/backButton";
import RequestListTable from "@/components/tables/request-list-table";

export default function CarpoolManagement() {

  return (
    <div className="page-container">

        <RequestListTable />
    </div>
  );
}
