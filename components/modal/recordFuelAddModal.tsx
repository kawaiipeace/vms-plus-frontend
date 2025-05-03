"use client";
import { UploadFileType } from "@/app/types/upload-type";
import DatePicker, { DatePickerRef } from "@/components/datePicker";
import ImagePreview from "@/components/imagePreview";
import ImageUpload from "@/components/imageUpload";
import RadioButton from "@/components/radioButton";
import { RecordFuelTabProps } from "@/data/requestData";
import {
  fetchFuelType,
  fetchOilStationBrandType,
  fetchPaymentTypeCode,
} from "@/services/masterService";
import {
  UserCreateAddFuelDetail,
  UserUpdateAddFuelDetail,
} from "@/services/vehicleInUseUser";
import { convertToISO } from "@/utils/convertToISO";
import useSwipeDown from "@/utils/swipeDown";
import Image from "next/image";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react";
import CustomSelect, { CustomSelectOption } from "../customSelect";
import Tooltip from "../tooltips";
import {
  driverCreateAddFuelDetail,
  driverUpdateAddFuelDetail,
} from "@/services/vehicleInUseDriver";
import { getOilBrandImage } from "@/utils/getOilBrandImage";

interface Props {
  status?: boolean;
  isPayment?: boolean;
  dataItem?: RecordFuelTabProps;
  requestId?: string;
  role?: string;
}

interface ValueForm {
  mile: string;
  price_per_liter: string;
  ref_fuel_type_id: CustomSelectOption;
  ref_oil_station_brand_id: CustomSelectOption;
  sum_liter: string;
  sum_price: string;
  tax_invoice_date: string;
  tax_invoice_no: string;
}

const RecordTravelAddModal = forwardRef<
  { openModal: () => void; closeModal: () => void },
  Props
