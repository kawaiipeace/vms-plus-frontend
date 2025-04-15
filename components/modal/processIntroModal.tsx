"use client";
import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import Image from "next/image";

const STORAGE_KEY = "hasSeenProcessIntro";

const ProcessIntroModal = forwardRef((_, ref) => {
  const modalRef = useRef<HTMLDialogElement>(null);
  const [shouldShowModal, setShouldShowModal] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const images = [
    {
      src: "/assets/img/manage_approve_1.png",
      alt: "Image approval 1",
      title: "จัดการคำขอหลังผ่านการอนุมัติ",
      description: (
        <>
          โปรดระบุข้อมูลผู้รับกุญแจ (กรณีพนักงาน กฟภ. เป็นผู้ขับขี่) <br />
          หรือตรวจสอบข้อมูลการนัดหมายพนักงานขับรถ <br />
          ที่แท็บ “รับกุญแจ”
        </>
      ),
    },
    {
      src: "/assets/img/manage_approve_2.png",
      alt: "Image approval 2",
      title: "ขออนุมัติเดินทางไปปฏิบัติงานต่างพื้นที่",
      description: (
        <>
          คุณสามารถคัดลอกเลขที่คำขอใช้ยานพาหนะ <br />
          ไปใช้อ้างอิงในการขออนุมัติเดินทางไปปฏิบัติงานต่างพื้นที่ได้ <br />
          เพื่อความสะดวกรวดเร็วในการกรอกแบบฟอร์ม
        </>
      ),
    },
  ];

  const isLast = currentIndex === images.length - 1;

  // Check if the modal has been shown before
  useEffect(() => {
    const hasSeen = localStorage.getItem(STORAGE_KEY);
    if (!hasSeen) {
      setShouldShowModal(true);
      // Delay showing modal slightly to ensure ref is available
      setTimeout(() => {
        modalRef.current?.showModal();
      }, 0);
    }
  }, []);
  

  const openModal = () => {
    if (!localStorage.getItem(STORAGE_KEY)) {
      modalRef.current?.showModal();
    }
  };

  const closeModal = () => {
    modalRef.current?.close();
  };

  useImperativeHandle(ref, () => ({
    openModal,
    closeModal,
  }));

  const handlePrimaryClick = () => {
    if (isLast) {
      localStorage.setItem(STORAGE_KEY, "true"); // Mark as seen
      closeModal();
    } else {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handleSecondaryClick = () => {
    if (isLast) {
      setCurrentIndex((prev) => prev - 1);
    } else {
      closeModal();
    }
  };

  // Don't render modal if the user has seen it
  if (!shouldShowModal) return null;

  return (
    <dialog ref={modalRef} id="my_modal_1" className="modal">
      <div className="modal-box max-w-[500px] p-0 relative modal-vehicle-pick overflow-hidden flex flex-col max-h-[90vh]">
        <div className="bottom-sheet">
          <div className="bottom-sheet-icon"></div>
        </div>
        <div className="relative p-5">
          <div className="carousel w-full rounded-lg overflow-hidden">
            <div className="w-full overflow-hidden rounded-2xl">
              <Image
                src={images[currentIndex].src}
                alt={images[currentIndex].alt}
                width={100}
                height={100}
                className="object-cover w-full"
              />

              <div className="text-center mt-4">
                <p className="font-semibold text-xl mb-0 text-primary">
                  {images[currentIndex].title}
                </p>
                <div className="text-base text-color-secondary mt-2">
                  {images[currentIndex].description}
                </div>
              </div>
            </div>
          </div>

          <div className="indicator-daisy flex space-x-2 z-10 w-full justify-center my-4">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`btn btn-xs !rounded-full focus:outline-none border-0 !min-h-2 !min-w-2 p-0 size-2 overflow-hidden ${
                  index === currentIndex ? "active" : ""
                }`}
              ></button>
            ))}
          </div>

          <div className="flex w-full gap-3 mt-3 overflow-hidden">
            <button onClick={handleSecondaryClick} className="btn btn-secondary flex-1">
              {isLast ? "ย้อนกลับ" : "ข้าม"}
            </button>
            <button onClick={handlePrimaryClick} className="btn btn-primary flex-1">
              {isLast ? "ฉันเข้าใจ" : "ถัดไป"}
            </button>
          </div>
        </div>
      </div>
    </dialog>
  );
});

ProcessIntroModal.displayName = "ProcessIntroModal";

export default ProcessIntroModal;
