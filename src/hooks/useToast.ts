import { useCallback, useSyncExternalStore } from "react";
import {
  getToastSnapshot,
  subscribeToasts,
} from "@/store/toast-store";
import * as notifications from "@/services/notifications.service";

function subscribe(listener: () => void): () => void {
  return subscribeToasts(listener);
}

export function useToast() {
  const toasts = useSyncExternalStore(subscribe, getToastSnapshot, () => []);

  const success = useCallback((title: string, message?: string) => {
    notifications.notifySuccess(title, message);
  }, []);
  const error = useCallback((title: string, message?: string) => {
    notifications.notifyError(title, message);
  }, []);
  const info = useCallback((title: string, message?: string) => {
    notifications.notifyInfo(title, message);
  }, []);
  const dismiss = useCallback((id: string) => {
    notifications.dismiss(id);
  }, []);

  return { toasts, success, error, info, dismiss };
}
