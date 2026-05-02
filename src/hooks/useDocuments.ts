/**
 * useDocuments.ts
 * Convenient hook for document management with derived state.
 */
import { useMemo, useState, useCallback } from "react";
import { useDocumentStore } from "@/stores/documentStore";
import { useDebounce } from "./useDebounce";

export type SortOption = "newest" | "oldest" | "name";

export function useDocuments() {
  const { documents, isUploading, uploadDocument, deleteDocument, retryDocument } =
    useDocumentStore();

  const [searchRaw, setSearch] = useState("");
  const [sort, setSort] = useState<SortOption>("newest");

  // 300 ms debounce as required
  const search = useDebounce(searchRaw, 300);

  const filtered = useMemo(() => {
    let list = [...documents];
    if (search) {
      list = list.filter((d) => d.name.toLowerCase().includes(search.toLowerCase()));
    }
    list.sort((a, b) => {
      if (sort === "newest") return new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime();
      if (sort === "oldest") return new Date(a.uploadedAt).getTime() - new Date(b.uploadedAt).getTime();
      return a.name.localeCompare(b.name);
    });
    return list;
  }, [documents, search, sort]);

  const readyCount = useMemo(() => documents.filter((d) => d.status === "ready").length, [documents]);

  const handleUpload = useCallback(
    (file: File) => uploadDocument(file),
    [uploadDocument]
  );

  return {
    documents: filtered,
    allDocuments: documents,
    isUploading,
    readyCount,
    search: searchRaw,
    setSearch,
    sort,
    setSort,
    uploadDocument: handleUpload,
    deleteDocument,
    retryDocument,
  };
}
