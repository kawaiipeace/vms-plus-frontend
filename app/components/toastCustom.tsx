import React, { useState } from "react";

interface ToastCustomProps {
  title: string;
  desc: string;
  status: string;
}

export default function ToastCustom({ title, desc, status }: ToastCustomProps) {
  const [isVisible, setIsVisible] = useState(true);

  const closeToast = () => {
    setIsVisible(false);
  };

  if (!isVisible) return null; // If the toast is not visible, render nothing

  return (
    <div className="toast-container">
      <div className={`toast fade toast-${status} block`} role="alert">
        <div className="toast-body">
          <i className="material-symbols-outlined icon-settings-fill-300-24">check_circle</i>
          <div className="toast-content">
            <div className="toast-title">{title}</div>
            <div className="toast-text">{desc}</div>
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
