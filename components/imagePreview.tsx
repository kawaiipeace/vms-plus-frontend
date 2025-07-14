// import Image from "next/image";
import React from "react";

interface ImagePreviewProps {
  image: File | string;
  onDelete: () => void;
}

const ImagePreview: React.FC<ImagePreviewProps> = ({ image, onDelete }) => {
  return (
    <div className="relative w-full overflow-hidden rounded-lg">
      <div
        className="flex items-center justify-center p-3 rounded-full bg-gray-100 w-[40px] h-[40px] absolute top-3 right-3 cursor-pointer z-10"
        onClick={onDelete}
      >
        <i className="material-symbols-outlined in-circle-icon">delete</i>
      </div>
      <div className="relative w-full h-[200px] flex items-center justify-center">
        {/* <Image
          className="max-w-full max-h-full object-contain"
          src={typeof image === "string" ? image : URL.createObjectURL(image)}
          alt="Preview"
          fill
        /> */}
        <img
          className="object-contain object-top w-full"
          src={typeof image === "string" ? image : URL.createObjectURL(image)}
          alt="Preview"
        />
      </div>
    </div>
  );
};

export default ImagePreview;
