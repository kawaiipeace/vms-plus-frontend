import { fetchCodeTypeFromCode } from "@/services/masterService";
import { useEffect, useState } from "react";

interface Props {
  refCostTypeCode?: string;
  costCenter?: string;
  activityNo?: string;
  wbsNo?: string;
  networkNo?: string;
  pmOrderNo?: string;
}

export default function DisburstmentCard({
  refCostTypeCode,
  costCenter,
  activityNo,
  wbsNo,
  networkNo,
  pmOrderNo,
}: Props) {
  const [costTypeData, setCostTypeData] = useState<any>();

  useEffect(() => {
    console.log('tt',activityNo);
    if (refCostTypeCode) {
      const fetchCostTypeFromCodeFunc = async () => {
        try {
          const response = await fetchCodeTypeFromCode(refCostTypeCode);
          setCostTypeData(response.data);
        } catch (error) {
          console.error("API Error:", error);
        }
      };
      fetchCostTypeFromCodeFunc();
    }
  }, [refCostTypeCode]);

  return (
    <div className="form-card">
      <div className="form-card-body">
        <div className="grid grid-cols-12 gap-4">
          {costTypeData?.ref_cost_type_name && (
            <div className="col-span-12 md:col-span-6">
              <div className="form-group form-plaintext">
                <i className="material-symbols-outlined">paid</i>
                <div className="form-plaintext-group">
                  <div className="form-label">ประเภทงบประมาณ</div>
                  <div className="form-text">
                    {costTypeData.ref_cost_type_name}
                  </div>
                </div>
              </div>
            </div>
          )}
          {(String(refCostTypeCode) === "1" || String(refCostTypeCode) === "2") && (
            <>
              {costCenter && (
                <div className="col-span-12 md:col-span-6">
                  <div className="form-group form-plaintext">
                    <i className="material-symbols-outlined">account_balance</i>
                    <div className="form-plaintext-group">
                      <div className="form-label">ศูนย์ต้นทุน</div>
                      <div className="form-text">{costCenter}</div>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}

          {String(refCostTypeCode) === "3" && (
            <>
              {activityNo && (
                <div className="col-span-12 md:col-span-6">
                  <div className="form-group form-plaintext">
                    {/* <i className="material-symbols-outlined">list_alt</i> */}
                    <div className="form-plaintext-group">
                      <div className="form-label">เลขที่กิจกรรม</div>
                      <div className="form-text">{activityNo}</div>
                    </div>
                  </div>
                </div>
              )}

              {wbsNo && (
                <div className="col-span-12 md:col-span-6">
                  <div className="form-group form-plaintext">
                    {/* <i className="material-symbols-outlined">timeline</i> */}
                    <div className="form-plaintext-group">
                      <div className="form-label">เลขที่ WBS</div>
                      <div className="form-text">{wbsNo}</div>
                    </div>
                  </div>
                </div>
              )}

              {networkNo && (
                <div className="col-span-12 md:col-span-6">
                  <div className="form-group form-plaintext">
                    {/* <i className="material-symbols-outlined">share</i> */}
                    <div className="form-plaintext-group">
                      <div className="form-label">เลขที่โตรงข่าย</div>
                      <div className="form-text">{networkNo}</div>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
          {String(refCostTypeCode) === "4" && (
            <>
              {pmOrderNo && (
                <div className="col-span-12 md:col-span-6">
                  <div className="form-group form-plaintext">
                    {/* <i className="material-symbols-outlined">assignment</i> */}
                    <div className="form-plaintext-group">
                      <div className="form-label">เลขที่ใบสั่ง</div>
                      <div className="form-text">{pmOrderNo}</div>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
