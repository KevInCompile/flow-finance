"use client";

import MoonIcon from "@/app/icons/MoonIcon";
import SunIcon from "@/app/icons/SunIcon";

export default function ThemeToogle() {
  // const isDark = () => {
  //   if (theme === "light") return setTheme("dark");
  //   return setTheme("light");
  // };

  return (
    <button
      id="themeToggle"
      className="inline-flex text-primary transition hover:scale-125 hover:opacity-70"
    >
      <SunIcon className="text-secondary opacity-100 transition-transform dark:-rotate-90 dark:opacity-0" />
      <MoonIcon className="absolute rotate-90 opacity-0 transition-transform dark:rotate-0 dark:opacity-100 dark:text-secondary" />
      <span className="sr-only">Alternar tema</span>
    </button>
  );
}
