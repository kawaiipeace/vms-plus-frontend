interface Props {
  title: string;
  desc: React.ReactNode;
  icon?: string;
  status?: string;
}
export default function AlertCustom({ title, desc, icon, status }: Props) {
  let style = "";
  if (status === "warning") {
    style = "!bg-[#FFFAEB] !border-[#FEDF89] !border-[1px]";
  }
  return (
    <>
      <div className={`alert alert-${status ?? "error"} mt-3 ${style}`}>
        <div className="alert-body">
          <i
            className={`material-symbols-outlined icon-settings-fill-300-24 ${
              status === "warning" ? "text-[#F79009]" : ""
            }`}
          >
            {icon == undefined ? "check_circle" : icon}
          </i>
          <div className="alert-content  text-left">
            <div className="alert-title">{title}</div>
            <div className="alert-text">{desc}</div>
          </div>
        </div>
      </div>
    </>
  );
}
