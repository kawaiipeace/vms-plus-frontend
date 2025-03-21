import React, { useRef, useState } from "react";
import Image from "next/image";
import JourneyDetailModal from "@/app/components/modal/journeyDetailModal";
import VehiclePickModel from "@/app/components/modal/vehiclePickModal";
import DriverAppointmentModal from "@/app/components/modal/driverAppointmentModal";
import VehicleUserModal from "@/app/components/modal/vehicleUserModal";
import ReferenceModal from "@/app/components/modal/referenceModal";
import DisbursementModal from "@/app/components/modal/disbursementModal";
import ApproverModal from "@/app/components/modal/approverModal";
import AlertCustom from "@/app/components/alertCustom";
import ApproveRequestModal from "@/app/components/modal/approveRequestModal";
import UserInfoCard from "@/app/components/card/userInfoCard";
import PickupKeyCard from "@/app/components/card/pickupKeyCard";
import DriverSmallInfoCard from "@/app/components/card/driverSmallInfoCard";
import JourneyDetailCard from "@/app/components/card/journeyDetailCard";
import ReferenceCard from "@/app/components/card/referenceCard";
import DisburstmentCard from "@/app/components/card/disburstmentCard";
import CarDetailCard2 from "@/app/components/card/carDetailCard2";

interface KeyPickUpDetailFormProps {
  status: string;
}
export default function KeyPickUpDetailForm({ status }: KeyPickUpDetailFormProps) {
  const carSelect = "true";
  const [driverType, setDriverType] = useState("PEA");
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
  const approverModalRef = useRef<{
    openModal: () => void;
    closeModal: () => void;
  } | null>(null);

  const approveRequestModalRef = useRef<{
    openModal: () => void;
    closeModal: () => void;
  } | null>(null);
  const handleDriverTypeChange = (newType: string) => {
    setDriverType(newType);
  };
  return (
    <>
      {status == "edit" && <AlertCustom title="คำขอใช้ถูกตีกลับ" desc="เหตุผล: แก้วัตถุประสงค์และสถานที่ปฏิบัติงานตามเอกสารอ้างอิง" />}
      <div className="grid md:grid-cols-2 gird-cols-1 gap-4">
        <div className="w-full row-start-2 col-span-1 md:col-start-1">
          <div className="form-section">
            <div className="form-section-header">
              <div className="form-section-header-title">ผู้ใช้ยานพาหนะ</div>
              {status != "detail" && (
                <button className="btn btn-tertiary-brand bg-transparent shadow-none border-none" onClick={() => vehicleUserModalRef.current?.openModal()}>
                  แก้ไข
                </button>
              )}
            </div>

            <div className="form-card">
              <div className="form-card-body form-card-inline">
                <div className="form-group form-plaintext form-users">
                  <Image src="/assets/img/sample-avatar.png" className="avatar avatar-md" width={100} height={100} alt="" />
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
                          <div className="form-text text-nowrap">091-234-5678</div>
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
              <div className="form-section-header-title">รายละเอียดการเดินทาง</div>
              {status != "detail" && (
                <button className="btn btn-tertiary-brand bg-transparent shadow-none border-none" onClick={() => journeyDetailModalRef.current?.openModal()}>
                  แก้ไข
                </button>
              )}
            </div>

            <JourneyDetailCard displayOn="keypickup" />
          </div>

          <div className="form-section">
            <div className="form-section-header">
              <div className="form-section-header-title">หนังสืออ้างอิง</div>
              {status != "detail" && (
                <button className="btn btn-tertiary-brand bg-transparent border-none shadow-none" onClick={() => referenceModalRef.current?.openModal()}>
                  แก้ไข
                </button>
              )}
            </div>

            <ReferenceCard />
          </div>

          <div className="form-section">
            <div className="form-section-header">
              <div className="form-section-header-title">การเบิกค่าใช้จ่าย</div>
              {status != "detail" && (
                <button className="btn btn-tertiary-brand bg-transparent border-none shadow-none" data-toggle="modal" data-target="#editDisbursementModal" onClick={() => disbursementModalRef.current?.openModal()}>
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

                  <CarDetailCard2 />
                  <div className="mt-5">
                    <UserInfoCard />
                  </div>
                </>
              ))}

            {driverType == "PEAS" && (
              <>
                {carSelect == "true" ? (
                  <>
                    <div className="form-section-header">
                      <div className="form-section-header-title">ยานพาหนะ</div>
                    </div>

                    <CarDetailCard2 />

                    <DriverSmallInfoCard />
                  </>
                ) : (
                  <>
                    {" "}
                    <div className="card card-section-inline mt-5">
                      <div className="card-body card-body-inline">
                        <div className="img img-square img-avatar flex-grow-1 align-self-start">
                          <Image src="/assets/img/graphic/admin_select_small.png" className="rounded-md" width={100} height={100} alt="" />
                        </div>
                        <div className="card-content">
                          <div className="card-content-top card-content-top-inline">
                            <div className="card-content-top-left">
                              <div className="card-title">ผู้ดูแลเลือกยานพาหนะให้</div>
                              <div className="supporting-text-group">
                                <div className="supporting-text">สายงานดิจิทัล</div>
                              </div>
                            </div>

                            <button className="btn btn-tertiary-brand bg-transparent shadow-none border-none" onClick={() => vehiclePickModalRef.current?.openModal()}>
                              เลือกประเภทยานพาหนะ
                            </button>
                          </div>

                          <div className="card-item-group d-flex">
                            <div className="card-item col-span-2">
                              <i className="material-symbols-outlined">directions_car</i>
                              <span className="card-item-text">รถแวนตรวจการ (รถเก๋ง, SUV)</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="card card-section-inline mt-5">
                      <div className="card-body card-body-inline">
                        <div className="img img-square img-avatar flex-grow-1 align-self-start">
                          <Image src="/assets/img/graphic/admin_select_driver_small.png" className="rounded-md" width={100} height={100} alt="" />
                        </div>
                        <div className="card-content">
                          <div className="card-content-top">
                            <div className="card-title">ผู้ดูแลเลือกพนักงานขับรถให้</div>
                            <div className="supporting-text-group">
                              <div className="supporting-text">สายงานดิจิทัล</div>
                            </div>
                          </div>

                          <div className="card-item-group d-flex">
                            <div className="card-item">
                              <i className="material-symbols-outlined">group</i>
                              <span className="card-item-text">ว่าง 2 คน</span>
                            </div>
                          </div>
                          <div className="card-actions">
                            <button className="btn btn-primary w-full">เลือกพนักงานขับรถ</button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </>
                )}

                <div className="mt-5">
                  <PickupKeyCard />
                </div>
              </>
            )}
            {status != "detail" && status != "edit" && (
              <div className="form-section mt-5">
                <div className="form-section-header">
                  <div className="form-section-header-title">ผู้ขับขี่</div>
                </div>

                <div className="card mt-3">
                  <div className="card-body card-body-inline">
                    <div className="img img-square img-avatar flex-grow-1 align-self-start">
                      <Image src="/assets/img/sample-avatar.png" className="rounded-md" width={100} height={100} alt="" />
                    </div>
                    <div className="card-content">
                      <div className="card-content-top">
                        <div className="card-title">ธนพล วิจารณ์ปรีชา</div>
                        <div className="supporting-text-group">
                          <div className="supporting-text">505291</div>
                          <div className="supporting-text">นรค.6 กอพ.1 ฝพจ.</div>
                        </div>
                      </div>

                      <div className="card-item-group">
                        <div className="card-item">
                          <i className="material-symbols-outlined">smartphone</i>
                          <span className="card-item-text">091-234-5678</span>
                        </div>
                        <div className="card-item">
                          <i className="material-symbols-outlined">call</i>
                          <span className="card-item-text">6032</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {status != "detail" && status != "edit" && (
            <div className="form-section">
              <div className="form-section-header">
                <div className="form-section-header-title">ผู้อนุมัติต้นสังกัด</div>
                <button className="btn btn-tertiary-brand bg-transparent shadow-none border-none" onClick={() => approverModalRef.current?.openModal()}>
                  แก้ไข
                </button>
              </div>

              <UserInfoCard />
            </div>
          )}
        </div>
      </div>
      {status == "edit" && (
        <div className="form-action">
          <button className="btn btn-primary" onClick={() => approveRequestModalRef.current?.openModal()}>
            ส่งคำขออีกครั้ง
          </button>
        </div>
      )}
      <DriverAppointmentModal process="edit" ref={driverAppointmentModalRef} />
      <VehiclePickModel process="edit" ref={vehiclePickModalRef} />
      <JourneyDetailModal ref={journeyDetailModalRef} />
      <VehicleUserModal process="edit" ref={vehicleUserModalRef} />
      <ReferenceModal ref={referenceModalRef} />
      <DisbursementModal ref={disbursementModalRef} />
      <ApproverModal ref={approverModalRef} />
      <ApproveRequestModal ref={approveRequestModalRef} title={"ยืนยันการส่งคำขออีกครั้ง"} desc={"ระบบจะทำการส่งคำขอนี้ ไปให้ต้นสังกัดอนุมัติอีกครั้ง"} confirmText="ส่งคำขอ" />
    </>
  );
}
