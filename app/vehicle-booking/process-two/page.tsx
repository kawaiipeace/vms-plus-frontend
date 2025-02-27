"use client";
import Header from "@/app/components/header";
import ProcessRequestCar from "@/app/components/processRequestCar";
import SideBar from "@/app/components/sideBar";
import AutoCarCard from "@/app/components/autoCarCard";
import SelectCarCard from "@/app/components/selectCarCard";
import Pagination from "@/app/components/pagination";
import CustomSelect from "@/app/components/customSelect";
import ZeroRecord from "@/app/components/zeroRecord";
import DatePicker from "@/app/components/datePicker";

export default function ProcessTwo() {

  const orgOptions = ["ทุกสังกัด", "หน่วยงานต้นสังกัด", "ฝพจ.", "กอพ.2"];
  const vehicleOptions = [
    "ทุกประเภทยานพาหนะ",
    "รถแวนตรวจการ (รถเก๋ง, SUV)",
    "รถตู้นั่ง",
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

            <ProcessRequestCar step={2} />

            <div className="form-steps-group">

              <div className="form-steps" data-step="2">
                <div className="form-section">
                  <div className="page-section-header border-0">
                    <div className="page-header-left">
                      <div className="page-title">
                        <span className="page-title-label">
                          ข้อมูลผู้ใช้ยานพาหนะ
                        </span>
                        <span className="badge badge-outline badge-gray page-title-status">
                          20 คัน
                        </span>
                      </div>
                      <div className="page-desc">
                        ระบบจะแสดงรายการยานพาหนะที่พร้อมให้บริการตามช่วงเวลาและเงื่อนไขที่กำหนด
                      </div>
                    </div>
                  </div>

                  <div className="search-section flex justify-between">
                    <div className="input-group input-group-search w-6/12">
                      <div className="input-group-prepend">
                        <span className="input-group-text search-ico-info">
                          <i className="material-symbols-outlined">search</i>
                        </span>
                      </div>
                      <input
                        type="text"
                        className="form-control dt-search-input"
                        placeholder="ค้นหาเลขทะเบียน, ยี่ห้อ"
                      />
                      <div className="input-group-append hidden">
                        <span className="input-group-text search-ico-trailing">
                          <i className="material-symbols-outlined">
                            close_small
                          </i>
                        </span>
                      </div>
                    </div>

                    <div className="search-filter w-12/12 md:w-6/12 sm:gap-4 flex md:justify-end">
                      <CustomSelect w="md:w-[13.4rem]" options={orgOptions} />
                      <CustomSelect w="md:w-[14rem]" options={vehicleOptions} />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-5 w-full">
                    <AutoCarCard
                      imgSrc="/assets/img/admin-selected.png"
                      title="ผู้ดูแลยานพาหนะเลือกให้"
                      desc="สายงานดิจิทัล"
                    />
                    <AutoCarCard
                      imgSrc="/assets/img/system-selected.png"
                      title="ระบบเลือกยานพาหนะให้อัตโนมัติ"
                      desc="สายงานดิจิทัล"
                    />
                    <SelectCarCard
                      imgSrc="/assets/img/sample-car.jpeg"
                      title="Toyota Yaris"
                      subTitle="ก78ยบ กรุงเทพ"
                    />
                    <SelectCarCard
                      imgSrc="/assets/img/sample-car.jpeg"
                      title="Toyota Yaris"
                      subTitle="ก78ยบ กรุงเทพ"
                    />
                    <SelectCarCard
                      imgSrc="/assets/img/sample-car.jpeg"
                      title="Toyota Yaris"
                      subTitle="ก78ยบ กรุงเทพ"
                    />
                  </div>

                  <div className="pagination mt-[1.5rem] flex justify-end">
                    <Pagination />
                  </div>
                </div>
              </div>
            </div>

            <ZeroRecord
              imgSrc="/assets/img/empty/create_request_empty state_vehicle.svg"
              title="ไม่พบยานพาหนะ"
              desc={
                <>
                  ระบบไม่พบยานพาหนะที่คุณสามารถเลือกได้
                  <br />
                  ลองค้นหาใหม่อีกครั้ง
                </>
              }
              button="ล้างคำค้นหา"
            />

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
