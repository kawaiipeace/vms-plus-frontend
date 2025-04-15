import Image from "next/image";
import { useRouter } from "next/navigation";

interface MobileFinishVehicleCardProps {
  id: string;
  carRegis: string;
  location: string;
  date: string;
}

export default function MobileFinishVehicleCard({
  id,
  carRegis,
  location,
  date,
}: MobileFinishVehicleCardProps) {
  const router = useRouter();

  const goToDetail = () => {
    router.push(`/request/${id}`);
  };

  return (
    <div className="card cursor-pointer" onClick={goToDetail}>
      <div className="card-body">
        <div className="card-body-inline">
          <div className="img img-square img-avatar flex-grow-1 align-self-start">
            <Image
              src="/assets/img/graphic/finish_vehicle.svg"
              width={100}
              height={100}
              alt="Finish Vehicle"
            />
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
