import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import Image from "next/image";
import Rating from "@/components/rating";
import useSwipeDown from "@/utils/swipeDown";

interface Props {
  displayOn?: string;
}

const ReviewCarDriveModal = forwardRef<{ openModal: () => void; closeModal: () => void }, Props>(({ displayOn }, ref) => {
  const modalRef = useRef<HTMLDialogElement>(null);
  const [reviewSubmit, setReviewSubmit] = useState(false);

  useImperativeHandle(ref, () => ({
    openModal: () => modalRef.current?.showModal(),
    closeModal: () => modalRef.current?.close(),
  }));

  useEffect(() => {
    if (displayOn === "admin") {
      setReviewSubmit(true);
    }
  }, [displayOn]);
  const swipeDownHandlers = useSwipeDown(() => modalRef.current?.close());

  return (
    <dialog ref={modalRef} className="modal">
      <div  className="modal-box max-w-[500px] p-0 relative overflow-hidden flex flex-col">
        <div className="modal-body overflow-y-auto text-center">
          <div className="grid grid-cols-1 gap-3 gap-y-4">
            <div className="flex gap-3 col-span-12">
              <div className="w-[60px] aspect-square rounded-2xl overflow-hidden">
                <Image className="aspect-square object-cover object-center" src="/assets/img/sample-driver.png" width={100} height={100} alt="" />
              </div>
              <div className="text-left">
                <p className="font-bold text-xl">ให้คะแนนการบริการของผู้ขับขี่</p>
                <p className="text-xl">ธนพล วิจารณ์ปรีชา (ปอนด์)</p>
              </div>
            </div>
            <Rating title="ขับขี่ปลอดภัย" description="ขับขี่โดยคำนึงถึงความปลอดภัยของผู้โดยสาร" icon="verified_user" />
            <Rating title="ใส่ใจให้บริการและตรงต่อเวลา" description="ให้บริการด้วยกิริยามารยาทที่ดี ตรงต่อเวลาตามที่นัดหมาย" icon="sentiment_satisfied" />
            <Rating title="แต่งกายเหมาะสม" description="แต่งกายสุภาพเรียบร้อยตามที่ผู้ว่าจ้างกำหนด" icon="apparel" />
            <Rating title="มีความชำนาญในเส้นทาง" description="มีความรู้และความชำนาญในเส้นทาง" icon="road" />
            <Rating title="ดูแลบำรุงรักษายานพาหนะ" description="ดูแลรักษาความสะอาดของยานพาหนะทั้งภายนอกและภายใน ห้องโดยสาร" icon="local_car_wash" />
            <Rating title="ปฏิบัติตามกฏจราจร" description="ปฏิบัติตามกฎระเบียบและข้อบังคับตามกฎหมาย" icon="directions" />
            {!reviewSubmit && (
              <div className="col-span-12">
                <button className="btn btn-primary w-full" onClick={() => setReviewSubmit(true)}>
                  ยืนยัน
                </button>
              </div>
            )}
            {reviewSubmit && (
              <div className="col-span-12">
                <button className="btn btn-secondary w-full" onClick={() => modalRef.current?.close()}>
                  ปิด
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>
  );
});

ReviewCarDriveModal.displayName = "ReviewCarDriveModal";

export default ReviewCarDriveModal;
