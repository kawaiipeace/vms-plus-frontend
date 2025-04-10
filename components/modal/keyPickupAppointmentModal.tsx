import React, { forwardRef, useImperativeHandle, useRef, useState } from "react";
import Image from "next/image";
import CustomSelect from "@/components/customSelect";
import RadioButton from "@/components/radioButton";

interface KeyPickUpAppointmentModalProps {
  process: string;
}

const KeyPickUpAppointmentModal = forwardRef<
  { openModal: () => void; closeModal: () => void }, // Ref type
  KeyPickUpAppointmentModalProps // Props type
>(({ process }, ref) => {
  // Destructure `process` from props
  const modalRef = useRef<HTMLDialogElement>(null);
  const driverOptions = ["ศรัญยู บริรัตน์ฤทธิ์ (505291)", "ธนพล วิจารณ์ปรีชา (514285)", "ญาณิศา อุ่นสิริ (543210)"];

  useImperativeHandle(ref, () => ({
    openModal: () => modalRef.current?.showModal(),
    closeModal: () => modalRef.current?.close(),
  }));

  const [keyPickUpUserType, setKeyPickUpUserType] = useState("");

  return (
    <dialog ref={modalRef} id="my_modal_1" className="modal">
      <div className="modal-box max-w-[500px] p-0 relative modal-vehicle-pick overflow-hidden flex flex-col max-h-[90vh] !bg-white">
        <div className="bottom-sheet">
          <div className="bottom-sheet-icon"></div>
        </div>
        <div className="modal-header bg-white sticky top-0 flex justify-between z-10">
          <div className="modal-title"> {process == "edit" ? "แก้ไข" : "เพิ่ม"}ผู้มารับกุญแจ</div>
          <form method="dialog">
            <button className="close btn btn-icon border-none bg-transparent shadow-none btn-tertiary">
              <i className="material-symbols-outlined">close</i>
            </button>
          </form>
        </div>
        <div className="modal-body overflow-y-auto">
          <div className="w-full grid gap-4">
            <div className="col-span-12">
              <div className="flex gap-4">
                <div>
                  <RadioButton name="travelType" label="พนักงานขับรถ" value="พนักงานขับรถ" selectedValue={keyPickUpUserType} setSelectedValue={setKeyPickUpUserType} />
                </div>
                <div>
                  <RadioButton name="travelType" label="พนักงาน กฟภ." value="พนักงาน กฟภ." selectedValue={keyPickUpUserType} setSelectedValue={setKeyPickUpUserType} />
                </div>
                <div>
                  <RadioButton name="travelType" label="บุคคลภายนอก" value="บุคคลภายนอก" selectedValue={keyPickUpUserType} setSelectedValue={setKeyPickUpUserType} />
                </div>
              </div>
            </div>
            {keyPickUpUserType == "พนักงานขับรถ" && (
              <>
                <div className="form-card col-span-12">
                  <div className="form-card-body form-card-inline flex-wrap">
                    <div className="w-full flex flex-wrap gap-4">
                      <div className="form-group form-plaintext form-users w-full">
                        <Image src="/assets/img/sample-avatar.png" className="avatar avatar-md" width={100} height={100} alt="" />
                        <div className="form-plaintext-group align-self-center">
                          <div className="form-label">สมชาย หงส์ทอง (กุ้ง)</div>
                          <div className="supporting-text-group">
                            <div className="supporting-text">บริษัท ยุทธศาสตร์การขับขี่ยี่สิบปี จำกัด</div>
                          </div>
                        </div>
                      </div>
                      <div className="align-self-center">
                        <div className="flex flex-wrap gap-4">
                          <div className="col-span-12">
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
              </>
            )}
            {keyPickUpUserType == "พนักงาน กฟภ." && (
              <>
                <div className="col-span-12">
                  <div className="form-group">
                    <label className="form-label">ชื่อ - นามสกุล</label>

                    {/* <CustomSelect iconName="person" w="w-full" options={driverOptions} /> */}
                    {/* {errors.driver && <FormHelper text={String(errors.driver.message)} /> } */}
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
                      <input type="text" className="form-control" placeholder="" />
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
              </>
            )}
            {keyPickUpUserType == "บุคคลภายนอก" && (
              <>
                <div className="col-span-12">
                  <div className="form-group">
                    <label className="form-label">ชื่อ - นามสกุล</label>
                    <div className={`input-group`}>
                      <div className="input-group-prepend">
                        <span className="input-group-text">
                          <i className="material-symbols-outlined">person</i>
                        </span>
                      </div>
                      <input type="text" className="form-control" placeholder="ระบุชื่อ - นามสกุล" />
                    </div>
                  </div>
                </div>

                <div className="col-span-12">
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
              </>
            )}
          </div>
        </div>
        <div className="modal-action sticky bottom-0 gap-3 mt-0">
          <form method="dialog">
            <button className="btn btn-secondary">ยกเลิก</button>
          </form>

          <button type="button" className="btn btn-primary">
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

KeyPickUpAppointmentModal.displayName = "KeyPickUpAppointmentModal";

export default KeyPickUpAppointmentModal;
