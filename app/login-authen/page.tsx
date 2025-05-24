"use client";
import BackButton from "@/components/backButton";
import LoginHeader from "@/components/loginHeader";
import { useProfile } from "@/contexts/profileContext";
import { fetchProfile, requestOTP, verifyOTP } from "@/services/authService";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function LoginAuthen() {
  const router = useRouter();
  const { setProfile } = useProfile();
  const [otpID, setOtpID] = useState<string | null>(null);
  const [phone, setPhone] = useState<string | null>(null);
  const [referenceCode, setRefCode] = useState<string | null>(null);
  const [otp, setOtp] = useState<string[]>(new Array(6).fill(""));
  const [timeLeft, setTimeLeft] = useState(60);
  const [timerText, setTimerText] = useState("01:00");
  const [error, setError] = useState<string>("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prevTime) => {
          const newTime = prevTime - 1;
          const minutes = Math.floor(newTime / 60);
          const seconds = newTime % 60;
          setTimerText(`${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`);
          return newTime;
        });
      }, 1000);
    } else {
      setTimerText("ขอรหัสใหม่อีกครั้ง");
    }

    const storedPhone = sessionStorage.getItem("phone");
    const storedOtpID = sessionStorage.getItem("otpID");
    const refCode = sessionStorage.getItem("refCode");

    // console.log("Stored Phone:", storedPhone);

    if (storedPhone) setPhone(storedPhone);
    if (storedOtpID) setOtpID(storedOtpID);
    if (refCode) setRefCode(refCode);

    return () => clearInterval(interval);
  }, [timeLeft]);

  const requestOTPAgain = async () => {
    if (!phone || timeLeft > 0) return;

    setIsResending(true);
    try {
      const response = await requestOTP(phone);
      if (response.status === 200) {
        sessionStorage.setItem("otpID", response.data.otpId);
        sessionStorage.setItem("refCode", response.data.refCode);
        setTimeLeft(60);
        setTimerText("01:00");
        setOtp(new Array(6).fill(""));
        setError("");
      }
    } catch (error) {
      console.error("Error requesting OTP:", error);
      setError("เกิดข้อผิดพลาดในการขอรหัส OTP ใหม่");
    } finally {
      setIsResending(false);
    }
  };

  const verifyotp = async () => {
    if (!isOtpComplete || isVerifying) return;

    setIsVerifying(true);
    setError("");

    const otpData = {
      otp: otp.join(""),
      otpId: String(otpID),
    };

    try {
      const response = await verifyOTP(otpData);
      if (response.status === 200) {
        localStorage.setItem("accessToken", response.data.accessToken);
        localStorage.setItem("refreshToken", response.data.refreshToken);

        // Fetch and set profile before redirecting
        const profileResponse = await fetchProfile();
        setProfile(profileResponse.data);
        router.push("/vehicle-booking/request-list");
      }
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || "เกิดข้อผิดพลาดในการตรวจสอบ OTP";
      setError(errorMessage);

      if (errorMessage.includes("หมดอายุ")) {
        setOtp(new Array(6).fill(""));
        setTimeLeft(60);
        setTimerText("01:00");
      } else if (errorMessage.includes("5 นาที")) {
        setOtp(new Array(6).fill(""));
        setTimeLeft(300);
        setTimerText("05:00");
      } else if (errorMessage.includes("30 นาที")) {
        setOtp(new Array(6).fill(""));
        setTimeLeft(1800);
        setTimerText("30:00");
      }
    } finally {
      setIsVerifying(false);
    }
  };

  const handleOtpChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const value = e.target.value;
    if (/^\d$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      if (index < otp.length - 1) {
        const nextInput = document.getElementById(`otp-input-${index + 1}`);
        if (nextInput) nextInput.focus();
      }
    } else {
      e.target.value = "";
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "Backspace") {
      e.preventDefault(); // กัน default ที่จะไม่พา focus ถอย

      const newOtp = [...otp];

      if (otp[index]) {
        // ถ้ามีค่าในช่องนี้ → ลบ และถอยกลับ
        newOtp[index] = "";
        setOtp(newOtp);

        if (index > 0) {
          const prevInput = document.getElementById(`otp-input-${index - 1}`);
          prevInput?.focus();
        }
      } else if (index > 0) {
        // ถ้าไม่มีค่าแล้ว → ลบช่องก่อนหน้า
        newOtp[index - 1] = "";
        setOtp(newOtp);

        const prevInput = document.getElementById(`otp-input-${index - 1}`);
        prevInput?.focus();
      }
    }
  };

  const isOtpComplete = otp.every((digit) => digit !== "");

  // console.log("Timer text:", timerText);

  return (
    <div className="page-login page-login-authen">
      <LoginHeader />

      <div className="login-container">
        <BackButton />
        <div className="login-heading text-center">
          <div className="login-heading-title">OTP Verification</div>
          <div className="login-heading-subtitle">
            กรอกรหัส OTP 6 หลัก ที่ส่งไปยังหมายเลข {`+66${phone?.slice(1, 3)}*****${phone?.slice(-2)}`} <br />
            หากยังไม่ได้รับ กดขอรหัสใหม่ได้เมื่อครบกำหนดเวลา
          </div>
        </div>

        <div className={`form-group ${error && " form-error"}`}>
          <div className="input-otp w-6/6 flex gap-2">
            {otp.map((digit, index) => (
              <input
                key={index}
                id={`otp-input-${index}`}
                type="text"
                className={`form-control w-1/6 text-center ${error && "is-invalid"}`}
                maxLength={1}
                value={digit}
                onChange={(e) => handleOtpChange(e, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                placeholder=""
                autoFocus={index === 0}
                disabled={isVerifying ?? (error && error.includes("เกินกำหนด"))}
              />
            ))}
          </div>
          <span className="form-helper">รหัสอ้างอิง : {referenceCode}</span>

          {error && (
            <span className="form-helper text-error">
              <i className="material-symbols-outlined icon-settings-fill-300-20">info</i>
              {error}
            </span>
          )}
        </div>

        <button
          className="btn btn-primary ibm-plex-sans-thai-semibold"
          onClick={verifyotp}
          disabled={!isOtpComplete || isVerifying}
        >
          {isVerifying ? "กำลังตรวจสอบ..." : "เข้าสู่ระบบ"}
        </button>

        <div className="login-text">
          ยังไม่ได้รับรหัส OTP?{" "}
          <span
            className={`login-timer cursor-pointer ${timerText === "ขอรหัสใหม่อีกครั้ง" ? "text-primary" : ""} ${
              isResending ? "opacity-50" : ""
            }`}
            onClick={timerText === "ขอรหัสใหม่อีกครั้ง" ? requestOTPAgain : undefined}
          >
            {isResending ? "กำลังส่งรหัสใหม่..." : timerText}
          </span>
        </div>
      </div>
    </div>
  );
}
