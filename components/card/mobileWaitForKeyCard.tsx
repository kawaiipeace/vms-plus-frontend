import Image from "next/image";

export default function MobileWaitForKeyCard() {
  return (
    <div className="card">
      <div className="card-body">
        <div className="card-body-inline">
          <div className="img img-square img-avatar flex-grow-1 align-self-start">
            <Image
              src="/assets/img/graphic/status_key_pickup.png"
              width={100}
              height={100}
              alt=""
            />
          </div>
          <div className="card-content">
            <div className="card-content-top">
              <div className="card-title">
                รอรับกุญแจ{" "}
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

        <div className="card-item-group d-flex flex-column">
          <div className="card-item">
            <i className="material-symbols-outlined">location_on</i>
            <span className="card-item-text">อาคาร LED ชั้น 3</span>
          </div>
          <div className="card-item">
            <i className="material-symbols-outlined">calendar_month</i>
            <span className="card-item-text">28/12/2024</span>
          </div>
        </div>

        <div className="card-actions card-actions-column">
          <button className="btn btn-secondary">บันทึกเดินทาง</button>
          <button className="btn btn-secondary">เติมเชื้อเพลิง</button>
          <button className="btn btn-secondary">บัตรเดินทาง</button>
          <button className="btn btn-secondary">
            คืนยานพาหนะ{" "}
            <i className="material-symbols-outlined icon-settings-fill-300-24 text-error">
              error
            </i>
          </button>
        </div>
      </div>
    </div>
  );
}
