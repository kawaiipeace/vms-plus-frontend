import { RepoCardProps, VehicleManagementReportApiParams } from "@/app/types/vehicle-management/vehicle-list-type";
import { loadReportAddFuel, loadReportTripDetail } from "@/services/vehicleService";
import Image from "next/image";
import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import DatePicker from "../datePicker";
import dayjs from "dayjs";
import AlertCustom from "../alertCustom";

export type ReportModalRef = {
  open: () => void;
  close: () => void;
};

const ModalHeader = ({ onClose }: { onClose: () => void }) => (
  <div className="modal-header bg-white sticky top-0 flex justify-between z-10">
    <div className="modal-header-group flex gap-4 items-center">
      <div className="modal-header-content">
        <div className="modal-header-top">
          <div className="modal-title">รายงาน</div>
        </div>
      </div>
    </div>
    <button className="close btn btn-icon border-none bg-transparent shadow-none btn-tertiary" onClick={onClose}>
      <i className="material-symbols-outlined">close</i>
    </button>
  </div>
);

const ReportCard = ({ imageSrc, title, description, count, onClick }: RepoCardProps) => (
  <div className="card card-body p-4">
    <div className="w-full flex rounded-2xl items-stretch">
      <Image src={imageSrc} width={100} height={100} alt="" />
      <div className="text-left">
        <h5 className="text-[#344054] font-semibold pl-4">{title}</h5>
        <p className="text-[#667085] font-semibold text-sm pl-4">{description}</p>
        <p className="text-[#667085] text-sm pl-4">{count} คัน</p>
      </div>
      <div className="ml-auto">
        <button
          type="submit"
          className="material-symbols-outlined text-brand-900 disabled:text-gray-400"
          onClick={onClick}
          aria-label="Download">
          download
        </button>
      </div>
    </div>
  </div>
);

const CheckboxWithLabel = ({ id, name, label }: { id: string; name: string; label: string }) => (
  <div className="flex items-center gap-2">
    <input
      type="checkbox"
      className="checkbox checkbox-primary accent-brand-900 h-6 w-6 rounded-sm"
      id={id}
      name={name}
    />
    <span>{label}</span>
  </div>
);

interface ReportBodyProps {
  selected: string[];
}

const ReportModal = forwardRef<ReportModalRef, ReportBodyProps>(({ selected }, ref) => {
  const [startDate, setStartDate] = useState(() => dayjs().startOf("month"));
  const [endDate, setEndDate] = useState(() => dayjs().endOf("month"));
  const [isDateInvalid, setIsDateInvalid] = useState(false);
  const [params, setParams] = useState<VehicleManagementReportApiParams>({
    start_date: dayjs().startOf("month").format("YYYY-MM-DD"),
    end_date: dayjs().endOf("month").format("YYYY-MM-DD"),
    show_all: "0",
  });
  const [openModal, setOpenModal] = useState(false);
  const [alertMessage, setAlertMessage] = useState<string | null>(null);

  // Reference to the dialog element
  const reportRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    if (endDate.isBefore(startDate, "day")) {
      setIsDateInvalid(true);
      return;
    }

    setIsDateInvalid(false);
  }, [startDate, endDate]);

  useImperativeHandle(ref, () => ({
    open: () => {
      reportRef.current?.showModal();
      setOpenModal(true);
    },
    close: () => {
      reportRef.current?.close();
      setOpenModal(false);
    },
  }));

  const handleCloseModal = () => {
    reportRef.current?.close();
    setOpenModal(false); // Update state to reflect modal is closed
  };

  const _handleDownloadReportUseVehicle = async () => {
    if(isDateInvalid) {
      setAlertMessage("วันที่สิ้นสุดต้องไม่ก่อนวันที่เริ่มต้น");
      return;
    }

    setAlertMessage(null);
    await loadReportTripDetail({
      params,
      body: selected,
    });
  };

  const _handleDownloadReportFuel = async () => {
    if(isDateInvalid) {
      setAlertMessage("วันที่สิ้นสุดต้องไม่ก่อนวันที่เริ่มต้น");
      return;
    }

    setAlertMessage(null);
    await loadReportAddFuel({
      params,
      body: selected,
    });
  };

  return (
    <>
      {openModal && (
        <div className="modal modal-open">
          <div className="modal-box bg-white rounded-lg p-0">
            <ModalHeader onClose={handleCloseModal} />
            <div className="modal-scroll-wrapper overflow-y-auto">
              <div className="modal-body flex flex-col gap-4 p-2">
                <div className="flex gap-4">
                  {/* Date Start */}
                  <div>
                    <span className="text-base">วันที่เริ่มต้น</span>
                    <div className="input-group flatpickr">
                      <div className="input-group-prepend" data-toggle="">
                        <span className="input-group-text">
                          <i className="material-symbols-outlined">calendar_month</i>
                        </span>
                      </div>
                      <DatePicker
                        placeholder={"ระบุช่วงวันที่เริ่มเดินทาง"}
                        onChange={(date) => setStartDate(dayjs(date))}
                        defaultValue={startDate.format("YYYY-MM-DD")}
                      />
                    </div>
                  </div>

                  {/* Date End */}
                  <div>
                    <span className="text-base">วันที่สิ้นสุด</span>
                    <div className="input-group flatpickr">
                      <div className="input-group-prepend" data-toggle="">
                        <span className="input-group-text">
                          <i className="material-symbols-outlined">calendar_month</i>
                        </span>
                      </div>
                      <DatePicker
                        placeholder={"ระบุช่วงวันที่เริ่มเดินทาง"}
                        onChange={(date) => setEndDate(dayjs(date))}
                        defaultValue={endDate.format("YYYY-MM-DD")}
                      />
                    </div>
                  </div>
                </div>

                <ReportCard
                  imageSrc="/assets/img/empty/add_vehicle.svg"
                  title="รายงานการใช้ยานพาหนะ"
                  description="ดาวโหลดไฟล์ .XLSX"
                  count={selected.length}
                  onClick={_handleDownloadReportUseVehicle}
                />

                <ReportCard
                  imageSrc="/assets/img/empty/add_vehicle.svg"
                  title="รายการการเติมเชื้อเพลิง"
                  description="ดาวโหลดไฟล์ .XLSX"
                  count={selected.length}
                  onClick={_handleDownloadReportFuel}
                />

                <CheckboxWithLabel
                  id="vehicleReport"
                  name="vehicleReport"
                  label="แสดงข้อมูลยานพาหนะที่ไม่อยู่ในรายการปัจุบันด้วย (ถ้ามี)"
                />

                {alertMessage && (
                  <AlertCustom
                    title="Date Error"
                    desc={alertMessage}
                  />
                )}
              </div>
            </div>
          </div>

          <form method="dialog" className="modal-backdrop">
            <button>close</button>
          </form>
        </div>
      )}
    </>
  );
});

ReportModal.displayName = "ReportModal";
export default ReportModal;
