export default function Pagination() {
  return (
  
      <div className="join">
        <button className="join-item btn btn-sm btn-outline">
          <i className="material-symbols-outlined">chevron_left</i>
        </button>
        <button className="join-item btn btn-sm btn-outline">1</button>
        <button className="join-item btn btn-sm btn-outline btn-active">
          2
        </button>
        <button className="join-item btn btn-sm btn-outline">3</button>
        <button className="join-item btn btn-sm btn-outline">
          <i className="material-symbols-outlined">chevron_right</i>
        </button>
      </div>
  
  );
}
