interface ToastProps{
    title: string,
    desc: string,
    status: string,
}

export default function Toast({title,desc,status}: ToastProps){

    return(
		<div className="toast-container">
        <div className={`toast fade toast-${status} block"`} role="alert">
            <div className="toast-body">
                <i className="material-symbols-outlined icon-settings-fill-300-24">check_circle</i>
                <div className="toast-content">
                    <div className="toast-title">{title}</div>
                    <div className="toast-text">{desc}</div>
                </div>
                <button type="button" className="close" data-dismiss="toast">
                    <i className="material-symbols-outlined">close</i>
                </button>
            </div>
        </div>
    </div>
    
    );
}