import React, { forwardRef, useImperativeHandle, useRef, useState } from "react";
import DatePicker from "@/components/datePicker";
import CustomSelect from "@/components/customSelect";
import RadioButton from "@/components/radioButton";
import ImageUpload from "@/components/imageUpload";
import ImagePreview from "@/components/imagePreview";
import useSwipeDown from "@/utils/swipeDown";

interface Props {
  status?: boolean;
}

const RecordTravelAddModal = forwardRef<{ openModal: () => void; closeModal: () => void }, Props>(({ status }, ref) => {
  const modalRef = useRef<HTMLDialogElement>(null);
  const fuelOptions = ["ปตท. (OR)", "บางจาก (BCP)", "พีที (PTG)", "ซัสโก้ (SUSCO)", "เชลล์ (SHELL)"];
  const fuelTypeOptions = ["ดีเซล", "เบนซิน"];
  useImperativeHandle(ref, () => ({
    openModal: () => modalRef.current?.showModal(),
    closeModal: () => modalRef.current?.close(),
  }));
  const [selectedTravelType, setSelectedTravelType] = useState("");
  const [images, setImages] = useState<File[]>([]);

  const handleImageChange = (newImages: File[]) => {
    setImages(newImages);
  };

  const handleDeleteImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };
  const swipeDownHandlers = useSwipeDown(() => modalRef.current?.close());

  return (
    <dialog ref={modalRef} className="modal">
      <div  className="modal-box max-w-[500px] p-0 relative overflow-hidden flex flex-col">
        <div className="modal-body overflow-y-auto text-center">
          <div className="modal-header bg-white sticky top-0 flex justify-between z-10">
            <div className="modal-title">{status ? "แก้ไขข้อมูลการเติมเชื้อเพลิง" : "เพิ่มข้อมูลการเติมเชื้อเพลิง"}</div>
            <form method="dialog">
              <button className="close btn btn-icon border-none bg-transparent shadow-none btn-tertiary">
                <i className="material-symbols-outlined">close</i>
              </button>
            </form>
          </div>
          <form>
            <div className="grid grid-cols-1 gap-4 mt-4">
              <div className="col-span-12">
                <div className="form-group">
                  <label className="form-label">สถานีบริการน้ำมัน</label>
                  {/* <CustomSelect w="w-full" options={fuelOptions} /> */}
                </div>
              </div>
              <div className="col-span-12">
                <div className="form-group">
                  <label className="form-label">ประเภทเชื้อเพลิง</label>
                  {/* <CustomSelect w="w-full" options={fuelTypeOptions} /> */}
                </div>
              </div>
              <div className="col-span-12 grid grid-cols-2 gap-4">
                <div>
                  <div className="form-group">
                    <label className="form-label">เลขไมล์</label>
                    <div className="input-group">
                      <input type="text" className="form-control" />
                    </div>
                  </div>
                </div>
                <div>
                  <div className="form-group">
                    <label className="form-label">วันที่ใบเสร็จ</label>
                    <DatePicker placeholder="ระบุวันที่" />
                  </div>
                </div>
              </div>
              <div className="col-span-12">
                <div className="form-group">
                  <label className="form-label">เลขที่ใบเสร็จ</label>
                  <div className="input-group">
                    <input type="text" className="form-control" placeholder="ระบุเลขที่ใบเสร็จ" />
                  </div>
                </div>
              </div>
              <div className="col-span-12 grid grid-cols-2 gap-4">
                <div>
                  <div className="form-group">
                    <label className="form-label">ราคาต่อลิตร</label>
                    <div className="input-group">
                      <input type="text" className="form-control" placeholder="ระบุราคาต่อลิตร" />
                    </div>
                  </div>
                </div>
                <div>
                  <div className="form-group">
                    <label className="form-label">จำนวนลิตร</label>
                    <div className="input-group">
                      <input type="text" className="form-control" placeholder="ระบุจำนวนลิตร" />
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-span-12">
                <div className="form-group">
                  <label className="form-label">ยอดรวมชำระ</label>
                  <div className="input-group">
                    <input type="text" className="form-control" placeholder="ระบุยอดรวมชำระ" />
                  </div>
                  <p className="text-sm text-left mt-3">รวมภาษี 85.05 บาท (7%)</p>
                </div>
              </div>
              <div className="col-span-12">
                <div className="form-group">
                  <label className="form-label">วิธีชำระเงิน</label>
                  <div className="custom-group">
                    <RadioButton name="travelType" label="บัตรเติมน้ำมัน" value="บัตรเติมน้ำมัน" selectedValue={selectedTravelType} setSelectedValue={setSelectedTravelType} />

                    <RadioButton name="travelType" label="เงินสด, บัตรเครดิต, อื่น ๆ" value="เงินสด, บัตรเครดิต, อื่น ๆ" selectedValue={selectedTravelType} setSelectedValue={setSelectedTravelType} />
                  </div>
                </div>
              </div>
              <div className="col-span-12">
                <label className="form-label">รูปภาพใบเสร็จ</label>
                <ImageUpload images={images} onImageChange={handleImageChange} onDeleteImage={handleDeleteImage} />
                <div className="image-preview flex flex-wrap gap-3">
                  {images.map((image, index) => (
                    <ImagePreview key={index} image={image} onDelete={() => handleDeleteImage(index)} />
                  ))}
                </div>
              </div>
              <div className="col-span-12 grid grid-cols-2 gap-4">
                <div>
                  <button className="btn btn-secondary w-full" onClick={() => modalRef.current?.close()}>
                    ปิด
                  </button>
                </div>
                <div>
                  <button className="btn btn-primary w-full">บันทึก</button>
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
  );
});

RecordTravelAddModal.displayName = "RecordTravelAddModal";

export default RecordTravelAddModal;
