import { useCallback, useEffect, useSyncExternalStore } from "react";
import type { ThemeMode } from "@/i18n/types";
import {
  getThemeSnapshot,
  initThemeFromStorage,
  setTheme,
  subscribeTheme,
  toggleThemeMode,
} from "@/store/theme-store";

function subscribe(listener: () => void): () => void {
  return subscribeTheme(listener);
}

function getServerSnapshot(): ThemeMode {
  return "dark";
}

export function useThemeMode() {
  const theme = useSyncExternalStore(subscribe, getThemeSnapshot, getServerSnapshot);

  useEffect(() => {
    initThemeFromStorage();
  }, []);

  return {
    theme,
    setTheme,
    toggleTheme: useCallback(() => {
      toggleThemeMode();
    }, []),
  };
}
