"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import CustomSelect from "@/app/components/customSelect";
import DriverCard from "@/app/components/driverCard";
import EmptyDriver from "@/app/components/emptyDriver";
import Header from "@/app/components/header";
import Input from "@/app/components/input";
import ProcessRequestCar from "@/app/components/processRequestCar";
import RadioButton from "@/app/components/radioButton";
import SideBar from "@/app/components/sideBar";
import Tooltip from "@/app/components/tooltips";
import Link from "next/link";



export default function ProcessThree() {

  const router = useRouter();
  const [phoneNumber, setPhoneNumber] = useState("");
  const [drivers, setDrivers] = useState([
    { name: "ศรัญยู บริรัตน์ฤทธิ์", company: "กฟภ.", rate: 4.5 },
  ]);

  const [selectedDriverType, setSelectedDriverType] = useState("พนักงาน กฟภ.");
  const driverOptions = [
    "ศรัญยู บริรัตน์ฤทธิ์ (505291)",
    "ธนพล วิจารณ์ปรีชา (514285)",
    "ญาณิศา อุ่นสิริ (543210)",
  ];

  const next = () => {
    router.push("process-four");
  };

  return (
    <div>
      <div className={`main-container`}>
        <SideBar menuName="คำขอใช้ยานพาหนะ" />

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
                    <Link href="request-list">คำขอใช้ยานพาหนะ</Link>
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

                <div
                  className={`form-section ${
                    selectedDriverType == "พนักงาน กฟภ." ? "block" : "hidden"
                  } `}
                >
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

                   
                  </div>

                  
                </div>

                <div className="form-card w-full mt-5">
                      <div className="form-card-body space-y-2">
                      <div className="flex gap-2 items-center">
                      <i className="material-symbols-outlined icon-settings-fill-300-24 text-success">
                        check_circle
                      </i>
                      <div className="card-content">
                        <div className="card-subtitle font-bold">มีใบขับขี่</div>
                      </div>
                      </div>

                      <div className="flex gap-2 items-center">
                      <i className="material-symbols-outlined icon-settings-fill-300-24 text-success">
                        check_circle
                      </i>
                      <div className="card-content">
                        <div className="card-subtitle font-bold">มีใบอนุญาตทำหน้าที่ขับรถยนต์ประจำปี 2568</div>
                      </div>
                      </div>
                      </div>
                     
                    </div>

                

                <div
                  className={`form-section ${
                    selectedDriverType == "พนักงานขับรถ" ? "block" : "hidden"
                  } `}
                >
                  {drivers.length > 0 ? (
                    <>
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

                      <div className="input-group input-group-search hidden mb-5 w-[20em]">
                        <div className="input-group-prepend">
                          <span className="input-group-text search-ico-info">
                            <i className="material-symbols-outlined">search</i>
                          </span>
                        </div>
                        <input
                          type="text"
                          id="myInputTextField"
                          className="form-control dt-search-input"
                          placeholder="ค้นหาชื่อพนักงานขับรถ.."
                        />
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
                    </>
                  ) : (
                    <EmptyDriver
                      imgSrc="/assets/img/empty/empty_driver.svg"
                      title="ไม่พบพนักงานขับรถ"
                      desc={
                        <>
                          ระบบไม่พบพนักงานขับรถในสังกัด <br />{" "}
                          กลุ่มยานพาหนะนี้ที่คุณสามารถเลือกได้ <br />{" "}
                          ลองค้นหาใหม่หรือเลือกจากนอกกลุ่มนี้
                        </>
                      }
                      button="ค้นหานอกสังกัด"
                    />
                  )}
                </div>
              </div>
            </div>

            <div className="form-action">
              <button className="btn btn-primary" onClick={() => next()}>
                ต่อไป
                <i className="material-symbols-outlined icon-settings-300-24">
                  arrow_right_alt
                </i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
