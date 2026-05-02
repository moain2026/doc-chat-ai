import { useState } from "react";
import { motion } from "framer-motion";
import { Search, SlidersHorizontal, ChevronDown } from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { UploadZone } from "@/components/documents/UploadZone";
import { UploadProgress } from "@/components/documents/UploadProgress";
import { DocumentList } from "@/components/documents/DocumentList";
import { Input } from "@/components/ui/Input";
import { useDocuments, type SortOption } from "@/hooks/useDocuments";

const SORT_LABELS: Record<SortOption, string> = {
  newest: "Newest first",
  oldest: "Oldest first",
  name: "Name A–Z",
};

export const DocumentsPage = () => {
  const { documents, search, setSearch, sort, setSort } = useDocuments();
  const [sortOpen, setSortOpen] = useState(false);

  return (
    <AppLayout title="Documents">
      <PageWrapper>
        <div className="space-y-5">
          {/* Upload zone */}
          <UploadZone />

          {/* Upload progress (shows while uploading) */}
          <UploadProgress />

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
                <span className="hidden sm:inline">{SORT_LABELS[sort]}</span>
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
          <p className="text-sm text-muted-foreground">
            {documents.length} {documents.length === 1 ? "document" : "documents"}
            {search && ` matching "${search}"`}
          </p>

          {/* Document grid via DocumentList component */}
          <DocumentList
            documents={documents}
            searchActive={search.length > 0}
          />
        </div>
      </PageWrapper>
    </AppLayout>
  );
};
