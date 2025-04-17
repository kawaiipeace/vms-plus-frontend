import React, {
  forwardRef,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import DatePicker from "@/components/datePicker";
import NumberInput from "@/components/numberInput";
import RadioButton from "@/components/radioButton";
import ReturnCarAddStep2Modal from "@/components/modal/returnCarAddStep2Modal";
import useSwipeDown from "@/utils/swipeDown";

interface ReturnCarAddModalProps {
  useBy?: string;
}

const ReturnCarAddModal = forwardRef<
  { openModal: () => void; closeModal: () => void },
  ReturnCarAddModalProps
>(({ useBy }, ref) => {
  // Destructure `process` from props
  const modalRef = useRef<HTMLDialogElement>(null);
  const [inCarType, setInCarType] = useState("");
  const [outCarType, setOutCarType] = useState("");
  const [passengerCount, setPassengerCount] = useState(0);

  useImperativeHandle(ref, () => ({
    openModal: () => modalRef.current?.showModal(),
    closeModal: () => modalRef.current?.close(),
  }));

  const returnCarAddStep2ModalRef = useRef<{
    openModal: () => void;
    closeModal: () => void;
  } | null>(null);
  const swipeDownHandlers = useSwipeDown(() => modalRef.current?.close());

  return (
    <>
      <dialog ref={modalRef} className={`modal modal-middle`}>
        <div  className="modal-box max-w-[500px] p-0 relative overflow-hidden flex flex-col">
          <div className="modal-body overflow-y-auto text-center !bg-white">
            <form>
              <div className="form-section">
                <div className="page-section-header border-0">
                  <div className="page-header-left">
                    <div className="page-title">
                      <span className="page-title-label">คืนยานพาหนะ</span>
                    </div>
                    <p className="text-left font-bold">Step 1: ข้อมูลทั่วไป</p>
                  </div>
                </div>

                <div className="grid w-full flex-wrap gap-5 grid-cols-12">
                  <div className="col-span-12">
                    <div className="form-group">
                      <label className="form-label">
                        วันที่เริ่มต้นเดินทาง
                      </label>
                      <div className="input-group">
                        <div className="input-group-prepend">
                          <span className="input-group-text">
                            <i className="material-symbols-outlined">
                              calendar_month
                            </i>
                          </span>
                        </div>
                        <DatePicker placeholder="ระบุวันที่" />
                      </div>
                    </div>
                  </div>
                  <div className="col-span-12">
                    <div className="form-group">
                      <label className="form-label">สถานที่จอดรถ</label>
                      <div className="input-group">
                        <input type="text" className="form-control" />
                      </div>
                    </div>
                  </div>
                  <div className="col-span-6">
                    <div className="form-group">
                      <label className="form-label">เลขไมล์</label>
                      <div className="input-group">
                        <input
                          type="text"
                          className="form-control"
                          placeholder="ระบุเลขไมล์"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="col-span-6">
                    <div className="form-group">
                      <label className="form-label">ปริมาณเชื้อเพลิง</label>
                      <NumberInput
                        value={passengerCount}
                        onChange={setPassengerCount}
                      />
                    </div>
                  </div>
                  <div className="col-span-12">
                    <div className="form-group">
                      <label className="form-label">ภายในห้องโดยสาร</label>
                      <div className="custom-group">
                        <RadioButton
                          name="travelType"
                          label="สะอาด"
                          value="สะอาด"
                          selectedValue={inCarType}
                          setSelectedValue={setInCarType}
                        />

                        <RadioButton
                          name="travelType"
                          label="ไม่สะอาด"
                          value="ไม่สะอาด"
                          selectedValue={inCarType}
                          setSelectedValue={setInCarType}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="col-span-12">
                    <div className="form-group">
                      <label className="form-label">ภายนอกยานพาหนะ</label>
                      <div className="custom-group">
                        <RadioButton
                          name="travelType"
                          label="สะอาด"
                          value="สะอาด"
                          selectedValue={outCarType}
                          setSelectedValue={setOutCarType}
                        />

                        <RadioButton
                          name="travelType"
                          label="ไม่สะอาด"
                          value="ไม่สะอาด"
                          selectedValue={outCarType}
                          setSelectedValue={setOutCarType}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="col-span-12">
                    <div className="form-group">
                      <label className="form-label">
                        หมายเหตุ<span className="font-light">(ถ้ามี)</span>
                      </label>
                      <div className="input-group">
                        <input
                          type="text"
                          className="form-control"
                          placeholder="ระบุหมายเหตุ"
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="grid w-full flex-wrap gap-5 grid-cols-12 mt-3">
                  <div className="col-span-6">
                    <button type="button" className="btn btn-secondary w-full">
                      ไม่ใช่ตอนนี้
                    </button>
                  </div>
                  <div className="col-span-6">
                    <button
                      type="button"
                      className="btn bg-[#A80689] hover:bg-[#A80689] border-[#A80689] text-white w-full"
                      onClick={() => {
                        if (useBy !== "admin") {
                          returnCarAddStep2ModalRef.current?.openModal();
                          modalRef.current?.close();
                        } else {
                          modalRef.current?.close();
                        }
                      }}
                    >
                      {useBy === "admin" ? "บันทึก" : "ต่อไป"}
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
      <ReturnCarAddStep2Modal
        openStep1={() => modalRef.current?.showModal()}
        useBy={useBy}
        ref={returnCarAddStep2ModalRef}
      />
    </>
  );
});

ReturnCarAddModal.displayName = "ReturnCarAddModal";

export default ReturnCarAddModal;
