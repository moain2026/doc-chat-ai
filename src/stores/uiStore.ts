import { create } from "zustand";
import type { Toast, ToastType } from "@/types";

interface UiStore {
  sidebarCollapsed: boolean;
  mobileSidebarOpen: boolean;
  toasts: Toast[];
  setSidebarCollapsed: (v: boolean) => void;
  setMobileSidebarOpen: (v: boolean) => void;
  addToast: (type: ToastType, message: string, duration?: number) => void;
  removeToast: (id: string) => void;
}

export const useUiStore = create<UiStore>((set) => ({
  sidebarCollapsed: false,
  mobileSidebarOpen: false,
  toasts: [],

  setSidebarCollapsed: (v) => set({ sidebarCollapsed: v }),
  setMobileSidebarOpen: (v) => set({ mobileSidebarOpen: v }),

  addToast: (type, message, duration = 5000) => {
    const id = `toast-${Date.now()}`;
    set((state) => ({ toasts: [...state.toasts, { id, type, message, duration }] }));
    setTimeout(() => {
      set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) }));
    }, duration);
  },

  removeToast: (id) =>
    set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) })),
}));
