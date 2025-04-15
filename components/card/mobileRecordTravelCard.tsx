import Image from "next/image";
import { useRouter } from "next/navigation";

interface MobileRecordTravelCardProps {
  id: string;
  reviewCarDrive: () => void;
  returnCarAdd: () => void;
}

export default function MobileRecordTravelCard({
  id,
  reviewCarDrive,
  returnCarAdd,
}: MobileRecordTravelCardProps) {
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
              src="/assets/img/graphic/status_vehicle_inuse.png"
              width={100}
              height={100}
              alt="status vehicle in use"
            />
          </div>
          <div className="card-content">
            <div className="card-content-top">
              <div className="card-title">
                บันทึกการเดินทาง{" "}
                <i className="material-symbols-outlined icon-settings-400-20">
                  keyboard_arrow_right
                </i>
              </div>
              <div className="card-subtitle">5กก 1234 กรุงเทพมหานคร</div>
              <div className="supporting-text-group supporting-text-column">
                <div className="supporting-text text-truncate">
                  การไฟฟ้าเขต ฉ.1 และ กฟฟ. ในสังกัด
                </div>
                <div className="supporting-text text-truncate">
                  01/01/2567 - 07/01/2567
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="card-item-group !grid-cols-1 d-flex">
          <div className="card-item">
            <i className="material-symbols-outlined">info</i>
            <span className="card-item-text">กรุณาคืนยานพาหนะ</span>
          </div>
        </div>

        <div className="card-actions card-actions-column">
          <button className="btn btn-secondary" onClick={() => router.push(`/request/${id}/travel-log`)}>
            บันทึกเดินทาง
          </button>
          <button className="btn btn-secondary" onClick={() => router.push(`/request/${id}/fuel`)}>
            เติมเชื้อเพลิง
          </button>
          <button className="btn btn-secondary" onClick={reviewCarDrive}>
            ให้คะแนนผู้ขับขี่
          </button>
          <button className="btn btn-secondary" onClick={returnCarAdd}>
            คืนยานพาหนะ{" "}
            <i className="material-symbols-outlined icon-settings-fill-300-24 text-error">error</i>
          </button>
        </div>
      </div>
    </div>
  );
}
