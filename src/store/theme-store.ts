import type { ThemeMode } from "@/i18n/types";

const STORAGE_KEY = "h-commerce:theme:v1";

function readTheme(): ThemeMode {
  if (typeof window === "undefined") return "dark";
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw === "light" || raw === "dark") return raw;
  } catch {
    /* ignore */
  }
  return "dark";
}

let theme: ThemeMode = "dark";
const listeners = new Set<() => void>();

function notify(): void {
  for (const listener of listeners) listener();
}

export function applyThemeToDocument(mode: ThemeMode): void {
  if (typeof document === "undefined") return;
  document.documentElement.dataset.theme = mode;
  document.documentElement.style.colorScheme = mode === "light" ? "light" : "dark";
}

export function initThemeFromStorage(): void {
  theme = readTheme();
  applyThemeToDocument(theme);
  notify();
}

export function getThemeSnapshot(): ThemeMode {
  return theme;
}

export function subscribeTheme(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function setTheme(next: ThemeMode): void {
  theme = next;
  if (typeof window !== "undefined") {
    window.localStorage.setItem(STORAGE_KEY, next);
    applyThemeToDocument(next);
  }
  notify();
}

export function toggleThemeMode(): void {
  const current = getThemeSnapshot();
  setTheme(current === "dark" ? "light" : "dark");
}
