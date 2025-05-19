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
import * as yup from "yup";
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

const formStep1Schema = yup.object().shape({
  driverLicenseType: yup.object().nullable().required("กรุณาเลือกประเภทการขับขี่"),
  year: yup.string().required("กรุณาเลือกปี"),
  licenseNumber: yup.string().required("กรุณาระบุเลขที่ใบขับขี่"),
  licenseExpiryDate: yup.string().required("กรุณาระบุวันที่สิ้นอายุ"),
  licenseImages: yup
    .array()
    .of(
      yup.object().shape({
        file_url: yup.string().required("กรุณาอัปโหลดรูปใบขับขี่"),
      })
    )
    .min(1, "กรุณาอัปโหลดรูปใบขับขี่"),
  courseName: yup.string().when("driverLicenseType", {
    is: (val: any) => val && (val.value === "2+" || val.value === "3+"),
    then: (schema) => schema.required("กรุณาระบุชื่อหลักสูตร"),
    otherwise: (schema) => schema.notRequired(),
  }),
  certificateNumber: yup.string().when("driverLicenseType", {
    is: (val: any) => val && (val.value === "2+" || val.value === "3+"),
    then: (schema) => schema.required("กรุณาระบุเลขที่ใบรับรอง"),
    otherwise: (schema) => schema.notRequired(),
  }),
  vehicleType: yup.object().nullable().when("driverLicenseType", {
    is: (val: any) => val && (val.value === "2+" || val.value === "3+"),
    then: (schema) => schema.required("กรุณาเลือกประเภทยานพาหนะ"),
    otherwise: (schema) => schema.notRequired(),
  }),
  trainingDate: yup.string().when("driverLicenseType", {
    is: (val: any) => val && (val.value === "2+" || val.value === "3+"),
    then: (schema) => schema.required("กรุณาระบุวันที่อบรม"),
    otherwise: (schema) => schema.notRequired(),
  }),
  trainingEndDate: yup.string().when("driverLicenseType", {
    is: (val: any) => val && (val.value === "2+" || val.value === "3+"),
    then: (schema) => schema.required("กรุณาระบุวันที่สิ้นอายุ"),
    otherwise: (schema) => schema.notRequired(),
  }),
  certificateImages: yup
    .array()
    .of(
      yup.object().shape({
        file_url: yup.string().required("กรุณาอัปโหลดรูปใบรับรอง"),
      })
    )
    .when("driverLicenseType", {
      is: (val: any) => val && (val.value === "2+" || val.value === "3+"),
      then: (schema) => schema.min(1, "กรุณาอัปโหลดรูปใบรับรอง"),
      otherwise: (schema) => schema.notRequired(),
    }),
});

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
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // --- DEFAULT STATE LOGIC ---
  // Cost Type
  const getDefaultCostType = (
    costTypeArr: { value: string; label: string; desc: string }[]
  ) => {
    if (licRequestDetail?.ref_driver_license_type_code) {
      return (
        costTypeArr.find(
          (type) =>
            type.value === licRequestDetail.ref_driver_license_type_code
        ) || null
      );
    }
    if (requestData?.driver_license.driver_license_type_code) {
      return (
        costTypeArr.find(
          (type) =>
            type.value === requestData.driver_license.driver_license_type_code.toString()
        ) || null
      );
    }
    return null;
  };

  // Vehicle Type
  const getDefaultVehicleType = (
    vehicleTypeArr: { value: string; label: string; desc: string }[]
  ) => {
    if (licRequestDetail?.driver_certificate_type_code) {
      return (
        vehicleTypeArr.find(
          (type) =>
            type.value === licRequestDetail.driver_certificate_type_code.toString()
        ) || null
      );
    }
    if (requestData?.driver_certificate?.driver_certificate_type_code) {
      return (
        vehicleTypeArr.find(
          (type) =>
            type.value === requestData?.driver_certificate.driver_certificate_type_code.toString()
        ) || null
      );
    }
    return null;
  };

  const getDefaultYear = () => {
    if (licRequestDetail?.annual_yyyy) {
      return licRequestDetail.annual_yyyy.toString();
    }
    if (requestData?.next_license_status !== "") {
      return (dayjs().year() + 544).toString();
    }
    if (requestData?.license_status === "มีผลปีถัดไป") {
      return (dayjs().year() + 543).toString();
    }
    return "";
  };
  
  const [year, setYear] = useState<string>(getDefaultYear());
  const [licenseNumber, setLicenseNumber] = useState<string>(
    licRequestDetail?.driver_license_no ||
      requestData?.driver_license?.driver_license_no ||
      ""
  );
  const [licenseExpiryDate, setLicenseExpiryDate] = useState<string>(
    licRequestDetail?.driver_license_expire_date ||
      requestData?.driver_license?.driver_license_expire_date ||
      ""
  );
  const [licenseImages, setLicenseImages] = useState<UploadFileType[]>(
    licRequestDetail?.driver_license_img
      ? [{ file_url: licRequestDetail.driver_license_img }]
      : requestData?.driver_license?.driver_license_img
      ? [{ file_url: requestData.driver_license?.driver_license_img }]
      : []
  );
  const [courseName, setCourseName] = useState<string>(
    licRequestDetail?.driver_certificate_name ||
      requestData?.driver_license?.driver_certificate_name ||
      ""
  );
  const [certificateNumber, setCertificateNumber] = useState<string>(
    licRequestDetail?.driver_certificate_no ||
      requestData?.driver_license?.driver_certificate_no ||
      ""
  );
  const [trainingDate, setTrainingDate] = useState<string>(
    licRequestDetail?.driver_certificate_issue_date ||
      requestData?.driver_license?.driver_certificate_issue_date ||
      ""
  );
  const [trainingEndDate, setTrainingEndDate] = useState<string>(
    licRequestDetail?.driver_certificate_expire_date ||
      requestData?.driver_license?.driver_certificate_expire_date ||
      ""
  );
  const [certificateImages, setCertificateImages] = useState<UploadFileType[]>(
    licRequestDetail?.driver_certificate_img
      ? [{ file_url: licRequestDetail.driver_certificate_img }]
      : requestData?.driver_license?.driver_certificate_img
      ? [{ file_url: requestData.driver_license?.driver_certificate_img }]
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

  // Update cost/vehicle type when options or requestData/licRequestDetail changes
  useEffect(() => {
    if (costTypeOptions.length) {
      setSelectedCostTypeOption(getDefaultCostType(costTypeOptions));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [costTypeOptions, licRequestDetail, requestData]);
  useEffect(() => {
    if (vehicleTypeOptions.length) {
      setSelectedVehicleTypeOption(getDefaultVehicleType(vehicleTypeOptions));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [vehicleTypeOptions, licRequestDetail, requestData]);

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
        }
      } catch (error) {
        console.error("Error fetching requests:", error);
      }
    };
    fetchData();
  }, [requestData, licRequestDetail]);

  const handleLicenseImageChange = (newImage: UploadFileType) => {
    setLicenseImages([newImage]);
  };

  const handleCertificateImageChange = (newImage: UploadFileType) => {
    setCertificateImages([newImage]);
  };

  const handleDeleteLicenseImage = (index: number) => {
    setLicenseImages(licenseImages.filter((_, i) => i !== index));
  };

  const handleDeleteCertificateImage = (index: number) => {
    setCertificateImages(certificateImages.filter((_, i) => i !== index));
  };

  const handleCostTypeChange = (option: any) => {
    setSelectedCostTypeOption(option);
    // reset vehicle/cert fields if changed out of range
    if (!(option && (option.value === "2+" || option.value === "3+"))) {
      setCourseName("");
      setCertificateNumber("");
      setSelectedVehicleTypeOption(null);
      setTrainingDate("");
      setTrainingEndDate("");
      setCertificateImages([]);
    }
  };

  const handleVehicleTypeChange = (option: any) => {
    setSelectedVehicleTypeOption(option);
  };

  const showAdditionalFields =
    selectedCostTypeOption &&
    (selectedCostTypeOption.value === "2+" ||
      selectedCostTypeOption.value === "3+");

  const swipeDownHandlers = useSwipeDown(() => modalRef.current?.close());

  const nextStep = async () => {

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

    try {
      await formStep1Schema.validate(formData, { abortEarly: false });
      setErrors({});
      if (stepOneSubmit) {
        stepOneSubmit(formData);
      }
      modalRef.current?.close();
    } catch (validationError: any) {
      // convert yup error to { [field]: message }
      const errObj: { [key: string]: string } = {};
      if (validationError.inner && Array.isArray(validationError.inner)) {
        validationError.inner.forEach((err: any) => {
          if (err.path && !errObj[err.path]) errObj[err.path] = err.message;
        });
      }
      setErrors(errObj);
    }
  };

  return (
    <>
      <dialog ref={modalRef} className={`modal modal-middle`}>
        <div className="modal-box max-w-[500px] p-0 relative overflow-hidden flex flex-col">
          <div className="bottom-sheet" {...swipeDownHandlers}>
            <div className="bottom-sheet-icon"></div>
          </div>
          <div className="modal-header bg-white sticky top-0 flex justify-between z-10">
            <div className="modal-title">
              ขออนุมัติทำหน้าที่ขับรถยนต์ประจำปี{" "}
              {requestData?.license_status === "มีผลปีถัดไป" && dayjs().year() + 543}{" "}
              {requestData?.next_license_status !== "" && dayjs().year() + 544}
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
                    {errors.driverLicenseType && (
                      <div className="text-error text-xs mt-1">{errors.driverLicenseType}</div>
                    )}
                  </div>
                </div>
                {(requestData?.license_status !== "มีผลปีถัดไป" && requestData?.next_license_status_code === "") &&
                  <div className="col-span-12">
                    <div className="form-group text-left">
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
                      {errors.year && (
                        <div className="text-error text-xs mt-1">{errors.year}</div>
                      )}
                    </div>
                  </div>
                }

                <div className="col-span-6">
                  <div className="form-group text-left">
                    <label className="form-label">เลขที่ใบขับขี่</label>
                    <div className="input-group">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="ระบุเลขที่ใบขับขี่"
                        value={licenseNumber}
                        onChange={(e) => setLicenseNumber(e.target.value)}
                      />
                    </div>
                    {errors.licenseNumber && (
                      <div className="text-error text-xs mt-1">{errors.licenseNumber}</div>
                    )}
                  </div>
                </div>

                <div className="col-span-6">
                  <div className="form-group text-left">
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
                    {errors.licenseExpiryDate && (
                      <div className="text-error text-xs mt-1">{errors.licenseExpiryDate}</div>
                    )}
                  </div>
                </div>

                <div className="col-span-12">
                  <div className="form-group text-left">
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
                  {errors.licenseImages && (
                    <div className="text-error text-xs mt-1">{errors.licenseImages}</div>
                  )}
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
                            onChange={(e) => setCourseName(e.target.value)}
                          />
                        </div>
                        {errors.courseName && (
                          <div className="text-error text-xs mt-1">{errors.courseName}</div>
                        )}
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
                            onChange={(e) => setCertificateNumber(e.target.value)}
                          />
                        </div>
                        {errors.certificateNumber && (
                          <div className="text-error text-xs mt-1">{errors.certificateNumber}</div>
                        )}
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
                        {errors.vehicleType && (
                          <div className="text-error text-xs mt-1">{errors.vehicleType}</div>
                        )}
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
                        {errors.trainingDate && (
                          <div className="text-error text-xs mt-1">{errors.trainingDate}</div>
                        )}
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
                        {errors.trainingEndDate && (
                          <div className="text-error text-xs mt-1">{errors.trainingEndDate}</div>
                        )}
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
                      {errors.certificateImages && (
                        <div className="text-error text-xs mt-1">{errors.certificateImages}</div>
                      )}
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