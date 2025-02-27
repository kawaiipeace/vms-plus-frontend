import React, {
  forwardRef,
  useImperativeHandle,
  useRef,
  useState,
  useEffect,
} from "react";

const SearchDriverModal = forwardRef((_, ref) => {
  const modalRef = useRef<HTMLDialogElement>(null);

  useImperativeHandle(ref, () => ({
    openModal: () => modalRef.current?.showModal(),
    closeModal: () => modalRef.current?.close(),
  }));

  const driverOptions = [
    "ศรัญยู บริรัตน์ฤทธิ์ (505291)",
    "ธนพล วิจารณ์ปรีชา (514285)",
    "ญาณิศา อุ่นสิริ (543210)",
  ];

  const [selected, setSelected] = useState(""); // Allow empty selection
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState(""); // Live search state
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  // Filter options based on the search input
  const filteredOptions = driverOptions.filter((option) =>
    option.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <dialog ref={modalRef} className="modal">
      <div className="modal-box max-w-[500px] relative z-1 p-0 overflow-hidden flex flex-col max-h-[90vh]">
        <div className="bottom-sheet">
          <div className="bottom-sheet-icon"></div>
        </div>
        <div className="modal-header bg-white sticky top-0 flex justify-between z-10">
          <div className="modal-title">ค้นหาพนักงานขับรถนอกสังกัด</div>
          <form method="dialog">
            <button className="close btn btn-icon border-none bg-transparent shadow-none btn-tertiary">
              <i className="material-symbols-outlined">close</i>
            </button>
          </form>
        </div>
        {/* Ensure modal body takes remaining space */}
        <div className="modal-body flex-1 overflow-y-auto">
          <div className={`row form-row ${ !selected && 'p-3' }`}>
            {selected && (
              <div className="cover">
                <div className={`relative custom-select`}>
                  {/* Searchable Input Container */}
                  <div
                    className={`border w-full max-w-full border-gray-300 rounded-lg px-2 h-[40px] flex items-center text-primary-grayText cursor-pointer focus:border-primary-default focus:shadow-customPurple ${
                      isOpen ? "shadow-customPurple border-primary-default" : ""
                    }`}
                  >
                    <div className="mr-1">
                      <span className="text-gray-500">
                        <i className="material-symbols-outlined">person</i>
                      </span>
                    </div>

                    {/* Typable Input Field */}
                    <input
                      ref={inputRef}
                      type="text"
                      value={search}
                      onChange={(e) => {
                        setSearch(e.target.value);
                        setIsOpen(true); // Keep dropdown open while searching
                      }}
                      onClick={() => setIsOpen(true)} // Open dropdown when clicking input
                      placeholder="ค้นหาชื่อพนักงานขับรถ"
                      className="flex-1 outline-none bg-transparent"
                    />

                    {/* Dropdown Arrow */}
                    <div className="flex-shrink-0 w-8 text-right text-gray-500">
                      <i className="material-symbols-outlined">
                        keyboard_arrow_down
                      </i>
                    </div>
                  </div>

                  {/* Dropdown List */}
                  {isOpen && (
                    <ul className="absolute flex flex-col left-0 p-2 gap-2 z-999 mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg">
                      {filteredOptions.length > 0 ? (
                        filteredOptions.map((option) => (
                          <li
                            key={option}
                            className={`px-4 py-2 cursor-pointer flex gap-2 items-center rounded-lg ${
                              selected === option
                                ? "text-brand-900 active"
                                : "text-gray-700"
                            } hover:bg-gray-100`}
                            onClick={() => {
                              setSelected(option);
                              setSearch(option); // Set input value to selected option
                              setIsOpen(false);
                            }}
                          >
                            {option}
                            {selected === option && (
                              <span className="material-symbols-outlined">
                                check
                              </span>
                            )}
                          </li>
                        ))
                      ) : (
                        <li className="px-4 py-2 text-gray-700">
                          ไม่พบชื่อพนักงานขับรถนี้...
                        </li>
                      )}
                    </ul>
                  )}
                </div>

                <div className="mt-5 flex items-center justify-between free">
                  <div className="">
                    <div className="title text-base"> {selected}</div>
                    <div className="text-sm text-gray-500">สังกัด กอพ.1</div>
                  </div>

                  <div className="border rounded-md px-4 py-1 text-sm flex gap-2 items-center">
                    <div className="rounded-full w-[6px] h-[6px] bg-green-500"></div>
                    ว่าง
                  </div>
                </div>

                <div className="not-free">
                  <div className="mt-5 flex items-center justify-between free">
                    <div className="">
                      <div className="title text-base"> {selected}</div>
                      <div className="text-sm text-gray-500">สังกัด กอพ.1</div>
                    </div>

                    <div className="border rounded-md px-4 py-1 text-sm flex gap-2 items-center">
                      <div className="rounded-full w-[6px] h-[6px] bg-red-500"></div>
                      ไม่ว่าง
                    </div>
                  </div>
                  <p className="text-lg font-semibold mt-4">
                    รายละเอียดการเดินทาง
                  </p>
                  <div className="overflow-x-auto">
                    <div className="rounded-md overflow-hidden border border-primary-grayBorder mt-3">
                      <table className="table w-full">
                        <tbody>
                          <tr>
                            <th>วันที่เดินทาง</th>
                            <td className="text-right">
                              01/01/2567 - 07/01/2567
                            </td>
                          </tr>
                          <tr>
                            <th>สถานที่ปฏิบัติงาน</th>
                            <td className="text-right">
                              การไฟฟ้าเขต ฉ.1 และ กฟฟ. ในสังกัด
                            </td>
                          </tr>
                          <tr>
                            <th>เลขที่คำขอ</th>
                            <td className="text-right">VA67RA000008</td>
                          </tr>
                          <tr>
                            <th>ผู้ดูแลยานพาหนะ</th>
                            <td className="text-right">
                              วโรดม สิงหเสนี <br></br>{" "}
                              <sub>094-560-0817, 6832</sub>{" "}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="modal-action sticky bottom-0 gap-3 mt-0 bg-white p-3">
          <button type="button" className="btn btn-primary">
            เลือก
          </button>
        </div>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button>close</button>
      </form>

      {!selected && (
        <div className={`absolute custom-select top-[45vh]`}>
          {/* Searchable Input Container */}
          <div
            className={`border w-[470px] max-w-[470px] border-gray-300 rounded-lg px-2 h-[40px] flex items-center text-primary-grayText cursor-pointer focus:border-primary-default focus:shadow-customPurple ${
              isOpen ? "shadow-customPurple border-primary-default" : ""
            }`}
          >
            <div className="mr-1">
              <span className="text-gray-500">
                <i className="material-symbols-outlined">person</i>
              </span>
            </div>

            {/* Typable Input Field */}
            <input
              ref={inputRef}
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setIsOpen(true); // Keep dropdown open while searching
              }}
              onClick={() => setIsOpen(true)} // Open dropdown when clicking input
              placeholder="ค้นหาชื่อพนักงานขับรถ"
              className="flex-1 outline-none bg-transparent"
            />

            {/* Dropdown Arrow */}
            <div className="flex-shrink-0 w-8 text-right text-gray-500">
              <i className="material-symbols-outlined">keyboard_arrow_down</i>
            </div>
          </div>

          {/* Dropdown List */}
          {isOpen && (
            <ul className="absolute flex flex-col left-0 p-2 gap-2 z-999 mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg">
              {filteredOptions.length > 0 ? (
                filteredOptions.map((option) => (
                  <li
                    key={option}
                    className={`px-4 py-2 cursor-pointer flex gap-2 items-center rounded-lg ${
                      selected === option
                        ? "text-brand-900 active"
                        : "text-gray-700"
                    } hover:bg-gray-100`}
                    onClick={() => {
                      setSelected(option);
                      setSearch(option); // Set input value to selected option
                      setIsOpen(false);
                    }}
                  >
                    {option}
                    {selected === option && (
                      <span className="material-symbols-outlined">check</span>
                    )}
                  </li>
                ))
              ) : (
                <li className="px-4 py-2 text-gray-700">
                  ไม่พบชื่อพนักงานขับรถนี้...
                </li>
              )}
            </ul>
          )}
        </div>
      )}
    </dialog>
  );
});

SearchDriverModal.displayName = "SearchDriverModal";

export default SearchDriverModal;
