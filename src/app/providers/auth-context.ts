import type { User } from 'firebase/auth';
import { createContext } from 'react';

export interface AuthContextType {
  user: User | null;
  authLoading: boolean;
}

export const AuthContext = createContext<AuthContextType | null>(null);