import { useEffect } from "react";
import { initLocaleFromStorage } from "@/store/locale-store";
import { initThemeFromStorage } from "@/store/theme-store";

/**
 * Applies persisted theme + locale to the document on first paint.
 */
export default function SiteBoot() {
  useEffect(() => {
    initThemeFromStorage();
    initLocaleFromStorage();
  }, []);
  return null;
}
