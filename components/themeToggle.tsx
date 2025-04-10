"use client";

import { useEffect, useState } from "react";

export default function ThemeToggle(){
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {

    const storedTheme = localStorage.getItem("theme");
    if (storedTheme === "dark-mode") {
      setIsDarkMode(true);
      document.body.classList.add("dark-mode");
    } else {
      document.body.classList.remove("dark-mode");
    }
  }, []);

  const toggleTheme = () => {
    setIsDarkMode((prev) => !prev);
    document.body.classList.toggle("dark-mode");
    // Store the user's preference in localStorage
    localStorage.setItem("theme", isDarkMode ? "light-mode" : "dark-mode");
  };

  return (
    <button onClick={toggleTheme} className={`btn btn-tertiary btn-icon border-none shadow-none toggle-mode relative theme-toggle`}>
    <i className="material-symbols-outlined">light_mode</i> 
  </button>
  );
};


