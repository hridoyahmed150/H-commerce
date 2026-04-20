import { useState } from "react";
import * as authService from "@/services/auth.service";

export default function LoginForm() {
  const [email, setEmail] = useState("hello@example.com");
  const [password, setPassword] = useState("password");
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
          const session = await authService.login({ email, password });
          setMessage(`Signed in as ${session.user.displayName} (demo UI)`);
        } catch (e) {
          setMessage(e instanceof Error ? e.message : "Unable to sign in");
        } finally {
          setBusy(false);
        }
      }}
    >
      <label className="field">
        <span>Email</span>
        <input
          type="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </label>
      <label className="field">
        <span>Password</span>
        <input
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </label>
      <button className="btn btn-primary" type="submit" disabled={busy}>
        {busy ? "Signing in…" : "Sign in"}
      </button>
      {message ? <p className="muted">{message}</p> : null}
      <p className="muted" style={{ margin: 0, fontSize: 14 }}>
        Auth is handled through <code>auth.service</code> (mock users in <code>/src/data/users.json</code>) so a real provider can plug in later.
      </p>
    </form>
  );
}
