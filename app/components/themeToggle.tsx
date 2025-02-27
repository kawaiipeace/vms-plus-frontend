"use client";

import { useEffect, useState } from "react";

export default function ThemeToggle(){
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    // Check the user's preference from localStorage or default to light mode
    const storedTheme = localStorage.getItem("theme");
    if (storedTheme === "dark") {
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
    <button onClick={toggleTheme} className="theme-toggle">
      {isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
    </button>
  );
};


