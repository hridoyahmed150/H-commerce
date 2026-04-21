import { useCallback, useEffect, useSyncExternalStore } from "react";
import type { Locale } from "@/i18n/types";
import { translate } from "@/i18n/dictionary";
import {
  getLocaleSnapshot,
  initLocaleFromStorage,
  setLocale,
  subscribeLocale,
} from "@/store/locale-store";

function subscribe(listener: () => void): () => void {
  return subscribeLocale(listener);
}

function getServerSnapshot(): Locale {
  return "en";
}

export function useTranslation() {
  const locale = useSyncExternalStore(subscribe, getLocaleSnapshot, getServerSnapshot);

  useEffect(() => {
    initLocaleFromStorage();
  }, []);

  const t = useCallback(
    (key: string, vars?: Record<string, string | number>) => translate(locale, key, vars),
    [locale],
  );

  return { t, locale, setLocale };
}
