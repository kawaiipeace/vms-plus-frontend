import ImagePreview from "@/components/imagePreview";
import ImageUpload from "@/components/imageUpload";
import Tooltip from "@/components/tooltips";
import useSwipeDown from "@/utils/swipeDown";
import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import { ValueFormStep1 } from "./returnCarAddModal";
import { UploadFileType } from "@/app/types/upload-type";
import { ImagePreviewType } from "@/app/types/image-preview-type";
import { adminUpdateImageDetail } from "@/services/adminService";

interface ReturnCarAddStep2ModalProps {
  openStep1?: () => void;
  status?: string;
  useBy?: string;
  valueFormStep1?: ValueFormStep1;
  previewImages?: ImagePreviewType[];
  reqId?: string;
  onSubmit?: () => void;
}

const ReturnCarAddStep2Modal = forwardRef<
  { openModal: () => void; closeModal: () => void },
  ReturnCarAddStep2ModalProps
>(({ openStep1, status, useBy, valueFormStep1, previewImages, reqId, onSubmit }, ref) => {
  const modalRef = useRef<HTMLDialogElement>(null);
  const [images, setImages] = useState<UploadFileType[]>([]);
  const [images2, setImages2] = useState<UploadFileType[]>([]);
  const [images3, setImages3] = useState<UploadFileType[]>([]);
  const [imageEx, setImageEx] = useState<UploadFileType[]>();

  useImperativeHandle(ref, () => ({
    openModal: () => modalRef.current?.showModal(),
    closeModal: () => modalRef.current?.close(),
  }));

  const exampleCarImageModalRef = useRef<{
    openModal: () => void;
    closeModal: () => void;
  } | null>(null);

  const handleImageChange = (newImage: UploadFileType) => {

    setImages([{ file_url: newImage.file_url || "" }]);
  };

  const handleDeleteImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleImageChange2 = (newImage: UploadFileType) => {
    setImages2([newImage]);
  };

  const handleDeleteImage2 = (index: number) => {
    setImages2(images2.filter((_, i) => i !== index));
  };

  const handleImageChange3 = (newImage: UploadFileType) => {
    setImages3([newImage]);
  };

  const handleDeleteImage3 = (index: number) => {
    setImages3(images3.filter((_, i) => i !== index));
  };

  useEffect(() => {
    if (previewImages && previewImages.length > 0) {
      // Add one image to images
      if (images.length === 0) {
        setImages([{ file_url: previewImages[0].vehicle_img_file || "" }]);
      }
  
      // Skip the first image when setting images2
      const image2Set = previewImages.slice(1, 5).map((img) => ({
        file_url: img.vehicle_img_file || "",
      }));
      if (images2.length === 0) {
        setImages2(image2Set);
      }
  
      // Optionally assign one more to images3 (i.e., the 6th image)
      if (previewImages.length > 5 && images3.length === 0) {
        setImages3([{ file_url: previewImages[5].vehicle_img_file || "" }]);
      }
    }
  }, [previewImages]);
  
  

  const swipeDownHandlers = useSwipeDown(() => modalRef.current?.close());

    const onSubmitForm = async () => {
      try {
        const imageList = [...images, ...images2].map((item, index) => {
          return {
            ref_vehicle_img_side_code: index + 1,
            vehicle_img_file: item.file_url,
          };
        });
  
        const payload = {
          trn_request_uid: reqId,
          vehicle_images: imageList,
        };
        let response;
        if (useBy === "admin") {
          response = await adminUpdateImageDetail(payload);
          if(response){
              console.log('res',response.data);
              modalRef.current?.close();
          }
        } 
        if (onSubmit) {
          onSubmit();
        } 
      } catch (error) {
        console.error("Error submitting form data:", error);
      }
    };

  return (
    <>
      <dialog ref={modalRef} className="modal modal-middle">
 
        <div className="modal-box max-w-[500px] p-0 relative overflow-hidden flex flex-col">
        <form>
        <div className="bottom-sheet" {...swipeDownHandlers}>
            <div className="bottom-sheet-icon"></div>
          </div>
          <div className="modal-header bg-white sticky top-0 flex justify-between z-10">
            <div className="modal-title"   onClick={() => {
                        modalRef.current?.close();
                      }}>

                  
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
                    
                    {status !== "edit" && (
                      <p className="text-left font-bold">Step 2: รูปยานพาหนะ</p>
                    )}
                
            </div>

              <button className="close btn btn-icon border-none bg-transparent shadow-none btn-tertiary" onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        modalRef.current?.close();
                      }}>
                <i className="material-symbols-outlined">close</i>
              </button>

          </div>

          <div className="modal-body overflow-y-auto text-center !bg-white">
          
              <div className="form-section">

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
                          <i
                            className="material-symbols-outlined"
                            onClick={() => {
                              exampleCarImageModalRef.current?.openModal();
                              modalRef.current?.close();
                              setImageEx(images);
                            }}
                          >
                            info
                          </i>
                        </Tooltip>
                      </label>
                      {images.length <= 0 && (
                        <ImageUpload onImageChange={handleImageChange} />
                      )}
                      <div className="image-preview flex flex-wrap gap-3 !w-[50%]">
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
                      useBy !== "driver" && useBy !== "admin"
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
                          content="Upload ได้ 4 รูป"
                          position="right"
                        >
                          <i
                            className="material-symbols-outlined"
                            onClick={() => {
                              exampleCarImageModalRef.current?.openModal();
                              modalRef.current?.close();
                              setImageEx(images2);
                            }}
                          >
                            info
                          </i>
                        </Tooltip>
                      </label>
                      {images2.length < 4 && (
                        <ImageUpload onImageChange={handleImageChange2} />
                      )}
                      <div className="grid grid-cols-2 gap-3 w-full mt-3">
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
                      <ImageUpload onImageChange={handleImageChange2} />
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
                      <ImageUpload onImageChange={handleImageChange3} />
                      <div className="image-preview flex flex-wrap gap-3">
                        {images3.map((image, index) => (
                          <ImagePreview
                            key={index}
                            image={image.file_url}
                            onDelete={() => handleDeleteImage3(index)}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

              </div>
              
            
          
          </div>
          <div className="modal-action w-full flex-wrap gap-5 mt-3 ml-auto">
                  <div className="col-span-6">
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={() => modalRef.current?.close()}
                    >
                         {useBy === "admin" ? "ปิด" : "ไม่ใช่ตอนนี้"}
                    </button>
                  </div>
                  <div className="col-span-6">
                    <button
                      type="button"
                      className="btn bg-[#A80689] hover:bg-[#A80689] border-[#A80689] text-white"
                      onClick={onSubmitForm}
                    >
                      {useBy === "admin" ? "บันทึก" : "ยืนยัน"}
                    </button>
                  </div>
                </div>
                </form>
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
