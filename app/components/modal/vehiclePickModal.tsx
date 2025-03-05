import React, { forwardRef, useImperativeHandle, useRef, useState } from "react";
import CarTypeCard from "@/app/components/carTypeCard";

interface VehiclePickModelProps {
  process: string;
  onSelect?: (vehicle: string) => void; 
}

const VehiclePickModel = forwardRef<
  { openModal: () => void; closeModal: () => void }, // Ref type
  VehiclePickModelProps // Props type
>(({ process,onSelect }, ref) => {
  // Destructure `process` from props
  const modalRef = useRef<HTMLDialogElement>(null);

  useImperativeHandle(ref, () => ({
    openModal: () => modalRef.current?.showModal(),
    closeModal: () => modalRef.current?.close(),
  }));

const [selectedCarType, setSelectedCarType] = useState('');

  return (
    <dialog ref={modalRef} id="my_modal_1" className="modal">
      <div className="modal-box max-w-[800px] p-0 relative modal-vehicle-pick overflow-hidden flex flex-col max-h-[90vh]">
        <div className="bottom-sheet">
          <div className="bottom-sheet-icon"></div>
        </div>
        <div className="modal-header bg-white sticky top-0 flex justify-between z-10">
          <div className="modal-title"> { process == "edit" ? "แก้ไข" : "เลือก" }ประเภทยานพาหนะ</div>
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

            <div className="flex gap-4">
              <CarTypeCard
                imgSrc="/assets/img/graphic/category_car.png"
                title="รถแวนตรวจการ(รถเก๋ง, SUV)"
                text="8"
                name="carType"
                selectedValue={selectedCarType}
                setSelectedValue={setSelectedCarType}
              />
              <CarTypeCard
                imgSrc="/assets/img/graphic/category_van.png"
                title="รถตู้นั่ง"
                text="8"
                name="carType"
                selectedValue={selectedCarType}
                setSelectedValue={setSelectedCarType}
              />
              <CarTypeCard
                imgSrc="/assets/img/graphic/category_ev.png"
                title="รถ EV"
                text="8"
                name="carType"
                selectedValue={selectedCarType}
                setSelectedValue={setSelectedCarType}
              />
            </div>
          </div>
        </div>
        <div className="modal-action sticky bottom-0 gap-3 mt-0">
          <form method="dialog">
            <button className="btn btn-secondary">ปิด</button>
          </form>

          <button type="button" className="btn btn-primary"  onClick={() => {
                if(onSelect)
                onSelect("Toyota"); // Call onSelect with the title
                modalRef.current?.close(); // Close the modal after selecting
              }}>
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
