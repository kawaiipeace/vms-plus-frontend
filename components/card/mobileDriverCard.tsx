import Image from "next/image";

interface MobileDriverCardProps {
  title: string;
  carRegis: string;
  location: string;
  date: string;
  cardType:
    | "recordTravel"
    | "waitCar"
    | "waitVerify"
    | "returnFail"
    | "waitKey"
    | "complete"
    | "cancel";
  noteText?: string;
  rating?: string;
  locationNote?: string; // ✅ New
  timeRange?: string; // ✅ New
  receivedKeyDate?: string; // ✅ New
  customIcon?: string; // ✅ New
}

export default function MobileDriverCard({
  title,
  carRegis,
  location,
  date,
  cardType,
  noteText,
  rating,
  locationNote,
  timeRange,
  receivedKeyDate,
  customIcon,
}: MobileDriverCardProps) {
  let image = "car.png";

  switch (cardType) {
    case "recordTravel":
      image = "status_vehicle_inuse.png";
      break;
    case "waitCar":
      image = "status_vehicle_pickup.png";
      break;
    case "waitVerify":
      image = "status_vehicle_inspection.png";
      break;
    case "returnFail":
      image = "status_vehicle_reject.png";
      break;
    case "waitKey":
      image = "status_key_pickup.png";
      break;
    case "complete":
      image = "finish_vehicle.svg";
      break;
    default:
      image = "cancel_img.svg";
      break;
  }

  return (
    <div className="card">
      <div className="card-body">
        <div className="card-body-inline">
          <div className="img img-square img-avatar flex-grow-1 align-self-start rounded-2xl overflow-hidden">
            <Image
              className="object-cover object-center"
              src={`/assets/img/graphic/${image}`}
              width={200}
              height={200}
              alt=""
            />
          </div>

          <div className="card-content">
            <div className="card-content-top">
              <div className="card-title">
                {title}
                {rating && (
                  <div className="flex items-center">
                    <i className="material-symbols-outlined text-[#A80689]">
                      star
                    </i>
                    {rating}
                  </div>
                )}
                <i className="material-symbols-outlined icon-settings-400-20">
                  keyboard_arrow_right
                </i>
              </div>
              <div className="card-subtitle">{carRegis}</div>
              <div className="supporting-text-group supporting-text-column">
                <div className="supporting-text text-truncate w-full">
                  {location}
                </div>
                <div className="supporting-text text-truncate w-full">
                  {date}
                </div>
              </div>
            </div>
          </div>
        </div>

        {noteText && (
          <div className="card-item-group d-flex">
            <div className="card-item">
              <i className="material-symbols-outlined">
                {customIcon || "info"}
              </i>
              <span className="card-item-text">{noteText}</span>
            </div>
          </div>
        )}

        {cardType === "waitCar" && (
          <div className="card-item-group grid !grid-cols-1">
            <div className="card-item">
              <i className="material-symbols-outlined">local_parking</i>
              <span className="card-item-text">{locationNote || "-"}</span>
            </div>
          </div>
        )}

        {cardType === "waitKey" && (
          <div className="card-item-group !grid-cols-1">
            <div className="w-full card-item">
              <i className="material-symbols-outlined">location_on</i>
              <span className="card-item-text">{locationNote || "-"}</span>
            </div>
            <div className="w-full grid grid-cols-2 gap-2">
              <div className="card-item">
                <i className="material-symbols-outlined">calendar_month</i>
                <span className="card-item-text">{receivedKeyDate || "-"}</span>
              </div>
              <div className="card-item">
                <i className="material-symbols-outlined">schedule</i>
                <span className="card-item-text">{timeRange || "-"}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
