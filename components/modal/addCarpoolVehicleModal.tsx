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

interface Props {
  id: string;
  setRefetch: (value: boolean) => void;
}

const AddCarpoolVehicleModal = forwardRef<
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
  const [vehicles, setVehicles] = useState<CarpoolVehicle[]>([]);
  const [checked, setChecked] = useState<string[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [params, setParams] = useState({
    page: 1,
    limit: 10,
    search: "",
  });

  useImperativeHandle(ref, () => ({
    openModal: () => modalRef.current?.showModal(),
    closeModal: () => modalRef.current?.close(),
  }));

  const fetchCarpoolVehicleFunc = async () => {
    try {
      const response = await getCarpoolVehicle(params);
      const result = response.data;
      setVehicles([...vehicles, ...result.vehicles]);
      setTotal(result.pagination.total);
    } catch (error) {
      console.error("Error fetching status data:", error);
    }
  };

  const handleScroll = () => {
    const el = scrollContentRef.current;
    if (el) {
      const { scrollTop, offsetHeight, scrollHeight } = el;
      if (scrollTop + offsetHeight >= scrollHeight - 20) {
        setParams({ ...params, page: params.page + 1 });
      }
    }
  };

  useEffect(() => {
    const currentRef = scrollContentRef.current;
    if (currentRef) {
      currentRef.addEventListener("scroll", handleScroll);
    }

    return () => {
      if (currentRef) {
        currentRef.removeEventListener("scroll", handleScroll);
      }
    };
  }, []);

  useEffect(() => {
    if (params.search) {
      if (params.search && !search) {
        setVehicles([]);
      } else if (params.search !== search) {
        setParams({ ...params, page: 1 });
      } else if (!params.search && search) {
        setSearch("");
      }
    }
  }, [params.search]);

  useEffect(() => {
    if (CBRef.current) {
      if (checked.length === 0) {
        CBRef.current.indeterminate = false;
      } else if (checked.length > 0 && checked.length !== total) {
        CBRef.current.indeterminate = true;
      } else if (checked.length === total) {
        CBRef.current.indeterminate = false;
        CBRef.current.checked = true;
      }
    }
    console.log("checked: ", checked);
  }, [checked]);

  useEffect(() => {
    fetchCarpoolVehicleFunc();
  }, [params]);

  const handleConfirm = async () => {
    try {
      const data = checked.map((item) => ({
        mas_carpool_uid: id || formData.mas_carpool_uid,
        mas_vehicle_uid: item,
      }));
      const response = await postCarpoolVehicleCreate(data);
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
                  value={params.search}
                  onChange={(e) =>
                    setParams((prevParams) => ({
                      ...prevParams,
                      search: e.target.value,
                      page: 1, // Reset to page 1 on search
                    }))
                  }
                />
              </div>

              <div>
                <div className="flex justify-between items-center mt-5 px-4 bg-[#EAECF0] rounded">
                  <div>
                    รายชื่อยานพาหนะ{" "}
                    <span className="badge badge-outline badge-gray !rounded">
                      {total} คัน
                    </span>
                  </div>
                  <div className="custom-group">
                    <div className="custom-control custom-checkbox custom-control-inline !gap-2">
                      <input
                        type="checkbox"
                        id="my-checkbox"
                        ref={CBRef}
                        // value={statusItem.ref_request_status_code}
                        // checked={selectedStatuses.includes(
                        //   statusItem.ref_request_status_code
                        // )}
                        // onChange={() =>
                        //   handleCheckboxChange(
                        //     statusItem.ref_request_status_code
                        //   )
                        // }
                        className="checkbox [--chkbg:#A80689] checkbox-sm rounded-md"
                      />
                    </div>
                  </div>
                </div>
                <div className="h-80 overflow-y-auto" ref={scrollContentRef}>
                  {vehicles.map((vehicle) => (
                    <div
                      key={vehicle.mas_vehicle_uid}
                      className="flex justify-between items-center px-4 py-2 border-b border-[#EAECF0]"
                    >
                      <div className="text-start">
                        <div className="text-brand-900">
                          {vehicle.vehicle_license_plate}
                        </div>
                        <div className="text-xs">
                          {vehicle.vehicle_brand_name}{" "}
                          {vehicle.vehicle_model_name}{" "}
                        </div>
                      </div>
                      <div className="custom-group">
                        <div className="custom-control custom-checkbox custom-control-inline !gap-2">
                          <input
                            type="checkbox"
                            // value={statusItem.ref_request_status_code}
                            // checked={selectedStatuses.includes(
                            //   statusItem.ref_request_status_code
                            // )}
                            // onChange={() =>
                            //   handleCheckboxChange(
                            //     statusItem.ref_request_status_code
                            //   )
                            // }
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
              เลือก 2 คัน
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

AddCarpoolVehicleModal.displayName = "AddCarpoolAdminModal";

export default AddCarpoolVehicleModal;
