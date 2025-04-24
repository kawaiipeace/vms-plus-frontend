interface RequestStatusBoxProps {
  iconName: string;
  status: "info" | "success" | "error" | "warning" | "default"; // Ensure valid statuses
  title: string;
  number?: number;
  onClick?: () => void;
}

export default function RequestStatusBox({ iconName, status, title, number, onClick }: RequestStatusBoxProps) {
  const softColors: Record<string, string> = {
    info: "bg-blue-50 text-blue-600 border border-blue-300",
    success: "bg-green-50 text-green-600 border border-green-300",
    error: "bg-red-50 text-red-600 border border-red-300",
    warning: "bg-yellow-50 text-yellow-600 border border-yellow-300",
    default: "bg-gray-50 text-gray-700 border border-gray-    ",
  };

  return (
    <div className="border border-gray-200 p-3 rounded-xl cursor-pointer" onClick={() => {
      onClick?.(); 
    }}>
      <div className="flex items-center gap-4">
        <button className={`btn btn-icon pointer-events-none ${softColors[status] ?? softColors.default} border-none`}>
          <i className="material-symbols-outlined">{iconName}</i>
        </button>
        <span className="font-medium text-base">{title}</span>
      </div>
      <p className="text-3xl font-medium mt-3">{number}</p>
    </div>
  );
}
