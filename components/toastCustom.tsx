import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React, { useState } from "react";

interface ToastCustomProps {
  title: string;
  desc: React.ReactNode;
  status: string;
  styleText?: string;
  seeDetail?: string;
  seeDetailText?: string;
  searchParams?: string;
}

export default function ToastCustom({
  title,
  desc,
  status,
  seeDetail,
  seeDetailText,
  styleText,
  searchParams,
}: ToastCustomProps) {
  const router = useRouter();
  const pathName = usePathname();

  const [isVisible, setIsVisible] = useState(true);

  const closeToast = () => {
    setIsVisible(false);
    if (!searchParams) return; // If no searchParams, do nothing
    router.push(pathName + `?${searchParams}`); // Navigate to the current path to remove query parameters
  };

  if (!isVisible) return null; // If the toast is not visible, render nothing

  return (
    <div
      className={`toast-container  ${"!top-[85vh] left-1/2 -translate-x-1/2 !w-[100vw] !max-w-[100vw]  md:!left-1/4 md:!top-0 md:!translate-x-full md:!w-full md:!max-w-[calc(28vw_+_3rem)]"}`}
    >
      <div
        className={`toast fade toast-${status} block ${styleText} ${" !w-[85vw] !max-w-[85vw] md:!w-full md:!max-w-[calc(28vw_+_3rem)"}`}
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
