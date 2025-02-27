import Image from "next/image";
import ToggleSidebar from "@/app/components/toggleSideBar";

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
			<button className="btn btn-tertiary btn-icon border-none shadow-none toggle-mode relative">
            <i className="material-symbols-outlined">light_mode</i>
          </button>
          <button className="btn btn-tertiary btn-icon border-none shadow-none btn-notifications relative">
            <i className="material-symbols-outlined">notifications</i>
            <span className="badge badge-indicator badge-success badge-ping"></span>
          </button>
			</div>
      
          <div className="header-users">
            <Image
              src="/assets/img/avatar.svg"
              width={36}
              height={36}
              alt=""
            ></Image>
          </div>
        </div>
      </div>
      
    </div>
  );
}
