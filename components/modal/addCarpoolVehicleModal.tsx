import useSwipeDown from "@/utils/swipeDown";
import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import {
  getCarpoolVehicle,
  postCarpoolVehicleCreate,
} from "@/services/carpoolManagement";
import { CarpoolVehicle } from "@/app/types/carpool-management-type";
import { useFormContext } from "@/contexts/carpoolFormContext";
import { useSearchParams } from "next/navigation";
import ToastCustom from "../toastCustom";

interface Props {
  id: string;
  data: any[];
  setRefetch: (value: boolean) => void;
  setLastDeleted: (value: boolean) => void;
}

interface ToastProps {
  title: string;
  desc: string | React.ReactNode;
  status: "success" | "error" | "warning" | "info";
}

const AddCarpoolVehicleModal = forwardRef<
  { openModal: () => void; closeModal: () => void }, // Ref type
  Props
>(({ setRefetch, setLastDeleted }, ref) => {
  // Destructure `process` from props
  const id = useSearchParams().get("id");
  const modalRef = useRef<HTMLDialogElement>(null);
  const CBRef = useRef<HTMLInputElement>(null);
  const scrollContentRef = useRef<HTMLDivElement>(null);

  const { formData, updateFormData } = useFormContext();

  const [vehicles, setVehicles] = useState<CarpoolVehicle[]>([]);
  const [checked, setChecked] = useState<string[]>([]);
  const [paramsSearch, setParamsSearch] = useState<string>("");
  const [params, setParams] = useState({
    search: "",
  });
  const [toast, setToast] = useState<ToastProps | undefined>();

  const VehicleNoneIdLength = vehicles.filter(
    (vehicle) =>
      !(formData.carpool_vehicles || []).some(
        (v) => v.mas_vehicle_uid === vehicle.mas_vehicle_uid
      )
  ).length;

  useImperativeHandle(ref, () => ({
    openModal: () => modalRef.current?.showModal(),
    closeModal: () => modalRef.current?.close(),
  }));

  const fetchCarpoolVehicleFunc = async () => {
    try {
      const response = await getCarpoolVehicle(params);
      const result = response.data;
      setVehicles(result.vehicles);
    } catch (error) {
      console.error("Error fetching status data:", error);
    }
  };

  useEffect(() => {
    if (CBRef.current) {
      if (checked.length === 0) {
        CBRef.current.indeterminate = false;
      } else if (checked.length > 0) {
        if (id) {
          if (checked.length === vehicles.length) {
            CBRef.current.indeterminate = false;
            CBRef.current.checked = true;
          } else {
            CBRef.current.indeterminate = true;
          }
        } else {
          if (checked.length !== VehicleNoneIdLength) {
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
    fetchCarpoolVehicleFunc();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params]);

  useEffect(() => {
    if (paramsSearch.trim().length >= 3) {
      setParams({
        search: paramsSearch,
      });
    } else {
      if (params.search !== "") {
        setParams({
          search: "",
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paramsSearch]);

  const handleConfirm = async () => {
    try {
      if (id) {
        const data = checked.map((item) => ({
          mas_carpool_uid: id || "",
          mas_vehicle_uid: item,
        }));
        const response = await postCarpoolVehicleCreate(data);
        if (response.request.status === 201) {
          setLastDeleted(false);
          setRefetch(true);
          modalRef.current?.close();
          setToast({
            title: "เพิ่มยานพาหนะสำเร็จ",
            desc: (
              <>
                เพิ่มยานพาหนะเลขทะเบียน{" "}
                <span className="font-bold">
                  {vehicles
                    .filter((e) => checked.includes(e.mas_vehicle_uid))
                    .map((e) => e.vehicle_license_plate)
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
          const vehicle = vehicles.find((e) => e.mas_vehicle_uid === item);
          return {
            mas_vehicle_uid: item,
            vehicle_license_plate: vehicle?.vehicle_license_plate || "",
            vehicle_brand_name: vehicle?.vehicle_brand_name || "",
            vehicle_model_name: vehicle?.vehicle_model_name || "",
            ref_vehicle_type_name: vehicle?.car_type || "",
            fuel_type_name: vehicle?.fuel_type_name || "",
            vehicle_owner_dept_short: vehicle?.vehicle_owner_dept_short || "",
            fleet_card_no: vehicle?.fleet_card_no || "",
            is_tax_credit: vehicle?.is_tax_credit || "",
            vehicle_mileage: vehicle?.vehicle_mileage || "",
            age: vehicle?.age || "",
            ref_vehicle_status_name: vehicle?.ref_vehicle_status_name || "",
          };
        });
        updateFormData({
          ...formData,
          carpool_vehicles: [...data, ...(formData.carpool_vehicles || [])],
        });
        setChecked([]);
        modalRef.current?.close();
        setToast({
          title: "เพิ่มยานพาหนะสำเร็จ",
          desc: (
            <>
              เพิ่มยานพาหนะเลขทะเบียน{" "}
              <span className="font-bold">
                {data.map((e) => e.vehicle_license_plate).join(", ")}
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

  const swipeDownHandlers = useSwipeDown(() => modalRef.current?.close());

  return (
    <>
      <dialog ref={modalRef} className={`modal modal-middle`}>
        <div className="modal-box max-w-[500px] p-0 relative overflow-hidden flex flex-col">
          <div className="bottom-sheet" {...swipeDownHandlers}>
            <div className="bottom-sheet-icon"></div>
          </div>
          <div className="modal-header bg-white sticky top-0 flex justify-between z-10">
            <div className="modal-title">เพิ่มยานพาหนะ</div>
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
                  placeholder="เลขทะเบียน, สังกัดยานพาหนะ"
                  value={paramsSearch}
                  onChange={(e) => setParamsSearch(e.target.value)}
                />
              </div>

              <div>
                <div className="flex justify-between items-center mt-5 px-4 bg-[#EAECF0] rounded">
                  <div>
                    รายชื่อยานพาหนะ{" "}
                    <span className="badge badge-outline badge-gray !rounded">
                      {id ? vehicles.length : VehicleNoneIdLength} คัน
                    </span>
                  </div>
                  <div className="custom-group">
                    <div className="custom-control custom-checkbox custom-control-inline !gap-2">
                      <input
                        type="checkbox"
                        id="my-checkbox"
                        ref={CBRef}
                        defaultChecked={
                          id
                            ? checked.length === vehicles.length
                            : checked.length === VehicleNoneIdLength
                        }
                        checked={
                          id
                            ? checked.length === vehicles.length
                            : checked.length === VehicleNoneIdLength
                        }
                        onChange={() => {
                          setChecked(
                            checked.length === vehicles.length ||
                              checked.length === VehicleNoneIdLength
                              ? []
                              : id
                              ? vehicles.map((item) => item.mas_vehicle_uid)
                              : vehicles
                                  .map((item) => item.mas_vehicle_uid)
                                  .filter(
                                    (item) =>
                                      !(formData.carpool_vehicles || []).some(
                                        (v) => v.mas_vehicle_uid === item
                                      )
                                  )
                          );
                        }}
                        className="checkbox [--chkbg:#A80689] checkbox-sm rounded-md"
                      />
                    </div>
                  </div>
                </div>
                <div className="h-80 overflow-y-auto" ref={scrollContentRef}>
                  {vehicles
                    .filter(
                      (vehicle) =>
                        !(formData.carpool_vehicles || []).some(
                          (v) => v.mas_vehicle_uid === vehicle.mas_vehicle_uid
                        )
                    )
                    .map((vehicle) => (
                      <div
                        key={vehicle.mas_vehicle_uid}
                        className="flex justify-between items-center px-4 py-2 border-b border-[#EAECF0]"
                      >
                        <div className="text-start">
                          <div className="text-brand-900">
                            {vehicle.vehicle_license_plate}{" "}
                            {vehicle.vehicle_license_plate_province_short}
                          </div>
                          <div className="text-xs">
                            {vehicle.vehicle_brand_name}{" "}
                            {vehicle.vehicle_model_name}
                            {" | "}
                            {vehicle.vehicle_owner_dept_short}
                          </div>
                        </div>
                        <div className="custom-group">
                          <div className="custom-control custom-checkbox custom-control-inline !gap-2">
                            <input
                              type="checkbox"
                              checked={checked.includes(
                                vehicle.mas_vehicle_uid
                              )}
                              defaultChecked={checked.includes(
                                vehicle.mas_vehicle_uid
                              )}
                              onChange={() =>
                                handleCheck(vehicle.mas_vehicle_uid)
                              }
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
              เลือก {checked.length} คัน
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

AddCarpoolVehicleModal.displayName = "AddCarpoolVehicleModal";

export default AddCarpoolVehicleModal;
