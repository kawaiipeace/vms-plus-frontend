// import { fi } from "date-fns/locale";

interface UploadFilePreviewProps {
  file_name?: string;
  file_size?: string;
  file?: File | null;
}

const UploadFilePreview = ({ file, onDeleteFile }: { file: UploadFilePreviewProps; onDeleteFile: () => void }) => {
  return (
    // <div className="card card-body p-0 mb-4">
    <div className="w-full flex rounded-2xl bg-white border-[#D0D5DD] border-[1px] p-4 items-center">
      <div className="rounded-full bg-[#F2F4F7] w-[40px] h-[40px] flex items-center justify-center">
        <i className="material-symbols-outlined text-[#667085]">draft</i>
      </div>
      <div>
        <h5 className="text-[#344054] font-semibold text-sm pl-4 break-all">{file.file_name}</h5>
      </div>
      <div className="ml-auto flex gap-2">
        <button
          type="button"
          onClick={
            file.file
              ? () => {
                  if (file.file) {
                    window.open(URL.createObjectURL(file.file), "_blank");
                  }
                }
              : undefined
          }
        >
          <i className="material-symbols-outlined text-[#344054]">download</i>
        </button>
        <button type="button" onClick={onDeleteFile}>
          <i className="material-symbols-outlined text-[#344054]">delete</i>
        </button>
      </div>
    </div>
    // </div>
  );
};

export default UploadFilePreview;
