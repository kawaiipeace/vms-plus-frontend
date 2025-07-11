const DocItem = ({ documentName, documentUrl }: { documentName?: string; documentUrl?: string }) => {
  return (
    <button onClick={() => window.open(documentUrl, "download")}>
      <div className="w-full flex rounded-2xl bg-white border-[#D0D5DD] border-[1px] p-4 items-center">
        <div className="rounded-full bg-[#F2F4F7] w-[40px] h-[40px] flex items-center justify-center self-stretch">
          <i className="material-symbols-outlined text-[#667085]">draft</i>
        </div>
        <div className="w-[calc(100%_-_64px)]">
          <h5 className="text-[#344054] font-semibold text-sm pl-4 break-all text-left">{documentName}</h5>
        </div>
        <div className="ml-auto flex gap-x-2">
          <i className="material-symbols-outlined text-[#344054]">download</i>
        </div>
      </div>
    </button>
  );
};

export default DocItem;
