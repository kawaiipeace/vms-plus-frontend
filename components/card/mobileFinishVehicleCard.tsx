import Image from "next/image";

interface MobileFinishVehicleCardProps {
  carRegis: string;
  location: string;
  date: string;
}

export default function MobileFinishVehicleCard({ carRegis, location, date }: MobileFinishVehicleCardProps) {
  return (
    <div className="card">
      <div className="card-body">
        <div className="card-body-inline">
          <div className="img img-square img-avatar flex-grow-1 align-self-start">
            <Image src="/assets/img/graphic/finish_vehicle.svg" width={100} height={100} alt="" />
          </div>
          <div className="card-content">
            <div className="card-content-top">
              <div className="card-title">เสร็จสิ้น</div>
              <div className="card-subtitle">{carRegis}</div>
              <div className="supporting-text-group supporting-text-column">
                <div className="supporting-text text-truncate">{location}</div>
                <div className="supporting-text text-truncate">{date}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
