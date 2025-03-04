"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSidebar } from "@/app/contexts/sidebarContext";

interface SidebarProps {
  menuName?: string;
}

export default function SideBar({ menuName }: SidebarProps) {
  const [openMenus, setOpenMenus] = useState<string[]>([]);
  const [activeItem, setActiveItem] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const { isPinned, setIsPinned } = useSidebar();

  useEffect(() => {
    if (menuName) {
      setActiveItem(menuName);
      if (["คำขอใช้ยานพาหนะ", "อนุมัติขอคำใช้และใบอนุญาต"].includes(menuName)) {
        setOpenMenus(["collapseLink2"]);
      } else if (
        [
          "ตรวจสอบคำขอ",
          "อนุมัติใช้ยานพาหนะ",
          "ให้กุญแจและรับคืนยานพาหนะ",
        ].includes(menuName)
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
  }, [menuName]);

  const toggleMenu = (menuId: string) => {
    setOpenMenus((prev) =>
      prev.includes(menuId)
        ? prev.filter((id) => id !== menuId)
        : [...prev, menuId]
    );
  };

  return (
    <div
      className={`sidebar z-10 transition-all duration-300 ease-in-out bg-white shadow-lg fixed h-full ${
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
              href="/"
              className={`nav-link flex items-center ${
                activeItem === "home" ? "active" : ""
              }`}
            >
              <i className="material-symbols-outlined">home</i>
              <span
                className={`nav-link-label transition-all duration-300 ${
                  isExpanded || isPinned ? "opacity-100 ml-2" : "opacity-0 w-0"
                }`}
              >
                หน้าหลัก
              </span>
            </Link>
          </li>

          {/* Dropdown Menus */}
          {[
            {
              id: "collapseLink2",
              icon: "car_rental",
              label: "ระบบจองยานพาหนะ",
              items: [
                { title: "คำขอใช้ยานพาหนะ", link: "request-list" },
                { title: "อนุมัติขอคำใช้และใบอนุญาต", link: "first-approver" },
              ],
            },
            {
              id: "collapseLink3",
              icon: "traffic_jam",
              label: "จัดการคำขอใช้ยานพาหนะ",
              items: [
                { title: "ตรวจสอบคำขอ", link: "../vehicle-booking/admin" },
                { title: "อนุมัติใช้ยานพาหนะ", link: "../vehicle-booking/final-approver" },
                { title: "ให้กุญแจและรับคืนยานพาหนะ", link: "request-list" },
              ],
            },
            {
              id: "collapseLink4",
              icon: "database",
              label: "ข้อมูลพนักงานและยานพาหนะ",
              items: [
                { title: "ผู้ดูแลยานพาหนะ", link: "request-list" },
                { title: "ข้อมูลพนักงานขับรถ", link: "request-list" },
                { title: "ข้อมูลยานพาหนะ", link: "request-list" },
                { title: "กลุ่มยานพาหนะ", link: "request-list" },
                { title: "ข้อมูล Fleet card", link: "request-list" },
              ],
            },
          ].map((menu) => (
            <li
              className={`nav-item  ${!isExpanded && "h-[40px] w-[40px]"}`}
              key={menu.id}
            >
              <button
                onClick={() => toggleMenu(menu.id)}
                className={`nav-link flex items-center justify-between ${
                  !isExpanded && "h-[40px] w-[40px]"
                } ${openMenus.includes(menu.id) ? "active" : ""}`}
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
          ))}
        </ul>
      </div>
    </div>
  );
}
