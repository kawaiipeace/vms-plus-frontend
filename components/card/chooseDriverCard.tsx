import Image from "next/image";

interface Props {
  chooseDriver?: boolean;
  number?: number;
}

export default function ChooseDriverCard({ chooseDriver, number }: Props) {
  return (
    <div className="card card-section-inline mt-5">
      <div className="card-body card-body-inline">
        <div className="img img-square img-avatar flex-grow-1 align-self-start">
          <Image
            src="/assets/img/graphic/admin_select_driver_small.png"
            className="rounded-md"
            width={100}
            height={100}
            alt=""
          />
        </div>
        <div className="card-content">
          <div className="card-content-top">
            <div className="card-title">ผู้ดูแลเลือกพนักงานขับรถให้</div>
            <div className="supporting-text-group">
              <div className="supporting-text">สายงานดิจิทัล</div>
            </div>
          </div>

          <div className="card-item-group d-flex">
            <div className="card-item">
              <i className="material-symbols-outlined">group</i>
              <span className="card-item-text">ว่าง {number} คน</span>
            </div>
          </div>
        </div>
      </div>
      <div className="px-4 pb-4">
        {chooseDriver && (
            <div className="card-actions">
            <button className="btn btn-primary w-full">
              เลือกพนักงานขับรถ
            </button>
          </div>
          )}
          </div>
    </div>
  );
}
