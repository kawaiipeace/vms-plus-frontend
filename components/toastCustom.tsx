import Link from "next/link";
import React, { useState } from "react";

interface ToastCustomProps {
  title: string;
  desc: React.ReactNode;
  status: string;
  styleText?: string;
  seeDetail?: string;
  seeDetailText?: string;
  isShowButton?: boolean;
}

export default function ToastCustom({
  title,
  desc,
  status,
  seeDetail,
  seeDetailText,
  styleText,
  isShowButton,
}: ToastCustomProps) {
  const [isVisible, setIsVisible] = useState(true);

  const closeToast = () => {
    setIsVisible(false);
  };

  if (!isVisible) return null; // If the toast is not visible, render nothing

  return (
    <div
      className={`toast-container  ${
        isShowButton && "!top-[85vh] left-1/2 -translate-x-1/2 !w-[100vw] !max-w-[100vw]"
      }`}
    >
      <div
        className={`toast fade toast-${status} block ${styleText} ${isShowButton && " !w-[85vw] !max-w-[85vw]"}`}
        role="alert"
      >
        <div className="toast-body max-w-[20px]">
          <i className="material-symbols-outlined icon-settings-fill-300-24">check_circle</i>
          <div className="toast-content">
            <div className="toast-title">{title}</div>
            <div className="toast-text">{desc}</div>
            <Link className="text-brand-900 font-semibold text-sm" href={seeDetail ?? "#"}>
              {seeDetailText}
            </Link>
          </div>
          <button
            type="button"
            className="close"
            onClick={closeToast} // Trigger closeToast on click
          >
            <i className="material-symbols-outlined">close</i>
          </button>
        </div>
      </div>
    </div>
  );
}
