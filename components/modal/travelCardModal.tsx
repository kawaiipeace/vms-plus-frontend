import React, { forwardRef, useImperativeHandle, useRef } from "react";
import Image from "next/image";
import ToastCustom from "@/components/toastCustom";
import useSwipeDown from "@/utils/swipeDown";

const TravelCardModal = forwardRef<{ openModal: () => void; closeModal: () => void }>(({}, ref) => {
  const modalRef = useRef<HTMLDialogElement>(null);

  useImperativeHandle(ref, () => ({
    openModal: () => modalRef.current?.showModal(),
    closeModal: () => modalRef.current?.close(),
  }));
  const swipeDownHandlers = useSwipeDown(() => modalRef.current?.close());

  return (
    <dialog ref={modalRef} className="modal">
      <div  className="modal-box max-w-[500px] p-0 relative overflow-hidden flex flex-col">
        <div className="modal-body overflow-y-auto text-center">
          <div className="form-section">
            <div className="page-section-header border-0">
              <div className="page-header-left">
                <div className="page-title">
                  <span className="page-title-label">บัตรเดินทาง</span>
                </div>
              </div>
            </div>
            <div className="grid w-full flex-wrap gap-5 grid-cols-12">
              <div className="col-span-12">
                <div className="flex">
                  <div className="w-[60px]">
                    <Image src="/assets/img/brand.svg" className="w-full" width={100} height={100} alt="" />
                  </div>
                  <div className="ml-auto">
                    <p>24/06/67 - 27/06/67</p>
                  </div>
                </div>
              </div>
              <div className="flex justify-start col-span-12">
                <div className="text-left">
                  <p className="font-bold text-3xl">5กง1236</p>
                  <p>กรุงเทพมหานคร</p>
                </div>
              </div>
              <div className="col-span-12">
                <div className="form-section">
                  <div className="form-card">
                    <div className="form-card-body">
                      <div className="grid grid-cols-12 gap-y-3">
                        <div className="col-span-12">
                          <div className="form-group form-plaintext">
                            <i className="material-symbols-outlined">calendar_month</i>
                            <div className="form-plaintext-group">
                              <div className="form-label">สถานที่ปฏิบัติงาน</div>
                              <div className="form-text text-left">การไฟฟ้าเขต ฉ.1 และ กฟฟ. ในสังกัด กระทรวงมหาดไทย</div>
                            </div>
                          </div>
                        </div>
                        <div className="col-span-12">
                          <div className="form-group form-plaintext">
                            <i className="material-symbols-outlined">person_edit</i>
                            <div className="form-plaintext-group">
                              <div className="form-label">ผู้อนุมัติ</div>
                              <div className="form-text text-left">
                                นางสาวบังอร แสงเขียว
                                <br />
                                อก. กอพ.2
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex justify-start items-center col-span-12">
                <div className="w-[80px] rounded-full overflow-hidden">
                  <Image src="/assets/img/sample-avatar.png" className="w-full" width={100} height={100} alt="" />
                </div>
                <div className="text-left ml-3">
                  <p className="font-bold text-xl">นายสมชาย ใจดี</p>
                  <p>พนักงานขับรถ</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-x-4 overflow-hidden col-span-12">
                <button className="btn btn-default w-full" onClick={() => modalRef.current?.close()}>
                  ปิด
                </button>
                <button className="btn btn-primary w-full">บันทึก</button>
              </div>
            </div>
          </div>
          <ToastCustom title="สร้างคำขอใช้ยานพาหนะสำเร็จ" desc="" status="success" styleText="!mx-auto" />
        </div>
      </div>
    </dialog>
  );
});

TravelCardModal.displayName = "TravelCardModal";

export default TravelCardModal;
