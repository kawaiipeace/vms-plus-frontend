import React, { forwardRef, useImperativeHandle, useRef, useState, useEffect } from "react";
import { useFormContext } from "@/app/contexts/requestFormContext";

interface VehicleUserModalProps {
  process: string;
}

const VehicleUserModal = forwardRef<
  { openModal: () => void; closeModal: () => void },
  VehicleUserModalProps
>(({ process }, ref) => {
  const modalRef = useRef<HTMLDialogElement>(null);
  const { formData, updateFormData } = useFormContext();
  const [vehicleUser, setVehicleUser] = useState({
    name: "",
    position: "",
    internalPhone: "",
    mobilePhone: "",
  });

  useEffect(() => {
    setVehicleUser({
      name: formData.driverEmpName || "ศรัญยู บริรัตน์ฤทธิ์ (505291)",
      position: formData.driverDeptSap || "นรค.6 กอพ.1 ฝพจ.",
      internalPhone: formData.driverInternalContact || "6892",
      mobilePhone: formData.driverMobileContact || "091-234-5678",
    });
  }, [formData]);

  useImperativeHandle(ref, () => ({
    openModal: () => modalRef.current?.showModal(),
    closeModal: () => modalRef.current?.close(),
  }));

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setVehicleUser((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = () => {
    updateFormData({
      driverEmpName: vehicleUser.name,
      driverDeptSap: vehicleUser.position,
      driverInternalContact: vehicleUser.internalPhone,
      driverMobileContact: vehicleUser.mobilePhone,
    });
    modalRef.current?.close();
  };

  return (
    <dialog ref={modalRef} id="my_modal_1" className="modal">
      <div className="modal-box max-w-[500px] p-0 relative modal-vehicle-pick overflow-hidden flex flex-col max-h-[90vh]">
        <div className="bottom-sheet">
          <div className="bottom-sheet-icon"></div>
        </div>
        <div className="modal-header bg-white sticky top-0 flex justify-between z-10">
          <div className="modal-title">
            {process === "edit" ? "แก้ไขข้อมูลผู้ใช้ยานพาหนะ" : "ข้อมูลผู้ใช้ยานพาหนะ"}
          </div>
          <form method="dialog">
            <button className="close btn btn-icon border-none bg-transparent shadow-none btn-tertiary">
              <i className="material-symbols-outlined">close</i>
            </button>
          </form>
        </div>
        <div className="modal-body overflow-y-auto">
          <div className="grid grid-cols-12 gap-4">
            <div className="col-span-12 md:col-span-6">
              <div className="form-group">
                <label className="form-label">ผู้ใช้ยานพาหนะ</label>
                <div className="input-group is">
                  <div className="input-group-prepend">
                    <span className="input-group-text">
                      <i className="material-symbols-outlined">person</i>
                    </span>
                  </div>
                  <input
                    type="text"
                    className="form-control"
                    name="name"
                    value={vehicleUser.name}
                    onChange={handleChange}
                  />
                  <div className="input-group-append">
                    <span className="input-group-text search-ico-trailing">
                      <i className="material-symbols-outlined">close</i>
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-span-12 md:col-span-6">
              <div className="form-group">
                <label className="form-label">ตำแหน่ง / สังกัด</label>
                <div className="input-group is">
                  <div className="input-group-prepend">
                    <span className="input-group-text">
                      <i className="material-symbols-outlined">business_center</i>
                    </span>
                  </div>
                  <input
                    type="text"
                    className="form-control"
                    name="position"
                    value={vehicleUser.position}
                    onChange={handleChange}
                  />
                  <div className="input-group-append">
                    <span className="input-group-text search-ico-trailing">
                      <i className="material-symbols-outlined">close</i>
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-span-12 md:col-span-6">
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
                    name="internalPhone"
                    value={vehicleUser.internalPhone}
                    onChange={handleChange}
                  />
                  <div className="input-group-append">
                    <span className="input-group-text search-ico-trailing">
                      <i className="material-symbols-outlined">close</i>
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-span-12 md:col-span-6">
              <div className="form-group">
                <label className="form-label">เบอร์โทรศัพท์</label>
                <div className="input-group">
                  <div className="input-group-prepend">
                    <span className="input-group-text">
                      <i className="material-symbols-outlined">smartphone</i>
                    </span>
                  </div>
                  <input
                    type="text"
                    className="form-control"
                    name="mobilePhone"
                    value={vehicleUser.mobilePhone}
                    onChange={handleChange}
                  />
                  <div className="input-group-append">
                    <span className="input-group-text search-ico-trailing">
                      <i className="material-symbols-outlined">close</i>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="modal-action sticky bottom-0 gap-3 mt-0">
          <form method="dialog">
            <button className="btn btn-secondary">ยกเลิก</button>
          </form>
          <button className="btn btn-primary" onClick={handleSubmit}>
            ยืนยัน
          </button>
        </div>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>
  );
});

VehicleUserModal.displayName = "VehicleUserModal";

export default VehicleUserModal;