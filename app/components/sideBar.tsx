"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

export default function SideBar() {
  const [openMenus, setOpenMenus] = useState<string[]>([]);
  const [activeItem, setActiveItem] = useState<string | null>(null);

  const toggleMenu = (menuId: string) => {
    setOpenMenus((prev) =>
      prev.includes(menuId) ? prev.filter((id) => id !== menuId) : [...prev, menuId]
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
              items: ["คำขอใช้ยานพาหนะ", "อนุมัติขอคำใช้และใบอนุญาต"],
            },
            {
              id: "collapseLink3",
              icon: "traffic_jam",
              label: "จัดการคำขอใช้ยานพาหนะ",
              items: [
                "ตรวจสอบคำขอ",
                "อนุมัติใช้ยานพาหนะ",
                "ให้กุญแจและรับคืนยานพาหนะ",
              ],
            },
            {
              id: "collapseLink4",
              icon: "database",
              label: "ข้อมูลพนักงานและยานพาหนะ",
              items: [
                "ผู้ดูแลยานพาหนะ",
                "ข้อมูลพนักงานขับรถ",
                "ข้อมูลยานพาหนะ",
                "กลุ่มยานพาหนะ",
                "ข้อมูล Fleet card",
              ],
            },
          ].map((menu) => (
            <li className="nav-item" key={menu.id}>
              <button
                onClick={() => toggleMenu(menu.id)}
                className={`nav-link ${openMenus.includes(menu.id) ? "active" : ""}`}
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
                  openMenus.includes(menu.id) ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
                }`}
              >
                <ul className="nav flex-column">
                  {menu.items.map((item, index) => (
                    <li className="nav-item" key={index}>
                      <Link
                        href=""
                        className={`nav-link ${activeItem === item ? "active" : ""}`}
                        onClick={() => setActiveItem(item)}
                      >
                        {item}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </li>
          ))}
        </ul>

        <ul className="nav flex-column mt-auto sidebar-nav-top-bottom">
          <li className="nav-item">
            <Link
              href=""
              className={`nav-link toggle-mode ${activeItem === "mode" ? "active" : ""}`}
              onClick={() => setActiveItem("mode")}
            >
              <i className="material-symbols-outlined">light_mode</i>
              <span className="nav-link-label">โหมดสว่าง</span>
            </Link>
          </li>
          <li className="nav-item">
            <Link
              href=""
              className={`nav-link toggle-lock ${activeItem === "lock" ? "active" : ""}`}
              onClick={() => setActiveItem("lock")}
            >
              <i className="material-symbols-outlined">lock</i>
              <span className="nav-link-label">ล็อกหน้าจอ</span>
            </Link>
          </li>
          <li className="nav-item">
            <Link
              href=""
              className={`nav-link ${activeItem === "license" ? "active" : ""}`}
              onClick={() => setActiveItem("license")}
            >
              <i className="material-symbols-outlined">id_card</i>
              <span className="nav-link-label">ใบอนุญาตขับขี่</span>
            </Link>
          </li>
          <li className="nav-item">
            <div className="nav-link sidebar-users">
              <div className="avatar avatar-sm">
                <Image src="/assets/img/avatar.svg" width={36} height={36} alt="" />
              </div>
              <div className="sidebar-users-content">
                <div className="sidebar-users-name">นายสมคิด จงจองหอ</div>
                <div className="sidebar-users-position">ผู้ใช้งานทั่วไป</div>
              </div>
              <i className="material-symbols-outlined">logout</i>
            </div>
          </li>
        </ul>
      </div>
    </div>
  );
}
