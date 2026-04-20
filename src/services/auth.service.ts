import type {
  AuthCredentials,
  AuthSession,
  PasswordResetRequest,
  SignUpPayload,
} from "@/types/user.types";
import type { MockUserRecord } from "@/types/mock-user.types";
import usersData from "@/data/users.json";

const USERS: MockUserRecord[] = usersData as MockUserRecord[];

function sessionFrom(record: MockUserRecord): AuthSession {
  return {
    user: {
      id: record.id,
      email: record.email,
      displayName: record.displayName,
    },
    accessToken: `mock-token-${record.id}`,
    expiresAt: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
  };
}

/** Validates against `src/data/users.json` (demo only). */
export async function login(credentials: AuthCredentials): Promise<AuthSession> {
  const record = USERS.find(
    (u) => u.email === credentials.email && u.password === credentials.password,
  );
  if (!record) {
    throw new Error("Invalid email or password");
  }
  return sessionFrom(record);
}

/** Creates a demo session; does not persist new users (Phase 1 UI only). */
export async function signup(payload: SignUpPayload): Promise<AuthSession> {
  if (USERS.some((u) => u.email === payload.email)) {
    throw new Error("That email is already registered (mock data)");
  }
  return {
    user: {
      id: `mock-${crypto.randomUUID()}`,
      email: payload.email,
      displayName: payload.displayName,
    },
    accessToken: "mock-token-signup",
    expiresAt: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
  };
}

/** UI-only acknowledgement — no outbound requests in Phase 1. */
export async function requestPasswordReset(_payload: PasswordResetRequest): Promise<void> {
  return;
}
