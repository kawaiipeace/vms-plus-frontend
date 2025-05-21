import { RequestDetailType } from "@/app/types/request-detail-type";
import { UploadFileType } from "@/app/types/upload-type";
import ImagePreview from "@/components/imagePreview";
import ImageUpload from "@/components/imageUpload";
import Tooltip from "@/components/tooltips";
import useSwipeDown from "@/utils/swipeDown";
import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import { ImagePreviewType } from "@/app/types/image-preview-type";
import { adminUpdateImageDetail, adminUpdateVehicleInsImage } from "@/services/adminService";

interface Props {
  status?: string;
  useBy?: string;
  reqId?: string;
  title?: string;
  requestData?: RequestDetailType;
  previewImages?: ImagePreviewType[];
  clearForm?: () => void;
  onSubmit?: () => void;
}

const ReturnInsCarModal = forwardRef<
  { openModal: () => void; closeModal: () => void },
  Props
>(({ status, useBy, reqId, onSubmit, previewImages, title, requestData }, ref) => {
  const modalRef = useRef<HTMLDialogElement>(null);
  const [images, setImages] = useState<UploadFileType[]>([]);
  const [images2, setImages2] = useState<UploadFileType[]>([]);

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

  const handleImageChange2 = (newImage: UploadFileType) => {
    if (images2.length < 4) {
      setImages2([...images2, ...[newImage]]);
    }
  };

  const handleDeleteImage2 = (index: number) => {
    setImages2(images2.filter((_, i) => i !== index));
  };

  const onSubmitForm = async () => {
    try {
      const imageList = [...images, ...images2].map((item, index) => {
        return {
          ref_vehicle_img_side_code: index + 1,
          vehicle_img_file: item.file_url,
        };
      });

      const payload = {
        trn_request_uid: requestData?.trn_request_uid,
        vehicle_images: imageList,
      };

      let response;
      if (useBy === "admin") {
        response = await adminUpdateVehicleInsImage(payload);
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

  useEffect(() => {
    console.log('img',previewImages);
    if (previewImages && previewImages.length > 0) {
  
      // Skip the first image when setting images2
      const image2Set = previewImages.map((img) => ({
        file_url: img.vehicle_img_file || "",
      }));
      if (images2.length === 0) {
        setImages2(image2Set);
      }
    }
  }, [previewImages]);
  
  const swipeDownHandlers = useSwipeDown(() => modalRef.current?.close());

  return (
    <>
      <dialog ref={modalRef} className="modal modal-middle">
        <div className="modal-box max-w-[500px] p-0 relative flex flex-col max-h-[90vh]">
          <form className="flex flex-col h-full">
            <div className="bottom-sheet" {...swipeDownHandlers}>
              <div className="bottom-sheet-icon"></div>
            </div>
            
            {/* Header */}
            <div className="modal-header bg-white sticky top-0 flex justify-between z-10 p-4 border-b">
              <div className="modal-title">
                <span className="page-title-label">
                 {title}
                </span>

              </div>

              <button 
                className="close btn btn-icon border-none bg-transparent shadow-none btn-tertiary" 
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  modalRef.current?.close();
                }}
              >
                <i className="material-symbols-outlined">close</i>
              </button>
            </div>

            {/* Scrollable Body */}
            <div className="modal-body flex-1 overflow-y-auto p-4 bg-white">
              <div className="form-section">
                <div className="grid w-full flex-wrap gap-5 grid-cols-12">

                  <div className="col-span-12">
                    <div className="form-group">
                      <label className="form-label">
                      รูปหลักฐานการตรวจสอบ (ถ้ามี)
                      </label>
                      {<ImageUpload onImageChange={handleImageChange2} />}
                      <div className="grid grid-cols-2 gap-3 w-full mt-3">
                      {images2.map((image, index) =>
                            image.file_url ? (
                              <ImagePreview
                                key={index}
                                image={image.file_url}
                                onDelete={() => handleDeleteImage2(index)}
                              />
                            ) : null
                          )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Fixed Footer */}
            <div className="modal-footer sticky bottom-0 bg-white p-4 border-t">
              <div className="flex justify-end gap-3 w-full">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => modalRef.current?.close()}
                >
                ปิด
                </button>
                <button
                  type="button"
                  className="btn bg-[#A80689] hover:bg-[#A80689] border-[#A80689] text-white"
                  onClick={onSubmitForm}
                >บันทึก
                 
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

ReturnInsCarModal.displayName = "ReturnInsCarModal";

export default ReturnInsCarModal;