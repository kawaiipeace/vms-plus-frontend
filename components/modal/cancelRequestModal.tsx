import React, {
  forwardRef,
  useImperativeHandle,
  useRef,
  useState,
  useEffect,
} from "react";
import Image from "next/image";
import * as yup from "yup";
import { cancelRequest } from "@/services/bookingUser";
import { useRouter } from "next/navigation";

interface Props {
  id: string;
  title: string;
  desc: string;
  link?: string;
  confirmText: string;
  placeholder?: string;
  cancleFor?: string;
}

const CancelRequestModal = forwardRef<
  { openModal: () => void; closeModal: () => void },
  Props
>(({ id, title, desc, confirmText, placeholder, cancleFor }, ref) => {
  const modalRef = useRef<HTMLDialogElement>(null);
  const [inputValue, setInputValue] = useState("");
  const [isValid, setIsValid] = useState(false);

  const schema = yup.object().shape({
    input: yup.string().required("This field is required"),
  });

  useImperativeHandle(ref, () => ({
    openModal: () => modalRef.current?.showModal(),
    closeModal: () => modalRef.current?.close(),
  }));

  useEffect(() => {
    schema
      .validate({ input: inputValue })
      .then(() => setIsValid(true))
      .catch(() => setIsValid(false));
  }, [inputValue]);
  const router = useRouter();

  const handleConfirm = () => {
    const sendCancelRequest = async () => {
      try {
        const payload = {
          canceled_request_reason: inputValue,
          trn_request_uid: id
        };
  
        const res = await cancelRequest(payload);
        if(res){
          modalRef.current?.close();
          router.push(
            "/vehicle-booking/request-list?create-req=success&request-id=" +
              id
          );
        }
      
      } catch (error) {
        console.error("Cancel error:", error);
      }
    };
  
    sendCancelRequest();
  };

  return (
    <dialog ref={modalRef} className={`modal modal-middle`}>
      <div className="modal-box max-w-[500px] p-0 relative overflow-hidden flex flex-col !bg-white">
        <div className="bottom-sheet">
          <div className="bottom-sheet-icon"></div>
        </div>

        <div className="modal-body text-center overflow-y-auto">
          <Image
            src="/assets/img/graphic/confirm_delete.svg"
            className="w-full confirm-img"
            width={100}
            height={100}
            alt=""
          />
          <div className="confirm-title text-xl font-medium">{title}</div>
          <div className="confirm-text text-base">{desc}</div>

          {cancleFor !== "recordTravel" && (
            <div className="confirm-form mt-4">
              <div className="form-group">
                <div className="input-group">
                  <input
                    type="text"
                    className="form-control"
                    placeholder={placeholder}
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                  />
                </div>
              </div>
            </div>
          )}

          <div className="modal-footer mt-5 grid grid-cols-2 gap-3">
            <form method="dialog" className="col-span-1">
              <button className="btn btn-secondary w-full">ไม่ใช่ตอนนี้</button>
            </form>
            <button
              type="button"
              className="btn btn-primary-danger col-span-1"
              disabled={cancleFor !== "recordTravel" && !isValid}
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
  );
});

CancelRequestModal.displayName = "CancelRequestModal";

export default CancelRequestModal;
