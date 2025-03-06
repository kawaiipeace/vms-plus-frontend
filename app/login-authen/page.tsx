"use client";

import { useState, useEffect } from "react";
import LoginHeader from "../components/loginHeader";
import BackButton from "../components/backButton";
import { requestOTP, verifyOTP } from "../services/authService";

export default function LoginAuthen() {
  const [otpID, setOtpID] = useState<string | null>(null);
  const [phone, setPhone] = useState<string | null>(null);
  const [otp, setOtp] = useState<string[]>(new Array(6).fill(""));
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes in seconds
  const [timerText, setTimerText] = useState("05:00");
  const [error, setError] = useState<string>("");

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prevTime) => {
          const newTime = prevTime - 1;
          const minutes = Math.floor(newTime / 60);
          const seconds = newTime % 60;
          setTimerText(
            `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(
              2,
              "0"
            )}`
          );
          return newTime;
        });
      }, 1000);
    } else {
      setTimerText("ขอรหัสใหม่อีกครั้ง");
    }

    const storedPhone = sessionStorage.getItem("phone");
    const storedOtpID = sessionStorage.getItem("otpID");

    if (storedPhone) setPhone(storedPhone);
    if (storedOtpID) setOtpID(storedOtpID);

    return () => clearInterval(interval); // Cleanup interval on unmount or timer reset
  }, [timeLeft]);

  const requestOTPAgain = async () => {
    if (phone) {
      try {
        const response = await requestOTP(phone);
        if (response.status === 200) {
          setOtpID(response.data.otpId);
          setTimeLeft(300); // Reset the timer to 5 minutes
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  const verifyotp = async () => {
    const otpData = {
      otp: otp.join(""),
      otpId: String(otpID),
    };

    try {
      const response = await verifyOTP(otpData);
      console.log(response);
      if (response.status === 200) {
        console.log("OTP Verified successfully", response.data);
      }
    } catch (error: any) {
      setError(error.response.data.error);
    }
  };

  const handleOtpChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const value = e.target.value;

    if (/^\d$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      // Focus next input field if this input is filled
      if (index < otp.length - 1) {
        const nextInput = document.getElementById(`otp-input-${index + 1}`);
        if (nextInput) {
          nextInput.focus();
        }
      }
    } else {
      e.target.value = "";
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    if (e.key === "Backspace") {
      if (otp[index] === "") {
        // If current input is empty, move focus to the previous input
        const prevInput = document.getElementById(`otp-input-${index - 1}`);
        if (prevInput) {
          prevInput.focus();
        }
      } else {
        // If current input is not empty, delete the value
        const newOtp = [...otp];
        newOtp[index] = "";
        setOtp(newOtp);
      }
    }
  };

  const isOtpComplete = otp.every((digit) => digit !== "");

  return (
    <div className="page-login page-login-authen">
      <LoginHeader />

      <div className="login-container">
        <BackButton />
        <div className="login-heading text-center">
          <div className="login-heading-title">OTP Verification</div>
          <div className="login-heading-subtitle">
            กรอกรหัส OTP 6 หลัก ที่ส่งไปยังหมายเลข{" "}
            {`+66${phone?.slice(1, 3)}*****${phone?.slice(-2)}`} <br />
            หากยังไม่ได้รับ กดขอรหัสใหม่ได้เมื่อครบกำหนดเวลา
          </div>
        </div>

        <div className="form-group">
          <div className="input-otp w-6/6 flex gap-2">
            {otp.map((digit, index) => (
              <input
                key={index}
                id={`otp-input-${index}`}
                type="text"
                className="form-control w-1/6 text-center"
                maxLength={1}
                value={digit}
                onChange={(e) => handleOtpChange(e, index)}
                onKeyDown={(e) => handleKeyDown(e, index)} // Handle backspace
                placeholder=""
                autoFocus={index === 0}
              />
            ))}
          </div>
          <span className="form-helper">รหัสอ้างอิง : HYPL</span>

          {error && (
            <span className="form-helper text-error">
              <i className="material-symbols-outlined icon-settings-fill-300-20">
                info
              </i>
              {error}
            </span>
          )}
        </div>

        <button
          className="btn btn-primary ibm-plex-sans-thai-semibold"
          onClick={verifyotp}
          disabled={!isOtpComplete}
        >
          เข้าสู่ระบบ
        </button>

        <div className="login-text">
          ยังไม่ได้รับรหัส OTP?{" "}
          <span
            className="login-timer cursor-pointer"
            onClick={
              timerText === "ขอรหัสใหม่อีกครั้ง" ? requestOTPAgain : undefined
            }
          >
            {timerText}
          </span>
        </div>
      </div>
    </div>
  );
}
