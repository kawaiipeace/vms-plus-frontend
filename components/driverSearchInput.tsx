import { useState, useRef, useEffect } from "react";

interface SelectProps {
  options: string[];
  w: string;
  iconName?: string;
}

export default function CustomSelect({ w, options, iconName }: SelectProps) {
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
  const filteredOptions = options.filter((option) =>
    option.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div ref={dropdownRef} className={`absolute custom-select top-[45vh]`}>
      {/* Searchable Input Container */}
      <div
        className={`border ${w} max-${w} border-gray-300 rounded-lg px-2 h-[40px] flex items-center text-primary-grayText cursor-pointer focus:border-primary-default focus:shadow-customPurple ${
          isOpen ? "shadow-customPurple border-primary-default" : ""
        }`}
      >
        {/* Icon in front (if provided) */}
        {iconName && (
          <div className="mr-1">
            <span className="text-gray-500">
              <i className="material-symbols-outlined">{iconName}</i>
            </span>
          </div>
        )}

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

      {selected && (
        <div className="cover">
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
            <p className="text-lg font-semibold mt-4">รายละเอียดการเดินทาง</p>
            <div className="overflow-x-auto">
              <div className="rounded-md overflow-hidden border border-primary-grayBorder mt-3">
                <table className="table w-full">
                  <tbody>
                    <tr>
                      <th>วันที่เดินทาง</th>
                      <td className="text-right">01/01/2567 - 07/01/2567</td>
                    </tr>
                    <tr>
                    <th>สถานที่ปฏิบัติงาน</th>
                    <td className="text-right">การไฟฟ้าเขต ฉ.1 และ กฟฟ. ในสังกัด</td>
                    </tr>
                    <tr>
                    <th>เลขที่คำขอ</th>
                    <td className="text-right">VA67RA000008</td>
                    </tr>
                    <tr>
                    <th>ผู้ดูแลยานพาหนะ</th>
                    <td className="text-right">วโรดม สิงหเสนี <br></br> <sub>094-560-0817, 6832</sub> </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
