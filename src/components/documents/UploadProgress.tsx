/**
 * UploadProgress.tsx
 * Shown during active file upload — file name, animated progress bar, percentage.
 */
import { motion, AnimatePresence } from "framer-motion";
import { X, FileUp } from "lucide-react";
import { useDocumentStore } from "@/stores/documentStore";

export const UploadProgress = () => {
  const { documents, isUploading } = useDocumentStore();
  const uploading = documents.filter((d) => d.status === "uploading");

  return (
    <AnimatePresence>
      {isUploading && uploading.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 12 }}
          transition={{ duration: 0.25 }}
          className="space-y-2"
        >
          {uploading.map((doc) => (
            <div
              key={doc.id}
              className="flex items-center gap-3 p-3.5 bg-primary/5 border border-primary/20 rounded-xl"
            >
              <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                <FileUp className="h-4 w-4 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">{doc.name}</p>
                <div className="flex items-center gap-2 mt-1">
                  <div className="flex-1 h-1.5 bg-primary/15 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-primary to-violet-500 rounded-full"
                      animate={{ width: `${doc.uploadProgress ?? 0}%` }}
                      transition={{ duration: 0.1 }}
                    />
                  </div>
                  <span className="text-xs text-primary font-medium flex-shrink-0">
                    {doc.uploadProgress ?? 0}%
                  </span>
                </div>
              </div>
            </div>
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  );
};
