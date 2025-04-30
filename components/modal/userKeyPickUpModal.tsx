import React, { forwardRef, useImperativeHandle, useRef } from "react";
import Image from "next/image";
import useSwipeDown from "@/utils/swipeDown";

const DriverInfoModal = forwardRef((_, ref) => {
  const modalRef = useRef<HTMLDialogElement>(null);

  useImperativeHandle(ref, () => ({
    openModal: () => modalRef.current?.showModal(),
    closeModal: () => modalRef.current?.close(),
  }));
  const swipeDownHandlers = useSwipeDown(() => modalRef.current?.close());

  return (
    <dialog ref={modalRef} className="modal">
      <div  className="modal-box max-w-[500px] p-0 relative modal-vehicle-pick overflow-hidden flex flex-col max-h-[90vh]">
        <div className="bottom-sheet" {...swipeDownHandlers} >
          <div className="bottom-sheet-icon"></div>
        </div>
        <div className="modal-header bg-white sticky top-0 flex justify-between z-10">
          <div className="modal-title">การรับกุญแจ</div>
          <form method="dialog">
            <button className="close btn btn-icon border-none bg-transparent shadow-none btn-tertiary">
              <i className="material-symbols-outlined">close</i>
            </button>
          </form>
        </div>
        <div className="modal-body overflow-y-auto">
          <div className="form-section" style={{ marginTop: 0 }}>
            <div className="form-card w-full">
              <div className="form-card-body">
                <div className="form-group form-plaintext form-users">
                  <Image src="/assets/img/sample-avatar.png" className="avatar avatar-md" width={100} height={100} alt="" />
                  <div className="form-plaintext-group align-self-center">
                    <div className="form-label">ศรัญยู บริรัตน์ฤทธิ์</div>
                    <div className="supporting-text-group">
                      <div className="supporting-text">505291</div>
                      <div className="supporting-text">นรค.6 กอพ.1 ฝพจ.</div>
                    </div>
                  </div>
                </div>
                <div className="form-card-right align-self-center mt-4">
                  <div className="flex flex-wrap gap-4">
                    <div className="col-span-12 md:col-span-6">
                      <div className="form-group form-plaintext">
                        <i className="material-symbols-outlined">smartphone</i>
                        <div className="form-plaintext-group">
                          <div className="form-text text-nowrap">091-234-5678</div>
                        </div>
                      </div>
                    </div>

                    <div className="col-span-12 md:col-span-6">
                      <div className="form-group form-plaintext">
                        <i className="material-symbols-outlined">call</i>
                        <div className="form-plaintext-group">
                          <div className="form-text text-nowra">6032</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-4 mt-3">
                    <div className="col-span-12">
                      <div className="form-group form-plaintext">
                        <i className="material-symbols-outlined">sms</i>
                        <div className="form-plaintext-group">
                          <div className="form-text text-nowrap">จะไปรับกุญแจช่วงบ่ายครับ</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="form-section">
            <div className="form-section-header">
              <div className="form-section-header-title">รายละเอียดการรับกุญแจ</div>
            </div>

            <div className="form-card">
              <div className="form-card-body">
                <div className="grid grid-cols-12 gap-4">
                  <div className="col-span-12">
                    <div className="form-group form-plaintext">
                      <i className="material-symbols-outlined">calendar_month</i>
                      <div className="form-plaintext-group">
                        <div className="form-label">วันที่ / เวลา</div>
                        <div className="form-text">02/12/2566 10:30</div>
                      </div>
                    </div>
                  </div>

                  <div className="col-span-12">
                    <div className="form-group form-plaintext">
                      <i className="material-symbols-outlined">approval_delegation</i>
                      <div className="form-plaintext-group">
                        <div className="form-label">สิ่งที่ส่งมอบ</div>
                        <div className="form-text">กุญแจหลัก และบัตรเติมน้ำมัน</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="modal-action sticky bottom-0 gap-3 mt-0">
          <form method="dialog">
            <button className="btn btn-secondary">ปิด</button>
          </form>
        </div>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>
  );
});

DriverInfoModal.displayName = "DriverInfoModal";

export default DriverInfoModal;
