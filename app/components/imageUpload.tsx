import React, { useState } from "react";
import ImagePreview from "@/app/components/imagePreview";

interface ImageUploadProps {
  images: File[];
  onImageChange: (images: File[]) => void;
  onDeleteImage: (index: number) => void;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ images, onImageChange, onDeleteImage }) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      onImageChange(Array.from(e.target.files));
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files) {
      onImageChange(Array.from(e.dataTransfer.files));
    }
  };

  return (
    <div className={`image-upload-container ${isDragging ? "dragging" : ""}`} onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={handleDrop}>
      <label className="image-upload-label">
        <div className="image-upload-content">
          <div className="flex items-center justify-center p-3 rounded-full bg-gray-100 w-[40px] h-[40px]">
            <i className="material-symbols-outlined">cloud_upload</i>
          </div>

          <p>
            <span className="text-[#A80689] font-bold">คลิกเพื่อเลือกไฟล์</span> หรือลากไฟล์มาวางบริเวณนี้
          </p>
          <p className="image-upload-formats">SVG, PNG, JPG or GIF</p>
        </div>
        <input type="file" multiple onChange={handleImageChange} className="image-upload-input" />
      </label>
    </div>
  );
};

export default ImageUpload;
