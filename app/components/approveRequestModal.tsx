import Image from "next/image";
import { useState } from "react";

export default function ApproveRequestModal() {
    const [isOpen, setIsOpen] = useState(true);


    return (
      <>
        <dialog id="approveRequestModal" className={`modal modal-middle ${isOpen && 'modal-open'}`}>
          <div className="modal-box max-w-[500px] p-0 relative overflow-hidden flex flex-col">
            <div className="bottom-sheet">
              <div className="bottom-sheet-icon"></div>
            </div>
  
            <div className="modal-body overflow-y-auto text-center">
              <Image
                src="/assets/img/graphic/confirm_request.svg"
                className="w-full confirm-img"
                width={100}
                height={100}
                alt=""
              />
              <div className="confirm-title text-xl font-medium">ยืนยันยกเลิกคำขอ?</div>
              <div className="confirm-text">
                ยานพาหนะและพนักงานขับรถที่จองไว้จะถูกยกเลิก
              </div>
              <div className="modal-footer mt-4 flex gap-3 w-2/2">
						<button className="btn btn-secondary w-1/2" onClick={() => setIsOpen(false)}>ไม่ใช่ตอนนี้</button>
						<button type="button" className="btn btn-primary w-1/2">ส่งคำขอ</button>
					</div>
            </div>

          </div>
  
          <form method="dialog" className="modal-backdrop">
            <button onClick={() => setIsOpen(false)}>close</button>
          </form>
        </dialog>
  
      </>
    );
  }
  