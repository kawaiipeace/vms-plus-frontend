import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import CustomSelect from "@/components/customSelect";
import { fetchCostTypes } from "@/services/masterService";
import { useFormContext } from "@/contexts/requestFormContext";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { RequestDetailType } from "@/app/types/request-detail-type";
import { updateCost } from "@/services/bookingUser";

interface Props {
  requestData?: RequestDetailType;
  onUpdate?: (data: any) => void;
}

const schema = yup.object().shape({
  refCostTypeCode: yup.string(),
});

const DisbursementModal = forwardRef<
  { openModal: () => void; closeModal: () => void },
  Props
>(({ onUpdate, requestData }, ref) => {
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

  const { handleSubmit, reset, setValue } = useForm({
    mode: "onChange",
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    if (requestData) {
      reset({
        refCostTypeCode: requestData?.ref_cost_type_code,
      });
      hasReset.current = true;
    }
  }, [requestData, reset]);

  const [costCenter, setCostCenter] = useState<string>("");
  const [costData, setCostData] = useState<
    {
      ref_cost_type_code: string;
      ref_cost_type_name: string;
      ref_cost_no: string;
    }[]
  >([]);

  const [costTypeOptions, setCostTypeOptions] = useState<
    { value: string; label: string }[]
  >([]);
  const [selectedCostTypeOption, setSelectedCostTypeOption] = useState<{
    value: string;
    label: string;
  } | null>(null);

  useEffect(() => {
    const fetchCostTypeRequest = async () => {
      try {
        const response = await fetchCostTypes();
        if (response.status === 200) {
          const costTypeData = response.data;
          setCostData(costTypeData); 

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

  useEffect(() => {
    if (costTypeOptions.length > 0) {
      const selectedOption = costTypeOptions.find(
        (option) => option.value === formData.refCostTypeCode
      );

      if (selectedOption) {
        setSelectedCostTypeOption(selectedOption);
        const selectedCostType = costData.find(
          (cost: { ref_cost_type_code: string }) =>
            cost.ref_cost_type_code === selectedOption.value
        );

        if (selectedCostType) {
          setCostCenter(selectedCostType?.ref_cost_no);
        }
      }
    }
  }, [costTypeOptions, costData, formData.refCostTypeCode]);

  const handleCostTypeChange = (option: any) => {
    setSelectedCostTypeOption(option);
    setValue("refCostTypeCode", option.value); // Update form state

    const selectedCostType = costData.find(
      (cost) => cost.ref_cost_type_code === option.value
    );

    if (selectedCostType) {
      setCostCenter(selectedCostType.ref_cost_no);
    } else {
      setCostCenter("");
    }
  };

  const onSubmit = async (data: any) => {
      if (requestData) {
          const payload = {
            // reference_number: data.referenceNumber,
            // trn_request_uid: requestData.trn_request_uid,
          };

          try {
            const response = await updateCost(payload);
            if (response) {
              if (onUpdate) onUpdate(response.data);
              modalRef.current?.close();
            }
          } catch (error) {
            console.error("Network error:", error);
            alert("Failed to update trip due to network error.");
          }
        } else{
          if (onUpdate)
            onUpdate({
              ...data,
              refCostTypeCode: data.refCostTypeCode,
            });
      
          updateFormData({
            refCostTypeCode: data.refCostTypeCode,
          });
      
          modalRef.current?.close();
        }
 
  };

  return (
    <dialog ref={modalRef} id="my_modal_1" className="modal">
      <div className="modal-box max-w-[500px] p-0 relative modal-vehicle-pick overflow-hidden flex flex-col max-h-[90vh]">
        <div className="bottom-sheet">
          <div className="bottom-sheet-icon"></div>
        </div>
        <div className="modal-header bg-white sticky top-0 flex justify-between z-10">
          <div className="modal-title">แก้ไขการเบิกค่าใช้จ่าย</div>
          <form method="dialog">
            <button className="close btn btn-icon border-none bg-transparent shadow-none btn-tertiary">
              <i className="material-symbols-outlined">close</i>
            </button>
          </form>
        </div>
        <div className="modal-body overflow-y-auto">
          <div className="grid grid-cols-12 gap-4">
            <div className="col-span-12">
              <CustomSelect
                iconName="paid"
                w="w-full"
                options={costTypeOptions}
                value={selectedCostTypeOption}
                onChange={handleCostTypeChange}
              />
            </div>

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
                    value={costCenter}
                    placeholder=""
                    readOnly
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="modal-action sticky bottom-0 gap-3 mt-0">
          <form method="dialog">
            <button className="btn btn-secondary">ยกเลิก</button>
          </form>

          <button className="btn btn-primary" onClick={handleSubmit(onSubmit)}>
            ยืนยัน
          </button>
        </div>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>
  );
});

DisbursementModal.displayName = "DisbursementModal";

export default DisbursementModal;
