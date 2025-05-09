import React from "react";

const DocItem = () => {
  return (
    <div className="w-full flex rounded-2xl bg-white border-[#D0D5DD] border-[1px] p-4 items-center">
      <div className="rounded-full bg-[#F2F4F7] w-[40px] h-[40px] flex items-center justify-center">
        <i className="material-symbols-outlined text-[#667085]">draft</i>
      </div>
      <div>
        <h5 className="text-[#344054] font-semibold text-sm pl-4">ใบขับขี่.pdf</h5>
        <p className="text-[#667085] text-sm pl-4">200 KB</p>
      </div>
      <div className="ml-auto">
        <button>
          <i className="material-symbols-outlined text-[#344054]">download</i>
        </button>
      </div>
    </div>
  );
};

export default DocItem;
