import Image from "next/image";
interface ZeroRecordProps {
  imgSrc: string;
  title: string;
  desc: string | React.ReactNode;
  button: string;
}
export default function ZeroRecord({
  imgSrc,
  title,
  desc,
  button,
}: ZeroRecordProps) {
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
          <button className="btn btn-secondary btn-clearsearch">
            {button}
          </button>
        </div>
      </div>
    </div>
  );
}
