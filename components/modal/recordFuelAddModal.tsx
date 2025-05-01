import { UploadFileType } from "@/app/types/upload-type";
import DatePicker from "@/components/datePicker";
import ImagePreview from "@/components/imagePreview";
import ImageUpload from "@/components/imageUpload";
import RadioButton from "@/components/radioButton";
import { fetchFuelType, fetchOilStationBrandType, fetchPaymentTypeCode } from "@/services/masterService";
import useSwipeDown from "@/utils/swipeDown";
import Image from "next/image";
import { forwardRef, useEffect, useImperativeHandle, useMemo, useRef, useState } from "react";
import CustomSelect, { CustomSelectOption } from "../customSelect";

interface Props {
  status?: boolean;
  isPayment?: boolean;
  dataItem?: any;
  requestId?: string;
}

interface ValueForm {
  mile: string;
  price_per_liter: string;
  receipt_img: string;
  ref_fuel_type_id: number;
  ref_oil_station_brand_id: number;
  ref_payment_type_code: number;
  sum_liter: string;
  sum_price: string;
  tax_invoice_date: string;
  tax_invoice_no: string;
}

const RecordTravelAddModal = forwardRef<{ openModal: () => void; closeModal: () => void }, Props>(
  ({ status, isPayment, requestId, dataItem }, ref) => {
    const modalRef = useRef<HTMLDialogElement>(null);
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

    // const fuelOptions = ["ปตท. (OR)", "บางจาก (BCP)", "พีที (PTG)", "ซัสโก้ (SUSCO)", "เชลล์ (SHELL)"];
    // const fuelTypeOptions = ["ดีเซล", "เบนซิน"];

    useImperativeHandle(ref, () => ({
      openModal: () => modalRef.current?.showModal(),
      closeModal: () => modalRef.current?.close(),
    }));
    const [selectedTravelType, setSelectedTravelType] = useState("");
    const [images, setImages] = useState<any>([]);

    useEffect(() => {
      const fetchRequests = async () => {
        try {
          const responseFuel = await fetchFuelType();
          const responseOil = await fetchOilStationBrandType();
          const responsePaymentTypeCode = await fetchPaymentTypeCode();

          if (responseFuel && responseOil && responsePaymentTypeCode) {
            console.log("data---", responseFuel.data);
            console.log("data---", responseOil.data);
            console.log("data---", responsePaymentTypeCode.data);

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
      // setImages(images);
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
                <Image src={item.ref_oil_station_brand_img || ""} alt={"oil image"} />
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
      const payload = {
        mile: 12000,
        price_per_liter: 35.5,
        receipt_img: "http://vms.pea.co.th/receipt.jpg",
        ref_fuel_type_id: 1,
        ref_oil_station_brand_id: 1,
        ref_payment_type_code: 1,
        sum_liter: 50,
        sum_price: 1872.5,
        tax_invoice_date: "2025-03-26T08:00:00Z",
        tax_invoice_no: "INV1234567890",
        trn_request_uid: "8bd09808-61fa-42fd-8a03-bf961b5678cd",
      };
    };

    return (
      <dialog ref={modalRef} className="modal">
        <div className="modal-box max-w-[500px] p-0 relative overflow-hidden flex flex-col">
          <div className="modal-body overflow-y-auto text-center">
            <div className="modal-header bg-white sticky top-0 flex justify-between z-10">
              <div className="modal-title">
                {status ? "แก้ไขข้อมูลการเติมเชื้อเพลิง" : "เพิ่มข้อมูลการเติมเชื้อเพลิง"}
              </div>
              <form method="dialog">
                <button className="close btn btn-icon border-none bg-transparent shadow-none btn-tertiary">
                  <i className="material-symbols-outlined">close</i>
                </button>
              </form>
            </div>
            <form>
              <div className="grid grid-cols-1 gap-4 mt-4">
                <div className="col-span-12">
                  <div className="form-group">
                    <label className="form-label">สถานีบริการน้ำมัน</label>
                    <CustomSelect
                      w="w-full"
                      options={oilOptions}
                      value={null}
                      onChange={function (selected: CustomSelectOption): void {
                        throw new Error("Function not implemented.");
                      }}
                    />
                  </div>
                </div>
                <div className="col-span-12">
                  <div className="form-group">
                    <label className="form-label">ประเภทเชื้อเพลิง</label>
                    <CustomSelect
                      w="w-full"
                      options={fuelOptions}
                      value={null}
                      onChange={function (selected: CustomSelectOption): void {
                        throw new Error("Function not implemented.");
                      }}
                    />
                  </div>
                </div>
                <div className="col-span-12 grid grid-cols-2 gap-4">
                  <div>
                    <div className="form-group">
                      <label className="form-label">เลขไมล์</label>
                      <div className="input-group">
                        <input type="text" className="form-control" />
                      </div>
                    </div>
                  </div>
                  <div>
                    <div className="form-group">
                      <label className="form-label">วันที่ใบเสร็จ</label>
                      <DatePicker placeholder="ระบุวันที่" />
                    </div>
                  </div>
                </div>
                <div className="col-span-12">
                  <div className="form-group">
                    <label className="form-label">เลขที่ใบเสร็จ</label>
                    <div className="input-group">
                      <input type="text" className="form-control" placeholder="ระบุเลขที่ใบเสร็จ" />
                    </div>
                  </div>
                </div>
                <div className="col-span-12 grid grid-cols-2 gap-4">
                  <div>
                    <div className="form-group">
                      <label className="form-label">ราคาต่อลิตร</label>
                      <div className="input-group">
                        <input type="text" className="form-control" placeholder="ระบุราคาต่อลิตร" />
                      </div>
                    </div>
                  </div>
                  <div>
                    <div className="form-group">
                      <label className="form-label">จำนวนลิตร</label>
                      <div className="input-group">
                        <input type="text" className="form-control" placeholder="ระบุจำนวนลิตร" />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-span-12">
                  <div className="form-group">
                    <label className="form-label">ยอดรวมชำระ</label>
                    <div className="input-group">
                      <input type="text" className="form-control" placeholder="ระบุยอดรวมชำระ" />
                    </div>
                    <p className="text-sm text-left mt-3">รวมภาษี 85.05 บาท (7%)</p>
                  </div>
                </div>
                {isPayment && (
                  <div className="col-span-12">
                    <div className="form-group">
                      <label className="form-label">วิธีชำระเงิน</label>
                      <div className="custom-group">
                        <RadioButton
                          name="travelType"
                          label="บัตรเติมน้ำมัน"
                          value="บัตรเติมน้ำมัน"
                          selectedValue={selectedTravelType}
                          setSelectedValue={setSelectedTravelType}
                        />

                        <RadioButton
                          name="travelType"
                          label="เงินสด, บัตรเครดิต, อื่น ๆ"
                          value="เงินสด, บัตรเครดิต, อื่น ๆ"
                          selectedValue={selectedTravelType}
                          setSelectedValue={setSelectedTravelType}
                        />
                      </div>
                    </div>
                  </div>
                )}
                <div className="col-span-12">
                  <label className="form-label">รูปภาพใบเสร็จ</label>
                  <ImageUpload images={images} onImageChange={handleImageChange} onDeleteImage={handleDeleteImage} />
                  <div className="image-preview flex flex-wrap gap-3">
                    {images.map((image, index) => (
                      <ImagePreview key={index} image={image} onDelete={() => handleDeleteImage(index)} />
                    ))}
                  </div>
                </div>
                <div className="col-span-12 grid grid-cols-2 gap-4">
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
                    <button type="button" className="btn btn-primary w-full" onClick={onSubmit}>
                      บันทึก
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    );
  }
);

RecordTravelAddModal.displayName = "RecordTravelAddModal";

export default RecordTravelAddModal;
