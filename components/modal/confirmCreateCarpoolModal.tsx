import { useFormContext } from "@/contexts/carpoolFormContext";
import { postCarpoolCreate } from "@/services/carpoolManagement";
import useSwipeDown from "@/utils/swipeDown";
import Image from "next/image";
import { useRouter } from "next/navigation";
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
  desc: string;
  confirmText: string;
}

interface ToastProps {
  title: string;
  desc: string | React.ReactNode;
  status: "success" | "error" | "warning" | "info";
}

const ConfirmCreateCarpoolModal = forwardRef<
  { openModal: () => void; closeModal: () => void }, // Ref type
  Props
>(({ title, desc, confirmText }, ref) => {
  // Destructure `process` from props
  const modalRef = useRef<HTMLDialogElement>(null);
  const [toast, setToast] = useState<ToastProps | undefined>();

  const { formData, updateFormData } = useFormContext();

  useImperativeHandle(ref, () => ({
    openModal: () => modalRef.current?.showModal(),
    closeModal: () => modalRef.current?.close(),
  }));

  const router = useRouter();

  const handleConfirm = async () => {
    try {
      const response = await postCarpoolCreate({
        ...formData.form,
        carpool_admins: formData.carpool_admins,
        carpool_approvers: formData.carpool_approvers,
        carpool_vehicles: formData.carpool_vehicles,
        carpool_drivers: formData.carpool_drivers,
      });
      if (response.request.status === 201) {
        router.push("/carpool-management");
        updateFormData({});
        localStorage.removeItem("carpoolProcessOne");
        localStorage.removeItem("carpoolProcessTwo");
        localStorage.removeItem("carpoolProcessThree");
        localStorage.removeItem("carpoolProcessFour");
        modalRef.current?.close();
      }
    } catch (error: any) {
      console.error(error);
      modalRef.current?.close();
      setToast({
        title: "Error",
        desc: (
          <div>
            <div>{error.response.data.error}</div>
            <div>{error.response.data.message}</div>
          </div>
        ),
        status: "error",
      });
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
              src="/assets/img/carpool/confirm.png"
              className="w-full confirm-img"
              width={452}
              height={240}
              alt=""
            />
            <div className="confirm-title text-xl font-medium">{title}</div>
            <div className="confirm-text">{desc}</div>
            <div className="modal-footer mt-5 grid grid-cols-2 gap-3">
              <form method="dialog" className="col-span-1">
                <button className="btn btn-secondary w-full">
                  ไม่ใช่ตอนนี้
                </button>
              </form>
              <button
                type="button"
                className="btn btn-primary col-span-1"
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

ConfirmCreateCarpoolModal.displayName = "ConfirmCreateCarpoolModal";

export default ConfirmCreateCarpoolModal;
