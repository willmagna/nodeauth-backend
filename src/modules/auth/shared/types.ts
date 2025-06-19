export interface RefreshTokenInput {
  refreshToken: string;
}

export interface Role {
  id: string;
  level: string;
  role: "user" | "admin";
}
