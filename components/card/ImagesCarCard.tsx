import Image from "next/image";

const ImagesCarCard = ({ images }: { images?: string[] }) => {
  const mainImage =
    images && images.length > 0 ? images[0] : "/assets/img/sample-car.jpeg";
  const otherImages = images && images.length > 1 ? images.slice(1) : [];

  return (
    <div className="form-card">
      <div className="form-card-body overflow-hidden">
        <div className="w-[80vw] mx-auto overflow-hidden">
          <div className="flex w-[48%] gap-4">
            {/* Main image - 50% */}
            <div className="flex-1 aspect-square rounded-md overflow-hidden">
              <Image
                className="object-cover object-center h-full w-full"
                src={mainImage}
                width={900}
                height={900}
                alt="Main car image"
              />
            </div>

            {/* Other images - 50% */}
            <div className="flex-1 grid grid-cols-2 gap-4">
              {otherImages.map((src, index) => (
                <div
                  key={index}
                  className="w-full aspect-square rounded-md overflow-hidden"
                >
                  <Image
                    className="object-cover object-center h-full w-full"
                    src={src || "/assets/img/sample-car.jpeg"}
                    width={900}
                    height={900}
                    alt={`Car image ${index + 1}`}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImagesCarCard;
