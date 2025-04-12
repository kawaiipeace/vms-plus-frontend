import Image from "next/image";

export default function ImgSlider() {
  const images = [
    { src: "/images/img1.jpg", alt: "Image approval 1" },
    { src: "/images/img2.jpg", alt: "Image approval 2" },
  ];

  return (
    <div className="relative">
      <div className="carousel w-full rounded-lg overflow-hidden h-[356px]">
        {images.map((image, index) => (
          <div key={index} className="w-full overflow-hidden rounded-2xl">
            <Image
              src={image.src}
              alt={image.alt}
              layout="responsive"
              width={100}
              height={100}
              className="object-cover min-h-full w-full"
            />
          </div>
        ))}
      </div>

      {/* Navigation Arrows - Static */}
      <div className="absolute slick-arrow left-[2rem] top-2/4 transform -translate-y-1/3">
        <a className="btn w-[40px] h-[40px] rounded-full min-h-0 pointer-events-none opacity-50">
          <i className="material-symbols-outlined icon-settings-400-20">keyboard_arrow_left</i>
        </a>
      </div>
      <div className="absolute slick-arrow right-[2rem] top-2/4 transform -translate-y-1/3">
        <a className="btn w-[40px] h-[40px] rounded-full min-h-0 pointer-events-none opacity-50">
          <i className="material-symbols-outlined icon-settings-400-20">keyboard_arrow_right</i>
        </a>
      </div>

      {/* Indicators - Static */}
      <div className="indicator-daisy absolute bottom-[2em] left-1/2 transform -translate-x-1/2 flex space-x-2">
        {images.map((_, index) => (
          <span
            key={index}
            className={`btn btn-xs ${index === 0 ? "active" : ""} pointer-events-none`}
          ></span>
        ))}
      </div>
    </div>
  );
}
