import useSwipeDown from "@/utils/swipeDown";
import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import {
  getCarpoolDriver,
  postCarpoolDriverCreate,
} from "@/services/carpoolManagement";
import { CarpoolDriver } from "@/app/types/carpool-management-type";
import dayjs from "dayjs";
import { useFormContext } from "@/contexts/carpoolFormContext";
import { useSearchParams } from "next/navigation";
import ToastCustom from "../toastCustom";

interface Props {
  id: string;
  setRefetch: (value: boolean) => void;
  setLastDeleted: (value: boolean) => void;
}

interface ToastProps {
  title: string;
  desc: string | React.ReactNode;
  status: "success" | "error" | "warning" | "info";
}

const AddCarpoolDriverModal = forwardRef<
  { openModal: () => void; closeModal: () => void }, // Ref type
  Props
>(({ setRefetch, setLastDeleted }, ref) => {
  // Destructure `process` from props
  const id = useSearchParams().get("id");
  const modalRef = useRef<HTMLDialogElement>(null);
  const CBRef = useRef<HTMLInputElement>(null);
  const scrollContentRef = useRef<HTMLDivElement>(null);
  const { formData, updateFormData } = useFormContext();

  const [search, setSearch] = useState<string>("");
  const [drivers, setDrivers] = useState<CarpoolDriver[]>([]);
  const [olds, setOlds] = useState<CarpoolDriver[]>([]);
  const [checked, setChecked] = useState<string[]>([]);
  const [paramsSearch, setParamsSearch] = useState<string>("");
  const [params, setParams] = useState({
    name: "",
  });
  const [toast, setToast] = useState<ToastProps | undefined>();

  useImperativeHandle(ref, () => ({
    openModal: () => modalRef.current?.showModal(),
    closeModal: () => modalRef.current?.close(),
  }));

  const driverNoneIdLength = drivers.filter(
    (driver) =>
      !(formData.carpool_drivers || []).some(
        (v) => v.mas_driver_uid === driver.mas_driver_uid
      )
  ).length;

  const fetchCarpoolDriverFunc = async () => {
    try {
      const response = await getCarpoolDriver(params, id || undefined);
      const result = response.data;
      setDrivers(result.drivers);
      const merge = [...result.drivers, ...olds].map((e) => JSON.stringify(e));
      const not_dup = [...new Set(merge)];
      const next = not_dup.map((e) => JSON.parse(e));
      setOlds(next);
    } catch (error) {
      console.error("Error fetching status data:", error);
    }
  };

  useEffect(() => {
    if (params.name) {
      if (params.name && !search) {
        setDrivers([]);
      } else if (!params.name && search) {
        setSearch("");
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.name]);

  useEffect(() => {
    if (paramsSearch.trim().length >= 3) {
      setParams({
        name: paramsSearch,
      });
    } else {
      if (params.name !== "") {
        setParams({
          name: "",
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paramsSearch]);

  useEffect(() => {
    if (CBRef.current) {
      if (checked.length === 0) {
        CBRef.current.indeterminate = false;
      } else if (checked.length > 0) {
        if (id) {
          if (checked.length === drivers.length) {
            CBRef.current.indeterminate = false;
            CBRef.current.checked = true;
          } else {
            CBRef.current.indeterminate = true;
          }
        } else {
          if (checked.length !== driverNoneIdLength) {
            CBRef.current.indeterminate = true;
          } else {
            CBRef.current.indeterminate = false;
            CBRef.current.checked = true;
          }
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [checked]);

  useEffect(() => {
    fetchCarpoolDriverFunc();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params]);

  const handleConfirm = async () => {
    try {
      if (id) {
        const data = checked.map((item) => ({
          mas_carpool_uid: id || "",
          mas_driver_uid: item,
        }));
        const response = await postCarpoolDriverCreate(data);
        if (response.request.status === 201) {
          setLastDeleted(false);
          setRefetch(true);
          modalRef.current?.close();
          setToast({
            title: "เพิ่มพนักงานขับรถสำเร็จ",
            desc: (
              <>
                เพิ่มพนักงานขับรถ{" "}
                <span className="font-bold">
                  {drivers
                    .filter((e) => checked.includes(e.mas_driver_uid))
                    .map((e) => e.driver_name)
                    .join(", ")}
                </span>{" "}
                ในกลุ่มเรียบร้อยแล้ว
              </>
            ),
            status: "success",
          });
        }
      } else {
        const data = checked.map((item) => {
          const driver = olds.find((e) => e.mas_driver_uid === item);
          return {
            mas_driver_uid: item,
            driver_name: driver?.driver_name || "",
            driver_nickname: driver?.driver_nickname || "",
            driver_dept_sap_short_name_hire: driver?.driver_dept_sap || "",
            driver_contact_number: driver?.driver_contact_number || "",
            ref_driver_status_code: driver?.work_type.toString() || "",
            driver_license_end_date:
              driver?.driver_license?.driver_license_end_date || "",
            approved_job_driver_end_date: driver?.contract_end_date || "",
            driver_average_satisfaction_score:
              driver?.driver_average_satisfaction_score || "",
            driver_status_name:
              driver?.driver_status?.ref_driver_status_desc || "",
            driver_image: driver?.driver_image || "",
          };
        });
        updateFormData({
          ...formData,
          carpool_drivers: [...data, ...(formData.carpool_drivers || [])],
        });
        setChecked([]);
        modalRef.current?.close();
        setToast({
          title: "เพิ่มพนักงานขับรถสำเร็จ",
          desc: (
            <>
              เพิ่มพนักงานขับรถ{" "}
              <span className="font-bold">
                {data.map((e) => e.driver_name).join(", ")}
              </span>{" "}
              ในกลุ่มเรียบร้อยแล้ว
            </>
          ),
          status: "success",
        });
      }
    } catch (error: any) {
      console.error(error);
      setToast({
        title: "Error",
        desc: (
          <div>
            <div>{error.response.data.error}</div>
            <div>{error.response.data.message}</div>
          </div>
        ),
        status: "error",
      });
    }
  };

  const handleCheck = (id: string) => {
    const find = checked.find((item) => item === id);
    if (find) {
      setChecked(checked.filter((item) => item !== id));
    } else {
      setChecked([...checked, id]);
    }
  };

  const getBirthDate = (date: string) => {
    const months = dayjs(dayjs()).diff(dayjs(date), "month");
    const year = Math.floor(months / 12);
    const month = months % 12;

    return year + " ปี" + " " + month + " เดือน";
  };

  const swipeDownHandlers = useSwipeDown(() => modalRef.current?.close());

  return (
    <>
      <dialog ref={modalRef} className={`modal modal-middle`}>
        <div className="modal-box max-w-[500px] p-0 relative overflow-hidden flex flex-col">
          <div className="bottom-sheet" {...swipeDownHandlers}>
            <div className="bottom-sheet-icon"></div>
          </div>
          <div className="modal-header bg-white sticky top-0 flex justify-between z-10">
            <div className="modal-title">เพิ่มพนักงานขับรถ</div>
            <form method="dialog">
              <button className="close btn btn-icon border-none bg-transparent shadow-none btn-tertiary">
                <i className="material-symbols-outlined">close</i>
              </button>
            </form>
          </div>

          <div className="modal-body overflow-y-auto text-center">
            <form>
              <div className="input-group input-group-search hidden">
                <div className="input-group-prepend">
                  <span className="input-group-text search-ico-info">
                    <i className="material-symbols-outlined">search</i>
                  </span>
                </div>

                <input
                  type="text"
                  id="myInputTextField"
                  className="form-control dt-search-input !w-60"
                  placeholder="ชื่อ-นามสกุล ,ชื่อเล่น ,สังกัด"
                  value={paramsSearch}
                  onChange={(e) => setParamsSearch(e.target.value)}
                />
              </div>

              <div>
                <div className="flex justify-between items-center mt-5 px-4 bg-[#EAECF0] rounded input-group">
                  <div>
                    รายชื่อพนักงานขับรถ{" "}
                    <span className="badge badge-outline badge-gray !rounded">
                      {drivers.length} คน
                    </span>
                  </div>
                  <div className="custom-group">
                    <div className="custom-control custom-checkbox custom-control-inline !gap-2">
                      <input
                        type="checkbox"
                        id="my-checkbox"
                        ref={CBRef}
                        defaultChecked={checked.length === drivers.length}
                        checked={checked.length === drivers.length}
                        onChange={() =>
                          setChecked(
                            checked.length === drivers.length
                              ? []
                              : drivers.map((item) => item.mas_driver_uid)
                          )
                        }
                        className="checkbox [--chkbg:#A80689] checkbox-sm rounded-md"
                      />
                    </div>
                  </div>
                </div>
                <div className="h-80 overflow-y-auto" ref={scrollContentRef}>
                  {drivers.map((driver) => (
                    <div
                      key={driver.mas_driver_uid}
                      className="flex justify-between items-center px-4 py-2 border-b border-[#EAECF0]"
                    >
                      <div className="text-start">
                        <div className="text-brand">
                          {driver.driver_name}{" "}
                          {driver.driver_nickname
                            ? `(${driver.driver_nickname})`
                            : ""}
                        </div>
                        <div className="flex items-center text-xs gap-2">
                          <span>{driver.driver_dept_sap_short || "-"}</span>{" "}
                          <div className="border-l border-primary-grayBorder h-3" />
                          <span>{getBirthDate(driver.driver_birthdate)}</span>{" "}
                        </div>
                      </div>
                      <div className="custom-group">
                        <div className="custom-control custom-checkbox custom-control-inline !gap-2">
                          <input
                            type="checkbox"
                            checked={checked.includes(driver.mas_driver_uid)}
                            defaultChecked={checked.includes(
                              driver.mas_driver_uid
                            )}
                            onChange={() => handleCheck(driver.mas_driver_uid)}
                            className="checkbox [--chkbg:#A80689] checkbox-sm rounded-md"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </form>
          </div>

          <div className="modal-footer p-5 grid grid-cols-4 gap-3 border-t border-[#eaecf0]">
            <div className="h-full flex items-center text-secondary">
              เลือก {checked.length} คน
            </div>
            <form method="dialog" className="col-span-1 col-start-3">
              <button className="btn btn-secondary w-full">ปิด</button>
            </form>
            <button
              type="button"
              className="btn btn-primary col-span-1"
              onClick={handleConfirm}
            >
              เพิ่ม
            </button>
          </div>
        </div>

        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>

      {toast && (
        <ToastCustom
          title={toast.title}
          desc={toast.desc}
          status={toast.status}
          onClose={() => setToast(undefined)}
        />
      )}
    </>
  );
});

AddCarpoolDriverModal.displayName = "AddCarpoolAdminModal";

export default AddCarpoolDriverModal;
