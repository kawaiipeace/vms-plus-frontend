import Image from "next/image";
import ToggleSidebar from "@/components/toggleSideBar";
import ThemeToggle from "./themeToggle";
import { logOut } from "@/services/authService";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useProfile } from "@/contexts/profileContext";
import { useEffect, useRef, useState } from "react";
import DriverLicenseModal from "./annual-driver-license/driverLicenseModa";
import { driverLicenseUserCard } from "@/services/driver";

export default function Header() {
  const { profile } = useProfile();
  const router = useRouter();
  const [driverUser, setDriverUser] = useState();

  const driverLicenseModalRef = useRef<{
    openModal: () => void;
    closeModal: () => void;
  } | null>(null);

  useEffect(() => {
      console.log("proifile",profile);
  }, [profile]);

  const getDriverUserCard = async () => {
    try {
      const response = await driverLicenseUserCard();
      if (response) {
        console.log('res', response.data);
        setDriverUser(response.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleOpenDriverLicenseModal = () => {
    getDriverUserCard();
    driverLicenseModalRef.current?.openModal();
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
                  src="/assets/img/avatar.svg"
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
                          src="/assets/img/avatar.svg"
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
                          {profile.dept_sap_full}
                        </div>
                      </div>
                    </div>
                  </li>
                )}
                <li className="nav-item">
                  <div className="flex justify-between gap-2 items-center">
                    <a className="nav-link toggle-mode gap-1 flex items-center" onClick={handleOpenDriverLicenseModal}>
                      <i className="material-symbols-outlined">id_card</i>
                      <span className="nav-link-label">
                        ขอทำหน้าที่ขับรถยนต์
                      </span>
                    </a>
                    <div className="badge badge-success">อนุมัติแล้ว</div>
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
      <DriverLicenseModal ref={driverLicenseModalRef} profile={profile || null} requestData={driverUser} />
    </div>
  );
}
