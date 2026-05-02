import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/Button";

export const NotFoundPage = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <p className="text-7xl font-bold text-primary/20 mb-4">404</p>
        <h1 className="text-xl font-bold text-foreground mb-2">Page not found</h1>
        <p className="text-muted-foreground text-sm mb-6">The page you're looking for doesn't exist.</p>
        <Button onClick={() => navigate("/dashboard")}>Go Home</Button>
      </motion.div>
    </div>
  );
};
