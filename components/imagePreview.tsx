import Image from "next/image";
import React from "react";

interface ImagePreviewProps {
  image: File | string;
  onDelete: () => void;
}

const ImagePreview: React.FC<ImagePreviewProps> = ({ image, onDelete }) => {
  return (
    <div className="relative w-full h-[124px] aspect-square overflow-hidden rounded-lg">
      <div
        className="flex items-center justify-center p-3 rounded-full bg-gray-100 w-[40px] h-[40px] absolute top-3 right-3 cursor-pointer"
        onClick={onDelete}
      >
        <i className="material-symbols-outlined">delete</i>
      </div>
      <Image
        className="object-cover object-center w-full h-full"
        src={typeof image === "string" ? image : URL.createObjectURL(image)}
        alt="Preview"
        width={300}
        height={300}
      />
    </div>
  );
};

export default ImagePreview;
