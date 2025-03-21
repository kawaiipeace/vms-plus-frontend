import React, { forwardRef, useImperativeHandle, useRef, useState } from "react";
import CustomSelect from "@/app/components/customSelect";
import Link from "next/link";
import RadioButton from "@/app/components/radioButton";
import Image from "next/image";
// import KeyPickupDetailModal from "./keyPickUpDetailModal";
const KeyPickUpEditModal = forwardRef((_, ref) => {
  const modalRef = useRef<HTMLDialogElement>(null);
  const [selectedUserType, setSelectedUserType] = useState("พนักงาน กฟภ.");

  const driverOptions = ["ศรัญยู บริรัตน์ฤทธิ์ (505291)", "ธนพล วิจารณ์ปรีชา (514285)", "ญาณิศา อุ่นสิริ (543210)"];

  const keyPickUpDetailModalRef = useRef<{
    openModal: () => void;
    closeModal: () => void;
  } | null>(null);

  useImperativeHandle(ref, () => ({
    openModal: () => modalRef.current?.showModal(),
    closeModal: () => modalRef.current?.close(),
  }));

  return (
    <dialog ref={modalRef} className="modal">
      <div className="modal-box max-w-[500px] p-0 relative modal-vehicle-pick overflow-hidden flex flex-col max-h-[90vh]">
        <div className="bottom-sheet">
          <div className="bottom-sheet-icon"></div>
        </div>
        <div className="modal-header bg-white sticky top-0 flex justify-between z-10">
          <div className="modal-title">
            {" "}
            <Link href="" className="flex items-center gap-3">
              <i
                className="material-symbols-outlined"
                onClick={() => {
                  modalRef.current?.close();
                  keyPickUpDetailModalRef.current?.openModal();
                }}
              >
                keyboard_arrow_left
              </i>{" "}
              แก้ไขผู้มารับกุญแจ{" "}
            </Link>
          </div>
          <form method="dialog">
            <button className="close btn btn-icon border-none bg-transparent shadow-none btn-tertiary">
              <i className="material-symbols-outlined">close</i>
            </button>
          </form>
        </div>
        <div className="modal-body overflow-y-auto">
          <div className="form-section">
            <div className="form-group">
              <div className="custom-group">
                <RadioButton name="userType" label="พนักงานขับรถ" value="พนักงานขับรถ" selectedValue={selectedUserType} setSelectedValue={setSelectedUserType} />
                <RadioButton name="userType" label="พนักงาน กฟภ." value="พนักงาน กฟภ." selectedValue={selectedUserType} setSelectedValue={setSelectedUserType} />

                <RadioButton name="userType" label="บุคคลภายนอก" value="บุคคลภายนอก" selectedValue={selectedUserType} setSelectedValue={setSelectedUserType} />
              </div>
              {/* <!-- <span className="form-helper">Helper</span> --> */}
            </div>
          </div>

          {selectedUserType == "พนักงาน กฟภ." ? (
            <div className="grid grid-cols-12 gap-4 mt-3">
              <div className="col-span-12">
                <div className="form-group">
                  <label className="form-label">ชื่อ - นามสกุล</label>

                  {/* <CustomSelect options={driverOptions} iconName="person" w={"w-full"} /> */}
                </div>
              </div>

              <div className="col-span-12">
                <div className="form-group">
                  <label className="form-label">ตำแหน่ง / สังกัด</label>
                  <div className="input-group is-readonly">
                    <div className="input-group-prepend">
                      <span className="input-group-text">
                        <i className="material-symbols-outlined">business_center</i>
                      </span>
                    </div>
                    <input type="text" className="form-control" placeholder="" defaultValue="นรค.6 กอพ.1 ฝพจ." />
                  </div>
                </div>
              </div>
              <div className="col-span-12 md:col-span-6">
                <div className="form-group">
                  <label className="form-label">เบอร์โทรศัพท์</label>
                  <div className={`input-group`}>
                    <div className="input-group-prepend">
                      <span className="input-group-text">
                        <i className="material-symbols-outlined">smartphone</i>
                      </span>
                    </div>
                    <input type="text" className="form-control" placeholder="ระบุเบอร์โทรศัพท์" />
                  </div>
                </div>
              </div>
              <div className="col-span-12 md:col-span-6">
                <div className="form-group">
                  <label className="form-label">เบอร์ภายใน</label>
                  <div className={`input-group`}>
                    <div className="input-group-prepend">
                      <span className="input-group-text">
                        <i className="material-symbols-outlined">call</i>
                      </span>
                    </div>
                    <input type="text" className="form-control" placeholder="ระบุเบอร์ภายใน" />
                  </div>
                </div>
              </div>

              <div className="col-span-12">
                <div className="form-group">
                  <label className="form-label">
                    หมายเหตุ <span className="form-optional">(ถ้ามี)</span>
                  </label>
                  <div className="input-group">
                    <div className="input-group-prepend">
                      <span className="input-group-text">
                        <i className="material-symbols-outlined">sms</i>
                      </span>
                    </div>
                    <input type="text" className="form-control" placeholder="ระบุหมายเหตุ" />
                  </div>
                </div>
              </div>
            </div>
          ) : selectedUserType == "บุคคลภายนอก" ? (
            <div className="grid grid-cols-12 gap-4 mt-3">
              <div className="col-span-12">
                <div className="form-group">
                  <label className="form-label">ชื่อ - นามสกุล</label>

                  {/* <CustomSelect options={driverOptions} iconName="person" w={"w-full"} /> */}
                </div>
              </div>

              <div className="col-span-12 md:col-span-12">
                <div className="form-group">
                  <label className="form-label">เบอร์โทรศัพท์</label>
                  <div className={`input-group`}>
                    <div className="input-group-prepend">
                      <span className="input-group-text">
                        <i className="material-symbols-outlined">smartphone</i>
                      </span>
                    </div>
                    <input type="text" className="form-control" placeholder="ระบุเบอร์โทรศัพท์" />
                  </div>
                </div>
              </div>

              <div className="col-span-12">
                <div className="form-group">
                  <label className="form-label">
                    หมายเหตุ <span className="form-optional">(ถ้ามี)</span>
                  </label>
                  <div className="input-group">
                    <div className="input-group-prepend">
                      <span className="input-group-text">
                        <i className="material-symbols-outlined">sms</i>
                      </span>
                    </div>
                    <input type="text" className="form-control" placeholder="ระบุหมายเหตุ" />
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="col-span-12">
              <div className="form-card w-full mt-5">
                <div className="form-card-body">
                  <div className="form-group form-plaintext form-users">
                    <Image src="/assets/img/sample-avatar.png" className="avatar avatar-md" width={100} height={100} alt="" />
                    <div className="form-plaintext-group align-self-center">
                      <div className="form-label">ศรัญยู บริรัตน์ฤทธิ์</div>
                      <div className="supporting-text-group">
                        <div className="supporting-text">บริษัท ยุทธศาสตร์การขับขี่ยี่สิบปี จำกัด</div>
                      </div>
                    </div>
                  </div>
                  <div className="form-card-right align-self-center mt-4">
                    <div className="flex flex-wrap gap-4">
                      <div className="col-span-12 md:col-span-6">
                        <div className="form-group form-plaintext">
                          <i className="material-symbols-outlined">smartphone</i>
                          <div className="form-plaintext-group">
                            <div className="form-text text-nowrap">091-234-5678</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        <div className="modal-action sticky bottom-0 gap-3 mt-0">
          <button
            className="btn btn-secondary"
            onClick={() => {
              modalRef.current?.close();
              keyPickUpDetailModalRef.current?.openModal();
            }}
          >
            ย้อนกลับ
          </button>

          <form method="dialog">
            <button className="btn btn-primary">บันทึก</button>
          </form>
        </div>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>
  );
});

KeyPickUpEditModal.displayName = "KeyPickUpEditModal";

export default KeyPickUpEditModal;
