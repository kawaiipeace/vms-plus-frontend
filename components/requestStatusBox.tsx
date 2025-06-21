interface RequestStatusBoxProps {
  iconName: string;
  status: "info" | "success" | "error" | "warning" | "default";
  title: string;
  number?: number;
  onClick?: () => void;
}

export default function RequestStatusBox({ iconName, status, title, number, onClick }: RequestStatusBoxProps) {
  const softColors: Record<string, string> = {
    info: "info",
    success: "success",
    error: "error",
    warning: "warning",
    default: "default-gray",
  };

  return (
    <div className="border border-gray-200 p-3 rounded-xl cursor-pointer" onClick={() => {
      onClick?.(); 
    }}>
      <div className="flex items-center gap-4">
        <button className={`btn btn-icon pointer-events-none ${softColors[status] ?? softColors.default} !border-none`}>
          <i className="material-symbols-outlined">{iconName}</i>
        </button>
        <span className="font-medium text-base">{title}</span>
      </div>
      <p className="text-3xl font-medium mt-3">{number}</p>
    </div>
  );
}
