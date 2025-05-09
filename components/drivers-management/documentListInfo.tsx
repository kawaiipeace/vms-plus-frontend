import React from "react";
import DocItem from "@/components/drivers-management/docItem";

const DocumentListInfo = () => {
  return (
    <div className="flex flex-col">
      <div>
        <h5 className="text-[#475467] font-semibold mb-3">รูปใบขับขี่, บัตรประชาชน, ทะเบียนบ้าน ฯลฯ</h5>
        <div className="flex flex-col gap-y-3">
          <DocItem />
          <DocItem />
        </div>
      </div>
      <div className="mt-5">
        <h5 className="text-[#475467] font-semibold mb-3">รูปใบรับรองการอบรม</h5>
        <div className="flex flex-col gap-y-3">
          <DocItem />
        </div>
      </div>
    </div>
  );
};

export default DocumentListInfo;
