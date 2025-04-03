import Image from "next/image";

export default function LoginHeader(){
  return (
    <div className="login-navbar">
        <a href="" className="login-brand">
          <Image className="login-brand-img" src="/assets/img/brand.svg" width={100} height={32} alt=""></Image>
        </a>
      </div>
  );
}