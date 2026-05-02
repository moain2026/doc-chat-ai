export interface User {
  id: string;
  email: string;
  name: string;
  avatarUrl?: string | null;
}

export type FileType = "pdf" | "docx" | "xlsx" | "txt";
export type DocumentStatus = "uploading" | "processing" | "ready" | "error";

export interface Document {
  id: string;
  name: string;
  fileType: FileType;
  fileSize: number;
  status: DocumentStatus;
  uploadedAt: Date;
  chunkCount: number;
  uploadProgress?: number;
}

export type MessageRole = "user" | "assistant";

export interface Source {
  documentId: string;
  documentName: string;
  snippet: string;
  relevance: number;
}

export interface Message {
  id: string;
  role: MessageRole;
  content: string;
  sources?: Source[];
  createdAt: Date;
  isStreaming?: boolean;
}

export interface Conversation {
  id: string;
  title: string;
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
}

export type ToastType = "success" | "error" | "info" | "warning";

export interface Toast {
  id: string;
  type: ToastType;
  message: string;
  duration?: number;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface SuggestedQuestion {
  icon: string;
  question: string;
}

export type Theme = "light" | "dark";
export type ButtonVariant = "primary" | "secondary" | "ghost" | "danger" | "outline";
export type ButtonSize = "sm" | "md" | "lg";
export type BadgeVariant = "success" | "warning" | "error" | "info" | "neutral";
export type AvatarSize = "sm" | "md" | "lg" | "xl";
export type SpinnerSize = "sm" | "md" | "lg";
export type CardVariant = "default" | "glass";
export type CardPadding = "none" | "sm" | "md" | "lg";
export type ModalSize = "sm" | "md" | "lg";
export type InputVariant = "default" | "error" | "success";
export type SortOption = "newest" | "oldest" | "name";
