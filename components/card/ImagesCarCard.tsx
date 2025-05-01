import Image from "next/image";

const ImagesCarCard = ({ images }: { images?: string[] }) => {
  return (
    <div className="form-card">
      <div className="form-card-body">
        <div className="w-[80vw] mx-auto overflow-x-auto">
          <div className="w-[560px] flex justify-center gap-4">
            <div className="w-[280px] aspect-square rounded-xl overflow-hidden">
              <Image
                className="object-cover object-center"
                src={images?.[0] || "/assets/img/sample-car.jpeg"}
                width={900}
                height={900}
                alt=""
              />
            </div>
            <div className="w-[280px] grid grid-cols-2 gap-4">
              {images &&
                images?.length > 1 &&
                images
                  ?.filter((_, index) => index > 0)
                  ?.map((src, index) => (
                    <div className="w-[140px] aspect-square rounded-xl overflow-hidden">
                      <Image
                        key={index}
                        className="object-cover object-center"
                        src={src || "/assets/img/sample-car.jpeg"}
                        width={900}
                        height={900}
                        alt=""
                      />
                    </div>
                  ))}
              {/* <div className="w-[140px] aspect-square rounded-xl overflow-hidden">
                <Image
                  className="object-cover object-center"
                  src="/assets/img/sample-car.jpeg"
                  width={900}
                  height={900}
                  alt=""
                />
              </div>
              <div className="w-[140px] aspect-square rounded-xl overflow-hidden">
                <Image
                  className="object-cover object-center"
                  src="/assets/img/sample-car.jpeg"
                  width={900}
                  height={900}
                  alt=""
                />
              </div>
              <div className="w-[140px] aspect-square rounded-xl overflow-hidden">
                <Image
                  className="object-cover object-center"
                  src="/assets/img/sample-car.jpeg"
                  width={900}
                  height={900}
                  alt=""
                />
              </div> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImagesCarCard;
