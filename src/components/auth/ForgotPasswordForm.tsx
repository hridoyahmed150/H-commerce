import { useState } from "react";
import * as authService from "@/services/auth.service";

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  return (
    <form
      className="stack-md"
      onSubmit={async (event) => {
        event.preventDefault();
        setBusy(true);
        setMessage(null);
        try {
          await authService.requestPasswordReset({ email });
          setMessage("If that email exists in our system, you will receive reset instructions.");
        } catch (e) {
          setMessage(e instanceof Error ? e.message : "Unable to send reset email");
        } finally {
          setBusy(false);
        }
      }}
    >
      <label className="field">
        <span>Email</span>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
      </label>
      <button className="btn btn-primary" type="submit" disabled={busy}>
        {busy ? "Sending…" : "Send reset link"}
      </button>
      {message ? <p className="muted">{message}</p> : null}
    </form>
  );
}
