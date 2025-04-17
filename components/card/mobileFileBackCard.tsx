import Image from "next/image";
import { useRouter } from "next/navigation";

interface MobileFileBackCardProps {
  id?: string;
  imageSrc?: string;
  imageAlt?: string;
  cardTitle?: string;
  cardSubtitle?: string;
  supportingTexts?: string[];
  cardItemText?: string;
  showEditButton?: boolean;
}

export default function MobileFileBackCard({
  id,
  imageSrc = "/assets/img/graphic/status_reject_request.png",
  imageAlt = "Rejected Request",
  cardTitle = "ถูกตีกลับ",
  cardSubtitle = "",
  supportingTexts = [],
  cardItemText = "ถูกตีกลับจากผู้ดูแลยานพาหนะ",
  showEditButton = true,
}: MobileFileBackCardProps) {
  const router = useRouter();

  return (
    <div className="card" onClick={() => router.push('/vehicle-booking/request-list/' + id + '/edit')}>
      <div className="card-body">
        <div className="card-body-inline">
          <div className="img img-square img-avatar flex-grow-1 align-self-start">
            <Image src={imageSrc} width={100} height={100} alt={imageAlt} />
          </div>
          <div className="card-content">
            <div className="card-content-top">
              <div className="card-title">
                {cardTitle}
                <i className="material-symbols-outlined icon-settings-400-20">keyboard_arrow_right</i>
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

        {showEditButton && <button className="btn btn-secondary">แก้ไข</button>}
      </div>
    </div>
  );
}
