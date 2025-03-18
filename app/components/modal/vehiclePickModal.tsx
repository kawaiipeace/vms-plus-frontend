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
import { useFormContext } from "@/app/contexts/requestFormContext";
import { yupResolver } from "@hookform/resolvers/yup";

const schema = yup.object().shape({
  vehicleTypeSelect: yup.string().required("Please select a vehicle"),
});

interface VehiclePickModelProps {
  process: string;
  onSelect?: (vehicle: string) => void;
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
>(({ process, onSelect }, ref) => {
  const modalRef = useRef<HTMLDialogElement>(null);

  useImperativeHandle(ref, () => ({
    openModal: () => modalRef.current?.showModal(),
    closeModal: () => modalRef.current?.close(),
  }));

  const [selectedCarType, setSelectedCarType] = useState("");
  const [vehicleCatData, setVehicleCatData] = useState<VehicleCat[]>([]);
    const { updateFormData } = useFormContext();

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
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: "onChange",
    resolver: yupResolver(schema),
    defaultValues: {
      vehicleTypeSelect: "",
    },
  });

  const onSubmit = (data: any) => {
    if (onSelect) onSelect(data.vehicleTypeSelect);
    updateFormData(data);
    modalRef.current?.close(); // Close modal
  };

  useEffect(() => {
    setValue("vehicleTypeSelect", selectedCarType);
  }, [selectedCarType, setValue]);

  return (
    <dialog ref={modalRef} id="my_modal_1" className="modal">
      <div className="modal-box max-w-[800px] p-0 relative modal-vehicle-pick overflow-hidden flex flex-col max-h-[90vh]">
        <div className="bottom-sheet">
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

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="modal-body overflow-y-auto flex flex-col"
        >
          <div className="form-group">
            <label className="form-label mb-4 text-primary">
              <i className="material-symbols-outlined text-brand">
                directions_car
              </i>
              สายงานดิจิทัล
            </label>

            <input type="hidden" {...register("vehicleTypeSelect")} />

            <div className="grid grid-cols-3 gap-4">
              {vehicleCatData.map((vehicle) => (
                <CarTypeCard
                  key={vehicle.ref_vehicle_type_code}
                  imgSrc={
                    vehicle.vehicle_type_image ||
                    "/assets/img/graphic/category_car.png"
                  }
                  title={vehicle.ref_vehicle_type_name}
                  text={vehicle.available_units}
                  name="carType"
                  selectedValue={selectedCarType}
                  setSelectedValue={setSelectedCarType}
                />
              ))}
            </div>
            {errors.vehicleTypeSelect && (
              <p className="text-red-500">{errors.vehicleTypeSelect.message}</p>
            )}
          </div>

          <div className="modal-action sticky bottom-0 gap-3 mt-0">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => modalRef.current?.close()} // Manual close
            >
              ปิด
            </button>

            <button type="submit" className="btn btn-primary">
              เลือก
            </button>
          </div>
        </form>
      </div>

      <form method="dialog" className="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>
  );
});

VehiclePickModel.displayName = "VehiclePickModel";

export default VehiclePickModel;
