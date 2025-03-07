import Image from "next/image";
import ToggleSidebar from "@/app/components/toggleSideBar";
import ThemeToggle from "./themeToggle";

export default function Header() {
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
                  alt=""
                ></Image>
              </div>
              <ul
                tabIndex={0}
                className="menu dropdown-content space-y-2 bg-base-100 rounded-box z-[1] mt-4 w-64 p-2 shadow"
              >
                		<li className="nav-item">
							<div className="nav-link sidebar-users">
								 <div className="avatar avatar-sm">
                 <Image
                  src="/assets/img/avatar.svg"
                  width={36}
                  height={36}
                  alt=""
                ></Image>
								 </div>
								<div className="sidebar-users-content">
									<div className="sidebar-users-name">นายสมคิด จงจองหอ</div>
									<div className="sidebar-users-position">ผู้ใช้งานทั่วไป</div>
								</div>
							</div>
						</li>
                <li className="nav-item">
							<a className="nav-link toggle-mode">
								<i className="material-symbols-outlined">id_card</i>
								<span className="nav-link-label">ใบอนุญาติขับขี่</span>
							</a>
						</li>
            <li className="nav-item">
							<a href="" className="nav-link">
								<i className="material-symbols-outlined">person_check</i>
								<span className="nav-link-label">มอบอำนาจอนุมัติ</span>
							</a>
						</li>
						<li className="nav-item">
							<a className="nav-link toggle-lock">
								<i className="material-symbols-outlined">lock</i>
								<span className="nav-link-label">ล็อกหน้าจอ</span>
							</a>
						</li>
					
            <hr />
						<li className="nav-item">
							<a href="" className="nav-link">
								<i className="material-symbols-outlined">logout</i>
								<span className="nav-link-label">ออกจากระบบ</span>
							</a>
						</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
