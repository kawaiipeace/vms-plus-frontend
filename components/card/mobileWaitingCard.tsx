import Image from "next/image";
export default function MobileWaitingCard() {
  return (
    <div className="card">
      <div className="card-body">
        <div className="card-body-inline">
          <div className="img img-square img-avatar flex-grow-1 align-self-start">
            <Image
              src="/assets/img/graphic/status_waiting_approval.png"
              width={100}
              height={100}
              alt=""
            />
          </div>
          <div className="card-content">
            <div className="card-content-top">
              <div className="card-title">
                รออนุมัติ{" "}
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

        <div className="card-item-group d-flex">
          <div className="card-item">
            <i className="material-symbols-outlined">info</i>
            <span className="card-item-text">รออนุมัติจากต้นสังกัด</span>
          </div>
        </div>
      </div>
    </div>
  );
}
