import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import JourneyDetailModal from "@/components/modal/journeyDetailModal";
import VehiclePickModel from "@/components/modal/vehiclePickModal";
import DriverAppointmentModal from "@/components/modal/driverAppointmentModal";
import VehicleUserModal from "@/components/modal/vehicleUserModal";
import ReferenceModal from "@/components/modal/referenceModal";
import DisbursementModal from "@/components/modal/disbursementModal";
import AlertCustom from "@/components/alertCustom";
import CarDetailCard from "@/components/card/carDetailCard";
import UserInfoCard from "@/components/card/userInfoCard";
import PickupKeyCard from "@/components/card/pickupKeyCard";
import DriverSmallInfoCard from "@/components/card/driverSmallInfoCard";
import JourneyDetailCard from "@/components/card/journeyDetailCard";
import AppointmentDriverCard from "@/components/card/appointmentDriverCard";
import ReferenceCard from "@/components/card/referenceCard";
import DisburstmentCard from "@/components/card/disburstmentCard";
import ConfirmKeyHandOverModal from "../modal/confirmKeyHandOverModal";
import { useFormContext } from "@/contexts/requestFormContext";
import { fetchCodeTypeFromCode } from "@/services/masterService";

interface RequestDetailFormProps {
  status: string;
}
export default function RequestDetailForm({ status }: RequestDetailFormProps) {
  const { formData, updateFormData } = useFormContext();
  const driverType = "PEAS";
  const [haveUserKeyPickUp, setHaveUserKeyPickUp] = useState(true);
  const [costTypeData, setCostTypeData] = useState({});

  useEffect(() => {
    const storedData = localStorage.getItem("formdata");
    if (storedData) {
      updateFormData(JSON.parse(storedData));
    }

    const fetchCostTypeFromCodeFunc =  async () => {
      try {
        const response = await fetchCodeTypeFromCode(formData?.refCostTypeCode || "");
        setCostTypeData(response);
      } catch (error) {
        console.error("API Error:", error);
      }
    }
    fetchCostTypeFromCodeFunc();
   
  }, [updateFormData]);
  

  const driverAppointmentModalRef = useRef<{
    openModal: () => void;
    closeModal: () => void;
  } | null>(null);
  const vehicleUserModalRef = useRef<{
    openModal: () => void;
    closeModal: () => void;
  } | null>(null);
  const journeyDetailModalRef = useRef<{
    openModal: () => void;
    closeModal: () => void;
  } | null>(null);
  const vehiclePickModalRef = useRef<{
    openModal: () => void;
    closeModal: () => void;
  } | null>(null);
  const referenceModalRef = useRef<{
    openModal: () => void;
    closeModal: () => void;
  } | null>(null);
  const disbursementModalRef = useRef<{
    openModal: () => void;
    closeModal: () => void;
  } | null>(null);

  return (
    <>
      {status == "edit" && (
        <AlertCustom
          title="คำขอใช้ถูกตีกลับ"
          desc="เหตุผล: แก้วัตถุประสงค์และสถานที่ปฏิบัติงานตามเอกสารอ้างอิง"
        />
      )}
      <div className="grid md:grid-cols-2 gird-cols-1 gap-4">
        <div className="w-full row-start-2 md:col-start-1">
          <div className="form-section">
            <div className="form-section-header">
              <div className="form-section-header-title">ผู้ใช้ยานพาหนะ</div>
              {status != "detail" && (
                <button
                  className="btn btn-tertiary-brand bg-transparent shadow-none border-none"
                  onClick={() => vehicleUserModalRef.current?.openModal()}
                >
                  แก้ไข
                </button>
              )}
            </div>

            <div className="form-card">
              <div className="form-card-body form-card-inline">
                <div className="form-group form-plaintext form-users">
                  <Image
                    src="/assets/img/sample-avatar.png"
                    className="avatar avatar-md"
                    width={100}
                    height={100}
                    alt=""
                  />
                  <div className="form-plaintext-group align-self-center">
                    <div className="form-label">ศรัญยู บริรัตน์ฤทธิ์</div>
                    <div className="supporting-text-group">
                      <div className="supporting-text">505291</div>
                      <div className="supporting-text">นรค.6 กอพ.1 ฝพจ.</div>
                    </div>
                  </div>
                </div>
                <div className="form-card-right align-self-center">
                  <div className="flex flex-wrap gap-4">
                    <div className="col-span-12 md:col-span-6">
                      <div className="form-group form-plaintext">
                        <i className="material-symbols-outlined">smartphone</i>
                        <div className="form-plaintext-group">
                          <div className="form-text text-nowrap">
                            091-234-5678
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="col-span-12 md:col-span-6">
                      <div className="form-group form-plaintext">
                        <i className="material-symbols-outlined">call</i>
                        <div className="form-plaintext-group">
                          <div className="form-text text-nowra">6032</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="form-section">
            <div className="form-section-header">
              <div className="form-section-header-title">
                รายละเอียดการเดินทาง
              </div>
              {status != "detail" && (
                <button
                  className="btn btn-tertiary-brand bg-transparent shadow-none border-none"
                  onClick={() => journeyDetailModalRef.current?.openModal()}
                >
                  แก้ไข
                </button>
              )}
            </div>

            <JourneyDetailCard />
          </div>

          <div className="form-section">
            <div className="form-section-header">
              <div className="form-section-header-title">
                การนัดหมายพนักงานขับรถ
              </div>
              {status != "detail" && (
                <button
                  className="btn btn-tertiary-brand bg-transparent shadow-none border-none"
                  onClick={() => driverAppointmentModalRef.current?.openModal()}
                >
                  แก้ไข
                </button>
              )}
            </div>

            <AppointmentDriverCard />
          </div>

          <div className="form-section">
            <div className="form-section-header">
              <div className="form-section-header-title">หนังสืออ้างอิง</div>
              {status != "detail" && (
                <button
                  className="btn btn-tertiary-brand bg-transparent border-none shadow-none"
                  onClick={() => referenceModalRef.current?.openModal()}
                >
                  แก้ไข
                </button>
              )}
            </div>

            <ReferenceCard
            />
          </div>

          <div className="form-section">
            <div className="form-section-header">
              <div className="form-section-header-title">การเบิกค่าใช้จ่าย</div>
              {status != "detail" && (
                <button
                  className="btn btn-tertiary-brand bg-transparent border-none shadow-none"
                  data-toggle="modal"
                  data-target="#editDisbursementModal"
                  onClick={() => disbursementModalRef.current?.openModal()}
                >
                  แก้ไข
                </button>
              )}
            </div>

            <DisburstmentCard />
          </div>
        </div>

        <div className="col-span-1 row-start-1 md:row-start-2">
          <div className="form-section">
            {(status != "detail" && status != "edit") ||
              (driverType != "PEAS" && (
                <>
                  <div className="form-section-header">
                    <div className="form-section-header-title">ยานพาหนะ</div>
                  </div>

                  <CarDetailCard />
                  <div className="mt-5">
                    <UserInfoCard UserType="outsource" displayOn="driver" />
                  </div>
                  <div className="mt-5">
                    <PickupKeyCard />
                  </div>
                </>
              ))}

            <div className="form-section-header">
              <div className="form-section-header-title">ยานพาหนะ</div>
            </div>

            <CarDetailCard />
            <div className="form-section-header">
              <div className="form-section-header-title">ผู้ขับขี่</div>
            </div>

            <DriverSmallInfoCard />
            {haveUserKeyPickUp && (
              <>
                <div className="form-section-header">
                  <div className="form-section-header-title">
                    ข้อมูลผู้รับกุญแจ
                  </div>
                </div>
                <DriverSmallInfoCard userKeyPickup={haveUserKeyPickUp} />
              </>
            )}
          </div>
        </div>
      </div>

      <DriverAppointmentModal
        ref={driverAppointmentModalRef}
        id="2"
      />
      <VehiclePickModel process="edit" ref={vehiclePickModalRef} />
      <JourneyDetailModal ref={journeyDetailModalRef} />
      <VehicleUserModal process="edit" ref={vehicleUserModalRef} />
      <ReferenceModal ref={referenceModalRef} />
      <DisbursementModal ref={disbursementModalRef} />
    </>
  );
}
