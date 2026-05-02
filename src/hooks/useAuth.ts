/**
 * useAuth.ts
 * Convenient hook wrapping the auth store with derived state.
 */
import { useAuthStore } from "@/stores/authStore";

export function useAuth() {
  const { user, isAuthenticated, isLoading, error, login, signup, logout, clearError } =
    useAuthStore();

  return {
    user,
    isAuthenticated,
    isLoading,
    error,
    login,
    signup,
    logout,
    clearError,
    /** True when a user object is fully loaded */
    isReady: !isLoading,
    /** Initials of the current user for Avatar fallback */
    initials: user
      ? user.name
          .split(" ")
          .map((w) => w[0])
          .join("")
          .toUpperCase()
          .slice(0, 2)
      : "?",
  };
}
