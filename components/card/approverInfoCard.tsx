import React, { useEffect, useState } from "react";
import Image from "next/image";
import { fetchUserApproverUsers } from "@/services/masterService";
import { ApproverUserType } from "@/app/types/approve-user-type";

interface Props {
  emp_id: string;
}

export default function ApproverInfoCard({
  emp_id,
}: Props) {

     const [approverData, setApproverData] = useState<ApproverUserType>();

    useEffect(() => {
          const fetchApprover = async () => {
            const param = {
              emp_id: emp_id,
            }
              try {
                const response = await fetchUserApproverUsers(param);
                if (response.status === 200) {
                  setApproverData(response.data[0]);
                }
              } catch (error) {
                console.error("Error fetching requests:", error);
              }
            };
        
            fetchApprover();
    }, [emp_id])

  return (
    <div className="card">
      <div className="card-body">
        <div className="card-body-inline">
          <div className="img img-square img-avatar flex-grow-1 align-self-start">
            <Image
              src={approverData?.image_url || "/assets/img/sample-avatar.png"}
              className="rounded-md"
              width={100}
              height={100}
              alt={approverData?.full_name || ""}
            />
          </div>
          <div className="card-content">
            <div className="card-content-top">
              <div className="card-title">{approverData?.full_name}</div>
              <div className="supporting-text-group">
                <div className="supporting-text">{approverData?.emp_id}</div>
                <div className="supporting-text">{approverData?.posi_text + " " + approverData?.dept_sap_short}</div>
              </div>
            </div>
            <div className="card-item-group md:!grid-cols-2 !grid-cols-1">
              <div className="card-item w-full">
                <i className="material-symbols-outlined">smartphone</i>
                <span className="card-item-text">{approverData?.tel_mobile}</span>
              </div>
            
                <div className="card-item w-full">
                  <i className="material-symbols-outlined">call</i>
                  <span className="card-item-text">{approverData?.tel_internal}</span>
                </div>
              
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}