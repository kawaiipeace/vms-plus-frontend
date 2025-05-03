import ImagePreview from "@/components/imagePreview";
import ImageUpload from "@/components/imageUpload";
import Tooltip from "@/components/tooltips";
import useSwipeDown from "@/utils/swipeDown";
import { forwardRef, useImperativeHandle, useRef, useState } from "react";
import { ValueFormStep1 } from "./returnCarAddModal";
import { UploadFileType } from "@/app/types/upload-type";

interface ReturnCarAddStep2ModalProps {
  openStep1: () => void;
  status?: string;
  useBy?: string;
  valueFormStep1?: ValueFormStep1;
}

const ReturnCarAddStep2Modal = forwardRef<
  { openModal: () => void; closeModal: () => void },
  ReturnCarAddStep2ModalProps
>(({ openStep1, status, useBy, valueFormStep1 }, ref) => {
  // Destructure `process` from props
  const modalRef = useRef<HTMLDialogElement>(null);
  const [images, setImages] = useState<UploadFileType[]>([]);
  const [images2, setImages2] = useState<UploadFileType[]>([]);
  const [images3, setImages3] = useState<UploadFileType[]>([]);

  useImperativeHandle(ref, () => ({
    openModal: () => modalRef.current?.showModal(),
    closeModal: () => modalRef.current?.close(),
  }));

  const handleImageChange = (newImages: UploadFileType) => {
    setImages([newImages]);
  };

  const handleDeleteImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleImageChange2 = (newImages: UploadFileType) => {
    setImages2([newImages]);
  };

  const handleDeleteImage2 = (index: number) => {
    setImages2(images2.filter((_, i) => i !== index));
  };

  const handleImageChange3 = (newImages: UploadFileType) => {
    setImages3([newImages]);
  };

  const handleDeleteImage3 = (index: number) => {
    setImages3(images3.filter((_, i) => i !== index));
  };
  const swipeDownHandlers = useSwipeDown(() => modalRef.current?.close());

  return (
    <>
      <dialog ref={modalRef} className={`modal modal-middle`}>
        <div className="modal-box max-w-[500px] p-0 relative overflow-hidden flex flex-col">
          <div className="modal-body overflow-y-auto text-center !bg-white">
            <form>
              <div className="form-section">
                <div className="page-section-header border-0">
                  <div className="page-header-left">
                    <div
                      className="page-title"
                      onClick={() => {
                        openStep1();
                        modalRef.current?.close();
                      }}
                    >
                      <span className="page-title-label">
                        {status === "edit" ? (
                          "แก้ไขรูปยานพาหนะก่อนเดินทาง"
                        ) : (
                          <>
                            <i className="material-symbols-outlined">
                              keyboard_arrow_left
                            </i>{" "}
                            คืนยานพาหนะ
                          </>
                        )}
                      </span>
                    </div>
                    {status !== "edit" && (
                      <p className="text-left font-bold">Step 2: รูปยานพาหนะ</p>
                    )}
                  </div>
                </div>

                <div className="grid w-full flex-wrap gap-5 grid-cols-12">
                  <div className="col-span-12">
                    <div className="form-group">
                      <label className="form-label">
                        รูปหน้าปัดเรือนไมล์
                        <Tooltip
                          title="รูปหน้าปัดเรือนไมล์"
                          content="Upload ได้ 1 รูป"
                          position="right"
                        >
                          <i className="material-symbols-outlined">info</i>
                        </Tooltip>
                      </label>
                      <ImageUpload
                        // images={images}
                        onImageChange={handleImageChange}
                        // onDeleteImage={handleDeleteImage}
                      />
                      <div className="image-preview flex flex-wrap gap-3">
                        {images.map((image, index) => (
                          <ImagePreview
                            key={index}
                            image={image.file_url}
                            onDelete={() => handleDeleteImage(index)}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                  <div
                    className={`col-span-12 ${
                      (useBy !== "driver" && useBy !== "admin")
                        ? "hidden"
                        : "block"
                    }`}
                  >
                    <div className="form-group">
                      <label className="form-label">
                        รูปยานพาหนะภายในและภายนอก
                        <span className="font-light">(ถ้ามี)</span>
                        <Tooltip
                          title="รูปหน้าปัดเรือนไมล์"
                          content="Upload ได้ 1 รูป"
                          position="right"
                        >
                          <i className="material-symbols-outlined">info</i>
                        </Tooltip>
                      </label>
                      <ImageUpload
                        // images={images2}
                        onImageChange={handleImageChange2}
                        // onDeleteImage={handleDeleteImage2}
                      />
                      <div className="image-preview flex flex-wrap gap-3">
                        {images2.map((image, index) => (
                          <ImagePreview
                            key={index}
                            image={image.file_url}
                            onDelete={() => handleDeleteImage2(index)}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                  <div
                    className={`col-span-12 ${
                      useBy !== "driver"
                        ? "hidden"
                        : "block"
                    }`}
                  >
                    <div className="form-group">
                      <label className="form-label">
                        รูปยานพาหนะภายใน
                        <span className="font-light">(ถ้ามี)</span>
                        <Tooltip
                          title="รูปหน้าปัดเรือนไมล์"
                          content="Upload ได้ 1 รูป"
                          position="right"
                        >
                          <i className="material-symbols-outlined">info</i>
                        </Tooltip>
                      </label>
                      <ImageUpload
                        // images={images2}
                        onImageChange={handleImageChange2}
                        // onDeleteImage={handleDeleteImage2}
                      />
                      <div className="image-preview flex flex-wrap gap-3">
                        {images2.map((image, index) => (
                          <ImagePreview
                            key={index}
                            image={image.file_url}
                            onDelete={() => handleDeleteImage2(index)}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                  <div
                    className={`col-span-12 ${
                      useBy !== "driver" ? "hidden" : "block"
                    }`}
                  >
                    <div className="form-group">
                      <label className="form-label">
                        รูปยานพาหนะภายนอก
                        <span className="font-light">(ถ้ามี)</span>
                        <Tooltip
                          title="รูปหน้าปัดเรือนไมล์"
                          content="Upload ได้ 1 รูป"
                          position="right"
                        >
                          <i className="material-symbols-outlined">info</i>
                        </Tooltip>
                      </label>
                      <ImageUpload
                        // images={images3}
                        onImageChange={handleImageChange3}
                        // onDeleteImage={handleDeleteImage3}
                      />
                      <div className="image-preview flex flex-wrap gap-3">
                        {images3.map((image, index) => (
                          <ImagePreview
                            key={index}
                            image={image.file_url}
                            onDelete={() => handleDeleteImage2(index)}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
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
                        modalRef.current?.close();
                      }}
                    >
                      {useBy === "admin" ? "บันทึก" : "ยืนยัน"}
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
    </>
  );
});

ReturnCarAddStep2Modal.displayName = "ReturnCarAddStep2Modal";

export default ReturnCarAddStep2Modal;
