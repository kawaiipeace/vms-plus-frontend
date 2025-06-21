"use client";
import { RequestAnnualDriver } from "@/app/types/driver-lic-list-type";
import { UploadFileType } from "@/app/types/upload-type";
import { DriverLicenseCardType } from "@/app/types/vehicle-user-type";
import DatePicker from "@/components/datePicker";
import RadioButton from "@/components/radioButton";
import {
  fetchDriverCertificateType,
  fetchDriverLicenseType,
} from "@/services/masterService";
import { convertToBuddhistDateTime } from "@/utils/converToBuddhistDateTime";
import useSwipeDown from "@/utils/swipeDown";
import { yupResolver } from "@hookform/resolvers/yup";
import dayjs from "dayjs";
import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { Controller, useForm } from "react-hook-form";
import * as yup from "yup";
import CustomSelect from "../customSelect";
import ImagePreview from "../imagePreview";
import ImageUpload from "../imageUpload";
import { convertToISO } from "@/utils/convertToISO";

export interface ValueFormStep1 {
  driverLicenseType: any;
  year: string;
  licenseNumber: string;
  licenseExpiryDate: string;
  licenseImages: any;
  courseName: string;
  certificateNumber: string;
  vehicleType: any;
  trainingDate: string;
  trainingEndDate: string;
  certificateImages: any;
}
interface ReturnCarAddModalProps {
  useBy?: string;
  id?: string;
  profile?: string;
  requestData?: DriverLicenseCardType;
  edit?: boolean;
  progress?: string;
  licRequestDetail?: RequestAnnualDriver;
  stepOneSubmit?: (data: ValueFormStep1) => void;
  onBack?: () => void;
}

const formStep1Schema = yup.object().shape({
  driverLicenseType: yup
    .object()
    .nullable()
    .required("กรุณาเลือกประเภทการขับขี่")
    .default(null),
  year: yup.string().required("กรุณาเลือกปี"),
  licenseNumber: yup
    .string()
    .required("กรุณาระบุเลขที่ใบขับขี่")
    .length(8, "กรุณาระบุเลขที่ใบขับขี่ 8 หลัก")
    .matches(/^\d{8}$/, "กรุณาระบุเลขที่ใบขับขี่ 8 หลัก (ตัวเลขเท่านั้น)")
    .min(8, "กรุณาระบุเลขที่ใบขับขี่ 8 หลัก")
    .max(8, "กรุณาระบุเลขที่ใบขับขี่ 8 หลัก")
    .default(""),
  licenseExpiryDate: yup
    .string()
    .required("กรุณาระบุวันที่สิ้นอายุ")
    .default(""),
  licenseImages: yup
    .array()
    .of(
      yup.object().shape({
        file_url: yup.string().required("กรุณาอัปโหลดรูปใบขับขี่"),
      })
    )
    .min(1, "กรุณาอัปโหลดรูปใบขับขี่")
    .default([]),
  courseName: yup
    .string()
    .when("driverLicenseType", {
      is: (val: any) => val && (val.value === "2+" || val.value === "3+"),
      then: (schema) => schema.required("กรุณาระบุชื่อหลักสูตร"),
      otherwise: (schema) => schema.notRequired(),
    })
    .default(""),
  certificateNumber: yup
    .string()
    .when("driverLicenseType", {
      is: (val: any) => val && (val.value === "2+" || val.value === "3+"),
      then: (schema) => schema.required("กรุณาระบุเลขที่ใบรับรอง"),
      otherwise: (schema) => schema.notRequired(),
    })
    .default(""),
  vehicleType: yup
    .object()
    .nullable()
    .when("driverLicenseType", {
      is: (val: any) => val && (val.value === "2+" || val.value === "3+"),
      then: (schema) => schema.required("กรุณาเลือกประเภทยานพาหนะ"),
      otherwise: (schema) => schema.notRequired(),
    })
    .default(null),
  trainingDate: yup
    .string()
    .when("driverLicenseType", {
      is: (val: any) => val && (val.value === "2+" || val.value === "3+"),
      then: (schema) => schema.required("กรุณาระบุวันที่อบรม"),
      otherwise: (schema) => schema.notRequired(),
    })
    .default(""),
  trainingEndDate: yup
    .string()
    .when("driverLicenseType", {
      is: (val: any) => val && (val.value === "2+" || val.value === "3+"),
      then: (schema) => schema.required("กรุณาระบุวันที่สิ้นอายุ"),
      otherwise: (schema) => schema.notRequired(),
    })
    .default(""),
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
    })
    .default([]),
});

