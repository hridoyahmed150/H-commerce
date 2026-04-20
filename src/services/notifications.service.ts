import {
  dismissToast,
  getToastSnapshot,
  pushToast,
  type ToastTone,
} from "@/store/toast-store";

export function notifySuccess(title: string, message?: string): string {
  return pushToast({ title, message, tone: "success" });
}

export function notifyError(title: string, message?: string): string {
  return pushToast({ title, message, tone: "error" });
}

export function notifyInfo(title: string, message?: string): string {
  return pushToast({ title, message, tone: "info" });
}

export function notify(
  title: string,
  options?: { message?: string; tone?: ToastTone },
): string {
  return pushToast({
    title,
    message: options?.message,
    tone: options?.tone ?? "info",
  });
}

export function dismiss(id: string): void {
  dismissToast(id);
}

export function listToasts() {
  return getToastSnapshot();
}
