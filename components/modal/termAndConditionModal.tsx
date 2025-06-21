import useSwipeDown from "@/utils/swipeDown";
import React, { forwardRef, useImperativeHandle, useRef } from "react";

const TermAndConditionModal = forwardRef((_, ref) => {
  const modalRef = useRef<HTMLDialogElement>(null);

  useImperativeHandle(ref, () => ({
    openModal: () => modalRef.current?.showModal(),
    closeModal: () => modalRef.current?.close(),
  }));

  const swipeDownHandlers = useSwipeDown(() => modalRef.current?.close());

  return (
    <dialog ref={modalRef} id="my_modal_1" className="modal">
      <div className="modal-box max-w-[500px] p-0 relative modal-vehicle-pick overflow-hidden flex flex-col max-h-[90vh]">
        <div className="bottom-sheet" {...swipeDownHandlers}>
          <div className="bottom-sheet-icon"></div>
        </div>
        <div className="modal-header bg-white sticky top-0 flex justify-between z-10">
          <div className="modal-title">
            เงื่อนไข หลักเกณฑ์ และระเบียบการใช้ยานพาหนะ
          </div>
          <form method="dialog">
            <button className="close btn btn-icon border-none bg-transparent shadow-none btn-tertiary">
              <i className="material-symbols-outlined">close</i>
            </button>
          </form>
        </div>
        <div className="modal-body overflow-y-auto px-6 py-4 leading-7 whitespace-pre-line">
         <div className="space-y-4 text-justify">
            <p>
              โปรดอ่านข้อตกลงการใช้งานเว็บไซต์นี้อย่างระมัดระวัง
              เนื่องจากข้อตกลงต่อไปนี้มีผลผูกพันทางกฎหมาย
              ระหว่างท่านและการไฟฟ้าส่วนภูมิภาคและใช้บังคับกับการใช้งานเว็บไซต์นี้และข้อมูลที่ระบุไว้ในเว็บไซต์นี้
            </p>

            <p>
              การยอมรับข้อตกลงการใช้งานเว็บไซต์: การใช้งานเว็บไซต์นี้ท่านรับทราบว่าท่านได้อ่านและเข้าใจข้อตกลงการใช้งานเว็บไซต์และท่านตกลงที่จะผูกพัน
              และปฏิบัติตามข้อตกลงการใช้งานเว็บไซต์นี้
              โปรดอย่าใช้งานเว็บไซต์นี้หากท่านไม่ตกลงที่จะผูกพันตามข้อตกลงการใช้งานนี้
            </p>

            <p>
              ข้อตกลงระหว่างท่านและบริษัท: เว็บไซต์ของบริษัทอาจประกอบด้วยเว็บไซต์หรือเว็บเพจต่างๆ ที่ดำเนินการโดยบริษัท
              ซึ่งมีสำนักงานใหญ่ตั้งอยู่เลขที่ 200 ถนนงามวงศ์วาน แขวงลาดยาว
              เขตจตุจักร กทม. 10900 (เว็บไซต์และเว็บเพจทั้งหมดนี้จะรวมเรียกว่า
              "เว็บไซต์ของบริษัท") การใช้งานเว็บไซต์ของบริษัทอยู่ภายใต้เงื่อนไขว่าท่านจะต้องตกลงและยอมรับข้อตกลง
              การใช้งานเว็บไซต์นี้ โดยไม่แก้ไขประการใดทั้งสิ้น
            </p>

            <p>
              การแก้ไขเปลี่ยนแปลงข้อตกลง: บริษัทขอสงวนสิทธิที่จะแก้ไขหรือเปลี่ยนแปลงข้อตกลงการใช้งานที่ระบุไว้ในเว็บไซต์นี้
              ท่านมีหน้าที่ตรวจสอบข้อตกลงการใช้งานเว็บไซต์นี้
              รวมถึงข้อกำหนดเพิ่มเติมใดๆ
              ที่ระบุไว้ในเว็บไซต์ของบริษัทอย่างสม่ำเสมอ
            </p>

            <p>
              การใช้และการเปิดเผยข้อมูลส่วนบุคคล: ท่านตกลงและยอมรับว่าข้อมูลส่วนบุคคลของท่านทั้งหมดที่บริษัทเก็บรวบรวมจากเว็บไซต์ของบริษัทอาจถูกใช้เพื่อประกอบการทำธุรกรรมและหรือการใช้บริการของท่าน
              รวมถึงเพื่อวัตถุประสงค์ในการวิเคราะห์ข้อมูล เสนอ ให้ ใช้
              และหรือปรับปรุงผลิตภัณฑ์หรือบริการต่างๆ ของบริษัท
            </p>

            <p>
              การเชื่อมต่อกับเว็บไซต์อื่นๆ: บริษัทอาจเชื่อมต่อเว็บไซต์นี้กับเว็บไซต์อื่นๆ
              ที่ไม่ได้อยู่ภายใต้การควบคุมดูแลของบริษัทเพื่อให้ข้อมูลและอำนวยความสะดวกแก่ท่านเท่านั้น
              การที่ท่านเข้าสู่เว็บไซต์เหล่านั้นย่อมเป็นความเสี่ยงของท่าน
            </p>
         
        </div>
        </div>
        <div className="modal-action sticky bottom-0 gap-3 mt-0">
          <form method="dialog">
            <button className="btn btn-primary">ปิด</button>
          </form>
        </div>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>
  );
});

TermAndConditionModal.displayName = "TermAndConditionModal";

export default TermAndConditionModal;
