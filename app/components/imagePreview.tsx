import React from "react";

interface ImagePreviewProps {
  image: File;
  onDelete: () => void;
}

const ImagePreview: React.FC<ImagePreviewProps> = ({ image, onDelete }) => {
  return (
    <div className="relative w-[180px] aspect-square">
      <div className="flex items-center justify-center p-3 rounded-full bg-gray-100 w-[40px] h-[40px] absolute top-3 right-3 cursor-pointer" onClick={onDelete}>
        <i className="material-symbols-outlined">delete</i>
      </div>
      <img className="object-cover h-full object-center" src={URL.createObjectURL(image)} alt="Preview" />
    </div>
  );
};

export default ImagePreview;
