import { RepoCardProps, VehicleManagementReportApiParams } from "@/app/types/vehicle-management/vehicle-list-type";
import { loadReportAddFuel, loadReportTripDetail } from "@/services/vehicleService";
import Image from "next/image";
import { forwardRef, useImperativeHandle, useRef, useState } from "react";
import DatePicker from "../datePicker";

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
  <div className="flex items-center justify-between bg-white border border-gray-300 rounded-lg p-4">
    <Image src={imageSrc} width={100} height={100} alt="" />
    <div className="flex flex-col gap-2">
      <span>{title}</span>
      <span>{description}</span>
      <span>{count} คัน</span>
    </div>
    <button className="material-symbols-outlined text-brand-900" onClick={onClick} aria-label="Download">
      download
    </button>
  </div>
);

const CheckboxWithLabel = ({ id, name, label }: { id: string; name: string; label: string }) => (
  <div className="flex items-center justify-between bg-white p-4">
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
  const reportRef = useRef<HTMLDialogElement>(null);
  const [params, setParams] = useState<VehicleManagementReportApiParams>({
    start_date: new Date().toISOString().split("T")[0],
    end_date: new Date().toISOString().split("T")[0],
    show_all: "0",
  });

  const [openModal, setOpenModal] = useState(false);

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
    const response = await loadReportTripDetail({
      params,
      body: selected,
    });
    console.log("Download report for Use Vehicle", response);
  };

  const _handleDownloadReportFuel = async () => {
    const response = await loadReportAddFuel({
      params,
      body: selected,
    });
    console.log("Download report for Fuel", response);
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
                        onChange={(e) => setParams({ ...params, start_date: e })}
                        defaultValue={new Date(params.start_date).toISOString().split("T")[0]}
                      />
                      <div className="input-group-append hidden" data-clear>
                        <span className="input-group-text search-ico-trailing">
                          <i className="material-symbols-outlined">close</i>
                        </span>
                      </div>
                    </div>
                    {/* <div className="input-group">
                    <i className="material-symbols-outlined">calendar_month</i>

                    <input
                      type="date"
                      className="form-control border-0"
                      value={new Date(params.start_date).toISOString().split("T")[0]}
                      onChange={(e) => setParams({ ...params, start_date: e.target.value })}
                    />
                  </div> */}
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
                        onChange={(e) => setParams({ ...params, end_date: e })}
                        defaultValue={new Date(params.end_date).toISOString().split("T")[0]}
                      />
                      <div className="input-group-append hidden" data-clear>
                        <span className="input-group-text search-ico-trailing">
                          <i className="material-symbols-outlined">close</i>
                        </span>
                      </div>
                    </div>
                    {/* <div className="input-group">
                      <i className="material-symbols-outlined">calendar_month</i>
                      <input
                        type="date"
                        className="form-control border-0"
                        value={new Date(params.end_date).toISOString().split("T")[0]}
                        onChange={(e) => setParams({ ...params, end_date: e.target.value })}
                      />
                    </div> */}
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
