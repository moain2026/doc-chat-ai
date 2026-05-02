import { useState } from "react";
import { motion } from "framer-motion";
import { FileText, FileSpreadsheet, File, Trash2, RefreshCw, CheckCircle, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { useDocumentStore } from "@/stores/documentStore";
import { useUiStore } from "@/stores/uiStore";
import { formatFileSize, formatRelativeTime } from "@/utils/formatters";
import { FILE_TYPE_BG, FILE_TYPE_COLORS } from "@/utils/constants";
import type { Document } from "@/types";
import { cn } from "@/lib/utils";

const FileIcon = ({ type, className }: { type: string; className?: string }) => {
  if (type === "xlsx") return <FileSpreadsheet className={className} />;
  if (type === "pdf" || type === "docx") return <FileText className={className} />;
  return <File className={className} />;
};

interface DocumentCardProps {
  doc: Document;
  delay?: number;
}

export const DocumentCard = ({ doc, delay = 0 }: DocumentCardProps) => {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const { deleteDocument, retryDocument } = useDocumentStore();
  const { addToast } = useUiStore();

  const handleDelete = () => {
    deleteDocument(doc.id);
    addToast("success", `"${doc.name}" deleted.`);
    setConfirmOpen(false);
  };

  const statusBadge = {
    ready: <Badge variant="success" dot>Ready</Badge>,
    processing: <Badge variant="warning" dot>Processing</Badge>,
    uploading: <Badge variant="info" dot>Uploading</Badge>,
    error: <Badge variant="error" dot>Error</Badge>,
  }[doc.status];

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay, duration: 0.3, type: "spring", damping: 25 }}
        className="group relative bg-card border border-border rounded-xl p-4 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
      >
        <div className="flex items-start gap-3">
          <div className={cn("h-10 w-10 rounded-lg flex items-center justify-center flex-shrink-0", FILE_TYPE_BG[doc.fileType])}>
            <FileIcon type={doc.fileType} className={cn("h-5 w-5", FILE_TYPE_COLORS[doc.fileType])} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-foreground truncate" title={doc.name}>{doc.name}</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              {formatFileSize(doc.fileSize)} · {formatRelativeTime(doc.uploadedAt)}
            </p>
          </div>
          <button
            onClick={() => setConfirmOpen(true)}
            className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded-lg hover:bg-destructive/10 hover:text-destructive text-muted-foreground"
            aria-label="Delete document"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>

        {doc.status === "uploading" && (
          <div className="mt-3">
            <div className="flex justify-between text-xs text-muted-foreground mb-1">
              <span>Uploading…</span>
              <span>{doc.uploadProgress ?? 0}%</span>
            </div>
            <div className="h-1.5 bg-muted rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-primary to-violet-500 rounded-full"
                animate={{ width: `${doc.uploadProgress ?? 0}%` }}
                transition={{ duration: 0.1 }}
              />
            </div>
          </div>
        )}

        <div className="flex items-center justify-between mt-3">
          {statusBadge}
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            {doc.status === "processing" && (
              <Loader2 className="h-3 w-3 animate-spin" />
            )}
            {doc.status === "ready" && (
              <>
                <CheckCircle className="h-3 w-3 text-emerald-500" />
                <span>{doc.chunkCount} chunks</span>
              </>
            )}
            {doc.status === "error" && (
              <button
                onClick={() => retryDocument(doc.id)}
                className="flex items-center gap-1 text-primary hover:underline"
              >
                <RefreshCw className="h-3 w-3" /> Retry
              </button>
            )}
          </div>
        </div>
      </motion.div>

      <Modal open={confirmOpen} onClose={() => setConfirmOpen(false)} title="Delete Document">
        <p className="text-sm text-muted-foreground mb-5">
          Are you sure you want to delete <strong className="text-foreground">"{doc.name}"</strong>? This action cannot be undone.
        </p>
        <div className="flex gap-3 justify-end">
          <Button variant="ghost" onClick={() => setConfirmOpen(false)}>Cancel</Button>
          <Button variant="danger" onClick={handleDelete}>Delete</Button>
        </div>
      </Modal>
    </>
  );
};
