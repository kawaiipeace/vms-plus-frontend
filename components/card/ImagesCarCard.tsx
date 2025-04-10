import Image from "next/image";

const ImagesCarCard = () => {
  return (
    <div className="form-card">
      <div className="form-card-body">
        <div className="w-[80vw] mx-auto overflow-x-auto">
          <div className="w-[560px] flex justify-center gap-4">
            <div className="w-[280px] aspect-square rounded-xl overflow-hidden">
              <Image className="object-cover object-center" src="/assets/img/sample-car.jpeg" width={900} height={900} alt="" />
            </div>
            <div className="w-[280px] grid grid-cols-2 gap-4">
              <div className="w-[140px] aspect-square rounded-xl overflow-hidden">
                <Image className="object-cover object-center" src="/assets/img/sample-car.jpeg" width={900} height={900} alt="" />
              </div>
              <div className="w-[140px] aspect-square rounded-xl overflow-hidden">
                <Image className="object-cover object-center" src="/assets/img/sample-car.jpeg" width={900} height={900} alt="" />
              </div>
              <div className="w-[140px] aspect-square rounded-xl overflow-hidden">
                <Image className="object-cover object-center" src="/assets/img/sample-car.jpeg" width={900} height={900} alt="" />
              </div>
              <div className="w-[140px] aspect-square rounded-xl overflow-hidden">
                <Image className="object-cover object-center" src="/assets/img/sample-car.jpeg" width={900} height={900} alt="" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImagesCarCard;
