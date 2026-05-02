import { AnimatePresence, motion } from "framer-motion";
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from "lucide-react";
import { useUiStore } from "@/stores/uiStore";
import { cn } from "@/lib/utils";
import type { ToastType } from "@/types";

const toastConfig: Record<ToastType, { icon: React.ReactNode; cls: string }> = {
  success: {
    icon: <CheckCircle className="h-4 w-4 flex-shrink-0" />,
    cls: "bg-emerald-50 border-emerald-200 text-emerald-800 dark:bg-emerald-900/30 dark:border-emerald-800/50 dark:text-emerald-300",
  },
  error: {
    icon: <AlertCircle className="h-4 w-4 flex-shrink-0" />,
    cls: "bg-red-50 border-red-200 text-red-800 dark:bg-red-900/30 dark:border-red-800/50 dark:text-red-300",
  },
  info: {
    icon: <Info className="h-4 w-4 flex-shrink-0" />,
    cls: "bg-blue-50 border-blue-200 text-blue-800 dark:bg-blue-900/30 dark:border-blue-800/50 dark:text-blue-300",
  },
  warning: {
    icon: <AlertTriangle className="h-4 w-4 flex-shrink-0" />,
    cls: "bg-amber-50 border-amber-200 text-amber-800 dark:bg-amber-900/30 dark:border-amber-800/50 dark:text-amber-300",
  },
};

export const ToastProvider = () => {
  const { toasts, removeToast } = useUiStore();

  return (
    <div className="fixed top-4 right-4 z-[100] flex flex-col gap-2 w-80 max-w-[calc(100vw-2rem)]">
      <AnimatePresence mode="popLayout">
        {toasts.map((toast) => {
          const config = toastConfig[toast.type];
          return (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, x: 60, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 60, scale: 0.95 }}
              transition={{ duration: 0.25, type: "spring", damping: 25 }}
              className={cn(
                "flex items-start gap-3 p-3.5 rounded-xl border shadow-lg text-sm font-medium",
                config.cls
              )}
            >
              {config.icon}
              <span className="flex-1 leading-snug">{toast.message}</span>
              <button
                onClick={() => removeToast(toast.id)}
                className="opacity-60 hover:opacity-100 transition-opacity flex-shrink-0"
                aria-label="Close"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};
