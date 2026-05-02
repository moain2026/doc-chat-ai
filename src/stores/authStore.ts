import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User } from "@/types";

interface AuthStore {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
  clearError: () => void;
}

const MOCK_USER: User = {
  id: "user-1",
  email: "demo@company.com",
  name: "Ahmed",
  avatarUrl: null,
};

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (email: string, password: string) => {
        set({ isLoading: true, error: null });
        await new Promise((r) => setTimeout(r, 1000));

        if (email === "demo@company.com" && password === "demo123") {
          set({ user: MOCK_USER, isAuthenticated: true, isLoading: false });
        } else if (email.includes("@") && password.length >= 6) {
          const name = email.split("@")[0];
          const user: User = {
            id: `user-${Date.now()}`,
            email,
            name: name.charAt(0).toUpperCase() + name.slice(1),
            avatarUrl: null,
          };
          set({ user, isAuthenticated: true, isLoading: false });
        } else {
          set({ error: "Invalid email or password.", isLoading: false });
          throw new Error("Invalid credentials");
        }
      },

      signup: async (email: string, password: string, name: string) => {
        set({ isLoading: true, error: null });
        await new Promise((r) => setTimeout(r, 1200));
        const user: User = {
          id: `user-${Date.now()}`,
          email,
          name,
          avatarUrl: null,
        };
        set({ user, isAuthenticated: true, isLoading: false });
      },

      logout: () => {
        set({ user: null, isAuthenticated: false, error: null });
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
