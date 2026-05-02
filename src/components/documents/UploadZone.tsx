import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { motion, AnimatePresence } from "framer-motion";
import { CloudUpload } from "lucide-react";
import { useDocumentStore } from "@/stores/documentStore";
import { useUiStore } from "@/stores/uiStore";
import { ACCEPTED_FILE_TYPES, MAX_FILE_SIZE } from "@/utils/constants";
import { cn } from "@/lib/utils";

export const UploadZone = () => {
  const { uploadDocument, isUploading } = useDocumentStore();
  const { addToast } = useUiStore();

  const onDrop = useCallback(
    async (accepted: File[], rejected: { file: File; errors: { message: string }[] }[]) => {
      if (rejected.length > 0) {
        const err = rejected[0]?.errors[0]?.message ?? "Invalid file";
        addToast("error", err);
        return;
      }
      for (const file of accepted) {
        addToast("info", `Uploading ${file.name}…`);
        uploadDocument(file).then(() => {
          addToast("success", `${file.name} processed successfully!`);
        });
      }
    },
    [uploadDocument, addToast]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: ACCEPTED_FILE_TYPES,
    maxSize: MAX_FILE_SIZE,
    disabled: isUploading,
    multiple: true,
  });

  return (
    <motion.div
      {...getRootProps()}
      animate={{
        scale: isDragActive ? 1.01 : 1,
        borderColor: isDragActive ? "hsl(238 83% 66%)" : undefined,
      }}
      transition={{ duration: 0.15 }}
      className={cn(
        "relative rounded-xl border-2 border-dashed transition-colors duration-150 cursor-pointer",
        "flex flex-col items-center justify-center gap-3 p-8 min-h-[160px]",
        isDragActive
          ? "border-primary bg-primary/5 text-primary"
          : "border-border hover:border-primary/50 hover:bg-primary/3 text-muted-foreground",
        isUploading && "opacity-60 cursor-not-allowed"
      )}
    >
      <input {...getInputProps()} />
      <AnimatePresence mode="wait">
        <motion.div
          key={isDragActive ? "active" : "idle"}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="flex flex-col items-center gap-2 text-center"
        >
          <div className={cn(
            "h-12 w-12 rounded-xl flex items-center justify-center",
            isDragActive ? "bg-primary/15 text-primary" : "bg-muted text-muted-foreground"
          )}>
            <CloudUpload className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm font-medium">
              {isDragActive ? "Drop files here" : "Drag & drop files here, or click to browse"}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              PDF, DOCX, XLSX, TXT — max 10 MB
            </p>
          </div>
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
};
