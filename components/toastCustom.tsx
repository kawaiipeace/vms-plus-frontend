import Link from "next/link";
import React, { useState } from "react";

interface ToastCustomProps {
  title: string;
  desc: string;
  status: string;
  styleText?: string;
  seeDetail?: string;
  seeDetailText?: string;
}

export default function ToastCustom({ title, desc, status, seeDetail, seeDetailText, styleText }: ToastCustomProps) {
  const [isVisible, setIsVisible] = useState(true);

  const closeToast = () => {
    setIsVisible(false);
  };

  if (!isVisible) return null; // If the toast is not visible, render nothing

  return (
    <div className="toast-container">
      <div className={`toast fade toast-${status} block ${styleText}`} role="alert">
        <div className="toast-body max-w-[20px]">
          <i className="material-symbols-outlined icon-settings-fill-300-24">check_circle</i>
          <div className="toast-content">
            <div className="toast-title">{title}</div>
            <div className="toast-text">{desc}</div>
            <Link className="text-brand-900 font-semibold text-sm" href={seeDetail ?? "#"}>{seeDetailText}</Link>
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
