import type { User } from "firebase/auth";

export function getUserDisplayName(user: User | null): string | undefined {
  return user?.displayName ?? user?.email?.split("@")[0];
}