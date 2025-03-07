interface Props {
  title: string;
  desc: string;
  icon?: string;
}
export default function AlertCustom({ title, desc, icon }: Props) {
  return (
    <>
      <div className="alert alert-error mt-3">
        <div className="alert-body">
          <i className="material-symbols-outlined icon-settings-fill-300-24">{icon == undefined ? "check_circle" : icon}</i>
          <div className="alert-content">
            <div className="alert-title">{title}</div>
            <div className="alert-text">{desc}</div>
          </div>
        </div>
      </div>
    </>
  );
}
