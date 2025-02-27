import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="page-login">
      <div className="login-left">
        <div className="login-left-container">
          <div className="login-brand">
            <Image className="login-brand-img" src="assets/img/brand.svg" width={189} height={77} alt=""></Image>
            <div className="login-brand-title">ระบบจัดการยานพาหนะ VMS Plus</div>
            <div className="login-brand-subtitle">เรื่องเดินทางไม่ใช่ปัญหา ยืมรถสะดวก ง่าย เร็ว ทันใจ</div>
          </div>
  
          <div className="login-label">เข้าสู่ระบบด้วยบัญชี</div>

          <div className="login-type">
            <Link href="login-authen" className="login-type-link login-type-internal">
              <Image src="assets/img/login_pea.svg" width={80} height={85} alt=""></Image>
              <div className="login-type-link-label">พนักงาน กฟภ.</div>
            </Link>
            <Link href="login-os" className="login-type-link login-type-outsource">
              <Image src="assets/img/login_outsource.svg" width={80} height={85} alt=""></Image>
              <div className="login-type-link-label">บุคคลภายนอก</div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
