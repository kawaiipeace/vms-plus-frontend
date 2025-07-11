
interface LicensePlateStatProps {
  status: boolean;
  title: string;
  desc?: string;
}

export default function LicensePlateStat({ status, title, desc }: LicensePlateStatProps) {
  return (
    <>
      <div className="flex gap-2 items-center">
        <i className={`material-symbols-outlined icon-settings-fill-300-24 ${status == true ? "text-success" : "text-error"}`}>
          { status == true ? 'check_circle' : 'cancel' } 
        </i>
        <div className="card-content !gap-0">
          <div className="card-subtitle font-bold">{title}</div>
          <div className="card-supporting-text text-sm text-color-secondary">{desc}</div>
        </div>
      </div>
    </>
  );
}
