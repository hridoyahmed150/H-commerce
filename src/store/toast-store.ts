export type ToastTone = "success" | "error" | "info";

export type Toast = {
  id: string;
  title: string;
  message?: string;
  tone: ToastTone;
};

let toasts: Toast[] = [];
const listeners = new Set<() => void>();

function notify(): void {
  for (const listener of listeners) listener();
}

export function subscribeToasts(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function getToastSnapshot(): Toast[] {
  return toasts;
}

export function pushToast(input: Omit<Toast, "id"> & { id?: string }): string {
  const id = input.id ?? crypto.randomUUID();
  toasts = [...toasts, { id, title: input.title, message: input.message, tone: input.tone }];
  notify();
  return id;
}

export function dismissToast(id: string): void {
  toasts = toasts.filter((t) => t.id !== id);
  notify();
}
