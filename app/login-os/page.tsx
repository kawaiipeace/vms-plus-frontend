import LoginHeader from "../components/loginHeader";
import BackButton from "../components/backButton";
import Image from "next/image";

export default function LoginOS() {
  return (
   <div className="page-login page-login-outsource">
      <LoginHeader />

      <div className="login-container">
        <BackButton />
        <div className="login-heading">
          <div className="login-heading-title">ลงชื่อเข้าใช้งาน</div>
          <div className="login-heading-subtitle">สำหรับพนักงานขับรถ</div>
        </div>
        <div className="form-group">
        <label className="form-label">เบอร์โทรศัพท์</label>
        <label className="input input-group flex items-center gap-2">
          <span className="flex items-center justify-center h-10 w-10 text-gray-400">
             <i className="material-symbols-outlined icon-settings-300-20">smartphone</i>
          </span>
          <input type="text" placeholder="ระบุเบอร์โทรศัพท์" />
        </label>
        {/* <span className="form-helper">Helper</span> */}
        </div>

        <button className="btn btn-primary">ส่งรหัส OTP</button>
        <div className="form-divider">หรือ</div>
        <button className="btn btn-secondary btn-login-thaiid border border-[#D0D5DD]">ลงชื่อเข้าใช้งานผ่าน ThaID <Image src="/assets/img/thaiid.png" width={20} height={20} alt=""></Image></button>
      </div>
    </div>
  );
}
