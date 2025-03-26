interface Props{
  name?: string;
  refCostNo?: string;
}
export default function DisburstmentCard({name, refCostNo}: Props){
    return(
        <div className="form-card">
        <div className="form-card-body">
          <div className="grid grid-cols-12">
            <div className="col-span-12 md:col-span-6">
              <div className="form-group form-plaintext">
                <i className="material-symbols-outlined">paid</i>
                <div className="form-plaintext-group">
                  <div className="form-label">ประเภทงบประมาณ</div>
                  <div className="form-text">
                    {name}
                  </div>
                </div>
              </div>
            </div>

            <div className="col-span-12 md:col-span-6">
              <div className="form-group form-plaintext">
                <i className="material-symbols-outlined">
                  account_balance
                </i>
                <div className="form-plaintext-group">
                  <div className="form-label">ศูนย์ต้นทุน</div>
                  <div className="form-text">
                   {refCostNo}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
}