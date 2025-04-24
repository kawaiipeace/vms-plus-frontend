import Image from "next/image";
import { useRouter } from "next/navigation";

interface MobileWaitingCardProps {
  id?: string;
  imageSrc?: string;
  imageAlt?: string;
  cardTitle?: string;
  cardSubtitle?: string;
  supportingTexts?: string[];
  cardItemText?: string;
}

export default function MobileWaitingCard({
  id,
  imageSrc = "/assets/img/graphic/status_waiting_approval.png",
  imageAlt = "Default Image",
  cardTitle = "รออนุมัติ",
  cardSubtitle = "",
  supportingTexts = [],
  cardItemText = "",
}: MobileWaitingCardProps) {
  const router = useRouter();
  return (
    <div className="card" onClick={() => router.push('/vehicle-booking/request-list/'+ id)}>
      <div className="card-body">
        <div className="card-body-inline">
          <div className="img img-square img-avatar flex-grow-1 align-self-start">
            <Image
              src={imageSrc}
              width={100}
              height={100}
              alt={imageAlt}
            />
          </div>
          <div className="card-content">
            <div className="card-content-top">
              <div className="card-title">
                {cardTitle}{" "}
                <i className="material-symbols-outlined icon-settings-400-20">
                  keyboard_arrow_right
                </i>
              </div>
              <div className="card-subtitle">{cardSubtitle}</div>
              <div className="supporting-text-group supporting-text-column">
                {supportingTexts.map((text, index) => (
                  <div key={index} className="supporting-text text-truncate">
                    {text}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="card-item-group d-flex">
          <div className="card-item">
            <i className="material-symbols-outlined">info</i>
            <span className="card-item-text">{cardItemText}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
