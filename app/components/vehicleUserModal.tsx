import React, { forwardRef, useImperativeHandle, useRef } from "react";

interface VehicleUserModalProps {
  process: string;
}

const VehicleUserModal = forwardRef<
  { openModal: () => void; closeModal: () => void }, // Ref type
  VehicleUserModalProps // Props type
>(({ process }, ref) => {
  // Destructure `process` from props
  const modalRef = useRef<HTMLDialogElement>(null);

  useImperativeHandle(ref, () => ({
    openModal: () => modalRef.current?.showModal(),
    closeModal: () => modalRef.current?.close(),
  }));

  return (
    <dialog ref={modalRef} id="my_modal_1" className="modal">
      <div className="modal-box max-w-[500px] p-0 relative modal-vehicle-pick overflow-hidden flex flex-col max-h-[90vh]">
        <div className="bottom-sheet">
          <div className="bottom-sheet-icon"></div>
        </div>
        <div className="modal-header bg-white sticky top-0 flex justify-between z-10">
          <div className="modal-title">
             { process == "edit" ? 'แก้ไขข้อมูลผู้ใช้ยานพาหนะ' : 'ข้อมูลผู้ใช้ยานพาหนะ' } 
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
                    <input type="text" className="form-control" placeholder="" defaultValue="ศรัญยู บริรัตน์ฤทธิ์ (505291)" />
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
                    <input type="text" className="form-control" placeholder="" defaultValue="นรค.6 กอพ.1 ฝพจ." />
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
                    <input type="text" className="form-control" placeholder="" defaultValue="6892" />
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
                    <input type="text" className="form-control" placeholder="" defaultValue="091-234-5678" />
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
          <form method="dialog">
            <button className="btn btn-primary">ยืนยัน</button>
          </form>
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
