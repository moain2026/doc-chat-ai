/**
 * authStore.ts
 * Authentication state. Delegates all API logic to mockApi.ts.
 * To connect a real backend: update mockApi.ts only.
 */
import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User } from "@/types";
import { mockLogin, mockSignup } from "@/services/mockApi";

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

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (email, password) => {
        set({ isLoading: true, error: null });
        try {
          const user = await mockLogin(email, password);
          set({ user, isAuthenticated: true, isLoading: false });
        } catch (err) {
          const message = err instanceof Error ? err.message : "Login failed.";
          set({ error: message, isLoading: false });
          throw err;
        }
      },

      signup: async (email, password, name) => {
        set({ isLoading: true, error: null });
        try {
          const user = await mockSignup(email, password, name);
          set({ user, isAuthenticated: true, isLoading: false });
        } catch (err) {
          const message = err instanceof Error ? err.message : "Signup failed.";
          set({ error: message, isLoading: false });
          throw err;
        }
      },

      logout: () => set({ user: null, isAuthenticated: false, error: null }),
      clearError: () => set({ error: null }),
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({ user: state.user, isAuthenticated: state.isAuthenticated }),
    }
  )
);
