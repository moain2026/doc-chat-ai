/**
 * DocumentList.tsx
 * Grid/list of document cards with empty and loading states.
 * Receives already-filtered documents from parent.
 */
import { motion, AnimatePresence } from "framer-motion";
import { FileSearch, UploadCloud } from "lucide-react";
import { DocumentCard } from "./DocumentCard";
import { Skeleton } from "@/components/ui/Skeleton";
import { Button } from "@/components/ui/Button";
import { useNavigate } from "react-router-dom";
import type { Document } from "@/types";

interface DocumentListProps {
  documents: Document[];
  isLoading?: boolean;
  searchActive?: boolean;
}

export const DocumentList = ({ documents, isLoading = false, searchActive = false }: DocumentListProps) => {
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="bg-card border border-border rounded-xl p-4 space-y-3">
            <div className="flex items-center gap-3">
              <Skeleton className="h-10 w-10 rounded-lg" />
              <div className="space-y-2 flex-1">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
              </div>
            </div>
            <Skeleton className="h-3 w-1/3" />
          </div>
        ))}
      </div>
    );
  }

  if (documents.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center gap-4 py-20 text-center"
      >
        {searchActive ? (
          <>
            <div className="h-16 w-16 rounded-2xl bg-muted flex items-center justify-center">
              <FileSearch className="h-8 w-8 text-muted-foreground/50" />
            </div>
            <div>
              <p className="font-semibold text-foreground">No matching documents</p>
              <p className="text-sm text-muted-foreground mt-1">Try a different search term</p>
            </div>
          </>
        ) : (
          <>
            <div className="h-16 w-16 rounded-2xl bg-muted flex items-center justify-center">
              <UploadCloud className="h-8 w-8 text-muted-foreground/50" />
            </div>
            <div>
              <p className="font-semibold text-foreground">No documents yet</p>
              <p className="text-sm text-muted-foreground mt-1">
                Upload your first document to get started
              </p>
            </div>
            <Button
              onClick={() => navigate("/documents")}
              leftIcon={<UploadCloud className="h-4 w-4" />}
            >
              Upload Document
            </Button>
          </>
        )}
      </motion.div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <AnimatePresence mode="popLayout">
        {documents.map((doc, i) => (
          <DocumentCard key={doc.id} doc={doc} delay={i * 0.04} />
        ))}
      </AnimatePresence>
    </div>
  );
};
