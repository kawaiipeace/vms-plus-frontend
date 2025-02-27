export default function Toast(){
    return(
		<div className="toast-container">
        <div className="toast fade toast-success" role="alert" aria-live="assertive" aria-atomic="true">
            <div className="toast-body">
                <i className="material-symbols-outlined icon-settings-fill-300-24">check_circle</i>
                <div className="toast-content">
                    <div className="toast-title">สร้างกลุ่ม “หน่วยงาน กอพ.1” สำเร็จ</div>
                    <div className="toast-text">กลุ่ม “หน่วยงาน กอพ.1” ได้ถูกสร้างขึ้นมาในระบบเรียบร้อยแล้ว</div>
                </div>
                <button type="button" className="close" data-dismiss="toast">
                    <i className="material-symbols-outlined">close</i>
                </button>
            </div>
        </div>
    </div>
    );
}