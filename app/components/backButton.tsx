import Link from 'next/link';

export default function BackButton() {
  return (
    <Link href="" className="btn btn-tertiary btn-back no-underline shadow-none bg-transparent border-none">
      <i className="material-symbols-outlined">keyboard_arrow_left</i>
      ย้อนกลับ
    </Link>
  );
};

