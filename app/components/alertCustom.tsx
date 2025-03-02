interface Props {
  title: string;
  desc: string;
}
export default function AlertCustom({ title, desc }: Props) {
  return (
    <>
      <div className="alert alert-error">
        <div className="alert-body">
          <i className="material-symbols-outlined icon-settings-fill-300-24">
            check_circle
          </i>
          <div className="alert-content">
            <div className="alert-title">{title}</div>
            <div className="alert-text">
                {desc}
            
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
