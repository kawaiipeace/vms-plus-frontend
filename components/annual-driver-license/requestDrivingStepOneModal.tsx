"use client";
import DatePicker from "@/components/datePicker";
import RadioButton from "@/components/radioButton";
import {
  fetchDriverCertificateType,
  fetchDriverLicenseType,
} from "@/services/masterService";
import useSwipeDown from "@/utils/swipeDown";
import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import ImageUpload from "../imageUpload";
import { UploadFileType } from "@/app/types/upload-type";
import ImagePreview from "../imagePreview";
import CustomSelect from "../customSelect";
import dayjs from "dayjs";
import { DriverLicenseCardType } from "@/app/types/vehicle-user-type";
import { RequestAnnualDriver } from "@/app/types/driver-lic-list-type";

interface ValueFormStep1 {
  driverLicenseType: { value: string; label: string; desc?: string } | null;
  year: string;
  licenseNumber: string;
  licenseExpiryDate: string;
  licenseImages: UploadFileType[];
  courseName?: string;
  certificateNumber?: string;
  vehicleType?: { value: string; label: string; desc?: string } | null;
  trainingDate?: string;
  trainingEndDate?: string;
  certificateImages?: UploadFileType[];
}

interface ReturnCarAddModalProps {
  useBy?: string;
  id?: string;
  requestData?: DriverLicenseCardType;
  edit?: boolean;
  progress?: string;
  licRequestDetail?: RequestAnnualDriver;
  stepOneSubmit?: (data: ValueFormStep1) => void;
}

const RequestDrivingStepOneModal = forwardRef<
  { openModal: () => void; closeModal: () => void },
  ReturnCarAddModalProps
