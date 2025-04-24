import Image from "next/image";

interface CarTypeCardProps {
  imgSrc: string;
  title: string;
  text: string;
  name: string;
  selectedValue: string;
  setSelectedValue: (value: string) => void;
}

export default function CarTypeCard({
  imgSrc,
  title,
  text,
  name,
  selectedValue,
  setSelectedValue,
}: CarTypeCardProps) {
  return (
    <div
    className={`card p-0 cursor-pointer border ${
      selectedValue === title ? "active border-brand-900" : "border-gray-300"
    }`}
    onClick={() => setSelectedValue(title)}
    style={{ height: "240px", display: "flex", flexDirection: "column" }}
  >
    <div className="card-body flex flex-col h-full gap-4">
      <div className="card-img-top rounded-md overflow-hidden h-[8em] flex justify-center items-center">
        <Image src={imgSrc} width={100} height={100} alt={title} />
      </div>
  
      <label className="grid grid-cols-12 items-start gap-2 cursor-pointer new-radio-custom">
        <input
          type="radio"
          className="hidden"
          name={name}
          value={title}
          checked={selectedValue === title}
          onChange={() => setSelectedValue(title)}
        />
        <div
          className={`os-radio w-5 h-5 rounded-full border-2 col-span-2 ${
            selectedValue === title
              ? "active border-brand-900 bg-brand-900"
              : "border-gray-300"
          } flex items-center justify-center`}
        >
          {selectedValue === title && (
            <div className="circle-radio w-2 h-2 bg-white rounded-full"></div>
          )}
        </div>
        <div className="custom-control-label col-span-10">
          <div className="custom-control-label-group">
            <div className="custom-control-label-text line-clamp-2">{title}</div>
            <div className="custom-control-label-suptext text-sm text-gray-500">
              ว่าง: {text} คัน
            </div>
          </div>
        </div>
      </label>
    </div>
  </div>
  
  );
}
