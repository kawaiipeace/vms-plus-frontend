import Image from "next/image";
import Link from "next/link";
interface ZeroRecordProps {
  imgSrc: string;
  title: string;
  desc: string | React.ReactNode;
  button: string;
  icon?: string;
  btnType?: string;
  link?: string;
}
export default function ZeroRecord({
  imgSrc,
  title,
  desc,
  button,
  icon,
  btnType,
  link,
}: ZeroRecordProps) {
  return (
    <div className="zerorecord">
      <div className="emptystate">
        <Image src={imgSrc} width={100} height={100} alt=""></Image>
        <div className="emptystate-title">{title}</div>
        <div className="emptystate-text">{desc}</div>
        <div className="emptystate-action">
          <Link
            href={ link ? link : "" }
            className={`btn btn-${
              btnType == "secondary" ? "secondary" : "primary"
            }`}
          >
            {icon && <i className="material-symbols-outlined">add</i>}
            {button}
          </Link>
        </div>
      </div>
    </div>
  );
}