const RequestDrivingStepOneModal = forwardRef<
  { openModal: () => void; closeModal: () => void },
  ReturnCarAddModalProps
>(({ requestData, licRequestDetail, edit, stepOneSubmit, onBack }, ref) => {
  const modalRef = useRef<HTMLDialogElement>(null);
  const [costTypeOptions, setCostTypeOptions] = useState<
    { value: string; label: string; desc: string }[]
  >([]);
  const [vehicleTypeOptions, setVehicleTypeOptions] = useState<
    { value: string; label: string; desc: string }[]
  >([]);

  // --- DEFAULT STATE LOGIC ---
  // Cost Type
  const getDefaultCostType = (
    costTypeArr: { value: string; label: string; desc: string }[]
  ) => {
    if (licRequestDetail?.ref_driver_license_type_code) {
      return (
        costTypeArr.find(
          (type) => type.value === licRequestDetail.ref_driver_license_type_code
        ) || null
      );
    }
    if (requestData?.driver_license.driver_license_type_code) {
      return (
        costTypeArr.find(
          (type) =>
            type.value ===
            requestData.driver_license.driver_license_type_code.toString()
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
            String(type.value) ===
            licRequestDetail.driver_certificate_type_code.toString()
        ) || null
      );
    }

    return null;
  };

  // Build default values object for react-hook-form
  const buildDefaultValues = () => ({
    driverLicenseType: getDefaultCostType(costTypeOptions),
    year:
      requestData?.license_status === "อนุมัติแล้ว" &&
      requestData?.next_license_status_code === "00"
        ? (dayjs().year() + 544).toString()
        : (dayjs().year() + 543).toString(),
    licenseNumber: licRequestDetail ? licRequestDetail?.driver_license_no : "",
    // licenseExpiryDate: licRequestDetail
    //   ? convertToThaiDate(licRequestDetail?.driver_license_expire_date)
    //   : "",
    licenseExpiryDate:
      licRequestDetail ?
        convertToBuddhistDateTime(
          licRequestDetail?.driver_license_expire_date || ""
        ).date : "",
    licenseImages: licRequestDetail?.driver_license_img
      ? [{ file_url: licRequestDetail.driver_license_img }]
      : requestData?.driver_license?.driver_license_img
      ? [{ file_url: requestData.driver_license?.driver_license_img }]
      : [],
    courseName:
      licRequestDetail?.driver_certificate_name ||
      requestData?.driver_license?.driver_certificate_name ||
      "",
    certificateNumber:
      licRequestDetail?.driver_certificate_no ||
      requestData?.driver_license?.driver_certificate_no ||
      "",
    vehicleType: getDefaultVehicleType(vehicleTypeOptions),
    trainingDate:
      licRequestDetail?.driver_certificate_issue_date ||
      requestData?.driver_license?.driver_certificate_issue_date ||
      "",
    trainingEndDate:
      licRequestDetail?.driver_certificate_expire_date ||
      requestData?.driver_license?.driver_certificate_expire_date ||
      "",
    certificateImages: licRequestDetail?.driver_certificate_img
      ? [{ file_url: licRequestDetail.driver_certificate_img }]
      : requestData?.driver_license?.driver_certificate_img
      ? [{ file_url: requestData.driver_license?.driver_certificate_img }]
      : [],
  });
  const [defaultValues, setDefaultValues] = useState<ValueFormStep1>(
    buildDefaultValues()
  );

  // react-hook-form
  const {
    handleSubmit,
    reset,
    control,
    watch,
    setValue,
    formState: { errors, isValid },
  } = useForm<ValueFormStep1>({
    mode: "onChange",
    resolver: yupResolver(formStep1Schema),
    defaultValues,
  });

  // Watch for select field for conditional rendering
  const selectedCostTypeOption = watch("driverLicenseType");
  const showAdditionalFields =
    selectedCostTypeOption &&
    (selectedCostTypeOption.value === "2+" ||
      selectedCostTypeOption.value === "3+");

  useEffect(() => {
    setDefaultValues(buildDefaultValues());

    reset(buildDefaultValues());
  }, [
    JSON.stringify(costTypeOptions),
    JSON.stringify(vehicleTypeOptions),
    requestData,
    licRequestDetail,
  ]);

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
  }, [requestData]);

  const [openModal, setOpenModal] = useState(false);

  useImperativeHandle(ref, () => ({
    openModal: () => {
      modalRef.current?.showModal();
      setOpenModal(true);
    },
    closeModal: () => {
      modalRef.current?.close();
      setOpenModal(false);
    },
  }));

  const handleCloseModal = () => {
    modalRef.current?.close();
    setOpenModal(false); // Update state to reflect modal is closed
  };

  // Handler for ImageUpload components
  const handleLicenseImageChange = (newImage: UploadFileType) => {
    setValue("licenseImages", [newImage]);
  };
  const handleCertificateImageChange = (newImage: UploadFileType) => {
    setValue("certificateImages", [newImage]);
  };
  const handleDeleteLicenseImage = (index: number) => {
    const imgs = watch("licenseImages");
    setValue(
      "licenseImages",
      imgs.filter((_: any, i: number) => i !== index)
    );
  };
  const handleDeleteCertificateImage = (index: number) => {
    const imgs = watch("certificateImages");
    setValue(
      "certificateImages",
      imgs.filter((_: any, i: number) => i !== index)
    );
  };

  // Handler for CostType change (reset conditional fields)
  const handleCostTypeChange = (option: any, onChange: (v: any) => void) => {
    onChange(option);
    if (!(option && (option.value === "2+" || option.value === "3+"))) {
      setValue("courseName", "");
      setValue("certificateNumber", "");
      setValue("vehicleType", null);
      setValue("trainingDate", "");
      setValue("trainingEndDate", "");
      setValue("certificateImages", []);
    }
  };

  const swipeDownHandlers = useSwipeDown(handleCloseModal);
  const currentBuddhistYear = dayjs().year() + 543;
