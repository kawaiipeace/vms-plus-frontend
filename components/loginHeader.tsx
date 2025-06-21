import Image from "next/image";
import Link from "next/link";

export default function LoginHeader(){
  return (
    <div className="login-navbar">
        <Link href="" className="login-brand">
          <Image className="login-brand-img" src="/assets/img/brand.svg" width={100} height={32} alt=""></Image>
        </Link>
      </div>
  );
}