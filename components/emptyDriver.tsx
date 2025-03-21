import { useRef } from "react";
import Image from "next/image";
import SearchDriverModal from "./modal/searchDriverModal";
interface ZeroRecordProps {
  imgSrc: string;
  title: string;
  desc: string | React.ReactNode;
  button: string;
}
export default function EmptyDriver({
  imgSrc,
  title,
  desc,
  button,
}: ZeroRecordProps) {
    const searchDriverModalRef = useRef<{
      openModal: () => void;
      closeModal: () => void;
    } | null>(null);
  return (
    <div className="zerorecord">
      <div className="emptystate">
        <Image
          src={imgSrc}
          width={100}
          height={100}
          alt=""
        ></Image>
        <div className="emptystate-title">{title}</div>
        <div className="emptystate-text">
        {desc}
        </div>
        <div className="emptystate-action">
          <button className="btn btn-secondary btn-clearsearch"   
            onClick={() => searchDriverModalRef.current?.openModal()}
            >
            {button}
          </button>
        </div>
      </div>
      <SearchDriverModal ref={searchDriverModalRef} />
    </div>
  );
}
