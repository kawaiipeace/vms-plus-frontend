import LoginHeader from "../components/loginHeader";
import BackButton from "../components/backButton";

export default function LoginAuthen() {
  return (
   <div className="page-login page-login-authen">
      <LoginHeader />

      <div className="login-container">
        <BackButton />
        <div className="login-heading text-center">
          <div className="login-heading-title">OTP Verification</div>
          <div className="login-heading-subtitle">กรอกรหัส OTP 6 หลัก ที่ส่งไปยังหมายเลข +6690*****67 <br></br> หากยังไม่ได้รับ กดขอรหัสใหม่ได้เมื่อครบกำหนดเวลา</div>
        </div>

        <div className="form-group">
          <div className="input-otp w-6/6">
            <input type="text" className="form-control" maxLength={1} placeholder="" />
            <input type="text" className="form-control" maxLength={1} placeholder="" />
            <input type="text" className="form-control" maxLength={1} placeholder="" />
            <input type="text" className="form-control" maxLength={1} placeholder="" />
            <input type="text" className="form-control" maxLength={1} placeholder="" />
            <input type="text" className="form-control" maxLength={1} placeholder="" />
          </div>
          <span className="form-helper">รหัสอ้างอิง : HYPL</span>
          {/* <!-- <span className="form-helper text-error"><i className="material-symbols-outlined icon-settings-fill-300-20">info</i>รหัส OTP หมดอายุแล้ว กรุณากด 'ขอรหัส OTP ใหม่' เพื่อกรอกอีกครั้ง</span> --> */}
        </div>

        <button className="btn btn-primary ibm-plex-sans-thai-semibold" disabled>เข้าสู่ระบบ</button>

        <div className="login-text">ยังไม่ได้รับรหัส OTP? ขอรหัสใหม่ในอีก <span className="login-timer">00:59</span></div>
      </div>
    </div>
  );
}
