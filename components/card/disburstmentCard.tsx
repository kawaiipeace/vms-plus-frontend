import { fetchCodeTypeFromCode } from "@/services/masterService";
import { useEffect, useState } from "react";
interface Props {
  refCostTypeCode?: string;
}
export default function DisburstmentCard({ refCostTypeCode }: Props) {
  const [costTypeData, setCostTypeData] = useState<any>();
  useEffect(() => {
    const fetchCostTypeFromCodeFunc = async () => {
      try {
        const response = await fetchCodeTypeFromCode(refCostTypeCode || "");
        setCostTypeData(response.data);
      } catch (error) {
        console.error("API Error:", error);
      }
    };
    fetchCostTypeFromCodeFunc();
  }, [refCostTypeCode]);

  return (
    <div className="form-card">
      <div className="form-card-body">
        <div className="grid grid-cols-12">
          <div className="col-span-12 md:col-span-6">
            <div className="form-group form-plaintext">
              <i className="material-symbols-outlined">paid</i>
              <div className="form-plaintext-group">
                <div className="form-label">ประเภทงบประมาณ</div>
                <div className="form-text">{costTypeData?.ref_cost_type_name}</div>
              </div>
            </div>
          </div>

          <div className="col-span-12 md:col-span-6">
            <div className="form-group form-plaintext">
              <i className="material-symbols-outlined">account_balance</i>
              <div className="form-plaintext-group">
                <div className="form-label">ศูนย์ต้นทุน</div>
                <div className="form-text">{costTypeData?.ref_cost_no}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
