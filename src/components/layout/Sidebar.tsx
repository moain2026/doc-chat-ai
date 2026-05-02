import { NavLink, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard, MessageSquare, FileText, ChevronLeft,
  ChevronRight, LogOut, Bot, X
} from "lucide-react";
import { useAuthStore } from "@/stores/authStore";
import { useUiStore } from "@/stores/uiStore";
import { Avatar } from "@/components/ui/Avatar";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { to: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/chat", icon: MessageSquare, label: "Chat" },
  { to: "/documents", icon: FileText, label: "Documents" },
];

export const Sidebar = () => {
  const { user, logout } = useAuthStore();
  const { sidebarCollapsed, setSidebarCollapsed, mobileSidebarOpen, setMobileSidebarOpen } = useUiStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const SidebarContent = ({ mobile = false }: { mobile?: boolean }) => (
    <div className="flex flex-col h-full sidebar-gradient">
      {/* Logo */}
      <div className={cn("flex items-center gap-3 p-4 border-b border-sidebar-border", sidebarCollapsed && !mobile && "justify-center px-3")}>
        <div className="flex-shrink-0 h-8 w-8 bg-primary rounded-lg flex items-center justify-center shadow-lg shadow-primary/30">
          <Bot className="h-4 w-4 text-white" />
        </div>
        <AnimatePresence mode="wait">
          {(!sidebarCollapsed || mobile) && (
            <motion.div
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: "auto" }}
              exit={{ opacity: 0, width: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <span className="text-sidebar-foreground font-bold text-sm whitespace-nowrap">DocChat AI</span>
            </motion.div>
          )}
        </AnimatePresence>
        {mobile && (
          <button onClick={() => setMobileSidebarOpen(false)} className="ml-auto text-sidebar-foreground/60 hover:text-sidebar-foreground">
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 p-2 space-y-0.5">
        {NAV_ITEMS.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            onClick={() => mobile && setMobileSidebarOpen(false)}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-150",
                sidebarCollapsed && !mobile ? "justify-center px-2" : "",
                isActive
                  ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-sm shadow-primary/20"
                  : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground"
              )
            }
          >
            {({ isActive }) => (
              <>
                <Icon className={cn("h-4 w-4 flex-shrink-0", isActive ? "text-white" : "")} />
                {(!sidebarCollapsed || mobile) && (
                  <span className="truncate">{label}</span>
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* User */}
      <div className="p-2 border-t border-sidebar-border space-y-0.5">
        <button
          onClick={handleLogout}
          className={cn(
            "w-full flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-sidebar-foreground/60 hover:bg-sidebar-accent hover:text-sidebar-foreground transition-all",
            sidebarCollapsed && !mobile ? "justify-center px-2" : ""
          )}
        >
          <LogOut className="h-4 w-4 flex-shrink-0" />
          {(!sidebarCollapsed || mobile) && <span>Logout</span>}
        </button>
        <div className={cn("flex items-center gap-3 px-3 py-2", sidebarCollapsed && !mobile ? "justify-center px-2" : "")}>
          <Avatar name={user?.name ?? "User"} size="sm" online />
          {(!sidebarCollapsed || mobile) && (
            <div className="overflow-hidden">
              <p className="text-xs font-semibold text-sidebar-foreground truncate">{user?.name}</p>
              <p className="text-[10px] text-sidebar-foreground/50 truncate">{user?.email}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <motion.aside
        animate={{ width: sidebarCollapsed ? 60 : 220 }}
        transition={{ duration: 0.25, type: "spring", damping: 25, stiffness: 300 }}
        className="hidden md:flex flex-col flex-shrink-0 relative overflow-hidden h-full"
      >
        <SidebarContent />
        <button
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          className="absolute -right-3 top-20 z-10 h-6 w-6 rounded-full bg-card border border-border shadow-md flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
          aria-label="Toggle sidebar"
        >
          {sidebarCollapsed ? <ChevronRight className="h-3 w-3" /> : <ChevronLeft className="h-3 w-3" />}
        </button>
      </motion.aside>

      {/* Mobile sidebar */}
      <AnimatePresence>
        {mobileSidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-40 md:hidden"
              onClick={() => setMobileSidebarOpen(false)}
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ duration: 0.25, type: "spring", damping: 30 }}
              className="fixed left-0 top-0 bottom-0 w-64 z-50 md:hidden shadow-2xl"
            >
              <SidebarContent mobile />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
};
