import React, {
  forwardRef,
  useImperativeHandle,
  useRef,
  useState,
} from "react";

const ReferenceModal = forwardRef((_, ref) => {
  const modalRef = useRef<HTMLDialogElement>(null);

  useImperativeHandle(ref, () => ({
    openModal: () => modalRef.current?.showModal(),
    closeModal: () => modalRef.current?.close(),
  }));

  const [fileName, setFileName] = useState("อัพโหลดเอกสารแนบ");

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    setFileName(file ? file.name : "อัพโหลดเอกสารแนบ");
  };

  return (
    <dialog ref={modalRef} id="my_modal_1" className="modal">
      <div className="modal-box max-w-[500px] p-0 relative modal-vehicle-pick overflow-hidden flex flex-col max-h-[90vh]">
        <div className="bottom-sheet">
          <div className="bottom-sheet-icon"></div>
        </div>
        <div className="modal-header bg-white sticky top-0 flex justify-between z-10">
          <div className="modal-title">
            เลขที่หนังสืออ้างอิง<span className="form-optional">(ถ้ามี)</span>
          </div>
          <form method="dialog">
            <button className="close btn btn-icon border-none bg-transparent shadow-none btn-tertiary">
              <i className="material-symbols-outlined">close</i>
            </button>
          </form>
        </div>
        <div className="modal-body overflow-y-auto">
          <div className="grid grid-cols-12 gap-4">
            <div className="col-span-12">
              <div className="form-group">
                <label className="form-label">
                  เลขที่หนังสืออ้างอิง
                  <span className="form-optional">(ถ้ามี)</span>
                </label>
                <div className="input-group">
                  <div className="input-group-prepend">
                    <span className="input-group-text">
                      <i className="material-symbols-outlined">docs</i>
                    </span>
                  </div>
                  <input
                    type="text"
                    className="form-control"
                    placeholder=""
                    defaultValue="การไฟฟ้าเขต ฉ.1 และ กฟฟ. ในสังกัด"
                  />
                </div>
              </div>
            </div>

            <div className="col-span-12">
              <div className="form-group">
                <label className="form-label">
                  เอกสารแนบ<span className="form-optional">(ถ้ามี)</span>
                </label>
                <div className="input-group input-uploadfile">
                  {/* <input type="file" className="file-input hidden" /> */}
                  <label className="flex items-center gap-2 cursor-pointer">
                    <div className="input-group-prepend">
                      <span className="input-group-text">
                        <i className="material-symbols-outlined">attach_file</i>
                      </span>
                    </div>
                    <input
                      type="file"
                      className="file-input hidden"
                      onChange={handleFileChange}
                    />
                    <div className="input-uploadfile-label w-full">
                      {fileName}
                    </div>
                  </label>

                  {/* <!-- <div className="input-group-append">
                          <span className="input-group-text search-ico-trailing">
                            <i className="material-symbols-outlined">close</i>
                          </span>
                        </div> --> */}
                </div>
                <span className="form-helper">
                  รองรับไฟล์ประเภท pdf เท่านั้นขนาดไม่เกิน 20 MB
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="modal-action sticky bottom-0 gap-3 mt-0">
          <form method="dialog">
            <button className="btn btn-secondary">ยกเลิก</button>
          </form>
          <form method="dialog">
            <button className="btn btn-primary">ยืนยัน</button>
          </form>
        </div>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>
  );
});

ReferenceModal.displayName = "ReferenceModal";

export default ReferenceModal;
