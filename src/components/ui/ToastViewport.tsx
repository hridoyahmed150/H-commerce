import { useEffect } from "react";
import { useToast } from "@/hooks/useToast";
import type { Toast } from "@/store/toast-store";

export default function ToastViewport() {
  const { toasts, dismiss } = useToast();

  return (
    <div className="toast-region" aria-live="polite" aria-relevant="additions text">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onDismiss={dismiss} />
      ))}
    </div>
  );
}

function ToastItem({
  toast,
  onDismiss,
}: {
  toast: Toast;
  onDismiss: (id: string) => void;
}) {
  useEffect(() => {
    const timer = window.setTimeout(() => onDismiss(toast.id), 4200);
    return () => window.clearTimeout(timer);
  }, [toast.id, onDismiss]);

  const accent =
    toast.tone === "success"
      ? "var(--success)"
      : toast.tone === "error"
        ? "var(--danger)"
        : "var(--accent)";

  return (
    <div className="toast" style={{ borderColor: "rgba(255,255,255,0.12)" }}>
      <span
        aria-hidden
        style={{
          width: 10,
          height: 10,
          borderRadius: 999,
          marginTop: 6,
          background: accent,
          flexShrink: 0,
        }}
      />
      <div style={{ flex: 1 }}>
        <strong>{toast.title}</strong>
        {toast.message ? <small>{toast.message}</small> : null}
      </div>
      <button
        type="button"
        className="btn btn-ghost"
        style={{ padding: "6px 10px", fontSize: 12 }}
        onClick={() => onDismiss(toast.id)}
        aria-label="Dismiss notification"
      >
        Close
      </button>
    </div>
  );
}
