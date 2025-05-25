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

interface Props {
  id: string;
  setRefetch: (value: boolean) => void;
}

const AddCarpoolDriverModal = forwardRef<
  { openModal: () => void; closeModal: () => void }, // Ref type
  Props
>(({ setRefetch }, ref) => {
  // Destructure `process` from props
  const id = useSearchParams().get("id");
  const modalRef = useRef<HTMLDialogElement>(null);
  const CBRef = useRef<HTMLInputElement>(null);
  const scrollContentRef = useRef<HTMLDivElement>(null);
  const { formData } = useFormContext();

  const [search, setSearch] = useState<string>("");
  const [drivers, setDrivers] = useState<CarpoolDriver[]>([]);
  const [checked, setChecked] = useState<string[]>([]);
  // const [total, setTotal] = useState<number>(0);
  const [params, setParams] = useState({
    name: "",
  });

  useImperativeHandle(ref, () => ({
    openModal: () => modalRef.current?.showModal(),
    closeModal: () => modalRef.current?.close(),
  }));

  const fetchCarpoolDriverFunc = async () => {
    try {
      const response = await getCarpoolDriver(params);
      const result = response.data;
      setDrivers([...drivers, ...result.drivers]);
      // setTotal(result.pagination.total);
    } catch (error) {
      console.error("Error fetching status data:", error);
    }
  };

  // const handleScroll = () => {
  //   const el = scrollContentRef.current;
  //   if (el) {
  //     const { scrollTop, offsetHeight, scrollHeight } = el;
  //     if (scrollTop + offsetHeight >= scrollHeight - 20) {
  //       setParams({ ...params, page: params.page + 1 });
  //     }
  //   }
  // };

  // useEffect(() => {
  //   const currentRef = scrollContentRef.current;
  //   if (currentRef) {
  //     currentRef.addEventListener("scroll", handleScroll);
  //   }

  //   return () => {
  //     if (currentRef) {
  //       currentRef.removeEventListener("scroll", handleScroll);
  //     }
  //   };
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, []);

  useEffect(() => {
    if (params.name) {
      if (params.name && !search) {
        setDrivers([]);
        // } else if (params.name !== search) {
        //   setParams({ ...params, page: 1 });
      } else if (!params.name && search) {
        setSearch("");
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.name]);

  useEffect(() => {
    if (CBRef.current) {
      if (checked.length === 0) {
        CBRef.current.indeterminate = false;
      } else if (checked.length > 0 && checked.length !== drivers.length) {
        CBRef.current.indeterminate = true;
      } else if (checked.length === drivers.length) {
        CBRef.current.indeterminate = false;
        CBRef.current.checked = true;
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
      const data = checked.map((item) => ({
        mas_carpool_uid: id || formData.mas_carpool_uid,
        mas_driver_uid: item,
      }));
      const response = await postCarpoolDriverCreate(data);
      if (response.request.status === 201) {
        setRefetch(true);
        modalRef.current?.close();
      }
    } catch (error) {
      console.log(error);
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
                  placeholder="ชื่อกลุ่มยานพาหนะ, ผู้รับผิดชอบหลัก"
                  value={params.name}
                  onChange={(e) =>
                    setParams((prevParams) => ({
                      ...prevParams,
                      name: e.target.value,
                    }))
                  }
                />
              </div>

              <div>
                <div className="flex justify-between items-center mt-5 px-4 bg-[#EAECF0] rounded">
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
                        <div className="text-brand-900">
                          {driver.driver_name}{" "}
                          {driver.driver_nickname
                            ? `(${driver.driver_nickname})`
                            : ""}
                        </div>
                        <div className="flex items-center text-xs gap-2">
                          <span>{driver.driver_dept_sap || "-"}</span>{" "}
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
            <div className="h-full flex items-center text-primary-grayText">
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
    </>
  );
});

AddCarpoolDriverModal.displayName = "AddCarpoolAdminModal";

export default AddCarpoolDriverModal;
