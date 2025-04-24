import React, {
  forwardRef,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import Image from "next/image";
import RadioButton from "@/components/radioButton";
import KeyPickUpEditModal from "./keyPickUpEditModal";
import ConfirmKeyHandOverModal from "@/components/modal/confirmKeyHandOverModal";
import useSwipeDown from "@/utils/swipeDown";
import TimePicker from "@/components/timePicker";
import DatePicker from "@/components/datePicker";

// Props for the KeyPickupDetailModal component
interface KeyPickUpDetailProps {
  reqId: string;
  id: string;
  imgSrc: string;
  name: string;
  deptSap: string;
  phone: string;
  onEdit?: () => void;
  onSubmit?: () => void;
}

// Ref methods exposed by the modal
export interface KeyPickupDetailModalRef {
  openModal: () => void;
  closeModal: () => void;
}

const KeyPickupDetailModal = forwardRef<
  KeyPickupDetailModalRef,
  KeyPickUpDetailProps
>((props, ref) => {
  const { id, imgSrc, name, deptSap,phone, reqId, onEdit,onSubmit } = props;

  const modalRef = useRef<HTMLDialogElement>(null);
  const [selectedAttach, setSelectedAttach] = useState<string>(
    "กุญแจหลัก และบัตรเติมน้ำมัน"
  );

  const confirmKeyHandOverModalRef = useRef<{
    openModal: () => void;
    closeModal: () => void;
  }>(null);

  // Expose open and close methods via ref
  useImperativeHandle(ref, () => ({
    openModal: () => modalRef.current?.showModal(),
    closeModal: () => modalRef.current?.close(),
  }));

  // Handler for swipe-down to close
  const swipeDownHandlers = useSwipeDown(() => modalRef.current?.close());

  const submit = () => {
       try {
         
          // await updateKeyPickupOutsider(payload);

          if (onSubmit) {
            onSubmit();
          }
        } catch (error) {
          console.error("Network error:", error);
        }
  }

  return (
    <>
      <dialog ref={modalRef} className="modal">
        {/* Modal content */}
        <div className="modal-box max-w-[500px] p-0 relative modal-vehicle-pick overflow-hidden flex flex-col max-h-[90vh]">
          {/* Swipe down indicator */}
          <div className="bottom-sheet" {...swipeDownHandlers}>
            <div className="bottom-sheet-icon"></div>
          </div>

          {/* Header */}
          <div className="modal-header bg-white sticky top-0 flex justify-between z-10">
            <div className="modal-title">รับกุญแจ</div>
            <form method="dialog">
              <button className="close btn btn-icon border-none bg-transparent shadow-none btn-tertiary">
                <i className="material-symbols-outlined">close</i>
              </button>
            </form>
          </div>

          {/* Body */}
          <div className="modal-body overflow-y-auto">
            {/* User info section */}
            <div className="form-section" style={{ marginTop: 0 }}>
              <div className="form-section-header">
                <div className="form-section-header-title">ผู้ไปรับกุญแจ</div>
                <button
                  className="btn btn-tertiary-brand bg-transparent shadow-none border-none"
                  onClick={() => {
                    modalRef.current?.close();
                    if (onEdit) {
                      onEdit();
                    }
                  }}
                >
                  แก้ไข
                </button>
              </div>
              <div className="form-card w-full">
                <div className="form-card-body">
                  <div className="form-group form-plaintext form-users">
                    <Image
                      src={imgSrc}
                      className="avatar avatar-md"
                      width={100}
                      height={100}
                      alt={name}
                    />
                    <div className="form-plaintext-group align-self-center">
                      <div className="form-label">{name}</div>
                      <div className="supporting-text-group">
                        <div className="supporting-text">{deptSap}</div>
                      </div>
                    </div>
                  </div>
                  <div className="form-card-right align-self-center mt-4">
                    <div className="text-error text-center">
                      ผู้รับกุญแจมีหน้าที่ดูแลรักษา <br />
                      ไม่ให้กุญแจและ/หรือบัตรเติมน้ำมันสูญหาย
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Date, time, and attachments section */}
            <div className="form-section">
              <div className="grid grid-cols-12 gap-5">
                {/* Date picker */}
                <div className="col-span-6">
                  <div className="form-group">
                    <label className="form-label">วันที่เริ่มต้นเดินทาง</label>
                    <div className="input-group">
                      <div className="input-group-prepend">
                        <span className="input-group-text">
                          <i className="material-symbols-outlined">
                            calendar_month
                          </i>
                        </span>
                      </div>
                      <DatePicker
                        placeholder={"ระบุวันที่"}
                        // onChange={(dateStr) => setSelectedDate(dateStr)}
                      />
                    </div>
                  </div>
                </div>

                {/* Time picker */}
                <div className="col-span-6">
                  <div className="form-group">
                    <label className="form-label">เวลานัดหมาย</label>
                    <div className="input-group">
                      <div className="input-group-prepend">
                        <span className="input-group-text">
                          <i className="material-symbols-outlined">schedule</i>
                        </span>
                      </div>
                      <TimePicker placeholder="ระบุเวลา"   
                      // onChange={(dateStr) => setSelectedTime(datestr)} 
                      />
                    </div>
                  </div>
                </div>

                {/* Radio buttons */}
                <div className="col-span-12">
                  <div className="form-group">
                    <label className="form-label">สิ่งที่ส่งมอบ</label>
                    <RadioButton
                      name="key"
                      label="กุญแจหลัก และบัตรเติมน้ำมัน"
                      value="กุญแจหลัก และบัตรเติมน้ำมัน"
                      selectedValue={selectedAttach}
                      setSelectedValue={setSelectedAttach}
                    />
                    <RadioButton
                      name="key"
                      label="กุญแจหลัก"
                      value="กุญแจหลัก"
                      selectedValue={selectedAttach}
                      setSelectedValue={setSelectedAttach}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="modal-action sticky bottom-0 gap-3 mt-0">
            <form method="dialog" className="w-[50%] md:w-auto">
              <button className="btn btn-secondary w-full">ไม่ใช่ตอนนี้</button>
            </form>
            <button
              className="btn btn-primary w-[50%] md:w-auto"
              onClick={() => {
                modalRef.current?.close();
                confirmKeyHandOverModalRef.current?.openModal();
              }}
            >
              ยืนยัน
            </button>
          </div>
        </div>

        {/* Backdrop */}
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>

      <ConfirmKeyHandOverModal ref={confirmKeyHandOverModalRef} />
    </>
  );
});

KeyPickupDetailModal.displayName = "KeyPickupDetailModal";
export default KeyPickupDetailModal;
