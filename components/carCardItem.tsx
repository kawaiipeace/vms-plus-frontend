import Image from "next/image";

interface Props {
  icon: string;
  title: string;
  value: string;
  images?: string[];
}

export default function CarCardItem({ icon, title, value, images }: Props) {
  return (
    <div className="card-item flex justify-between items-center">
      <div className="flex items-center w-50 gap-2 flex-wrap">
        <i className="material-symbols-outlined">{icon}</i>
        <span className="card-item-text">{title}</span>

        {images && images.length > 0 && (
          <div className="flex gap-2 items-center flex-wrap">
            {images.map((image, index) => (
              <Image
                key={index}
                src={image}
                alt={`image-${index}`}
                width={16}
                height={16}
                className="rounded-full"
              />
            ))}
          </div>
        )}
      </div>
      <div className="card-item-text w-50 text-right">{value}</div>
    </div>
  );
}
