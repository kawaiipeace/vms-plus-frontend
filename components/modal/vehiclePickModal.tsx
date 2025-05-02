import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react";
import CarTypeCard from "@/components/card/carTypeCard";
import { fetchVehicleCarTypes } from "@/services/masterService";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useFormContext } from "@/contexts/requestFormContext";
import { RequestDetailType } from "@/app/types/request-detail-type";
import { updateVehicleType } from "@/services/bookingUser";
import Image from "next/image";
import useSwipeDown from "@/utils/swipeDown";

const schema = yup.object().shape({
  requestedVehicleTypeName: yup.string(),
});

interface VehiclePickModelProps {
  selectType?: string;
  requestData?: RequestDetailType;
  process: string;
  onSelect?: (vehicle: string) => void;
  onUpdate?: (data: any) => void;
}

interface VehicleCat {
  ref_vehicle_type_code: string;
  ref_vehicle_type_name: string;
  available_units: string;
  vehicle_type_image: string;
}

const VehiclePickModel = forwardRef<
  { openModal: () => void; closeModal: () => void },
  VehiclePickModelProps
>(({ process, onSelect, onUpdate, requestData, selectType }, ref) => {
  const modalRef = useRef<HTMLDialogElement>(null);
  const hasReset = useRef(false);

  useImperativeHandle(ref, () => ({
    openModal: () => {
      hasReset.current = false;
      modalRef.current?.showModal();
    },
    closeModal: () => modalRef.current?.close(),
  }));

  const { updateFormData } = useFormContext();
  const [selectedCarTypeId, setSelectedCarTypeId] = useState("");
  const [selectedCarTypeName, setSelectedCarTypeName] = useState("");
  const [vehicleCatData, setVehicleCatData] = useState<VehicleCat[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);

  const groupedVehicles = useMemo(() => {
    const chunkSize = 6;
    const result = [];
    for (let i = 0; i < vehicleCatData.length; i += chunkSize) {
      result.push(vehicleCatData.slice(i, i + chunkSize));
    }
    return result;
  }, [vehicleCatData]);

  useEffect(() => {
    const fetchVehicleCarTypesData = async () => {
      try {
        const response = await fetchVehicleCarTypes();
        if (response.status === 200) {
          setVehicleCatData(response.data);
        }
      } catch (error) {
        console.error("Error fetching vehicle types:", error);
      }
    };

    fetchVehicleCarTypesData();
  }, []);

  const { setValue } = useForm({
    mode: "onChange",
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    if (requestData?.request_vehicle_type) {
      setSelectedCarTypeId(
        String(requestData.request_vehicle_type.ref_vehicle_type_code)
      );
      setSelectedCarTypeName(
        requestData?.request_vehicle_type?.ref_vehicle_type_name || ""
      );
      hasReset.current = true;
    }
  }, [requestData]);
  const swipeDownHandlers = useSwipeDown(() => modalRef.current?.close());

  return (
    <dialog ref={modalRef} className="modal">
      <div className="modal-box max-w-[800px] p-0 relative modal-vehicle-pick overflow-hidden flex flex-col max-h-[90vh]">
        <div className="bottom-sheet" {...swipeDownHandlers}>
          <div className="bottom-sheet-icon"></div>
        </div>
        <div className="modal-header bg-white sticky top-0 flex justify-between z-10">
          <div className="modal-title">
            {process == "edit" ? "แก้ไข" : "เลือก"}ประเภทยานพาหนะ
          </div>
          <form method="dialog">
            <button className="close btn btn-icon border-none bg-transparent shadow-none btn-tertiary">
              <i className="material-symbols-outlined">close</i>
            </button>
          </form>
        </div>

        <div className="modal-body overflow-y-auto">
          <div className="form-group">
            <div className="card !bg-surface-secondary-subtle mb-3 !border-0 shadow-none outline-none">
              <div className="card-body border-0 shadow-none outline-none">
                {selectType === "ผู้ดูแลยานพาหนะเลือกให้" ||
                selectType === "ผู้ดูแลเลือกยานพาหนะให้" ? (
                  <div className="flex items-center gap-5">
                    <div className="img img-square img-avatar">
                      <Image
                        src={"/assets/img/admin-selected.png"}
                        className="rounded-md"
                        width={52}
                        height={52}
                        alt={"driver"}
                      />
                    </div>
                    <div className="card-content">
                      <div className="card-content-top">
                        <div className="card-title">
                          ผู้ดูแลเลือกยานพาหนะให้
                        </div>
                        <div className="supporting-text-group">
                          <div className="supporting-text">สายงานดิจิทัล</div>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-5">
                    <div className="img img-square img-avatar">
                      <Image
                        src={"/assets/img/system-selected.png"}
                        className="rounded-md"
                        width={52}
                        height={52}
                        alt={"driver"}
                      />
                    </div>
                    <div className="card-content">
                      <div className="card-content-top">
                        <div className="card-title">
                          ระบบเลือกยานพาหนะให้อัตโนมัติ
                        </div>
                        <div className="supporting-text-group">
                          <div className="supporting-text">สายงานดิจิทัล</div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="relative w-full">
              <div className="relative">
                {currentSlide !== 0 && (
                  <button
                    className="absolute left-2 top-1/2 -translate-y-1/2 z-20 bg-white border border-gray-300 rounded-full p-1 shadow-sm hover:bg-gray-100 transition"
                    style={{ width: "40px", height: "40px" }}
                    onClick={() => setCurrentSlide((prev) => prev - 1)}
                  >
                    <i className="material-symbols-outlined text-lg">
                      keyboard_arrow_left
                    </i>
                  </button>
                )}

                {currentSlide !== groupedVehicles.length - 1 && (
                  <button
                    className="absolute right-2 top-1/2 -translate-y-1/2 z-20 bg-white border border-gray-300 rounded-full p-1 shadow-sm hover:bg-gray-100 transition"
                    style={{ width: "40px", height: "40px" }}
                    onClick={() => setCurrentSlide((prev) => prev + 1)}
                  >
                    <i className="material-symbols-outlined text-lg">
                      keyboard_arrow_right
                    </i>
                  </button>
                )}

                <div className="px-0">
                  <div className="grid grid-cols-3 gap-4">
                    {groupedVehicles[currentSlide]?.map((vehicle) => (
                      <div
                        key={vehicle.ref_vehicle_type_code}
                        className="h-full"
                      >
                        <CarTypeCard
                          imgSrc={
                            vehicle.vehicle_type_image ||
                            "/assets/img/graphic/category_car.png"
                          }
                          title={vehicle.ref_vehicle_type_name}
                          text={vehicle.available_units}
                          name="carType"
                          selectedValue={selectedCarTypeName}
                          setSelectedValue={() => {
                            setSelectedCarTypeId(vehicle.ref_vehicle_type_code);
                            setSelectedCarTypeName(
                              vehicle.ref_vehicle_type_name
                            );
                          }}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="indicator-daisy flex justify-center mt-4 gap-2">
                {groupedVehicles.map((_, idx) => (
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
          </div>
        </div>

        <div className="modal-action sticky bottom-0 gap-3 mt-0">
          <form method="dialog">
            <button className="btn btn-secondary">ปิด</button>
          </form>

          <button
            type="button"
            className="btn btn-primary"
            onClick={async () => {
              if (onSelect) onSelect(selectedCarTypeId);
              setValue("requestedVehicleTypeName", selectedCarTypeName);

              if (requestData) {
                const payload = {
                  trn_request_uid: requestData.trn_request_uid,
                  requested_vehicle_type_id: Number(selectedCarTypeId),
                };

                try {
                  const response = await updateVehicleType(payload);
                  if (response) {
                    if (onUpdate) onUpdate(response.data);
                    modalRef.current?.close();
                  }
                } catch (error) {
                  console.error("Network error:", error);
                  alert("Failed to update trip due to network error.");
                }
              } else {
                updateFormData({
                  requestedVehicleTypeName: selectedCarTypeName,
                });
                if (onUpdate)
                  onUpdate({
                    requestedVehicleTypeName: selectedCarTypeName,
                  });
                modalRef.current?.close();
              }
            }}
          >
            เลือก
          </button>
        </div>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>
  );
});

VehiclePickModel.displayName = "VehiclePickModel";
export default VehiclePickModel;
