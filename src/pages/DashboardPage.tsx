import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FileText, MessageSquare, CheckCircle, Upload, Plus, ArrowRight } from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { useAuthStore } from "@/stores/authStore";
import { useDocumentStore } from "@/stores/documentStore";
import { useChatStore } from "@/stores/chatStore";
import { formatRelativeTime } from "@/utils/formatters";

/** Animated counter: counts from 0 → target on mount */
const useCounter = (target: number, duration = 800) => {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (target === 0) return;
    let start = 0;
    const step = Math.ceil(target / (duration / 16));
    const timer = setInterval(() => {
      start = Math.min(start + step, target);
      setCount(start);
      if (start >= target) clearInterval(timer);
    }, 16);
    return () => clearInterval(timer);
  }, [target, duration]);
  return count;
};

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: number;
  color: string;
  delay: number;
}

const StatCard = ({ icon, label, value, color, delay }: StatCardProps) => {
  const animated = useCounter(value);
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4, type: "spring", damping: 25 }}
    >
      <Card className="flex items-center gap-4">
        <div className={`h-12 w-12 rounded-xl flex items-center justify-center flex-shrink-0 ${color}`}>
          {icon}
        </div>
        <div>
          <p className="text-2xl font-bold text-foreground">{animated}</p>
          <p className="text-sm text-muted-foreground">{label}</p>
        </div>
      </Card>
    </motion.div>
  );
};

export const DashboardPage = () => {
  const { user } = useAuthStore();
  const { documents } = useDocumentStore();
  const { conversations, createConversation } = useChatStore();
  const navigate = useNavigate();

  const readyDocs = documents.filter((d) => d.status === "ready");
  const recentDocs = [...documents].sort(
    (a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime()
  ).slice(0, 3);
  const recentConvs = conversations.slice(0, 3);

  const handleNewChat = () => {
    const id = createConversation();
    navigate(`/chat/${id}`);
  };

  return (
    <AppLayout title="Dashboard">
      <PageWrapper>
        <div className="space-y-8">
          {/* Welcome */}
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
            <h1 className="text-2xl font-bold text-foreground">
              Welcome back, {user?.name ?? "there"} 👋
            </h1>
            <p className="text-muted-foreground mt-1">Here's an overview of your workspace.</p>
          </motion.div>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <StatCard
              icon={<FileText className="h-6 w-6 text-indigo-600" />}
              label="Total Documents"
              value={documents.length}
              color="bg-indigo-100 dark:bg-indigo-900/30"
              delay={0.05}
            />
            <StatCard
              icon={<MessageSquare className="h-6 w-6 text-violet-600" />}
              label="Conversations"
              value={conversations.length}
              color="bg-violet-100 dark:bg-violet-900/30"
              delay={0.1}
            />
            <StatCard
              icon={<CheckCircle className="h-6 w-6 text-emerald-600" />}
              label="Ready Documents"
              value={readyDocs.length}
              color="bg-emerald-100 dark:bg-emerald-900/30"
              delay={0.15}
            />
          </div>

          {/* Quick actions */}
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.4 }}>
            <h2 className="text-base font-semibold text-foreground mb-3">Quick Actions</h2>
            <div className="flex flex-wrap gap-3">
              <Button onClick={() => navigate("/documents")} leftIcon={<Upload className="h-4 w-4" />}>
                Upload Document
              </Button>
              <Button variant="secondary" onClick={handleNewChat} leftIcon={<Plus className="h-4 w-4" />}>
                Start New Chat
              </Button>
            </div>
          </motion.div>

          {/* Recent items */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Recent documents */}
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25, duration: 0.4 }}>
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-base font-semibold text-foreground">Recent Documents</h2>
                <button onClick={() => navigate("/documents")} className="text-xs text-primary hover:underline flex items-center gap-1">
                  View all <ArrowRight className="h-3 w-3" />
                </button>
              </div>
              <Card padding="none" className="divide-y divide-border overflow-hidden">
                {recentDocs.length === 0 ? (
                  <div className="px-4 py-6 text-sm text-muted-foreground text-center">No documents yet</div>
                ) : (
                  recentDocs.map((doc) => (
                    <div key={doc.id} className="flex items-center gap-3 px-4 py-3 hover:bg-muted/30 transition-colors">
                      <FileText className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">{doc.name}</p>
                        <p className="text-xs text-muted-foreground">{formatRelativeTime(doc.uploadedAt)}</p>
                      </div>
                      <Badge variant={doc.status === "ready" ? "success" : doc.status === "processing" ? "warning" : "info"}>
                        {doc.status}
                      </Badge>
                    </div>
                  ))
                )}
              </Card>
            </motion.div>

            {/* Recent conversations */}
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.4 }}>
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-base font-semibold text-foreground">Recent Chats</h2>
                <button onClick={() => navigate("/chat")} className="text-xs text-primary hover:underline flex items-center gap-1">
                  View all <ArrowRight className="h-3 w-3" />
                </button>
              </div>
              <Card padding="none" className="divide-y divide-border overflow-hidden">
                {recentConvs.length === 0 ? (
                  <div className="px-4 py-6 text-sm text-muted-foreground text-center">No conversations yet</div>
                ) : (
                  recentConvs.map((conv) => (
                    <button
                      key={conv.id}
                      onClick={() => navigate(`/chat/${conv.id}`)}
                      className="w-full flex items-center gap-3 px-4 py-3 hover:bg-muted/30 transition-colors text-left"
                    >
                      <MessageSquare className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">{conv.title}</p>
                        <p className="text-xs text-muted-foreground">{formatRelativeTime(conv.updatedAt)}</p>
                      </div>
                      <ArrowRight className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
                    </button>
                  ))
                )}
              </Card>
            </motion.div>
          </div>
        </div>
      </PageWrapper>
    </AppLayout>
  );
};
