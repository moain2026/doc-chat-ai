/**
 * Header.tsx
 * Top bar with mobile menu toggle, theme switch, and user dropdown.
 */
import { useState, useRef, useEffect } from "react";
import { Sun, Moon, Menu, LogOut, User as UserIcon, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useTheme } from "@/hooks/useTheme";
import { useUiStore } from "@/stores/uiStore";
import { useAuthStore } from "@/stores/authStore";
import { Avatar } from "@/components/ui/Avatar";
import { cn } from "@/lib/utils";

interface HeaderProps {
  title?: string;
  className?: string;
}

export const Header = ({ title, className }: HeaderProps) => {
  const { toggle, isDark } = useTheme();
  const { setMobileSidebarOpen } = useUiStore();
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header
      className={cn(
        "h-14 flex items-center justify-between px-4 border-b border-border bg-card/50 backdrop-blur-sm flex-shrink-0",
        className
      )}
    >
      {/* Left */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setMobileSidebarOpen(true)}
          className="md:hidden p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent/10 transition-colors"
          aria-label="Open menu"
        >
          <Menu className="h-5 w-5" />
        </button>
        {title && <h1 className="text-sm font-semibold text-foreground">{title}</h1>}
      </div>

      {/* Right */}
      <div className="flex items-center gap-1">
        {/* Theme toggle */}
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={toggle}
          className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent/10 transition-colors"
          aria-label="Toggle theme"
        >
          {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </motion.button>

        {/* User dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2 pl-1 pr-2 py-1 rounded-lg hover:bg-accent/10 transition-colors"
            aria-label="User menu"
            aria-expanded={dropdownOpen}
          >
            <Avatar name={user?.name ?? "User"} size="sm" />
            <span className="hidden sm:block text-sm font-medium text-foreground max-w-[120px] truncate">
              {user?.name}
            </span>
            <ChevronDown
              className={cn(
                "h-3.5 w-3.5 text-muted-foreground transition-transform duration-200",
                dropdownOpen && "rotate-180"
              )}
            />
          </button>

          <AnimatePresence>
            {dropdownOpen && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: -4 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -4 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 top-10 z-50 min-w-44 bg-card border border-border rounded-xl shadow-xl overflow-hidden"
              >
                {/* User info */}
                <div className="px-4 py-3 border-b border-border">
                  <p className="text-sm font-semibold text-foreground">{user?.name}</p>
                  <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
                </div>

                {/* Menu items */}
                <div className="p-1">
                  <button
                    onClick={() => { setDropdownOpen(false); }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-foreground rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <UserIcon className="h-4 w-4 text-muted-foreground" />
                    Profile
                  </button>
                  <button
                    onClick={() => { setDropdownOpen(false); handleLogout(); }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-destructive rounded-lg hover:bg-destructive/10 transition-colors"
                  >
                    <LogOut className="h-4 w-4" />
                    Sign out
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
};
