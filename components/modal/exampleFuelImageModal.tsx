// import ImgSlider from "@/components/imgSlider";
import Image from "next/image";
// import useSwipeDown from "@/utils/swipeDown";
import { forwardRef, useImperativeHandle, useRef } from "react";

interface Props {
  backModal: () => void;
  imageEx: string[];
}

const ExampleFuelStringImageModal = forwardRef<
  { openModal: () => void; closeModal: () => void },
  Props
>(({ imageEx, backModal }, ref) => {
  const modalRef = useRef<HTMLDialogElement>(null);
  const modalShowRef = useRef<HTMLDialogElement>(null);

  useImperativeHandle(ref, () => ({
    openModal: () => modalRef.current?.showModal(),
    closeModal: () => modalRef.current?.close(),
  }));

  const showImage = () => {
    modalShowRef.current?.showModal();
  };

  const closeImage = () => {
    modalShowRef.current?.close();
  };

  // const swipeDownHandlers = useSwipeDown(() => modalRef.current?.close());

  return (
    <>
      <dialog ref={modalRef} className="modal">
        <div className="modal-box max-w-[500px] p-0 relative  !bg-white">
          <div className="modal-header bg-white sticky top-0 flex justify-between z-10">
            <div className="modal-title">รูปภาพใบเสร็จ</div>
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
              {/* <ImgSlider
                id="0"
                images={imageEx.map((item) =>
                  item.replace(
                    "https://vmsplus-dev.pea.co.th",
                    "http://pntdev.ddns.net:18080"
                  )
                )}
              /> */}
              <Image
                src={
                  imageEx?.[0]?.replace(
                    "https://vmsplus-dev.pea.co.th",
                    "http://pntdev.ddns.net:18080"
                  ) || "/assets/img/sample-car.jpeg"
                }
                alt={`Image`}
                width={1000}
                height={500}
                onClick={showImage}
                className="object-contain min-h-full h-full min-w-full w-full cursor-pointer"
              />
            </div>

            <div>
              <button
                className="btn btn-secondary w-full text-base font-semibold "
                data-tip="ปิด"
                onClick={() => {
                  modalRef.current?.close();
                  backModal();
                }}
              >
                ปิด
              </button>
            </div>
          </div>
        </div>

        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
      <dialog
        ref={modalShowRef}
        className="modal open fixed inset-0 w-screen h-screen max-w-none p-0"
        onClick={closeImage}
      >
        <div className="relative w-[1000px] h-[600px]">
          <Image
            src={
              imageEx?.[0]?.replace(
                "https://vmsplus-dev.pea.co.th",
                "http://pntdev.ddns.net:18080"
              ) || "/assets/img/sample-car.jpeg"
            }
            alt="Full Preview"
            fill
            unoptimized
            className="object-contain"
          />
        </div>
      </dialog>
    </>
  );
});

ExampleFuelStringImageModal.displayName = "ExampleFuelStringImageModal";

export default ExampleFuelStringImageModal;
