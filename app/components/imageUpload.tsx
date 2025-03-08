import React from "react";

interface ImageUploadProps {
  images: File[];
  onImageChange: (images: File[]) => void;
  onDeleteImage: (index: number) => void;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ onImageChange }) => {
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      onImageChange(Array.from(e.target.files));
    }
  };

  return (
    <div className="image-upload-container">
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
      {/* <div className="image-preview flex flex-wrap gap-3">
        {img.map((image, index) => (
          <ImagePreview key={index} image={image} onDelete={() => onDeleteImage(index)} />
        ))}
      </div> */}
    </div>
  );
};

export default ImageUpload;
