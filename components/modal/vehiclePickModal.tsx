import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import CarTypeCard from "@/app/components/card/carTypeCard";
import { fetchVehicleCarTypes } from "@/app/services/masterService";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

const schema = yup.object().shape({
  vehicleTypeSelect: yup.string()
});

interface VehiclePickModelProps {
  process: string;
  onSelect?: (vehicle: string) => void;
}

interface VehicleCat{
  ref_vehicle_type_code: string;
  ref_vehicle_type_name: string;
  available_units: string;
  vehicle_type_image:string;
}

const VehiclePickModel = forwardRef<
  { openModal: () => void; closeModal: () => void }, // Ref type
  VehiclePickModelProps // Props type
>(({ process, onSelect }, ref) => {
  // Destructure `process` from props
  const modalRef = useRef<HTMLDialogElement>(null);

  useImperativeHandle(ref, () => ({
    openModal: () => modalRef.current?.showModal(),
    closeModal: () => modalRef.current?.close(),
  }));

  const [selectedCarType, setSelectedCarType] = useState("");
  const [vehicleCatData, setVehicleCatData] = useState<VehicleCat[]>([]);

  useEffect(() => {
    const fetchVehicleCarTypesData = async () => {
      try {
        const response = await fetchVehicleCarTypes();
        if (response.status === 200) {
          setVehicleCatData(response.data);
        }
      } catch (error) {
        console.error("Error fetching requests:", error);
      }
    };

    fetchVehicleCarTypesData();
  }, []);

  

  const {
    setValue,
  } = useForm({
    mode: "onChange",
    resolver: yupResolver(schema),
  });


  return (
    <dialog ref={modalRef} id="my_modal_1" className="modal">
      <div className="modal-box max-w-[800px] p-0 relative modal-vehicle-pick overflow-hidden flex flex-col max-h-[90vh]">
        <div className="bottom-sheet">
          <div className="bottom-sheet-icon"></div>
        </div>
        <div className="modal-header bg-white sticky top-0 flex justify-between z-10">
          <div className="modal-title">
            {" "}
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
            <label className="form-label mb-4 text-primary">
              <i className="material-symbols-outlined text-brand">
                directions_car
              </i>
              สายงานดิจิทัล
            </label>

            <div className="grid grid-cols-3 gap-4">
            {vehicleCatData.map((vehicle) => (
                <CarTypeCard
                  key={vehicle.ref_vehicle_type_code} // Unique key for each card
                  imgSrc={vehicle.vehicle_type_image || "/assets/img/graphic/category_car.png"} // Adjust this to the actual field in your data
                  title={vehicle.ref_vehicle_type_name} // Adjust this to the actual field in your data
                  text={vehicle.available_units} // Adjust this to the actual field in your data
                  name="carType"
                  selectedValue={selectedCarType}
                  setSelectedValue={setSelectedCarType}
                />
              ))}
             
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
            onClick={() => {
              if (onSelect) onSelect(selectedCarType); 
              setValue("vehicleTypeSelect",selectedCarType)
              modalRef.current?.close(); // Close the modal after selecting
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
