import { RequestDetailType } from "@/app/types/request-detail-type";
import CustomSelect from "@/components/customSelect";
import { useFormContext } from "@/contexts/requestFormContext";
import { adminUpdateCost } from "@/services/bookingAdmin";
import { updateCost } from "@/services/bookingUser";
import { fetchCostTypes, fetchCostCenter } from "@/services/masterService";
import useSwipeDown from "@/utils/swipeDown";
import { yupResolver } from "@hookform/resolvers/yup";
import { register } from "module";
import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { useForm, useWatch } from "react-hook-form";
import * as yup from "yup";
import CustomSelectOnSearch from "../customSelectOnSearch";

interface Props {
  requestData?: RequestDetailType;
  role?: string;
  onUpdate?: (data: any) => void;
}

const schema = yup
  .object()
  .shape({
    refCostTypeCode: yup.string(),
    wbsNumber: yup.string().when("refCostTypeCode", {
      is: (val: string) => val === "3",
      then: (schema) => schema.required("กรุณาระบุเลขที่ WBS"),
      otherwise: (schema) => schema.optional(),
    }),
    costCenter: yup.string().when("refCostTypeCode", {
      is: (val: string) => val === "1" || val === "2",
      then: (schema) => schema.required("กรุณาระบุการเบิกค่าใช้จ่าย"),
      otherwise: (schema) => schema.optional(),
    }),
    pmOrderNo: yup.string(),
    activityNo: yup.string(),
    networkNo: yup.string(),
  })
  .test(
    "at-least-one-for-4",
    "กรุณาระบุ เลขที่ใบสั่ง หรือ เลขที่กิจกรรม หรือ เลขที่โครงข่าย สำหรับประเภทงบประมาณนี้",
    function (value) {
      if (value.refCostTypeCode === "4") {
        return !!(value.pmOrderNo || value.activityNo || value.networkNo);
      }
      return true;
    }
  );

interface costType {
  ref_cost_type_code: string;
  ref_cost_type_name: string;
  cost_center: string;
}

interface costCenter {
  cost_center: string;
}

const DisbursementModal = forwardRef<
  { openModal: () => void; closeModal: () => void },
  Props
