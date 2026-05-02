import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Search, SlidersHorizontal, ChevronDown } from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { UploadZone } from "@/components/documents/UploadZone";
import { DocumentCard } from "@/components/documents/DocumentCard";
import { Skeleton } from "@/components/ui/Skeleton";
import { useDocumentStore } from "@/stores/documentStore";
import { Input } from "@/components/ui/Input";
import type { Document } from "@/types";

type SortOption = "newest" | "oldest" | "name";

const SORT_LABELS: Record<SortOption, string> = {
  newest: "Newest first",
  oldest: "Oldest first",
  name: "Name A–Z",
};

export const DocumentsPage = () => {
  const { documents } = useDocumentStore();
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<SortOption>("newest");
  const [sortOpen, setSortOpen] = useState(false);

  const filtered = useMemo(() => {
    let list = [...documents];
    if (search) list = list.filter((d) => d.name.toLowerCase().includes(search.toLowerCase()));
    list.sort((a, b) => {
      if (sort === "newest") return new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime();
      if (sort === "oldest") return new Date(a.uploadedAt).getTime() - new Date(b.uploadedAt).getTime();
      return a.name.localeCompare(b.name);
    });
    return list;
  }, [documents, search, sort]);

  return (
    <AppLayout title="Documents">
      <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        {/* Upload zone */}
        <UploadZone />

        {/* Filters */}
        <div className="flex items-center gap-3">
          <div className="flex-1">
            <Input
              placeholder="Search documents…"
              leftIcon={<Search className="h-4 w-4" />}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="relative">
            <button
              onClick={() => setSortOpen(!sortOpen)}
              className="flex items-center gap-2 h-10 px-3 rounded-lg border border-border bg-card text-sm text-foreground hover:bg-muted/50 transition-colors"
            >
              <SlidersHorizontal className="h-4 w-4 text-muted-foreground" />
              <span>{SORT_LABELS[sort]}</span>
              <ChevronDown className="h-3 w-3 text-muted-foreground" />
            </button>

            {sortOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setSortOpen(false)} />
                <div className="absolute right-0 top-11 z-20 bg-card border border-border rounded-xl shadow-xl overflow-hidden min-w-40">
                  {(Object.keys(SORT_LABELS) as SortOption[]).map((opt) => (
                    <button
                      key={opt}
                      onClick={() => { setSort(opt); setSortOpen(false); }}
                      className={`w-full text-left px-4 py-2.5 text-sm transition-colors hover:bg-muted/50 ${sort === opt ? "text-primary font-medium" : "text-foreground"}`}
                    >
                      {SORT_LABELS[opt]}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="text-sm text-muted-foreground">
          {filtered.length} {filtered.length === 1 ? "document" : "documents"}
          {search && ` matching "${search}"`}
        </div>

        {/* Grid */}
        {filtered.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center gap-3 py-16 text-center"
          >
            <div className="h-16 w-16 rounded-2xl bg-muted flex items-center justify-center text-2xl">📄</div>
            <div>
              <p className="font-medium text-foreground">
                {search ? "No matching documents" : "No documents yet"}
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                {search ? "Try a different search term" : "Upload a file above to get started"}
              </p>
            </div>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((doc, i) => (
              <DocumentCard key={doc.id} doc={doc} delay={i * 0.04} />
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
};
