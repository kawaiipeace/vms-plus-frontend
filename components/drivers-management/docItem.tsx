const DocItem = ({ documentName, documentUrl }: { documentName?: string; documentUrl?: string }) => {
  return (
    <div className="w-full flex rounded-2xl bg-white border-[#D0D5DD] border-[1px] p-4 items-center">
      <div className="rounded-full bg-[#F2F4F7] w-[40px] h-[40px] flex items-center justify-center">
        <i className="material-symbols-outlined text-[#667085]">draft</i>
      </div>
      <div>
        <h5 className="text-[#344054] font-semibold text-sm pl-4">{documentName}</h5>
      </div>
      <div className="ml-auto flex gap-x-2">
        <button onClick={() => window.open(documentUrl, "download")}>
          <i className="material-symbols-outlined text-[#344054]">download</i>
        </button>
      </div>
    </div>
  );
};

export default DocItem;
