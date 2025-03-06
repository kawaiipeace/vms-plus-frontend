"use client";

import LoginHeader from "@/app/components/loginHeader";
import BackButton from "@/app/components/backButton";
import { requestOTP, requestThaiID } from "@/app/services/authService";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import FormHelper from "../components/formHelper";
import { useRouter } from "next/navigation";

const schema = yup.object().shape({
  phone: yup.string().required("กรุณาระบุเบอร์โทรศัพท์"),
});

export default function LoginOS() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data: { phone: string }) => {
    try {
      const response = await requestOTP(data.phone);
      if (response.status === 200) {
        const otpID = response.data.otpId;
        sessionStorage.setItem("phone", data.phone);
        sessionStorage.setItem("otpID", otpID);
        sessionStorage.setItem("refCode", response.data.refCode);
        router.push(`/login-authen`);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const clickThaiID = async () => {
    try {
      const response = await requestThaiID();
      if (response.status === 200) {
        console.log("response thai id", response);
        router.push(response.data.url)
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.target.value = e.target.value.replace(/\D/g, "").slice(0, 10);
  };

  return (
    <div className="page-login page-login-outsource">
      <LoginHeader />

      <form onSubmit={handleSubmit(onSubmit)} className="login-container">
        <BackButton />
        <div className="login-heading">
          <div className="login-heading-title">ลงชื่อเข้าใช้งาน</div>
          <div className="login-heading-subtitle">สำหรับพนักงานขับรถ</div>
        </div>
        <div className="form-group">
          <label className="form-label">เบอร์โทรศัพท์</label>
          <label className="input-group flex items-center gap-2">
            <span className="flex items-center justify-center h-10 w-10 text-gray-400">
              <i className="material-symbols-outlined icon-settings-300-20">
                smartphone
              </i>
            </span>
            <input
              {...register("phone")}
              type="text"
              onInput={handlePhoneChange}
              placeholder="ระบุเบอร์โทรศัพท์"
            />
          </label>
          {errors.phone && <FormHelper text={String(errors.phone.message)} />}
        </div>

        <button type="submit" className="btn btn-primary">
          ส่งรหัส OTP
        </button>
        <div className="form-divider">หรือ</div>
        <button
          type="button"
          className="btn btn-secondary btn-login-thaiid border border-[#D0D5DD]"
          onClick={clickThaiID}
        >
          ลงชื่อเข้าใช้งานผ่าน ThaID{" "}
          <Image
            src="/assets/img/thaiid.png"
            width={20}
            height={20}
            alt=""
          ></Image>
        </button>
      </form>
    </div>
  );
}
