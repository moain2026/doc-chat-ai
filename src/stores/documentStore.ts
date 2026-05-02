/**
 * documentStore.ts
 * Document state. Delegates upload/processing simulation to mockApi.ts.
 */
import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Document, FileType } from "@/types";
import { mockProcessDocument } from "@/services/mockApi";

interface DocumentStore {
  documents: Document[];
  isUploading: boolean;
  uploadProgress: number;
  uploadDocument: (file: File) => Promise<void>;
  deleteDocument: (id: string) => void;
  retryDocument: (id: string) => void;
}

const INITIAL_DOCUMENTS: Document[] = [
  {
    id: "doc-1",
    name: "Company HR Policy 2025.pdf",
    fileType: "pdf",
    fileSize: 2457600,
    status: "ready",
    uploadedAt: new Date(Date.now() - 86400000 * 2),
    chunkCount: 42,
  },
  {
    id: "doc-2",
    name: "Employee Handbook.docx",
    fileType: "docx",
    fileSize: 1048576,
    status: "ready",
    uploadedAt: new Date(Date.now() - 86400000),
    chunkCount: 28,
  },
  {
    id: "doc-3",
    name: "Salary Scale Q1 2025.xlsx",
    fileType: "xlsx",
    fileSize: 524288,
    status: "ready",
    uploadedAt: new Date(Date.now() - 3600000 * 5),
    chunkCount: 15,
  },
];

const getFileType = (file: File): FileType => {
  const ext = file.name.split(".").pop()?.toLowerCase();
  if (ext === "pdf") return "pdf";
  if (ext === "docx" || ext === "doc") return "docx";
  if (ext === "xlsx" || ext === "xls") return "xlsx";
  return "txt";
};

export const useDocumentStore = create<DocumentStore>()(
  persist(
    (set, get) => ({
      documents: INITIAL_DOCUMENTS,
      isUploading: false,
      uploadProgress: 0,

      uploadDocument: async (file: File) => {
        const id = `doc-${Date.now()}`;
        const newDoc: Document = {
          id,
          name: file.name,
          fileType: getFileType(file),
          fileSize: file.size,
          status: "uploading",
          uploadedAt: new Date(),
          chunkCount: 0,
          uploadProgress: 0,
        };

        set((state) => ({
          documents: [newDoc, ...state.documents],
          isUploading: true,
          uploadProgress: 0,
        }));

        // Simulate upload progress 0→100% over 2 seconds
        for (let p = 0; p <= 100; p += 5) {
          await new Promise((r) => setTimeout(r, 100));
          set((state) => ({
            uploadProgress: p,
            documents: state.documents.map((d) =>
              d.id === id ? { ...d, uploadProgress: p } : d
            ),
          }));
        }

        set((state) => ({
          isUploading: false,
          documents: state.documents.map((d) =>
            d.id === id ? { ...d, status: "processing", uploadProgress: 100 } : d
          ),
        }));

        // Delegate processing simulation to mockApi
        const chunkCount = await mockProcessDocument();

        set((state) => ({
          documents: state.documents.map((d) =>
            d.id === id ? { ...d, status: "ready", chunkCount } : d
          ),
        }));
      },

      deleteDocument: (id) => {
        set((state) => ({ documents: state.documents.filter((d) => d.id !== id) }));
      },

      retryDocument: async (id) => {
        const doc = get().documents.find((d) => d.id === id);
        if (!doc) return;
        set((state) => ({
          documents: state.documents.map((d) =>
            d.id === id ? { ...d, status: "processing", uploadProgress: 100 } : d
          ),
        }));
        const chunkCount = await mockProcessDocument();
        set((state) => ({
          documents: state.documents.map((d) =>
            d.id === id ? { ...d, status: "ready", chunkCount } : d
          ),
        }));
      },
    }),
    {
      name: "document-storage",
      partialize: (state) => ({ documents: state.documents }),
    }
  )
);
