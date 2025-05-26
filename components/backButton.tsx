import Link from "next/link";
import { useRouter } from "next/navigation";

interface BackButtonProps {
  onClick?: () => void;
}

export default function BackButton({ onClick }: BackButtonProps) {
  const router = useRouter();

  return (
    <Link
      href={onClick ? "/" : "/login-os"}
      onClick={onClick ? onClick : () => router.back()}
      className="btn btn-tertiary btn-back no-underline shadow-none bg-transparent border-none"
    >
      <i className="material-symbols-outlined">keyboard_arrow_left</i>
      ย้อนกลับ
    </Link>
  );
}