const onSubmit = (formData: ValueFormStep1) => {
  // Convert date fields to ISO string using your utility
  const licenseExpiryDateISO = formData.licenseExpiryDate
    ? convertToISO(formData.licenseExpiryDate,"00:00")
    : "";
  const trainingDateISO = formData.trainingDate
    ? convertToISO(formData.trainingDate,"00:00")
    : "";
  const trainingEndDateISO = formData.trainingEndDate
    ? convertToISO(formData.trainingEndDate,"00:00")
    : "";

  const submitData = {
    ...formData,
    licenseExpiryDate: licenseExpiryDateISO,
    trainingDate: trainingDateISO,
    trainingEndDate: trainingEndDateISO,
  };

  if (stepOneSubmit) {
    stepOneSubmit(submitData);
  }
  handleCloseModal();
};

  return (
    <>
      {openModal && (
        <div className={`modal modal-open modal-middle`}>
          <div className="modal-box max-w-[600px] p-0 relative overflow-hidden flex flex-col">
            <div className="bottom-sheet" {...swipeDownHandlers}>
              <div className="bottom-sheet-icon"></div>
            </div>
            <div className="modal-header bg-white sticky top-0 flex justify-between z-10">
              <div className="modal-title items-center flex">
                {onBack && (
                  <i
                    className="material-symbols-outlined cursor-pointer"
                    onClick={() => {
                      onBack();
                    }}
                  >
                    keyboard_arrow_left
                  </i>
                )}
                ขออนุมัติทำหน้าที่ขับรถยนต์ประจำปี
                {requestData?.license_status === "อนุมัติแล้ว" &&
                  requestData &&
                  requestData.next_annual_yyyy !== currentBuddhistYear &&
                  requestData.next_annual_yyyy !== 0 && (
                    <div className="ml-1">
                      {" " + requestData.next_annual_yyyy}
                    </div>
                  )}
                {requestData &&
                  requestData.annual_yyyy !== currentBuddhistYear &&
                  requestData.annual_yyyy !== 0 && (
                    <div className="ml-1">{" " + requestData.annual_yyyy}</div>
                  )}
              </div>
              <form method="dialog">
                <button
                  className="close btn btn-icon border-none bg-transparent shadow-none btn-tertiary"
                  onClick={handleCloseModal}
                >
                  <i className="material-symbols-outlined">close</i>
                </button>
              </form>
            </div>
            <div className="modal-scroll-wrapper overflow-y-auto">
              <form
                className="modal-body text-center"
                onSubmit={handleSubmit(onSubmit)}
              >
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
                        <Controller
                          name="driverLicenseType"
                          control={control}
                          render={({ field }) => (
                            <CustomSelect
                              w="w-full"
                              options={costTypeOptions}
                              value={field.value}
                              onChange={(option) =>
                                handleCostTypeChange(option, field.onChange)
                              }
                              showDescriptions={true}
                            />
                          )}
                        />
                      </div>
                    </div>
                    {requestData?.trn_request_annual_driver_uid === "" && (
                      <div className="col-span-12">
                        <div className="form-group text-left">
                          <label className="form-label">ประจำปี</label>
                          <div className="w-full flex gap-5">
                            <Controller
                              name="year"
                              control={control}
                              render={({ field }) => (
                                <>
                                  <RadioButton
                                    name="year"
                                    label={`${dayjs().year() + 543}`}
                                    value={`${dayjs().year() + 543}`}
                                    selectedValue={field.value}
                                    setSelectedValue={field.onChange}
                                  />
                                  <RadioButton
                                    name="year"
                                    label={`${dayjs().year() + 544}`}
                                    value={`${dayjs().year() + 544}`}
                                    selectedValue={field.value}
                                    setSelectedValue={field.onChange}
                                  />
                                </>
                              )}
                            />
                          </div>
                          {errors.year && (
                            <div className="text-error text-xs mt-1">
                              {errors.year.message}
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    <div className="col-span-6">
                      <div className="form-group text-left">
                        <label className="form-label">เลขที่ใบขับขี่</label>
                        <div className="input-group">
                          <Controller
                            name="licenseNumber"
                            control={control}
                            render={({ field }) => (
                              <input
                                {...field}
                                type="text" // must be text to use maxLength
                                className="form-control"
                                placeholder="ระบุเลขที่ใบขับขี่"
                                maxLength={8}
                                inputMode="numeric"
                                pattern="\d*"
                                onChange={(e) => {
                                  const val = e.target.value
                                    .replace(/\D/g, "")
                                    .slice(0, 8); // remove non-digits and limit to 8
                                  field.onChange(val);
                                }}
                                value={field.value}
                              />
                            )}
                          />
                        </div>
                        {errors.licenseNumber && (
                          <div className="text-error text-xs mt-1">
                            {errors.licenseNumber.message}
                          </div>
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
                          <Controller
                            name="licenseExpiryDate"
                            control={control}
                            render={({ field }) => (
                              <DatePicker
                                placeholder={"ระบุวันที่"}
                                onChange={field.onChange}
                                defaultValue={convertToBuddhistDateTime(field.value || "").date}
                              />
                            )}
                          />
                        </div>
                        {errors.licenseExpiryDate && (
                          <div className="text-error text-xs mt-1">
                            {errors.licenseExpiryDate.message}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="col-span-12">
                      <div className="form-group text-left">
                        <label className="form-label">รูปใบขับขี่</label>
                        <Controller
                          name="licenseImages"
                          control={control}
                          render={({ field }) => {
                            return field.value?.length < 1 ? (
                              <ImageUpload
                                onImageChange={handleLicenseImageChange}
                              />
                            ) : (
                              <></>
                            );
                          }}
                        />
                      </div>
                      <div className="image-preview flex flex-wrap gap-3 w-full md:!w-[50%]">
                        {watch("licenseImages")?.map(
                          (
                            image: { file_url: string | File },
                            index: number
                          ) => (
                            <ImagePreview
                              key={index}
                              image={image.file_url || ""}
                              onDelete={() => handleDeleteLicenseImage(index)}
                            />
                          )
                        )}
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
                              <Controller
                                name="courseName"
                                control={control}
                                render={({ field }) => (
                                  <input
                                    {...field}
                                    type="text"
                                    className="form-control"
                                    placeholder="ระบุชื่อหลักสูตร"
                                  />
                                )}
                              />
                            </div>
                            {errors.courseName && (
                              <div className="text-error text-xs mt-1">
                                {errors.courseName.message}
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="col-span-6">
                          <div className="form-group">
                            <label className="form-label">เลขที่ใบรับรอง</label>
                            <div className="input-group">
                              <div className="input-group-prepend">
                                <span className="input-group-text">
                                  <i className="material-symbols-outlined">
                                    news
                                  </i>
                                </span>
                              </div>
                              <Controller
                                name="certificateNumber"
                                control={control}
                                render={({ field }) => (
                                  <input
                                    {...field}
                                    type="text"
                                    className="form-control"
                                    placeholder="ระบุเลขที่ใบรับรอง"
                                  />
                                )}
                              />
                            </div>
                            {errors.certificateNumber && (
                              <div className="text-error text-xs mt-1">
                                {errors.certificateNumber.message}
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="col-span-6">
                          <div className="form-group text-left">
                            <label className="form-label">ประเภทยานพาหนะ</label>
                            <Controller
                              name="vehicleType"
                              control={control}
                              render={({ field }) => (
                                <CustomSelect
                                  w="w-full"
                                  options={vehicleTypeOptions}
                                  value={field.value}
                                  onChange={field.onChange}
                                  iconName="front_loader"
                                />
                              )}
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
                              <Controller
                                name="trainingDate"
                                control={control}
                                render={({ field }) => (
                                  <DatePicker
                                    placeholder={"ระบุวันที่"}
                                    onChange={field.onChange}
                                    defaultValue={
                                      convertToBuddhistDateTime(field.value)
                                        .date
                                    }
                                  />
                                )}
                              />
                            </div>
                            {errors.trainingDate && (
                              <div className="text-error text-xs mt-1">
                                {errors.trainingDate.message}
                              </div>
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
                              <Controller
                                name="trainingEndDate"
                                control={control}
                                render={({ field }) => (
                                  <DatePicker
                                    placeholder={"ระบุวันที่"}
                                    onChange={field.onChange}
                                    minDate={watch("trainingDate")}
                                    defaultValue={
                                      convertToBuddhistDateTime(field.value)
                                        .date
                                    }
                                  />
                                )}
                              />
                            </div>
                            {errors.trainingEndDate && (
                              <div className="text-error text-xs mt-1">
                                {errors.trainingEndDate.message}
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="col-span-12">
                          <div className="form-group">
                            <label className="form-label">รูปใบรับรอง</label>
                            <Controller
                              name="certificateImages"
                              control={control}
                              render={({ field }) => {
                                return field.value?.length < 1 ? (
                                  <ImageUpload
                                    onImageChange={handleCertificateImageChange}
                                  />
                                ) : (
                                  <></>
                                );
                              }}
                            />
                          </div>
                          <div className="image-preview flex flex-wrap gap-3 !w-[50%]">
                            {watch("certificateImages")?.map(
                              (
                                image: { file_url: string | File },
                                index: number
                              ) => (
                                <ImagePreview
                                  key={index}
                                  image={image.file_url || ""}
                                  onDelete={() =>
                                    handleDeleteCertificateImage(index)
                                  }
                                />
                              )
                            )}
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>
                <div className="modal-action flex w-full gap-5 mt-3 mr-auto">
                  <div className="">
                    <button
                      type="button"
                      className="btn btn-secondary w-full"
                      onClick={handleCloseModal}
                    >
                      ไม่ใช่ตอนนี้
                    </button>
                  </div>
                  <div className="">
                    <button
                      type="submit"
                      className="btn bg-[#A80689] hover:bg-[#A80689] border-[#A80689] text-white w-full"
                    >
                      ต่อไป
                    </button>
                  </div>
                </div>
              </form>
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

RequestDrivingStepOneModal.displayName = "RequestDrivingStepOneModal";

export default RequestDrivingStepOneModal;
