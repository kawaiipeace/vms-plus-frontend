import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React, { useState } from "react";

interface ToastCustomProps {
  title: string;
  desc: React.ReactNode;
  status: string; // DaisyUI supports: info, success, warning, error
  styleText?: string;
  seeDetail?: string;
  seeDetailText?: string;
  searchParams?: string;
  onClose?: () => void;
}

export default function ToastCustom({
  title,
  desc,
  status,
  seeDetail,
  seeDetailText,
  styleText,
  searchParams,
  onClose,
}: ToastCustomProps) {
  const router = useRouter();
  const pathName = usePathname();

  const [isVisible, setIsVisible] = useState(true);

  const closeToast = () => {
    if (onClose) {
      onClose();
      setIsVisible(false);
    } else {
      setIsVisible(false);
      if (!searchParams) return router.push(pathName);
      router.push(pathName + `?${searchParams}`);
    }
  };

  if (!isVisible) return null;

  return (
    <div className="toast md:toast-end md:toast-top top-center top-bottom w-full md:w-auto z-[999]">
      {/* <div
        className={`alert alert-${status} ${styleText} !border-primary-grayBorder !bg-white gap-0`}
      >
        <div className="flex items-start gap-2">
          <i className="material-symbols-outlined icon-settings-fill-300-24">
            check_circle
          </i>
          <div className="toast-content">
            <div className="toast-title text-base font-bold mb-1">{title}</div>
            <div className="toast-text text-color-secondary text-sm">
              {desc}
            </div>
            <Link
              className="text-brand-900 font-semibold text-sm"
              href={seeDetail ?? "#"}
            >
              {seeDetailText}
            </Link>
          </div>
          <button
            type="button"
            className="ml-4 text-color-secondary font-semibold"
            onClick={closeToast} // Trigger closeToast on click
          >
            <i className="material-symbols-outlined !text-color-secondary">
              close_small
            </i>
          </button>
        </div>
      </div> */}
    </div>
  );
}
