import { useFormContext } from "@/contexts/carpoolFormContext";
import { deleteCarpool } from "@/services/carpoolManagement";
import useSwipeDown from "@/utils/swipeDown";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import React, {
  forwardRef,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import ToastCustom from "../toastCustom";

interface Props {
  id: string;
  title: string;
  desc: React.ReactElement | string;
  confirmText: string;
  onConfirm?: () => void;
  remove?: boolean;
}

interface ToastProps {
  title: string;
  desc: string | React.ReactNode;
  status: "success" | "error" | "warning" | "info";
}

const ConfirmCancelCreateCarpoolModal = forwardRef<
  { openModal: () => void; closeModal: () => void }, // Ref type
  Props
>(({ title, desc, confirmText, onConfirm, remove = false }, ref) => {
  // Destructure `process` from props
  const id = useSearchParams().get("id");
  const modalRef = useRef<HTMLDialogElement>(null);
  const [inputValue, setInputValue] = useState("");
  const [toast, setToast] = useState<ToastProps | undefined>();

  const { formData, updateFormData } = useFormContext();

  useImperativeHandle(ref, () => ({
    openModal: () => modalRef.current?.showModal(),
    closeModal: () => modalRef.current?.close(),
  }));

  const router = useRouter();

  const handleConfirm = async () => {
    if (onConfirm) {
      onConfirm();
    } else {
      try {
        if (remove) {
          const response = await deleteCarpool({
            carpool_name: inputValue,
            mas_carpool_uid: id || formData.mas_carpool_uid,
          });
          if (response.request.status === 200) {
          }
        } else {
          updateFormData({});
          modalRef.current?.close();
          router.push("/carpool-management");
        }
      } catch (error) {
        console.log(error);
        setToast({
          title: "ลบหน่วยงานไม่สำเร็จ",
          desc: "การลบหน่วยงานที่สามารถใช้บริการกลุ่มยานพาหนะนี้ จำเป็นต้องลบยานพาหนะ, พนักงานขับรถ, ผู้ดูแลยานพาหนะ และผู้อนุมัติที่สังกัดหน่วยงานนั้น ออกจากกลุ่มก่อน",
          status: "success",
        });
      }
    }
  };

  const swipeDownHandlers = useSwipeDown(() => modalRef.current?.close());

  return (
    <>
      <dialog ref={modalRef} className={`modal modal-middle`}>
        <div className="modal-box max-w-[500px] p-0 relative overflow-hidden flex flex-col">
          <div className="bottom-sheet" {...swipeDownHandlers}>
            <div className="bottom-sheet-icon"></div>
          </div>

          <div className="modal-body overflow-y-auto text-center">
            <Image
              src="/assets/img/carpool/bin.png"
              className="w-full confirm-img"
              width={452}
              height={240}
              alt=""
            />
            <div className="confirm-title text-xl font-medium">{title}</div>
            <div className="confirm-text">{desc}</div>
            {remove && (
              <div className="mt-6 flex flex-col items-center gap-2">
                <label className="form-label w-full !text-start">
                  พิมพ์ชื่อกลุ่มเพื่อยืนยันการลบ
                </label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="ชื่อกลุ่ม"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                />
              </div>
            )}
            <div className="modal-footer mt-5 grid grid-cols-2 gap-3">
              <form method="dialog" className="col-span-1">
                <button className="btn btn-secondary w-full">
                  ไม่ใช่ตอนนี้
                </button>
              </form>
              <button
                type="button"
                className="btn btn-primary !bg-icon-error col-span-1"
                onClick={handleConfirm}
              >
                {confirmText}
              </button>
            </div>
          </div>
        </div>

        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>

      {toast && (
        <ToastCustom
          title={toast.title}
          desc={toast.desc}
          status={toast.status}
          onClose={() => setToast(undefined)}
        />
      )}
    </>
  );
});

ConfirmCancelCreateCarpoolModal.displayName = "ConfirmCancelCreateCarpoolModal";

export default ConfirmCancelCreateCarpoolModal;
