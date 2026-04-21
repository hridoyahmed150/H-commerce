import type { Locale } from "@/i18n/types";

const STORAGE_KEY = "h-commerce:locale:v1";

function readLocale(): Locale {
  if (typeof window === "undefined") return "en";
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw === "bn" || raw === "en") return raw;
  } catch {
    /* ignore */
  }
  return "en";
}

let locale: Locale = "en";
const listeners = new Set<() => void>();

function notify(): void {
  for (const listener of listeners) listener();
}

export function initLocaleFromStorage(): void {
  locale = readLocale();
  if (typeof document !== "undefined") {
    document.documentElement.lang = locale === "bn" ? "bn" : "en";
  }
  notify();
}

export function getLocaleSnapshot(): Locale {
  return locale;
}

export function subscribeLocale(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function setLocale(next: Locale): void {
  locale = next;
  if (typeof window !== "undefined") {
    window.localStorage.setItem(STORAGE_KEY, next);
    document.documentElement.lang = next === "bn" ? "bn" : "en";
  }
  notify();
}
