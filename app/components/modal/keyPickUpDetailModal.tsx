import React, {
  forwardRef,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import Image from "next/image";
import DateTimePicker from "@/app/components/dateTimePicker";
import RadioButton from "@/app/components/radioButton";
import KeyPickUpEditModal from "./keyPickUpEditModal";
import ConfirmKeyHandOverModal from "./confirmKeyHandOverModal";

const KeyPickupDetailModal = forwardRef((_, ref) => {
  const modalRef = useRef<HTMLDialogElement>(null);
  const [selectedAttach, setSelectedAttach] = useState(
    "กุญแจหลัก และบัตรเติมน้ำมัน"
  );
  const keyPickUpEditModalRef = useRef<{
    openModal: () => void;
    closeModal: () => void;
  } | null>(null);

  const confirmKeyHandOverModalRef = useRef<{
    openModal: () => void;
    closeModal: () => void;
  } | null>(null);

  useImperativeHandle(ref, () => ({
    openModal: () => modalRef.current?.showModal(),
    closeModal: () => modalRef.current?.close(),
  }));

  return (
    <>
      <dialog ref={modalRef} id="my_modal_1" className="modal">
        <div className="modal-box max-w-[500px] p-0 relative modal-vehicle-pick overflow-hidden flex flex-col max-h-[90vh]">
          <div className="bottom-sheet">
            <div className="bottom-sheet-icon"></div>
          </div>
          <div className="modal-header bg-white sticky top-0 flex justify-between z-10">
            <div className="modal-title">ให้กุญแจ</div>
            <form method="dialog">
              <button className="close btn btn-icon border-none bg-transparent shadow-none btn-tertiary">
                <i className="material-symbols-outlined">close</i>
              </button>
            </form>
          </div>
          <div className="modal-body overflow-y-auto">
            <div className="form-section" style={{ marginTop: 0 }}>
              <div className="form-section-header">
                <div className="form-section-header-title">ผู้มารับกุญแจ</div>

                <button
                  className="btn btn-tertiary-brand bg-transparent shadow-none border-none"
                  onClick={() => {
                    modalRef.current?.close();
                    keyPickUpEditModalRef.current?.openModal();
                  }}
                >
                  แก้ไข
                </button>
              </div>
              <div className="form-card w-full">
                <div className="form-card-body">
                  <div className="form-group form-plaintext form-users">
                    <Image
                      src="/assets/img/sample-avatar.png"
                      className="avatar avatar-md"
                      width={100}
                      height={100}
                      alt=""
                    />
                    <div className="form-plaintext-group align-self-center">
                      <div className="form-label">ศรัญยู บริรัตน์ฤทธิ์</div>
                      <div className="supporting-text-group">
                        <div className="supporting-text">505291</div>
                        <div className="supporting-text">นรค.6 กอพ.1 ฝพจ.</div>
                      </div>
                    </div>
                  </div>
                  <div className="form-card-right align-self-center mt-4">
                    <div className="flex flex-wrap gap-4">
                      <div className="col-span-12 md:col-span-6">
                        <div className="form-group form-plaintext">
                          <i className="material-symbols-outlined">
                            smartphone
                          </i>
                          <div className="form-plaintext-group">
                            <div className="form-text text-nowrap">
                              091-234-5678
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="col-span-12 md:col-span-6">
                        <div className="form-group form-plaintext">
                          <i className="material-symbols-outlined">call</i>
                          <div className="form-plaintext-group">
                            <div className="form-text text-nowra">6032</div>
                          </div>
                        </div>
                      </div>

                      <div className="col-span-12 md:col-span-6">
                        <div className="form-group form-plaintext">
                          <i className="material-symbols-outlined">SMS</i>
                          <div className="form-plaintext-group">
                            <div className="form-text text-nowrap">
                              จะไปรับกุญแจช่วงบ่ายครับ
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="form-section">
              <div className="grid grid-cols-1 gap-5">
                <div className="form-group">
                  <label className="form-label">วันที่ / เวลา</label>
                  <div className="input-group">
                    <div className="input-group-prepend">
                      <span className="input-group-text">
                        <i className="material-symbols-outlined">
                          calendar_month
                        </i>
                      </span>
                    </div>
                    <DateTimePicker placeholder="ระบุวันที่" />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">สิ่งที่ส่งมอบ</label>

                  <RadioButton
                    name={"key"}
                    label={"กุญแจหลัก และบัตรเติมน้ำมัน"}
                    value={"กุญแจหลัก และบัตรเติมน้ำมัน"}
                    selectedValue={selectedAttach}
                    setSelectedValue={setSelectedAttach}
                  />
                  <RadioButton
                    name={"key"}
                    label={"กุญแจสำรอง และบัตรเติมน้ำมัน"}
                    value={"กุญแจสำรอง และบัตรเติมน้ำมัน"}
                    selectedValue={selectedAttach}
                    setSelectedValue={setSelectedAttach}
                  />
                  <RadioButton
                    name={"key"}
                    label={"กุญแจหลัก"}
                    value={"กุญแจหลัก"}
                    selectedValue={selectedAttach}
                    setSelectedValue={setSelectedAttach}
                  />
                  <RadioButton
                    name={"key"}
                    label={"กุญแจสำรอง"}
                    value={"กุญแจสำรอง"}
                    selectedValue={selectedAttach}
                    setSelectedValue={setSelectedAttach}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="modal-action sticky bottom-0 gap-3 mt-0">
            <form method="dialog">
              <button className="btn btn-secondary">ปิด</button>
            </form>
            <form method="dialog">
              <button className="btn btn-primary" onClick={() => confirmKeyHandOverModalRef.current?.openModal}>ให้กุญแจ</button>
            </form>
          </div>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>

      <KeyPickUpEditModal ref={keyPickUpEditModalRef} />
      <ConfirmKeyHandOverModal ref={confirmKeyHandOverModalRef} />
    </>
  );
});

KeyPickupDetailModal.displayName = "KeyPickupDetailModal";

export default KeyPickupDetailModal;
