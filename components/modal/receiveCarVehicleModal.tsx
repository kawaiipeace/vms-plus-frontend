import React, { forwardRef, useImperativeHandle, useRef, useState } from "react";
import DatePicker from "@/components/datePicker";
import NumberInput from "@/components/numberInput";
import Tooltip from "@/components/tooltips";
import ImageUpload from "@/components/imageUpload";
import ImagePreview from "@/components/imagePreview";
import ReceiveCarSuccessModal from "@/components/modal/receiveCarSuccessModal";
import ExampleCarImageModal from "@/components/modal/exampleCarImageModal";
import useSwipeDown from "@/utils/swipeDown";
interface ReceiveCarVehicleModalProps {
  status?: string;
}

const ReceiveCarVehicleModal = forwardRef<{ openModal: () => void; closeModal: () => void }, ReceiveCarVehicleModalProps>(({ status }, ref) => {
  // Destructure `process` from props
  const modalRef = useRef<HTMLDialogElement>(null);
  const [images, setImages] = useState<File[]>([]);
  const [images2, setImages2] = useState<File[]>([]);
  const [passengerCount, setPassengerCount] = useState(0);

  useImperativeHandle(ref, () => ({
    openModal: () => modalRef.current?.showModal(),
    closeModal: () => modalRef.current?.close(),
  }));

  const receiveCarSuccessModalRef = useRef<{
    openModal: () => void;
    closeModal: () => void;
  } | null>(null);

  const exampleCarImageModalRef = useRef<{
    openModal: () => void;
    closeModal: () => void;
  } | null>(null);

  const handleImageChange = (newImages: File[]) => {
    setImages(newImages);
  };

  const handleDeleteImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleImageChange2 = (newImages: File[]) => {
    setImages2(newImages);
  };

  const handleDeleteImage2 = (index: number) => {
    setImages2(images2.filter((_, i) => i !== index));
  };
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
                      <span className="page-title-label">{status === "edit" ? "แก้ไขข้อมูลการรับยานพาหนะ" : "รับยานพาหนะ"}</span>
                    </div>
                  </div>
                </div>

                <div className="grid w-full flex-wrap gap-5 grid-cols-12">
                  <div className="col-span-12">
                    <div className="form-group">
                      <label className="form-label">วันที่เริ่มต้นเดินทาง</label>
                      <div className="input-group">
                        <div className="input-group-prepend">
                          <span className="input-group-text">
                            <i className="material-symbols-outlined">calendar_month</i>
                          </span>
                        </div>
                        <DatePicker placeholder="ระบุวันที่" />
                      </div>
                    </div>
                  </div>
                  <div className="col-span-12">
                    <div className="form-group">
                      <label className="form-label">เลขไมล์</label>
                      <div className="input-group">
                        <input type="text" className="form-control" placeholder="ระบุเลขไมล์" />
                      </div>
                    </div>
                  </div>
                  <div className="col-span-12">
                    <div className="form-group">
                      <label className="form-label">ปริมาณเชื้อเพลิง</label>
                      <input type="range" min={0} max="100" value="25" className="range" step="25" />
<div className="flex w-full justify-between px-2 text-xs">
  <span>|</span>
  <span>|</span>
  <span>|</span>
  <span>|</span>
  <span>|</span>
</div>
                    </div>
                  </div>
                  <div className="col-span-12">
                    <div className="form-group">
                      <label className="form-label">
                        หมายเหตุ<span className="font-light">(ถ้ามี)</span>
                      </label>
                      <div className="input-group">
                        <input type="text" className="form-control" placeholder="ระบุหมายเหตุ" />
                      </div>
                    </div>
                  </div>
                  {status !== "edit" && (
                    <>
                      <div className="col-span-12">
                        <div className="form-group">
                          <label className="form-label">
                            รูปหน้าปัดเรือนไมล์
                            <Tooltip title="รูปหน้าปัดเรือนไมล์" content="Upload ได้ 1 รูป" position="right">
                              <i className="material-symbols-outlined">info</i>
                            </Tooltip>
                          </label>
                          <ImageUpload images={images} onImageChange={handleImageChange} onDeleteImage={handleDeleteImage} />
                          <div className="image-preview flex flex-wrap gap-3">
                            {images.map((image, index) => (
                              <ImagePreview key={index} image={image} onDelete={() => handleDeleteImage(index)} />
                            ))}
                          </div>
                        </div>
                      </div>
                      <div className="col-span-12">
                        <div className="form-group">
                          <label className="form-label">
                            รูปยานพาหนะภายในและภายนอก<span className="font-light">(ถ้ามี)</span>
                            <Tooltip title="รูปหน้าปัดเรือนไมล์" content="Upload ได้ 1 รูป" position="right">
                              <i
                                className="material-symbols-outlined"
                                onClick={() => {
                                  exampleCarImageModalRef.current?.openModal();
                                  modalRef.current?.close();
                                }}
                              >
                                info
                              </i>
                            </Tooltip>
                          </label>
                          <ImageUpload images={images2} onImageChange={handleImageChange2} onDeleteImage={handleDeleteImage2} />
                          <div className="image-preview flex flex-wrap gap-3">
                            {images2.map((image, index) => (
                              <ImagePreview key={index} image={image} onDelete={() => handleDeleteImage2(index)} />
                            ))}
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </div>
                <div className="grid w-full flex-wrap gap-5 grid-cols-12 mt-3">
                  <div className="col-span-6">
                    <button type="button" className="btn btn-secondary w-full" onClick={() => modalRef.current?.close()}>
                      ไม่ใช่ตอนนี้
                    </button>
                  </div>
                  <div className="col-span-6">
                    <button
                      type="button"
                      className="btn bg-[#A80689] hover:bg-[#A80689] border-[#A80689] text-white w-full"
                      onClick={() => {
                        receiveCarSuccessModalRef.current?.openModal();
                        modalRef.current?.close();
                      }}
                    >
                      ยืนยัน
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
      <ReceiveCarSuccessModal ref={receiveCarSuccessModalRef} />
      <ExampleCarImageModal backModal={() => modalRef.current?.showModal()} ref={exampleCarImageModalRef} />
    </>
  );
});

ReceiveCarVehicleModal.displayName = "ReceiveCarVehicleModal";

export default ReceiveCarVehicleModal;
