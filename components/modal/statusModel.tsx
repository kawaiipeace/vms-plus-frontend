import DatePicker from "@/components/datePicker";

export default function StatusModal(){
    return (
        <div
        className="modal fade"
        id="filtersModal"
        tabIndex={-1}
        aria-labelledby="filtersModal"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-scrollable modal-right">
          <div className="modal-content">
            <div className="bottom-sheet">
              <div className="bottom-sheet-icon"></div>
            </div>
            <div className="modal-header">
              <div className="modal-header-group">
                <div className="featured-ico featured-ico-gray">
                  <i className="material-symbols-outlined icon-settings-400-24">
                    filter_list
                  </i>
                </div>
                <div className="modal-header-content">
                  <div className="modal-header-top">
                    <div className="modal-title">ตัวกรอง</div>
                  </div>
                  <div className="modal-header-bottom">
                    <div className="modal-subtitle">
                      กรองข้อมูลให้แสดงเฉพาะข้อมูลที่ต้องการ
                    </div>
                  </div>
                </div>
              </div>
              <button
                type="button"
                className="close btn btn-icon btn-tertiary"
                data-dismiss="modal"
                aria-label="Close"
              >
                <i className="material-symbols-outlined">close</i>
              </button>
            </div>
            <div className="modal-body">
              <div className="row form-row">
                <div className="col-12">
                  <div className="form-group">
                    <label className="form-label">สถานะคำขอ</label>
                    <div className="custom-group">
                      <div className="custom-control custom-checkbox custom-control-inline">
                        <input
                          type="checkbox"
                          className="custom-control-input"
                          name="checkbox"
                          data-group="checkboxGroup"
                        />
                        <label className="custom-control-label">
                          <div className="custom-control-label-group">
                            <span className="badge badge-pill-outline badge-info">
                              รออนุมัติ
                            </span>
                          </div>
                        </label>
                      </div>
                    </div>
                    <div className="custom-group">
                      <div className="custom-control custom-checkbox custom-control-inline">
                        <input
                          type="checkbox"
                          className="custom-control-input"
                          name="checkbox"
                          data-group="checkboxGroup"
                        />
                        <label className="custom-control-label">
                          <div className="custom-control-label-group">
                            <span className="badge badge-pill-outline badge-error">
                              ถูกตีกลับ
                            </span>
                          </div>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="row form-row">
                <div className="col-12">
                  <div className="form-group">
                    <label className="form-label">วันที่เดินทาง</label>
                    <div className="input-group flatpickr">
                      <div className="input-group-prepend" data-toggle="">
                        <span className="input-group-text">
                          <i className="material-symbols-outlined">
                            calendar_month
                          </i>
                        </span>
                      </div>
                     
                      <DatePicker placeholder="ระบุช่วงวันที่เดินทาง" />
                      <div className="input-group-append" data-clear>
                        <span className="input-group-text search-ico-trailing">
                          <i className="material-symbols-outlined">close</i>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-tertiary btn-resetfilter mr-auto"
              >
                ล้างตัวกรอง
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                data-dismiss="modal"
              >
                ยกเลิก
              </button>
              <button type="button" className="btn btn-primary">
                ตกลง
              </button>
            </div>
          </div>
        </div>
      </div>
    );
}