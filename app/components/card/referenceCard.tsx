export default function ReferenceCard(){
    return (
        <div className="form-card">
        <div className="form-card-body">
          <div className="grid grid-cols-12">
            <div className="col-span-12 md:col-span-6">
              <div className="form-group form-plaintext">
                <i className="material-symbols-outlined">description</i>
                <div className="form-plaintext-group">
                  <div className="form-label">เลขที่หนังสืออ้างอิง</div>
                  <div className="form-text">กอพ.1(ก)123/2567</div>
                </div>
              </div>
            </div>

            <div className="col-span-12 md:col-span-6">
              <div className="form-group form-plaintext">
                <i className="material-symbols-outlined">attach_file</i>
                <div className="form-plaintext-group">
                  <div className="form-label">เอกสารแนบ</div>
                  <a href="#" className="form-text text-info">
                    Document...2567.pdf
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
}