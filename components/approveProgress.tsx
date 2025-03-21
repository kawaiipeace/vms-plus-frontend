export default function ApproveProgress(){
    return(
         <div className="card card-approvalprogress">
                        <div className="card-header">
                          <div className="card-title">สถานะคำขอใช้</div>
                        </div>
                        <div className="card-body">
                          <div className="md:hidden">
                            <div className="circular-progressbar d-flex">
                              <div className="circular-progressbar-container">
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  viewBox="-1.5 -1.5 34 34"
                                  className="circular-progressbar"
                                >
                                  <circle
                                    cx="16"
                                    cy="16"
                                    r="15.9155"
                                    className="circular-progressbar-background"
                                  />
                                  <circle
                                    cx="16"
                                    cy="16"
                                    r="15.9155"
                                    className="circular-progressbar-progress js-circular-progressbar"
                                    style={{ strokeDashoffset: "70px" }}
                                  />
                                </svg>
                                <div className="circular-progressbar-text">
                                  1<span className="circular-progressbar-slash">/</span>
                                  3
                                </div>
                              </div>
                              <div className="progress-steps-btn-content">
                                <div className="progress-steps-btn-title">
                                  รออนุมัติจากต้นสังกัด
                                </div>
                                <div className="progress-steps-btn-text">
                                  ถัดไป:{" "}
                                  <span className="progress-steps-btn-label">
                                    รอผู้ดูแลยานพาหนะตรวจสอบ
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
        
                          <div className="progress-steps-column d-none d-md-flex">
                            <div className="progress-step done">
                              <span className="progress-step-no">
                                <i className="material-symbols-outlined">check</i>
                              </span>
                              <div className="progress-step-content">
                                <div className="progress-step-title">
                                  รออนุมัติจากต้นสังกัด
                                </div>
                              </div>
                            </div>
                            <div className="progress-step active">
                              <span className="progress-step-no"></span>
                              <div className="progress-step-content">
                                <div className="progress-step-title">
                                  รอผู้ดูแลยานพาหนะตรวจสอบ
                                </div>
                              </div>
                            </div>
                            <div className="progress-step">
                              <span className="progress-step-no"></span>
                              <div className="progress-step-content">
                                <div className="progress-step-title">
                                  รออนุมัติใช้ยานพาหนะ
                                </div>
                              </div>
                            </div>
                          </div>
        
                          <div className="form-section">
                            <div className="form-section-header">
                              <div className="form-section-header-title d-none d-md-block">
                                ผู้อนุมัติต้นสังกัด
                              </div>
                              <button
                                className="btn btn-tertiary hidden p-0 h-auto w-100"
                                type="button"
                                data-toggle="collapse"
                                data-target="#collapseApproverDetail"
                                aria-expanded="false"
                                aria-controls="collapseApproverDetail"
                              >
                                ผู้อนุมัติต้นสังกัด
                                <i className="material-symbols-outlined ml-auto">
                                  keyboard_arrow_down
                                </i>
                              </button>
                            </div>
        
                            <div
                              className="form-card d-md-block collapse"
                              id="collapseApproverDetail"
                            >
                              <div className="form-card-body form-card-inline">
                                <div className="form-group form-plaintext form-users">
                                  <div className="form-plaintext-group align-self-center">
                                    <div className="form-label">
                                      ศรัญยู บริรัตน์ฤทธิ์
                                    </div>
                                    <div className="supporting-text-group">
                                      <div className="supporting-text">อก. กอพ.1</div>
                                    </div>
                                  </div>
                                </div>
                                <div className="form-card-right align-self-center">
                                  <div className="flex gap-3 flex-wrap">
                                    <div className="col-span-12 md:col-span-6">
                                      <div className="form-group form-plaintext">
                                        <i className="material-symbols-outlined">
                                          smartphone
                                        </i>
                                        <div className="form-plaintext-group">
                                          <div className="form-text text-nowrap">
                                            091-234-5678
                                          </div>
                                        </div>
                                      </div>
                                    </div>
        
                                    <div className="col-span-12 md:col-span-6">
                                      <div className="form-group form-plaintext">
                                        <i className="material-symbols-outlined">
                                          call
                                        </i>
                                        <div className="form-plaintext-group">
                                          <div className="form-text text-nowra">
                                            6032
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
    );
}