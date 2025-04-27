import { VehicleUserType } from "@/app/types/vehicle-user-type";
import { useEffect, useRef, useState } from "react";

interface SelectProps {
  options: VehicleUserType[];
  data: VehicleUserType[];
  w: string;
  iconName?: string;
  value: VehicleUserType | null;
  onChange: (selected: VehicleUserType) => void;
}

export default function CustomSelectKeyPickup({ w, options, iconName, value, onChange, data }: SelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLDivElement>(null);

  const [searchOption, setSearchOption] = useState(options);
  const [searchTerm, setSearchTerm] = useState<string>("");

  useEffect(() => {
    setSearchOption(options);
  }, [options]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
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

  const onSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const term = event.target.value.toLowerCase();
    setSearchTerm(event.target.value); // อัพเดตข้อความใน input

    const filtered = options.filter(
      (option) =>
        option.full_name.toLowerCase().includes(term) ||
        option.dept_sap?.toLowerCase().includes(term) ||
        option.dept_sap_short?.toLowerCase().includes(term)
    );
    setSearchOption(filtered); // อัพเดต list ตัวเลือกที่แสดง
  };

  return (
    <div ref={dropdownRef} className={`relative custom-select`}>
      {/* Button that shows selected option */}

      <div
        className={`input-group  border ${w} max-${w} border-gray-300 rounded-lg px-2 h-[40px] flex items-center text-primary-grayText cursor-pointer focus:border-primary-default focus:shadow-customPurple ${
          isOpen ? "shadow-customPurple border-primary-default" : ""
        } overflow-hidden`}
        onClick={() => setIsOpen(!isOpen)}
        ref={buttonRef}
        tabIndex={0}
      >
        <div className="input-group-prepend">
          <span className="input-group-text">
            <i className="material-symbols-outlined"> {iconName} </i>
          </span>
        </div>
        <input
          type="text"
          className="form-control"
          value={searchTerm || value?.full_name || ""}
          onChange={onSearch}
          placeholder="กรุณาเลือก"
        />
        <div className="flex-shrink-0 w-8 text-right">
          <i className="material-symbols-outlined">keyboard_arrow_down</i>
        </div>
      </div>

      {/* Dropdown List */}
      {isOpen && (
        <ul className="max-h-[16rem] overflow-y-auto absolute flex flex-col left-0 p-2 gap-2 z-10 mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg">
          {searchOption.length > 0 ? (
            searchOption.map((option) => (
              <li
                key={option.emp_id}
                className={`px-4 py-2 cursor-pointer flex gap-2 items-center rounded-lg justify-between ${
                  value?.emp_id === option.emp_id ? "text-brand-900 active" : "text-gray-700"
                } hover:bg-gray-100`}
                onClick={() => {
                  onChange(option);
                  setIsOpen(false);
                  buttonRef.current?.focus(); // Keep focus on the div
                }}
              >
                <div className="">
                  {option.full_name}
                  <div className="supporting-text-group">
                    <div className="supporting-text">{option.dept_sap}</div>
                    <div className="supporting-text"> {option.dept_sap_short}</div>
                  </div>
                </div>
                {value?.emp_id === option.emp_id && <span className="material-symbols-outlined">check</span>}
              </li>
            ))
          ) : (
            <li className="px-4 py-2 text-gray-500">ไม่พบข้อมูล</li>
          )}
        </ul>
      )}
    </div>
  );
}
