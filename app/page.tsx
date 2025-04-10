"use client";
import Image from "next/image";
import Link from "next/link";
import { requestkeyCloak } from "@/services/authService";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Home() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkLoggedin = async () => {
      const token = localStorage?.getItem("accessToken");

      if (token) {
        router.replace("/vehicle-booking/request-list");
        return; 
      }

      setLoading(false);
    };

    checkLoggedin();
  }, [router]);

  const requestKey = async () => {
    try {
      const response = await requestkeyCloak();
      if (response.status === 200) {
        console.log("res", response);
        router.push(response.data.url);
      }
    } catch (error) {
      console.log(error);
    }
  };

  if (loading) return null;

  return (
    <div className="page-login">
      <div className="login-left">
        <div className="login-left-container">
          <div className="login-brand">
            <Image
              className="login-brand-img"
              src="assets/img/brand.svg"
              width={189}
              height={77}
              alt=""
            />
            <div className="login-brand-title">ระบบจัดการยานพาหนะ VMS Plus</div>
            <div className="login-brand-subtitle">
              เรื่องเดินทางไม่ใช่ปัญหา ยืมรถสะดวก ง่าย เร็ว ทันใจ
            </div>
          </div>

          <div className="login-label">เข้าสู่ระบบด้วยบัญชี</div>

          <div className="login-type">
            <Link
              href="#"
              onClick={requestKey}
              className="login-type-link login-type-internal"
            >
              <Image
                src="assets/img/login_pea.svg"
                width={80}
                height={85}
                alt=""
              />
              <div className="login-type-link-label">พนักงาน กฟภ.</div>
            </Link>
            <Link
              href="login-os"
              className="login-type-link login-type-outsource"
            >
              <Image
                src="assets/img/login_outsource.svg"
                width={80}
                height={85}
                alt=""
              />
              <div className="login-type-link-label">บุคคลภายนอก</div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
