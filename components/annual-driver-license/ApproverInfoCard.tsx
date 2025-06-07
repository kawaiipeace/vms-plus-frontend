import Image from "next/image";

interface UserType {
  image_url?: string;
  full_name?: string;
  emp_id?: string;
  dept_sap_short?: string;
  tel_mobile?: string;
  tel_internal?: string;
  posi_text?: string;
}

interface Props {
  user?: UserType;
  displayPhone?: boolean;
}

export default function ApproverInfoCard({
  user,
  displayPhone = true
}: Props) {
  return (
    <div className="form-card">
      <div className="form-card-body form-card-inline">
        <div className="form-group form-plaintext form-users">
          <Image
            src={user?.image_url || "/assets/img/avatar.svg"}
            className="avatar avatar-md object-cover"
            width={100}
            height={100}
            alt="User avatar"
          />
          <div className="form-plaintext-group align-self-center">
            <div className="form-label">{user?.full_name}</div>
            <div className="supporting-text-group">
              <div className="supporting-text">{user?.emp_id}</div>
              <div className="supporting-text">
                 {user?.posi_text} {user?.dept_sap_short}
              </div>
            </div>
          </div>
        </div>
        
        {displayPhone && (
          <div className="form-card-right align-self-center !w-[30%]">
            <div className="flex flex-wrap gap-4">
              <div className="col-span-12 md:col-span-6">
                <div className="form-group form-plaintext">
                  <i className="material-symbols-outlined">smartphone</i>
                  <div className="form-plaintext-group">
                    <div className="form-text text-nowrap">
                      {user?.tel_mobile}
                    </div>
                  </div>
                </div>
              </div>

              {user?.tel_internal && (
                <div className="col-span-12 md:col-span-6">
                  <div className="form-group form-plaintext">
                    <i className="material-symbols-outlined">call</i>
                    <div className="form-plaintext-group">
                      <div className="form-text text-nowrap">
                        {user?.tel_internal}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}