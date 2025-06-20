// import { UploadFileType } from "@/app/types/upload-type";
import { uploadFile } from "@/services/masterService";
import React, { useState } from "react";

interface ImageUploadProps {
  onImageChange: (images: UploadFileType2) => void;
}

interface UploadFileType2 {
  file_name: string;
  file_url: string;
  message: string;
}

const UploadFilePDF: React.FC<ImageUploadProps> = ({ onImageChange }) => {
  const [isDragging, setIsDragging] = useState(false);

  const formatFileSize = (fileSize: number): string => {
    if (fileSize < 1024) {
      return `${fileSize} Bytes`;
    } else if (fileSize < 1024 * 1024) {
      return `${(fileSize / 1024).toFixed(2)} KB`;
    } else {
      return `${(fileSize / (1024 * 1024)).toFixed(2)} MB`;
    }
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (!file) return;
    const allowedTypes = ["application/pdf"];

    if (!allowedTypes.includes(file.type)) {
      alert("Only PDF files are allowed.");
      e.target.value = "";
      return;
    }

    const response = await uploadFile(file);
    const response2 = {
      ...response,
      file_size: formatFileSize(file.size),
    };
    onImageChange(response2);
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

    const allowedTypes = ["application/pdf"];

    if (!allowedTypes.includes(file.type)) {
      alert("Only PDF files are allowed.");
      return;
    }

    const response = await uploadFile(file);
    onImageChange(response);
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
          <p className="image-upload-formats">PDF</p>
        </div>
        <input type="file" multiple onChange={handleImageChange} className="image-upload-input" accept=".pdf" />
      </label>
    </div>
  );
};

export default UploadFilePDF;
