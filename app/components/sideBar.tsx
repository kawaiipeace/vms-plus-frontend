"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

interface SidebarProps {
  menuName?: string;
}

export default function SideBar({ menuName }: SidebarProps) {
  const [openMenus, setOpenMenus] = useState<string[]>([]);
  const [activeItem, setActiveItem] = useState<string | null>(null);

  useEffect(() => {
    if (menuName) {
      setActiveItem(menuName);

      // Automatically expand the menu if the active item belongs to it
      if (["คำขอใช้ยานพาหนะ", "อนุมัติขอคำใช้และใบอนุญาต"].includes(menuName)) {
        setOpenMenus(["collapseLink2"]);
      } else if (
        ["ตรวจสอบคำขอ", "อนุมัติใช้ยานพาหนะ", "ให้กุญแจและรับคืนยานพาหนะ"].includes(menuName)
      ) {
        setOpenMenus(["collapseLink3"]);
      } else if (
        ["ผู้ดูแลยานพาหนะ", "ข้อมูลพนักงานขับรถ", "ข้อมูลยานพาหนะ", "กลุ่มยานพาหนะ", "ข้อมูล Fleet card"].includes(menuName)
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
    <div className="sidebar">
      <div className="sidebar-top">
        <Link href="http://" className="sidebar-brand">
          <Image src="/assets/img/brand.svg" width={98} height={40} alt="" />
        </Link>

        <button className="btn btn-icon btn-tertiary btn-toggle-sidebar">
          <i className="material-symbols-outlined">close</i>
        </button>
      </div>
      <div className="custom-scrollbar">
        <ul className="nav flex-column sidebar-nav-top">
          <li className="nav-item">
            <Link
              href=""
              className={`nav-link ${activeItem === "home" ? "active" : ""}`}
              onClick={() => setActiveItem("home")}
            >
              <i className="material-symbols-outlined">home</i>
              <span className="nav-link-label">หน้าหลัก</span>
            </Link>
          </li>

          {/* Dropdown Section */}
          {[
            {
              id: "collapseLink2",
              icon: "car_rental",
              label: "ระบบจองยานพาหนะ",
              items: [
                { title: "คำขอใช้ยานพาหนะ", link: "request-list" },
                { title: "อนุมัติขอคำใช้และใบอนุญาต", link: "request-list" },
              ],
            },
            {
              id: "collapseLink3",
              icon: "traffic_jam",
              label: "จัดการคำขอใช้ยานพาหนะ",
              items: [
                { title: "ตรวจสอบคำขอ", link: "request-list" },
                { title: "อนุมัติใช้ยานพาหนะ", link: "request-list" },
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
            <li className="nav-item" key={menu.id}>
              <button
                onClick={() => toggleMenu(menu.id)}
                className={`nav-link ${
                  openMenus.includes(menu.id) ? "active" : ""
                }`}
              >
                <i className="material-symbols-outlined">{menu.icon}</i>
                <span className="nav-link-label text-left">{menu.label}</span>
                <i className="ico-toggle">
                  <span className="material-symbols-outlined">
                    {openMenus.includes(menu.id)
                      ? "keyboard_arrow_up"
                      : "keyboard_arrow_down"}
                  </span>
                </i>
              </button>
              <div
                className={`transition-all duration-500 ease-in-out overflow-hidden ${
                  openMenus.includes(menu.id)
                    ? "max-h-[500px] opacity-100"
                    : "max-h-0 opacity-0"
                }`}
              >
                <ul className="nav flex-column">
                  {menu.items.map((item, index) => (
                    <li className="nav-item" key={index}>
                      <Link
                        href={item.link}
                        className={`nav-link ${
                          activeItem === item.title ? "active" : ""
                        }`}
                        onClick={() => setActiveItem(item.title)}
                      >
                        {item.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
