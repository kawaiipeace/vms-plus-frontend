import Image from "next/image";
import ToggleSidebar from "@/components/toggleSideBar";
import ThemeToggle from "./themeToggle";
import { fetchProfile, logOut } from "@/services/authService";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useProfile } from "@/contexts/profileContext";
import { useEffect, useRef, useState } from "react";
import DriverLicenseModal from "./annual-driver-license/driverLicenseModal";
import {
  driverLicenseUserCard,
  fetchRequestLicStatusDetail,
} from "@/services/driver";
import { DriverLicenseCardType } from "@/app/types/vehicle-user-type";
import RequestDrivingStepOneModal from "./annual-driver-license/requestDrivingStepOneModal";
import { useToast } from "@/contexts/toast-context";
import ToastCustom from "./toastCustom";
import RequestStatusLicDetailModal from "./annual-driver-license/modal/requestStatusLicDetailModal";
import { RequestAnnualDriver } from "@/app/types/driver-lic-list-type";
import RequestDrivingStepTwoModal from "./annual-driver-license/requestDrivingStepTwoModal";
import { UploadFileType } from "@/app/types/upload-type";
interface ValueFormStep1 {
  driverLicenseType: { value: string; label: string; desc?: string } | null;
  year: string;
  licenseNumber: string;
  licenseExpiryDate: string;
  licenseImages: UploadFileType[];
  courseName?: string;
  certificateNumber?: string;
  vehicleType?: { value: string; label: string; desc?: string } | null;
  trainingDate?: string;
  trainingEndDate?: string;
  certificateImages?: UploadFileType[];
}


