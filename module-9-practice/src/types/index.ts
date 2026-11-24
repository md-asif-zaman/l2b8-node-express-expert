export type TRole = "user" | "admin" | "agent";

export const USER_ROLE = {
  user: "user",
  agent: "agent",
  admin: "admin",
} as const;
