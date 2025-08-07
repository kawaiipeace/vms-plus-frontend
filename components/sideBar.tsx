"use client";
import { useProfile } from "@/contexts/profileContext";
import { useSidebar } from "@/contexts/sidebarContext";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

interface SidebarProps {
  menuName?: string;
}

export default function SideBar({ menuName }: SidebarProps) {
  const [openMenus, setOpenMenus] = useState<string[]>([]);
  const [activeItem, setActiveItem] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const { isPinned, setIsPinned } = useSidebar();
  const { profile } = useProfile();

  const roles = profile?.roles;

  useEffect(() => {
    if (menuName) {
      setActiveItem(menuName);
      if (
        [
          "คำขอใช้ยานพาหนะ",
          "อนุมัติคำขอใช้และใบอนุญาต",
          "งานพนักงานขับรถ",
        ].includes(menuName)
      ) {
        setOpenMenus(["collapseLink2"]);
      } else if (
        ["ตรวจสอบและจัดการคำขอ", "อนุมัติใช้ยานพาหนะ"].includes(menuName)
      ) {
        setOpenMenus(["collapseLink3"]);
      } else if (
        [
          "ผู้ดูแลยานพาหนะ",
          "ข้อมูลพนักงานขับรถ",
          "ข้อมูลยานพาหนะ",
          "กลุ่มยานพาหนะ",
          "ข้อมูล Fleet card",
        ].includes(menuName)
      ) {
        setOpenMenus(["collapseLink4"]);
      }
    }
  }, [menuName, profile]);

  useEffect(() => {
    if (isPinned) {
      setIsExpanded(true);
    }
  }, [isPinned, profile]);

  const toggleMenu = (menuId: string) => {
    setOpenMenus((prev) =>
      prev.includes(menuId)
        ? prev.filter((id) => id !== menuId)
        : [...prev, menuId]
    );
  };

  // Filter menu items based on roles
  const filteredMenus = [
    {
      id: "collapseLink2",
      icon: "car_rental",
      label: "ระบบจองยานพาหนะ",
      items: [
        {
          title: "คำขอใช้ยานพาหนะ",
          link: "/vehicle-booking/request-list",
          roles: ["vehicle-user"],
        },
        {
          title: "อนุมัติคำขอใช้และใบอนุญาต",
          link: "/administrator/booking-confirmer",
          roles: ["level1-approval"],
        },
        {
          title: "อนุมัติคำขอใช้และใบอนุญาต",
          link: "/administrator/booking-approver",
          roles: ["license-approval"],
        },

        {
          title: "งานพนักงานขับรถ",
          link: "/vehicle-in-use/driver",
          roles: ["driver"],
        },
      ].filter((item) => item.roles.some((role) => roles?.includes(role))),
    },
    {
      id: "collapseLink3",
      icon: "traffic_jam",
      label: "จัดการคำขอใช้ยานพาหนะ",
      items: [
        {
          title: "ตรวจสอบและจัดการคำขอ",
          link: "/administrator/request-list",
          roles: [
            "admin-approval",
            "admin-department",
            "admin-department-main",
            "admin-super",
            "admin-carpool",
            "approval-carpool",
          ],
        },
        {
          title: "อนุมัติใช้ยานพาหนะ",
          link: "/administrator/booking-final",
          roles: ["approval-department", "approval-carpool"],
        },
      ].filter((item) => item.roles.some((role) => roles?.includes(role))),
    },
    {
      id: "collapseLink4",
      icon: "database",
      label: "ข้อมูลพนักงานและยานพาหนะ",
      items: [
        // {
        //   title: "ผู้ดูแลยานพาหนะ",
        //   link: "/carpool-management",
        //   roles: ["admin-super"],
        // },
        {
          title: "ข้อมูลพนักงานขับรถ",
          link: "/drivers-management",
          roles: ["admin-super", "admin-region", "admin-department"],
        },
        {
          title: "ข้อมูลยานพาหนะ",
          link: "/vehicle-management",
          roles: ["admin-super", "admin-region", "admin-department"],
        },
        {
          title: "กลุ่มยานพาหนะ",
          link: "/carpool-management",
          roles: ["admin-super", "admin-region", "admin-department"],
        },
        // {
        //   title: "ข้อมูล Fleet card",
        //   link: "request-list",
        //   roles: ["admin-super"],
        // },
      ].filter((item) => item.roles.some((role) => roles?.includes(role))),
    },
  ].filter((menu) => menu.items.length > 0); // Only show menus that have items

  const getActiveMainMenu = (id: string) => {
    if (menuName) {
      if (
        [
          "คำขอใช้ยานพาหนะ",
          "อนุมัติคำขอใช้และใบอนุญาต",
          "อนุมัติคำขอใช้และใบอนุญาต",
          "งานพนักงานขับรถ",
        ].includes(menuName)
      ) {
        return "collapseLink2" === id;
      } else if (
        ["ตรวจสอบและจัดการคำขอ", "อนุมัติใช้ยานพาหนะ"].includes(menuName)
      ) {
        return "collapseLink3" === id;
      } else if (
        [
          "ผู้ดูแลยานพาหนะ",
          "ข้อมูลพนักงานขับรถ",
          "ข้อมูลยานพาหนะ",
          "กลุ่มยานพาหนะ",
          "ข้อมูล Fleet card",
        ].includes(menuName)
      ) {
        return "collapseLink4" === id;
      }
    }
  };

  return (
    <div
      className={`sidebar !z-[2] transition-all duration-300 ease-in-out bg-white shadow-lg fixed h-full ${
        isExpanded || isPinned
          ? "w-[280px] min-w-[280px] max-w-[280px]"
          : "w-[80px]"
      }`}
      onMouseEnter={() => !isPinned && setIsExpanded(true)}
      onMouseLeave={() => !isPinned && setIsExpanded(false)}
    >
      {/* Sidebar Top */}
      <div
        className={`flex items-center justify-between p-4 ${
          isExpanded && "sidebar-top"
        }`}
      >
        {isExpanded ? (
          <Link href="/" className="sidebar-brand">
            <Image
              src={"/assets/img/brand.svg"}
              width={98}
              height={40}
              alt=""
              className="transition-all duration-300 ease-in-out"
            />
          </Link>
        ) : (
          <Link href="/">
            <Image
              src={"/assets/img/favicon.png"}
              width={40}
              height={40}
              alt=""
              className="transition-all duration-300 ease-in-out"
            />
          </Link>
        )}
        {/* Pin Button */}
        {isExpanded && (
          <button
            className="btn btn-iternary rounded-md w-[40px] h-[40px] min-h-[40px]"
            onClick={() => setIsPinned(!isPinned)}
          >
            <i className="material-symbols-outlined">
              {isPinned ? "keyboard_tab_rtl" : "keyboard_tab"}
            </i>
          </button>
        )}
      </div>

      {/* Sidebar Navigation */}
      <div className="custom-scrollbar">
        <ul className="nav flex-col">
          <li className="nav-item">
            <Link
              href={`${
                profile?.roles?.includes("driver")
                  ? "/vehicle-in-use/driver"
                  : "/"
              }`}
              className={`nav-link flex items-center ${
                activeItem === "home" ? "active" : ""
              }`}
            >
              <i className="material-symbols-outlined">home</i>
              <span
                className={`nav-link-label transition-all duration-300 ${
                  isExpanded || isPinned ? "opacity-100" : "opacity-0 w-0"
                }`}
              >
                หน้าหลัก
              </span>
            </Link>
          </li>

          {/* Dropdown Menus */}
          {filteredMenus.map((menu) => {
            // const isActive = openMenus.includes(menu.id);
            const active = getActiveMainMenu(menu.id);

            return (
              <li
                className={`nav-item  ${!isExpanded && "h-[40px] w-[40px]"}`}
                key={menu.id}
              >
                <button
                  onClick={() => toggleMenu(menu.id)}
                  className={`nav-link flex items-center justify-between ${
                    !isExpanded && "h-[40px] w-[40px]"
                  } ${active ? "active" : ""}`}
                >
                  <div className="flex items-center">
                    <i className="material-symbols-outlined">{menu.icon}</i>
                    <span
                      className={`nav-link-label text-left transition-all duration-300 ${
                        isExpanded || isPinned
                          ? "opacity-100 ml-2"
                          : "opacity-0 w-0"
                      }`}
                    >
                      {menu.label}
                    </span>
                  </div>
                  {isExpanded && (
                    <i className="ico-toggle">
                      <span className="material-symbols-outlined">
                        {openMenus.includes(menu.id)
                          ? "keyboard_arrow_up"
                          : "keyboard_arrow_down"}
                      </span>
                    </i>
                  )}
                </button>
                {isExpanded && (
                  <div
                    className={`transition-all duration-500 ease-in-out overflow-hidden ${
                      openMenus.includes(menu.id)
                        ? "max-h-[500px] block"
                        : "hidden"
                    }`}
                  >
                    <ul className="nav flex-col text-left">
                      {menu.items.map((item, index) => (
                        <li className="nav-item text-left" key={index}>
                          <Link
                            href={item.link}
                            className={`nav-link flex items-center ${
                              activeItem === item.title ? "active" : ""
                            }`}
                          >
                            <span
                              className={`nav-link-label text-left transition-all duration-300 ${
                                isExpanded || isPinned ? "block" : "hidden"
                              }`}
                            >
                              {item.title}
                            </span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
