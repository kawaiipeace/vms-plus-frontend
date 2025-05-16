import { VehicleManagementProps } from "@/app/types/vehicle-management/vehicle-list-type";
import Image from "next/image";
import Link from "next/link";

export default function VehicleNoData({
    imgSrc,
    title,
    desc,
    button,
    icon,
    link,
    displayBtn,
    btnType,
    useModal
}: VehicleManagementProps) {
    return (
        <div className="zerorecord">
            <div className="emptystate">
                <Image src={imgSrc} width={100} height={100} alt=""></Image>

                <div className="emptystate-title">{title}</div>
                <div className="emptystate-text">{desc}</div>
                <div className="emptystate-action">
                    {
                        useModal
                            ? <button onClick={useModal} className="border border-gray-300 rounded-lg px-4 py-1 transition cursor-pointer">
                                {button}
                            </button>
                            :
                            <Link href={link ? link : ""} className={`btn btn-${btnType == "secondary" ? "secondary" : "primary"}${displayBtn ? "" : " hidden"}`}>
                                {icon && <i className="material-symbols-outlined">add</i>}
                                {button}
                            </Link>
                    }

                </div>
            </div>
        </div>
    );
} 