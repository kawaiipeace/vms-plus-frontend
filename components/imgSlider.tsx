import Image from "next/image";
import { useState } from "react";

interface ImgSliderProps {
  id: string;
  images: string[];
}

export default function ImgSlider({ id, images }: ImgSliderProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  const handleIndicatorClick = (index: number, event: React.MouseEvent) => {
    event.preventDefault(); // Prevent default anchor click behavior
    setActiveIndex(index);
  };

  return (
    <div className="relative">
      <div className="carousel w-full rounded-lg overflow-hidden h-[356px]">
        {images.map((src, index) => (
          <div key={index} id={`slide${id}${index + 1}`} className={`carousel-item relative w-full flex-wrap flex-col ${index === activeIndex ? "active" : ""}`}>
            <div className="h-[22em] w-full overflow-hidden rounded-2xl">
              <Image src={src || ""} alt={`Image ${index + 1}`} layout="responsive" width={100} height={100} className="object-cover min-h-full w-full" />
            </div>
            {/* <div className="w-full text-center py-2">หน้าปัดเรือนไมล์</div> */}
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      <div className="absolute slick-arrow left-[2rem] top-2/4 transform -translate-y-1/3">
        <a href={`#slide${id}${activeIndex === 0 ? images.length : activeIndex}`} className="btn w-[40px] h-[40px] rounded-full min-h-0" onClick={() => setActiveIndex((activeIndex - 1 + images.length) % images.length)}>
          <i className="material-symbols-outlined icon-settings-400-20">keyboard_arrow_left</i>
        </a>
      </div>
      <div className="absolute slick-arrow right-[2rem] top-2/4 transform -translate-y-1/3">
        <a href={`#slide${id}${((activeIndex + 1) % images.length) + 1}`} className="btn w-[40px] h-[40px] rounded-full min-h-0" onClick={() => setActiveIndex((activeIndex + 1) % images.length)}>
          <i className="material-symbols-outlined icon-settings-400-20">keyboard_arrow_right</i>
        </a>
      </div>

      {/* Indicators */}
      <div className="indicator-daisy absolute bottom-[2em] left-1/2 transform -translate-x-1/2 flex space-x-2">
        {images.map((_, index) => (
          <a
            key={index}
            href={`#slide${id}${index + 1}`}
            className={`btn btn-xs ${activeIndex === index ? "active" : ""}`}
            onClick={(event) => handleIndicatorClick(index, event)} // Pass event to the handler
          ></a>
        ))}
      </div>
    </div>
  );
}
