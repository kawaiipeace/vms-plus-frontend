import React, { forwardRef, useImperativeHandle, useRef } from "react";
import Image from "next/image";
import CustomSelect from "../customSelect";
import useSwipeDown from "@/utils/swipeDown";

interface Props {
  title: string;
  desc: string;
}

const PassVerifyModal = forwardRef<
  { openModal: () => void; closeModal: () => void }, // Ref type
  Props
>(({ title, desc }, ref) => {
  // Destructure `process` from props
  const modalRef = useRef<HTMLDialogElement>(null);

  useImperativeHandle(ref, () => ({
    openModal: () => modalRef.current?.showModal(),
    closeModal: () => modalRef.current?.close(),
  }));

  const driverOptions = [
    "ศรัญยู บริรัตน์ฤทธิ์ (505291)",
    "ธนพล วิจารณ์ปรีชา (514285)",
    "ญาณิศา อุ่นสิริ (543210)",
  ];
  const swipeDownHandlers = useSwipeDown(() => modalRef.current?.close());

  return (
    <>
      <dialog ref={modalRef} className={`modal modal-middle`}>
        <div  className="modal-box max-w-[500px] p-0 relative overflow-hidden flex flex-col">
          <div className="bottom-sheet" {...swipeDownHandlers} >
            <div className="bottom-sheet-icon"></div>
          </div>

          <div className="modal-body text-center overflow-y-auto">
            <Image
              src="/assets/img/graphic/confirm_verify.svg"
              className="w-full confirm-img"
              width={100}
              height={100}
              alt=""
            />
            <div className="confirm-title text-xl font-medium">{title}</div>
            <div className="confirm-text text-base">{desc}</div>
            <div className="confirm-form mt-4">
              <div className="form-group">
                <div className="grid grid-cols-12 gap-4">
                  <div className="col-span-12">
                    <div className="form-group text-left">
                         {/* <CustomSelect
                                            iconName="person"
                                            w="w-full"
                                            options={driverOptions}
                                          /> */}
                    </div>
                  </div>

                  <div className="col-span-12">
                    <div className="form-group">
                      <label className="form-label">ตำแหน่ง / สังกัด</label>
                      <div className="input-group is-readonly">
                        <div className="input-group-prepend">
                          <span className="input-group-text">
                            <i className="material-symbols-outlined">
                              business_center
                            </i>
                          </span>
                        </div>
                        <input
                          type="text"
                          className="form-control"
                          placeholder=""
                          defaultValue="นรค.6 กอพ.1 ฝพจ."
                        />
                      </div>
                    </div>
                  </div>

                  <div className="col-span-12 md:col-span-6">
                    <div className="form-group">
                      <label className="form-label">สถานที่รับกุญแจ</label>

                      <input
                        type="text"
                        className="form-control"
                        disabled={true}
                        placeholder=""
                        defaultValue="ศรัญยู บริรัตน์ฤทธิ์ (505291)"
                      />
                    </div>
                  </div>

                  <div className="col-span-12 md:col-span-6">
                    <div className="form-group">
                      <label className="form-label">วันที่นัดรับกุญแจ</label>

                      <input
                        type="text"
                        className="form-control"
                        disabled={true}
                        placeholder=""
                        defaultValue="28/02/2567"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="modal-footer mt-5 grid grid-cols-2 gap-3">
              <form method="dialog col-span-1">
                <button className="btn btn-secondary w-full">
                  ไม่ใช่ตอนนี้
                </button>
              </form>
              <button type="button" className="btn btn-primary col-span-1">
                ผ่านการตรวจสอบ
              </button>
            </div>
          </div>
        </div>

        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    </>
  );
});

PassVerifyModal.displayName = "PassVerifyModal";

export default PassVerifyModal;
