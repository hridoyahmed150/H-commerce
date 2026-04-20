export type UserId = string;

export type User = {
  id: UserId;
  email: string;
  displayName: string;
  avatarUrl?: string;
};

export type AuthCredentials = {
  email: string;
  password: string;
};

export type SignUpPayload = AuthCredentials & {
  displayName: string;
};

export type PasswordResetRequest = {
  email: string;
};

export type AuthSession = {
  user: User;
  accessToken: string;
  expiresAt: string;
};
