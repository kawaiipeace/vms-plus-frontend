"use client";
import { DriverType, DriverWorkType } from "@/app/types/driver-user-type";
import { UpdateDriverType } from "@/app/types/form-data-type";
import EmptyDriver from "@/components/admin/emptyDriver";
import PickDriverCard from "@/components/card/pickDriverCard";
import { adminUpdateDriver } from "@/services/bookingAdmin";
import {
  fetchDriverWorkType,
  fetchSearchDrivers,
} from "@/services/masterService";
import useSwipeDown from "@/utils/swipeDown";
import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react";
import CustomSelect, { CustomSelectOption } from "../customSelect";
import { RequestDetailType } from "@/app/types/request-detail-type";

interface Props {
  reqId?: string;
  requestData?: RequestDetailType;
  onClickDetail: (id: string) => void;
  onSelect?: (vehicle: string) => void;
  onUpdate?: (data: any) => void;
}

const AdminDriverPickModal = forwardRef<
  { openModal: () => void; closeModal: () => void },
  Props
>(({ onSelect, onUpdate, reqId, onClickDetail, requestData }, ref) => {
  const modalRef = useRef<HTMLDialogElement>(null);
  const hasReset = useRef(false);

  useImperativeHandle(ref, () => ({
    openModal: () => {

      fetchDriverData();
      hasReset.current = false;
      modalRef.current?.showModal();
    },
    closeModal: () => modalRef.current?.close(),
  }));

  const [params, setParams] = useState({
    emp_id: "",
    start_date: "",
    end_date: "",
  });

  const [drivers, setDrivers] = useState<DriverType[]>([]);
  const [filteredDrivers, setFilteredDrivers] = useState<DriverType[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentSlide, setCurrentSlide] = useState(0);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
   const filtered = drivers.filter((driver: DriverType) =>
    driver.driver_name?.toLowerCase().includes(value.toLowerCase()) ||
    driver.driver_nickname?.toLowerCase().includes(value.toLowerCase())
  );
    setFilteredDrivers(filtered);
  };

  const groupedDrivers = useMemo(() => {
    const chunkSize = 3;
    const result = [];
    for (let i = 0; i < filteredDrivers.length; i += chunkSize) {
      result.push(filteredDrivers.slice(i, i + chunkSize));
    }
    return result;
  }, [filteredDrivers, params]);
  const [driverWorkTypeDatas, setdriverWorkTypeDatas] = useState<
    DriverWorkType[]
  >([]);
  const [selectedDriverId, setSelectedDriverId] = useState<string | null>(null);
  const [workTypeOptions, setWorkTypeOptions] = useState<
    { value: string; label: string }[]
  >([]);

  const handleVehicleSelect = async (id: string) => {
    setSelectedDriverId(id);
    const payload: UpdateDriverType = {
      mas_carpool_driver_uid: id,
      trn_request_uid: reqId || "",
    };

    try {
      const res = await adminUpdateDriver(payload);
      if (res) {
        if (onUpdate) {
          onUpdate(id);
        }
      }
      // if(response){
      //   modalRef.current?.close();
      // }
    } catch (error) {
      console.error("Network error:", error);
    }
  };
  const [selecteddriverWorkTypeOption, setSelecteddriverWorkTypeOption] =
    useState<{
      value: string;
      label: string;
    }>({ value: "", label: "ทั้งหมด" });

  const handledriverWorkTypeChange = async (
    selectedOption: CustomSelectOption
  ) => {
    setSelecteddriverWorkTypeOption(
      selectedOption as { value: string; label: string }
    );

    const data = driverWorkTypeDatas.find(
      (work) => String(work.type) === String(selectedOption.value)
    );
    if (data) {
      const filtered = drivers.filter(
        (driver: DriverType) =>
          String(driver.work_type) === selectedOption.value
      );
      setFilteredDrivers(filtered);
    }
  };

  const fetchDriverData = async () => {
    const newParams = {
      mas_carpool_uid: requestData?.mas_carpool_uid || "",
      emp_id: requestData?.vehicle_user_emp_id || "",
      start_date: requestData?.start_datetime || "",
      end_date: requestData?.end_datetime || "",
      work_type: requestData?.trip_type || ""
    };
    setParams(newParams);

    try {
      const response = await fetchSearchDrivers(newParams);
      if (response.status === 200) {
        setDrivers(response.data.drivers);
        setFilteredDrivers(response.data.drivers);

        hasReset.current = true;
      }
    } catch (error) {
      console.error("Error fetching requests:", error);
    }
  };

  useEffect(() => {
    const fetchDriverWorkTypeData = async () => {
      try {
        const response = await fetchDriverWorkType();
        if (response.status === 200) {
          const workTypedata = response.data;
          setdriverWorkTypeDatas(workTypedata);
          const dataTypeArr = [
            {
              value: "",
              label: "ทั้งหมด",
            },
            ...workTypedata.map(
              (cost: { type: string; description: string }) => ({
                value: String(cost.type),
                label: cost.description,
              })
            ),
          ];

          setWorkTypeOptions(dataTypeArr);
        }
      } catch (error) {
        console.error("Error fetching requests:", error);
      }
    };

    fetchDriverWorkTypeData();
  }, [params]);

  const swipeDownHandlers = useSwipeDown(() => modalRef.current?.close());

  return (
    <dialog ref={modalRef} className="modal">
      <div className="modal-box max-w-[1140px] p-0 relative modal-vehicle-pick overflow-hidden flex flex-col max-h-[90vh]">
        <div className="bottom-sheet" {...swipeDownHandlers}>
          <div className="bottom-sheet-icon"></div>
        </div>
        <div className="modal-header bg-white sticky top-0 flex justify-between z-10">
          <div className="modal-title">เลือกพนักงานขับรถ</div>
          <form method="dialog">
            <button className="close btn btn-icon border-none bg-transparent shadow-none btn-tertiary">
              <i className="material-symbols-outlined">close</i>
            </button>
          </form>
        </div>

        <div className="modal-body overflow-y-auto">
          <div className="page-section-header border-0">
            <div className="page-header-left">
              <div className="page-title">
                <span className="page-title-label">ผลการค้นหา</span>
                <span className="badge badge-outline badge-gray page-title-status">
                  ว่าง {filteredDrivers.length} คน
                </span>
              </div>
            </div>
          </div>
          <div className="form-group">
            <div className="flex justify-between items-top w-full">
              <div className="input-group input-group-search hidden mb-5 w-[20em]">
                <div className="input-group-prepend">
                  <span className="input-group-text search-ico-info">
                    <i className="material-symbols-outlined">search</i>
                  </span>
                </div>

                <input
                  type="text"
                  id="myInputTextField"
                  value={searchTerm}
                  onChange={handleSearch}
                  className="form-control dt-search-input"
                  placeholder="ค้นหาชื่อ-นามสกุล, ชื่อเล่น"
                />
              </div>
              <CustomSelect
                w="w-[10rem]"
                options={workTypeOptions}
                value={selecteddriverWorkTypeOption}
                onChange={handledriverWorkTypeChange}
              />
            </div>

            {filteredDrivers.length > 0 && (
              <div className="relative w-full">
                <div className="relative">
                  {/* Left Arrow */}
                  <button
                    className="absolute left-2 top-1/2 -translate-y-1/2 z-20 bg-white border border-gray-300 rounded-full p-1 shadow-sm transition disabled:opacity-50 disabled:bg-surface-disabled select-none"
                    style={{ width: "40px", height: "40px" }}
                    onClick={() =>
                      setCurrentSlide((prev) => Math.max(prev - 1, 0))
                    }
                    disabled={currentSlide === 0}
                  >
                    <i className="material-symbols-outlined text-lg">
                      keyboard_arrow_left
                    </i>
                  </button>

                  {/* Right Arrow */}
                  <button
                    className="absolute right-2 top-1/2 -translate-y-1/2 z-20 bg-white border border-gray-300 rounded-full p-1 shadow-sm transition disabled:opacity-50 disabled:bg-surface-disabled select-none"
                    style={{ width: "40px", height: "40px" }}
                    onClick={() =>
                      setCurrentSlide((prev) =>
                        Math.min(prev + 1, groupedDrivers.length - 1)
                      )
                    }
                    disabled={currentSlide === groupedDrivers.length - 1}
                  >
                    <i className="material-symbols-outlined text-lg">
                      keyboard_arrow_right
                    </i>
                  </button>

                  <div className="px-20">
                    <div className="grid grid-cols-3 gap-4">
                      {groupedDrivers[currentSlide]?.map((driver, index) => (
                        <div key={index} className="h-full">
                          <PickDriverCard
                            key={index}
                            reqId={reqId || ""}
                            id={driver.mas_driver_uid}
                            imgSrc={
                              driver.driver_image ||
                              "/assets/img/sample-driver.png"
                            }
                            name={driver.driver_name || ""}
                            nickName={driver.driver_nickname || ""}
                            driverStatus={
                              driver.driver_status.ref_driver_status_desc || ""
                            }
                            workTypeName={driver.work_type_name || ""}
                            workDays={driver.work_days}
                            workCount={driver.work_count}
                            company={driver.driver_dept_sap || ""}
                            rating={
                              driver.driver_average_satisfaction_score ||
                              "ยังไม่มีการให้คะแนน"
                            }
                            age={driver.age || "-"}
                            seeDetail={true}
                            isSelected={
                              selectedDriverId === driver.mas_driver_uid
                            }
                            onVehicleSelect={handleVehicleSelect}
                            onClickSeeDetail={onClickDetail}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="indicator-daisy flex justify-center mt-4 gap-2">
                  {groupedDrivers.map((_, idx) => (
                    <button
                      key={idx}
                      className={`btn btn-xs !rounded-full focus:outline-none border-0 !min-h-2 !min-w-2 p-0 size-2 overflow-hidden ${
                        idx === currentSlide ? "active" : ""
                      }`}
                      onClick={() => setCurrentSlide(idx)}
                    ></button>
                  ))}
                </div>
              </div>
            )}

            {filteredDrivers.length <= 0 && drivers.length > 0 && (
              <EmptyDriver
                imgSrc="/assets/img/empty/search_not_found.png"
                title="ไม่พบข้อมูล"
                desc={<>เปลี่ยนคำค้นหรือเงื่อนไขแล้วลองใหม่อีกครั้ง</>}
              />
            )}

            {drivers.length === 0 && (
              <EmptyDriver
                imgSrc="/assets/img/empty/empty_driver.svg"
                title="ไม่พบพนักงานขับรถ"
                reqId={reqId}
                desc={
                  <>
                    ระบบไม่พบพนักงานขับรถในสังกัด <br />{" "}
                    กลุ่มยานพาหนะนี้ที่คุณสามารถเลือกได้ <br />{" "}
                    ลองค้นหาใหม่หรือเลือกจากนอกกลุ่มนี้
                  </>
                }
                button="ค้นหานอกสังกัด"
                onCloseParentModal={() => modalRef.current?.close()}
                onOpenParentModal={() => modalRef.current?.showModal()}
              />
            )}
          </div>
        </div>
      </div>

      <form method="dialog" className="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>
  );
});

AdminDriverPickModal.displayName = "AdminDriverPickModal";
export default AdminDriverPickModal;