>(({ status, isPayment, requestId, dataItem, role }, ref) => {
  const router = useRouter();
  const pathName = usePathname();
  const searchParams = useSearchParams();
  const activeTab = searchParams.get("activeTab");
  const progressType = searchParams.get("progressType");

  const modalRef = useRef<HTMLDialogElement>(null);
  const startDatePickerRef = useRef<DatePickerRef>(null);
  const [valueForm, setValueForm] = useState<Partial<ValueForm>>();

  const [fuelData, setFuelData] = useState<
    {
      ref_fuel_type_id: number;
      ref_fuel_type_name_en: string;
      ref_fuel_type_name_th: string;
    }[]
  >([]);
  const [oilStationBrandData, setOilStationBrandData] = useState<
    {
      ref_oil_station_brand_id: 1;
      ref_oil_station_brand_name_th: string;
      ref_oil_station_brand_name_en: string;
      ref_oil_station_brand_name_full: string;
      ref_oil_station_brand_img: string;
    }[]
  >([]);
  const [PaymentTypeCodeData, setPaymentTypeCodeData] = useState<
    { ref_payment_type_code: number; ref_payment_type_name: string }[]
  >([]);

  useImperativeHandle(ref, () => ({
    openModal: () => modalRef.current?.showModal(),
    closeModal: () => modalRef.current?.close(),
  }));
  const [selectedTravelType, setSelectedTravelType] = useState("");
  const [images, setImages] = useState<UploadFileType[]>([]);

  useEffect(() => {
    if (status && dataItem) {
      const ref_fuel_type_id = fuelData.find(
        (item) => item.ref_fuel_type_id === dataItem.ref_fuel_type_id
      );
      const ref_oil_station_brand_id = oilStationBrandData.find(
        (item) =>
          item.ref_oil_station_brand_id === dataItem.ref_oil_station_brand_id
      );
      startDatePickerRef.current?.setValue(dataItem?.tax_invoice_date);
      setImages([{ file_url: dataItem.receipt_img }]);
      setSelectedTravelType(dataItem.ref_payment_type_code.toString());
      setValueForm({
        mile: dataItem.mile.toString(),
        price_per_liter: dataItem.price_per_liter.toString(),
        ref_fuel_type_id: {
          value: dataItem.ref_fuel_type_id.toString() || "",
          label: ref_fuel_type_id?.ref_fuel_type_name_th,
        },
        ref_oil_station_brand_id: {
          value: dataItem.ref_oil_station_brand_id.toString(),
          label: (
            <div className="flex items-center gap-1">
              {ref_oil_station_brand_id?.ref_oil_station_brand_img && (
                <Image
                  src={ref_oil_station_brand_id?.ref_oil_station_brand_img}
                  alt={"oil-image-" + dataItem.ref_oil_station_brand_id}
                />
              )}
              <span className="ml-2">
                {ref_oil_station_brand_id?.ref_oil_station_brand_name_th}
              </span>
            </div>
          ),
        },
        sum_liter: dataItem.sum_liter.toString(),
        sum_price: dataItem.sum_price.toString(),
        tax_invoice_date: dataItem?.tax_invoice_date,
        tax_invoice_no: dataItem?.tax_invoice_no,
      });
    } else {
      setValueForm(undefined);
      setSelectedTravelType("");
      setImages([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataItem, status]);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const responseFuel = await fetchFuelType();
        const responseOil = await fetchOilStationBrandType();
        const responsePaymentTypeCode = await fetchPaymentTypeCode();

        if (responseFuel && responseOil && responsePaymentTypeCode) {
          setFuelData(responseFuel.data);
          setOilStationBrandData(responseOil.data);
          setPaymentTypeCodeData(responsePaymentTypeCode.data);
        }
      } catch (error) {
        console.error("Error fetching requests:", error);
      }
    };
    if (requestId) {
      fetchRequests();
    }
  }, [requestId]);

  const handleImageChange = (images: UploadFileType) => {
    setImages([images]);
  };

  const handleDeleteImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const swipeDownHandlers = useSwipeDown(() => modalRef.current?.close());

  const oilOptions: CustomSelectOption[] = useMemo(
    () =>
      oilStationBrandData.map((item) => {
        return {
          value: item.ref_oil_station_brand_id.toString(),
          label: (
            <div className="flex items-center gap-1">
              {item.ref_oil_station_brand_img && (
                <Image
                  src={item.ref_oil_station_brand_img}
                  alt={"oil-image-" + item.ref_oil_station_brand_id}
                />
              )}
              <span className="ml-2">{item.ref_oil_station_brand_name_th}</span>
            </div>
          ),
        };
      }),
    [oilStationBrandData]
  );

  const fuelOptions: CustomSelectOption[] = useMemo(
    () =>
      fuelData.map((item) => {
        return {
          value: item.ref_fuel_type_id.toString(),
          label: item.ref_fuel_type_name_th,
        };
      }),
    [fuelData]
  );

  const onSubmit = () => {
    console.log("submit");
    console.log("valueForm", valueForm);
    const {
      mile,
      price_per_liter,
      ref_fuel_type_id,
      ref_oil_station_brand_id,
      sum_liter,
      sum_price,
      tax_invoice_date,
      tax_invoice_no,
    } = valueForm || {};
    if (
      !mile ||
      !price_per_liter ||
      !images ||
      images.length < 1 ||
      !ref_fuel_type_id ||
      !ref_oil_station_brand_id ||
      (!selectedTravelType && isPayment) ||
      !sum_liter ||
      !sum_price ||
      !tax_invoice_date ||
      !tax_invoice_no
    ) {
      return;
    }

    const submitForm = async () => {
      try {
        const payload = {
          mile: Number(mile),
          price_per_liter: Number(price_per_liter),
          receipt_img: images[0].file_url,
          ref_fuel_type_id: Number(ref_fuel_type_id.value),
          ref_oil_station_brand_id: Number(ref_oil_station_brand_id.value),
          ref_payment_type_code: Number(selectedTravelType),
          sum_liter: Number(sum_liter),
          sum_price: Number(sum_price),
          tax_invoice_date: convertToISO(tax_invoice_date, "00:00"),
          tax_invoice_no: tax_invoice_no,
          trn_request_uid: requestId,
        };

        if (status) {
          const res =
            role === "user"
              ? await UserUpdateAddFuelDetail(
                  dataItem?.trn_add_fuel_uid || "",
                  payload
                )
              : role === "driver"
              ? await driverUpdateAddFuelDetail(
                  dataItem?.trn_add_fuel_uid || "",
                  payload
                )
              : { data: {} };
          const data = res.data;
          if (data) {
            modalRef.current?.close();

            // eslint-disable-next-line @typescript-eslint/no-unused-expressions
            role === "user"
              ? router.push(
                  pathName +
                    `?activeTab=${activeTab}&update-fuel-req=success&tax_invoice_no=${data.data?.tax_invoice_no}`
                )
              : role === "driver"
              ? router.push(
                  pathName +
                    "?progressType=" +
                    progressType +
                    "&update-fuel-req=success"
                )
              : "";
          }
          return;
        }

        const res =
          role === "user"
            ? await UserCreateAddFuelDetail(payload)
            : role === "driver"
            ? await driverCreateAddFuelDetail(payload)
            : await UserCreateAddFuelDetail(payload);
        const data = res.data;
        if (data) {
          modalRef.current?.close();

          // eslint-disable-next-line @typescript-eslint/no-unused-expressions
          role === "user"
            ? router.push(
                pathName +
                  `?activeTab=${activeTab}&create-fuel-req=success&tax_invoice_no=${data.data?.tax_invoice_no}`
              )
            : role === "driver"
            ? router.push(
                pathName +
                  "?progressType=" +
                  progressType +
                  "&create-fuel-req=success"
              )
            : router.push(
                "/vehicle-booking/request-list?cancel-req=success&request-id=" +
                  data.result?.request_no
              );
        }
      } catch (error) {
        console.error("Error submitting form:", error);
      }
    };

    submitForm();
  };

  return (
    <dialog ref={modalRef} className="modal">
      <div className="modal-box max-w-[500px] p-0 relative overflow-hidden flex flex-col">
        <form>
          <div className="bottom-sheet" {...swipeDownHandlers}>
            <div className="bottom-sheet-icon"></div>
          </div>
          <div className="modal-header bg-white sticky top-0 flex justify-between z-10">
            <div className="modal-title">
              {status
                ? "แก้ไขข้อมูลการเติมเชื้อเพลิง"
                : "เพิ่มข้อมูลการเติมเชื้อเพลิง"}
            </div>

            <button
              className="close btn btn-icon border-none bg-transparent shadow-none btn-tertiary"
              onClick={() => modalRef.current?.close()}
            >
              <i className="material-symbols-outlined">close</i>
            </button>
          </div>
          <div className="modal-body overflow-y-auto text-center h-[70vh]">
            <div className="grid grid-cols-1 gap-4">
              <div className="col-span-12">
                <div className="form-group">
                  <label className="form-label">สถานีบริการน้ำมัน</label>
                  <CustomSelect
                    w="w-full"
                    options={oilOptions}
                    value={valueForm?.ref_oil_station_brand_id}
                    onChange={(selected) =>
                      setValueForm((val) => ({
                        ...val,
                        ref_oil_station_brand_id: selected,
                      }))
                    }
                  />
                </div>
              </div>
              <div className="col-span-12">
                <div className="form-group">
                  <label className="form-label">ประเภทเชื้อเพลิง</label>
                  <CustomSelect
                    w="w-full"
                    options={fuelOptions}
                    value={valueForm?.ref_fuel_type_id}
                    onChange={(selected) =>
                      setValueForm((val) => ({
                        ...val,
                        ref_fuel_type_id: selected,
                      }))
                    }
                  />
                </div>
              </div>
              <div className="col-span-12 grid grid-cols-2 gap-4">
                <div className="">
                  <div className="form-group">
                    <label className="form-label">
                      เลขไมล์
                      <Tooltip
                        title="เลขไมล์ขณะเติมเชื้อเพลิง"
                        content=""
                        position="right"
                      >
                        <i className="material-symbols-outlined">info</i>
                      </Tooltip>
                    </label>
                    <div className="input-group">
                      <input
                        type="number"
                        className="form-control"
                        value={valueForm?.mile}
                        onChange={(e) =>
                          setValueForm((val) => ({
                            ...val,
                            mile: e.target.value,
                          }))
                        }
                      />
                    </div>
                  </div>
                </div>
                <div className="">
                  <div className="form-group">
                    <label className="form-label">วันที่ใบเสร็จ</label>
                    <div className="input-group">
                      <div className="input-group-prepend">
                        <span className="input-group-text">
                          <i className="material-symbols-outlined">
                            calendar_month
                          </i>
                        </span>
                      </div>
                      <DatePicker
                        placeholder="ระบุวันที่"
                        ref={startDatePickerRef}
                        onChange={(date) =>
                          setValueForm((val) => ({
                            ...val,
                            tax_invoice_date: date,
                          }))
                        }
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-span-12">
                <div className="form-group">
                  <label className="form-label">เลขที่ใบเสร็จ</label>
                  <div className="input-group">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="ระบุเลขที่ใบเสร็จ"
                      value={valueForm?.tax_invoice_no}
                      onChange={(e) =>
                        setValueForm((val) => ({
                          ...val,
                          tax_invoice_no: e.target.value,
                        }))
                      }
                    />
                  </div>
                </div>
              </div>
              <div className="col-span-12 grid grid-cols-2 gap-4">
                <div>
                  <div className="form-group">
                    <label className="form-label">ราคาต่อลิตร</label>
                    <div className="input-group">
                      <input
                        type="number"
                        className="form-control"
                        placeholder="ระบุราคาต่อลิตร"
                        value={valueForm?.price_per_liter}
                        onChange={(e) =>
                          setValueForm((val) => ({
                            ...val,
                            price_per_liter: e.target.value,
                          }))
                        }
                      />
                    </div>
                  </div>
                </div>
                <div>
                  <div className="form-group">
                    <label className="form-label">จำนวนลิตร</label>
                    <div className="input-group">
                      <input
                        type="number"
                        className="form-control"
                        placeholder="ระบุจำนวนลิตร"
                        value={valueForm?.sum_liter}
                        onChange={(e) =>
                          setValueForm((val) => ({
                            ...val,
                            sum_liter: e.target.value,
                          }))
                        }
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-span-12">
                <div className="form-group">
                  <label className="form-label">ยอดรวมชำระ</label>
                  <div className="input-group">
                    <input
                      type="number"
                      className="form-control"
                      placeholder="ระบุยอดรวมชำระ"
                      value={valueForm?.sum_price}
                      onChange={(e) =>
                        setValueForm((val) => ({
                          ...val,
                          sum_price: e.target.value,
                        }))
                      }
                    />
                  </div>
                  <p className="text-sm text-left mt-3">
                    รวมภาษี 85.05 บาท (7%)
                  </p>
                </div>
              </div>
              {isPayment && (
                <div className="col-span-12">
                  <div className="form-group">
                    <label className="form-label">วิธีชำระเงิน</label>
                    <div className="custom-group">
                      {PaymentTypeCodeData.map((item, index) => {
                        return (
                          <RadioButton
                            key={index}
                            name="travelType"
                            label={item.ref_payment_type_name}
                            value={item.ref_payment_type_code.toString()}
                            selectedValue={selectedTravelType}
                            setSelectedValue={setSelectedTravelType}
                          />
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}
              <div className="col-span-12 text-left">
                <label className="form-label text-left text-secondary font-semibold">
                  รูปภาพใบเสร็จ
                </label>
                {images.length < 1 && (
                  <ImageUpload onImageChange={handleImageChange} />
                )}
                <div className="image-preview flex flex-wrap gap-3 !w-[50%]">
                  {images.map((image, index) => (
                    <ImagePreview
                      key={index}
                      image={image.file_url}
                      onDelete={() => handleDeleteImage(index)}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div className="modal-action flex gap-4">
            <div>
              <button
                type="button"
                className="btn btn-secondary w-full"
                onClick={() => modalRef.current?.close()}
              >
                ปิด
              </button>
            </div>
            <div>
              <button
                type="button"
                className="btn btn-primary w-full"
                onClick={onSubmit}
              >
                บันทึก
              </button>
            </div>
          </div>
        </form>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>
  );
});

RecordTravelAddModal.displayName = "RecordTravelAddModal";

export default RecordTravelAddModal;
