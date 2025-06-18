import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import JourneyDetailModal from "@/components/modal/journeyDetailModal";
import VehiclePickModel from "@/components/modal/vehiclePickModal";
import EditDriverAppointmentModal from "@/components/modal/editDriverAppointmentModal";
import VehicleUserModal from "@/components/modal/vehicleUserModal";
import ReferenceModal from "@/components/modal/referenceModal";
import DisbursementModal from "@/components/modal/disbursementModal";
import ApproverModal from "@/components/modal/approverModal";
import CarDetailCard from "@/components/card/carDetailCard";
import DriverSmallInfoCard from "@/components/card/driverSmallInfoCard";
import JourneyDetailCard from "@/components/card/journeyDetailCard";
import AppointmentDriverCard from "@/components/card/appointmentDriverCard";
import ReferenceCard from "@/components/card/referenceCard";
import DisburstmentCard from "@/components/card/disburstmentCard";
import DriverPeaInfoCard from "@/components/card/driverPeaInfoCard";
import { FormDataType } from "@/app/types/form-data-type";
import ApproverInfoCard from "@/components/card/approverInfoCard";
import ChooseDriverCard from "@/components/card/chooseDriverCard";
import { fetchVehicleDetail, fetchVehicleInfo } from "@/services/masterService";
import { VehicleDetailType } from "@/app/types/vehicle-detail-type";
import { convertToISO } from "@/utils/convertToISO";

interface Props {
  approverCard?: boolean;
  keyPickUpCard?: boolean;
}

