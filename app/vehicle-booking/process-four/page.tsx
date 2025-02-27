"use client";
import React, { useRef } from "react";
import Header from "@/app/components/header";
import ProcessRequestCar from "@/app/components/processRequestCar";
import SideBar from "@/app/components/sideBar";
import TermAndConditionModal from "@/app/components/termAndConditionModal";
import Image from "next/image";
import JourneyDetailModal from "@/app/components/journeyDetailModal";
import VehiclePickModel from "@/app/components/vehiclePickModal";
import DriverAppointmentModal from "@/app/components/driverAppointmentModal";
import VehicleUserModal from "@/app/components/vehicleUserModal";
import ReferenceModal from "@/app/components/referenceModal";
import DisbursementModal from "@/app/components/disbursementModal";
import ApproverModal from "@/app/components/approverModal";

export default function ProcessFour() {
  const termAndConditionModalRef = useRef<{
    openModal: () => void;
    closeModal: () => void;
  } | null>(null);
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
  
  return (
    <div>
      <div className="main-container">
        <SideBar />

        <div className="main-content">
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
                  <li className="breadcrumb-item">
                    <a>คำขอใช้ยานพาหนะ</a>
                  </li>
                  <li className="breadcrumb-item active" aria-current="page">
                    สร้างคำขอใช้ยานพาหนะ
                  </li>
                </ul>
              </div>

              <div className="page-group-header">
                <div className="page-title">
                  <span className="page-title-label">สร้างคำขอใช้ยานพาหนะ</span>
                  {/* <!-- <span className="badge badge-outline badge-gray">95 กลุ่ม</span> --> */}
                </div>
              </div>
            </div>

            <ProcessRequestCar step={4} />

            <div className="form-steps-group">
              <div className="form-steps" data-step="4">
                <div className="form-section">
                  <div className="page-section-header border-0">
                    <div className="page-header-left">
                      <div className="page-title">
                        <span className="page-title-label">
                          ยืนยันการสร้างคำขอ
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gird-cols-1 gap-4">
                  <div className="w-full row-start-2 md:col-start-1">
                    <div className="form-section">
                      <div className="form-section-header">
                        <div className="form-section-header-title">
                          ผู้ใช้ยานพาหนะ
                        </div>
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
                              src="/assets/img/sample-avatar.png"
                              className="avatar avatar-md"
                              width={100}
                              height={100}
                              alt=""
                            />
                            <div className="form-plaintext-group align-self-center">
                              <div className="form-label">
                                ศรัญยู บริรัตน์ฤทธิ์
                              </div>
                              <div className="supporting-text-group">
                                <div className="supporting-text">505291</div>
                                <div className="supporting-text">
                                  นรค.6 กอพ.1 ฝพจ.
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="form-card-right align-self-center">
                            <div className="flex flex-wrap gap-4">
                              <div className="col-span-12 md:col-span-6">
                                <div className="form-group form-plaintext">
                                  <i className="material-symbols-outlined">
                                    smartphone
                                  </i>
                                  <div className="form-plaintext-group">
                                    <div className="form-text text-nowrap">
                                      091-234-5678
                                    </div>
                                  </div>
                                </div>
                              </div>

                              <div className="col-span-12 md:col-span-6">
                                <div className="form-group form-plaintext">
                                  <i className="material-symbols-outlined">
                                    call
                                  </i>
                                  <div className="form-plaintext-group">
                                    <div className="form-text text-nowra">
                                      6032
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

                      <div className="form-card">
                        <div className="form-card-body">
                          <div className="grid grid-cols-12 gap-4">
                            <div className="col-span-12 md:col-span-6">
                              <div className="form-group form-plaintext">
                                <i className="material-symbols-outlined">
                                  calendar_month
                                </i>
                                <div className="form-plaintext-group">
                                  <div className="form-label">
                                    วันที่เดินทาง
                                  </div>
                                  <div className="form-text">
                                    01/01/2567 - 07/01/2567
                                  </div>
                                </div>
                              </div>
                            </div>

                            <div className="col-span-6 md:col-span-3">
                              <div className="form-group form-plaintext">
                                <i className="material-symbols-outlined">
                                  departure_board
                                </i>
                                <div className="form-plaintext-group">
                                  <div className="form-label">ช่วงเวลา</div>
                                  <div className="form-text">เต็มวัน</div>
                                </div>
                              </div>
                            </div>

                            <div className="col-span-6 md:col-span-3">
                              <div className="form-group form-plaintext">
                                <i className="material-symbols-outlined">
                                  travel_luggage_and_bags
                                </i>
                                <div className="form-plaintext-group">
                                  <div className="form-label">ประเภท</div>
                                  <div className="form-text">ไป-กลับ</div>
                                </div>
                              </div>
                            </div>

                            <div className="col-span-12">
                              <div className="form-group form-plaintext">
                                <i className="material-symbols-outlined">
                                  emoji_transportation
                                </i>
                                <div className="form-plaintext-group">
                                  <div className="form-label">
                                    สถานที่ปฏิบัติงาน
                                  </div>
                                  <div className="form-text">
                                    การไฟฟ้าเขต ฉ.1 และ กฟฟ. ในสังกัด
                                  </div>
                                </div>
                              </div>
                            </div>

                            <div className="col-span-12">
                              <div className="form-group form-plaintext">
                                <i className="material-symbols-outlined">
                                  target
                                </i>
                                <div className="form-plaintext-group">
                                  <div className="form-label">วัตถุประสงค์</div>
                                  <div className="form-text">
                                    เพื่อเก็บรวบรวมข้อมูลการใช้งานระบบ VMS Plus
                                    ขอบเขตงานบริการเช่าชุดเครื่องยนต์กำเนิดไฟฟ้าของ
                                    กฟภ. และงานบริหารจัดการยานพาหนะขนาดใหญ่
                                  </div>
                                </div>
                              </div>
                            </div>

                            <div className="col-span-12">
                              <div className="form-group form-plaintext">
                                <i className="material-symbols-outlined">sms</i>
                                <div className="form-plaintext-group">
                                  <div className="form-label">หมายเหตุ</div>
                                  <div className="form-text">
                                    รายละเอียดแผนและรายชื่อพนักงานตามเอกสารแนบ
                                  </div>
                                </div>
                              </div>
                            </div>

                            <div className="col-span-12">
                              <div className="form-group form-plaintext">
                                <i className="material-symbols-outlined">
                                  groups
                                </i>
                                <div className="form-plaintext-group">
                                  <div className="form-label">
                                    จำนวนผู้โดยสาร
                                  </div>
                                  <div className="form-text">
                                    4 (รวมผู้ขับขี่)
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
                          การนัดหมายพนักงานขับรถ
                        </div>
                        <button
                          className="btn btn-tertiary-brand bg-transparent shadow-none border-none"
                          onClick={() => driverAppointmentModalRef.current?.openModal()}
                        >
                          แก้ไข
                        </button>
                      </div>

                      <div className="form-card">
                        <div className="form-card-body">
                          <div className="grid grid-cols-12">
                            <div className="col-span-12 md:col-span-6">
                              <div className="form-group form-plaintext">
                                <i className="material-symbols-outlined">
                                  pin_drop
                                </i>
                                <div className="form-plaintext-group">
                                  <div className="form-label">
                                    สถานที่นัดหมาย
                                  </div>
                                  <div className="form-text">
                                    Lobby อาคาร LED
                                  </div>
                                </div>
                              </div>
                            </div>

                            <div className="col-span-12 md:col-span-6">
                              <div className="form-group form-plaintext">
                                <i className="material-symbols-outlined">
                                  calendar_month
                                </i>
                                <div className="form-plaintext-group">
                                  <div className="form-label">
                                    วันที่และเวลา
                                  </div>
                                  <div className="form-text">
                                    01/01/2567 08:30
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
                          หนังสืออ้างอิง
                        </div>
                        <button
                          className="btn btn-tertiary-brand bg-transparent border-none shadow-none"
                          onClick={() => referenceModalRef.current?.openModal()}
                        >
                          แก้ไข
                        </button>
                      </div>

                      <div className="form-card">
                        <div className="form-card-body">
                          <div className="grid grid-cols-12">
                            <div className="col-span-12 md:col-span-6">
                              <div className="form-group form-plaintext">
                                <i className="material-symbols-outlined">
                                  description
                                </i>
                                <div className="form-plaintext-group">
                                  <div className="form-label">
                                    เลขที่หนังสืออ้างอิง
                                  </div>
                                  <div className="form-text">
                                    กอพ.1(ก)123/2567
                                  </div>
                                </div>
                              </div>
                            </div>

                            <div className="col-span-12 md:col-span-6">
                              <div className="form-group form-plaintext">
                                <i className="material-symbols-outlined">
                                  attach_file
                                </i>
                                <div className="form-plaintext-group">
                                  <div className="form-label">เอกสารแนบ</div>
                                  <a href="#" className="form-text text-info">
                                    Document...2567.pdf
                                  </a>
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
                          การเบิกค่าใช้จ่าย
                        </div>
                        <button
                          className="btn btn-tertiary-brand bg-transparent border-none shadow-none"
                          data-toggle="modal"
                          data-target="#editDisbursementModal"
                          onClick={() => disbursementModalRef.current?.openModal()}
                        >
                          แก้ไข
                        </button>
                      </div>

                      <div className="form-card">
                        <div className="form-card-body">
                          <div className="grid grid-cols-12">
                            <div className="col-span-12 md:col-span-6">
                              <div className="form-group form-plaintext">
                                <i className="material-symbols-outlined">
                                  paid
                                </i>
                                <div className="form-plaintext-group">
                                  <div className="form-label">
                                    ประเภทงบประมาณ
                                  </div>
                                  <div className="form-text">
                                    งบทำการ หน่วยงานต้นสังกัด
                                  </div>
                                </div>
                              </div>
                            </div>

                            <div className="col-span-12 md:col-span-6">
                              <div className="form-group form-plaintext">
                                <i className="material-symbols-outlined">
                                  account_balance
                                </i>
                                <div className="form-plaintext-group">
                                  <div className="form-label">ศูนย์ต้นทุน</div>
                                  <div className="form-text">
                                    ZA04020200 : กบห.กอพ.1-บห.
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="col-span-1 row-start-1 md:row-start-2">
                    <div className="form-section">
                      <div className="form-section-header">
                        <div className="form-section-header-title">
                          ยานพาหนะและผู้ขับขี่
                        </div>
                      </div>

                      <div className="card card-section-inline gap-4 flex-col">
                        <div className="card-body card-body-inline">
                          <div className="img img-square w-full h-[239px] rounded-md overflow-hidden">
                            <Image
                              src="/assets/img/sample-car.jpeg"
                              width={100}
                              height={100}
                              className="object-cover w-full h-full"
                              alt=""
                            />
                          </div>
                          <div className="card-content">
                            <div className="card-content-top">
                              <div className="card-title">Toyota Yaris</div>
                              <div className="card-subtitle">ก78ยบ กรุงเทพ</div>
                              <div className="supporting-text-group">
                                <div className="supporting-text">
                                  รถแวนตรวจการ
                                </div>
                                <div className="supporting-text">
                                  สายงานดิจิทัล
                                </div>
                              </div>
                            </div>

                            <div className="card-item-group grid">
                              <div className="card-item col-span-2">
                                <i className="material-symbols-outlined">
                                  credit_card
                                </i>
                                <span className="card-item-text">
                                  บัตรเติมน้ำมัน
                                </span>
                              </div>
                              <div className="card-item col-span-2">
                                <i className="material-symbols-outlined">
                                  local_gas_station
                                </i>
                                <span className="card-item-text">
                                  แก๊สโซฮอล์ พรีเมียม 97
                                </span>
                              </div>
                              <div className="card-item col-span-2">
                                <i className="material-symbols-outlined">
                                  auto_transmission
                                </i>
                                <span className="card-item-text">
                                  เกียร์อัตโนมัติ
                                </span>
                              </div>
                              <div className="card-item col-span-2">
                                <i className="material-symbols-outlined">
                                  airline_seat_recline_extra
                                </i>
                                <span className="card-item-text">
                                  6 ที่นั่ง
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="card card-section-inline mt-5">
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
                                    สายงานดิจิทัล
                                  </div>
                                </div>
                              </div>

                              <button className="btn btn-tertiary-brand bg-transparent shadow-none border-none"   onClick={() => vehiclePickModalRef.current?.openModal()}>
                                เลือกประเภทยานพาหนะ
                              </button>
                            </div>

                            <div className="card-item-group d-flex">
                              <div className="card-item col-span-2">
                                <i className="material-symbols-outlined">
                                  directions_car
                                </i>
                                <span className="card-item-text">
                                  รถแวนตรวจการ (รถเก๋ง, SUV)
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="card card-section-inline mt-5">
                        <div className="card-body card-body-inline">
                          <div className="img img-square img-avatar flex-grow-1 align-self-start">
                            <Image
                              src="/assets/img/graphic/admin_select_driver_small.png"
                              className="rounded-md"
                              width={100}
                              height={100}
                              alt=""
                            />
                          </div>
                          <div className="card-content">
                            <div className="card-content-top">
                              <div className="card-title">
                                ผู้ดูแลเลือกพนักงานขับรถให้
                              </div>
                              <div className="supporting-text-group">
                                <div className="supporting-text">
                                  สายงานดิจิทัล
                                </div>
                              </div>
                            </div>

                            <div className="card-item-group d-flex">
                              <div className="card-item">
                                <i className="material-symbols-outlined">
                                  group
                                </i>
                                <span className="card-item-text">
                                  ว่าง 2 คน
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="card mt-3">
                        <div className="card-body card-body-inline">
                          <div className="img img-square img-avatar flex-grow-1 align-self-start">
                            <Image
                              src="/assets/img/sample-avatar.png"
                              className="rounded-md"
                              width={100}
                              height={100}
                              alt=""
                            />
                          </div>
                          <div className="card-content">
                            <div className="card-content-top">
                              <div className="card-title">
                                ธนพล วิจารณ์ปรีชา
                              </div>
                              <div className="supporting-text-group">
                                <div className="supporting-text">505291</div>
                                <div className="supporting-text">
                                  นรค.6 กอพ.1 ฝพจ.
                                </div>
                              </div>
                            </div>

                            <div className="card-item-group">
                              <div className="card-item">
                                <i className="material-symbols-outlined">
                                  smartphone
                                </i>
                                <span className="card-item-text">
                                  091-234-5678
                                </span>
                              </div>
                              <div className="card-item">
                                <i className="material-symbols-outlined">
                                  call
                                </i>
                                <span className="card-item-text">6032</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      
                    </div>

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

                      <div className="card">
                        <div className="card-body card-body-inline">
                          <div className="img img-square img-avatar flex-grow-1 align-self-start">
                            <Image
                              src="/assets/img/sample-avatar.png"
                                 className="rounded-md"
                              width={100}
                              height={100}
                              alt=""
                            />
                          </div>
                          <div className="card-content">
                            <div className="card-content-top">
                              <div className="card-title">
                                ธนพล วิจารณ์ปรีชา
                              </div>
                              <div className="supporting-text-group">
                                <div className="supporting-text">505291</div>
                                <div className="supporting-text">
                                  นรค.6 กอพ.1 ฝพจ.
                                </div>
                              </div>
                            </div>

                            <div className="card-item-group">
                              <div className="card-item">
                                <i className="material-symbols-outlined">
                                  smartphone
                                </i>
                                <span className="card-item-text">
                                  091-234-5678
                                </span>
                              </div>
                              <div className="card-item">
                                <i className="material-symbols-outlined">
                                  call
                                </i>
                                <span className="card-item-text">6032</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="form-accept">
                การกดปุ่ม “สร้างคำขอ” จะถือว่าท่านอ่านและตกลงยอมรับ{" "}
                <a  onClick={() => termAndConditionModalRef.current?.openModal()} className="text-info text-underline">
                  เงื่อนไข หลักเกณฑ์ และระเบียบการใช้ยานพาหนะ
                </a>
              </div>

              <div className="form-action">
                <button className="btn btn-primary">สร้างคำขอ</button>
              </div>
            </div>
          </div>
        </div>

        <div className="toast-container">
          <div
            className="toast fade toast-success"
            role="alert"
            aria-live="assertive"
            aria-atomic="true"
          >
            <div className="toast-body">
              <i className="material-symbols-outlined icon-settings-fill-300-24">
                check_circle
              </i>
              <div className="toast-content">
                <div className="toast-title">
                  สร้างกลุ่ม “หน่วยงาน กอพ.1” สำเร็จ
                </div>
                <div className="toast-text">
                  กลุ่ม “หน่วยงาน กอพ.1” ได้ถูกสร้างขึ้นมาในระบบเรียบร้อยแล้ว
                </div>
              </div>
              <button type="button" className="close" data-dismiss="toast">
                <i className="material-symbols-outlined">close</i>
              </button>
            </div>
          </div>
        </div>

        <div
          className="modal fade"
          id="filtersModal"
          tabIndex={-1}
          aria-labelledby="filtersModal"
          aria-hidden="true"
        >
          <div className="modal-dialog modal-dialog-scrollable modal-right">
            <div className="modal-content">
              <div className="bottom-sheet">
                <div className="bottom-sheet-icon"></div>
              </div>
              <div className="modal-header">
                <div className="modal-header-group">
                  <div className="featured-ico featured-ico-gray">
                    <i className="material-symbols-outlined icon-settings-400-24">
                      filter_list
                    </i>
                  </div>
                  <div className="modal-header-content">
                    <div className="modal-header-top">
                      <div className="modal-title">ตัวกรอง</div>
                    </div>
                    <div className="modal-header-bottom">
                      <div className="modal-subtitle">
                        กรองข้อมูลให้แสดงเฉพาะข้อมูลที่ต้องการ
                      </div>
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  className="close btn btn-icon btn-tertiary"
                  data-dismiss="modal"
                  aria-label="Close"
                >
                  <i className="material-symbols-outlined">close</i>
                </button>
              </div>
              <div className="modal-body">
                <div className="grid grid-cols-12">
                  <div className="col-12">
                    <div className="form-group">
                      <label className="form-label">สถานะคำขอ</label>
                      <div className="custom-group">
                        <div className="custom-control custom-checkbox custom-control-inline">
                          <input
                            type="checkbox"
                            className="custom-control-input"
                            name="checkbox"
                            data-group="checkboxGroup"
                          />
                          <label className="custom-control-label">
                            <div className="custom-control-label-group">
                              <span className="badge badge-pill-outline badge-info">
                                รออนุมัติ
                              </span>
                            </div>
                          </label>
                        </div>
                      </div>
                      <div className="custom-group">
                        <div className="custom-control custom-checkbox custom-control-inline">
                          <input
                            type="checkbox"
                            className="custom-control-input"
                            name="checkbox"
                            data-group="checkboxGroup"
                          />
                          <label className="custom-control-label">
                            <div className="custom-control-label-group">
                              <span className="badge badge-pill-outline badge-error">
                                ถูกตีกลับ
                              </span>
                            </div>
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-12">
                  <div className="col-12">
                    <div className="form-group">
                      <label className="form-label">วันที่เดินทาง</label>
                      <div className="input-group flatpickr">
                        <div className="input-group-prepend" data-toggle="">
                          <span className="input-group-text">
                            <i className="material-symbols-outlined">
                              calendar_month
                            </i>
                          </span>
                        </div>
                        <input
                          type="text"
                          className="form-control flatpickr-input"
                          placeholder="ระบุช่วงวันที่เดินทาง"
                        />
                        <div className="input-group-append" data-clear>
                          <span className="input-group-text search-ico-trailing">
                            <i className="material-symbols-outlined">close</i>
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-tertiary btn-resetfilter mr-auto"
                >
                  ล้างตัวกรอง
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  data-dismiss="modal"
                >
                  ยกเลิก
                </button>
                <button type="button" className="btn btn-primary">
                  ตกลง
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <TermAndConditionModal ref={termAndConditionModalRef} />
      <DriverAppointmentModal process="edit" ref={driverAppointmentModalRef}/>
      <VehiclePickModel process="edit" ref={vehiclePickModalRef}/>
      <JourneyDetailModal ref={journeyDetailModalRef}/>
      <VehicleUserModal process="edit" ref={vehicleUserModalRef}/>
      <ReferenceModal ref={referenceModalRef}/>
      <DisbursementModal ref={disbursementModalRef} />
      <ApproverModal ref={approverModalRef} />
    </div>
  );
}
