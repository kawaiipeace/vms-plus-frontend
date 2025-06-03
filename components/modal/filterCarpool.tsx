import useSwipeDown from "@/utils/swipeDown";
import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import CustomSelect from "../customSelect";
import { getCarpoolDepartmentByType } from "@/services/carpoolManagement";
import { CarpoolParams } from "@/app/types/carpool-management-type";

interface Props {
  params: CarpoolParams;
  setParams: React.Dispatch<React.SetStateAction<CarpoolParams>>;
}

interface SelectProps {
  value: string;
  label: string | React.ReactNode;
}

const defaultSelected = {
  label: "ทั้งหมด",
  value: "ทั้งหมด",
};

const FilterCarpoolModal = forwardRef((props: Props, ref) => {
  const modalRef = useRef<HTMLDialogElement>(null);

  useImperativeHandle(ref, () => ({
    openModal: () => modalRef.current?.showModal(),
    closeModal: () => modalRef.current?.close(),
  }));

  const [options, setOptions] = useState<SelectProps[]>([]);
  const [selected, setSelected] = useState<SelectProps>(defaultSelected);
  const [status, setStatus] = useState<string[]>([]);

  useEffect(() => {
    // Set options only once when component mounts
    const fetchDepartmentFunc = async () => {
      try {
        const response = await getCarpoolDepartmentByType("0");
        const result = response.data;
        const options = result.map((item: any) => ({
          value: item.dept_sap,
          label: item.dept_short,
          subLabel: item.dept_full,
        }));
        setOptions([defaultSelected, ...options]);
      } catch (error) {
        console.error("Error fetching status data:", error);
      }
    };

    fetchDepartmentFunc();
  }, []);

  useEffect(() => {
    if (props.params.dept_sap === "") {
      setSelected(defaultSelected);
    }
    if (props.params.is_active === "") {
      setStatus([]);
    }
  }, [props.params]);

  const submitForm = () => {
    const { params, setParams } = props;
    const newParams = {
      ...params,
      dept_sap: selected.value === "ทั้งหมด" ? undefined : selected.value,
      is_active: status.join(","),
    };
    setParams(newParams);
    modalRef.current?.close();
  };

  const onChecked = (checked: boolean, value: "0" | "1" | "2") => {
    if (checked) {
      setStatus([...status, value]);
    } else {
      setStatus(status.filter((item) => item !== value));
    }
  };

  const swipeDownHandlers = useSwipeDown(() => modalRef.current?.close());

  return (
    <dialog ref={modalRef} id="my_modal_1" className="modal">
      <div className="modal-box max-w-[500px] p-0 relative rounded-none overflow-hidden flex flex-col max-h-[100vh] ml-auto mr-10 h-[100vh]">
        <div className="bottom-sheet" {...swipeDownHandlers}>
          <div className="bottom-sheet-icon"></div>
        </div>
        <div className="modal-header bg-white sticky top-0 flex justify-between z-10">
          <div className="modal-header-group flex gap-4 items-center">
            <div className="featured-ico featured-ico-gray">
              <i className="material-symbols-outlined icon-settings-400-24">
                filter_list
              </i>
            </div>
            <div className="modal-header-content">
              <div className="modal-header-top">
                <div className="modal-title">ตัวกรอง</div>
              </div>
              <div className="modal-header-bottom">
                <div className="modal-subtitle">
                  กรองข้อมูลให้แสดงเฉพาะข้อมูลที่ต้องการ
                </div>
              </div>
            </div>
          </div>
          <form method="dialog">
            <button className="close btn btn-icon border-none bg-transparent shadow-none btn-tertiary">
              <i className="material-symbols-outlined">close</i>
            </button>
          </form>
        </div>
        <div className="modal-body overflow-y-auto flex flex-col max-h-[62vh]">
          <div className="grid grid-cols-12 gap-4">
            <div className="col-span-12">
              <div className="form-group">
                <label className="form-label">หน่วยงานที่ใช้บริการ</label>
                <CustomSelect
                  w="100"
                  options={options}
                  value={selected}
                  onChange={setSelected}
                />
              </div>
            </div>

            <div className="col-span-12">
              <div className="form-group">
                <label className="form-label">สถานะ</label>
                <div className="custom-group">
                  <div className="custom-control custom-checkbox custom-control-inline">
                    <input
                      type="checkbox"
                      defaultChecked
                      checked={status.includes("1")}
                      onChange={(e) => onChecked(e.target.checked, "1")}
                      className="checkbox [--chkbg:#A80689] checkbox-sm rounded-md"
                    />
                    <label className="custom-control-label">
                      <div className="custom-control-label-group">
                        <div className="w-fit flex items-center gap-[6px] px-2 py-[3px] border border-primary-grayBorder rounded">
                          <div className="w-[6px] h-[6px] rounded-full bg-success" />
                          <span>เปิด</span>
                        </div>
                      </div>
                    </label>
                  </div>
                </div>
                <div className="custom-group">
                  <div className="custom-control custom-checkbox custom-control-inline">
                    <input
                      type="checkbox"
                      defaultChecked
                      checked={status.includes("0")}
                      onChange={(e) => onChecked(e.target.checked, "0")}
                      className="checkbox [--chkbg:#A80689] checkbox-sm rounded-md"
                    />
                    <label className="custom-control-label">
                      <div className="custom-control-label-group">
                        <div className="w-fit flex items-center gap-[6px] px-2 py-[3px] border border-primary-grayBorder rounded">
                          <div className="w-[6px] h-[6px] rounded-full bg-icon-error" />
                          <span>ปิด</span>
                        </div>
                      </div>
                    </label>
                  </div>
                </div>
                <div className="custom-group">
                  <div className="custom-control custom-checkbox custom-control-inline">
                    <input
                      type="checkbox"
                      defaultChecked
                      checked={status.includes("2")}
                      onChange={(e) => onChecked(e.target.checked, "2")}
                      className="checkbox [--chkbg:#A80689] checkbox-sm rounded-md"
                    />
                    <label className="custom-control-label">
                      <div className="custom-control-label-group">
                        <div className="w-fit flex items-center gap-[6px] px-2 py-[3px] border border-primary-grayBorder rounded">
                          <div className="w-[6px] h-[6px] rounded-full bg-[#667085]" />
                          <span>ไม่พร้อมใช้งาน</span>
                        </div>
                      </div>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="modal-action absolute bottom-0 gap-3 mt-0 w-full flex justify-between">
          <div className="left">
            <button
              className="btn btn-ghost"
              onClick={() => {
                setSelected(defaultSelected);
                setStatus([]);
              }}
            >
              <span className="text-base text-brand-900 font-bold">
                ล้างตัวกรอง
              </span>
            </button>
          </div>
          <div className="flex gap-3 items-center">
            <form method="dialog">
              <button className="btn btn-secondary">ยกเลิก</button>
            </form>
            <form method="dialog" onClick={submitForm}>
              <button className="btn btn-primary">ตกลง</button>
            </form>
          </div>
        </div>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>
  );
});

FilterCarpoolModal.displayName = "FilterCarpoolModal";

export default FilterCarpoolModal;
