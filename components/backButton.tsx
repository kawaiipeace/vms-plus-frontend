import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function BackButton() {
  const router = useRouter();
  
  return (
    <Link href="/login-os" onClick={() => router.back()} className="btn btn-tertiary btn-back no-underline shadow-none bg-transparent border-none">
      <i className="material-symbols-outlined">keyboard_arrow_left</i>
      ย้อนกลับ
    </Link>
  );
};

