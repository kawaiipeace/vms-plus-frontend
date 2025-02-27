"use client";
import CustomSelect from "@/app/components/customSelect";
import DatePicker from "@/app/components/datePicker";
import DriverCard from "@/app/components/driverCard";
import EmptyDriver from "@/app/components/emptyDriver";
import Header from "@/app/components/header";
import Input from "@/app/components/input";
import ProcessRequestCar from "@/app/components/processRequestCar";
import RadioButton from "@/app/components/radioButton";
import SideBar from "@/app/components/sideBar";
import Tooltip from "@/app/components/tooltips";
import { useState } from "react";

export default function ProcessThree() {
  const [phoneNumber, setPhoneNumber] = useState('');
  
  const [selectedDriverType, setSelectedDriverType] = useState("พนักงาน กฟภ.");
  const driverOptions = [
    "ศรัญยู บริรัตน์ฤทธิ์ (505291)",
    "ธนพล วิจารณ์ปรีชา (514285)",
    "ญาณิศา อุ่นสิริ (543210)",
  ];
  

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

            <ProcessRequestCar step={3} />

            <div className="form-steps-group">
              <div className="form-steps" data-step="3">
                <div className="form-section">
                  <div className="page-section-header border-0">
                    <div className="page-header-left">
                      <div className="page-title">
                        <span className="page-title-label">
                          เลือกประเภทผู้ขับขี่
                        </span>
                      </div>
                      <div className="page-desc">
                        โปรดเลือกพนักงานขับรถที่ท่านต้องการ
                        โดยยานพาหนะบางคันอนุญาตให้พนักงาน กฟภ. สามารถขับเองได้
                      </div>
                    </div>
                  </div>
                  <div className="form-group">
                    <div className="custom-group">
                      <RadioButton
                        name="driverType"
                        label="พนักงาน กฟภ."
                        value="พนักงาน กฟภ."
                        selectedValue={selectedDriverType}
                        setSelectedValue={setSelectedDriverType}
                      />
                      <RadioButton
                        name="driverType"
                        label="พนักงานขับรถ"
                        value="พนักงานขับรถ"
                        selectedValue={selectedDriverType}
                        setSelectedValue={setSelectedDriverType}
                      />
                    </div>
                    {/* <!-- <span className="form-helper">Helper</span> --> */}
                  </div>
                </div>

                <div className={`form-section ${selectedDriverType == "พนักงาน กฟภ." ? "block": "hidden"} `}>
                  <div className="page-section-header border-0">
                    <div className="page-header-left">
                      <div className="page-title">
                        <span className="page-title-label">
                          ข้อมูลผู้ใช้ยานพาหนะ
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-4 flex-col md:flex-row w-full flex-wrap gap-5">
                    <div className="flex-1">
                      <div className="form-group">
                        <label className="form-label">
                          ผู้ใช้ยานพาหนะ
                          <Tooltip
                            title="ผู้ใช้ยานพาหนะคือ?"
                            content="คือคนที่รับผิดชอบยานพาหนะในการเดินทางครั้งนี้ มีหน้าที่ในการกรอกเลขไมล์และ เบิกค่าน้ำมัน"
                            position="right"
                          >
                            <i className="material-symbols-outlined">info</i>
                          </Tooltip>
                        </label>

                        <CustomSelect
                          iconName="person"
                          w="w-full"
                          options={driverOptions}
                        />

                        {/* <!-- <div className="input-group-append">
                          <span className="input-group-text search-ico-trailing">
                            <i className="material-symbols-outlined">close</i>
                          </span>
                        </div> --> */}
                      </div>
                    </div>

                    <div className="flex-1">
                      <div className="form-group">
                        <label className="form-label">ตำแหน่ง / สังกัด</label>
                        <div className="input-group is-readonly">
                          <div className="input-group-prepend">
                            <span className="input-group-text">
                              <i className="material-symbols-outlined">
                                business_center
                              </i>
                            </span>
                          </div>
                          <input
                            type="text"
                            className="form-control"
                            placeholder=""
                          />
                          {/* <!-- <div className="input-group-append">
                          <span className="input-group-text search-ico-trailing">
                            <i className="material-symbols-outlined">close</i>
                          </span>
                        </div> --> */}
                        </div>
                        {/* <!-- <span className="form-helper">Helper</span> --> */}
                      </div>
                    </div>

                    <div className="flex-1">
                      <div className="form-group">
                        <label className="form-label">เบอร์ภายใน</label>
                        <div className="input-group">
                          <div className="input-group-prepend">
                            <span className="input-group-text">
                              <i className="material-symbols-outlined">call</i>
                            </span>
                          </div>
                          <input
                            type="text"
                            className="form-control"
                            placeholder="ระบุเบอร์ภายใน"
                          />
                          {/* <!-- <div className="input-group-append">
                          <span className="input-group-text search-ico-trailing">
                            <i className="material-symbols-outlined">close</i>
                          </span>
                        </div> --> */}
                        </div>
                        {/* <!-- <span className="form-helper">Helper</span> --> */}
                      </div>
                    </div>

                    <div className="flex-1">
                      <div className="form-group">
                        <label className="form-label">เบอร์โทรศัพท์</label>
                        <Input
                          type="text"
                          icon="smartphone"
                          placeholder="ระบุเบอร์โทรศัพท์"
                          value={phoneNumber}
                          onChange={(e) => setPhoneNumber(e.target.value)}
                        />
                        {/* <!-- <span className="form-helper">Helper</span> --> */}
                      </div>
                    </div>

                    <div className="flex-1">
                      <div className="form-group">
                        <label className="form-label">
                          เลขที่ใบอนุญาตขับขี่
                          <span className="form-optional">(ถ้ามี)</span>
                        </label>
                        <Input type="text" icon="id_card" disable={true}   value={phoneNumber}
                          onChange={(e) => setPhoneNumber(e.target.value)} />
                        {/* <!-- <span className="form-helper">Helper</span> --> */}
                      </div>
                    </div>

                    <div className="flex-1">
                      <div className="form-group">
                        <label className="form-label">
                          เลขที่อนุญาตขับขี่ กฟภ.
                        </label>
                        <Input type="text" icon="docs" disable={true}   value={phoneNumber}
                          onChange={(e) => setPhoneNumber(e.target.value)}/>
                        {/* <!-- <span className="form-helper">Helper</span> --> */}
                      </div>
                    </div>
                  </div>
                </div>

                <div className={`form-section ${selectedDriverType == "พนักงานขับรถ" ? "block": "hidden"} `}>
                  <div className="page-section-header border-0">
                    <div className="page-header-left">
                      <div className="page-title">
                        <span className="page-title-label">
                        เลือกพนักงานขับรถ
                        </span>
                        <span className="badge badge-outline badge-gray page-title-status">
                          20 คน
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-4 gap-5 w-full">
                    <DriverCard
                      imgSrc="/assets/img/sample-driver.png"
                      name="ผู้ดูแลยานพาหนะเลือกให้"
                      company="สายงานดิจิทัล"
                      rating={4.6}
                      age="35 ปี 6 เดือน"
                    />
                     <DriverCard
                      imgSrc="/assets/img/sample-driver.png"
                      name="ผู้ดูแลยานพาหนะเลือกให้"
                      company="สายงานดิจิทัล"
                      rating={4.6}
                      age="35 ปี 6 เดือน"
                    />
                     <DriverCard
                      imgSrc="/assets/img/sample-driver.png"
                      name="ผู้ดูแลยานพาหนะเลือกให้"
                      company="สายงานดิจิทัล"
                      rating={4.6}
                      age="35 ปี 6 เดือน"
                    />
                     <DriverCard
                      imgSrc="/assets/img/sample-driver.png"
                      name="ผู้ดูแลยานพาหนะเลือกให้"
                      company="สายงานดิจิทัล"
                      rating={4.6}
                      age="35 ปี 6 เดือน"
                    />
                  </div>
                </div>

                <EmptyDriver imgSrc="/assets/img/empty/empty_driver.svg"
                title="ไม่พบพนักงานขับรถ"
                desc={
                  <>
                    ระบบไม่พบพนักงานขับรถในสังกัด    <br /> กลุ่มยานพาหนะนี้ที่คุณสามารถเลือกได้    <br /> ลองค้นหาใหม่หรือเลือกจากนอกกลุ่มนี้
                  </>
                }
                button="ค้นหานอกสังกัด"
                />
              </div>
            </div>

            <div className="form-action">
              <button className="btn btn-primary" disabled>
                ต่อไป
                <i className="material-symbols-outlined icon-settings-300-24">
                  arrow_right_alt
                </i>
              </button>
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
              <div className="row form-row">
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

              <div className="row form-row">
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
                      <DatePicker placeholder="ระบุช่วงวันที่เดินทาง" />
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
  );
}
