import Image from "next/image";
interface RequestStatusBox {
  imgSrc: string;
  title: string;
  number: number;
}
export default function RequestStatusBox({
  imgSrc,
  title,
  number,
}: RequestStatusBox) {
  return (
    <div className="border border-gray-200 p-3 rounded-xl">
      <div className="flex items-center gap-4">
        <Image
          className="size-12"
          src={imgSrc}
          width={100}
          height={100}
          alt="waiting_icon"
        />
        <span className="font-medium text-base">{title}</span>
      </div>
      <p className="text-3xl font-medium mt-3">{number}</p>
    </div>
  );
}