>(({ onUpdate, requestData, role }, ref) => {
  const modalRef = useRef<HTMLDialogElement>(null);
  const hasReset = useRef(false);

  useImperativeHandle(ref, () => ({
    openModal: () => {
      hasReset.current = false;
      modalRef.current?.showModal();
    },
    closeModal: () => modalRef.current?.close(),
  }));

  const { formData, updateFormData } = useFormContext();
  const [loadingCostCenter, setLoadingCostCenter] = useState(false);
  const [costTypeDatas, setCostTypeDatas] = useState<costType[]>([]);
  const [costCenterDatas, setCostCenterDatas] = useState<costCenter[]>([]);
  const [costCenterOptions, setCostCenterOptions] = useState<
    { value: string; label: string }[]
  >([]);
  const [selectedCostCenterOption, setSelectedCostCenterOption] = useState<{
    value: string;
    label: string;
  }>();

  const {
    handleSubmit,
    reset,
    setValue,
    control,
    watch,
    formState: { errors, isValid },
  } = useForm({
    mode: "onChange",
    resolver: yupResolver(schema),
  });

  const [costTypeOptions, setCostTypeOptions] = useState<
    { value: string; label: string }[]
  >([]);
  const [selectedCostTypeOption, setSelectedCostTypeOption] = useState<{
    value: string;
    label: string;
  } | null>(null);

  const [formValues, setFormValues] = useState({
    refCostTypeCode: "",
    costCenter: "",
    wbsNumber: "",
    pmOrderNo: "",
    activityNo: "",
    networkNo: "",
  });
  const wbsNumber = useWatch({ control, name: "wbsNumber" });
  const activityNo = useWatch({ control, name: "activityNo" });
  const pmOrderNo = useWatch({ control, name: "pmOrderNo" });
  const networkNo = useWatch({ control, name: "networkNo" });

  useEffect(() => {
    const fetchCostTypeRequest = async () => {
      try {
        const response = await fetchCostTypes();
        if (response.status === 200) {
          const costTypeData = response.data;
          setCostTypeDatas(costTypeData);

          const costTypeArr = costTypeData.map(
            (cost: {
              ref_cost_type_code: string;
              ref_cost_type_name: string;
            }) => ({
              value: cost.ref_cost_type_code,
              label: cost.ref_cost_type_name,
            })
          );

          setCostTypeOptions(costTypeArr);
        }
      } catch (error) {
        console.error("Error fetching cost types:", error);
      }
    };
    fetchCostTypeRequest();
  }, []);

  const handleCostCenterSearch = async (search: string) => {
    // Don't search if input is empty
    if (!search.trim()) {
      setCostCenterOptions([]);
      return;
    }
  
    // Only search when input has at least 3 characters
    if (search.trim().length < 3) {
      setLoadingCostCenter(true);
      try {
        const response = await fetchCostCenter(search);
        if (response.status === 200) {
          const costCenterData = response.data;
          setCostCenterDatas(costCenterData);
          const costCenterArr = costCenterData.map(
            (cost: { cost_center: string }) => ({
              value: cost.cost_center,
              label: cost.cost_center,
            })
          );
          setCostCenterOptions(costCenterArr);
        }
      } catch (error) {
        console.error("Search failed:", error);
        setCostCenterOptions([]);
      } finally {
        setLoadingCostCenter(false);
      }
    }
  };

  const handleCostTypeChange = (option: any) => {
    setValue("wbsNumber", "");
    setValue("activityNo", "");
    setValue("pmOrderNo", "");
    setValue("networkNo", "");
    setSelectedCostTypeOption(option);
    setValue("refCostTypeCode", option.value);
    setValue("costCenter", "");
    setFormValues((prev) => ({ ...prev, refCostTypeCode: option.value }));

    if (option.value === "1") {
      const data = costTypeDatas.find(
        (cost: { ref_cost_type_code: string }) =>
          cost.ref_cost_type_code === option.value
      );
      if (data) {
        setValue("costCenter", data.cost_center);
        setFormValues((prev) => ({ ...prev, costCenter: data.cost_center }));
      }
    }
  };

  const handleCostCenterChange = (selectedOption: any) => {
    setSelectedCostCenterOption(selectedOption);
    setValue("costCenter", selectedOption.value);
    setFormValues((prev) => ({ ...prev, costCenter: selectedOption.value }));
  };

  useEffect(() => {
    // Initialize form values from formData or requestData
    console.log("requestatadis", requestData);
    let initialValues;
    if (requestData) {
      initialValues = {
        refCostTypeCode: requestData?.ref_cost_type_code || "",
        costCenter: requestData?.cost_center || "",
        wbsNumber: requestData?.wbs_number || "",
        pmOrderNo: requestData?.pm_order_no || "",
        activityNo: requestData?.activity_no || "",
        networkNo: requestData?.network_no || "",
      };
    } else {
      initialValues = {
        refCostTypeCode: formData.refCostTypeCode || "",
        costCenter: formData.costCenter || "",
        wbsNumber: formData.wbsNumber || "",
        pmOrderNo: formData.pmOrderNo || "",
        activityNo: formData.activityNo || "",
        networkNo: formData.networkNo || "",
      };
    }

    setFormValues(initialValues);

    Object.entries(initialValues).forEach(([key, value]) => {
      setValue(key as any, value);
    });

    // Set selected cost type option if available
    if (costTypeOptions.length > 0 && initialValues.refCostTypeCode) {
      const selectedOption = costTypeOptions.find(
        (option) =>
          String(option.value) === String(initialValues.refCostTypeCode)
      );

      if (selectedOption) {
        setSelectedCostTypeOption(selectedOption);

        if (selectedOption.value === "2" && initialValues.costCenter) {
          console.log("ttt", selectedOption);
          const costCenterOption = costCenterOptions.find(
            (opt) => opt.value === initialValues.costCenter
          );

          if (costCenterOption) {
            setSelectedCostCenterOption(costCenterOption);
          } else {
            setSelectedCostCenterOption({
              value: initialValues.costCenter,
              label: initialValues.costCenter,
            });
          }
        }
      }
    }
  }, [costTypeOptions, costCenterOptions, formData, requestData, setValue]);

  const onSubmit = async (data: any) => {
    if (requestData) {
      const payload = {
        cost_center:
          selectedCostTypeOption?.value === "2"
            ? selectedCostCenterOption?.value
            : data.costCenter,
        ref_cost_type_code: Number(data.refCostTypeCode),
        wbs_number: data.wbsNumber,
        pm_order_no: data.pmOrderNo,
        activity_no: data.activityNo,
        network_no: data.networkNo,
        trn_request_uid: requestData.trn_request_uid,
      };

      try {
        const response =
          role === "admin"
            ? await adminUpdateCost(payload)
            : await updateCost(payload);

        if (response) {
          if (onUpdate) onUpdate(response.data);
          modalRef.current?.close();
        }
      } catch (error) {
        console.error("Network error:", error);
        alert("Failed to update trip due to network error.");
      }
    } else {
      const updatedData = {
        ...data,
        refCostTypeCode: data.refCostTypeCode,
        costCenter:
          selectedCostTypeOption?.value === "2"
            ? selectedCostCenterOption?.value
            : data.costCenter,
        wbsNumber: data.wbsNumber,
        pmOrderNo: data.pmOrderNo,
        activityNo: data.activityNo,
        networkNo: data.networkNo,
      };

      if (onUpdate) {
        onUpdate(updatedData);
      }

      updateFormData(updatedData);
      modalRef.current?.close();
    }
  };

  const swipeDownHandlers = useSwipeDown(() => modalRef.current?.close());

  const isCostCenterRequired =
    selectedCostTypeOption?.value === "2" && !selectedCostCenterOption;

  return (
    <dialog ref={modalRef} id="my_modal_1" className="modal">
      <div className="modal-box max-w-[500px] p-0 relative modal-vehicle-pick overflow-hidden flex flex-col max-h-[90vh]">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="bottom-sheet" {...swipeDownHandlers}>
            <div className="bottom-sheet-icon"></div>
          </div>
          <div className="modal-header bg-white sticky top-0 flex justify-between z-10">
            <div className="modal-title">แก้ไขการเบิกค่าใช้จ่าย</div>

            <button
              className="close btn btn-icon border-none bg-transparent shadow-none btn-tertiary"
              type="button"
              onClick={() => modalRef.current?.close()}
            >
              <i className="material-symbols-outlined">close</i>
            </button>
          </div>
          <div className="modal-body overflow-y-auto">
            <div className="grid grid-cols-12 gap-4">
              <div className="col-span-12">
                <div className="form-group">
                  <label className="form-label">การเบิกค่าใช้จ่าย</label>
                  <CustomSelect
                    iconName="paid"
                    w="w-full"
                    options={costTypeOptions}
                    value={selectedCostTypeOption}
                    onChange={handleCostTypeChange}
                  />
                </div>
              </div>

              {selectedCostTypeOption?.value === "1" && (
                <div className="col-span-12">
                  <div className="form-group">
                    <label className="form-label">ศูนย์ต้นทุน</label>
                    <div className="input-group is-readonly">
                      <div className="input-group-prepend">
                        <span className="input-group-text">
                          <i className="material-symbols-outlined">
                            account_balance
                          </i>
                        </span>
                      </div>
                      <input
                        type="text"
                        className="form-control"
                        value={formValues.costCenter}
                        placeholder=""
                        readOnly
                      />
                    </div>
                  </div>
                </div>
              )}

              {selectedCostTypeOption?.value === "2" && (
                <div className="col-span-12">
                  <div className="form-group">
                    <label className="form-label">ศูนย์ต้นทุน</label>
                    <CustomSelectOnSearch
                      iconName="business_center"
                      w="w-full"
                      options={costCenterOptions}
                      value={selectedCostCenterOption}
                      onChange={handleCostCenterChange}
                      onSearchInputChange={handleCostCenterSearch}
                      loading={loadingCostCenter}
                      enableSearchOnApi={true}
                    />
                  </div>
                </div>
              )}

              {selectedCostTypeOption?.value === "3" && (
                <>
                  <div className="col-span-12">
                    <div className="form-group">
                      <label className="form-label">เลขที่ WBS</label>
                      <div
                        className={`input-group ${
                          errors.wbsNumber && "is-invalid"
                        }`}
                      >
                        <input
                          type="text"
                          className="form-control"
                          placeholder="ระบุเลขที่ WBS"
                          value={wbsNumber}
                          onChange={(e) => {
                            setValue("wbsNumber", e.target.value);
                            setFormValues((prev) => ({
                              ...prev,
                              wbsNumber: e.target.value,
                            }));
                          }}
                        />
                      </div>
                      {errors.wbsNumber && (
                        <div className="form-helper text-red-500">
                          {String(errors.wbsNumber.message)}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="col-span-12">
                    <div className="form-group">
                      <label className="form-label">เลขที่โครงข่าย</label>
                      <div className="input-group">
                        <input
                          type="text"
                          className="form-control"
                          placeholder="ระบุเลขที่โครงข่าย"
                          value={networkNo}
                          onChange={(e) => {
                            setValue("networkNo", e.target.value);
                            setFormValues((prev) => ({
                              ...prev,
                              networkNo: e.target.value,
                            }));
                          }}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="col-span-12">
                    <div className="form-group">
                      <label className="form-label">เลขที่กิจกรรม</label>
                      <div className="input-group">
                        <input
                          type="text"
                          className="form-control"
                          placeholder="ระบุเลขที่กิจกรรม"
                          value={activityNo}
                          onChange={(e) => {
                            setValue("activityNo", e.target.value);
                            setFormValues((prev) => ({
                              ...prev,
                              activityNo: e.target.value,
                            }));
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </>
              )}

              {selectedCostTypeOption?.value === "4" && (
                <div className="col-span-12">
                  <div className="form-group">
                    <label className="form-label">เลขที่ใบสั่ง</label>
                    <div className="input-group">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="ระบุเลขที่ใบสั่ง"
                        value={pmOrderNo}
                        onChange={(e) => {
                          setValue("pmOrderNo", e.target.value);
                          setFormValues((prev) => ({
                            ...prev,
                            pmOrderNo: e.target.value,
                          }));
                        }}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="modal-action sticky bottom-0 gap-3 mt-0">
            <button
              className="btn btn-secondary"
              type="button"
              onClick={() => modalRef.current?.close()}
            >
              ยกเลิก
            </button>

            <button
              className="btn btn-primary"
              type="submit"
              disabled={!isValid || isCostCenterRequired}
            >
              ยืนยัน
            </button>
          </div>
        </form>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>
  );
});

DisbursementModal.displayName = "DisbursementModal";

export default DisbursementModal;
