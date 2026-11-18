import type { TTheme } from "@/types";

const THEME_STORAGE_KEY = "big-calendar-theme";

/** Switch between light and dark and remember the choice (index.html applies it on load). */
export function setTheme(theme: TTheme) {
  try {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch {
    // storage unavailable: the theme still changes for this visit
  }
  document.documentElement.classList.remove("light", "dark");
  document.documentElement.classList.add(theme);
}
