import { useState } from "react";
import * as authService from "@/services/auth.service";

export default function SignupForm() {
  const [displayName, setDisplayName] = useState("Avery Chen");
  const [email, setEmail] = useState("newshopper@example.com");
  const [password, setPassword] = useState("password123");
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
          const session = await authService.signup({ displayName, email, password });
          setMessage(`Welcome ${session.user.displayName}! (demo UI)`);
        } catch (e) {
          setMessage(e instanceof Error ? e.message : "Unable to sign up");
        } finally {
          setBusy(false);
        }
      }}
    >
      <label className="field">
        <span>Display name</span>
        <input value={displayName} onChange={(e) => setDisplayName(e.target.value)} required />
      </label>
      <label className="field">
        <span>Email</span>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
      </label>
      <label className="field">
        <span>Password</span>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
      </label>
      <button className="btn btn-primary" type="submit" disabled={busy}>
        {busy ? "Creating account…" : "Create account"}
      </button>
      {message ? <p className="muted">{message}</p> : null}
    </form>
  );
}