export default function RequestEditForm({
  approverCard,
}: // keyPickUpCard,
Props) {
  const editDriverAppointmentModalRef = useRef<{
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

  const [updatedFormData, setUpdatedFormData] = useState<FormDataType>();

  const [vehicleDetail, setVehicleDetail] = useState<VehicleDetailType | null>(
    null
  );

  const [availableDriver, setAvailableDriver] = useState(0);

  const handleModalUpdate = (updatedData: Partial<FormDataType>) => {
    setUpdatedFormData((prevData) => {
      if (!prevData) return undefined; // Fix: Return undefined instead of null

      return {
        ...prevData,
        ...updatedData,
      };
    });
  };

  useEffect(() => {
    const storedDataString = localStorage.getItem("formData");

    if (storedDataString) {
      const parsedData = JSON.parse(storedDataString); // Parse the string
      setUpdatedFormData(parsedData);
  if (
  (parsedData.isAdminChooseVehicle && parsedData.isSystemChooseVehicle) ||
  (parsedData.isAdminChooseVehicle !== "1" && parsedData.isSystemChooseVehicle !== "1")
) {
        const fetchVehicleDetailData = async () => {
          try {
            if (parsedData?.vehicleSelect) {
              const response = await fetchVehicleDetail(
                parsedData.vehicleSelect
              );
              setVehicleDetail(response.data);
            }
          } catch (error) {
            console.error("Error fetching vehicle details:", error);
          }
        };

        fetchVehicleDetailData();
      }
      if (parsedData?.vehicleSelect) {
        const fetchVehicleInfoFunc = async () => {
          try {
            const response = await fetchVehicleInfo({
              mas_carpool_uid: parsedData.masCarpoolUid,
              work_type: parsedData?.tripType,
              mas_vehicle_uid: parsedData.masCarpoolUid
                ? ""
                : parsedData.vehicleSelect,
              emp_id: parsedData.vehicleUserEmpId,
              start_date: convertToISO(
                String(parsedData.startDate),
                String(parsedData.timeStart)
              ),
              end_date: convertToISO(
                String(parsedData.endDate),
                String(parsedData.timeEnd)
              ),
            });

            setAvailableDriver(response.data.number_of_available_drivers);
          } catch (error) {
            console.error("API Error:", error);
          }
        };

        fetchVehicleInfoFunc();
      }
    }
  }, []);

  if (!updatedFormData) return null;
  return (
    <>
      <div className="grid md:grid-cols-2 gird-cols-1 gap-4">
        <div className="w-full row-start-2 md:col-start-1">
          <div className="form-section">
            <div className="form-section-header">
              <div className="form-section-header-title">ผู้ใช้ยานพาหนะ</div>

              <button
                className="btn btn-tertiary-brand bg-transparent shadow-none border-none"
                onClick={() => vehicleUserModalRef.current?.openModal()}
              >
                แก้ไข
              </button>
            </div>

            <div className="form-card">
              <div className="form-card-body form-card-inline">
                <div className="form-group form-plaintext form-users">
                  <Image
                    src={
                      updatedFormData.userImageUrl || "/assets/img/avatar.svg"
                    }
                    className="avatar avatar-md"
                    width={100}
                    height={100}
                    alt=""
                  />
                  <div className="form-plaintext-group align-self-center">
                    <div className="form-label">
                      {updatedFormData?.vehicleUserEmpName}
                    </div>
                    <div className="supporting-text-group">
                      <div className="supporting-text">
                        {updatedFormData.vehicleUserEmpId}
                      </div>
                      <div className="supporting-text">
                       {
  updatedFormData.deptSapShort
    ? updatedFormData.deptSapShort.replace(/\//g, " ")
    : ""
}
                      </div>
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
                            {updatedFormData.telMobile}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="col-span-12 md:col-span-6">
                      <div className="form-group form-plaintext">
                        <i className="material-symbols-outlined">call</i>
                        <div className="form-plaintext-group">
                          <div className="form-text text-nowra">
                            {" "}
                            {updatedFormData.telInternal}
                          </div>
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

              <button
                className="btn btn-tertiary-brand bg-transparent shadow-none border-none"
                onClick={() => journeyDetailModalRef.current?.openModal()}
              >
                แก้ไข
              </button>
            </div>

            <JourneyDetailCard
              startDate={updatedFormData.startDate}
              endDate={updatedFormData.endDate}
              timeStart={updatedFormData.timeStart}
              timeEnd={updatedFormData.timeEnd}
              workPlace={updatedFormData.workPlace}
              purpose={updatedFormData.purpose}
              remark={updatedFormData.remark}
              tripType={updatedFormData.tripType}
              numberOfPassenger={updatedFormData.numberOfPassenger}
            />
          </div>

          <div className="form-section">
            <div className="form-section-header">
              <div className="form-section-header-title">
                การนัดหมายพนักงานขับรถ
              </div>

              <button
                className="btn btn-tertiary-brand bg-transparent shadow-none border-none"
                onClick={() =>
                  editDriverAppointmentModalRef.current?.openModal()
                }
              >
                แก้ไข
              </button>
            </div>

            <AppointmentDriverCard
              pickupPlace={updatedFormData.pickupPlace}
              pickupDatetime={updatedFormData.pickupDatetime}
            />
          </div>

          <div className="form-section">
            <div className="form-section-header">
              <div className="form-section-header-title">หนังสืออ้างอิง</div>
              <button
                className="btn btn-tertiary-brand bg-transparent border-none shadow-none"
                onClick={() => referenceModalRef.current?.openModal()}
              >
                แก้ไข
              </button>
            </div>

            <ReferenceCard
              refNum={updatedFormData.referenceNumber}
              file={updatedFormData.attachmentFile}
            />
          </div>

          <div className="form-section">
            <div className="form-section-header">
              <div className="form-section-header-title">การเบิกค่าใช้จ่าย</div>
              <button
                className="btn btn-tertiary-brand bg-transparent border-none shadow-none"
                data-toggle="modal"
                data-target="#editDisbursementModal"
                onClick={() => disbursementModalRef.current?.openModal()}
              >
                แก้ไข
              </button>
            </div>
            {updatedFormData.refCostTypeCode && (
              <DisburstmentCard
                refCostTypeCode={updatedFormData.refCostTypeCode}
                costCenter={updatedFormData.costCenter}
                activityNo={updatedFormData.activityNo}
                wbsNo={updatedFormData.wbsNumber}
                networkNo={updatedFormData.networkNo}
                pmOrderNo={updatedFormData.pmOrderNo}
              />
            )}
          </div>
        </div>

        <div className="col-span-1 row-start-1 md:row-start-2">
          <div className="form-section">
            <div className="form-section-header">
              <div className="form-section-header-title">ยานพาหนะ</div>
            </div>

            {updatedFormData.isAdminChooseVehicle === "1" && (
              <div className="card card-section-inline mt-5 mb-5">
                <div className="card-body card-body-inline">
                  <div className="img img-square img-avatar flex-grow-1 align-self-start">
                    <Image
                      src="/assets/img/graphic/admin_select_small.png"
                      className="rounded-md"
                      width={100}
                      height={100}
                      alt=""
                    />
                  </div>
                  <div className="card-content">
                    <div className="card-content-top card-content-top-inline">
                      <div className="card-content-top-left">
                        <div className="card-title">
                          ผู้ดูแลเลือกยานพาหนะให้
                        </div>
                        <div className="supporting-text-group">
                          <div className="supporting-text">
                            {updatedFormData.carpoolName}
                          </div>
                        </div>
                      </div>

                      <button
                        className="btn btn-tertiary-brand bg-transparent shadow-none border-none"
                        onClick={() => vehiclePickModalRef.current?.openModal()}
                      >
                        เลือกประเภทยานพาหนะ
                      </button>
                    </div>

                    <div className="card-item-group d-flex">
                      <div className="card-item col-span-2">
                        <i className="material-symbols-outlined">
                          directions_car
                        </i>
                        <span className="card-item-text">
                          {updatedFormData.requestedVehicleTypeName}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            {updatedFormData.isSystemChooseVehicle === "1" && (
              <div className="card card-section-inline mt-5 mb-5">
                <div className="card-body card-body-inline">
                  <div className="img img-square img-avatar flex-grow-1 align-self-start">
                    <Image
                      src="/assets/img/system-selected.png"
                      className="rounded-md"
                      width={100}
                      height={100}
                      alt=""
                    />
                  </div>
                  <div className="card-content">
                    <div className="card-content-top card-content-top-inline">
                      <div className="card-content-top-left">
                        <div className="card-title">
                          ระบบเลือกยานพาหนะให้อัตโนมัติ
                        </div>
                        <div className="supporting-text-group">
                          <div className="supporting-text">
                            {updatedFormData.carpoolName}
                          </div>
                        </div>
                      </div>

                      {/* <button
                        className="btn btn-tertiary-brand bg-transparent shadow-none border-none"
                        onClick={() => vehiclePickModalRef.current?.openModal()}
                      >
                        เลือกประเภทยานพาหนะ
                      </button> */}
                    </div>

                    <div className="card-item-group d-flex">
                      <div className="card-item col-span-2">
                        <i className="material-symbols-outlined">
                          directions_car
                        </i>
                        <span className="card-item-text">
                          {updatedFormData.requestedVehicleTypeName}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {updatedFormData?.vehicleSelect &&
              vehicleDetail &&
              (!updatedFormData?.isAdminChooseVehicle ||
                updatedFormData?.isAdminChooseVehicle === "0") && (
                <CarDetailCard vehicle={vehicleDetail} />
              )}

            {updatedFormData.isAdminChooseDriver === true && (
              <>
                <ChooseDriverCard
                  number={availableDriver}
                  requestData={updatedFormData}
                />
              </>
            )}
         { updatedFormData?.isAdminChooseDriver === false && (
            updatedFormData.isPeaEmployeeDriver === "1" ? (
              <div className="mt-5">
                <div className="form-section-header">
                  <div className="form-section-header-title">ผู้ขับขี่</div>
                </div>
                <DriverPeaInfoCard driverEmpID={updatedFormData.driverEmpID} />
              </div>
            ) : (
           
                <div className="mt-5">
                  <div className="form-section-header">
                    <div className="form-section-header-title">ผู้ขับขี่</div>
                  </div>
                  <DriverSmallInfoCard
                    showPhone={true}
                    id={updatedFormData?.masCarpoolDriverUid}
                    userKeyPickup={false}
                  />
                </div>
              )
            )}
          </div>
          {approverCard && (
            <div className="form-section">
              <div className="form-section-header">
                <div className="form-section-header-title">
                  ผู้อนุมัติต้นสังกัด
                </div>
                <button
                  className="btn btn-tertiary-brand bg-transparent shadow-none border-none"
                  onClick={() => approverModalRef.current?.openModal()}
                >
                  แก้ไข
                </button>
              </div>
              {approverCard && (
                <ApproverInfoCard
                  emp_id={updatedFormData?.approvedRequestEmpId || ""}
                />
              )}
            </div>
          )}
        </div>
      </div>
      <EditDriverAppointmentModal
        ref={editDriverAppointmentModalRef}
        onUpdate={handleModalUpdate}
      />
      <VehiclePickModel
        ref={vehiclePickModalRef}
        masCarpoolUid={updatedFormData.masCarpoolUid}
        process="edit"
        selectType={
          updatedFormData.isAdminChooseVehicle === "1"
            ? "ผู้ดูแลเลือกยานพาหนะให้"
            : "ระบบเลือกยานพาหนะให้อัตโนมัติ"
        }
        desc={updatedFormData.carpoolName}
        onUpdate={handleModalUpdate}
      />
      <JourneyDetailModal
        ref={journeyDetailModalRef}
        onUpdate={handleModalUpdate}
      />
      <VehicleUserModal
        process="edit"
        ref={vehicleUserModalRef}
        onUpdate={handleModalUpdate}
      />
      <ReferenceModal ref={referenceModalRef} onUpdate={handleModalUpdate} />
      <DisbursementModal
        ref={disbursementModalRef}
        onUpdate={handleModalUpdate}
      />
      <ApproverModal ref={approverModalRef} onUpdate={handleModalUpdate} />
    </>
  );
}