export default function Header() {
  const { profile, setProfile } = useProfile();
  const router = useRouter();
  const [driverUser, setDriverUser] = useState<DriverLicenseCardType>();
  const [valueFormStep1, setValueFormStep1] = useState<ValueFormStep1>();
  const [isEditable, setIsEditable] = useState(false);
  const [pendingOpenModal, setPendingOpenModal] = useState<null | "driver" | "request" | "detail">(null);
  const [licRequestDetail, setLicRequestDetail] =
    useState<RequestAnnualDriver>();
  const { toast } = useToast();

  const driverLicenseModalRef = useRef<{
    openModal: () => void;
    closeModal: () => void;
  } | null>(null);

  const RequestDrivingStepOneModalRef = useRef<{
    openModal: () => void;
    closeModal: () => void;
  } | null>(null);

  const RequestStatusLicDetailModaRef = useRef<{
    openModal: () => void;
    closeModal: () => void;
  } | null>(null);

  const RequestDrivingStepTwoModalRef = useRef<{
    openModal: () => void;
    closeModal: () => void;
  } | null>(null);

  useEffect(() => {
    console.log("proifile", profile);
  }, [profile]);

  const getDriverUserCard = async () => {
    try {
      const response = await driverLicenseUserCard();
      if (response) {
        setDriverUser(response.data.driver);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (pendingOpenModal === "driver" && driverUser) {
      driverLicenseModalRef.current?.openModal();
      setPendingOpenModal(null);
    }
    if (pendingOpenModal === "request" && driverUser) {
      console.log(licRequestDetail);
      RequestDrivingStepOneModalRef.current?.openModal();
      setPendingOpenModal(null);
    }
    if (pendingOpenModal === "detail" && driverUser?.trn_request_annual_driver_uid) {
      getStatusLicDetail(driverUser.trn_request_annual_driver_uid).then(() => {
        RequestStatusLicDetailModaRef.current?.openModal();
        setPendingOpenModal(null);
      });
    }
  }, [pendingOpenModal, driverUser]);

  const getStatusLicDetail = async (id: string) => {
    try {
      const response = await fetchRequestLicStatusDetail(id);
      if (response) {
        setLicRequestDetail(response.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleOneSubmit = (data: ValueFormStep1) => {
    console.log('data===')
    setValueFormStep1(data);
    RequestDrivingStepTwoModalRef.current?.openModal();
  };

  const handleOpenDriverLicenseModal = async () => {
    await getDriverUserCard();
    setPendingOpenModal("driver");
  };
  
  const handleOpenRequestDrivingModal = async () => {
    await getDriverUserCard();
    setPendingOpenModal("request");
  };

  const handleOpenRequestCreateReturnDrivingModal = async () => {
    await getDriverUserCard();
    if(driverUser){
      await getStatusLicDetail(driverUser?.trn_request_annual_driver_uid);
    }
    setPendingOpenModal("request");
  };


  

  useEffect(() => {
    if (toast.show) {
      const refreshProfile = async () => {
        try {
          const response = await fetchProfile();
          setProfile(response.data);
        } catch (error) {
          console.error("Failed to refresh profile:", error);
        }
      };
      refreshProfile();
    }
  }, [toast.show, setProfile]);


  const handleOpenRequestDetailDrivingModal = async () => {
    try {
      await getDriverUserCard();
      if (driverUser?.trn_request_annual_driver_uid) {
        await getStatusLicDetail(driverUser.trn_request_annual_driver_uid);
        // Now that both requests are complete, open the modal
        RequestStatusLicDetailModaRef.current?.openModal();
      }
    } catch (error) {
      console.error("Error opening request detail modal:", error);
    }
  };
  const logOutFunc = async () => {
    try {
      const response = await logOut();
      if (response) {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        const logoutUrl = response.data.logout_url;
        if (logoutUrl != "") {
          window.open(logoutUrl, "_blank");
        }
      }

      router.push("/");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
    <div className="header items-center">
      <div className="navbar p-0 items-center min-h-0">
        <div className="navbar-start">
          <div className="header-brand block md:hidden">
            <a href="">
              <Image
                src="/assets/img/brand.svg"
                width={98}
                height={40}
                alt=""
              ></Image>
            </a>
          </div>
          <ToggleSidebar />
        </div>

        {toast.show && (
          <ToastCustom
            title={toast.title}
            desc={toast.desc}
            status={toast.status}
          />
        )}

        <div className="navbar-end gap-[0.5rem]">
          <div className="flex gap-1">
            <ThemeToggle />
            <button className="btn btn-tertiary btn-icon border-none shadow-none btn-notifications relative">
              <i className="material-symbols-outlined">notifications</i>
              <span className="badge badge-indicator badge-success badge-ping"></span>
            </button>
          </div>

          <div className="header-users">
            <div className="dropdown dropdown-end">
              <div tabIndex={0} role="button" className="">
                <Image
                  src={profile?.image_url || "/assets/img/avatar.svg"}
                  width={36}
                  height={36}
                  alt="User Avatar"
                ></Image>
              </div>
              <ul
                tabIndex={0}
                className="menu dropdown-content space-y-2 bg-base-100 rounded-box !z-80 mt-4 w-[280px] p-2 shadow"
              >
                {profile && (
                  <li className="nav-item">
                    <div className="nav-link sidebar-users">
                      <div className="avatar avatar-sm">
                        <Image
                          src={profile?.image_url || "/assets/img/avatar.svg"}
                          width={36}
                          height={36}
                          alt="Profile Avatar"
                        ></Image>
                      </div>
                      <div className="sidebar-users-content">
                        <div className="sidebar-users-name">
                          {profile.first_name} {profile.last_name}
                        </div>
                        <div className="sidebar-users-position">
                          รหัสพนักงาน : {profile.emp_id} <br />
                          ตำแหน่ง : {profile.position}  <br />
                          สังกัด : {profile.dept_sap_full}
                        </div>
                      </div>
                    </div>
                  </li>
                )}
                <li className="nav-item">
                  <div className="flex justify-between gap-2 items-center">
                    {profile?.license_status === "อนุมัติแล้ว" ? (
                      <>
                        <a
                          className="nav-link toggle-mode gap-1 flex items-center"
                          onClick={handleOpenDriverLicenseModal}
                        >
                          <i className="material-symbols-outlined">id_card</i>
                          <span className="nav-link-label">
                            ขอทำหน้าที่ขับรถยนต์
                          </span>
                        </a>
                        <div className="badge badge-success">
                          {profile.license_status}
                        </div>
                      </>
                    ) : profile?.license_status === "หมดอายุ" ? (
                      <>
                        <a
                          className="nav-link toggle-mode gap-1 flex items-center"
                          onClick={handleOpenDriverLicenseModal}
                        >
                          <i className="material-symbols-outlined">id_card</i>
                          <span className="nav-link-label">
                            ขอทำหน้าที่ขับรถยนต์
                          </span>
                        </a>
                        <div className="badge badge-error">
                          {profile.license_status}
                        </div>
                      </>
                    ) : profile?.license_status === "มีผลปีถัดไป" ? (
                      <div className="badge badge-warning">
                        {profile.license_status}
                      </div>
                    ) : profile?.license_status === "รออนุมัติ" ? (
                      <>
                      <a
                        className="nav-link toggle-mode gap-1 flex items-center"
                        onClick={handleOpenRequestDetailDrivingModal}
                      >
                        <i className="material-symbols-outlined">id_card</i>
                        <span className="nav-link-label">
                          ขอทำหน้าที่ขับรถยนต์
                        </span>
                      </a>
                      <div className="badge badge-gray">
                        {profile.license_status}
                      </div>
                    </>
                    ) : profile?.license_status === "ตีกลับ" ? (
                      <>
                      <a
                        className="nav-link toggle-mode gap-1 flex items-center"
                        onClick={handleOpenRequestDetailDrivingModal}
                      >
                        <i className="material-symbols-outlined">id_card</i>
                        <span className="nav-link-label">
                          ขอทำหน้าที่ขับรถยนต์
                        </span>
                      </a>
                      <div className="badge badge-warning">
                        {profile.license_status}
                      </div>
                    </>
                    ) : profile?.license_status === "ยกเลิก" ? (
                      <>
                        <a
                          className="nav-link toggle-mode gap-1 flex items-center"
                          onClick={handleOpenRequestDrivingModal}
                        >
                          <i className="material-symbols-outlined">id_card</i>
                          <span className="nav-link-label">
                            ขอทำหน้าที่ขับรถยนต์
                          </span>
                        </a>
                        <div className="badge bg-brand-900 text-white">
                          ไม่มี
                        </div>
                      </>
                    ) : profile?.license_status === "" && (
                      <>
                        <a
                          className="nav-link toggle-mode gap-1 flex items-center"
                          onClick={() => handleOpenRequestDrivingModal()}
                        >
                          <i className="material-symbols-outlined">id_card</i>
                          <span className="nav-link-label">
                            ขอทำหน้าที่ขับรถยนต์
                          </span>
                        </a>

                      </>
                    )}
                  </div>
                </li>
                {/* <li className="nav-item">
                  <a href="" className="nav-link">
                    <i className="material-symbols-outlined">person_check</i>
                    <span className="nav-link-label">มอบอำนาจอนุมัติ</span>
                  </a>
                </li> */}
                {/* <li className="nav-item">
                  <a className="nav-link toggle-lock">
                    <i className="material-symbols-outlined">lock</i>
                    <span className="nav-link-label">ล็อกหน้าจอ</span>
                  </a>
                </li> */}

                <hr />
                <li className="nav-item">
                  <Link href="#" onClick={logOutFunc} className="nav-link">
                    <i className="material-symbols-outlined">logout</i>
                    <span className="nav-link-label">ออกจากระบบ</span>
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    
    </div>
   
      <DriverLicenseModal
        ref={driverLicenseModalRef}
        profile={profile || null}
        requestData={driverUser}
        showRequestStatus={handleOpenRequestDetailDrivingModal}
         onStepOneEdit={() => {
          setIsEditable(true); 
          handleOpenRequestCreateReturnDrivingModal();
        }}
        onStepOne={() => {
          setIsEditable(false); 
          handleOpenRequestDrivingModal();
        }}
      />

      <RequestStatusLicDetailModal
        ref={RequestStatusLicDetailModaRef}
        requestData={licRequestDetail}
        driverData={driverUser}
        onStepOne={() => {
          setIsEditable(true); 
          RequestDrivingStepOneModalRef.current?.openModal();
        }}
      />

      <RequestDrivingStepOneModal
        ref={RequestDrivingStepOneModalRef}
        licRequestDetail={licRequestDetail}
        requestData={driverUser}
        stepOneSubmit={handleOneSubmit}
      />

      <RequestDrivingStepTwoModal
        openStep1={() => RequestDrivingStepTwoModalRef.current?.openModal()}
        ref={RequestDrivingStepTwoModalRef}
        valueFormStep1={valueFormStep1}
        driverData={driverUser}
        requestData={licRequestDetail}
        editable={isEditable} 
        onTrackStatus={() => handleOpenRequestDetailDrivingModal}
        onBack={() => {
          RequestDrivingStepTwoModalRef.current?.closeModal();
          RequestDrivingStepOneModalRef.current?.openModal();
        }}
      /></>
  );
}
