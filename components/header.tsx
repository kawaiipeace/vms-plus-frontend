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
import NotificationDropdown from "./notificationDropdown";
import DriverLicenseUpModal from "./annual-driver-license/driverLicenseUpModal";

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
  const [pendingOpenModal, setPendingOpenModal] = useState<
    null | "driver" | "requestnoback" | "request" | "detail" | "driverUp"
  >(null);
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

  const driverLicenseUpModalRef = useRef<{
    openModal: () => void;
    closeModal: () => void;
  } | null>(null);

  const RequestDrivingStepOneModalNoBackRef = useRef<{
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

  }, [profile]);

  const getDriverUserCard = async () => {
    try {
      const response = await driverLicenseUserCard();
      if (response) {
        setDriverUser(response.data.driver);
        return response.data.driver;
      }
    } catch (error) {
      console.log(error);
    }
  };

  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    // Check if the `dark-mode` class is applied to the body
    const checkDarkMode = () => {
      setIsDarkMode(document.body.classList.contains("dark-mode"));
    };

    checkDarkMode();

    // Optionally, listen for changes to the class
    const observer = new MutationObserver(() => {
      checkDarkMode();
    });

    observer.observe(document.body, { attributes: true, attributeFilter: ["class"] });

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (pendingOpenModal === "driver" && driverUser) {
      driverLicenseModalRef.current?.openModal();
      setPendingOpenModal(null);
    }
        if (pendingOpenModal === "driverUp" && driverUser) {
      driverLicenseUpModalRef.current?.openModal();
      setPendingOpenModal(null);
    }
    if (pendingOpenModal === "request" && driverUser) {
      RequestDrivingStepOneModalRef.current?.openModal();
      setPendingOpenModal(null);
    }
    if (pendingOpenModal === "requestnoback" && driverUser) {
      RequestDrivingStepOneModalNoBackRef.current?.openModal();
      setPendingOpenModal(null);
    }
    
    if (
      pendingOpenModal === "detail" &&
      driverUser?.trn_request_annual_driver_uid
    ) {
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
        return response.data;
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleOneSubmit = (data: ValueFormStep1) => {
    setValueFormStep1(data);
    RequestDrivingStepTwoModalRef.current?.openModal();
  };

  const handleOpenDriverLicenseModal = async () => {
    await getDriverUserCard();
    setPendingOpenModal("driver");
  };
  
    const   handleOpenDriverLicenseUpModal = async () => {
    await getDriverUserCard();
    setPendingOpenModal("driverUp");
  };


  const handleOpenRequestDrivingModal = async () => {
    await getDriverUserCard();
    setPendingOpenModal("request");
  };

  const handleOpenRequestNoBackDrivingModal = async () => {
    await getDriverUserCard();
    setPendingOpenModal("requestnoback");
  };
  

  const handleOpenRequestCreateReturnDrivingModal = async () => {
    await getDriverUserCard();
    if (driverUser) {
      await getStatusLicDetail(driverUser?.trn_request_annual_driver_uid);
    }
    setPendingOpenModal("request");
  };

 useEffect(() => {
  if (toast.show) {
    const refreshProfileAndLicDetail = async () => {
      try {
        const response = await fetchProfile();
        setProfile(response.data);
        if (driverUser?.trn_request_annual_driver_uid) {
          const licDetail = await fetchRequestLicStatusDetail(driverUser.trn_request_annual_driver_uid);
          if (licDetail) {
            setLicRequestDetail(licDetail.data);
          }
        }
      } catch (error) {
        console.error("Failed to refresh profile or license detail:", error);
      }
    };
    refreshProfileAndLicDetail();
  }
}, [toast.show, setProfile, driverUser]);

  const handleOpenRequestDetailDrivingModal = async () => {
    try {
      const newDriver = await getDriverUserCard();
      if (newDriver) {
        if (newDriver?.trn_request_annual_driver_uid) {
          const res = await getStatusLicDetail(
            newDriver.trn_request_annual_driver_uid
          );
          if (res) {
            RequestStatusLicDetailModaRef.current?.openModal();
          }
        }
      }
    } catch (error) {
      console.error("Error opening request detail modal:", error);
    }
  };

  const handleOpenRequestDetailNextDrivingModal = async () => {
    try {
      const newDriver = await getDriverUserCard();
      if (newDriver) {
        if (newDriver?.next_trn_request_annual_driver_uid) {
          const res = await getStatusLicDetail(
            newDriver.next_trn_request_annual_driver_uid
          );
          if (res) {
            RequestStatusLicDetailModaRef.current?.openModal();
          }
        }
      }
    } catch (error) {
      console.error("Error opening request detail modal:", error);
    }
  };

  const handleOpenRequestDetailIDDrivingModal = async (id: string) => {
    try {
      const newDriver = await getDriverUserCard();

      if (newDriver) {
        if (newDriver?.trn_request_annual_driver_uid) {
          const res = await getStatusLicDetail(id);
          if (res) {
            RequestStatusLicDetailModaRef.current?.openModal();
          }
        }
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
      <div className="header items-center !z-[1]">
        <div className="navbar p-0 items-center min-h-0">
          <div className="navbar-start">
            <div className="header-brand block md:hidden">
              <a href="">
              <Image
                  src={
                    isDarkMode
                      ? "/assets/img/brand-dark.svg"
                      : "/assets/img/brand.svg"
                  }
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
              status={"success"}
            />
          )}

          <div className="navbar-end gap-[0.5rem]">
            <div className="flex gap-1">
              <ThemeToggle />
              <NotificationDropdown />
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
                            ตำแหน่ง : {profile.posi_text} <br />
                            สังกัด : {profile.dept_sap_short}
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
                      ) : profile?.license_status ===
                        "ใบอนุญาตทำหน้าที่ขับรถยนต์" ? (
                        <>
                          <a
                            className="nav-link toggle-mode gap-1 flex items-center"
                            onClick={handleOpenDriverLicenseUpModal}
                          >
                            <i className="material-symbols-outlined">id_card</i>
                            <span className="nav-link-label">
                              ขอทำหน้าที่ขับรถยนต์
                            </span>
                          </a>
                        </>
                      ) : (
                        (profile?.license_status === "ไม่มี" || profile?.license_status === "ยกเลิก") && (
                          <>
                            <a
                              className="nav-link toggle-mode gap-1 flex items-center"
                              onClick={() =>
                                handleOpenRequestNoBackDrivingModal()
                              }
                            >
                              <i className="material-symbols-outlined">
                                id_card
                              </i>
                              <span className="nav-link-label">
                                ขอทำหน้าที่ขับรถยนต์
                              </span>
                              <div className="badge bg-brand-900 text-white">
                                ไม่มี
                              </div>
                            </a>
                          </>
                        )
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
        showNextRequestStatus={handleOpenRequestDetailNextDrivingModal}
        onStepOneEdit={() => {
          setIsEditable(true);
          handleOpenRequestCreateReturnDrivingModal();
        }}
        onStepOne={() => {
          setIsEditable(false);
          handleOpenRequestDrivingModal();
        }}
      />
      <DriverLicenseUpModal
        ref={driverLicenseUpModalRef}
        profile={profile || null}
      />

      <RequestStatusLicDetailModal
        ref={RequestStatusLicDetailModaRef}
        requestData={licRequestDetail}
        driverData={driverUser}
        onStepOne={() => {
          setIsEditable(true);
          RequestDrivingStepOneModalNoBackRef.current?.openModal();
        }}
      />

      <RequestDrivingStepOneModal
        ref={RequestDrivingStepOneModalRef}
        licRequestDetail={licRequestDetail}
        requestData={driverUser}
        stepOneSubmit={handleOneSubmit}
        onBack={() => {
          RequestDrivingStepOneModalRef.current?.closeModal();
          driverLicenseModalRef.current?.openModal();
        }}
      />

      <RequestDrivingStepOneModal
        ref={RequestDrivingStepOneModalNoBackRef}
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
        onTrackStatus={handleOpenRequestDetailIDDrivingModal}
        onBack={() => {
          RequestDrivingStepTwoModalRef.current?.closeModal();
          RequestDrivingStepOneModalNoBackRef.current?.openModal();
        }}
      />
    </>
  );
}