>(({ requestData, licRequestDetail, edit, stepOneSubmit }, ref) => {
  const modalRef = useRef<HTMLDialogElement>(null);
  const [costTypeOptions, setCostTypeOptions] = useState<
    { value: string; label: string; desc: string }[]
  >([]);

  const [vehicleTypeOptions, setVehicleTypeOptions] = useState<
    { value: string; label: string; desc: string }[]
  >([]);


  console.log('ttt---',licRequestDetail);
  // Initialize state with values from licRequestDetail if it exists
  const [year, setYear] = useState<string>(
    licRequestDetail?.annual_yyyy?.toString() || ""
  );
  const [licenseNumber, setLicenseNumber] = useState<string>(
    licRequestDetail?.driver_license_no || ""
  );
  const [licenseExpiryDate, setLicenseExpiryDate] = useState<string>(
    licRequestDetail?.driver_license_expire_date || ""
  );
  const [licenseImages, setLicenseImages] = useState<UploadFileType[]>(
    licRequestDetail?.driver_license_img
      ? [{ file_url: licRequestDetail.driver_license_img }]
      : []
  );
  const [courseName, setCourseName] = useState<string>(
    licRequestDetail?.driver_certificate_name || ""
  );
  const [certificateNumber, setCertificateNumber] = useState<string>(
    licRequestDetail?.driver_certificate_no || ""
  );
  const [trainingDate, setTrainingDate] = useState<string>(
    licRequestDetail?.driver_certificate_issue_date || ""
  );
  const [trainingEndDate, setTrainingEndDate] = useState<string>(
    licRequestDetail?.driver_certificate_expire_date || ""
  );
  const [certificateImages, setCertificateImages] = useState<UploadFileType[]>(
    licRequestDetail?.driver_certificate_img
      ? [{ file_url: licRequestDetail.driver_certificate_img }]
      : []
  );

  const [selectedCostTypeOption, setSelectedCostTypeOption] = useState<{
    value: string;
    label: string;
    desc?: string;
  } | null>(null);

  const [selectedVehicleTypeOption, setSelectedVehicleTypeOption] = useState<{
    value: string;
    label: string;
    desc?: string;
  } | null>(null);

  const handleLicenseImageChange = (newImage: UploadFileType) => {
    setLicenseImages([newImage]);
  };

  const handleCertificateImageChange = (newImage: UploadFileType) => {
    setCertificateImages([newImage]);
  };

  useImperativeHandle(ref, () => ({
    openModal: () => modalRef.current?.showModal(),
    closeModal: () => modalRef.current?.close(),
  }));

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetchDriverLicenseType();
        if (response.status === 200) {
          const costTypeData = response.data;
          const costTypeArr = [
            ...costTypeData.map(
              (cost: {
                ref_driver_license_type_code: string;
                ref_driver_license_type_name: string;
                ref_driver_license_type_desc: string;
              }) => ({
                value: cost.ref_driver_license_type_code,
                label: cost.ref_driver_license_type_name,
                desc: cost.ref_driver_license_type_desc,
              })
            ),
          ];
          setCostTypeOptions(costTypeArr);
          
          // Set selected cost type if licRequestDetail exists
          if (licRequestDetail?.ref_driver_license_type_code) {
            const selectedType = costTypeArr.find(
              (type) => type.value === licRequestDetail.ref_driver_license_type_code
            );
            if (selectedType) {
              setSelectedCostTypeOption(selectedType);
            }
          }
        }

        const responseVehicle = await fetchDriverCertificateType();
        if (responseVehicle.status === 200) {
          const vehicleTypeData = responseVehicle.data;
          const vehicleTypeArr = [
            ...vehicleTypeData.map(
              (vehicle: {
                ref_driver_certificate_type_code: string;
                ref_driver_certificate_type_name: string;
                ref_driver_certificate_type_desc: string;
              }) => ({
                value: vehicle.ref_driver_certificate_type_code,
                label: vehicle.ref_driver_certificate_type_name,
                desc: vehicle.ref_driver_certificate_type_desc,
              })
            ),
          ];
          setVehicleTypeOptions(vehicleTypeArr);
          
          // Set selected vehicle type if licRequestDetail exists
          if (licRequestDetail?.driver_certificate_type_code) {
            const selectedVehicle = vehicleTypeArr.find(
              (type) => type.value === licRequestDetail.driver_certificate_type_code.toString()
            );
            if (selectedVehicle) {
              setSelectedVehicleTypeOption(selectedVehicle);
            }
          }
        }
      } catch (error) {
        console.error("Error fetching requests:", error);
      }
    };
    fetchData();
  }, [requestData, licRequestDetail]);

  // Rest of your component remains the same...
  const handleDeleteLicenseImage = (index: number) => {
    setLicenseImages(licenseImages.filter((_, i) => i !== index));
  };

  const handleDeleteCertificateImage = (index: number) => {
    setCertificateImages(certificateImages.filter((_, i) => i !== index));
  };

  const swipeDownHandlers = useSwipeDown(() => modalRef.current?.close());

  const nextStep = () => {
    const formData: ValueFormStep1 = {
      driverLicenseType: selectedCostTypeOption,
      year: year,
      licenseNumber: licenseNumber,
      licenseExpiryDate: licenseExpiryDate,
      licenseImages: licenseImages,
      ...(showAdditionalFields && {
        courseName: courseName,
        certificateNumber: certificateNumber,
        vehicleType: selectedVehicleTypeOption,
        trainingDate: trainingDate,
        trainingEndDate: trainingEndDate,
        certificateImages: certificateImages,
      }),
    };

    if (stepOneSubmit) {
      stepOneSubmit(formData);
    }
    modalRef.current?.close();
  };

  const handleCostTypeChange = (option: any) => {
    setSelectedCostTypeOption(option);
  };

  const handleVehicleTypeChange = (option: any) => {
    setSelectedVehicleTypeOption(option);
  };

  const showAdditionalFields =
    selectedCostTypeOption &&
    (selectedCostTypeOption.value === "2+" ||
      selectedCostTypeOption.value === "3+");

  return (
    <>
      <dialog ref={modalRef} className={`modal modal-middle`}>
        <div className="modal-box max-w-[500px] p-0 relative overflow-hidden flex flex-col">
          <div className="bottom-sheet" {...swipeDownHandlers}>
            <div className="bottom-sheet-icon"></div>
          </div>
          <div className="modal-header bg-white sticky top-0 flex justify-between z-10">
            <div className="modal-title">
              ขออนุมัติทำหน้าที่ขับรถยนต์ประจำปี
            </div>
            <form method="dialog">
              <button
                className="close btn btn-icon border-none bg-transparent shadow-none btn-tertiary"
                onClick={() => modalRef.current?.close()}
              >
                <i className="material-symbols-outlined">close</i>
              </button>
            </form>
          </div>
          <div className="modal-body overflow-y-auto text-center !bg-white">
            {!edit && (
              <p className="text-left text-base mb-2 font-semibold">
                Step 1: ข้อมูลทั่วไป
              </p>
            )}

            <div className="form-section">
              <div className="grid w-full flex-wrap gap-5 grid-cols-12">
                <div className="col-span-12">
                  <div className="form-group text-left">
                    <label className="form-label">ประเภทการขับขี่</label>
                    <CustomSelect
                      w="w-full"
                      options={costTypeOptions}
                      value={selectedCostTypeOption}
                      onChange={handleCostTypeChange}
                      showDescriptions={true}
                    />
                  </div>
                </div>

                <div className="col-span-12">
                  <div className="form-group">
                    <label className="form-label">ประจำปี</label>
                    <div className="w-full flex gap-5">
                      <RadioButton
                        name="year"
                        label={`${dayjs().year() + 543}`}
                        value={`${dayjs().year() + 543}`}
                        selectedValue={year}
                        setSelectedValue={setYear}
                      />
                      <RadioButton
                        name="year"
                        label={`${dayjs().year() + 544}`}
                        value={`${dayjs().year() + 544}`}
                        selectedValue={year}
                        setSelectedValue={setYear}
                      />
                    </div>
                  </div>
                </div>

                <div className="col-span-6">
                  <div className="form-group">
                    <label className="form-label">เลขที่ใบขับขี่</label>
                    <div className="input-group">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="ระบุเลขที่ใบขับขี่"
                        value={licenseNumber}
                        onChange={(e) => {
                          setLicenseNumber(e.target.value);
                        }}
                      />
                    </div>
                  </div>
                </div>

                <div className="col-span-6">
                  <div className="form-group">
                    <label className="form-label">วันที่สิ้นอายุ</label>
                    <div className="input-group">
                      <div className="input-group-prepend">
                        <span className="input-group-text">
                          <i className="material-symbols-outlined">
                            calendar_month
                          </i>
                        </span>
                      </div>
                      <DatePicker
                        placeholder={"ระบุวันที่"}
                        onChange={(date) => setLicenseExpiryDate(date)}
                        defaultValue={licenseExpiryDate}
                      />
                    </div>
                  </div>
                </div>

                <div className="col-span-12">
                  <div className="form-group">
                    <label className="form-label">รูปใบขับขี่</label>
                    {licenseImages.length < 1 && (
                      <ImageUpload onImageChange={handleLicenseImageChange} />
                    )}
                  </div>
                  <div className="image-preview flex flex-wrap gap-3 !w-[50%]">
                    {licenseImages.map((image, index) => (
                      <ImagePreview
                        key={index}
                        image={image.file_url}
                        onDelete={() => handleDeleteLicenseImage(index)}
                      />
                    ))}
                  </div>
                </div>

                {showAdditionalFields && (
                  <>
                    <div className="col-span-12">
                      <div className="form-group">
                        <label className="form-label">ชื่อหลักสูตร</label>
                        <div className="input-group">
                          <div className="input-group-prepend">
                            <span className="input-group-text">
                              <i className="material-symbols-outlined">
                                developer_guide
                              </i>
                            </span>
                          </div>
                          <input
                            type="text"
                            className="form-control"
                            placeholder="ระบุชื่อหลักสูตร"
                            value={courseName}
                            onChange={(e) => {
                              setCourseName(e.target.value);
                            }}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="col-span-6">
                      <div className="form-group">
                        <label className="form-label">เลขที่ใบรับรอง</label>
                        <div className="input-group">
                          <div className="input-group-prepend">
                            <span className="input-group-text">
                              <i className="material-symbols-outlined">news</i>
                            </span>
                          </div>
                          <input
                            type="text"
                            className="form-control"
                            placeholder="ระบุเลขที่ใบรับรอง"
                            value={certificateNumber}
                            onChange={(e) => {
                              setCertificateNumber(e.target.value);
                            }}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="col-span-6">
                      <div className="form-group text-left">
                        <label className="form-label">ประเภทยานพาหนะ</label>
                        <CustomSelect
                          w="w-full"
                          options={vehicleTypeOptions}
                          value={selectedVehicleTypeOption}
                          onChange={handleVehicleTypeChange}
                          iconName="front_loader"
                        />
                      </div>
                    </div>

                    <div className="col-span-6">
                      <div className="form-group">
                        <label className="form-label">วันที่อบรม</label>
                        <div className="input-group">
                          <div className="input-group-prepend">
                            <span className="input-group-text">
                              <i className="material-symbols-outlined">
                                calendar_month
                              </i>
                            </span>
                          </div>
                          <DatePicker
                            placeholder={"ระบุวันที่"}
                            onChange={(date) => setTrainingDate(date)}
                            defaultValue={trainingDate}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="col-span-6">
                      <div className="form-group">
                        <label className="form-label">วันที่สิ้นอายุ</label>
                        <div className="input-group">
                          <div className="input-group-prepend">
                            <span className="input-group-text">
                              <i className="material-symbols-outlined">
                                calendar_month
                              </i>
                            </span>
                          </div>
                          <DatePicker
                            placeholder={"ระบุวันที่"}
                            onChange={(date) => setTrainingEndDate(date)}
                            defaultValue={trainingEndDate}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="col-span-12">
                      <div className="form-group">
                        <label className="form-label">รูปใบรับรอง</label>
                        {certificateImages.length < 1 && (
                          <ImageUpload
                            onImageChange={handleCertificateImageChange}
                          />
                        )}
                      </div>
                      <div className="image-preview flex flex-wrap gap-3 !w-[50%]">
                        {certificateImages.map((image, index) => (
                          <ImagePreview
                            key={index}
                            image={image.file_url}
                            onDelete={() => handleDeleteCertificateImage(index)}
                          />
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
          <div className="modal-action flex w-full gap-5 mt-3 mr-auto">
            <div className="">
              <button
                type="button"
                className="btn btn-secondary w-full"
                onClick={() => {
                  modalRef.current?.close();
                }}
              >
                ไม่ใช่ตอนนี้
              </button>
            </div>
            <div className="">
              <button
                type="button"
                className="btn bg-[#A80689] hover:bg-[#A80689] border-[#A80689] text-white w-full"
                onClick={nextStep}
              >
                ต่อไป
              </button>
            </div>
          </div>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    </>
  );
});

RequestDrivingStepOneModal.displayName = "RequestDrivingStepOneModal";

export default RequestDrivingStepOneModal;