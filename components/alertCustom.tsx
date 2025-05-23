interface Props {
  title: string;
  desc: React.ReactNode;
  icon?: string;
  status?: string;
}
export default function AlertCustom({ title, desc, icon, status }: Props) {
  return (
    <>
      <div className={`alert alert-${status ?? 'error'} mt-3 z-5`}>
        <div className="alert-body">
          <i className="material-symbols-outlined icon-settings-fill-300-24">{icon == undefined ? "check_circle" : icon}</i>
          <div className="alert-content  text-left">
            <div className="alert-title">{title}</div>
            <div className="alert-text">{desc}</div>
          </div>
        </div>
      </div>
    </>
  );
}
