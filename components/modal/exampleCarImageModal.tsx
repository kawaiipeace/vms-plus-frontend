import { UploadFileType } from "@/app/types/upload-type";
import ImgSlider from "@/components/imgSlider";
import useSwipeDown from "@/utils/swipeDown";
import { forwardRef, useImperativeHandle, useRef } from "react";

interface Props {
  backModal: () => void;
  imageEx: File[] | UploadFileType[];
}

const ExampleCarImageModal = forwardRef<{ openModal: () => void; closeModal: () => void }, Props>(
  ({ imageEx, backModal }, ref) => {
    const modalRef = useRef<HTMLDialogElement>(null);

    useImperativeHandle(ref, () => ({
      openModal: () => modalRef.current?.showModal(),
      closeModal: () => modalRef.current?.close(),
    }));

    const imageUrls: string[] = (imageEx?.map((file) => {
      if ("file_url" in file) {
        return (file as UploadFileType).file_url;
      } else {
        return URL.createObjectURL(file as File);
      }
    }) || []) as string[];
    // [
    //   "/assets/img/sample-car.jpeg",
    //   "/assets/img/sample-car.jpeg",
    //   "/assets/img/sample-car.jpeg",
    //   "/assets/img/sample-car.jpeg",
    // ];

    const swipeDownHandlers = useSwipeDown(() => modalRef.current?.close());

    return (
      <>
        <dialog ref={modalRef} className="modal">
          <div className="modal-box max-w-[500px] p-0 relative !bg-white">
            <div className="modal-header bg-white sticky top-0 flex justify-between z-10">
              <div className="modal-title">
                <i
                  className="material-symbols-outlined"
                  onClick={() => {
                    modalRef.current?.close();
                    backModal();
                  }}
                >
                  keyboard_arrow_left
                </i>{" "}
                ตัวอย่างรูปยานพาหนะ
              </div>
              <form method="dialog">
                <button
                  className="close btn btn-icon border-none bg-transparent shadow-none btn-tertiary"
                  onClick={() => {
                    modalRef.current?.close();
                    backModal();
                  }}
                >
                  <i className="material-symbols-outlined">close</i>
                </button>
              </form>
            </div>
            <div className="modal-body flex flex-wrap flex-col md:flex-row gap-5">
              <div className="w-full">
                <ImgSlider id="2" images={imageUrls} />
              </div>
              {/* <div className="w-full">
                <button className="btn btn-primary w-full">ถัดไป</button>
              </div> */}
            </div>
          </div>
          <form method="dialog" className="modal-backdrop">
            <button>close</button>
          </form>
        </dialog>
      </>
    );
  }
);

ExampleCarImageModal.displayName = "ExampleCarImageModal";

export default ExampleCarImageModal;
