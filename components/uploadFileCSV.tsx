// import { UploadFileType } from "@/app/types/upload-type";
// import { UploadCSVFileType } from "@/app/types/drivers-management-type";
// import { uploadFile } from "@/services/masterService";
import React, { useState } from "react";

export interface UploadCSVFileType {
  name: string;
  size: number;
  type: string;
  lastModified: number;
  file: File;
}

interface UploadCSVFileProps {
  onFileChange: (images: UploadCSVFileType) => void;
}

const UploadFileCSV: React.FC<UploadCSVFileProps> = ({ onFileChange }) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (!file) return;

    if (file.type !== "text/csv" && !file.name.endsWith(".csv")) {
      alert("ไม่สามารถนำเข้าได้เนื่องจาก File ผิด Format");
      e.target.value = "";
      return;
    }

    // const response = await uploadFile(file);
    onFileChange({
      name: file.name,
      size: file.size,
      type: file.type,
      lastModified: file.lastModified,
      file: file,
    });
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files?.[0] || null;
    if (!file) return;

    if (file.type !== "text/csv" && !file.name.endsWith(".csv")) {
      alert("ไม่สามารถนำเข้าได้เนื่องจาก File ผิด Format");
      return;
    }

    // const response = await uploadFile(file);
    onFileChange({
      name: file.name,
      size: file.size,
      type: file.type,
      lastModified: file.lastModified,
      file: file,
    });
  };

  return (
    <div
      className={`image-upload-container ${isDragging ? "dragging" : ""}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <label className="image-upload-label">
        <div className="image-upload-content">
          <div className="flex items-center justify-center p-3 rounded-full bg-gray-100 w-[40px] h-[40px]">
            <i className="material-symbols-outlined cloud-icon">cloud_upload</i>
          </div>

          <p>
            <span className="text-[#A80689] font-bold">คลิกเพื่อเลือกไฟล์</span> หรือลากไฟล์มาวางบริเวณนี้
          </p>
          <p className="image-upload-formats">CSV เท่านั้น</p>
        </div>
        <input type="file" multiple onChange={handleImageChange} className="image-upload-input" accept=".csv" />
      </label>
    </div>
  );
};

export default UploadFileCSV;
