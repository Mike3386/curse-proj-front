import { useLocation } from "wouter";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

interface AuthState {
  authUser?: User;
  token?: string;
  setAuthUser: (user: User, token: string) => void;
  logOut: () => void;
}

interface User {
  id: string;
  isAdmin: boolean;
  email: string;
  username: string;
}

export const useAuthStore = create<AuthState>()(
  persist(
    immer((set, get) => ({
      authUser: undefined,
      token: undefined,
      setAuthUser: (user: User, token: string) =>
        set({ authUser: user, token }),
      logOut: () => {
        set({ authUser: undefined, token: undefined });
        window.location.replace("/");
      },
    })),
    { name: "authStore", version: 1 }
  )
);

// TODO  useAuthStore.getState().authUser
